from rest_framework import serializers
from .models import Order, OrderItem


from apps.products.serializers import ProductSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    total_price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'product_name',
            'product_price', 'quantity', 'total_price'
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'status', 'full_name', 'email',
            'phone', 'address', 'city', 'state',
            'is_paid', 'payment_reference',
            'total_price', 'items', 'created_at'
        ]
        read_only_fields = [
            'status', 'is_paid', 'payment_reference', 'total_price'
        ]


class CheckoutSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)
    address = serializers.CharField()
    city = serializers.CharField(max_length=100)
    state = serializers.CharField(max_length=100)