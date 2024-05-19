from rest_framework import serializers
from .models import *
from account.serializers import *

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = MS_Genre_M
        fields = '__all__'

class ArtistSerializer(serializers.ModelSerializer):
    # User_ID=UserSerializer(read_only=True)
    User_ID = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Artist_M
        fields = ['Artist_ID', 'Bio', 'Artist_Name', 'Date_Joined', 'MS_Genre_ID','User_ID','Artist_Profile_Picture']

class MusicArtistSerializer(serializers.ModelSerializer):
    artist = ArtistSerializer()

    class Meta:
        model = Music_Artist
        fields = ['M_Artist_ID', 'Music_ID', 'artist']

class MusicSerializer(serializers.ModelSerializer):
    music_artist = MusicArtistSerializer(many=True, read_only=True)
    Artist = serializers.SerializerMethodField()

    def get_Artist(self, obj):
        # Pass only the Music_ID to the MusicArtistSerializer
        music_artists = Music_Artist.objects.filter(Music_ID=obj.Music_ID)
        artist_data = []

        for music_artist in music_artists:
            artist_serializer = ArtistSerializer(music_artist.Artist_ID)
            artist_data.append(artist_serializer.data)

        return artist_data

    class Meta:
        model = Music_M
        fields = ["Music_ID","Music_Title","Release_Date","MS_Genre_ID","Album_ID","Copyrightowner","file","cover","music_artist",'M_Streams',"Artist"]



class AlbumArtistSerializer(serializers.ModelSerializer):
    artist = ArtistSerializer()

    class Meta:
        model = Album_Artist
        fields = ['A_Artist_ID', 'Album_ID', 'artist']


class AlbumSerializer(serializers.ModelSerializer):
    album_artist = AlbumArtistSerializer(many=True, read_only=True)
    Artist = serializers.SerializerMethodField()
    Music = serializers.SerializerMethodField()

    def get_Music(self,obj):
        product_img = Music_M.objects.filter(Album_ID=obj)
        serializer = MusicSerializer(product_img, many=True)
        return serializer.data 
    
    def get_Artist(self, obj):
        album_artists = Album_Artist.objects.filter(Album_ID=obj.Album_ID)
        artist_data = []

        for album_artist in album_artists:
            artist_serializer = ArtistSerializer(album_artist.Artist_ID)
            artist_data.append(artist_serializer.data)

        return artist_data

    class Meta:
        model = Album_M
        fields = ["Album_ID","Album_Title","cover","ReleaseDate","No_Of_Songs","Copyrightowner","MS_Genre_ID","Music","album_artist","Artist"]
    


class GetPlaylistMusicSerializer(serializers.ModelSerializer):
    Music_ID = MusicSerializer()

    class Meta:
        model = Playlist_Music_M
        fields = ['PlaylistMusic_ID', 'Playlist_ID', 'Music_ID']


class PostPlaylistMusicSerializer(serializers.ModelSerializer):

    class Meta:
        model = Playlist_Music_M
        fields = ['PlaylistMusic_ID', 'Playlist_ID', 'Music_ID']

import collections

class PlaylistSerializer(serializers.ModelSerializer):
    # playlist_music = PlaylistMusicSerializer(many=True, read_only=True)
    PlaylistMusic = serializers.SerializerMethodField()
    # Music = PlaylistMusicSerializer(many=True, read_only=True)

    def get_PlaylistMusic(self,obj):
        product_img = Playlist_Music_M.objects.filter(Playlist_ID=obj)
        serializer = GetPlaylistMusicSerializer(product_img, many=True)
        return serializer.data 

    class Meta:
        model = Playlist_M
        fields = ['Playlist_ID', 'User_ID', 'Playlist_Title', 'P_Created_Date', 'PlaylistMusic']
        read_only_fields = ['User_ID']

class PlaylistPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Playlist_M
        fields = '__all__'
        read_only_fields = ['User_ID']

# class PlaylistSerializer(serializers.ModelSerializer):
#     PlaylistMusic = serializers.SerializerMethodField()

#     def get_PlaylistMusic(self, obj):
#         # Check if obj is an OrderedDict (received from a POST request)
#         if isinstance(obj, collections.OrderedDict):
#             playlist_id = obj.get('Playlist_ID')
#         else:
#             playlist_id = obj.Playlist_ID

#         product_img = Playlist_Music_M.objects.filter(Playlist_ID=playlist_id)
#         serializer = GetPlaylistMusicSerializer(product_img, many=True)
#         return serializer.data

#     class Meta:
#         model = Playlist_M
#         fields = ['Playlist_ID', 'User_ID', 'Playlist_Title', 'P_Created_Date', 'PlaylistMusic']
#         read_only_fields = ['User_ID']

# class GetLikedMusicSerializer(serializers.ModelSerializer):
#     Music_ID = MusicSerializer()

#     class Meta:
#         model = LikedMusic
#         fields = ['PlaylistMusic_ID','LikedMusic_Plalist_ID','Music_ID']
        
class GetLikedMusicSerializer(serializers.ModelSerializer):
    music = MusicSerializer(source='Music_ID', read_only=True)

    class Meta:
        model = LikedMusic
        fields = ['PlaylistMusic_ID', 'LikedMusic_Plalist_ID', 'music']


class PostLikedMusicSerializer(serializers.ModelSerializer):

    class Meta:
        model = LikedMusic
        fields = ['PlaylistMusic_ID','LikedMusic_Plalist_ID','Music_ID']

class LikedMusicSerializer(serializers.ModelSerializer):
    PlaylistMusic = serializers.SerializerMethodField()

    def get_PlaylistMusic(self,obj):
        product_img = Playlist_Music_M.objects.filter(PlaylistMusic_ID=obj)
        serializer = GetLikedMusicSerializer(product_img, many=True)
        return serializer.data 

    class Meta:
        model = LikedMusic_Plalist
        fields = ['LikedMusic_Plalist_ID', 'User_ID', 'P_Created_Date', 'PlaylistMusic']
        read_only_fields = ['User_ID']

class AnalyticsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Analytics_M
        fields = '__all__'
        