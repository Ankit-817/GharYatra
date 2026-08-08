from rest_framework import serializers
from .models import Property, PropertyPurchase, PropertyFavorite
from accounts.serializers import UserSerializer

class PropertySerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    image = serializers.ImageField(required=False)
    
    class Meta:
        model = Property
        fields = [
            'id', 'title', 'description', 'price', 'location', 'property_type',
            'bedrooms', 'bathrooms', 'area', 'image', 'owner', 'is_sold',
            'is_featured', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)

class PropertyListSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.full_name', read_only=True)
    
    class Meta:
        model = Property
        fields = [
            'id', 'title', 'price', 'location', 'property_type',
            'bedrooms', 'bathrooms', 'area', 'image', 'owner_name',
            'is_sold', 'is_featured', 'created_at'
        ]

class PropertyPurchaseSerializer(serializers.ModelSerializer):
    property = PropertySerializer(read_only=True)
    buyer = UserSerializer(read_only=True)
    
    class Meta:
        model = PropertyPurchase
        fields = ['id', 'property', 'buyer', 'purchase_date', 'purchase_price', 'status', 'notes']
        read_only_fields = ['id', 'buyer', 'purchase_date']

class PropertyFavoriteSerializer(serializers.ModelSerializer):
    property = PropertyListSerializer(read_only=True)
    
    class Meta:
        model = PropertyFavorite
        fields = ['id', 'property', 'created_at']
        read_only_fields = ['id', 'created_at']
