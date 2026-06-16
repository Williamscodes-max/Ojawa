from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError
from .models import Review
from .serializers import ReviewSerializer
from apps.products.models import Product


class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        product_slug = self.kwargs['slug']
        return Review.objects.filter(
            product__slug=product_slug
        ).select_related('user')

    def perform_create(self, serializer):
        product_slug = self.kwargs['slug']
        try:
            product = Product.objects.get(slug=product_slug)
        except Product.DoesNotExist:
            raise ValidationError('Product not found.')

        if Review.objects.filter(
            product=product,
            user=self.request.user
        ).exists():
            raise ValidationError('You have already reviewed this product.')

        serializer.save(user=self.request.user, product=product)


class ReviewDeleteView(generics.DestroyAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user)