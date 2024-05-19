from django.contrib import admin
from .models import*

# Register your models here.
admin.site.register(MS_Genre_M)
admin.site.register(Artist_M)
admin.site.register(Album_M)
admin.site.register(Music_M)
admin.site.register(Playlist_M)
admin.site.register(Playlist_Music_M)
admin.site.register(Music_Artist)
admin.site.register(Album_Artist)
admin.site.register(Analytics_M)
admin.site.register(LikedMusic)
admin.site.register(LikedMusic_Plalist)