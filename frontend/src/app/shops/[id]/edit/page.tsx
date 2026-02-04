"use client";

import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconLoader2,
  IconPhoto,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { ImageCropper } from "@/components/ImageCropper";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { deleteShop, getShops, updateShop } from "@/lib/api/shops";
import { compressImage } from "@/lib/utils/image";

const LocationPicker = dynamic(() => import("@/components/LocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full bg-white/5 animate-pulse rounded-xl flex items-center justify-center text-zinc-500 text-sm">
      Cargando mapa...
    </div>
  ),
});

export default function EditShopPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user, token } = useAuth();
  const router = useRouter();

  const [shop, setShop] = useState<any>(null);
  const [loadingShop, setLoadingShop] = useState(true);
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    latitude: null as number | null,
    longitude: null as number | null,
    is_physical: true,
  });
  const [image, setImage] = useState<File | Blob | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tempImage, setTempImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchShop() {
      if (!token || !user) return;
      try {
        const shops = await getShops({ owner: user.id.toString() });
        const foundShop = shops.find((s: any) => s.id === parseInt(id));
        if (!foundShop) {
          toast.error("Tienda no encontrada");
          router.push("/");
          return;
        }
        setShop(foundShop);
        setFormData({
          name: foundShop.name || "",
          description: foundShop.description || "",
          location: foundShop.location || "",
          latitude: foundShop.latitude || null,
          longitude: foundShop.longitude || null,
          is_physical: foundShop.is_physical ?? true,
        });
        setImagePreview(foundShop.image || null);
      } catch (error) {
        console.error("Error fetching shop:", error);
      } finally {
        setLoadingShop(false);
      }
    }

    if (token && user) {
      fetchShop();
    }
  }, [id, token, user, router]);

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
    setImage(croppedBlob);
    const croppedUrl = URL.createObjectURL(croppedBlob);
    setImagePreview(croppedUrl);
    setTempImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !shop) return;
    setLoading(true);

    let imageToUpload = image;
    if (image) {
      setCompressing(true);
      imageToUpload = await compressImage(image);
      setCompressing(false);
    }

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append(
        "location",
        formData.is_physical ? formData.location : "Tienda en línea",
      );
      data.append("is_physical", formData.is_physical.toString());
      if (formData.is_physical && formData.latitude)
        data.append("latitude", formData.latitude.toString());
      if (formData.is_physical && formData.longitude)
        data.append("longitude", formData.longitude.toString());
      if (imageToUpload) data.append("image", imageToUpload);

      await updateShop(shop.id, data, token);
      toast.success("¡Configuración guardada!", {
        description: `La información de ${formData.name} se ha actualizado correctamente.`,
      });
      router.push(`/shops/${shop.id}`);
    } catch (error) {
      console.error("Failed to update shop", error);
      toast.error("Error de actualización", {
        description: "No pudimos guardar los cambios de la tienda.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !shop) return;

    setDeleting(true);
    try {
      await deleteShop(shop.id, token);
      toast.success("Tienda eliminada", {
        description: "Tu negocio ha sido borrado exitosamente.",
      });
      router.push("/");
    } catch (error) {
      console.error("Failed to delete shop", error);
      toast.error("Error al eliminar", {
        description: "Hubo un problema al intentar borrar la tienda.",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loadingShop) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <IconLoader2 className="animate-spin text-indigo-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 selection:bg-indigo-500/30">
      {tempImage && (
        <ImageCropper
          image={tempImage}
          onCropComplete={handleCropComplete}
          onCancel={() => setTempImage(null)}
          aspect={16 / 9}
        />
      )}

      <div className="max-w-3xl mx-auto space-y-8">
        <Link
          href={`/shops/${id}`}
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
        >
          <IconArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span>Volver al Dashboard</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight uppercase">
              Editar Tienda
            </h1>
            <p className="text-zinc-500">
              Personaliza la identidad y ubicación de tu negocio.
            </p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                disabled={deleting}
                className="text-red-500 hover:text-red-400 hover:bg-red-500/10 gap-2 font-bold"
              >
                <IconTrash size={18} />
                Eliminar Tienda
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-zinc-950 border-white/10 text-white">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-black uppercase tracking-tight">
                  ¿Estás completamente seguro?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-zinc-500">
                  Esta acción no se puede deshacer. Se eliminará permanentemente
                  la tienda{" "}
                  <span className="text-white font-bold">"{shop.name}"</span> y
                  todos sus productos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold"
                >
                  Confirmar Eliminación
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-xl">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-zinc-400 text-xs font-bold uppercase tracking-wider"
                  >
                    Nombre de la Tienda
                  </Label>
                  <Input
                    id="name"
                    className="bg-black/20 border-white/10 h-12 text-white focus:border-indigo-500/50"
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
                    Descripción
                  </Label>
                  <Textarea
                    id="description"
                    className="bg-black/20 border-white/10 min-h-[120px] text-white focus:border-indigo-500/50 resize-none"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <Checkbox
                    id="is_physical"
                    checked={formData.is_physical}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_physical: !!checked })
                    }
                    className="border-indigo-500 data-[state=checked]:bg-indigo-600"
                  />
                  <div className="grid gap-1 leading-none">
                    <Label
                      htmlFor="is_physical"
                      className="text-sm font-bold text-white uppercase tracking-tight cursor-pointer"
                    >
                      Establecimiento Físico
                    </Label>
                    <p className="text-[10px] text-zinc-500">
                      Marca esta opción si tu tienda tiene una ubicación física
                      para tus clientes.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-zinc-400 text-xs font-bold uppercase tracking-wider">
                    Ubicación de la Tienda
                  </Label>
                  {formData.is_physical ? (
                    <div className="space-y-4">
                      <LocationPicker
                        initialPosition={
                          shop.latitude
                            ? [shop.latitude, shop.longitude]
                            : undefined
                        }
                        onLocationSelect={(lat, lng, address) =>
                          setFormData({
                            ...formData,
                            location: address,
                            latitude: lat,
                            longitude: lng,
                          })
                        }
                      />
                      <div className="text-xs text-zinc-500 bg-white/5 p-3 rounded-xl border border-white/5 leading-tight">
                        <span className="font-bold text-zinc-400">
                          DIRECCIÓN ACTUAL:
                        </span>{" "}
                        {formData.location ||
                          "Selecciona un punto en el mapa..."}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center gap-3">
                      <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 text-xs font-bold">
                        ONLINE
                      </div>
                      <div className="text-sm text-zinc-400 font-medium">
                        Esta tienda opera exclusivamente de forma virtual.
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <Label className="text-zinc-400 text-xs font-bold uppercase tracking-wider">
                    Banner de la Tienda
                  </Label>
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-white/5 rounded-2xl border border-white/5">
                    {imagePreview ? (
                      <div className="relative w-full sm:w-48 h-28 rounded-xl overflow-hidden border border-white/10 group">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImage(null);
                            setImagePreview(null);
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <IconX size={16} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full sm:w-48 h-28 rounded-xl border border-dashed border-white/10 bg-black/20 hover:bg-white/5 cursor-pointer transition-all">
                        <IconPhoto size={32} className="text-zinc-600" />
                        <span className="text-[10px] text-zinc-500 mt-2 font-bold uppercase">
                          Subir Imagen
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    )}
                    <div className="flex-1 text-center sm:text-left space-y-1">
                      <p className="font-bold text-zinc-300">
                        Imagen de Portada
                      </p>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Recomendado: Formato panorámico (16:9). <br />
                        Deja este campo vacío para mantener la imagen actual.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-white text-black hover:bg-zinc-200 font-bold rounded-xl shadow-lg shadow-white/5 flex items-center justify-center gap-2"
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
                <Link href={`/shops/${id}`} className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 border-white/10 bg-transparent text-white hover:bg-white/5 font-bold rounded-xl"
                  >
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
