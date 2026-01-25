"use client";

import MyShops from "@/components/MyShops";
import ProductSearch from "@/components/ProductSearch";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, logout, loading: authLoading } = useAuth();

  return (
    <main className="relative min-h-[calc(100vh-64px)] bg-black overflow-hidden flex flex-col items-center justify-center p-6 md:p-24 selection:bg-indigo-500/30">
      {/* Background decoration */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      <div className="z-10 text-center space-y-12 w-full max-w-4xl">
        <div className="space-y-6 text-center">
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white mb-6 leading-[0.9]">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Buskalo!
            </span>
          </h1>

          <div className="py-8 max-w-2xl mx-auto">
            <ProductSearch />
          </div>
        </div>

        {user && (
          <div className="mt-12">
            <MyShops />
          </div>
        )}
      </div>
    </main>
  );
}
