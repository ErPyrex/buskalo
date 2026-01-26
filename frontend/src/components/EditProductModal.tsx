"use client";

import {
  IconDeviceFloppy,
  IconLoader2,
  IconPhoto,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import {
  deleteProduct,
  getCategories,
  updateProduct,
} from "@/lib/api/products";
import { compressImage } from "@/lib/utils/image";
import type { Product } from "@/types";

interface EditProductModalProps {
  product: Product | null;
  onProductUpdated: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditProductModal({
  product,
  onProductUpdated,
  open,
  onOpenChange,
}: EditProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });
  const [isInfinite, setIsInfinite] = useState(false);
  const [image, setImage] = useState<File | Blob | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tempImage, setTempImage] = useState<string | null>(null);

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

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value.startsWith("-")) return;
    if (value.length > 1 && value.startsWith("0") && value[1] !== ".") {
      value = value.replace(/^0+/, "");
      if (value === "") value = "0";
    }
    setFormData({ ...formData, price: value });
  };

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value.startsWith("-")) return;
    if (value.includes(".")) return;
    if (value.length > 1 && value.startsWith("0")) {
      value = value.replace(/^0+/, "");
      if (value === "") value = "0";
    }

    const numValue = parseInt(value, 10);
    if (!Number.isNaN(numValue) && numValue >= 1) {
      setIsInfinite(false);
    }

    setFormData({ ...formData, stock: value });
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    setImage(croppedBlob);
    const croppedUrl = URL.createObjectURL(croppedBlob);
    setImagePreview(croppedUrl);
    setTempImage(null);
  };

  useEffect(() => {
    if (open) {
      getCategories().then(setCategories).catch(console.error);
    }
  }, [open]);

  useEffect(() => {
    if (product && open) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price.toString() || "",
        stock: product.stock.toString() || "",
        category: product.category?.toString() || "",
      });
      setIsInfinite(product.is_infinite_stock || false);
      setImagePreview(product.image || null);
      setImage(null);
    }
  }, [product, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !product) return;
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
      data.append("price", formData.price || "0");
      data.append("stock", formData.stock || "0");
      data.append("is_infinite_stock", isInfinite ? "1" : "0");
      if (formData.category) data.append("category", formData.category);
      if (imageToUpload) data.append("image", imageToUpload);

      await updateProduct(product.id, data, token);
      toast.success("¡Producto actualizado!", {
        description: `Los cambios en ${formData.name} se han guardado correctamente.`,
      });

      onProductUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update product", error);
      toast.error("Error al actualizar", {
        description: "No se pudieron guardar los cambios del producto.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !product) return;

    setDeleting(true);
    try {
      await deleteProduct(product.id, token);
      toast.success("Producto eliminado", {
        description:
          "El producto ha sido removido del catálogo permanentemente.",
      });
      onProductUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to delete product", error);
      toast.error("Error al eliminar", {
        description: "Hubo un problema al intentar borrar el producto.",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-950 border-white/10 text-white sm:max-w-[500px] max-h-[90vh] p-0 overflow-hidden flex flex-col shadow-2xl rounded-3xl">
        {tempImage && (
          <ImageCropper
            image={tempImage}
            onCropComplete={handleCropComplete}
            onCancel={() => setTempImage(null)}
          />
        )}
        <div className="p-6 pb-2 flex-none">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight uppercase">
              Edit Product
            </DialogTitle>
            <DialogDescription className="text-zinc-500 font-medium">
              Modify the details of your product or remove it from the catalog.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col min-h-0 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-4 custom-scrollbar">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                <div className="sm:col-span-3 grid gap-2">
                  <Label
                    htmlFor="edit-prod-name"
                    className="text-zinc-400 text-xs font-bold uppercase tracking-wider"
                  >
                    Product Name
                  </Label>
                  <Input
                    id="edit-prod-name"
                    placeholder="Product Name"
                    className="bg-white/5 border-white/10 text-white placeholder:text-zinc-700 h-11 rounded-xl"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="sm:col-span-2 grid gap-2">
                  <Label
                    htmlFor="edit-prod-category"
                    className="text-zinc-400 text-xs font-bold uppercase tracking-wider"
                  >
                    Category
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(val) =>
                      setFormData({ ...formData, category: val })
                    }
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white h-11 rounded-xl">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/10 text-white">
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="edit-prod-description"
                  className="text-zinc-400 text-xs font-bold uppercase tracking-wider"
                >
                  Description
                </Label>
                <Textarea
                  id="edit-prod-description"
                  placeholder="Product description..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-zinc-700 rounded-xl resize-none h-20"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4 items-start">
                <div className="grid gap-2">
                  <Label
                    htmlFor="edit-prod-price"
                    className="text-zinc-400 text-xs font-bold uppercase tracking-wider"
                  >
                    Price ($)
                  </Label>
                  <Input
                    id="edit-prod-price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="bg-white/5 border-white/10 text-white placeholder:text-zinc-700 h-11 rounded-xl"
                    value={formData.price}
                    onChange={handlePriceChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="edit-prod-stock"
                    className="text-zinc-400 text-xs font-bold uppercase tracking-wider"
                  >
                    Stock
                  </Label>
                  <Input
                    id="edit-prod-stock"
                    type="number"
                    placeholder="0"
                    className="bg-white/5 border-white/10 text-white placeholder:text-zinc-700 h-11 rounded-xl"
                    value={formData.stock}
                    onChange={handleStockChange}
                  />
                  {(formData.stock === "0" || formData.stock === "") && (
                    <div className="flex items-center space-x-2 mt-2 p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/10 animate-in fade-in slide-in-from-top-2 duration-300">
                      <Checkbox
                        id="editIsInfinite"
                        checked={isInfinite}
                        onCheckedChange={(checked) => setIsInfinite(!!checked)}
                        className="border-indigo-500/50 data-[state=checked]:bg-indigo-500 data-[state=checked]:text-white"
                      />
                      <Label
                        htmlFor="editIsInfinite"
                        className="text-[10px] font-bold text-indigo-400 uppercase leading-none cursor-pointer"
                      >
                        Marcar como Stock Infinito
                      </Label>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                  Product Image
                </Label>
                <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
                  {imagePreview ? (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
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
                        className="absolute top-0.5 right-0.5 p-1 bg-black/60 rounded-full text-white hover:bg-red-500 transition-colors"
                      >
                        <IconX size={10} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-16 h-16 rounded-lg border border-dashed border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors flex-shrink-0">
                      <IconPhoto size={20} className="text-zinc-500" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                  <div className="text-[10px] text-zinc-500 leading-tight">
                    <p className="font-bold text-zinc-400 uppercase tracking-tighter mb-1">
                      Actualizar imagen
                    </p>
                    <p>
                      Soporta JPG, PNG o WebP. Deja vacío para mantener la
                      actual.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-white/5 bg-zinc-950/50 backdrop-blur-xl flex-none">
            <DialogFooter className="flex items-center justify-between w-full gap-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10 flex items-center gap-2 h-11 px-4 rounded-xl transition-all"
                    disabled={deleting}
                  >
                    {deleting ? (
                      <IconLoader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <IconTrash size={18} />
                        <span className="hidden sm:inline">Delete</span>
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-zinc-950 border-white/10 text-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-black uppercase tracking-tight">
                      Remove Product?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-zinc-500">
                      Are you sure you want to delete{" "}
                      <span className="text-white font-bold">
                        "{product?.name}"
                      </span>
                      ? This item will be removed from your store immediately.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl"
                    >
                      Confirm Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 h-11 px-6 rounded-xl transition-all font-bold"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-white text-black hover:bg-zinc-200 font-bold h-11 px-8 rounded-xl flex items-center gap-2 shadow-lg shadow-white/5 active:scale-95 transition-all"
                  disabled={loading || compressing}
                >
                  {loading || compressing ? (
                    <>
                      <IconLoader2 className="animate-spin" size={20} />
                      {compressing ? "Optimizing..." : "Saving..."}
                    </>
                  ) : (
                    <>
                      <IconDeviceFloppy size={20} />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
