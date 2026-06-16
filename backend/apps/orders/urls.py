from django.urls import path
from .views import (
    CheckoutView,
    OrderListView,
    OrderDetailView,
    VerifyPaymentView,
)

urlpatterns = [
    path('', OrderListView.as_view(), name='order-list'),
    path('<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('verify-payment/', VerifyPaymentView.as_view(), name='verify-payment'),
]