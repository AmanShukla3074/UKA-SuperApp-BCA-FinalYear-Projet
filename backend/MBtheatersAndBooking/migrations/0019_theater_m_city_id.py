# Generated by Django 5.0 on 2024-02-07 09:00

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MBtheatersAndBooking', '0018_showtime_m_m_language_showtime_m_m_type'),
        ('account', '0003_remove_address_address_address_house_add_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='theater_m',
            name='City_ID',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='account.city'),
        ),
    ]