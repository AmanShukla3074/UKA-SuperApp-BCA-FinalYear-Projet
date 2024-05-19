from django.urls import path
from .views import *
from .adminviews import *
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
   # path('showtime/', ShowtimeList.as_view(), name='movie-list'),
   path('theater/', TheaterList.as_view(), name='movie-list'),
   path('theater/<int:pk>/', TheaterList.as_view(), name='product-detail'),

   path('screen/', ScreenList.as_view(), name='seat-list'),
   path('screen/<int:pk>/', ScreenList.as_view(), name='seat-list'),

   path('seats-type/', SeatTypeList.as_view({'get': 'list', 'post': 'create'}), name='playlist-list'),
   path('seats-type/<int:pk>/', SeatTypeList.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='playlist-detail'),

   path('seats/', SeatList.as_view(), name='seat-list'),
   path('seats/<int:pk>/', SeatList.as_view(), name='seat-list'),

   path('showtimes/', ShowtimeList.as_view(), name='showtime-list'),
   path('showtimes/<int:pk>/', ShowtimeList.as_view(), name='showtime-list'),
   # path('showtimes/<int:showtime_id>/seats/', SeatInShowtimeList.as_view(), name='seats-in-showtime-list'),
   #Seat In Showtime
   path('showtimes/<int:showtime_id>/seats/', SeatInShowtimeList.as_view({'get': 'list', 'post': 'create'}), name='seatinshowtime-list'),
   path('showtimes/<int:showtime_id>/seats/<int:pk>/', SeatInShowtimeList.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='seatinshowtime-detail'),
   
   path('seat-price/', SeatPriceList.as_view({'get': 'list', 'post': 'create'}), name='seatinshowtime-list'),
   path('seat-price/<int:pk>/', SeatPriceList.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='seatinshowtime-detail'),
   
   
   path('payment-mode/', Payment_ModeList.as_view({'get': 'list', 'post': 'create'}), name='seatinshowtime-list'),
   path('payment-mode/<int:pk>/', Payment_ModeList.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='seatinshowtime-detail'),
   

   path('complaint/', ComplaintView.as_view(), name='complaint-list'),
   path('complaint/<int:pk>/', ComplaintView.as_view(), name='complaint-list'),

   path('bookings/', BookingView.as_view(), name='booking-list-create'),
   path('bookings/<int:pk>/', BookingView.as_view(), name='booking-retrieve-update-destroy'),
   
   path('booking-seats/', BookingSeatView.as_view(), name='booking-seat-list-create'),
   path('booking-seats/<int:pk>/', BookingSeatView.as_view(), name='booking-seat-retrieve-update-destroy'),


   path('booking/', AdminBookingViewSet.as_view({'get': 'list', 'post': 'create'}), name='playlist-list'),
   path('booking/<int:pk>/', AdminBookingViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='playlist-detail'),


   path('rate_movie/', Rate_MBGetList.as_view({'get': 'list', 'post': 'create'}), name='Rate_MBList'),
   path('rate_movie/<int:pk>/', Rate_MBGetList.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='Rate_MB-detail'),

   path('rate_movie_get/', Rate_MBList.as_view({'get': 'list', 'post': 'create'}), name='Rate_MBList'),
   path('rate_movie_get/<int:pk>/', Rate_MBList.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='Rate_MB-detail'),




   path('booking-seats/', BookingSeatView.as_view(), name='booking-seat-list-create'),
   path('booking-seats/<int:pk>/', BookingSeatView.as_view(), name='booking-seat-retrieve-update-destroy'),

]