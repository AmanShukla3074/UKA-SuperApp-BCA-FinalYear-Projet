# Generated by Django 5.0 on 2024-01-15 17:46

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Ecom', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='product_img',
            name='product_color',
        ),
        migrations.RemoveField(
            model_name='product_size',
            name='product_color',
        ),
        migrations.AddField(
            model_name='product_img',
            name='Product_ID',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='Ecom.product_m'),
        ),
        migrations.AddField(
            model_name='product_m',
            name='Color',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='Ecom.product_color_m'),
        ),
        migrations.AddField(
            model_name='product_size',
            name='Product_ID',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='Ecom.product_m'),
        ),
        migrations.DeleteModel(
            name='Product_Color',
        ),
    ]