# Generated by Django 5.0 on 2024-02-04 17:48

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MusicStreaming', '0010_alter_analytics_m_totalstreams'),
    ]

    operations = [
        migrations.AlterField(
            model_name='music_artist',
            name='Artist_ID',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='music_artist', to='MusicStreaming.artist_m'),
        ),
    ]