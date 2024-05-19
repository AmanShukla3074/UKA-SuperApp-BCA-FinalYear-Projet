from django.contrib import admin
from django.contrib.auth.models import Group
from .models import Order_M

from django.contrib.auth.models import Permission

class OrderPermissions:
    VIEW_ORDERS_PERMISSION = 'view_orders'
    CHANGE_ORDER_STATUS_PERMISSION = 'change_order_status'

    @classmethod
    def create_permissions(cls):
        view_orders_permission, _ = Permission.objects.get_or_create(
            codename=cls.VIEW_ORDERS_PERMISSION,
            name='Can view orders',
        )
        change_order_status_permission, _ = Permission.objects.get_or_create(
            codename=cls.CHANGE_ORDER_STATUS_PERMISSION,
            name='Can change order status',
        )
