import { IconArchive, IconArrowLeft, IconPackage } from "@tabler/icons-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProducts } from "@/lib/api/products";
import { PremiumImage } from "@/components/PremiumImage";
import type { Product } from "@/types";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      <main className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter">
              CATÁLOGO <span className="text-indigo-500">GLOBAL</span>
            </h1>
            <p className="text-zinc-500 max-w-xl text-lg">
              Descubre los mejores productos de todas nuestras tiendas. Calidad y variedad
              en un solo lugar.
            </p>
          </div>
          <Badge variant="outline" className="text-zinc-500 border-white/10 w-fit">
            {products.length} {products.length === 1 ? "Producto" : "Productos"}
          </Badge>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6 bg-zinc-900/20 rounded-3xl border border-dashed border-white/10">
            <div className="p-4 bg-white/5 rounded-full">
              <IconPackage size={48} className="text-zinc-700" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-medium text-zinc-300">
                No products available
              </h3>
              <p className="text-zinc-500">
                Come back later or check our database configuration.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: Product) => (
              <Card
                key={product.id}
                className="group bg-zinc-900/40 border-white/5 backdrop-blur-sm overflow-hidden hover:border-indigo-500/50 transition-all duration-500 hover:translate-y-[-4px]"
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
                    <Badge className="bg-indigo-600 hover:bg-indigo-600 border-none shadow-lg">
                      ${product.price}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="space-y-1">
                  <div className="flex items-center gap-2 mb-1">
                    {product.category_name && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] uppercase tracking-widest px-2 py-0 bg-white/5 text-zinc-400 border-white/5"
                      >
                        {product.category_name}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-white text-xl line-clamp-1">
                    {product.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-zinc-500 text-sm line-clamp-2 h-10">
                    {product.description || "No description provided."}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <IconArchive size={16} />
                      <span className="text-xs font-medium">
                        {product.stock} in stock
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs border-white/10 hover:bg-white hover:text-black transition-all"
                    >
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Background elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
