"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Point, Area } from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { IconCheck, IconX, IconZoomIn, IconRotate } from "@tabler/icons-react";
import getCroppedImg from "@/lib/utils/cropImage";

interface ImageCropperProps {
  image: string;
  aspect?: number;
  onCropComplete: (croppedImage: Blob) => void;
  onCancel: () => void;
}

export function ImageCropper({
  image,
  aspect = 1,
  onCropComplete,
  onCancel,
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropChange = (crop: Point) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onRotationChange = (rotation: number) => {
    setRotation(rotation);
  };

  const onCropCompleteLocal = useCallback(
    (recalculatedCroppedArea: Area, recalculatedCroppedAreaPixels: Area) => {
      setCroppedAreaPixels(recalculatedCroppedAreaPixels);
    },
    []
  );

  const handleDone = async () => {
    try {
      if (croppedAreaPixels) {
        const croppedImage = await getCroppedImg(
          image,
          croppedAreaPixels,
          rotation
        );
        if (croppedImage) {
          onCropComplete(croppedImage);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl aspect-square overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={aspect}
          onCropChange={onCropChange}
          onCropComplete={onCropCompleteLocal}
          onZoomChange={onZoomChange}
          onRotationChange={onRotationChange}
          classes={{
            containerClassName: "bg-zinc-900",
          }}
        />
      </div>

      <div className="mt-8 w-full max-w-2xl bg-zinc-900/50 backdrop-blur-md border border-white/10 p-6 rounded-3xl flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Zoom Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-medium text-zinc-400 uppercase tracking-wider">
              <span className="flex items-center gap-2">
                <IconZoomIn size={14} className="text-indigo-400" />
                Zoom
              </span>
              <span>{Math.round(zoom * 100)}%</span>
            </div>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Rotation Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-medium text-zinc-400 uppercase tracking-wider">
              <span className="flex items-center gap-2">
                <IconRotate size={14} className="text-indigo-400" />
                Rotación
              </span>
              <span>{rotation}°</span>
            </div>
            <input
              type="range"
              value={rotation}
              min={0}
              max={360}
              step={1}
              aria-labelledby="Rotation"
              onChange={(e) => setRotation(Number(e.target.value))}
              className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 pt-2">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="flex-1 h-12 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all font-medium"
          >
            <IconX size={18} className="mr-2" />
            Cancelar
          </Button>
          <Button
            onClick={handleDone}
            className="flex-[2] h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg shadow-indigo-500/20"
          >
            <IconCheck size={18} className="mr-2" />
            Confirmar Encuadre
          </Button>
        </div>
      </div>
      
      <p className="mt-4 text-xs text-zinc-500 font-medium tracking-wide">
        ARRASTRA PARA ENCUADRAR • PELLIZCA O USA EL SLIDER PARA HACER ZOOM
      </p>
    </div>
  );
}
