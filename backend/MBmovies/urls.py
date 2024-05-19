from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
   # path('movies/', MovieList.as_view(), name='movie-list'),
   # path('movies/<int:pk>/', MovieDetail.as_view(), name='product-detail'),
   # path('director/', DirectorList.as_view(), name='director-list'),

   path('movies/', MovieList.as_view({'get': 'list', 'post': 'create'}), name='playlist-list'),
   path('movies/<int:pk>/', MovieList.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='playlist-detail'),

   path('movies/search/', MovieSearchView.as_view(), name='movie_search'),

   path('movies-imgs/', MovieImgList.as_view({'get': 'list', 'post': 'create'}), name='playlist-list'),
   path('movies-imgs/<int:pk>/', MovieImgList.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='playlist-detail'),

   path('director-master/', Movie_Director_MList.as_view({'get': 'list', 'post': 'create'}), name='playlist-list'),
   path('director-master/<int:pk>/', Movie_Director_MList.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='playlist-detail'),

   path('movies-director/', Movie_DirectorList.as_view({'get': 'list', 'post': 'create'}), name='playlist-list'),
   path('movies-director/<int:pk>/', Movie_DirectorList.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='playlist-detail'),

   path('producer-master/', Movie_Producer_MList.as_view({'get': 'list', 'post': 'create'}), name='playlist-list'),
   path('producer-master/<int:pk>/', Movie_Producer_MList.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='playlist-detail'),

   path('movies-producer/', Movie_ProducerList.as_view({'get': 'list', 'post': 'create'}), name='playlist-list'),
   path('movies-producer/<int:pk>/', Movie_ProducerList.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='playlist-detail'),

   path('cast-master/', Movie_Cast_MList.as_view({'get': 'list', 'post': 'create'}), name='playlist-list'),
   path('cast-master/<int:pk>/', Movie_Cast_MList.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='playlist-detail'),

   path('movies-cast/', Movie_CastList.as_view({'get': 'list', 'post': 'create'}), name='playlist-list'),
   path('movies-cast/<int:pk>/', Movie_CastList.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='playlist-detail'),

   path('genre-master/', Movie_Genre_MList.as_view({'get': 'list', 'post': 'create'}), name='playlist-list'),
   path('genre-master/<int:pk>/', Movie_Genre_MList.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='playlist-detail'),

   path('movies-genre/', Movie_GenreList.as_view({'get': 'list', 'post': 'create'}), name='playlist-list'),
   path('movies-genre/<int:pk>/', Movie_GenreList.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='playlist-detail'),

   path('language-master/', Movie_Language_MList.as_view({'get': 'list', 'post': 'create'}), name='playlist-list'),
   path('language-master/<int:pk>/', Movie_Language_MList.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='playlist-detail'),

   path('movies-language/', Movie_LanguageList.as_view({'get': 'list', 'post': 'create'}), name='playlist-list'),
   path('movies-language/<int:pk>/', Movie_LanguageList.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='playlist-detail'),

   path('type-master/', Movie_Type_MList.as_view({'get': 'list', 'post': 'create'}), name='playlist-list'),
   path('type-master/<int:pk>/', Movie_Type_MList.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='playlist-detail'),

   path('movies-type/', Movie_TypeList.as_view({'get': 'list', 'post': 'create'}), name='playlist-list'),
   path('movies-type/<int:pk>/', Movie_TypeList.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='playlist-detail'),

]
if settings.DEBUG:
    
    urlpatterns += static(settings.MOVIESIMGS_MEDIA_URL, document_root=settings.MOVIESIMGS_MEDIA_ROOT)
    urlpatterns += static(settings.MOVIESDIRECTORSIMGS_MEDIA_URL, document_root=settings.MOVIESDIRECTORSIMGS_MEDIA_ROOT)
    urlpatterns += static(settings.MOVIESPRODUCERIMGS_MEDIA_URL, document_root=settings.MOVIESPRODUCERIMGS_MEDIA_ROOT)
    urlpatterns += static(settings.MOVIESCASTIMGS_MEDIA_URL, document_root=settings.MOVIESCASTIMGS_MEDIA_ROOT)
    urlpatterns += static(settings.MOVIESGENREIMGS_MEDIA_URL, document_root=settings.MOVIESGENREIMGS_MEDIA_ROOT)
    urlpatterns += static(settings.MOVIESLANGUAGEIMGS_MEDIA_URL, document_root=settings.MOVIESLANGUAGEIMGS_MEDIA_ROOT)