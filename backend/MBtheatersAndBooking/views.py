from django.shortcuts import render
from .serializers import *
from .models import *
from rest_framework import generics,status,viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
class ShowtimeList(APIView):
    ## permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        movie = self.request.query_params.get('movie')
        theater = self.request.query_params.get('theater')
        movie_type = self.request.query_params.get('movie_type')
        language = self.request.query_params.get('language')
        showtime_id=kwargs.get('pk')
        queryset = ShowTime_M.objects.all()

        if showtime_id:
            queryset = ShowTime_M.objects.filter(ShowTime_ID=showtime_id)
            serializer = ShowtimeGetSerializer(queryset, many=True)
            return Response(serializer.data)


        if movie:
            queryset = queryset.filter(M_ID=movie)

        if theater:
            queryset = queryset.filter(Screen_M__T_ID=theater)

        if movie_type:
            queryset = queryset.filter(M_Type=movie_type)

        if language:
            queryset = queryset.filter(M_Language=language)

        serializer = ShowtimeGetSerializer(queryset, many=True)
        return Response(serializer.data)
    
    def post(self,request):
        serializer = ShowtimePostSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'msg':'showtime added'},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, *args, **kwargs):
        # Add logic for updating a music instance if needed
        showtime_id = kwargs.get('pk')
        instance = get_object_or_404(ShowTime_M, ShowTime_ID=showtime_id)
        serializer = ShowtimePostSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        showtime_id = kwargs.get('pk')
        instance = get_object_or_404(ShowTime_M, ShowTime_ID=showtime_id)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)   
       


class SeatTypeList(viewsets.ModelViewSet):
   # permission_classes = [IsAuthenticated]
    queryset = SeatType.objects.all()
    serializer_class = SeatTypeSerializer


class SeatPriceList(viewsets.ModelViewSet):
   # permission_classes = [IsAuthenticated]
    queryset = SeatPrice.objects.all()
    serializer_class = SeatPriceSerializer
    


class Payment_ModeList(viewsets.ModelViewSet):
   # permission_classes = [IsAuthenticated]
    queryset = Payment_Mode.objects.all()
    serializer_class = Payment_ModeSerializer
    
class SeatList(APIView):
   # permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        screen = self.request.query_params.get('screen')
        queryset = Seat_M.objects.all()
        seat_id = kwargs.get('pk')

        if seat_id is not None:
            theater = get_object_or_404(Seat_M, pk=seat_id)
            serializer = SeatGetSerializer(theater)
            return Response(serializer.data)

        if screen:
            queryset = queryset.filter(Screen_ID=screen)

        serializer = SeatGetSerializer(queryset, many=True)
        return Response(serializer.data)
    
    def post(self,request):
        serializer = SeatPostSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'msg':'seat added'},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, *args, **kwargs):
        # Add logic for updating a music instance if needed
        seat_id = kwargs.get('pk')
        instance = get_object_or_404(Seat_M, Seat_ID=seat_id)
        serializer = SeatPostSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        seat_id = kwargs.get('pk')
        instance = get_object_or_404(Seat_M, Seat_ID=seat_id)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)   
       
    
class ScreenList(APIView):
   # permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        screen = self.request.query_params.get('screen')
        queryset = Screen_M.objects.all()
        screen_id = kwargs.get('pk')

        if screen_id is not None:
            screen = get_object_or_404(Screen_M, pk=screen_id)
            serializer = ScreenGetSerializer(screen)
            return Response(serializer.data)

        if screen:
            queryset = queryset.filter(T_ID=screen)

        serializer = ScreenGetSerializer(queryset, many=True)
        return Response(serializer.data)
    
    def post(self,request):
        serializer = ScreenPostSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'msg':'screen added'},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, *args, **kwargs):
        # Add logic for updating a music instance if needed
        screen_id = kwargs.get('pk')
        instance = get_object_or_404(Screen_M, Screen_ID=screen_id)
        serializer = ScreenPostSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        screen_id = kwargs.get('pk')
        instance = get_object_or_404(Screen_M, Screen_ID=screen_id)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)   
       


# class SeatInShowtimeList(generics.ListAPIView):
class SeatInShowtimeList(viewsets.ModelViewSet):
   # permission_classes = [IsAuthenticated]
    serializer_class = SeatInShowtimeSerializer

    def get_queryset(self):
        showtime_id = self.kwargs['showtime_id']
        return SeatInShowtime.objects.filter(showtime_id=showtime_id)
    

    
class TheaterList(APIView):
   # permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        theater_id = kwargs.get('pk')
        movie = self.request.query_params.get('movie')

        if theater_id is not None:
            theater = get_object_or_404(Theater_M, pk=theater_id)
            serializer = TheaterSerializer(theater)
            return Response(serializer.data)

        if movie is not None:
            movies = Theater_M.objects.filter(screens__showtimes__M_ID__M_ID=movie)
            serializer = TheaterSerializer(movies,many=True)
            return Response(serializer.data)
        
        movies = Theater_M.objects.all()
        serializer = TheaterSerializer(movies, many=True)
        return Response(serializer.data)
    
    def post(self,request):
        serializer = TheaterSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'msg':'Theater added'},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, *args, **kwargs):
        # Add logic for updating a music instance if needed
        theater_id = kwargs.get('pk')
        instance = get_object_or_404(Theater_M, T_ID=theater_id)
        serializer = TheaterSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        theater_id = kwargs.get('pk')
        instance = get_object_or_404(Theater_M, T_ID=theater_id)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ComplaintView(APIView):
    def post(self, request):
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "")

        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token.get("user_id", None)

            if user_id:
                user = User.objects.get(pk=user_id)
                request_data = {**request.data, 'User_ID': user_id}
                serializer = ComplaintPostSerializer(data=request_data)

                if serializer.is_valid(raise_exception=True):
                    serializer.save()
                    return Response({'msg': 'Complaint Submitted'}, status=status.HTTP_201_CREATED)
            else:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except jwt.ExpiredSignatureError:
            return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def get(self, request, *args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "")

        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token.get("user_id", None)

            if user_id:
                complaint_id = kwargs.get('pk')
                movie = request.query_params.get('movie')
                theater = request.query_params.get('theater')

                if complaint_id is not None:
                    complaint = get_object_or_404(Complaint_MB, pk=complaint_id)
                    serializer = ComplaintGetSerializer(complaint)
                    return Response(serializer.data)

                if movie is not None:
                    complaints = Complaint_MB.objects.filter(M_ID=movie, User_ID=user_id)
                    serializer = ComplaintGetSerializer(complaints, many=True)
                    return Response(serializer.data)

                if theater is not None:
                    complaints = Complaint_MB.objects.filter(T_ID=theater, User_ID=user_id)
                    serializer = ComplaintGetSerializer(complaints, many=True)
                    return Response(serializer.data)
                
                complaints = Complaint_MB.objects.filter(User_ID=user_id)
                serializer = ComplaintGetSerializer(complaints, many=True)
                return Response(serializer.data)
            else:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except jwt.ExpiredSignatureError:
            return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
          
    def patch(self, request, *args, **kwargs):
        complaint_id = kwargs.get('pk')
        instance = get_object_or_404(Complaint_MB, Complaint_ID=complaint_id)
        serializer = ComplaintPostSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        complaint_id = kwargs.get('pk')
        instance = get_object_or_404(Complaint_MB, Complaint_ID=complaint_id)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class BookingSeatView(APIView):
   # permission_classes = [IsAuthenticated]
    def post(self,request):
        # serializer = ComplaintGetSerializer(data=request.data)

        b_id = request.data.get('B_ID')

        try:
            # Retrieve the specific music instance
            b_id = Booking_M.objects.get(B_ID=b_id)
        except Booking_M.DoesNotExist:
            return Response({"detail": "Booking does not exist."},
                            status=status.HTTP_404_NOT_FOUND)

        seat_ids = request.data.get('seat_ids', [])
        for seat_id in seat_ids:
            try:
                seat = SeatInShowtime.objects.get(id=seat_id)
                print(seat)
                Booking_Seat_M.objects.create(B_ID=b_id, Seat_ID=seat)
            except SeatInShowtime.DoesNotExist:
                return Response({"detail": f"Seat with ID {seat_id} does not exist."},
                                status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "Artists added successfully."},
                        status=status.HTTP_201_CREATED)
        # serializer = BookingSeatPostSerializer(data=request.data)
        # if serializer.is_valid(raise_exception=True):
        #     serializer.save()
        #     # Complaint_MB=serializer.save()
        #     return Response({'msg':'Seat Submitted'},status=status.HTTP_201_CREATED)
        # return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
               
        complaint = Booking_Seat_M.objects.all()
        serializer = BookingSeatGetSerializer(complaint, many=True)
        return Response(serializer.data)




# class BookingView(APIView):
#     def post(self,request):

#         user_id = request.user.id
#         request_data = {**request.data, 'User_ID': user_id}

       
#         serializer = BookingPostSerializer(data=request_data)

#         if serializer.is_valid(raise_exception=True):
#             serializer.save()
#             return Response({'msg':'Booking Succesfull'},status=status.HTTP_201_CREATED)
#         return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

#     def get(self, request, *args, **kwargs):
#         user =request.user
#         complaint = Booking_M.objects.filter(User_ID=user)
#         serializer = BookingGetSerializer(complaint, many=True)
#         return Response(serializer.data)

import jwt
from rest_framework.exceptions import NotFound
class BookingView(APIView):
    

    def post(self, request):
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "")

        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token.get("user_id", None)

            user = User.objects.get(pk=user_id)
            
            request_data = {**request.data, 'User_ID': user_id}
            serializer = BookingPostSerializer(data=request_data)

            if serializer.is_valid(raise_exception=True):
                booking_instance = serializer.save()
                # Fetch B_ID of the newly created booking instance
                b_id = booking_instance.B_ID
                return Response({'B_ID': b_id}, status=status.HTTP_201_CREATED)

        except jwt.ExpiredSignatureError:
            return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, pk=None):
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "")

        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token.get("user_id", None)

            if pk is not None:
                # Retrieve a single booking by pk
                booking = Booking_M.objects.filter(User_ID=user_id, pk=pk).first()
                if booking:
                    serializer = BookingGetSerializer(booking)
                    return Response(serializer.data)
                else:
                    return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)
            else:
                # Retrieve all bookings for the user
                complaints = Booking_M.objects.filter(User_ID=user_id)
                serializer = BookingGetSerializer(complaints, many=True)
                return Response(serializer.data)
        except jwt.ExpiredSignatureError:
            return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
        

# class Rate_MBGetList(viewsets.ModelViewSet):
#     queryset = Rate_MB.objects.all()
#     serializer_class = Rate_MBGetSerializer

class Rate_MBGetList(viewsets.ModelViewSet):
    serializer_class = Rate_MBGetSerializer

    def get_queryset(self):
        queryset = Rate_MB.objects.all()
        
        User_ID = self.request.query_params.get('User_ID', None)
        
        if User_ID is not None:
            queryset = queryset.filter(User_ID=User_ID)
        

        M_ID = self.request.query_params.get('M_ID', None)
        
        if M_ID is not None:
            queryset = queryset.filter(M_ID=M_ID)
        
        return queryset

from rest_framework.response import Response
from rest_framework import status


class Rate_MBList(viewsets.ModelViewSet):
    serializer_class = Rate_MBSerializer

    def get_queryset(self):
        queryset = Rate_MB.objects.all()
        movie_id = self.request.query_params.get('M_ID', None)
        
        if movie_id is not None:
            queryset = queryset.filter(M_ID=movie_id)
        
        return queryset

    def get_average_rating(self, movie_id):
        # Retrieve ratings for the movie
        ratings = Rate_MB.objects.filter(M_ID=movie_id).values_list('Rate_Movie', flat=True)
        
        # Calculate average rating
        average_rating = sum(ratings) / len(ratings) if ratings else 0
        
        return average_rating

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        movie_id = self.request.query_params.get('M_ID', None)
        if movie_id is not None:
            # Calculate average rating for the specified movie
            average_rating = self.get_average_rating(movie_id)
            # Create a dictionary with M_ID and average_rating
            response_data = {'M_ID': movie_id, 'average_rating': average_rating}
            return Response(response_data)
        
        # If M_ID is not provided, return an empty response
        return Response({})

