# Generated by Django 5.0 on 2024-01-30 04:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MusicStreaming', '0004_alter_artist_m_user_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='music_m',
            name='file',
            field=models.FileField(default='default.mp3', upload_to='music/'),
        ),
    ]
