"use client";

import {
  IconArrowLeft,
  IconLoader2,
  IconLock,
  IconMail,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { login, register as registerApi } from "@/lib/api/auth";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { loginState } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const data = await login({
          username: formData.username,
          password: formData.password,
        });
        loginState(data.access);
        router.push("/");
      } else {
        await registerApi(formData);
        const data = await login({
          username: formData.username,
          password: formData.password,
        });
        loginState(data.access);
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
      <div className="absolute -bottom-8 right-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />

      <Link href="/" className="absolute top-8 left-8">
        <Button
          variant="ghost"
          className="text-zinc-400 hover:text-white flex items-center gap-2"
        >
          <IconArrowLeft size={20} />
          Back to home
        </Button>
      </Link>

      <div className="z-10 w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-white">
            {isLogin ? "WELCOME BACK" : "JOIN THE CLUB"}
          </h1>
          <p className="text-zinc-500 font-medium">
            {isLogin
              ? "Enter your credentials to access your account"
              : "Create an account to start your journey"}
          </p>
        </div>

        <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-xl">
              {isLogin ? "Login" : "Sign up"}
            </CardTitle>
            <CardDescription className="text-zinc-500">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors outline-none"
              >
                {isLogin ? "Create one" : "Sign in"}
              </button>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-zinc-400 text-xs font-bold uppercase tracking-wider"
                >
                  Username
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600">
                    <IconUser size={18} />
                  </span>
                  <Input
                    id="username"
                    placeholder="johndoe"
                    className="bg-black/20 border-white/10 pl-10 h-11 text-white placeholder:text-zinc-700 focus:border-indigo-500/50 transition-all rounded-xl"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Label
                    htmlFor="email"
                    className="text-zinc-400 text-xs font-bold uppercase tracking-wider"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600">
                      <IconMail size={18} />
                    </span>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="bg-black/20 border-white/10 pl-10 h-11 text-white placeholder:text-zinc-700 focus:border-indigo-500/50 transition-all rounded-xl"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-zinc-400 text-xs font-bold uppercase tracking-wider"
                >
                  Password
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600">
                    <IconLock size={18} />
                  </span>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-black/20 border-white/10 pl-10 h-11 text-white placeholder:text-zinc-700 focus:border-indigo-500/50 transition-all rounded-xl"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-bold rounded-xl transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <IconLoader2 className="animate-spin" size={20} />
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
