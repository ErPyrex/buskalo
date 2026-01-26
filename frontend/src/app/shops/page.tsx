"use client";

import {
  IconBuildingStore,
  IconMapPin,
  IconSearch,
  IconStar,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PremiumImage } from "@/components/PremiumImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getShops } from "@/lib/api/shops";

export default function ShopsPage() {
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAllShops = async () => {
      setLoading(true);
      try {
        const data = await getShops();
        setShops(data);
      } catch (error) {
        console.error("Error fetching shops:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllShops();
  }, []);

  const filteredShops = useMemo(() => {
    if (!searchTerm.trim()) return shops;
    const search = searchTerm.toLowerCase();
    return shops.filter(
      (shop) =>
        shop.name.toLowerCase().includes(search) ||
        shop.description?.toLowerCase().includes(search) ||
        shop.location?.toLowerCase().includes(search),
    );
  }, [shops, searchTerm]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      <main className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
          <div className="space-y-4 flex-1">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
              NUESTRAS{" "}
              <span className="text-indigo-500 not-italic">TIENDAS</span>
            </h1>
            <p className="text-zinc-400 max-w-xl text-lg font-medium leading-relaxed">
              Explora los negocios locales que confían en Buskalo! para conectar
              con sus clientes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-max group">
            <div className="relative w-full sm:w-80 group/search">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-500 group-focus-within/search:text-indigo-500 transition-colors">
                <IconSearch size={20} stroke={2.5} />
              </div>
              <Input
                type="text"
                placeholder="Buscar tiendas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-900/50 border-white/5 h-14 pl-12 pr-12 rounded-2xl text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all backdrop-blur-xl font-bold"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-4 flex items-center text-zinc-500 hover:text-white transition-colors"
                >
                  <IconX size={18} stroke={3} />
                </button>
              )}
            </div>
            <div className="hidden sm:flex flex-col items-end gap-1 px-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                Committed
              </span>
              <Badge
                variant="outline"
                className="text-white border-white/10 bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-xl font-black text-xs"
              >
                {filteredShops.length} REGISTRADAS
              </Badge>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="h-[450px] bg-zinc-900/40 rounded-3xl animate-pulse border border-white/5"
              />
            ))}
          </div>
        ) : filteredShops.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6 bg-zinc-900/20 rounded-3xl border border-dashed border-white/10">
            <div className="p-6 bg-white/5 rounded-full ring-1 ring-white/10">
              <IconSearch size={48} className="text-zinc-700" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-zinc-300 uppercase tracking-tight">
                No se encontraron tiendas
              </h3>
              <p className="text-zinc-500 font-medium">
                Intenta con otros términos o busca en otro lugar.
              </p>
              {searchTerm && (
                <Button
                  onClick={() => setSearchTerm("")}
                  variant="link"
                  className="text-indigo-500 font-bold uppercase tracking-widest text-xs mt-4"
                >
                  Ver todas las tiendas
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-1000">
            {filteredShops.map((shop: any) => (
              <Card
                key={shop.id}
                className="group bg-zinc-900/40 border-white/5 backdrop-blur-sm overflow-hidden hover:border-indigo-500/50 transition-all duration-500 hover:translate-y-[-8px] rounded-3xl"
              >
                <CardHeader className="relative h-56 p-0 flex items-center justify-center border-b border-white/5 overflow-hidden bg-zinc-950">
                  {shop.image ? (
                    <PremiumImage
                      src={shop.image}
                      alt={shop.name}
                      className="group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-950/20 to-purple-950/20 flex items-center justify-center">
                      <IconBuildingStore
                        size={64}
                        className="text-indigo-400/20 group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex gap-2 z-10">
                    <Badge className="bg-emerald-500/80 text-white backdrop-blur-md border-none font-black px-3 py-1 text-[10px] tracking-widest rounded-lg">
                      ACTIVA
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-8 space-y-8">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <CardTitle className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">
                        {shop.name}
                      </CardTitle>
                      <div className="flex items-center gap-1.5 text-yellow-500/80">
                        {[...Array(4)].map((_, i) => (
                          <IconStar
                            key={`star-${i}`}
                            size={14}
                            fill="currentColor"
                            strokeWidth={0}
                          />
                        ))}
                        <IconStar
                          size={14}
                          className="text-zinc-800"
                          strokeWidth={2}
                        />
                        <span className="text-[10px] font-black text-zinc-500 ml-1 uppercase tracking-tighter italic">
                          Top Rated
                        </span>
                      </div>
                    </div>

                    <p className="text-zinc-500 text-sm font-medium line-clamp-2 leading-relaxed h-10">
                      {shop.description ||
                        "Esta tienda no ha proporcionado una descripción todavía."}
                    </p>
                  </div>

                  <div className="space-y-3 py-6 border-y border-white/5">
                    <div className="flex items-center gap-3 text-zinc-400 group-hover:text-zinc-300 transition-colors">
                      <div className="p-2 bg-indigo-500/5 rounded-lg group-hover:bg-indigo-500/10 transition-colors">
                        <IconMapPin size={18} className="text-indigo-500/70" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-tight truncate">
                        {shop.location || "Online Only"}
                      </span>
                    </div>
                  </div>

                  <Link href={`/shops/${shop.id}`} className="block">
                    <Button className="w-full bg-white text-black hover:bg-indigo-600 hover:text-white transition-all font-black uppercase tracking-widest h-12 rounded-2xl shadow-xl shadow-black/20">
                      Visitar Tienda
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute -top-[10%] -right-[10%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
