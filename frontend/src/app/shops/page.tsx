import {
  IconBuildingStore,
  IconMapPin,
  IconPhone,
  IconStar,
} from "@tabler/icons-react";
import Link from "next/link";
import { PremiumImage } from "@/components/PremiumImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getShops } from "@/lib/api/shops";

export const dynamic = "force-dynamic";

export default async function ShopsPage() {
  const shops = await getShops();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      <main className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter">
              NUESTRAS <span className="text-indigo-500">TIENDAS</span>
            </h1>
            <p className="text-zinc-500 max-w-xl text-lg">
              Explora los negocios locales que confían en Buskalo! para conectar
              con sus clientes.
            </p>
          </div>
          <Badge
            variant="outline"
            className="text-zinc-500 border-white/10 w-fit"
          >
            {shops.length} {shops.length === 1 ? "Tienda" : "Tiendas"}
          </Badge>
        </div>

        {shops.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6 bg-zinc-900/20 rounded-3xl border border-dashed border-white/10">
            <div className="p-4 bg-white/5 rounded-full">
              <IconBuildingStore size={48} className="text-zinc-700" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-medium text-zinc-300">
                Aún no hay tiendas registradas
              </h3>
              <p className="text-zinc-500">
                ¡Sé el primero en crear una y empezar a vender!
              </p>
              <Link href="/shops/new" className="mt-4 block">
                <Button className="bg-indigo-600 hover:bg-indigo-500">
                  Crear mi Tienda
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {shops.map((shop: any) => (
              <Card
                key={shop.id}
                className="group bg-zinc-900/40 border-white/5 backdrop-blur-sm overflow-hidden hover:border-indigo-500/50 transition-all duration-500 hover:translate-y-[-4px]"
              >
                <CardHeader className="relative h-48 p-0 flex items-center justify-center border-b border-white/5 overflow-hidden">
                  {shop.image ? (
                    <PremiumImage
                      src={shop.image}
                      alt={shop.name}
                      className="group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-900/20 to-purple-900/20 flex items-center justify-center">
                      <IconBuildingStore
                        size={48}
                        className="text-indigo-400/50 group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      Abierto
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {shop.name}
                    </CardTitle>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <IconStar size={14} fill="currentColor" />
                      <IconStar size={14} fill="currentColor" />
                      <IconStar size={14} fill="currentColor" />
                      <IconStar size={14} fill="currentColor" />
                      <IconStar size={14} className="text-zinc-700" />
                      <span className="text-xs text-zinc-500 ml-1">(4.0)</span>
                    </div>
                  </div>

                  <p className="text-zinc-400 text-sm line-clamp-2">
                    {shop.description ||
                      "Esta tienda no ha proporcionado una descripción todavía."}
                  </p>

                  <div className="space-y-2 py-4 border-y border-white/5">
                    <div className="flex items-center gap-3 text-zinc-500">
                      <IconMapPin size={18} className="text-indigo-500" />
                      <span className="text-sm truncate">
                        {shop.location || "Dirección no disponible"}
                      </span>
                    </div>
                    {shop.phone && (
                      <div className="flex items-center gap-3 text-zinc-500">
                        <IconPhone size={18} className="text-indigo-500" />
                        <span className="text-sm">{shop.phone}</span>
                      </div>
                    )}
                  </div>

                  <Link href={`/shops/${shop.id}`} className="block">
                    <Button className="w-full bg-white text-black hover:bg-indigo-600 hover:text-white transition-all font-bold">
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
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute -top-[10%] -right-[10%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
