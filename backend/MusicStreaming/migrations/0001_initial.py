# Generated by Django 5.0 on 2024-01-27 07:41

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Album_M',
            fields=[
                ('Album_ID', models.AutoField(primary_key=True, serialize=False)),
                ('Album_Title', models.CharField(max_length=50)),
                ('ReleaseDate', models.DateField()),
                ('No_Of_Songs', models.IntegerField()),
                ('Copyrightowner', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='MS_Genre_M',
            fields=[
                ('MS_Genre_ID', models.AutoField(primary_key=True, serialize=False)),
                ('Genre_Name', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Artist_M',
            fields=[
                ('Artist_ID', models.AutoField(primary_key=True, serialize=False)),
                ('Bio', models.CharField(max_length=70)),
                ('Artist_Name', models.CharField(max_length=30)),
                ('Date_Joined', models.DateField()),
                ('User_ID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('MS_Genre_ID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='MusicStreaming.ms_genre_m')),
            ],
        ),
        migrations.CreateModel(
            name='Analytics_M',
            fields=[
                ('Analytics', models.AutoField(primary_key=True, serialize=False)),
                ('Month_Year', models.CharField(max_length=16)),
                ('TotalStreams', models.IntegerField()),
                ('Artist_ID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='MusicStreaming.artist_m')),
            ],
        ),
        migrations.CreateModel(
            name='Album_Artist',
            fields=[
                ('A_Artist_ID', models.AutoField(primary_key=True, serialize=False)),
                ('Album_ID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='MusicStreaming.album_m')),
                ('Artist_ID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='MusicStreaming.artist_m')),
            ],
        ),
        migrations.AddField(
            model_name='album_m',
            name='MS_Genre_ID',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='MusicStreaming.ms_genre_m'),
        ),
        migrations.CreateModel(
            name='Music_M',
            fields=[
                ('Music_ID', models.AutoField(primary_key=True, serialize=False)),
                ('Music_Title', models.CharField(max_length=50)),
                ('Release_Date', models.DateField()),
                ('Copyrightowner', models.CharField(max_length=50)),
                ('file', models.FileField(upload_to='music/')),
                ('M_Streams', models.IntegerField(blank=True, null=True)),
                ('Album_ID', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='MusicStreaming.album_m')),
                ('MS_Genre_ID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='MusicStreaming.ms_genre_m')),
            ],
        ),
        migrations.CreateModel(
            name='Music_Artist',
            fields=[
                ('M_Artist_ID', models.AutoField(primary_key=True, serialize=False)),
                ('Artist_ID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='MusicStreaming.artist_m')),
                ('Music_ID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='MusicStreaming.music_m')),
            ],
        ),
        migrations.CreateModel(
            name='Playlist_M',
            fields=[
                ('Playlist_ID', models.AutoField(primary_key=True, serialize=False)),
                ('Playlist_Title', models.CharField(max_length=50)),
                ('P_Created_Date', models.DateField()),
                ('User_ID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Playlist_Music_M',
            fields=[
                ('PlaylistMusic_ID', models.AutoField(primary_key=True, serialize=False)),
                ('Music_ID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='MusicStreaming.music_m')),
                ('Playlist_ID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='MusicStreaming.playlist_m')),
            ],
        ),
    ]