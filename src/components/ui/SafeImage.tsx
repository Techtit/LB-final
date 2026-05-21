import React, { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { logger } from "@/lib/logger";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackClassName?: string;
}

export const SafeImage = ({ src, alt, className, fallbackClassName, ...props }: SafeImageProps) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      logger.warn(`Failed to load image: ${src}`);
    }
  };

  if (hasError || !src) {
    return (
      <div 
        className={cn(
          "flex flex-col items-center justify-center bg-muted/30 border border-border/30 rounded text-muted-foreground w-full h-full min-h-[100px]",
          className,
          fallbackClassName
        )}
      >
        <ImageOff className="w-6 h-6 opacity-30 mb-2" />
        <span className="text-[10px] uppercase tracking-wider font-bold opacity-40">Image Unavailable</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || "Lalisa Belle Product"}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};
