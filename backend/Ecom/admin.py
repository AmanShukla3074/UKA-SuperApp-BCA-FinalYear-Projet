from django.contrib import admin
from .models import *

admin.site.register(Product_M)
admin.site.register(Categories)
admin.site.register(Product_Color_M)
admin.site.register(Product_Size_M)
admin.site.register(Product_Size)
admin.site.register(Product_Img)
admin.site.register(Product_RateReview_M)
admin.site.register(Status_M)
admin.site.register(Offer_M)
admin.site.register(Cart_M)
admin.site.register(Cart_Details)
# admin.site.register(Order_M)
admin.site.register(Order_Details)
# admin.site.register(Payment_M)
# admin.site.register(Refund)
admin.site.register(Reminder_M)
admin.site.register(Wishlist_M)
admin.site.register(Complaint_EC)

from django.contrib import admin
from .models import Order_M


class OrderAdmin(admin.ModelAdmin):
    list_display = ('OrderID', 'OrderDate', 'Total', 'User_ID', 'Status_ID')

    def get_readonly_fields(self, request, obj=None):
        readonly_fields = super().get_readonly_fields(request, obj)
        if request.user.groups.filter(name='Delivery Person').exists():
            # Make all fields readonly except 'Status_ID' for delivery persons
            readonly_fields = [field.name for field in self.model._meta.fields if field.name != 'Status_ID']
        return readonly_fields

    def has_change_permission(self, request, obj=None):
        if obj and request.user.groups.filter(name='Delivery Person').exists():
            # Allow delivery persons to change status only if the status is Processing or Delivered
            return obj.Status_ID_id in [2, 5] and request.user.has_perm('Ecom.change_order_status')
            # return obj.Status_ID_id in [2, 4] and request.user.has_perm('Ecom.change_order_status')
        return super().has_change_permission(request, obj)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.groups.filter(name='Delivery Person').exists():
            qs = qs.filter(Status_ID__in=[2, 5])  # Filter orders with status IDs 2 (Processing) or 4 (Delivered)
            # qs = qs.filter(Status_ID__in=[2, 4])  # Filter orders with status IDs 2 (Processing) or 4 (Delivered)
        return qs

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "Status_ID":
            # Filter the queryset to include only the desired status IDs
            if request.user.groups.filter(name='Delivery Person').exists():
                kwargs["queryset"] = Status_M.objects.filter(Status_ID__in=[2, 5])
            else:
                kwargs["queryset"] = Status_M.objects.all()  # Show all status options for superadmins
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

admin.site.register(Order_M, OrderAdmin)



# class OrderAdmin(admin.ModelAdmin):
#     list_display = ('OrderID', 'OrderDate', 'Total', 'User_ID', 'Status_ID')

#     def get_readonly_fields(self, request, obj=None):
#         readonly_fields = super().get_readonly_fields(request, obj)
#         if request.user.groups.filter(name='Delivery Person').exists():
#             # Make all fields readonly except 'Status_ID' for delivery persons
#             readonly_fields = [field.name for field in self.model._meta.fields if field.name != 'Status_ID']
#         return readonly_fields

#     def has_change_permission(self, request, obj=None):
#         if obj and request.user.groups.filter(name='Delivery Person').exists():
#             # Allow delivery persons to change status only if the status is Processing or Postponed
#             return obj.Status_ID_id in [2, 5] and request.user.has_perm('Ecom.change_order_status')
#         return super().has_change_permission(request, obj)

#     def get_queryset(self, request):
#         qs = super().get_queryset(request)
#         if request.user.groups.filter(name='Delivery Person').exists():
#             qs = qs.filter(Status_ID__in=[2, 5])  # Filter orders with status IDs 2 (Processing) or 5 (Postponed)
#         return qs

#     def formfield_for_foreignkey(self, db_field, request, **kwargs):
#         if db_field.name == "Status_ID":
#             # Filter the queryset to include only the desired status IDs
#             kwargs["queryset"] = Status_M.objects.filter(Status_ID__in=[2, 4])
#         return super().formfield_for_foreignkey(db_field, request, **kwargs)

# admin.site.register(Order_M, OrderAdmin)





# class OrderAdmin(admin.ModelAdmin):
#     list_display = ('OrderID', 'OrderDate', 'Total', 'User_ID', 'Status_ID')

#     def get_readonly_fields(self, request, obj=None):
#         readonly_fields = super().get_readonly_fields(request, obj)
#         if request.user.groups.filter(name='Delivery Person').exists():
#             # Make all fields readonly except 'Status_ID' for delivery persons
#             readonly_fields = [field.name for field in self.model._meta.fields if field.name != 'Status_ID']
#         return readonly_fields

#     def has_change_permission(self, request, obj=None):
#         if obj and request.user.groups.filter(name='Delivery Person').exists():
#             # Allow delivery persons to change status only if the status is Processing or Postponed
#             return obj.Status_ID_id in [2, 5] and request.user.has_perm('Ecom.change_order_status')
#         return super().has_change_permission(request, obj)

#     def formfield_for_foreignkey(self, db_field, request, **kwargs):
#         if db_field.name == "Status_ID":
#             # Filter the queryset to include only the desired status IDs
#             kwargs["queryset"] = Status_M.objects.filter(Status_ID__in=[2, 5])
#         return super().formfield_for_foreignkey(db_field, request, **kwargs)

# admin.site.register(Order_M, OrderAdmin)


# class OrderAdmin(admin.ModelAdmin):
#     list_display = ('OrderID', 'OrderDate', 'Total', 'User_ID', 'Status_ID')

#     def get_readonly_fields(self, request, obj=None):
#         readonly_fields = super().get_readonly_fields(request, obj)
#         if request.user.groups.filter(name='Delivery Person').exists():
#             # Make all fields readonly except 'Status_ID' for delivery persons
#             readonly_fields = [field.name for field in self.model._meta.fields if field.name != 'Status_ID']
#         return readonly_fields

#     def has_change_permission(self, request, obj=None):
#         if obj and request.user.groups.filter(name='Delivery Person').exists():
#             # Allow delivery persons to change status only if the status is Processing or Postponed
#             return obj.Status_ID_id in [2, 5] and request.user.has_perm('Ecom.change_order_status')
#         return super().has_change_permission(request, obj)

# admin.site.register(Order_M, OrderAdmin)





# class OrderAdmin(admin.ModelAdmin):
#     list_display = ('OrderID', 'OrderDate', 'Total', 'User_ID', 'Status_ID')

#     def get_queryset(self, request):
#         qs = super().get_queryset(request)
#         if request.user.groups.filter(name='Delivery Person').exists():
#             qs = qs.filter(Status_ID__in=[2, 5])  # Status IDs for "Processing" and "Postponed"
#         return qs

#     def has_change_permission(self, request, obj=None):
#         if obj and request.user.groups.filter(name='Delivery Person').exists():
#             # Allow delivery persons to change status only if the status is Processing or Postponed
#             return obj.Status_ID_id in [2, 5] and request.user.has_perm('Ecom.change_order_status')
#         return super().has_change_permission(request, obj)

# admin.site.register(Order_M, OrderAdmin)
