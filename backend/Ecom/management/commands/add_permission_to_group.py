from django.contrib.auth.models import Group, Permission, ContentType
from django.core.management.base import BaseCommand
from Ecom.models import Order_M
class Command(BaseCommand):
    help = 'Adds the change_order_status permission to the Delivery Person group'

    def handle(self, *args, **options):
        # Assuming the permission is named 'Can change order status'
        content_type = ContentType.objects.get_for_model(Order_M) # Replace YourModel with the actual model class
        permission, created = Permission.objects.get_or_create(
            codename='change_order_status',
            name='Can change order status',
            content_type=content_type,
        )
        if created:
            self.stdout.write(self.style.SUCCESS('Permission created successfully.'))
        else:
            self.stdout.write(self.style.SUCCESS('Permission already exists.'))

        group, created = Group.objects.get_or_create(name='Delivery Person')
        if created:
            self.stdout.write(self.style.SUCCESS('Group created successfully.'))
        else:
            self.stdout.write(self.style.SUCCESS('Group already exists.'))

        if permission:
            group.permissions.add(permission)
            self.stdout.write(self.style.SUCCESS('Permission added to the group.'))
        else:
            self.stdout.write(self.style.ERROR('Permission not found.'))
