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

  useEffect(() => {
    if (user && token) {
      getShops({ owner: user.id.toString() })
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

  if (!user) return null;

  return (
    <div className="w-full max-w-4xl mt-12 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <IconBuildingStore className="text-indigo-400" size={24} />
          My Stores
        </h2>
        <Link href="/shops/new">
          <Button
            variant="ghost"
            size="sm"
            className="text-zinc-400 hover:text-white text-xs gap-2"
          >
            <IconPlus size={14} />
            Quick Add
          </Button>
        </Link>
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
      ) : shops.length === 0 ? (
        <div className="text-center py-12 bg-zinc-900/20 rounded-3xl border border-dashed border-white/10">
          <p className="text-zinc-500 text-sm">
            You haven't created any stores yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {shops.map((shop) => (
            <Card
              key={shop.id}
              className="bg-zinc-900/40 border-white/5 backdrop-blur-sm overflow-hidden group hover:border-white/10 transition-all"
            >
              <CardContent className="p-5 flex flex-col justify-between h-full gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden relative">
                      {shop.image ? (
                        <PremiumImage src={shop.image} alt={shop.name} />
                      ) : (
                        <IconBuildingStore
                          size={20}
                          className="text-zinc-600"
                        />
                      )}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h3 className="text-white font-bold truncate">
                        {shop.name}
                      </h3>
                      <p className="text-zinc-500 text-xs line-clamp-1">
                        {shop.location || "No address"}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={shop.status === "active" ? "default" : "secondary"}
                    className={
                      shop.status === "active"
                        ? "bg-green-500/10 text-green-400 border-green-500/20 text-[10px]"
                        : "bg-orange-500/10 text-orange-400 border-orange-500/20 text-[10px]"
                    }
                  >
                    {shop.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="flex items-center justify-between gap-2 mt-auto">
                  <Link href={`/shops/${shop.id}`} className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-[10px] h-8 border-white/5 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                    >
                      Dashboard
                    </Button>
                  </Link>

                  {shop.status === "draft" && (
                    <Button
                      size="sm"
                      onClick={() => handlePublish(shop.id)}
                      disabled={publishing === shop.id}
                      className="flex-1 text-[10px] h-8 bg-indigo-600 hover:bg-indigo-500 text-white gap-1"
                    >
                      {publishing === shop.id ? (
                        <IconLoader2 size={12} className="animate-spin" />
                      ) : (
                        <>
                          <IconRocket size={12} />
                          Publish
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
