from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group
from .models import User, Roles, Status, State, City, Address
from django.utils import timezone


class StateAdmin(admin.ModelAdmin):
    list_display = ("StateID", "State")
class CityAdmin(admin.ModelAdmin):
    list_display = ("CityID", "City", "State")

class CustomUserAdmin(BaseUserAdmin):
    model = User
    list_display = ('mobile_no', 'email', 'first_name', 'last_name', 'is_staff')  # Adjusted to use 'mobile_no' instead of 'username'
    fieldsets = (
        (None, {'fields': ('mobile_no', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'dob', 'Profile_Picture', 'Gender', 'Role', 'Status', 'groups')}),  # Changed 'profile_picture' to 'Profile_Picture' and 'gender' to 'Gender'
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('mobile_no', 'password1', 'password2', 'is_staff', 'is_superuser'),
        }),
    )
    search_fields = ('mobile_no', 'email', 'first_name', 'last_name')
    ordering = ('mobile_no',)  # Use 'mobile_no' instead of 'username'
    
class StatusAdmin(admin.ModelAdmin):
    list_display = ("StatusID", "Status_Name")
class RoleAdmin(admin.ModelAdmin):
    list_display = ("RoleID", "Role_Name")

class AddressAdmin(admin.ModelAdmin):
    list_display = ("AddressID" , "House_Add" , "Street_Add" , "Landmark" , "Pincode", "City", "User")

admin.site.register(User, CustomUserAdmin)

# Unregister the default Group model
# admin.site.unregister(Group)
admin.site.register(Roles,RoleAdmin)
admin.site.register(Status,StatusAdmin)
admin.site.register(State,StateAdmin)
admin.site.register(City,CityAdmin)
admin.site.register(Address,AddressAdmin)


# from django.contrib import admin
# from .models import *
# from django.utils import timezone
# # Register your models here.

# class StateAdmin(admin.ModelAdmin):
#     list_display = ("StateID", "State")
# class CityAdmin(admin.ModelAdmin):
#     list_display = ("CityID", "City", "State")
    
# class UserAdmin(admin.ModelAdmin):#to display fields in user panel properly 
#     list_display = ("id","mobile_no","first_name","last_name","email","is_active","is_mobile_verified","days_since_joined")
#     #list_display = ["id","email", "name", "is_admin"]
#     fieldsets = [
#         ('User Credentials', {"fields": ("email","mobile_no","otp", "password")}),
#         ("Personal info", {"fields": ("first_name","last_name","dob","date_joined","Profile_Picture","Gender")}),
#         ("Permissions & Roles", {"fields": ("is_active", "is_staff","is_mobile_verified","Role","Status")}),
#     ]
#     def days_since_joined(self,User):#show diff between date_of_creation and today 
#         diff=timezone.now() - User.date_joined
#         return diff.days
    
# class StatusAdmin(admin.ModelAdmin):
#     list_display = ("StatusID", "Status_Name")
# class RoleAdmin(admin.ModelAdmin):
#     list_display = ("RoleID", "Role_Name")

# class AddressAdmin(admin.ModelAdmin):
#     list_display = ("AddressID" , "House_Add" , "Street_Add" , "Landmark" , "Pincode", "City", "User")


# admin.site.register(User, UserAdmin)
# admin.site.register(Roles,RoleAdmin)
# admin.site.register(Status,StatusAdmin)
# admin.site.register(State,StateAdmin)
# admin.site.register(City,CityAdmin)
# admin.site.register(Address,AddressAdmin)