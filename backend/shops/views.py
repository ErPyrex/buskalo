from rest_framework import viewsets, permissions
from .models import Shop, Product, Category
from .serializers import ShopSerializer, ProductSerializer, CategorySerializer

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        # For shops, obj.owner exists. For products, obj.shop.owner exists.
        owner = getattr(obj, 'owner', None) or getattr(obj.shop, 'owner', None)
        return owner == request.user

class ShopViewSet(viewsets.ModelViewSet):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        # Optional: could limit to current user for listing? 
        # But usually you want to see all shops.
        return Shop.objects.all()

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_queryset(self):
        shop_id = self.request.query_params.get('shop_id')
        if shop_id:
            return Product.objects.filter(shop_id=shop_id)
        return Product.objects.all()

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
