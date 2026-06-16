from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True)
    profile_picture = models.ImageField(
        upload_to='profile_pics/', 
        blank=True, 
        null=True
    )

    USERNAME_FIELD = 'email'        # login with email not username
    REQUIRED_FIELDS = ['username']  # still keep username

    def __str__(self):
        return self.email