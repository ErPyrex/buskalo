"use client";

import {
  IconLoader2,
  IconPackage,
  IconSearch,
  IconTrendingUp,
  IconX,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useClickAway } from "react-use";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getProducts } from "@/lib/api/products";
import type { Product } from "@/types";

export default function ProductSearch() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useClickAway(containerRef, () => setIsOpen(false));

  useEffect(() => {
    // Pre-fetch products for blazingly fast searching on focus
    const fetchInitial = async () => {
      setLoading(true);
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setFiltered([]);
      return;
    }

    const searchStr = query.toLowerCase();
    const results = products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(searchStr) ||
          p.description?.toLowerCase().includes(searchStr) ||
          p.category_name?.toLowerCase().includes(searchStr),
      )
      .slice(0, 5); // Limit to top 5 for speed/UI

    setFiltered(results);
  }, [query, products]);

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto z-50">
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-indigo-500 transition-colors">
          <IconSearch size={20} />
        </div>
        <Input
          placeholder="Search products, brands, categories..."
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
        <Card className="absolute top-full left-0 w-full mt-2 bg-zinc-950/90 border-white/10 backdrop-blur-2xl overflow-hidden rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2">
            {loading && products.length === 0 ? (
              <div className="p-8 flex flex-col items-center gap-3 text-zinc-500">
                <IconLoader2 className="animate-spin" size={24} />
                <p className="text-xs font-bold uppercase tracking-widest">
                  Indexing data...
                </p>
              </div>
            ) : filtered.length > 0 ? (
              <div className="space-y-1">
                <div className="px-3 py-2 flex items-center justify-between">
                  <span className="text-[10px] font-black tracking-widest text-zinc-600 uppercase">
                    Top Results
                  </span>
                  <Badge
                    variant="outline"
                    className="border-indigo-500/20 text-indigo-400 text-[10px]"
                  >
                    Instant
                  </Badge>
                </div>
                {filtered.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => {
                      router.push(`/products/${product.id}`);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all text-left group"
                  >
                    <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center text-zinc-600 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-colors">
                      <IconPackage size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold truncate group-hover:text-indigo-400 transition-colors uppercase text-sm tracking-tight">
                        {product.name}
                      </p>
                      <p className="text-zinc-500 text-xs truncate uppercase font-medium tracking-tighter">
                        {product.category_name || "General"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-black text-sm">
                        ${product.price}
                      </p>
                      {product.stock > 0 ? (
                        <p className="text-[10px] text-green-500 font-bold uppercase">
                          In Stock
                        </p>
                      ) : (
                        <p className="text-[10px] text-red-500 font-bold uppercase">
                          Out of Stock
                        </p>
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
                  Try searching for something else or browse categories.
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2 text-zinc-500 px-2">
                  <IconTrendingUp size={16} />
                  <span className="text-[10px] font-black tracking-widest uppercase">
                    Popular searches
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Headphones", "Gaming", "Essentials", "Sale"].map((tag) => (
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

          {filtered.length > 0 && (
            <div className="bg-white/5 p-3 flex items-center justify-center border-t border-white/5">
              <button 
                type="button"
                className="text-[10px] font-black text-zinc-400 hover:text-white uppercase tracking-widest transition-colors"
              >
                View All Results
              </button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
