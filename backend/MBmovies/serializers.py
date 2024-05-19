from rest_framework import serializers
from .models import *

class Movie_ImgSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie_Img
        fields = '__all__'

    def get_img_filename(self, obj):
        return obj.img.name.split('/')[-1]

class MovieSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()
    def get_images(self,obj):
        movie_Img = Movie_Img.objects.filter(M_ID=obj)
        serializer = Movie_ImgSerializer(movie_Img, many=True)
        return serializer.data 

    class Meta:
        model=Movie_M
        fields=['M_ID','M_Name','M_Duration','M_Synopsis','M_Age_Certification','M_ReleaseDate','images']

class Movie_Director_MSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie_Director_M
        fields ='__all__'

class Movie_DirectorSerializer(serializers.ModelSerializer):
    Director_ID = Movie_Director_MSerializer()
    class Meta:
        model = Movie_Director
        fields = ['Md_ID','M_ID','Director_ID']



class Movie_Producer_MSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie_Producer_M
        fields ='__all__'

class Movie_ProducerSerializer(serializers.ModelSerializer):

    Producer_ID = Movie_Producer_MSerializer()
    class Meta:
        model = Movie_Producer
        fields = '__all__'




class Movie_Cast_MSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie_Cast_M
        fields ='__all__'

class Movie_CastSerializer(serializers.ModelSerializer):

    Cast_ID = Movie_Cast_MSerializer()
    class Meta:
        model = Movie_Cast
        fields = '__all__'




class Movie_Genre_MSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie_Genre_M
        fields ='__all__'

class Movie_GenreSerializer(serializers.ModelSerializer):

    Genre_ID = Movie_Genre_MSerializer()
    class Meta:
        model = Movie_Genre
        fields = '__all__'




class Movie_Language_MSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie_Language_M
        fields ='__all__'

class Movie_LanguageSerializer(serializers.ModelSerializer):

    Language_ID = Movie_Language_MSerializer()
    class Meta:
        model = Movie_Language
        fields = '__all__'


class Movie_Type_MSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie_Type_M
        fields ='__all__'

class Movie_TypeSerializer(serializers.ModelSerializer):

    Type_ID = Movie_Type_MSerializer()
    class Meta:
        model = Movie_Type
        fields = '__all__'



class MovieDetailsSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()
    director = serializers.SerializerMethodField()
    producer = serializers.SerializerMethodField()
    cast = serializers.SerializerMethodField()
    genre = serializers.SerializerMethodField()
    language = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()


    def get_images(self,obj):
        movie_Img = Movie_Img.objects.filter(M_ID=obj)
        serializer = Movie_ImgSerializer(movie_Img, many=True)
        return serializer.data 

    def get_director(self,obj):
        directors = Movie_Director.objects.filter(M_ID=obj)
        serializer = Movie_DirectorSerializer(directors, many=True)
        return serializer.data 

    def get_producer(self,obj):
        producers = Movie_Producer.objects.filter(M_ID=obj)
        serializer = Movie_ProducerSerializer(producers, many=True)
        return serializer.data 

    def get_cast(self,obj):
        casts = Movie_Cast.objects.filter(M_ID=obj)
        serializer = Movie_CastSerializer(casts, many=True)
        return serializer.data 

    def get_genre(self,obj):
        genres = Movie_Genre.objects.filter(M_ID=obj)
        serializer = Movie_GenreSerializer(genres, many=True)
        return serializer.data 

    def get_language(self,obj):
        languages = Movie_Language.objects.filter(M_ID=obj)
        serializer = Movie_LanguageSerializer(languages, many=True)
        return serializer.data 

    def get_type(self,obj):
        types = Movie_Type.objects.filter(M_ID=obj)
        serializer = Movie_TypeSerializer(types, many=True)
        return serializer.data 

    class Meta:
        model=Movie_M
        fields=['M_ID','M_Name','M_Duration','M_Synopsis','M_Age_Certification','M_ReleaseDate','images','director','producer','cast','genre','language','type']


        