"use client";

import {
  IconArrowLeft,
  IconCheck,
  IconDeviceFloppy,
  IconLoader2,
  IconMail,
  IconPhoto,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ImageCropper } from "@/components/ImageCropper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { updateProfile } from "@/lib/api/auth";
import { compressImage } from "@/lib/utils/image";

export default function ProfilePage() {
  const { user, token, loading: authLoading, loginState } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    bio: "",
  });

  const [avatar, setAvatar] = useState<File | Blob | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [tempImage, setTempImage] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/auth");
    }
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        bio: user.bio || "",
      });
      setAvatarPreview(user.avatar || null);
    }
  }, [user, token, authLoading, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    setAvatar(croppedBlob);
    const croppedUrl = URL.createObjectURL(croppedBlob);
    setAvatarPreview(croppedUrl);
    setTempImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    let imageToUpload = avatar;

    if (avatar && avatar instanceof File) {
      setCompressing(true);
      imageToUpload = await compressImage(avatar);
      setCompressing(false);
    }

    try {
      const data = new FormData();
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("first_name", formData.first_name);
      data.append("last_name", formData.last_name);
      data.append("bio", formData.bio);
      if (imageToUpload) {
        data.append("avatar", imageToUpload);
      }

      const updatedUser = await updateProfile(data, token);

      // Update local state by re-triggering loginState with the same token
      // or we could add a dedicated refresh function. For now, loginState works.
      loginState(token);

      toast.success("¡Perfil actualizado!", {
        description: "Tus cambios se han guardado correctamente.",
      });
    } catch (error: any) {
      toast.error("Error al actualizar", {
        description:
          error.message || "No pudimos guardar los cambios corporativos.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <IconLoader2 className="animate-spin text-indigo-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
      {tempImage && (
        <ImageCropper
          image={tempImage}
          onCropComplete={handleCropComplete}
          onCancel={() => setTempImage(null)}
          aspect={1}
        />
      )}

      <div className="max-w-2xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
        >
          <IconArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span>Volver al inicio</span>
        </Link>

        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight uppercase">
            Configuración de Perfil
          </h1>
          <p className="text-zinc-500">
            Gestiona tu identidad y presencia en Buskalo!
          </p>
        </div>

        <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-white/10 bg-zinc-800 flex items-center justify-center">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <IconUser size={48} className="text-zinc-600" />
                    )}
                  </div>
                  <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-3xl">
                    <IconPhoto size={24} />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <h3 className="font-bold text-white">Foto de Perfil</h3>
                  <p className="text-xs text-zinc-500">
                    Recomendado: 400x400px. JPG, PNG o WebP.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2 border-white/10 bg-white/5 hover:bg-white/10 text-xs h-8"
                    onClick={() =>
                      document
                        .querySelector<HTMLInputElement>('input[type="file"]')
                        ?.click()
                    }
                  >
                    Cambiar imagen
                  </Button>
                </div>
              </div>

              <FieldGroup className="gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Field>
                    <FieldLabel
                      htmlFor="first_name"
                      className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2"
                    >
                      Nombre
                    </FieldLabel>
                    <Input
                      id="first_name"
                      placeholder="John"
                      className="bg-black/20 border-white/10 h-11 focus:border-indigo-500/50 text-white"
                      value={formData.first_name}
                      onChange={(e) =>
                        setFormData({ ...formData, first_name: e.target.value })
                      }
                    />
                  </Field>

                  <Field>
                    <FieldLabel
                      htmlFor="last_name"
                      className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2"
                    >
                      Apellidos
                    </FieldLabel>
                    <Input
                      id="last_name"
                      placeholder="Doe"
                      className="bg-black/20 border-white/10 h-11 focus:border-indigo-500/50 text-white"
                      value={formData.last_name}
                      onChange={(e) =>
                        setFormData({ ...formData, last_name: e.target.value })
                      }
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel
                    htmlFor="username"
                    className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2"
                  >
                    Nombre de Usuario
                  </FieldLabel>
                  <div className="relative">
                    <IconUser
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
                      size={18}
                    />
                    <Input
                      id="username"
                      className="bg-black/20 border-white/10 pl-10 h-11 focus:border-indigo-500/50 text-white"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      required
                    />
                  </div>
                </Field>

                <Field>
                  <FieldLabel
                    htmlFor="email"
                    className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2"
                  >
                    Correo Electrónico
                  </FieldLabel>
                  <div className="relative">
                    <IconMail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
                      size={18}
                    />
                    <Input
                      id="email"
                      type="email"
                      className="bg-black/20 border-white/10 pl-10 h-11 focus:border-indigo-500/50 text-white"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </Field>

                <Field>
                  <FieldLabel
                    htmlFor="bio"
                    className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2"
                  >
                    Biografía
                  </FieldLabel>
                  <Textarea
                    id="bio"
                    placeholder="Cuéntanos un poco sobre ti..."
                    className="bg-black/20 border-white/10 min-h-[100px] resize-none focus:border-indigo-500/50 text-white"
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                  />
                </Field>
              </FieldGroup>

              <div className="pt-4 border-t border-white/5">
                <Button
                  type="submit"
                  className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-bold rounded-xl shadow-lg shadow-white/5 flex items-center justify-center gap-2"
                  disabled={loading || compressing}
                >
                  {loading || compressing ? (
                    <>
                      <IconLoader2 className="animate-spin" size={20} />
                      {compressing ? "Optimizando..." : "Guardando..."}
                    </>
                  ) : (
                    <>
                      <IconDeviceFloppy size={20} />
                      Guardar Cambios
                    </>
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
