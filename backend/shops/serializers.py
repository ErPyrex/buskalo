from rest_framework import serializers
from .models import Shop, Product, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source="category.name")

    class Meta:
        model = Product
        fields = (
            "id",
            "shop",
            "category",
            "category_name",
            "name",
            "description",
            "price",
            "stock",
            "created_at",
        )
        read_only_fields = ("created_at",)


class ShopSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source="owner.username")
    products = ProductSerializer(many=True, read_only=True)

    class Meta:
        model = Shop
        fields = (
            "id",
            "owner",
            "owner_username",
            "name",
            "location",
            "description",
            "status",
            "products",
            "created_at",
        )
        read_only_fields = ("owner", "created_at")
