"use client";

import {
  IconBuildingStore,
  IconLogin,
  IconLogout,
  IconPackage,
  IconPlus,
  IconSearch,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
            <IconSearch className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            Buskalo!
          </span>
        </Link>

        {/* Navigation - Centered */}
        <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          <Link
            href="/products"
            className="text-zinc-400 hover:text-white flex items-center gap-2 transition-colors font-medium"
          >
            <IconPackage size={18} />
            Productos
          </Link>
          <Link
            href="/shops"
            className="text-zinc-400 hover:text-white flex items-center gap-2 transition-colors font-medium"
          >
            <IconBuildingStore size={18} />
            Tiendas
          </Link>
        </div>

        {/* Auth Actions - Right */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/shops/new">
                <Button
                  size="sm"
                  className="hidden sm:flex bg-indigo-600 hover:bg-indigo-500 text-white gap-2 h-9 px-4"
                >
                  <IconPlus size={16} />
                  <span>Crear Tienda</span>
                </Button>
                <Button
                  size="icon"
                  className="flex sm:hidden bg-indigo-600 hover:bg-indigo-500 text-white h-9 w-9"
                  title="Crear Tienda"
                >
                  <IconPlus size={18} />
                </Button>
              </Link>
              <Link
                href="/profile"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
              >
                <IconUser
                  size={16}
                  className="text-indigo-400 group-hover:scale-110 transition-transform"
                />
                <span className="text-sm text-zinc-300 font-medium">
                  {user.username}
                </span>
              </Link>

              {/* Mobile User Icon */}
              <Link href="/profile" className="flex sm:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-zinc-400 hover:text-white hover:bg-white/10 h-9 w-9"
                  title="Mi Perfil"
                >
                  <IconUser size={20} className="text-indigo-400" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="text-zinc-400 hover:text-white hover:bg-white/10 h-9 w-9"
                title="Cerrar sesión"
              >
                <IconLogout size={20} />
              </Button>
            </div>
          ) : (
            <Link href="/auth">
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 px-5">
                <IconLogin size={18} />
                <span className="hidden sm:inline">Iniciar Sesión</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
