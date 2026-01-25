"use client";

import { IconLoader2, IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
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
import { createProduct, getCategories } from "@/lib/api/products";

interface CreateProductModalProps {
  shopId: string;
  onProductCreated: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateProductModal({
  shopId,
  onProductCreated,
  open,
  onOpenChange,
}: CreateProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    shop: shopId,
  });

  useEffect(() => {
    if (open) {
      getCategories().then(setCategories).catch(console.error);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setLoading(true);

    try {
      await createProduct(
        {
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock, 10),
          category: formData.category ? parseInt(formData.category, 10) : null,
        },
        token,
      );

      onProductCreated();
      onOpenChange(false);
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        shop: shopId,
      });
    } catch (error) {
      console.error("Failed to create product", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-950 border-white/10 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight">
            ADD NEW PRODUCT
          </DialogTitle>
          <DialogDescription className="text-zinc-500 font-medium">
            Fill in the details to add a new item to your store's catalog.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label
                htmlFor="name"
                className="text-zinc-400 text-xs font-bold uppercase tracking-wider"
              >
                Product Name
              </Label>
              <Input
                id="name"
                placeholder="Premium Wireless Headphones"
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
                htmlFor="description"
                className="text-zinc-400 text-xs font-bold uppercase tracking-wider"
              >
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Briefly describe your product..."
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
                  htmlFor="price"
                  className="text-zinc-400 text-xs font-bold uppercase tracking-wider"
                >
                  Price ($)
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="99.99"
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
                  htmlFor="stock"
                  className="text-zinc-400 text-xs font-bold uppercase tracking-wider"
                >
                  Initial Stock
                </Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="25"
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
                htmlFor="category"
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
                  <SelectValue placeholder="Select a category" />
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

          <DialogFooter className="pt-4 border-t border-white/5">
            <Button
              type="button"
              variant="ghost"
              className="text-zinc-500 hover:text-white"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-11 px-8 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
              disabled={loading}
            >
              {loading ? (
                <IconLoader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <IconPlus size={20} />
                  Add Product
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
