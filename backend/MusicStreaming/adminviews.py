from django.shortcuts import get_object_or_404
from .serializers import *
from .models import *
from rest_framework import generics,status,viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError

class AdminArtistViewSet(viewsets.ModelViewSet):
    queryset = Artist_M.objects.all()
    serializer_class = ArtistSerializer

class AdminAlbumViewSet(viewsets.ModelViewSet):
    queryset = Album_M.objects.all()
    serializer_class = AlbumSerializer

class AdminMusicViewSet(viewsets.ModelViewSet):
    queryset = Music_M.objects.all()
    serializer_class = MusicSerializer
