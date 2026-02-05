"use client";

import {
  IconBuildingStore,
  IconLoader2,
  IconMapPin,
  IconPackage,
  IconSearch,
  IconTrendingUp,
  IconX,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useClickAway } from "react-use";
import { PremiumImage } from "@/components/PremiumImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getProducts } from "@/lib/api/products";
import { getShops } from "@/lib/api/shops";
import type { Product } from "@/types";

type SearchMode = "products" | "shops";

export default function ProductSearch() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<SearchMode>("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [shops, setShops] = useState<any[]>([]);
  const [filteredResults, setFilteredResults] = useState<any[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useClickAway(containerRef, () => setIsOpen(false));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodData, shopData] = await Promise.all([
          getProducts(),
          getShops(),
        ]);
        setProducts(prodData);
        setShops(shopData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setFilteredResults([]);
      return;
    }

    const searchStr = query.toLowerCase();

    if (mode === "products") {
      const results = products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchStr) ||
            p.description?.toLowerCase().includes(searchStr) ||
            p.category_name?.toLowerCase().includes(searchStr),
        );
      setFilteredResults(results);
    } else {
      const results = shops
        .filter(
          (s) =>
            s.name.toLowerCase().includes(searchStr) ||
            s.description?.toLowerCase().includes(searchStr) ||
            s.location?.toLowerCase().includes(searchStr),
        );
      setFilteredResults(results);
    }
  }, [query, mode, products, shops]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-2xl mx-auto z-50 space-y-4"
    >
      {/* Filter Buttons */}
      <div className="flex items-center justify-center gap-2 mb-2 p-1 bg-zinc-900/50 border border-white/5 backdrop-blur-xl rounded-2xl w-fit mx-auto">
        <Button
          type="button"
          onClick={() => setMode("products")}
          variant={mode === "products" ? "default" : "ghost"}
          className={`h-9 px-6 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            mode === "products"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
              : "text-zinc-500 hover:text-white"
          }`}
        >
          <IconPackage size={16} className="mr-2" />
          Products
        </Button>
        <Button
          type="button"
          onClick={() => setMode("shops")}
          variant={mode === "shops" ? "default" : "ghost"}
          className={`h-9 px-6 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            mode === "shops"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
              : "text-zinc-500 hover:text-white"
          }`}
        >
          <IconBuildingStore size={16} className="mr-2" />
          Stores
        </Button>
      </div>

      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-indigo-500 transition-colors">
          <IconSearch size={20} />
        </div>
        <Input
          placeholder={
            mode === "products" ? "Search products..." : "Search stores..."
          }
          className="w-full bg-zinc-900/50 border-white/5 h-14 pl-12 pr-12 text-white placeholder:text-zinc-600 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all backdrop-blur-xl"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute inset-y-0 right-4 flex items-center text-zinc-500 hover:text-white transition-colors"
          >
            <IconX size={18} />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && (query.trim() || loading) && (
        <Card className="absolute top-full left-0 w-full mt-2 bg-zinc-950/90 border-white/10 backdrop-blur-2xl overflow-y-auto max-h-[60vh] rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="p-2">
            {loading && filteredResults.length === 0 ? (
              <div className="p-8 flex flex-col items-center gap-3 text-zinc-500">
                <IconLoader2 className="animate-spin" size={24} />
                <p className="text-xs font-bold uppercase tracking-widest">
                  Searching...
                </p>
              </div>
            ) : filteredResults.length > 0 ? (
              <div className="space-y-1">
                <div className="px-3 py-2 flex items-center justify-between">
                  <span className="text-[10px] font-black tracking-widest text-zinc-600 uppercase">
                    {mode === "products" ? "Product results" : "Store results"}
                  </span>
                  <Badge
                    variant="outline"
                    className="border-indigo-500/20 text-indigo-400 text-[10px]"
                  >
                    Instant
                  </Badge>
                </div>
                {filteredResults.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      router.push(
                        mode === "products"
                          ? `/products/${item.id}`
                          : `/shops/${item.id}`,
                      );
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all text-left group"
                  >
                    <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center text-zinc-600 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-colors overflow-hidden relative">
                      {item.image ? (
                        <PremiumImage src={item.image} alt={item.name} />
                      ) : mode === "products" ? (
                        <IconPackage size={24} />
                      ) : (
                        <IconBuildingStore size={24} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold truncate group-hover:text-indigo-400 transition-colors uppercase text-sm tracking-tight">
                        {item.name}
                      </p>
                      {mode === "products" ? (
                        <div className="flex flex-col">
                          <p className="text-zinc-500 text-xs truncate uppercase font-medium tracking-tighter">
                            {item.category_name || "General"}
                          </p>
                          {item.shop_location && (
                            <div className="flex items-center gap-1 text-zinc-600 text-[9px] uppercase font-bold tracking-tighter mt-0.5">
                              <IconMapPin
                                size={10}
                                className="text-indigo-500/30"
                              />
                              <span className="truncate">
                                {item.shop_location}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-zinc-500 text-[10px] uppercase font-bold tracking-tighter">
                          <IconMapPin size={10} />
                          <span className="truncate">
                            {item.location || "Online Only"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      {mode === "products" ? (
                        <>
                          <p
                            className={`font-black text-sm ${parseFloat(item.price.toString()) === 0 ? "text-emerald-400" : "text-white"}`}
                          >
                            {parseFloat(item.price.toString()) === 0
                              ? "GRATIS"
                              : `$${item.price}`}
                          </p>
                          <p
                            className={`text-[10px] font-bold uppercase ${item.is_infinite_stock || item.stock > 0 ? "text-green-500" : "text-red-500"}`}
                          >
                            {item.is_infinite_stock
                              ? "Stock Disponible"
                              : item.stock > 0
                                ? "En Stock"
                                : "Sin Stock"}
                          </p>
                        </>
                      ) : (
                        <Badge className="bg-green-500/10 text-green-400 border-none text-[10px] uppercase font-black tracking-widest">
                          Active
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : query.trim() ? (
              <div className="p-8 text-center space-y-2">
                <p className="text-white font-bold uppercase tracking-tight">
                  No matches found
                </p>
                <p className="text-zinc-500 text-xs">
                  Try{" "}
                  {mode === "products"
                    ? "searching a store"
                    : "searching a product"}{" "}
                  instead.
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2 text-zinc-500 px-2">
                  <IconTrendingUp size={16} />
                  <span className="text-[10px] font-black tracking-widest uppercase">
                    Popular {mode}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(mode === "products"
                    ? ["Headphones", "Gaming", "Essentials"]
                    : ["Tech Store", "Fashion", "Nearby"]
                  ).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-white/5 hover:bg-white/10 cursor-pointer text-zinc-300"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
