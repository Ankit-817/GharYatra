from django.urls import path
from . import views

urlpatterns = [
    path('', views.PropertyListCreateView.as_view(), name='property-list-create'),
    path('<int:pk>/', views.PropertyDetailView.as_view(), name='property-detail'),
    path('my-properties/', views.my_properties, name='my-properties'),
    path('<int:property_id>/purchase/', views.purchase_property, name='purchase-property'),
    path('my-purchases/', views.my_purchases, name='my-purchases'),
    path('<int:property_id>/favorite/', views.toggle_favorite, name='toggle-favorite'),
    path('my-favorites/', views.my_favorites, name='my-favorites'),
]
