# Generated by Django 5.0 on 2024-04-09 17:58

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Ecom', '0013_alter_cart_details_size_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order_details',
            name='size',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='Ecom.product_size_m'),
        ),
    ]
