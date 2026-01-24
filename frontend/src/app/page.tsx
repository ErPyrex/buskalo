"use client";

import {
  IconBrandDjango,
  IconBrandNextjs,
  IconRocket,
} from "@tabler/icons-react";
import Link from "next/link";
import ApiTest from "@/components/ApiTest";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black overflow-hidden flex flex-col items-center justify-center p-6 md:p-24 selection:bg-indigo-500/30">
      {/* Background decoration */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      <div className="z-10 text-center space-y-12 max-w-4xl">
        <div className="space-y-6">
          <div className="flex justify-center gap-2 mb-4">
            <Badge
              variant="outline"
              className="px-4 py-1 border-white/10 text-white/60 bg-white/5 backdrop-blur-sm"
            >
              v1.0.0
            </Badge>
            <Badge variant="secondary" className="px-4 py-1 gap-1">
              <IconRocket size={14} className="text-indigo-400" />
              Ready for Production
            </Badge>
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-6 leading-[0.9]">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              MODERN
            </span>
            <br />
            ARCHITECTURE
          </h1>

          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            Next.js 16 + Shadcn Lyra + Django Rest Framework. The ultimate
            starting point for high-performance applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-xl hover:border-white/10 transition-colors">
            <CardContent className="pt-6 flex flex-col items-center gap-4">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <IconBrandNextjs size={32} className="text-white" />
              </div>
              <div className="text-center">
                <h3 className="text-white font-bold">Frontend</h3>
                <p className="text-zinc-500 text-sm">
                  Next.js, Radix UI, Biome
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-xl hover:border-white/10 transition-colors">
            <CardContent className="pt-6 flex flex-col items-center gap-4">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <IconBrandDjango size={32} className="text-blue-400" />
              </div>
              <div className="text-center">
                <h3 className="text-white font-bold">Backend</h3>
                <p className="text-zinc-500 text-sm">Django, DRF, SQLite</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <ApiTest />
          <Link href="/products">
            <Button
              variant="outline"
              className="mt-8 rounded-xl font-medium shadow-lg hover:shadow-indigo-500/10 transition-all active:scale-95 px-8 py-6 h-auto text-lg border-white/10 bg-white/5 backdrop-blur-sm text-white hover:bg-white hover:text-black"
            >
              View Product Catalog
            </Button>
          </Link>
        </div>

        <div className="mt-20 pt-12 border-t border-white/5 flex flex-col items-center gap-6">
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white/30">
            Technology Stack
          </span>
          <div className="flex flex-wrap gap-8 items-center justify-center opacity-40 hover:opacity-100 transition-opacity duration-500">
            <img
              src="https://raw.githubusercontent.com/biomejs/biome/main/website/src/assets/logo-light.svg"
              alt="Biome"
              className="h-6"
            />
            <img
              src="https://www.djangoproject.com/m/img/logos/django-logo-negative.svg"
              alt="Django"
              className="h-4"
            />
            <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tighter">
              <div className="w-5 h-5 bg-white rounded-sm" />
              shadcn/ui
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
