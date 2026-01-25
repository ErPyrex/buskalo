"use client";

import { IconDeviceFloppy, IconLoader2, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { deleteShop, updateShop } from "@/lib/api/shops";

interface EditShopModalProps {
  shop: any;
  onShopUpdated: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditShopModal({
  shop,
  onShopUpdated,
  open,
  onOpenChange,
}: EditShopModalProps) {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { token } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
  });

  useEffect(() => {
    if (shop && open) {
      setFormData({
        name: shop.name || "",
        description: shop.description || "",
        location: shop.location || "",
      });
    }
  }, [shop, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !shop) return;
    setLoading(true);

    try {
      await updateShop(shop.id, formData, token);
      onShopUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update shop", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !shop) return;

    setDeleting(true);
    try {
      await deleteShop(shop.id, token);
      onOpenChange(false);
      router.push("/");
    } catch (error) {
      console.error("Failed to delete shop", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-950 border-white/10 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight uppercase">
            Store Settings
          </DialogTitle>
          <DialogDescription className="text-zinc-500 font-medium">
            Update your store's identity or remove it permanently.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label
                htmlFor="edit-name"
                className="text-zinc-400 text-xs font-bold uppercase tracking-wider"
              >
                Store Name
              </Label>
              <Input
                id="edit-name"
                placeholder="The Elite Emporium"
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
                htmlFor="edit-description"
                className="text-zinc-400 text-xs font-bold uppercase tracking-wider"
              >
                Description
              </Label>
              <Textarea
                id="edit-description"
                placeholder="Tell us what makes your store unique..."
                className="bg-white/5 border-white/10 text-white placeholder:text-zinc-700 rounded-xl resize-none h-32"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="edit-location"
                className="text-zinc-400 text-xs font-bold uppercase tracking-wider"
              >
                Physical Address
              </Label>
              <Input
                id="edit-location"
                placeholder="123 Tech Square, City"
                className="bg-white/5 border-white/10 text-white placeholder:text-zinc-700 h-11 rounded-xl"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
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
                      <span className="hidden sm:inline">Delete Store</span>
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-zinc-950 border-white/10 text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-black uppercase tracking-tight">
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-zinc-500">
                    This action cannot be undone. This will permanently delete
                    your store
                    <span className="text-white font-bold ml-1">
                      "{shop.name}"
                    </span>{" "}
                    and all its associated products.
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
                    Delete Permanently
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
