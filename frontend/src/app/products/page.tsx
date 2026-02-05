"use client";

import {
  IconArchive,
  IconMapPin,
  IconPackage,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PremiumImage } from "@/components/PremiumImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getProducts } from "@/lib/api/products";
import type { Product } from "@/types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    const search = searchTerm.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(search) ||
        product.description?.toLowerCase().includes(search) ||
        product.category_name?.toLowerCase().includes(search) ||
        product.shop_name?.toLowerCase().includes(search),
    );
  }, [products, searchTerm]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      <main className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
          <div className="space-y-4 flex-1">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
              CATÁLOGO{" "}
              <span className="text-indigo-500 not-italic">GLOBAL</span>
            </h1>
            <p className="text-zinc-500 max-w-xl text-lg font-medium leading-relaxed">
              Descubre los mejores productos de todas nuestras tiendas. Calidad
              y variedad en un solo lugar.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-max group">
            <div className="relative w-full sm:w-80 group/search">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-500 group-focus-within/search:text-indigo-500 transition-colors">
                <IconSearch size={20} stroke={2.5} />
              </div>
              <Input
                type="text"
                placeholder="Buscar productos..."
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
                Inventory
              </span>
              <Badge
                variant="outline"
                className="text-white border-white/10 bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-xl font-black text-xs"
              >
                {filteredProducts.length} DISPONIBLES
              </Badge>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="h-[400px] bg-zinc-900/40 rounded-3xl animate-pulse border border-white/5"
              />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6 bg-zinc-900/20 rounded-3xl border border-dashed border-white/10">
            <div className="p-6 bg-white/5 rounded-full ring-1 ring-white/10">
              <IconSearch size={48} className="text-zinc-700" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-zinc-300 uppercase tracking-tight">
                No se encontraron productos
              </h3>
              <p className="text-zinc-500 font-medium">
                Intenta con otros términos o limpia tu búsqueda.
              </p>
              {searchTerm && (
                <Button
                  onClick={() => setSearchTerm("")}
                  variant="link"
                  className="text-indigo-500 font-bold uppercase tracking-widest text-xs mt-4"
                >
                  Ver todo el catálogo
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-1000">
            {filteredProducts.map((product: Product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="block"
              >
                <Card className="group bg-zinc-900/40 border-white/5 backdrop-blur-sm overflow-hidden hover:border-indigo-500/50 transition-all duration-500 hover:translate-y-[-8px] rounded-3xl h-full">
                  <div className="h-56 flex items-center justify-center relative overflow-hidden bg-zinc-950">
                    {product.image ? (
                      <PremiumImage
                        src={product.image}
                        alt={product.name}
                        className="group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                        <IconPackage
                          size={64}
                          className="text-white/5 group-hover:scale-110 transition-transform duration-700 group-hover:text-indigo-500/20"
                        />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 z-10">
                      <Badge
                        className={`${parseFloat(product.price.toString()) === 0 ? "bg-emerald-500/90 text-white" : "bg-indigo-600/90 text-white"} backdrop-blur-md border-none shadow-2xl font-black px-3 py-1 text-xs tracking-tighter rounded-lg`}
                      >
                        {parseFloat(product.price.toString()) === 0
                          ? "GRATIS"
                          : `$${product.price}`}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="p-6 pb-2 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {product.shop_name && (
                        <Badge
                          variant="secondary"
                          className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border-none"
                        >
                          {product.shop_name}
                        </Badge>
                      )}
                      {product.category_name && (
                        <Badge
                          variant="secondary"
                          className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-white/5 text-zinc-400 border-none"
                        >
                          {product.category_name}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-white text-xl font-black line-clamp-1 group-hover:text-indigo-400 transition-colors transition-duration-300 uppercase tracking-tight">
                      {product.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-6 pt-0 space-y-6">
                    <p className="text-zinc-500 text-xs font-medium line-clamp-2 h-8 leading-relaxed">
                      {product.description || "No description provided."}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5 mb-[-8px]">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-zinc-400">
                          <IconArchive
                            size={14}
                            className="text-indigo-500/50"
                          />
                          <span className="text-[10px] font-bold uppercase tracking-wider">
                            {product.is_infinite_stock
                              ? "Stock Disponible"
                              : `${product.stock} disponibles`}
                          </span>
                        </div>
                        {product.shop_location && (
                          <div className="flex items-center gap-2 text-zinc-600 group-hover:text-zinc-500 transition-colors">
                            <IconMapPin
                              size={14}
                              className="text-zinc-800 group-hover:text-indigo-500/30 transition-colors"
                            />
                            <span className="text-[10px] font-bold uppercase tracking-tighter truncate max-w-[120px]">
                              {product.shop_location}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="h-9 px-4 text-[10px] flex items-center justify-center font-black uppercase tracking-widest border border-white/5 bg-white/5 group-hover:bg-white group-hover:text-black transition-all rounded-xl">
                        DETALLES
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Background elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px] transition-opacity duration-1000" />
        <div className="absolute top-[40%] -right-[10%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[120px] transition-opacity duration-1000" />
      </div>
    </div>
  );
}
