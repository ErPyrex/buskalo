"use client";

import {
  IconArchive,
  IconArrowLeft,
  IconBuildingStore,
  IconLoader2,
  IconMoodEmpty,
  IconPackage,
  IconPlus,
  IconSettings,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import CreateProductModal from "@/components/CreateProductModal";
import EditProductModal from "@/components/EditProductModal";
import { PremiumImage } from "@/components/PremiumImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { getProducts } from "@/lib/api/products";
import { getShop } from "@/lib/api/shops";
import PublicShopView from "@/components/PublicShopView";
import type { Product } from "@/types";

export default function ShopDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();
  const _router = useRouter();

  const [shop, setShop] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchShopData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch shop data publicly
      const shopData = await getShop(id);
      setShop(shopData);

      // Fetch products publicly
      const shopProducts = await getProducts(id);
      setProducts(shopProducts);

      // Check if logged user is owner
      if (user && shopData.owner === user.id) {
        setIsOwner(true);
      } else {
        setIsOwner(false);
      }
    } catch (error) {
      console.error("Error fetching shop data:", error);
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchShopData();
  }, [fetchShopData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <IconLoader2 className="animate-spin text-indigo-500" size={48} />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h1 className="text-white text-3xl font-black uppercase tracking-tighter">Tienda no encontrada</h1>
        <p className="text-zinc-500 max-w-sm">
          Lo sentimos, la tienda que buscas no existe o ha sido desactivada temporalmente.
        </p>
        <Link href="/">
          <Button className="bg-white text-black hover:bg-zinc-200 font-bold px-8 rounded-xl h-11 transition-all active:scale-95 shadow-xl shadow-white/5">
            Volver al Inicio
          </Button>
        </Link>
      </div>
    );
  }

  // If not the owner, show the public view
  if (!isOwner) {
    return <PublicShopView shop={shop} products={products} />;
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-50" />

      <header className="border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:text-white rounded-full"
              >
                <IconArrowLeft size={20} />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden relative">
                {shop.image ? (
                  <PremiumImage src={shop.image} alt={shop.name} />
                ) : (
                  <IconBuildingStore size={24} className="text-zinc-600" />
                )}
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight uppercase">
                  {shop.name}
                </h1>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-[10px] text-zinc-500 border-white/10 h-4 uppercase"
                  >
                    Manager Dashboard
                  </Badge>
                  {shop.status === "draft" && (
                    <Badge className="text-[10px] bg-orange-500/20 text-orange-400 border-orange-500/20 h-4">
                      DRAFT
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/shops/${id}/edit`}>
              <Button
                variant="outline"
                size="icon"
                className="border-white/5 bg-white/5 text-zinc-400 rounded-xl hover:text-white hover:bg-white/10"
              >
                <IconSettings size={18} />
              </Button>
            </Link>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-black hover:bg-zinc-200 font-bold px-6 h-10 rounded-xl flex items-center gap-2 shadow-lg shadow-white/5 active:scale-95 transition-all"
            >
              <IconPlus size={18} />
              <span className="hidden sm:inline">New Product</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
              Inventory <span className="text-indigo-500">Live</span>
            </h2>
            <p className="text-zinc-500 max-w-xl text-lg font-medium">
              Manage your products, update stock, and control your store catalog
              from here.
            </p>
          </div>
          <div className="flex items-center gap-6 p-6 rounded-3xl bg-zinc-900/40 border border-white/5 backdrop-blur-sm">
            <div className="text-center">
              <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-1">
                Products
              </p>
              <p className="text-3xl font-black">{products.length}</p>
            </div>
            <div className="w-[1px] h-10 bg-white/10" />
            <div className="text-center">
              <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-1">
                Status
              </p>
              <p className="text-xl font-bold uppercase text-indigo-400">
                {shop.status}
              </p>
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6 bg-zinc-900/10 rounded-[40px] border border-dashed border-white/5">
            <div className="p-6 bg-indigo-500/10 rounded-full text-indigo-400 animate-pulse">
              <IconMoodEmpty size={64} />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-white tracking-tight uppercase">
                No products yet
              </h3>
              <p className="text-zinc-500 max-w-xs mx-auto">
                Start building your business catalogue by adding your first
                product.
              </p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-12 px-8 rounded-2xl flex items-center gap-3 transition-all active:scale-95"
            >
              <IconPlus size={20} />
              Create your first product
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
                className="group bg-zinc-900/40 border-white/5 backdrop-blur-sm overflow-hidden hover:border-indigo-500/50 transition-all duration-500 rounded-3xl"
              >
                <div className="h-48 flex items-center justify-center relative">
                  {product.image ? (
                    <PremiumImage
                      src={product.image}
                      alt={product.name}
                      className="group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                      <IconPackage
                        size={64}
                        className="text-white/10 group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge
                      className={`${parseFloat(product.price.toString()) === 0 ? "bg-emerald-500 text-white" : "bg-white text-black"} font-bold h-7 px-3 border-none shadow-xl`}
                    >
                      {parseFloat(product.price.toString()) === 0
                        ? "GRATIS"
                        : `$${product.price}`}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="space-y-1 p-6 pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    {product.category_name && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] uppercase tracking-widest px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border-none font-bold"
                      >
                        {product.category_name}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-white text-xl line-clamp-1 font-black group-hover:text-indigo-400 transition-colors">
                    {product.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6 pt-0 space-y-4">
                  <p className="text-zinc-500 text-xs line-clamp-2 h-8 leading-relaxed">
                    {product.description ||
                      "Digital item, no description available."}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <IconArchive size={16} />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {product.is_infinite_stock
                          ? "Stock Disponible"
                          : `${product.stock} Unidades`}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsEditProductModalOpen(true);
                      }}
                      className="h-8 text-[10px] uppercase font-bold tracking-widest text-zinc-500 hover:text-white hover:bg-white/5 px-3"
                    >
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <CreateProductModal
        shopId={id}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onProductCreated={fetchShopData}
      />

      <EditProductModal
        product={selectedProduct}
        open={isEditProductModalOpen}
        onOpenChange={setIsEditProductModalOpen}
        onProductUpdated={fetchShopData}
      />

      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
