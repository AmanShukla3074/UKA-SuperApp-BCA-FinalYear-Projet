from django.db import models
from django.contrib.auth.models import AbstractUser,BaseUserManager,Group

# Create your models here.
class CustomUserManager(BaseUserManager):
    def create_user(self, mobile_no, password=None, **extra_fields):
        if not mobile_no:           #----if mobile_no is not recieved ------
            raise ValueError('The mobile number must be set')
        user = self.model(mobile_no=mobile_no, **extra_fields)
        user.set_password(password) #-----------password encryption using inbuilt set_password method
        user.save(using=self._db)
        return user

    def create_superuser(self, mobile_no, password=None, **extra_fields):
        # Ensure the user is created as a superuser
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
       


        return self.create_user(mobile_no, password, **extra_fields)
    
#other models role date:9/01***********

class Roles(models.Model):
    RoleID = models.AutoField(primary_key=True)
    Role_Name = models.CharField(max_length=30,null=True)

    def __str__(self):
        return f"{self.RoleID}: {self.Role_Name}"

class Status(models.Model):
    StatusID = models.AutoField(primary_key=True)
    Status_Name = models.CharField(max_length=30)
    
    def __str__(self):
        return self.Status_Name

class State(models.Model):
    StateID = models.AutoField(primary_key=True)
    State=models.CharField(max_length=30,null = True)

    def __str__(self):
        return str(self.State)
        # return self.State

class City(models.Model):
    CityID = models.AutoField(primary_key=True)
    City = models.CharField(max_length=30 , null=True)
    State = models.ForeignKey(State,on_delete=models.CASCADE,null=True)
    
    def __str__(self):
        return str(self.City)




class User(AbstractUser):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    username = None

    mobile_no = models.CharField(max_length=10,unique=True)
    is_mobile_verified = models.BooleanField(default=False)
    otp = models.CharField(max_length=6,null=True)#, blank=True, )
    
    password = models.CharField(max_length=100)
    email = models.CharField(max_length=50,blank=True,null=True) 
    dob = models.DateField(null=True, blank=True)

    #Date : 9/01
    Profile_Picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    Gender = models.CharField(max_length=15,null=True, choices=[('Male', 'Male'), ('Female', 'Female')])
    Role = models.ForeignKey(Roles,on_delete=models.CASCADE,null=True)
    Status = models.ForeignKey(Status,on_delete=models.CASCADE,null=True)
    
    groups = models.ManyToManyField(
        Group,
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.'
    )

    USERNAME_FIELD = 'mobile_no'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()
    def __str__(self):
        return self.mobile_no

   
    
class Address(models.Model):
    AddressID = models.AutoField(primary_key=True) 
    House_Add = models.CharField(max_length=50,null=True)
    Street_Add = models.CharField(max_length=150,null=True)
    Landmark = models.CharField(max_length=50,null=True)
    Pincode = models.CharField(max_length=6,null=True)
    City = models.ForeignKey(City,on_delete=models.SET_NULL,null=True) 
    User = models.ForeignKey(User,on_delete=models.CASCADE,null=True) 

    def __str__(self):
        # return f"AddressID: {self.AddressID}, Address: {self.Address}"
        return f"{self.User} - {str(self.AddressID)}"
    


# {
# "first_name":"Kris",
# "last_name":"Solanki",
# "mobile_no":"9054395987",
# "password":"krisOP",
# "email":"krisslonaki28@gmail.com",
# "dob":"1990-12-12",
# "Gender":"Male",
# "Role":{
#   "Role_Name":"Customer"
# },
# "Status":{
#   "Status_Name":"Online"
# }
# }

    
    