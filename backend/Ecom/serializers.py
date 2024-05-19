from rest_framework import serializers
from .models import *
from account.serializers import UserSerializer

class CategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model=Categories
        fields="__all__"

class Product_ImgSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product_Img
        fields = '__all__'

class Product_Size_MSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product_Size_M
        fields = '__all__'

class Product_SizeSerializer(serializers.ModelSerializer):
    size = Product_Size_MSerializer(read_only=True)   
    class Meta:
        model = Product_Size
        fields = '__all__'

class Product_SizePostSerializer(serializers.ModelSerializer):  
    class Meta:
        model = Product_Size
        fields = '__all__'

class Product_Color_MSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product_Color_M
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    Category = CategoriesSerializer()
    Color = Product_Color_MSerializer()
    Size = serializers.SerializerMethodField()
    Images = serializers.SerializerMethodField()

    def get_Images(self,obj):
        product_img = Product_Img.objects.filter(Product_ID=obj)
        serializer = Product_ImgSerializer(product_img, many=True)
        return serializer.data 

    def get_Size(self,obj):
        product_size = Product_Size.objects.filter(Product_ID=obj)
        serializer = Product_SizeSerializer(product_size, many=True)
        return serializer.data      
      
    class Meta:
        model=Product_M
        fields=['P_ID','P_Name','P_Desc','P_Price','Category','Color','Size','Images']

class ProductPostSerializer(serializers.ModelSerializer):

    class Meta:
        model=Product_M
        fields='__all__'


class Status_MSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status_M
        fields = '__all__'

class Offer_MSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer_M
        fields = '__all__'

class Payment_ModeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment_Mode
        fields = '__all__'


class Product_RateReview_MSerializer(serializers.ModelSerializer):
    User_ID = UserSerializer()
    class Meta:
        model = Product_RateReview_M
        fields = '__all__'

class Product_RateReview_MPostSerializer(serializers.ModelSerializer):
    # User_ID = UserSerializer()
    class Meta:
        model = Product_RateReview_M
        fields = '__all__'



class Cart_DetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart_Details
        fields = '__all__'
        # fields = ['CartDetailsID','ItemQuantity','Subtotal','Item_ID','Offer_ID','Cart_ID']


class Cart_MSerializer(serializers.ModelSerializer):
    Cart_ID = Cart_DetailsSerializer(many=True,read_only=True)

    class Meta:
        model = Cart_M
        fields = '__all__'


class Order_DetailsSerializer(serializers.ModelSerializer):
    P_ID=ProductSerializer()
    class Meta:
        model = Order_Details
        fields = '__all__'

class Order_MSerializer(serializers.ModelSerializer):


    class Meta:
        model = Order_M
        fields = '__all__'
        extra_kwargs = {
            'User_ID': {'required': False},
        }

from account.serializers import AddressGetSerializer

class Order_MGetSerializer(serializers.ModelSerializer):
    order_details = serializers.SerializerMethodField()
    Status_ID = Status_MSerializer()
    Address_ID = AddressGetSerializer()
    class Meta:
        model = Order_M
        fields = ['OrderID', 'Address_ID','OrderDate', 'Total', 'User_ID', 'Status_ID', 'order_details']
        extra_kwargs = {
            'User_ID': {'required': False},
        }

    def get_order_details(self,obj):
        order_details = Order_Details.objects.filter(Order_ID=obj)
        serializer = Order_DetailsSerializer(order_details, many=True)
        return serializer.data    
    

class Complaint_ECSerializer(serializers.ModelSerializer):
    User_ID = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Complaint_EC
        fields = ['Complaint_ID', 'User_ID', 'Order_ID', 'Complaint_Desc', 'Complaint_Date']



class Wishlist_MSerializer(serializers.ModelSerializer):
    User_ID = UserSerializer()
    P_ID = ProductSerializer()
    class Meta:
        model = Wishlist_M
        fields = '__all__'

class Wishlist_MPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wishlist_M
        fields = '__all__'