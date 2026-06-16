from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet, FeaturedProductsView, NewArrivalsView

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('', ProductViewSet, basename='product')

urlpatterns = [
    path('featured/', FeaturedProductsView.as_view(), name='featured-products'),
    path('new-arrivals/', NewArrivalsView.as_view(), name='new-arrivals'),
    path('', include(router.urls)),
]