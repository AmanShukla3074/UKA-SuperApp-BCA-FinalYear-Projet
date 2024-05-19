# Generated by Django 5.0 on 2024-01-05 12:07

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Movie_M',
            fields=[
                ('M_ID', models.AutoField(primary_key=True, serialize=False)),
                ('M_Name', models.CharField(max_length=90)),
                ('M_Duration', models.CharField(max_length=10)),
                ('M_Synopsis', models.TextField(blank=True, null=True)),
                ('M_Age_Certification', models.CharField(max_length=12)),
                ('M_ReleaseDate', models.DateField()),
                ('createdAt', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
