
import os
import uuid
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Order, OrderItem
from .serializers import OrderSerializer, CheckoutSerializer
from .paystack import initialize_payment, verify_payment
from apps.cart.models import Cart



class CheckoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            return Response(
                {'error': 'Your cart is empty.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not cart.items.exists():
            return Response(
                {'error': 'Your cart is empty.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create the order
        order = Order.objects.create(
            user=request.user,
            total_price=cart.total_price,
            **serializer.validated_data
        )

        # Create order items snapshot
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                product_name=item.product.name,
                product_price=item.product.effective_price,
                quantity=item.quantity,
            )

        # Clear cart
        cart.items.all().delete()

        # Initialize Paystack payment
        reference = f"OJA-{uuid.uuid4().hex[:10].upper()}"
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5173')
        callback_url = f"{frontend_url}/payment/verify?reference={reference}"

        payment = initialize_payment(
            email=order.email,
            amount=float(order.total_price),
            reference=reference,
            callback_url=callback_url,
        )
        

        if payment.get('status'):
            order.payment_reference = reference
            order.save()
            return Response({
                'order': OrderSerializer(order).data,
                'payment_url': payment['data']['authorization_url'],
                'reference': reference,
            }, status=status.HTTP_201_CREATED)

        return Response(
            {'error': 'Payment initialization failed.'},
            status=status.HTTP_400_BAD_REQUEST
        )


class VerifyPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        reference = request.data.get('reference')
        if not reference:
            return Response(
                {'error': 'Reference is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verify with Paystack
        result = verify_payment(reference)

        if result.get('status') and result['data']['status'] == 'success':
            try:
                order = Order.objects.get(
                    payment_reference=reference,
                    user=request.user
                )
                order.is_paid = True
                order.status = 'processing'
                order.save()
                return Response({
                    'message': 'Payment verified successfully!',
                    'order': OrderSerializer(order).data,
                })
            except Order.DoesNotExist:
                return Response(
                    {'error': 'Order not found.'},
                    status=status.HTTP_404_NOT_FOUND
                )

        return Response(
            {'error': 'Payment verification failed.'},
            status=status.HTTP_400_BAD_REQUEST
        )


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(
            user=self.request.user
        ).prefetch_related('items')


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)