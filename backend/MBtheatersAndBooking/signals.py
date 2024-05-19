from .models import *
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import ShowTime_M, Seat_M, SeatInShowtime

@receiver(post_save, sender=ShowTime_M)
def create_seat_in_showtime(sender, instance, **kwargs):
    # Check if this is a new showtime
    if kwargs.get('created', False):
        # Get all seats for the screen associated with the showtime
        screen_seats = Seat_M.objects.filter(Screen_ID=instance.Screen_M)
        # screen_seats = Seat_M.objects.filter(Screen_ID=instance.screen_id)
        print("Signal Activated")
        # Create SeatInShowtime entries for each seat
        for seat in screen_seats:
            SeatInShowtime.objects.create(seat=seat, showtime=instance)