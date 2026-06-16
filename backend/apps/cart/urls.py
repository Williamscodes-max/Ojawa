from django.urls import path
from .views import (
    CartDetailView,
    CartItemAddView,
    CartItemUpdateView,
    CartItemDeleteView,
    CartClearView,
)

urlpatterns = [
    path('', CartDetailView.as_view(), name='cart-detail'),
    path('add/', CartItemAddView.as_view(), name='cart-add'),
    path('items/<int:pk>/update/', CartItemUpdateView.as_view(), name='cart-item-update'),
    path('items/<int:pk>/delete/', CartItemDeleteView.as_view(), name='cart-item-delete'),
    path('clear/', CartClearView.as_view(), name='cart-clear'),
]