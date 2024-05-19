from rest_framework import serializers
from .models import *
from MBmovies.serializers import *


class MovieSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()
    def get_images(self,obj):
        movie_Img = Movie_Img.objects.filter(M_ID=obj)
        serializer = Movie_ImgSerializer(movie_Img, many=True)
        return serializer.data 

    class Meta:
        model=Movie_M
        fields=['M_ID','M_Name','M_Age_Certification','images']


class ScreenGetSerializer(serializers.ModelSerializer):
    Shows = serializers.SerializerMethodField()
   
    def get_Shows(self,obj):
        movie_Img = ShowTime_M.objects.filter(Screen_M=obj)
        serializer = ShowtimeGetSerializer(movie_Img, many=True)
        return serializer.data  

    class Meta:
        model = Screen_M
        fields = ['Screen_ID','Screen_Name','T_ID','Shows']

class ScreenPostSerializer(serializers.ModelSerializer): 
    class Meta:
        model = Screen_M
        fields = '__all__'



class Theater2Serializer(serializers.ModelSerializer):
    class Meta:
        model = Theater_M
        fields = ['T_ID','T_Name','T_Flat_Add','T_Street_Add','T_Pin']

class Screen2Serializer(serializers.ModelSerializer):
    T_ID = Theater2Serializer()
    class Meta:
        model = Screen_M
        fields = ['Screen_ID','Screen_Name','T_ID']



class ShowtimePostSerializer(serializers.ModelSerializer):
    # Screen_M = Screen2Serializer()
    # M_ID = MovieSerializer()
    # M_Language=Movie_Language_MSerializer()
    # M_Type=Movie_Type_MSerializer()

    class Meta:
        model = ShowTime_M
        fields = ['ShowTime_ID','M_ID','Screen_M','StartTime','Date','M_Language','M_Type']


class ShowtimeGetSerializer(serializers.ModelSerializer):
    Screen_M = Screen2Serializer()
    M_ID = MovieSerializer()
    M_Language=Movie_Language_MSerializer()
    M_Type=Movie_Type_MSerializer()

    class Meta:
        model = ShowTime_M
        fields = ['ShowTime_ID','M_ID','Screen_M','StartTime','Date','M_Language','M_Type']



class SeatTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SeatType
        fields = '__all__'


class SeatPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = SeatPrice
        fields = '__all__'

class Payment_ModeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment_Mode
        fields = '__all__'


class SeatGetSerializer(serializers.ModelSerializer):
    Seat_Type = SeatTypeSerializer(read_only=True)

    class Meta:
        model = Seat_M
        fields = '__all__'

class SeatPostSerializer(serializers.ModelSerializer):
    # Seat_Type = SeatTypeSerializer(read_only=True)

    class Meta:
        model = Seat_M
        fields = '__all__'

class SeatInShowtimeSerializer(serializers.ModelSerializer):
    seat = SeatGetSerializer()
    Price = serializers.SerializerMethodField()

    def get_Price(self,obj):
        seat_type = obj.seat.Seat_Type
        showtime_id = obj.showtime.ShowTime_ID

        # Retrieve the corresponding SeatPrice entry
        seat_price = SeatPrice.objects.filter(Seat_type_id=seat_type, ShowTime_ID=showtime_id).first()

        # Return the price if available, or None if not found
        return seat_price.Price if seat_price else None

    class Meta:
        model = SeatInShowtime
        fields = ['id','seat','Price','is_booked','showtime']


class BookingPostSerializer(serializers.ModelSerializer):
    # ShowTime_ID=ShowtimeSerializer()
    class Meta:
        model = Booking_M
        fields = '__all__'


class BookingSeatPostSerializer(serializers.ModelSerializer):
    # Seat_ID=SeatInShowtimeSerializer()
    class Meta:
        model = Booking_Seat_M
        fields = '__all__'


class BookingSeatGetSerializer(serializers.ModelSerializer):
    Seat_ID=SeatInShowtimeSerializer()
    class Meta:
        model = Booking_Seat_M
        fields = '__all__'

class BookingGetSerializer(serializers.ModelSerializer):
    ShowTime_ID=ShowtimeGetSerializer()
    Seats = serializers.SerializerMethodField()

    def get_Seats(self,obj):
        seats = Booking_Seat_M.objects.filter(B_ID=obj)
        serializer = BookingSeatGetSerializer(seats, many=True)
        return serializer.data 

    # M_ID = serializers.PrimaryKeyRelatedField(source='ShowTime_ID.M_ID.M_ID', read_only=True)
    # M_Name = serializers.CharField(source='ShowTime_ID.M_ID.M_Name', read_only=True)
    # T_ID = serializers.PrimaryKeyRelatedField(source='ShowTime_ID.Screen_M.T_ID.T_ID', read_only=True)
    # T_Name = serializers.CharField(source='ShowTime_ID.Screen_M.T_ID.T_Name', read_only=True)
    # Screen = serializers.CharField(source='ShowTime_ID.Screen_M.Screen_Name', read_only=True)
    # U_FName = serializers.CharField(source='User_ID.first_name', read_only=True)
    # U_LName = serializers.CharField(source='User_ID.last_name', read_only=True)


    class Meta:
        model = Booking_M
        fields = '__all__'
        # fields = ["B_ID","M_ID","M_Name","T_ID","T_Name","Screen","U_FName","U_LName","B_Time","B_Date","SubTotal","gst_amount","TotalAmt","User_ID","ShowTime_ID","Payment_Mode_ID","Seats"]










# class TheaterDetailSerializer(serializers.ModelSerializer):
class TheaterSerializer(serializers.ModelSerializer):
    Screen = serializers.SerializerMethodField()

    def get_Screen(self,obj):
        shows = Screen_M.objects.filter(T_ID=obj)
        serializer = ScreenGetSerializer(shows, many=True)
        return serializer.data 


    def get_Movies(self,obj):
        shows = Movie_M.objects.filter(T_ID=obj)
        serializer = ScreenGetSerializer(shows, many=True)
        return serializer.data 
    
    class Meta:
        model = Theater_M
        fields = ['T_ID','T_Name','T_Flat_Add','T_Street_Add','City_ID','T_Pin','T_Open_Date','T_No_Of_Screen','Theater_Manager_ID','Screen']
        # fields = ['T_ID','T_Name','T_Flat_Add','T_Street_Add','T_Pin','City_ID','Screen','screens']



class TheaterMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theater_M
        fields = ['T_ID','T_Name','T_Flat_Add','T_Street_Add','T_Pin']


class ComplaintPostSerializer(serializers.ModelSerializer):

    # M_ID = MovieSerializer()
    # T_ID = TheaterMiniSerializer()

    class Meta:
        model = Complaint_MB
        fields = '__all__'

class ComplaintGetSerializer(serializers.ModelSerializer):

    # M_ID = MovieSerializer()
    # T_ID = TheaterMiniSerializer()

    M_ID = serializers.PrimaryKeyRelatedField(source='M_ID.M_ID', read_only=True)
    M_Name = serializers.CharField(source='M_ID.M_Name', read_only=True)
    T_ID = serializers.PrimaryKeyRelatedField(source='T_ID.T_ID', read_only=True)
    T_Name = serializers.CharField(source='T_ID.T_Name', read_only=True)
    U_FName = serializers.CharField(source='User_ID.first_name', read_only=True)
    U_LName = serializers.CharField(source='User_ID.last_name', read_only=True)

    class Meta:
        model = Complaint_MB
        fields = ['Complaint_ID','User_ID','M_ID','M_Name','T_ID','T_Name','U_FName','U_LName','Complaint_Desc','Complaint_Date']

# class Rate_MBSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Rate_MB
#         fields = '__all__'


class Rate_MBGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rate_MB
        fields = '__all__'


class Rate_MBSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rate_MB
        fields = ['M_ID', 'average_rating']