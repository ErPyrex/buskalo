from rest_framework import viewsets, permissions
from django.db import models
from .models import Shop, Product, Category
from .serializers import ShopSerializer, ProductSerializer, CategorySerializer


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        # For shops, obj.owner exists. For products, obj.shop.owner exists.
        owner = getattr(obj, "owner", None) or getattr(obj.shop, "owner", None)
        return owner == request.user


class ShopViewSet(viewsets.ModelViewSet):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        queryset = Shop.objects.all()
        owner_id = self.request.query_params.get("owner")
        status = self.request.query_params.get("status")

        if owner_id:
            queryset = queryset.filter(owner_id=owner_id)
            # If a status is specified, filter by it. 
            # If not, and it's NOT the owner requesting, only active.
            # If it IS the owner, allow seeing drafts.
            if status:
                queryset = queryset.filter(status=status)
            elif str(self.request.user.id) != owner_id:
                queryset = queryset.filter(status="active")
        else:
            # General listing: only active shops
            queryset = queryset.filter(status="active")

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
                models.Q(name__icontains=search) | 
                models.Q(description__icontains=search)
            )

        # Only products from active shops should be searchable publicly
        # unless it's a specific shop filter which already handles its own logic 
        # but let's be safe: for general search, only active shops.
        if not shop_id:
            queryset = queryset.filter(shop__status="active")

        return queryset


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
