"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PremiumImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  fill?: boolean;
  width?: number;
  height?: number;
}

export function PremiumImage({
  src,
  alt,
  className,
  containerClassName,
  fill = true,
  width,
  height,
}: PremiumImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-zinc-800/50",
        containerClassName,
        fill ? "h-full w-full" : "",
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={width}
        height={height}
        priority={true}
        className={cn(
          "duration-500 ease-in-out object-cover",
          className,
          isLoading
            ? "scale-105 blur-xl grayscale"
            : "scale-100 blur-0 grayscale-0",
        )}
        onLoad={(img) => {
          if (img.currentTarget.complete) {
            setIsLoading(false);
          }
        }}
      />
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/5 to-transparent" />
      )}
    </div>
  );
}
