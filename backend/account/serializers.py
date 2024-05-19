from rest_framework import serializers
from rest_framework_simplejwt.tokens import Token
from .models import User,Roles,Address,City,State,Status
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer #date :7/01/2024
from rest_framework_simplejwt.views import TokenObtainPairView


class RolesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roles
        fields = '__all__'

class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = '__all__'




class UserSerializer(serializers.ModelSerializer):
    Role = RolesSerializer()
    Status = StatusSerializer()
    # Address = AddressSerializer(many = True)
    class Meta:
        model = User
        fields = '__all__'
        # fields = ['id','first_name','last_name','mobile_no','password','email','dob','Profile_Picture','Gender','Role','Status']
        extra_kwargs = { #------------  to hide passw0rd inshort hashed 
            'password' : {'write_only': True}
        }#---------------------continue-----
    
    def create(self, validated_data):#validated_data: is all the //fields are provided then this will pass
        # print(validated_data)
        password = validated_data.pop('password',None)
        role_data = validated_data.pop('Role', {})
        status_data = validated_data.pop('Status', {})
        
        # Extract the Role instance
        role_name = role_data.get('Role_Name')
        # role_instance = Roles.objects.get(RoleID=role_id)
        # print("&&&&&&&&&&&&&&&&&&&&&&")
        # print(role_Name)
        # print(role_data)
        try:
            role_instance = Roles.objects.get(Role_Name=role_name)
        except Roles.DoesNotExist:
            raise ValueError(f"Role with Role_Name={role_name} does not exist")
        
        # Extract or create the Status instance
        status_name = status_data.get('Status_Name')
        # status_instance = Status.objects.get(StatusID=status_id)
        try:
            status_instance = Status.objects.get(Status_Name=status_name)
        except Status.DoesNotExist:
            raise ValueError(f"Status with Status_Name={status_name} does not exist")


        #address_data = validated_data.pop('Address', [])
        #instance = self.Meta.model(**validated_data) #**validated_data = extracted data without password
        instance = self.Meta.model(Role=role_instance, Status=status_instance, **validated_data)
        if password is not None:
            instance.set_password(password)
            
        instance.save()
        return instance
    
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user) # super(): to ensure that any changes made in the future to the get_token method in the TokenObtainPairSerializer class will automatically be reflected in MyObtainPairSerializer without duplicating the code
    
        #Add custom claims
        token['username'] = user.get_full_name()
        # token['Role'] = user.Role.name
        if hasattr(user, 'Role'):
            # If 'Role' is a model instance, you might want to serialize it to a string
            # or a dictionary. Here, we're assuming it has a 'name' attribute.
            token['Role'] = user.Role.Role_Name if user.Role else None
        else:
            # If 'Role' is not an attribute of the user, handle accordingly
            token['Role'] = None
        

        return token
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer



class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model=State
        fields = '__all__'
    
class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = '__all__'
    
class CityGetSerializer(serializers.ModelSerializer):
    State = StateSerializer()
    class Meta:
        model = City
        fields = '__all__'


class AddressSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Address
        fields = '__all__'

class AddressGetSerializer(serializers.ModelSerializer):
    # City_ID = serializers.PrimaryKeyRelatedField(source='City.CityID', read_only=True)
    # City_Name = serializers.CharField(source='City.City', read_only=True)
    City=CitySerializer()
    U_FName = serializers.CharField(source='User.first_name', read_only=True)
    U_LName = serializers.CharField(source='User.last_name', read_only=True)
    class Meta:
        model = Address
        fields = ['AddressID','User','U_FName','U_LName','House_Add','Street_Add','Landmark','Pincode','City']


# class ChangePasswordSerializer(serializers.Serializer):
#     old_password = serializers.CharField(required=True)
#     new_password = serializers.CharField(required=True)
#     confirm_password = serializers.CharField(required=True)

#     def validate(self, attrs):
#         if attrs['new_password'] != attrs['confirm_password']:
#             raise serializers.ValidationError("New passwords must match")
#         return attrs

#     def validate_old_password(self, value):
#         user = self.context['request'].user
#         if not user.check_password(value):
#             raise serializers.ValidationError("Old password is not correct")
#         return value

from django.contrib.auth import get_user_model


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError("New passwords must match")
        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user

        # Check if the user is authenticated before validating the old password
        if not isinstance(user, get_user_model()):
            return value

        if not user.check_password(value):
            raise serializers.ValidationError("Old password is not correct")
        return value


class ForgetPasswordSerializer(serializers.Serializer):
    mobileno=serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)
    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError("New passwords must match")
        return attrs
    

class MobileNumberSerializer(serializers.Serializer):
    mobile_no = serializers.CharField(max_length=15)


class MobileNumberSerializer2(serializers.Serializer):
    mobile_no = serializers.CharField(max_length=15)
    otp = serializers.CharField(max_length=6)