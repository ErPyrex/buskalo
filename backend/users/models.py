from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Add any extra fields if needed
    bio = models.TextField(max_length=500, blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)

    def __str__(self):
        return self.username
