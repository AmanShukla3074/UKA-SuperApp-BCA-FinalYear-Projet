# Generated by Django 5.0 on 2024-03-20 10:23

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Ecom', '0012_alter_order_details_size'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cart_details',
            name='Size_ID',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='Ecom.product_size_m'),
        ),
    ]