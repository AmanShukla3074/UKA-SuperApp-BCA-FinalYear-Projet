from django.shortcuts import get_object_or_404
from .serializers import *
from .models import *
from rest_framework import generics,status,viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from django.db.models import Q
from account.models import User
from django.conf import settings

    
class GenreList(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = MS_Genre_M.objects.all()
    serializer_class = GenreSerializer

# class ArtistViewSet(viewsets.ModelViewSet):
#     serializer_class = ArtistSerializer
#     # permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         # Get the currently logged-in user
#         user = self.request.user

#         # Filter the queryset to get the artist profile associated with the user
#         queryset = Artist_M.objects.filter(User_ID=user)

#         return queryset
#     def perform_create(self, serializer):
#         # Get the user associated with the JWT token
#         user = self.request.user
#         # Validate that the user doesn't already have an associated artist profile
#         if Artist_M.objects.filter(User_ID=user).exists():
#             raise ValidationError("User already has an associated artist profile.")

#         # Associate the newly created artist with the user
#         serializer.save(User_ID=user)

class ArtistViewSet(APIView):
        
    def get(self, request, pk=None):
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "")

        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            # user_id = 9
            user_id = decoded_token.get("user_id", None)

            if pk is not None:
                # Retrieve a single playlist by pk
                # queryset = Playlist_M.objects.filter(User_ID=user_id, pk=pk).first()
                queryset = Artist_M.objects.filter(User_ID=user_id).first()
                if queryset:
                    serializer = ArtistSerializer(queryset)
                    return Response(serializer.data)
                else:
                    return Response({"error": "Playlist not found"}, status=status.HTTP_404_NOT_FOUND)
            else:
                queryset = Artist_M.objects.filter(User_ID=user_id)
                serializer = ArtistSerializer(queryset, many=True)
                return Response(serializer.data)
        except jwt.ExpiredSignatureError:
            return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)

    def post(self, request):
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "")

        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token.get("user_id", None)

            user = User.objects.get(pk=user_id)  # Retrieve the User instance
            request.data["User_ID"] = user  # Assign the User instance to User_ID field

            serializer = ArtistSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(User_ID=user)  # Save the User instance
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except jwt.ExpiredSignatureError:
            return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)

    # PATCH method to partially update an existing artist
    def patch(self, request, pk):
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "")

        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token.get("user_id", None)

            try:
                artist = Artist_M.objects.get(pk=pk, User_ID=user_id)
            except Artist_M.DoesNotExist:
                return Response({"error": "Artist not found"}, status=status.HTTP_404_NOT_FOUND)
            
            serializer = ArtistSerializer(artist, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except jwt.ExpiredSignatureError:
            return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)

    # DELETE method to delete an existing artist
    def delete(self, request, pk):
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "")

        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token.get("user_id", None)

            try:
                artist = Artist_M.objects.get(pk=pk, User_ID=user_id)
            except Artist_M.DoesNotExist:
                return Response({"error": "Artist not found"}, status=status.HTTP_404_NOT_FOUND)
            
            artist.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except jwt.ExpiredSignatureError:
            return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
  

    
class MusicList(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = Music_M.objects.all()
    serializer_class = MusicSerializer

class MusicAPIView(APIView):
    def get(self, request, *args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "")
        music_id = kwargs.get('music_id')

        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token.get("user_id", None)

            if music_id is not None:
                music = Music_M.objects.get(pk=music_id)
                serializer = MusicSerializer(music)
                return Response(serializer.data)

            if user_id is not None:
                # Retrieve artist_id based on user_id
                try:
                    artist_profile = Artist_M.objects.get(User_ID=user_id)
                    artist_id = artist_profile.Artist_ID
                except Artist_M.DoesNotExist:
                    return Response({"error": "Artist profile not found for the user"}, status=status.HTTP_404_NOT_FOUND)

                # Filter Music_M instances using artist_id
                music_instances = Music_M.objects.filter(music_artist__Artist_ID=artist_id)
                serializer = MusicSerializer(music_instances, many=True)
                return Response(serializer.data)
            else:
                return Response({"error": "User ID not found in token"}, status=status.HTTP_401_UNAUTHORIZED)

        except jwt.ExpiredSignatureError:
            return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.exceptions.DecodeError:
            return Response({"error": "Malformed token"}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)

    # def post(self, request, *args, **kwargs):
    #     try:
    #         # Retrieve the specific artist instance
    #         artist_profile = Artist_M.objects.get(User_ID=request.user)
    #     except Artist_M.DoesNotExist:
    #         return Response({"detail": "User must have an associated artist profile."},
    #                         status=status.HTTP_400_BAD_REQUEST)

    #     serializer = MusicSerializer(data=request.data)
    #     if serializer.is_valid():
    #         music_instance = serializer.save()

    #         # Associate the music with the artist using only IDs
    #         Music_Artist.objects.create(Music_ID_id=music_instance.Music_ID, Artist_ID_id=artist_profile.Artist_ID)

    #         # Update the serializer data to include the associated artist
    #         serializer_data = serializer.data
    #         serializer_data['music_artist'] = [{'Music_ID': music_instance.Music_ID, 'artist': {'Artist_ID': artist_profile.Artist_ID}}]

    #         return Response(serializer_data, status=status.HTTP_201_CREATED)

    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    def post(self, request, *args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "")

        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token.get("user_id", None)

            if user_id is not None:
                # Retrieve the specific artist instance
                try:
                    artist_profile = Artist_M.objects.get(User_ID=user_id)
                except Artist_M.DoesNotExist:
                    return Response({"detail": "User must have an associated artist profile."},
                                    status=status.HTTP_400_BAD_REQUEST)

                # Update the data with the User instance
                request.data['music_artist'] = [{'artist': {'Artist_ID': artist_profile.Artist_ID}}]
                serializer = MusicSerializer(data=request.data)

                if serializer.is_valid():
                    music_instance = serializer.save()

                    # Associate the music with the artist using only IDs
                    Music_Artist.objects.create(Music_ID_id=music_instance.Music_ID, Artist_ID_id=artist_profile.Artist_ID)

                    # Update the serializer data to include the associated artist
                    serializer_data = serializer.data
                    serializer_data['music_artist'] = [{'Music_ID': music_instance.Music_ID,
                                                         'artist': {'Artist_ID': artist_profile.Artist_ID}}]

                    return Response(serializer_data, status=status.HTTP_201_CREATED)

                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            else:
                return Response({"error": "User ID not found in token"}, status=status.HTTP_401_UNAUTHORIZED)

        except jwt.ExpiredSignatureError:
            return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.exceptions.DecodeError:
            return Response({"error": "Malformed token"}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)

    def patch(self, request, *args, **kwargs):
        # Add logic for updating a music instance if needed
        music_id = kwargs.get('music_id')
        instance = get_object_or_404(Music_M, Music_ID=music_id)
        serializer = MusicSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        music_id = kwargs.get('music_id')
        instance = get_object_or_404(Music_M, Music_ID=music_id)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AddArtistsToMusic(APIView):
    # permission_classes = [IsAuthenticated]
    def post(self, request, music_id):
        try:
            # Retrieve the specific music instance
            music_instance = Music_M.objects.get(Music_ID=music_id)
        except Music_M.DoesNotExist:
            return Response({"detail": "Music does not exist."},
                            status=status.HTTP_404_NOT_FOUND)

        # Check if the current user is the owner of the music
        # Add your authentication logic here

        # Get the list of artist IDs from the request data
        artist_ids = request.data.get('artist_ids', [])

        # Associate the music with the provided artists
        for artist_id in artist_ids:
            try:
                artist = Artist_M.objects.get(Artist_ID=artist_id)
                Music_Artist.objects.create(Music_ID=music_instance, Artist_ID=artist)
            except Artist_M.DoesNotExist:
                return Response({"detail": f"Artist with ID {artist_id} does not exist."},
                                status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "Artists added successfully."},
                        status=status.HTTP_201_CREATED)

    def delete(self, request, music_id):
        try:
            # Retrieve the specific music instance
            music_instance = Music_M.objects.get(Music_ID=music_id)
        except Music_M.DoesNotExist:
            return Response({"detail": "Music does not exist."}, status=status.HTTP_404_NOT_FOUND)


        artist_ids = request.data.get('artist_ids', [])

        # Disassociate the music from the provided artists
        for artist_id in artist_ids:
            try:
                artist = Artist_M.objects.get(Artist_ID=artist_id)
                Music_Artist.objects.filter(Music_ID=music_instance, Artist_ID=artist).delete()
            except Artist_M.DoesNotExist:
                return Response({"detail": f"Artist with ID {artist_id} does not exist."},
                                status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "Artists removed successfully."}, status=status.HTTP_200_OK)

class AlbumApiView(APIView):
    def get(self, request, *args, **kwargs):
        album_id = kwargs.get('album_id')

        if album_id is not None:
            album = Album_M.objects.get(pk=album_id)
            serializer = AlbumSerializer(album)
            return Response(serializer.data)
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "")

        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            # decoded_token = jwt.decode(token,  settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token.get("user_id", None)

            if user_id is not None:
                artist_id = Artist_M.objects.get(User_ID=user_id)
                albums = Album_M.objects.filter(album_artist__Artist_ID__pk=artist_id.Artist_ID)
                serializer = AlbumSerializer(albums, many=True)
                return Response(serializer.data)
            else:
                return Response({"error": "User ID not found in token"}, status=status.HTTP_401_UNAUTHORIZED)

        except jwt.ExpiredSignatureError:
            return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.exceptions.DecodeError:
            return Response({"error": "Malformed token"}, status=status.HTTP_401_UNAUTHORIZED)
        except Artist_M.DoesNotExist:
            return Response({"error": "Artist not found"}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, *args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "")

        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token.get("user_id", None)

            if user_id is not None:
                # Retrieve the specific artist instance
                try:
                    artist_profile = Artist_M.objects.get(User_ID=user_id)
                except Artist_M.DoesNotExist:
                    return Response({"detail": "User must have an associated artist profile."},
                                    status=status.HTTP_400_BAD_REQUEST)

                # Update the data with the User instance
                request.data['Album_artist'] = [{'artist': {'Artist_ID': artist_profile.Artist_ID}}]
                serializer = AlbumSerializer(data=request.data)

                if serializer.is_valid():
                    album_instance = serializer.save()

                    # Associate the album with the artist using only IDs
                    Album_Artist.objects.create(Album_ID_id=album_instance.Album_ID, Artist_ID_id=artist_profile.Artist_ID)

                    # Update the serializer data to include the associated artist
                    serializer_data = serializer.data
                    serializer_data['Album_artist'] = [{'Album_ID': album_instance.Album_ID,
                                                         'artist': {'Artist_ID': artist_profile.Artist_ID}}]

                    return Response(serializer_data, status=status.HTTP_201_CREATED)

                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            else:
                return Response({"error": "User ID not found in token"}, status=status.HTTP_401_UNAUTHORIZED)

        except jwt.ExpiredSignatureError:
            return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.exceptions.DecodeError:
            return Response({"error": "Malformed token"}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)
 
    def patch(self, request, *args, **kwargs):
        album_id=kwargs.get('album_id')
        instance = get_object_or_404(Album_M,Album_ID=album_id)
        serializer = AlbumSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, album_id):
        try:
            print("Deleting album with ID:", album_id)
            instance = Album_M.objects.get(Album_ID=album_id)
            print("Retrieved instance:", instance)
            instance.delete()
            return JsonResponse({"message": "Album deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Album_M.DoesNotExist:
            return JsonResponse({"error": "Album does not exist"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # album_id = kwargs.get('album_id')
        # instance = get_object_or_404(Album_M, Album_ID=album_id)
        # instance.delete()
        # return Response(status=status.HTTP_204_NO_CONTENT)


class AddArtistsToAlbum(APIView):
    # permission_classes = [IsAuthenticated]
    def post(self, request, album_id):
        try:
            # Retrieve the specific music instance
            album_instance = Album_M.objects.get(Album_ID=album_id)
        except Album_M.DoesNotExist:
            return Response({"detail": "Album does not exist."},
                            status=status.HTTP_404_NOT_FOUND)

        artist_ids = request.data.get('artist_ids', [])

        # Associate the music with the provided artists
        for artist_id in artist_ids:
            try:
                artist = Artist_M.objects.get(Artist_ID=artist_id)
                Album_Artist.objects.create(Album_ID=album_instance, Artist_ID=artist)
            except Artist_M.DoesNotExist:
                return Response({"detail": f"Artist with ID {artist_id} does not exist."},
                                status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "Artists added successfully."},
                        status=status.HTTP_201_CREATED)

    def delete(self, request, album_id):
        try:
            # Retrieve the specific music instance
            album_instance = Album_M.objects.get(Album_ID=album_id)
        except Album_M.DoesNotExist:
            return Response({"detail": "Album does not exist."}, status=status.HTTP_404_NOT_FOUND)


        artist_ids = request.data.get('artist_ids', [])

        # Disassociate the music from the provided artists
        for artist_id in artist_ids:
            try:
                artist = Artist_M.objects.get(Artist_ID=artist_id)
                Album_Artist.objects.filter(Album_ID=album_instance, Artist_ID=artist).delete()
            except Artist_M.DoesNotExist:
                return Response({"detail": f"Artist with ID {artist_id} does not exist."},
                                status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "Artists removed successfully."}, status=status.HTTP_200_OK)


#Search Artist
    
class ArtistSearchView(APIView):

    def get(self, request, artist_id):
        try:
            artist_instance = Artist_M.objects.get(Artist_ID=artist_id)
        except Artist_M.DoesNotExist:
            return Response({"detail": "Artist does not exist."}, status=status.HTTP_404_NOT_FOUND)
        
        artist_serializer = ArtistSerializer(artist_instance)

        album_ids = Album_Artist.objects.filter(Artist_ID=artist_instance).values_list('Album_ID', flat=True)
        albums = Album_M.objects.filter(Album_ID__in=album_ids)

        album_serializer = AlbumSerializer(albums, many=True)

        # Retrieve all music associated with the artist
        music_ids = Music_Artist.objects.filter(Artist_ID=artist_instance).values_list('Music_ID', flat=True)
        music = Music_M.objects.filter(Music_ID__in=music_ids)

        # Serialize the music data
        music_serializer = MusicSerializer(music, many=True)

        return Response({
            "artist": artist_serializer.data,
            # "artist": {"Artist_ID": artist_instance.Artist_ID, "Artist_Name": artist_instance.Artist_Name},
            "albums": album_serializer.data,
            "music": music_serializer.data
        }, status=status.HTTP_200_OK)
    

#Playlist
import logging

logger = logging.getLogger(__name__)
import jwt

# class PlaylistViews(viewsets.ModelViewSet):
#     queryset = Playlist_M.objects.all()
#     serializer_class = PlaylistSerializer

#     def get_queryset(self):

#         auth_header = self.request.headers.get("Authorization", "")
#         token = auth_header.replace("Bearer ", "")

#         decoded_token = jwt.decode(token,settings.SECRET_KEY , algorithms=['HS256'])

#         print("Decoded Token :", decoded_token)

#         user_id = decoded_token.get("user_id", None)
#         queryset = Playlist_M.objects.filter(User_ID=user_id)

#         return queryset
#     def perform_create(self, serializer):
#         auth_header = self.request.headers.get("Authorization", "")
#         token = auth_header.replace("Bearer ", "")
#         decoded_token = jwt.decode(token, 'your_secret_key', algorithms=['HS256'])
#         user_id = decoded_token.get("user_id", None)
#         serializer.save(User_ID=user_id)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Playlist_M
from .serializers import PlaylistSerializer
import jwt

class PlaylistViews(APIView):
    # def get(self, request):
    #     auth_header = request.headers.get("Authorization", "")
    #     token = auth_header.replace("Bearer ", "")

    #     try:
    #         decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
    #         user_id = decoded_token.get("user_id", None)
    #         queryset = Playlist_M.objects.filter(User_ID=user_id)
    #         serializer = PlaylistSerializer(queryset, many=True)
    #         return Response(serializer.data)
    #     except jwt.ExpiredSignatureError:
    #         return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
    #     except jwt.InvalidTokenError:
    #         return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)

    def get(self, request, pk=None):
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "")

        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token.get("user_id", None)

            if pk is not None:
                # Retrieve a single playlist by pk
                queryset = Playlist_M.objects.filter(User_ID=user_id, pk=pk).first()
                if queryset:
                    serializer = PlaylistSerializer(queryset)
                    return Response(serializer.data)
                else:
                    return Response({"error": "Playlist not found"}, status=status.HTTP_404_NOT_FOUND)
            else:
                # List all playlists for the user
                queryset = Playlist_M.objects.filter(User_ID=user_id)
                serializer = PlaylistSerializer(queryset, many=True)
                return Response(serializer.data)
        except jwt.ExpiredSignatureError:
            return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)

    def post(self, request):
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "")

        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token.get("user_id", None)

            # Retrieve the User instance using the user_id
            user = User.objects.get(pk=user_id)
            
            serializer = PlaylistSerializer(data=request.data)
            if serializer.is_valid():
                # Save the serializer with the User instance
                serializer.save(User_ID=user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except jwt.ExpiredSignatureError:
            return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        # Implement update logic here
        pass

    def patch(self, request, pk):
        try:
            auth_header = request.headers.get("Authorization", "")
            token = auth_header.replace("Bearer ", "")
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token.get("user_id", None)

            playlist = Playlist_M.objects.get(pk=pk, User_ID=user_id)
            serializer = PlaylistSerializer(playlist, data=request.data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except jwt.ExpiredSignatureError:
            return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
        except Playlist_M.DoesNotExist:
            return Response({"error": "Playlist not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            auth_header = request.headers.get("Authorization", "")
            token = auth_header.replace("Bearer ", "")
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token.get("user_id", None)

            playlist = Playlist_M.objects.get(pk=pk, User_ID=user_id)
            playlist.delete()
            return Response({"message": "Playlist deleted successfully"})
        except jwt.ExpiredSignatureError:
            return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
        except Playlist_M.DoesNotExist:
            return Response({"error": "Playlist not found"}, status=status.HTTP_404_NOT_FOUND)


from django.http import JsonResponse
# class PlaylistViews(viewsets.ModelViewSet):
#     queryset = Playlist_M.objects.all()
#     serializer_class = PlaylistSerializer

#     def get_queryset(self):
#         auth_header = self.request.headers.get("Authorization", "")
#         token = auth_header.replace("Bearer ", "")

#         try:
#             decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
#             print("Decoded Token:", decoded_token)

#             user_id = decoded_token.get("user_id", None)
#             queryset = Playlist_M.objects.filter(User_ID=user_id)
#             return queryset
#         except jwt.ExpiredSignatureError:
#             return JsonResponse({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
#         except jwt.InvalidTokenError:
#             return JsonResponse({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)

#     def perform_create(self, serializer):
#         auth_header = self.request.headers.get("Authorization", "")
#         token = auth_header.replace("Bearer ", "")

#         try:
#             decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
#             print("Decoded Token:", decoded_token)

#             user_id = decoded_token.get("user_id", None)
#             print("User ID from Token:", user_id)

#             # Debugging: Print the data being passed to the serializer
#             print("Serializer Data:", self.request.data)

#             serializer.save(User_ID=user_id)
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         except jwt.ExpiredSignatureError:
#             return JsonResponse({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
#         except jwt.InvalidTokenError:
#             return JsonResponse({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
#         except Exception as e:
#             return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PlaylistMusicViews(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        playlist_music_instances = Playlist_Music_M.objects.all()
        serializer = GetPlaylistMusicSerializer(playlist_music_instances, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = PostPlaylistMusicSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, *args, **kwargs):
        playlist_music_id = kwargs.get('pk')
        try:
            instance = Playlist_Music_M.objects.get(pk=playlist_music_id)
            serializer = GetPlaylistMusicSerializer(instance, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Playlist_Music_M.DoesNotExist:
            return Response({"error": "Playlist Music not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, *args, **kwargs):
        playlist_music_id = kwargs.get('pk')
        try:
            instance = Playlist_Music_M.objects.get(pk=playlist_music_id)
            instance.delete()
            return Response({"message": "Playlist Music deleted successfully"})
        except Playlist_Music_M.DoesNotExist:
            return Response({"error": "Playlist Music not found"}, status=status.HTTP_404_NOT_FOUND)


class LikedMusicAPIView(APIView):

    # def get(self, request,music_id, *args, **kwargs):
    #     auth_header = request.headers.get("Authorization", "")
    #     token = auth_header.replace("Bearer ", "")

    #     try:
    #         decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
    #         user_id = decoded_token.get("user_id", None)

    #         user = User.objects.get(id=user_id)

    #         liked_music, created = LikedMusic_Plalist.objects.get_or_create(User_ID=user)

    #         if music_id:
    #             try:
    #             # Retrieve the liked music entry to delete
    #                 liked_music_entry = LikedMusic.objects.get(LikedMusic_Plalist_ID=liked_music, Music_ID__pk=music_id)
    #                 return Response(liked_music_entry,status=status.HTTP_202_ACCEPTED)
    #             except LikedMusic.DoesNotExist:
    #                 return Response({"detail": "Liked music entry does not exist."}, status=status.HTTP_404_NOT_FOUND)
                
    #         liked_music_entries = LikedMusic.objects.filter(LikedMusic_Plalist_ID=liked_music)
    #         serializer = GetLikedMusicSerializer(liked_music_entries, many=True)

    #         return Response(serializer.data) 
    #     except jwt.ExpiredSignatureError:
    #         return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
    #     except jwt.InvalidTokenError:
    #         return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)

    def get(self, request, music_id=None, *args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "")

        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token.get("user_id", None)

            user = User.objects.get(id=user_id)

            liked_music, created = LikedMusic_Plalist.objects.get_or_create(User_ID=user)

            if music_id:
                try:
                    # Retrieve the liked music entry
                    liked_music_entry = LikedMusic.objects.get(LikedMusic_Plalist_ID=liked_music, Music_ID__pk=music_id)
                    serializer = GetLikedMusicSerializer(liked_music_entry)  # Serialize the LikedMusic object
                    return Response(serializer.data, status=status.HTTP_200_OK)
                except LikedMusic.DoesNotExist:
                    return Response({"detail": "Liked music entry does not exist."}, status=status.HTTP_404_NOT_FOUND)
            
            # If music_id is not provided, return all liked music entries
            liked_music_entries = LikedMusic.objects.filter(LikedMusic_Plalist_ID=liked_music)
            serializer = GetLikedMusicSerializer(liked_music_entries, many=True)  # Serialize multiple LikedMusic objects
            return Response(serializer.data, status=status.HTTP_200_OK)

        except jwt.ExpiredSignatureError:
            return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)

    # def post(self, request, *args, **kwargs):
    #     liked_music, created = LikedMusic_Plalist.objects.get_or_create(User_ID=request.user)

    #     music_id = request.data.get('music_id')
    #     if not music_id:
    #         return Response({"detail": "Music ID is required."}, status=status.HTTP_400_BAD_REQUEST)

    #     existing_entry = LikedMusic.objects.filter(LikedMusic_Plalist_ID=liked_music, Music_ID=music_id).first()

    #     if existing_entry:
    #         return Response({"detail": "This music is already liked by the user."}, status=status.HTTP_400_BAD_REQUEST)


    #     music_instance = Music_M.objects.get(pk=music_id)
    #     liked_music_entry = LikedMusic.objects.create(LikedMusic_Plalist_ID=liked_music, Music_ID=music_instance)


    #     serializer = PostLikedMusicSerializer(liked_music_entry)
    #     return Response(serializer.data, status=status.HTTP_201_CREATED)

    def post(self, request, *args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "")

        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token.get("user_id", None)

            # Retrieve the User instance using your custom user model
            user = User.objects.get(id=user_id)

            # Create or retrieve the LikedMusic_Plalist instance using the User instance
            liked_music, created = LikedMusic_Plalist.objects.get_or_create(User_ID=user)

            music_id = request.data.get('music_id')
            if not music_id:
                return Response({"detail": "Music ID is required."}, status=status.HTTP_400_BAD_REQUEST)

            existing_entry = LikedMusic.objects.filter(LikedMusic_Plalist_ID=liked_music, Music_ID=music_id).first()

            if existing_entry:
                return Response({"detail": "This music is already liked by the user."}, status=status.HTTP_400_BAD_REQUEST)

            music_instance = Music_M.objects.get(pk=music_id)
            liked_music_entry = LikedMusic.objects.create(LikedMusic_Plalist_ID=liked_music, Music_ID=music_instance)

            serializer = PostLikedMusicSerializer(liked_music_entry)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except jwt.ExpiredSignatureError:
            return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Music_M.DoesNotExist:
            return Response({"error": "Music not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, music_id, *args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "")

        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token.get("user_id", None)

            # Retrieve the User instance using your custom user model
            user = User.objects.get(id=user_id)

            # Create or retrieve the LikedMusic_Plalist instance using the User instance
            liked_music, created = LikedMusic_Plalist.objects.get_or_create(User_ID=user)

            if not music_id:
                return Response({"detail": "Music ID is required."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                # Retrieve the liked music entry to delete
                liked_music_entry = LikedMusic.objects.get(LikedMusic_Plalist_ID=liked_music, Music_ID__pk=music_id)
                liked_music_entry.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            except LikedMusic.DoesNotExist:
                return Response({"detail": "Liked music entry does not exist."}, status=status.HTTP_404_NOT_FOUND)

        except jwt.ExpiredSignatureError:
            return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


# class LikedMusicAPIView(APIView):

#     def get(self, request, *args, **kwargs):
#         liked_music, created = LikedMusic_Plalist.objects.get_or_create(User_ID=request.user)
#         liked_music_entries = LikedMusic.objects.filter(LikedMusic_Plalist_ID=liked_music)
#         serializer = GetLikedMusicSerializer(liked_music_entries, many=True)

#         return Response(serializer.data)

#     def post(self, request, *args, **kwargs):
#         liked_music, created = LikedMusic_Plalist.objects.get_or_create(User_ID=request.user)

#         music_id = request.data.get('music_id')
#         if not music_id:
#             return Response({"detail": "Music ID is required."}, status=status.HTTP_400_BAD_REQUEST)

#         existing_entry = LikedMusic.objects.filter(LikedMusic_Plalist_ID=liked_music, Music_ID=music_id).first()

#         if existing_entry:
#             return Response({"detail": "This music is already liked by the user."}, status=status.HTTP_400_BAD_REQUEST)


#         music_instance = Music_M.objects.get(pk=music_id)
#         liked_music_entry = LikedMusic.objects.create(LikedMusic_Plalist_ID=liked_music, Music_ID=music_instance)


#         serializer = PostLikedMusicSerializer(liked_music_entry)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)

#     def delete(self, request,music_id, *args, **kwargs):
#         liked_music, created = LikedMusic_Plalist.objects.get_or_create(User_ID=request.user)

#         if not music_id:
#             return Response({"detail": "Music ID is required."}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             liked_music_entry = LikedMusic.objects.get(LikedMusic_Plalist_ID=liked_music, Music_ID__pk=music_id)
#             liked_music_entry.delete()
#             return Response(status=status.HTTP_204_NO_CONTENT)
#         except LikedMusic.DoesNotExist:
#             return Response({"detail": "Liked music entry does not exist."}, status=status.HTTP_404_NOT_FOUND)



class SearchView(APIView):

    def get(self, request, *args, **kwargs):
        query = request.query_params.get('query', '')

        # Search artists
        artist_results = Artist_M.objects.filter(Q(Artist_Name__icontains=query) | Q(Bio__icontains=query))
        artist_serializer = ArtistSerializer(artist_results, many=True).data

        # Search albums
        album_results = Album_M.objects.filter(Q(Album_Title__icontains=query) | Q(Copyrightowner__icontains=query))
        album_serializer = AlbumSerializer(album_results, many=True).data

        # Search music
        music_results = Music_M.objects.filter(Q(Music_Title__icontains=query) | Q(Copyrightowner__icontains=query))
        music_serializer = MusicSerializer(music_results, many=True).data

        return Response({
            'artists': artist_serializer,
            'albums': album_serializer,
            'music': music_serializer,
        })

class StreamMusicIncrement(APIView):
    def post(self, request, music_id):
        try:
            music_instance = Music_M.objects.get(Music_ID=music_id)
        except Music_M.DoesNotExist:
            return Response({"detail": "Music does not exist."},
                            status=status.HTTP_404_NOT_FOUND)

        music_instance.M_Streams += 1
        music_instance.save()

        return Response({"detail": "Music streamed successfully."},
                        status=status.HTTP_200_OK)
    


class AnalyticsView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Retrieve the specific Analytics_M instance using the provided pk
        analytics_id = kwargs.get('pk')

        if analytics_id is not None:
            try:
                analytics_data = Analytics_M.objects.get(pk=analytics_id)
                serializer = AnalyticsSerializer(analytics_data)
                return Response(serializer.data)
            except Analytics_M.DoesNotExist:
                return Response({"detail": "Analytics entry not found."}, status=404)

        # Retrieve the logged-in user's artist instances
        user = request.user
        queryset = Artist_M.objects.filter(User_ID=user)

        # Retrieve analytics data related to the logged-in user's artists
        analytics_data = Analytics_M.objects.filter(Artist_ID__in=queryset)
        serializer = AnalyticsSerializer(analytics_data, many=True)
        return Response(serializer.data)

    
