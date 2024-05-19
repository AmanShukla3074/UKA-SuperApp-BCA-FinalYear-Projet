
from django.urls import path,include
from .views import *
from account.views import * #----------- date : 3/01/2024------------
from django.contrib.auth import views as auth_views #----------------------date : 5/01/2024 for reset_password , * related to password
from django.core.mail.backends.smtp import EmailBackend #------------date : 5/01/2024 for reset_password
from django.conf import settings
from rest_framework_simplejwt.views import (
    TokenRefreshView
)#date : 7/01/2024


urlpatterns = [

    path('register/',RegisterView.as_view(),name='register'),
    path('register/address/',AddressView.as_view(),name='register-address'),
    path('register/address/<int:pk>/',AddressView.as_view(),name='register-address'),
    path('login/',LoginView.as_view(),name='login'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),#date : 7/01/2024
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),#date : 7/01/2024
    path('verify_otp/',verify_otp),
    path('resend_otp/',resend_otp),

    
    #-------------- date : 5/01/2024 ---- reset password -----
    path('reset_password/',auth_views.PasswordResetView.as_view(),name='reset_password'), #Submit email form  //PasswordResetView.as_view()
    path('password_reset_done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'), #Emal sent success message //PasswordResetDoneView.as_view()
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'), #link to password reset form in email //PasswordResetConfirmView.as_view()
    path('reset_password_complete/',auth_views.PasswordResetCompleteView.as_view(),name='password_reset_complete'), #password successfully changed message //PasswordResetCompleteView.as_view()

    path('change_password/', ChangePasswordView.as_view(), name='change_password'),
    path('forget_password/', ForgetPasswordView.as_view(), name='forget_password'),

    path('send-otp/', send_otp_to_mobile_view, name='send-otp'),
    path('verify-otp/', verify_otp_view_register, name='verify_otp'),

    path('state/', StateList.as_view({'get': 'list', 'post': 'create'}), name='StateList'),
    path('state/<int:pk>/', StateList.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='StateList'),
   
    path('city/', CityList.as_view(), name='CityList'),
    path('city/<int:pk>/', CityList.as_view(), name='CityList'),
   
    # path('city/', CityList.as_view({'get': 'list', 'post': 'create'}), name='CityList'),
    # path('city/<int:pk>/', CityList.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='CityList'),
   


]
from django.conf.urls.static import static
if settings.DEBUG:
    urlpatterns += static(settings.PROFILE_MEDIA_URL,document_root=settings.PROFILE_MEDIA_ROOT)