from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.text import slugify
import uuid


def user_avatar_path(instance, filename):
    ext = filename.split(".")[-1]
    name = slugify(instance.username)
    uid = uuid.uuid4().hex[:8]
    return f"avatars/{name}_{uid}.{ext}"


class User(AbstractUser):
    bio = models.TextField(max_length=500, blank=True)
    avatar = models.ImageField(upload_to=user_avatar_path, null=True, blank=True)

    def __str__(self):
        return self.username
