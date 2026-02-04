from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import models
from .models import Shop, Product, Category
from .serializers import ShopSerializer, ProductSerializer, CategorySerializer


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        owner = getattr(obj, "owner", None) or getattr(obj.shop, "owner", None)
        return owner == request.user


class ShopViewSet(viewsets.ModelViewSet):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=["post"])
    def reset(self, request, pk=None):
        shop = self.get_object()
        # Delete all products
        shop.products.all().delete()
        # Reset shop fields
        shop.description = ""
        shop.location = "Tienda en línea"
        shop.latitude = None
        shop.longitude = None
        shop.is_physical = False
        shop.image = None
        shop.status = "draft"
        shop.save()

        return Response({"status": "shop reset successful"}, status=status.HTTP_200_OK)

    def get_queryset(self):
        user = self.request.user
        queryset = Shop.objects.all()

        # Filtering logic
        owner_id = self.request.query_params.get("owner")
        status_param = self.request.query_params.get("status")

        if user.is_authenticated:
            # If the user is authenticated, they can see:
            # 1. All their own shops (Draft or Active)
            # 2. Active shops from everyone else
            # We use a Q object to combine these
            queryset = queryset.filter(models.Q(owner=user) | models.Q(status="active"))
        else:
            # Guests only see active shops
            queryset = queryset.filter(status="active")

        # Apply optional filters
        if owner_id:
            queryset = queryset.filter(owner_id=owner_id)

        if status_param:
            queryset = queryset.filter(status=status_param)

        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(
                models.Q(name__icontains=search)
                | models.Q(description__icontains=search)
            )

        return queryset


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_queryset(self):
        queryset = Product.objects.all()
        shop_id = self.request.query_params.get("shop_id")
        search = self.request.query_params.get("search")

        if shop_id:
            queryset = queryset.filter(shop_id=shop_id)

        if search:
            queryset = queryset.filter(
                models.Q(name__icontains=search)
                | models.Q(description__icontains=search)
            )

        if not shop_id:
            queryset = queryset.filter(shop__status="active")

        return queryset


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
