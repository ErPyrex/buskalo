from rest_framework import serializers
from .models import Shop, Product, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source="category.name")
    shop_name = serializers.ReadOnlyField(source="shop.name")
    shop_location = serializers.ReadOnlyField(source="shop.location")

    class Meta:
        model = Product
        fields = (
            "id",
            "shop",
            "shop_name",
            "shop_location",
            "category",
            "category_name",
            "name",
            "description",
            "image",
            "price",
            "stock",
            "is_infinite_stock",
            "created_at",
        )
        read_only_fields = ("created_at",)
        extra_kwargs = {
            "description": {"max_length": 1000},
        }


class ShopSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source="owner.username")
    owner_avatar = serializers.ImageField(source="owner.avatar", read_only=True)
    products = ProductSerializer(many=True, read_only=True)

    class Meta:
        model = Shop
        fields = (
            "id",
            "owner",
            "owner_username",
            "owner_avatar",
            "name",
            "location",
            "latitude",
            "longitude",
            "is_physical",
            "description",
            "image",
            "status",
            "products",
            "created_at",
        )
        read_only_fields = ("owner", "created_at")
        extra_kwargs = {
            "description": {"max_length": 2000},
        }
