"use client";

import {
  IconBuildingStore,
  IconLoader2,
  IconPlus,
  IconRocket,
} from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PremiumImage } from "@/components/PremiumImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { getShops, updateShop } from "@/lib/api/shops";

export default function MyShops() {
  const { user, token } = useAuth();
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "draft">("all");

  useEffect(() => {
    if (user && token) {
      getShops({ owner: user.id.toString(), token })
        .then(setShops)
        .finally(() => setLoading(false));
    }
  }, [user, token]);

  const handlePublish = async (shopId: number) => {
    if (!token) return;
    setPublishing(shopId);
    try {
      const data = new FormData();
      data.append("status", "active");
      await updateShop(shopId, data, token);
      toast.success("¡Tienda publicada!", {
        description: "Tu negocio ahora es visible para todos los clientes.",
      });
      setShops(
        shops.map((s) => (s.id === shopId ? { ...s, status: "active" } : s)),
      );
    } catch (error) {
      console.error("Failed to publish shop", error);
      toast.error("Error al publicar", {
        description: "No pudimos activar tu tienda en este momento.",
      });
    } finally {
      setPublishing(null);
    }
  };

  const filteredShops = shops.filter((s) =>
    activeTab === "all" ? true : s.status === activeTab,
  );

  if (!user) return null;

  return (
    <div className="w-full max-w-4xl mt-12 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
        <div className="space-y-1 text-left">
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2 uppercase">
            <IconBuildingStore className="text-indigo-400" size={28} />
            Mis Negocios
          </h2>
          <p className="text-xs text-zinc-500 font-medium">
            Gestiona y publica tus puntos de venta.
          </p>
        </div>
        <Link href="/shops/new">
          <Button className="bg-white text-black hover:bg-zinc-200 font-bold h-11 px-6 rounded-2xl gap-2 shadow-lg shadow-white/5 active:scale-95 transition-all">
            <IconPlus size={18} />
            Nueva Tienda
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2 p-1.5 bg-zinc-900/40 backdrop-blur-xl rounded-2xl border border-white/5 w-fit">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "all"
              ? "bg-white text-black shadow-lg"
              : "text-zinc-500 hover:text-white"
          }`}
        >
          Todas ({shops.length})
        </button>
        <button
          onClick={() => setActiveTab("active")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "active"
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
              : "text-zinc-500 hover:text-white"
          }`}
        >
          Activas ({shops.filter((s) => s.status === "active").length})
        </button>
        <button
          onClick={() => setActiveTab("draft")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "draft"
              ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
              : "text-zinc-500 hover:text-white"
          }`}
        >
          Inactivas ({shops.filter((s) => s.status === "draft").length})
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-white/5 animate-pulse border border-white/5"
            />
          ))}
        </div>
      ) : filteredShops.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/10 rounded-[40px] border border-dashed border-white/5">
          <p className="text-zinc-600 font-medium italic">
            {activeTab === "all"
              ? "Aún no has creado ninguna tienda."
              : `No tienes tiendas en estado ${
                  activeTab === "active" ? "activo" : "inactivo"
                }.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredShops.map((shop) => (
            <Card
              key={shop.id}
              className={`bg-zinc-900/40 border-white/5 backdrop-blur-sm overflow-hidden group hover:border-white/10 transition-all rounded-[32px] ${
                shop.status === "draft" ? "opacity-70 saturate-50" : ""
              }`}
            >
              <CardContent className="p-6 flex flex-col justify-between h-full gap-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-950/60 border border-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden relative shadow-inner">
                      {shop.image ? (
                        <PremiumImage src={shop.image} alt={shop.name} />
                      ) : (
                        <IconBuildingStore size={28} className="text-zinc-700" />
                      )}
                    </div>
                    <div className="space-y-1 min-w-0 text-left">
                      <h3 className="text-lg font-black text-white truncate uppercase tracking-tight">
                        {shop.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-zinc-500">
                        <Badge
                          variant={
                            shop.status === "active" ? "default" : "secondary"
                          }
                          className={
                            shop.status === "active"
                              ? "bg-emerald-500/10 text-emerald-400 border-none text-[9px] font-black h-5 uppercase px-2"
                              : "bg-orange-500/10 text-orange-400 border-none text-[9px] font-black h-5 uppercase px-2"
                          }
                        >
                          {shop.status === "active" ? "Pública" : "Borrador"}
                        </Badge>
                        <span className="text-[10px] font-bold opacity-30">
                          •
                        </span>
                        <p className="text-[10px] font-bold text-zinc-500 truncate uppercase mt-0.5">
                          {shop.location || "Online"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <Link href={`/shops/${shop.id}`} className="flex-[1.5]">
                    <Button
                      variant="outline"
                      className="w-full text-[10px] h-10 border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-xl font-black uppercase tracking-widest transition-all active:scale-95"
                    >
                      Gestionar
                    </Button>
                  </Link>

                  {shop.status === "draft" && (
                    <Button
                      onClick={() => handlePublish(shop.id)}
                      disabled={publishing === shop.id}
                      className="flex-1 text-[10px] h-10 bg-indigo-600 hover:bg-indigo-500 text-white gap-2 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                    >
                      {publishing === shop.id ? (
                        <IconLoader2 size={14} className="animate-spin" />
                      ) : (
                        <>
                          <IconRocket size={14} />
                          Lanzar
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
