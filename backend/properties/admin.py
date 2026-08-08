from django.contrib import admin
from .models import Property, PropertyPurchase, PropertyFavorite

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ['title', 'owner', 'price', 'location', 'property_type', 'is_sold', 'is_featured', 'created_at']
    list_filter = ['property_type', 'is_sold', 'is_featured', 'created_at']
    search_fields = ['title', 'location', 'owner__email']
    list_editable = ['is_sold', 'is_featured']  # ✅ now both are present in list_display (and not first)
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'owner')
        }),
        ('Property Details', {
            'fields': ('property_type', 'price', 'location', 'bedrooms', 'bathrooms', 'area')
        }),
        ('Media', {
            'fields': ('image',)
        }),
        ('Status', {
            'fields': ('is_sold', 'is_featured')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(PropertyPurchase)
class PropertyPurchaseAdmin(admin.ModelAdmin):
    list_display = ['property', 'buyer', 'purchase_price', 'status', 'purchase_date']
    list_filter = ['status', 'purchase_date']
    search_fields = ['property__title', 'buyer__email']
    readonly_fields = ['purchase_date']

@admin.register(PropertyFavorite)
class PropertyFavoriteAdmin(admin.ModelAdmin):
    list_display = ['user', 'property', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__email', 'property__title']
