# Generated by Django 5.0 on 2024-01-05 12:48

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MBmovies', '0002_movie_img'),
    ]

    operations = [
        migrations.CreateModel(
            name='Movie_Director_M',
            fields=[
                ('D_ID', models.AutoField(primary_key=True, serialize=False)),
                ('D_Name', models.CharField(max_length=50)),
                ('img', models.ImageField(default='default_image.jpg', upload_to='Movie_Director_images/')),
            ],
        ),
        migrations.AlterField(
            model_name='movie_img',
            name='img',
            field=models.ImageField(default='default_image.jpg', upload_to='Movie_images/'),
        ),
        migrations.CreateModel(
            name='Movie_Director',
            fields=[
                ('Md_ID', models.AutoField(primary_key=True, serialize=False)),
                ('M_ID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='MBmovies.movie_m')),
                ('D_ID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='MBmovies.movie_director_m')),
            ],
        ),
    ]