"use client";

import {
  IconArchive,
  IconArrowLeft,
  IconChevronRight,
  IconMapPin,
  IconPackage,
  IconShoppingCart,
  IconBuildingStore,
} from "@tabler/icons-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PremiumImage } from "@/components/PremiumImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProduct } from "@/lib/api/products";
import type { Product } from "@/types";

export default function ProductDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const data = await getProduct(id);
      setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Cargando Producto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <IconPackage size={64} className="text-zinc-800 mb-6" />
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Producto no encontrado</h1>
        <p className="text-zinc-500 mb-8 max-w-md">Lo sentimos, el producto que buscas no existe o ha sido eliminado del catálogo.</p>
        <Button asChild className="bg-white text-black hover:bg-zinc-200 font-bold px-8 rounded-2xl">
          <Link href="/products">VOLVER AL CATÁLOGO</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 py-8">
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-white transition-colors text-indigo-500">HOME</Link>
          <IconChevronRight size={12} stroke={3} className="flex-shrink-0" />
          <Link href="/products" className="hover:text-white transition-colors text-indigo-500">CATÁLOGO</Link>
          <IconChevronRight size={12} stroke={3} className="flex-shrink-0" />
          <span className="text-zinc-700 truncate max-w-[150px]">{product.name}</span>
        </nav>

        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-12 group"
        >
          <div className="p-2 bg-white/5 rounded-full group-hover:bg-indigo-500 group-hover:text-white transition-all">
            <IconArrowLeft size={18} stroke={3} />
          </div>
          <span className="text-xs font-black uppercase tracking-widest">Regresar</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24">
          {/* Image Section */}
          <div className="relative aspect-square md:aspect-video lg:aspect-square bg-zinc-900/40 rounded-[2rem] border border-white/5 overflow-hidden group shadow-2xl">
            {product.image ? (
              <PremiumImage 
                src={product.image} 
                alt={product.name}
                className="hover:scale-105 transition-transform duration-1000"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                <IconPackage size={80} className="text-zinc-800" />
                <span className="text-zinc-600 font-black text-xs uppercase tracking-[0.2em]">Sin imagen</span>
              </div>
            )}
            
            <div className="absolute top-6 right-6">
              <Badge className="bg-indigo-600 text-white font-black px-4 py-2 text-sm rounded-xl shadow-2xl border-none">
                {parseFloat(product.price.toString()) === 0 ? "GRATIS" : `$${product.price}`}
              </Badge>
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-center space-y-8 animate-in slide-in-from-right-8 fade-in duration-1000">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-indigo-400 border-indigo-400/30 bg-indigo-400/5 font-black uppercase tracking-widest text-[10px] py-1 px-3 rounded-full">
                  {product.category_name || "General"}
                </Badge>
                {product.is_infinite_stock && (
                  <Badge variant="outline" className="text-emerald-400 border-emerald-400/30 bg-emerald-400/5 font-black uppercase tracking-widest text-[10px] py-1 px-3 rounded-full">
                    Stock Infinito
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl xl:text-7xl font-black italic tracking-tighter uppercase leading-[0.9]">
                {product.name}
              </h1>
            </div>

            <div className="p-8 bg-zinc-900/30 backdrop-blur-3xl border border-white/5 rounded-3xl space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Descripción</span>
                <p className="text-zinc-400 font-medium leading-relaxed text-lg">
                  {product.description || "Este producto no tiene una descripción detallada todavía."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Disponibilidad</span>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${product.is_infinite_stock || product.stock > 0 ? "bg-indigo-500/10 text-indigo-400" : "bg-red-500/10 text-red-500"}`}>
                        <IconArchive size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className={`font-black uppercase tracking-widest text-xs ${!product.is_infinite_stock && product.stock <= 5 && product.stock > 0 ? "text-orange-400" : "text-white"}`}>
                          {product.is_infinite_stock 
                            ? "Stock Ilimitado" 
                            : product.stock > 0 
                              ? `Quedan ${product.stock}` 
                              : "Agotado"}
                        </span>
                        {!product.is_infinite_stock && product.stock > 0 && product.stock <= 5 && (
                          <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest animate-pulse">
                            ¡Pocas unidades!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {!product.is_infinite_stock && product.stock > 0 && (
                    <div className="space-y-2">
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${product.stock <= 5 ? "bg-orange-500" : "bg-indigo-500"}`}
                          style={{ width: `${Math.min((product.stock / 20) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-right">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 text-right block">Precio Final</span>
                  <span className="text-3xl font-black text-indigo-400">
                    {parseFloat(product.price.toString()) === 0 ? "GRATIS" : `$${product.price}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Shop Card */}
            <div className="group/shop p-6 bg-white/5 hover:bg-white/10 border border-white/5 transition-all duration-500 rounded-3xl">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-indigo-500 flex items-center justify-center rounded-2xl shadow-lg shadow-indigo-500/20 group-hover/shop:scale-110 transition-transform">
                    <IconBuildingStore size={24} className="text-white" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block">Tienda Vendedora</span>
                    <h3 className="font-black text-xl uppercase tracking-tight">{product.shop_name}</h3>
                    {product.shop_location && (
                      <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-medium uppercase tracking-tighter">
                        <IconMapPin size={12} className="text-indigo-500/50" />
                        {product.shop_location}
                      </div>
                    )}
                  </div>
                </div>
                <Button size="sm" variant="ghost" asChild className="text-indigo-500 font-black tracking-widest uppercase text-[10px] hover:bg-white/5">
                   <Link href={`/shops/${product.shop}`}>VISITAR TIENDA</Link>
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="flex-1 bg-white text-black hover:bg-zinc-200 h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl active:scale-95 transition-all">
                <IconShoppingCart size={20} className="mr-2" stroke={2.5} />
                Comprar Ahora
              </Button>
              <Button size="lg" variant="outline" className="flex-1 border-white/10 bg-white/5 hover:bg-white/10 text-white h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-sm active:scale-95 transition-all">
                Contactar Tienda
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Blur Backgrounds */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
}
