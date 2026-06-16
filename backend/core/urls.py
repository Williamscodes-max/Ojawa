from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

admin.site.site_header = "Ọjà-Wá Admin"
admin.site.site_title = "Ọjà-Wá"

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('apps.users.urls')),
    path('api/v1/products/', include('apps.products.urls')),
    path('api/v1/cart/', include('apps.cart.urls')),
    path('api/v1/orders/', include('apps.orders.urls')),
    path('api/v1/', include('apps.reviews.urls')),
    path('api/v1/wishlist/', include('apps.wishlist.urls')),  
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)