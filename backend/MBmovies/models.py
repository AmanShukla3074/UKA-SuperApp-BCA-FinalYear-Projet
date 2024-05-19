from django.db import models

class Movie_M(models.Model):
    M_ID = models.AutoField(primary_key=True)
    M_Name = models.CharField(max_length=90,null=False,blank=False)
    M_Duration = models.CharField(max_length=10,null=False,blank=False)
    M_Synopsis = models.TextField(null=True,blank=True)
    M_Age_Certification = models.CharField(max_length=12,null=False,blank=False)
    M_ReleaseDate = models.DateField(null=False,blank=False)
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.M_Name
    

class Movie_Img(models.Model):
    Img_id = models.AutoField(primary_key=True)
    M_ID = models.ForeignKey(Movie_M, on_delete=models.CASCADE,null=False,blank=False)
    img = models.ImageField(upload_to='Movie_images/',default='default_image.jpg',null=False,blank=False)

    def get_img_url(self):
        return self.img.url
    def __str__(self):
        return f'{self.M_ID.M_Name} - {self.img.name.split("/")[-1]}'

        # return f'{self.M_ID.M_Name} - {self.img.name}'
    

class Movie_Director_M(models.Model):
    Director_ID = models.AutoField(primary_key=True)
    Director_Name = models.CharField(max_length=50,null=False,blank=False)
    Director_img = models.ImageField(upload_to='Movie_Director_images/',default='default_image.jpg',null=False,blank=False)

    def get_img_url(self):
        return self.Director_img.url
    def __str__(self):
        return f'{self.Director_Name}'

class Movie_Director(models.Model):
    Md_ID = models.AutoField(primary_key=True)
    M_ID = models.ForeignKey(Movie_M, on_delete=models.CASCADE,null=False,blank=False)
    Director_ID = models.ForeignKey(Movie_Director_M, on_delete=models.CASCADE,null=False,blank=False)

    def __str__(self):
        return f'{self.M_ID.M_Name} - {self.Director_ID.Director_Name}'
    

class Movie_Producer_M(models.Model):
    Producer_ID = models.AutoField(primary_key=True)
    Producer_Name = models.CharField(max_length=50,null=False,blank=False)
    Producer_img = models.ImageField(upload_to='Movie_Producer_images/',default='default_image.jpg',null=False,blank=False)

    def get_img_url(self):
        return self.Producer_img.url
    def __str__(self):
        return f'{self.Producer_Name}'

class Movie_Producer(models.Model):
    Mp_ID = models.AutoField(primary_key=True)
    M_ID = models.ForeignKey(Movie_M, on_delete=models.CASCADE,null=False,blank=False)
    Producer_ID = models.ForeignKey(Movie_Producer_M, on_delete=models.CASCADE,null=False,blank=False)

    def __str__(self):
        return f'{self.M_ID.M_Name} - {self.Producer_ID.Producer_Name}'
 

class Movie_Cast_M(models.Model):
    Cast_ID = models.AutoField(primary_key=True)
    Cast_Name = models.CharField(max_length=50,null=False,blank=False)
    Cast_img = models.ImageField(upload_to='Movie_Cast_images/',default='default_image.jpg',null=False,blank=False)

    def get_img_url(self):
        return self.Cast_img.url
    def __str__(self):
        return f'{self.Cast_Name}'

class Movie_Cast(models.Model):
    MCast_ID = models.AutoField(primary_key=True)
    M_ID = models.ForeignKey(Movie_M, on_delete=models.CASCADE,null=False,blank=False)
    Cast_ID = models.ForeignKey(Movie_Cast_M, on_delete=models.CASCADE,null=False,blank=False)

    def __str__(self):
        return f'{self.M_ID.M_Name} - {self.Cast_ID.Cast_Name}'


class Movie_Genre_M(models.Model):
    Genre_ID = models.AutoField(primary_key=True)
    Genre_Name = models.CharField(max_length=50,null=False,blank=False)
    
    def __str__(self):
        return f'{self.Genre_Name}'


class Movie_Genre(models.Model):
    MGenre_ID = models.AutoField(primary_key=True)
    M_ID = models.ForeignKey(Movie_M, on_delete=models.CASCADE,null=False,blank=False)
    Genre_ID = models.ForeignKey(Movie_Genre_M, on_delete=models.CASCADE,null=False,blank=False)

    def __str__(self):
        return f'{self.M_ID.M_Name} - {self.Genre_ID.Genre_Name}'

class Movie_Language_M(models.Model):
    Language_ID = models.AutoField(primary_key=True)
    Language_Name = models.CharField(max_length=50,null=False,blank=False)
    
    def __str__(self):
        return f'{self.Language_Name}'

class Movie_Language(models.Model):
    MLanguage_ID = models.AutoField(primary_key=True)
    M_ID = models.ForeignKey(Movie_M, on_delete=models.CASCADE,null=False,blank=False)
    Language_ID = models.ForeignKey(Movie_Language_M, on_delete=models.CASCADE,null=False,blank=False)

    def __str__(self):
        return f'{self.M_ID.M_Name} - {self.Language_ID.Language_Name}'

class Movie_Type_M(models.Model):
    Type_ID = models.AutoField(primary_key=True)
    Type_Name = models.CharField(max_length=50,null=False,blank=False)
    
    def __str__(self):
        return f'{self.Type_Name}'

class Movie_Type(models.Model):
    MType_ID = models.AutoField(primary_key=True)
    M_ID = models.ForeignKey(Movie_M, on_delete=models.CASCADE,null=False,blank=False)
    Type_ID = models.ForeignKey(Movie_Type_M, on_delete=models.CASCADE,null=False,blank=False)

    def __str__(self):
        return f'{self.M_ID.M_Name} - {self.Type_ID.Type_Name}'
