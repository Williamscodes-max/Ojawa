from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product_name', 'product_price', 'quantity']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'status', 'is_paid', 'total_price', 'created_at']
    list_filter = ['status', 'is_paid']
    search_fields = ['user__email', 'full_name']
    inlines = [OrderItemInline]