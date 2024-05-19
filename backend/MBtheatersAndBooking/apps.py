from django.apps import AppConfig


class MbtheatersandbookingConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'MBtheatersAndBooking'

class YourAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'MBtheatersAndBooking'

    def ready(self):
        import MBtheatersAndBooking.signals  # Import signals module