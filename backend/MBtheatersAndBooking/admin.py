from django.contrib import admin
from .models import *

# admin.site.register(Theater_M)
# admin.site.register(Screen_M)
admin.site.register(SeatType)
# admin.site.register(Seat_M)
# admin.site.register(ShowTime_M)
admin.site.register(SeatInShowtime)
# admin.site.register(SeatPrice)
admin.site.register(Payment_Mode)
admin.site.register(Booking_M)
admin.site.register(Booking_Seat_M)
# admin.site.register(Complaint_MB) 
admin.site.register(Rate_MB) 


class TheaterAdmin(admin.ModelAdmin):
    list_display = ('T_ID', 'T_Name', 'T_Flat_Add', 'T_Street_Add', 'City_ID', 'T_Pin', 'T_Open_Date', 'T_No_Of_Screen', 'Theater_Manager_ID')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.groups.filter(name='Theater Manager').exists():
            # Filter theaters based on the logged-in Theater Manager
            qs = qs.filter(Theater_Manager_ID=request.user)
        return qs

admin.site.register(Theater_M, TheaterAdmin)

class ScreenAdmin(admin.ModelAdmin):
    list_display = ('Screen_ID', 'Screen_Name', 'T_ID', 'Screen_Total_Seats')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.groups.filter(name='Theater Manager').exists() and not request.user.is_superuser:
            # Filter screens based on the logged-in Theater Manager's theater
            qs = qs.filter(T_ID__Theater_Manager_ID=request.user)
        return qs
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if request.user.groups.filter(name='Theater Manager').exists() and not request.user.is_superuser and db_field.name == "T_ID":
            # Filter theaters based on the logged-in Theater Manager's theater
            kwargs["queryset"] = Theater_M.objects.filter(Theater_Manager_ID=request.user)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

admin.site.register(Screen_M, ScreenAdmin)

class SeatAdmin(admin.ModelAdmin):
    list_display = ('Seat_ID', 'Seat_Row_Num', 'Seat_Col_Num', 'Seat_Row_AlphaBet', 'Screen_ID', 'Seat_Type')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.groups.filter(name='Theater Manager').exists() and not request.user.is_superuser:
            # Filter seats based on the logged-in Theater Manager's theater
            qs = qs.filter(Screen_ID__T_ID__Theater_Manager_ID=request.user)
        return qs

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if request.user.groups.filter(name='Theater Manager').exists() and not request.user.is_superuser and db_field.name == "Screen_ID":
            # Filter screens based on the logged-in Theater Manager's theater
            kwargs["queryset"] = Screen_M.objects.filter(T_ID__Theater_Manager_ID=request.user)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
    
admin.site.register(Seat_M, SeatAdmin)


class ShowTimeAdmin(admin.ModelAdmin):
    list_display = ('ShowTime_ID', 'M_ID', 'M_Language', 'M_Type', 'Screen_M', 'StartTime', 'Date')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.groups.filter(name='Theater Manager').exists() and not request.user.is_superuser:
            # Filter showtimes based on the logged-in Theater Manager's theater
            qs = qs.filter(Screen_M__T_ID__Theater_Manager_ID=request.user)
        return qs
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if request.user.groups.filter(name='Theater Manager').exists() and not request.user.is_superuser and db_field.name == "Screen_M":
            # Filter screens based on the logged-in Theater Manager's theater
            kwargs["queryset"] = Screen_M.objects.filter(T_ID__Theater_Manager_ID=request.user)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

admin.site.register(ShowTime_M, ShowTimeAdmin)


class SeatPriceAdmin(admin.ModelAdmin):
    list_display = ('SeatPrice_ID', 'Seat_type_id', 'ShowTime_ID', 'Price')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.groups.filter(name='Theater Manager').exists() and not request.user.is_superuser:
            # Filter seat prices based on the logged-in Theater Manager's theater
            qs = qs.filter(ShowTime_ID__Screen_M__T_ID__Theater_Manager_ID=request.user)
        return qs
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if request.user.groups.filter(name='Theater Manager').exists() and not request.user.is_superuser and db_field.name == "ShowTime_ID":
            # Filter showtimes based on the logged-in Theater Manager's theater
            kwargs["queryset"] = ShowTime_M.objects.filter(Screen_M__T_ID__Theater_Manager_ID=request.user)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

admin.site.register(SeatPrice, SeatPriceAdmin)

# class ScreenAdmin(admin.ModelAdmin):
#     list_display = ('Screen_ID', 'Screen_Name', 'T_ID', 'Screen_Total_Seats')

#     def get_queryset(self, request):
#         qs = super().get_queryset(request)
#         if request.user.groups.filter(name='Theater Manager').exists():
#             # Filter screens based on the logged-in Theater Manager's theater
#             qs = qs.filter(T_ID__Theater_Manager_ID=request.user)
#         return qs
    
#     def formfield_for_foreignkey(self, db_field, request, **kwargs):
#         if db_field.name == "T_ID":
#             # Filter theaters based on the logged-in Theater Manager's theater
#             kwargs["queryset"] = Theater_M.objects.filter(Theater_Manager_ID=request.user)
#         return super().formfield_for_foreignkey(db_field, request, **kwargs)


# admin.site.register(Screen_M, ScreenAdmin)

# class SeatAdmin(admin.ModelAdmin):
#     list_display = ('Seat_ID', 'Seat_Row_Num', 'Seat_Col_Num', 'Seat_Row_AlphaBet', 'Screen_ID', 'Seat_Type')

#     def get_queryset(self, request):
#         qs = super().get_queryset(request)
#         if request.user.groups.filter(name='Theater Manager').exists():
#             # Filter seats based on the logged-in Theater Manager's theater
#             qs = qs.filter(Screen_ID__T_ID__Theater_Manager_ID=request.user)
#         return qs

#     def formfield_for_foreignkey(self, db_field, request, **kwargs):
#         if db_field.name == "Screen_ID":
#             # Filter screens based on the logged-in Theater Manager's theater
#             kwargs["queryset"] = Screen_M.objects.filter(T_ID__Theater_Manager_ID=request.user)
#         return super().formfield_for_foreignkey(db_field, request, **kwargs)
    
# admin.site.register(Seat_M, SeatAdmin)


# class ShowTimeAdmin(admin.ModelAdmin):
#     list_display = ('ShowTime_ID', 'M_ID', 'M_Language', 'M_Type', 'Screen_M', 'StartTime', 'Date')

#     def get_queryset(self, request):
#         qs = super().get_queryset(request)
#         if request.user.groups.filter(name='Theater Manager').exists():
#             # Filter showtimes based on the logged-in Theater Manager's theater
#             qs = qs.filter(Screen_M__T_ID__Theater_Manager_ID=request.user)
#         return qs
    
#     def formfield_for_foreignkey(self, db_field, request, **kwargs):
#         if db_field.name == "Screen_M":
#             # Filter screens based on the logged-in Theater Manager's theater
#             kwargs["queryset"] = Screen_M.objects.filter(T_ID__Theater_Manager_ID=request.user)
#         return super().formfield_for_foreignkey(db_field, request, **kwargs)

# admin.site.register(ShowTime_M, ShowTimeAdmin)


# class SeatPriceAdmin(admin.ModelAdmin):
#     list_display = ('SeatPrice_ID', 'Seat_type_id', 'ShowTime_ID', 'Price')

#     def get_queryset(self, request):
#         qs = super().get_queryset(request)
#         if request.user.groups.filter(name='Theater Manager').exists():
#             # Filter seat prices based on the logged-in Theater Manager's theater
#             qs = qs.filter(ShowTime_ID__Screen_M__T_ID__Theater_Manager_ID=request.user)
#         return qs
    
#     def formfield_for_foreignkey(self, db_field, request, **kwargs):
#         if db_field.name == "ShowTime_ID":
#             # Filter showtimes based on the logged-in Theater Manager's theater
#             kwargs["queryset"] = ShowTime_M.objects.filter(Screen_M__T_ID__Theater_Manager_ID=request.user)
#         return super().formfield_for_foreignkey(db_field, request, **kwargs)

# admin.site.register(SeatPrice, SeatPriceAdmin)


class ComplaintAdmin(admin.ModelAdmin):
    list_display = ('Complaint_ID', 'User_ID', 'M_ID', 'T_ID', 'Complaint_Desc', 'Complaint_Date')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.groups.filter(name='Theater Manager').exists():
            # Filter complaints based on the logged-in Theater Manager's theater or associated movie
            qs = qs.filter(T_ID__Theater_Manager_ID=request.user) 
        return qs

admin.site.register(Complaint_MB, ComplaintAdmin)