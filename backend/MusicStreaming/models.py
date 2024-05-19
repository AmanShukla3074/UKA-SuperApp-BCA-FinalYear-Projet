from django.db import models
from account.models import User
from django.utils import timezone
from datetime import datetime
from django.db.models import Sum

# Create your models here.
class MS_Genre_M(models.Model):
    MS_Genre_ID=models.AutoField(primary_key=True)
    Genre_Name=models.CharField(max_length=50,null=False,blank=False)

    def __str__(self):
        return self.Genre_Name

class Artist_M(models.Model):
    Artist_ID=models.AutoField(primary_key=True)
    User_ID=models.ForeignKey(User, on_delete=models.CASCADE,null=False,blank=False ,related_name='artist_profile')
    Bio=models.CharField(max_length=70)
    Artist_Name=models.CharField(max_length=30,null=False,blank=False)
    Date_Joined=models.DateField(auto_now_add=True)
    MS_Genre_ID=models.ForeignKey(MS_Genre_M, on_delete=models.CASCADE,null=True,blank=True)
    Artist_Profile_Picture = models.ImageField(upload_to='artist_profile_picture/',default='default_image.jpg')

    def update_monthly_analytics(self):
        # Get the current month and year in the format 'MM-YYYY'
        current_month_year = timezone.now().strftime('%m-%Y')

        # Check if an analytics entry for the current month already exists
        analytics_entry, created = Analytics_M.objects.get_or_create(
            Artist_ID=self,
            Month_Year=current_month_year
        )

        # Update the total streams for the analytics entry by aggregating streams from associated music tracks
        total_streams = self.music_artist.aggregate(Sum('Music_ID__M_Streams'))['Music_ID__M_Streams__sum'] or 0

        # Assuming 'TotalStreams' is a field in the Analytics_M model
        analytics_entry.TotalStreams = total_streams

        # Save the analytics entry
        analytics_entry.save()

        return analytics_entry

    def __str__(self):
            return f"Artist_ID = {self.Artist_ID} - Artist_Name = {self.Artist_Name}"

class Album_M(models.Model):
    Album_ID=models.AutoField(primary_key=True)
    Album_Title=models.CharField(max_length=50,null=False,blank=False)
    ReleaseDate=models.DateField(auto_now_add=True)
    MS_Genre_ID=models.ForeignKey(MS_Genre_M, on_delete=models.CASCADE,null=False,blank=False)
    No_Of_Songs=models.IntegerField(default=0,null=True,blank=True)
    Copyrightowner=models.CharField(max_length=50)
    cover = models.ImageField(upload_to='album_cover/',default='default_image.jpg')
    def __str__(self):
            return f"Album_ID = {self.Album_ID} - Album_Title = {self.Album_Title}"

class Music_M(models.Model):
    Music_ID=models.AutoField(primary_key=True)
    Music_Title=models.CharField(max_length=50,null=False,blank=False)
    Release_Date=models.DateField(auto_now_add=True)
    MS_Genre_ID=models.ForeignKey(MS_Genre_M, on_delete=models.CASCADE,null=False,blank=False)
    Album_ID=models.ForeignKey(Album_M, on_delete=models.CASCADE,null=True,blank=True)
    Copyrightowner=models.CharField(max_length=50)
    file = models.FileField(upload_to='music/',default='default.mp3')
    cover = models.ImageField(upload_to='music_cover/',default='default_image.jpg')
    M_Streams=models.IntegerField(default=0,null=True)

    def get_img_url(self):
        return self.cover.url

    def __str__(self):
            return f"Music_ID = {self.Music_ID} - Music_Title = {self.Music_Title}"

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

@receiver(post_save, sender=Music_M)
@receiver(post_delete, sender=Music_M)
def update_total_music_count(sender, instance, **kwargs):
    # Check if the music is associated with an album
    if instance.Album_ID:
        print("Hiii")
        # Get the album instance associated with the music
        album = instance.Album_ID

        # Count the total number of music instances associated with the album
        total_music_count = Music_M.objects.filter(Album_ID=album).count()

        # Update the Total_Music_Count field in the album instance
        album.No_Of_Songs = total_music_count

        # Save the changes to the album instance
        album.save()


class Playlist_M(models.Model):
    Playlist_ID=models.AutoField(primary_key=True)
    User_ID=models.ForeignKey(User, on_delete=models.CASCADE,null=False,blank=False)
    Playlist_Title=models.CharField(max_length=50,null=False,blank=False)
    P_Created_Date=models.DateField(auto_now_add=True)

    def __str__(self):
            return f"Playlist_ID = {self.Playlist_ID} - Playlist_Title = {self.Playlist_Title}"


class Playlist_Music_M(models.Model):
    PlaylistMusic_ID=models.AutoField(primary_key=True)
    Playlist_ID=models.ForeignKey(Playlist_M, on_delete=models.CASCADE,null=False,blank=False)
    Music_ID=models.ForeignKey(Music_M, on_delete=models.CASCADE,null=False,blank=False)

    def __str__(self):
            return f"PlaylistMusic_ID = {self.PlaylistMusic_ID} - Playlist_ID = {self.Playlist_ID} - Music_ID = {self.Music_ID}"

class LikedMusic_Plalist(models.Model):
    LikedMusic_Plalist_ID=models.AutoField(primary_key=True)
    User_ID=models.ForeignKey(User, on_delete=models.CASCADE,null=False,blank=False)
    # Playlist_Title=models.CharField(max_length=50,null=False,blank=False)
    P_Created_Date=models.DateField(auto_now_add=True)

    def __str__(self):
            return f"Playlist_ID = {self.LikedMusic_Plalist_ID} - User = {self.User_ID}"


class LikedMusic(models.Model):
    PlaylistMusic_ID=models.AutoField(primary_key=True)
    LikedMusic_Plalist_ID=models.ForeignKey(LikedMusic_Plalist, on_delete=models.CASCADE,null=False,blank=False)
    Music_ID=models.ForeignKey(Music_M, on_delete=models.CASCADE,null=False,blank=False)

    def __str__(self):
            return f"PlaylistMusic_ID = {self.PlaylistMusic_ID} - Playlist_ID = {self.LikedMusic_Plalist_ID} - Music_ID = {self.Music_ID}"

    
class Music_Artist(models.Model):
    M_Artist_ID=models.AutoField(primary_key=True)
    Music_ID=models.ForeignKey(Music_M, on_delete=models.CASCADE,null=False,blank=False)
    Artist_ID=models.ForeignKey(Artist_M, on_delete=models.CASCADE,null=False,blank=False, related_name='music_artist')

    def __str__(self):
            return f"M_Artist_ID = {self.M_Artist_ID} - Music_ID = {self.Music_ID} - Artist_ID = {self.Artist_ID}"


class Album_Artist(models.Model):
    A_Artist_ID=models.AutoField(primary_key=True)
    Album_ID=models.ForeignKey(Album_M, on_delete=models.CASCADE,null=False,blank=False)
    Artist_ID=models.ForeignKey(Artist_M, on_delete=models.CASCADE,null=False,blank=False)

    def __str__(self):
            return f"A_Artist_ID = {self.A_Artist_ID} - Album_ID = {self.Album_ID} - Artist_ID = {self.Artist_ID}"

class Analytics_M(models.Model):
    Analytics=models.AutoField(primary_key=True)
    Artist_ID=models.ForeignKey(Artist_M, on_delete=models.CASCADE,null=False,blank=False)
    Month_Year=models.CharField(max_length=16,null=False,blank=False)
    TotalStreams=models.IntegerField(null=True,blank=True)

    def __str__(self):
            return f"Analytics = {self.Analytics} - Artist_ID = {self.Artist_ID}"
    


    #       const albumResponse = await axios.post('/api/albums/', albumData);
    #   const albumId = albumResponse.data.Album_ID;
    #   console.log('Album created:', albumId);