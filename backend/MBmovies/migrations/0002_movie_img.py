# Generated by Django 5.0 on 2024-01-05 12:18

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MBmovies', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Movie_Img',
            fields=[
                ('Img_id', models.AutoField(primary_key=True, serialize=False)),
                ('img', models.ImageField(default='default_image.jpg', upload_to='product_images/')),
                ('M_ID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='MBmovies.movie_m')),
            ],
        ),
    ]