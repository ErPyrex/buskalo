"use client";

import {
  IconArrowLeft,
  IconBuildingStore,
  IconCircleCheck,
  IconDeviceFloppy,
  IconLoader2,
  IconRocket,
  IconPhoto,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { createShop } from "@/lib/api/shops";

export default function NewShopPage() {
  const [loading, setLoading] = useState<"active" | "draft" | null>(null);
  const [success, setSuccess] = useState<{ type: "active" | "draft" } | null>(
    null,
  );
  const [error, setError] = useState("");
  const router = useRouter();
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "", // Backend uses 'location', frontend UI said 'address'
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async (status: "active" | "draft") => {
    if (!token) return;
    setLoading(status);
    setError("");

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("location", formData.location);
      data.append("status", status);
      if (image) data.append("image", image);

      await createShop(data, token);
      setSuccess({ type: status });
      setTimeout(() => router.push("/"), 2000);
    } catch (err: any) {
      setError(
        err.message ||
          `Could not ${status === "draft" ? "save" : "launch"} shop.`,
      );
      setLoading(null);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <Card className="bg-zinc-900/40 border-indigo-500/50 backdrop-blur-xl w-full max-w-md text-center py-12">
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <div className="p-4 bg-indigo-500/20 rounded-full text-indigo-400">
                <IconCircleCheck size={64} />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {success.type === "active"
                  ? "STORE LAUNCHED!"
                  : "BORRADOR GUARDADO!"}
              </h2>
              <p className="text-zinc-500">
                {success.type === "active"
                  ? "Your store has been successfully launched. Redirecting you home..."
                  : "Tu borrador ha sido guardado. Podrás publicarlo más tarde desde tu dashboard."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] -z-10" />

      <Link href="/" className="absolute top-8 left-8">
        <Button
          variant="ghost"
          className="text-zinc-400 hover:text-white flex items-center gap-2"
        >
          <IconArrowLeft size={20} />
          Cancel
        </Button>
      </Link>

      <div className="z-10 w-full max-w-xl space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <IconBuildingStore size={24} />
            </div>
            <Badge
              variant="outline"
              className="border-white/10 text-indigo-400"
            >
              Step 1 of 1
            </Badge>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white">
            START YOUR <span className="text-indigo-500">BUSINESS</span>
          </h1>
          <p className="text-zinc-500 max-w-md">
            Fill in the details below to register your store on our platform.
            You'll be able to manage products after this.
          </p>
        </div>

        <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-xl overflow-hidden">
          <CardContent className="pt-6">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-zinc-400 text-xs font-bold uppercase tracking-wider"
                >
                  Store Name
                </Label>
                <Input
                  id="name"
                  placeholder="The Elite Emporium"
                  className="bg-black/20 border-white/10 h-11 text-white focus:border-indigo-500/50 rounded-xl"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-zinc-400 text-xs font-bold uppercase tracking-wider"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Tell us what makes your store unique..."
                  className="bg-black/20 border-white/10 text-white focus:border-indigo-500/50 rounded-xl min-h-[120px] resize-none"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="location"
                  className="text-zinc-400 text-xs font-bold uppercase tracking-wider"
                >
                  Physical Address
                </Label>
                <Input
                  id="location"
                  placeholder="123 Tech Square, City"
                  className="bg-black/20 border-white/10 h-11 text-white focus:border-indigo-500/50 rounded-xl"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-400 text-xs font-bold uppercase tracking-wider">
                  Store Banner / Logo
                </Label>
                <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/10 group">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => { setImage(null); setImagePreview(null); }}
                        className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <IconX size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-24 h-24 rounded-xl border border-dashed border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                      <IconPhoto size={32} className="text-zinc-500" />
                      <span className="text-[10px] text-zinc-500 mt-2">ADD IMAGE</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  )}
                  <div className="flex-1 text-xs text-zinc-500 space-y-1">
                    <p className="font-bold text-zinc-400">Branding is everything</p>
                    <p>Upload a photo that represents your business. JPG, PNG or WebP supported.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-4">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-zinc-500 hover:text-white flex-1"
                  disabled={!!loading}
                  onClick={() => handleCreate("draft")}
                >
                  {loading === "draft" ? (
                    <IconLoader2 className="animate-spin" size={20} />
                  ) : (
                    <span className="flex items-center gap-2">
                      <IconDeviceFloppy size={18} />
                      Save as draft
                    </span>
                  )}
                </Button>
                <Button
                  type="button"
                  className="bg-indigo-600 text-white hover:bg-indigo-500 font-bold rounded-xl px-8 h-12 flex-1 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all flex items-center gap-2"
                  disabled={!!loading}
                  onClick={() => handleCreate("active")}
                >
                  {loading === "active" ? (
                    <IconLoader2 className="animate-spin" size={20} />
                  ) : (
                    <span className="flex items-center gap-2">
                      <IconRocket size={18} />
                      Launch Store
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
