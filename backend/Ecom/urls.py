from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
   # Products
   path('products/', Product_List.as_view(), name='product-list'),
   path('products/<int:pk>/', Product_List.as_view(), name='product-detail'),

   path('search/', ProductSearchView.as_view(), name='product_search'),
   
   path('categories/', CategoriesList.as_view({'get': 'list', 'post': 'create'}), name='playlist-list'),
   path('categories/<int:pk>/', CategoriesList.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='playlist-detail'),
   
   path('color-master/', Product_Color_MList.as_view({'get': 'list', 'post': 'create'}), name='playlist-list'),
   path('color-master/<int:pk>/', Product_Color_MList.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='playlist-detail'),
   
   path('product-size-master/', Product_Size_MList.as_view({'get': 'list', 'post': 'create'}), name='playlist-list'),
   path('product-size-master/<int:pk>/', Product_Size_MList.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='playlist-detail'),
   
   path('product-size/', Product_SizeList.as_view(), name='playlist-list'),
   path('product-size/<int:pk>/', Product_SizeList.as_view(), name='playlist-detail'),
   
   path('product-imgs/', Product_ImgList.as_view({'get': 'list', 'post': 'create'}), name='playlist-list'),
   path('product-imgs/<int:pk>/', Product_ImgList.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='playlist-detail'),
   
   path('status/', Status_MList.as_view({'get': 'list', 'post': 'create'}), name='playlist-list'),
   path('status/<int:pk>/', Status_MList.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='playlist-detail'),
   
   path('offer/', Offer_MList.as_view({'get': 'list', 'post': 'create'}), name='playlist-list'),
   path('offer/<int:pk>/', Offer_MList.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='playlist-detail'),
   
   path('payment_mode/', Payment_ModeList.as_view({'get': 'list', 'post': 'create'}), name='playlist-list'),
   path('payment_mode/<int:pk>/', Payment_ModeList.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='playlist-detail'),
   
   path('RateReview/', Product_RateReview_MList.as_view(), name='Product_RateReview-list'),
   # path('payment_mode/<int:pk>/', Payment_ModeList.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='playlist-detail'),
   
   path('cart/',CartDetailView.as_view(),name='cart-list'),
   path('cart1/<int:cart_item_id>/',CartDetailsDeleteView.as_view(),name='cart-details-delete'),

   # path('cart/', CartDetailView.as_view(), name='cart-detail'),


   path('order/', OrderCreateView.as_view(), name='order-create'),
   path('order/<int:order_id>/', OrderCreateView.as_view(), name='order_detail'), 

   path('ECcomplaints/', ComplaintView.as_view(), name='ECcomplaints'),

   path('cancel-order/<int:order_id>/', CancelOrderView.as_view(), name='cancel_order'),

   path('wishlist/', Wishlist_MList.as_view(), name='wishlist-list'),
   path('wishlist/<int:wishlist_id>/', Wishlist_MList.as_view(), name='wishlist-detail'),
]
if settings.DEBUG:
      urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
      # urlpatterns += static(settings.PRODUCT_MEDIA_URL, document_root=settings.PRODUCT_MEDIA_ROOT)
      urlpatterns += static(settings.PROFILE_MEDIA_URL, document_root=settings.PROFILE_MEDIA_ROOT)