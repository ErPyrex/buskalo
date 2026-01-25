"use client";

import { IconDeviceFloppy, IconLoader2, IconTrash, IconPhoto, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
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
      setImagePreview(product.image || null);
      setImage(null);
    }
  }, [product, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !product) return;
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      if (formData.category) data.append("category", formData.category);
      if (image) data.append("image", image);

      await updateProduct(product.id, data, token);

      onProductUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update product", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !product) return;

    setDeleting(true);
    try {
      await deleteProduct(product.id, token);
      onProductUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to delete product", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-950 border-white/10 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight uppercase">
            Edit Product
          </DialogTitle>
          <DialogDescription className="text-zinc-500 font-medium">
            Modify the details of your product or remove it from the catalog.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="grid gap-2">
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
                className="bg-white/5 border-white/10 text-white placeholder:text-zinc-700 rounded-xl resize-none h-24"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
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
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
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
                  <SelectValue placeholder="Select Category" />
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

            <div className="grid gap-2">
              <Label className="text-zinc-400 text-xs font-bold uppercase tracking-wider">
                Product Image
              </Label>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setImage(null); setImagePreview(null); }}
                      className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white hover:bg-red-500 transition-colors"
                    >
                      <IconX size={12} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-20 h-20 rounded-xl border border-dashed border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                    <IconPhoto size={24} className="text-zinc-500" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                )}
                <div className="text-xs text-zinc-500">
                  <p className="font-bold text-zinc-400">Update image (JPG/PNG)</p>
                  <p>Leave empty to keep current</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-6 border-t border-white/5 flex items-center justify-between w-full gap-4">
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
                disabled={loading}
              >
                {loading ? (
                  <IconLoader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <IconDeviceFloppy size={20} />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
