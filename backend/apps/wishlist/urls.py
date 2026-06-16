from django.urls import path
from .views import WishlistView, WishlistToggleView, WishlistCheckView

urlpatterns = [
    path('', WishlistView.as_view(), name='wishlist'),
    path('toggle/<int:product_id>/', WishlistToggleView.as_view(), name='wishlist-toggle'),
    path('check/<int:product_id>/', WishlistCheckView.as_view(), name='wishlist-check'),
]