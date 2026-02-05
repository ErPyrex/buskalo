from django.db import models
from django.conf import settings
from django.utils.text import slugify
import uuid
from api.validators import validate_file_size, validate_image_extension


def shop_image_path(instance, filename):
    ext = filename.split(".")[-1]
    name = slugify(instance.name)
    # Use uuid to ensure uniqueness and availability even if no ID yet
    uid = uuid.uuid4().hex[:8]
    return f"shops/{name}_{uid}.{ext}"


def product_image_path(instance, filename):
    ext = filename.split(".")[-1]
    shop_name = slugify(instance.shop.name)
    prod_name = slugify(instance.name)
    uid = uuid.uuid4().hex[:8]
    return f"products/{shop_name}/{prod_name}_{uid}.{ext}"


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Shop(models.Model):
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("active", "Active"),
    ]
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="shops"
    )
    name = models.CharField(max_length=255, db_index=True)
    location = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    image = models.ImageField(
        upload_to=shop_image_path, 
        null=True, 
        blank=True,
        validators=[validate_file_size, validate_image_extension]
    )
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    is_physical = models.BooleanField(default=True)
    status = models.CharField(
        max_length=10, 
        choices=STATUS_CHOICES, 
        default="active",
        db_index=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name="products")
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, related_name="products"
    )
    name = models.CharField(max_length=255, db_index=True)
    description = models.TextField(blank=True)
    image = models.ImageField(
        upload_to=product_image_path, 
        null=True, 
        blank=True,
        validators=[validate_file_size, validate_image_extension]
    )
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    is_infinite_stock = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.shop.name})"
