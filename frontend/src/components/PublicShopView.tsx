"use client";

import {
  IconBuildingStore,
  IconMapPin,
  IconPackage,
  IconShare,
} from "@tabler/icons-react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { PremiumImage } from "@/components/PremiumImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/types";

const SimpleMap = dynamic(() => import("@/components/SimpleMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-white/5 animate-pulse flex items-center justify-center text-zinc-500 text-xs">
      Cargando mapa...
    </div>
  ),
});

interface PublicShopViewProps {
  shop: any;
  products: Product[];
}

export default function PublicShopView({
  shop,
  products,
}: PublicShopViewProps) {
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Enlace copiado al portapapeles");
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20 selection:bg-indigo-500/30">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
        {shop.image ? (
          <div className="absolute inset-0">
            <img
              src={shop.image}
              alt={shop.name}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-zinc-950 to-black" />
        )}

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/20">
                  <IconBuildingStore size={32} />
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-none uppercase tracking-widest text-[10px] font-black">
                  Open Store
                </Badge>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.8]">
                {shop.name}
              </h1>
              <p className="text-zinc-400 max-w-2xl text-lg font-medium leading-relaxed">
                {shop.description ||
                  "Bienvenidos a nuestra tienda oficial en Buskalo!."}
              </p>
            </div>

            <Button
              onClick={handleShare}
              variant="outline"
              className="w-fit border-white/10 bg-white/5 hover:bg-white/10 rounded-2xl gap-2 font-bold h-12 px-6"
            >
              <IconShare size={18} />
              Compartir Tienda
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 -mt-8 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Products */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight uppercase flex items-center gap-3">
              <IconPackage className="text-indigo-500" />
              Nuestros Productos ({products.length})
            </h2>
          </div>

          {products.length === 0 ? (
            <div className="py-20 text-center bg-zinc-900/20 rounded-[40px] border border-dashed border-white/5">
              <p className="text-zinc-500 italic">
                Esta tienda aún no ha publicado productos.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="group bg-zinc-900/40 border-white/5 backdrop-blur-sm overflow-hidden hover:border-indigo-500/50 transition-all duration-500 rounded-3xl"
                >
                  <div className="h-56 flex items-center justify-center relative">
                    {product.image ? (
                      <PremiumImage
                        src={product.image}
                        alt={product.name}
                        className="group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                        <IconPackage size={48} className="text-white/5" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white text-black font-black h-8 px-4 text-sm shadow-2xl">
                        ${product.price}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-3">
                    <h3 className="text-xl font-black uppercase text-white group-hover:text-indigo-400 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-zinc-500 text-sm line-clamp-2 h-10 leading-relaxed">
                      {product.description || "No hay descripción disponible."}
                    </p>
                    <Button className="w-full mt-4 bg-white text-black hover:bg-zinc-200 font-bold rounded-xl h-11">
                      Ver Detalles
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Info & Map */}
        <div className="space-y-6">
          <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-xl rounded-[32px] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-2">
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">
                  Ubicación
                </span>
                <div className="flex items-start gap-3">
                  <IconMapPin
                    className="text-zinc-500 flex-shrink-0 mt-1"
                    size={20}
                  />
                  <p className="text-white font-bold text-lg leading-tight uppercase">
                    {shop.location || "Online Only"}
                  </p>
                </div>
              </div>

              {shop.is_physical && shop.latitude && shop.longitude && (
                <div className="h-64 md:h-80 w-full">
                  <SimpleMap position={[shop.latitude, shop.longitude]} />
                </div>
              )}

              <div className="pt-6 border-t border-white/5">
                <div className="flex items-center gap-4 p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-black overflow-hidden relative border border-white/10 flex-shrink-0">
                    {shop.owner_avatar ? (
                      <img
                        src={shop.owner_avatar}
                        alt={shop.owner_username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      shop.owner_username?.[0].toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest leading-none mb-1">
                      Dueño de la tienda
                    </p>
                    <p className="text-white font-black">
                      {shop.owner_username}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
