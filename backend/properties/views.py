from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import json
from .models import Property, PropertyPurchase, PropertyFavorite
from .serializers import (
    PropertySerializer, PropertyListSerializer, 
    PropertyPurchaseSerializer, PropertyFavoriteSerializer
)
from .filters import PropertyFilter

class PropertyListCreateView(generics.ListCreateAPIView):
    queryset = Property.objects.filter(is_sold=False)
    filterset_class = PropertyFilter
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['price', 'created_at', 'area']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return PropertyListSerializer
        return PropertySerializer
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Price range filtering
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
            
        return queryset

class PropertyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def perform_update(self, serializer):
        # Only allow owner to update
        if serializer.instance.owner != self.request.user:
            raise PermissionError("You can only update your own properties")
        serializer.save()
    
    def perform_destroy(self, instance):
        # Only allow owner to delete
        if instance.owner != self.request.user:
            raise PermissionError("You can only delete your own properties")
        instance.delete()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_properties(request):
    properties = Property.objects.filter(owner=request.user)
    serializer = PropertyListSerializer(properties, many=True)
    return Response(serializer.data)

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def purchase_property(request, property_id):
    """
    Handle property purchase requests
    """
    print(f"Purchase request received for property {property_id}")
    print(f"User: {request.user}")
    print(f"Request data: {request.data}")
    
    try:
        # Get the property object
        try:
            property_obj = Property.objects.get(id=property_id)
            print(f"Property found: {property_obj.title}")
        except Property.DoesNotExist:
            print(f"Property {property_id} not found")
            return Response({
                'error': 'Property not found',
                'message': 'The property you are trying to purchase does not exist.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check if property is already sold
        if property_obj.is_sold:
            print(f"Property {property_id} is already sold")
            return Response({
                'error': 'Property is already sold',
                'message': 'This property has been sold to another buyer.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user is trying to buy their own property
        if property_obj.owner == request.user:
            print(f"User trying to buy own property")
            return Response({
                'error': 'Cannot purchase own property',
                'message': 'You cannot purchase your own property.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user already made a purchase request for this property
        existing_purchase = PropertyPurchase.objects.filter(
            property=property_obj, 
            buyer=request.user
        ).first()
        
        if existing_purchase:
            print(f"Purchase request already exists: {existing_purchase.id}")
            return Response({
                'error': 'Purchase request already exists',
                'message': 'You have already made a purchase request for this property.',
                'purchase_id': existing_purchase.id,
                'status': existing_purchase.status
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get notes from request data (optional)
        notes = request.data.get('notes', '') if request.data else ''
        
        print(f"Creating purchase for property {property_id}")
        
        # Create purchase request
        purchase = PropertyPurchase.objects.create(
            property=property_obj,
            buyer=request.user,
            purchase_price=property_obj.price,
            notes=notes,
            status='completed'  # Mark as completed immediately for demo
        )
        
        print(f"Purchase created: {purchase.id}")
        
        # Mark property as sold
        property_obj.is_sold = True
        property_obj.save()
        
        print(f"Property {property_id} marked as sold")
        
        # Serialize the purchase data
        serializer = PropertyPurchaseSerializer(purchase)
        
        return Response({
            'success': True,
            'message': 'Purchase completed successfully! The property has been sold to you.',
            'purchase': serializer.data,
            'property_status': 'sold'
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        # Log the error for debugging
        print(f"Purchase error for property {property_id}: {str(e)}")
        import traceback
        traceback.print_exc()
        
        return Response({
            'error': 'Purchase failed',
            'message': f'An unexpected error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_purchases(request):
    purchases = PropertyPurchase.objects.filter(buyer=request.user)
    serializer = PropertyPurchaseSerializer(purchases, many=True)
    return Response(serializer.data)

@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def toggle_favorite(request, property_id):
    try:
        property_obj = get_object_or_404(Property, id=property_id)
    except Property.DoesNotExist:
        return Response({'error': 'Property not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'POST':
        favorite, created = PropertyFavorite.objects.get_or_create(
            user=request.user,
            property=property_obj
        )
        
        if created:
            return Response({'message': 'Property added to favorites'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'Property already in favorites'}, status=status.HTTP_200_OK)
    
    elif request.method == 'DELETE':
        try:
            favorite = PropertyFavorite.objects.get(
                user=request.user,
                property=property_obj
            )
            favorite.delete()
            return Response({'message': 'Property removed from favorites'}, status=status.HTTP_200_OK)
        except PropertyFavorite.DoesNotExist:
            return Response({'error': 'Property not in favorites'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_favorites(request):
    favorites = PropertyFavorite.objects.filter(user=request.user)
    serializer = PropertyFavoriteSerializer(favorites, many=True)
    return Response(serializer.data)
