import React, { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface ProductGalleryProps {
  images: { url: string; altText: string | null }[];
  title: string;
  discount: number | null;
}

const ZoomableImage = ({ src, alt, isActive, onClick }: { src: string; alt: string; isActive: boolean; onClick: () => void }) => {
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', transformOrigin: '0% 0%' });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only apply zoom on desktop (ignore on touch devices)
    if (window.matchMedia("(hover: none)").matches) return;
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: 'block',
      transformOrigin: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none', transformOrigin: '0% 0%' });
  };

  return (
    <div 
      className="relative w-full cursor-zoom-in group overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <SafeImage 
        src={src} 
        alt={alt} 
        className={cn(
          "w-full h-auto max-h-[80vh] object-contain transition-opacity duration-300",
          zoomStyle.display === 'block' && "opacity-0"
        )} 
        loading={isActive ? "eager" : "lazy"}
      />
      <div 
        className="absolute inset-0 w-full h-full bg-no-repeat pointer-events-none transition-transform duration-200"
        style={{
          backgroundImage: `url(${src})`,
          backgroundSize: 'contain',
          transform: 'scale(2.5)',
          backgroundPosition: zoomStyle.transformOrigin,
          display: zoomStyle.display,
        }}
      />
    </div>
  );
};

export const ProductGallery = ({ images, title, discount }: ProductGalleryProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollTo = useCallback((index: number) => {
    api?.scrollTo(index);
  }, [api]);

  const hasMultipleImages = images.length > 1;

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Carousel */}
      <div className="relative rounded-xl overflow-hidden">
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent className="w-full ml-0 items-center">
            {images.map((img, idx) => (
              <CarouselItem key={`${img.url}-${idx}`} className="w-full pl-0 relative flex justify-center">
                <ZoomableImage src={img.url} alt={img.altText || `${title} ${idx + 1}`} isActive={idx === current} onClick={() => setLightboxImage(img.url)} />
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {hasMultipleImages && (
            <div className="hidden md:block">
              <CarouselPrevious className="left-4 bg-background/80 hover:bg-background border-transparent" />
              <CarouselNext className="right-4 bg-background/80 hover:bg-background border-transparent" />
            </div>
          )}
        </Carousel>

        {discount && (
          <span className="absolute top-4 left-4 px-3 py-1 bg-destructive text-destructive-foreground text-[10px] font-bold tracking-widest uppercase rounded shadow-lg z-10 backdrop-blur-sm pointer-events-none">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Thumbnails */}
      {hasMultipleImages && (
        <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-hide snap-x">
          {images.map((img, idx) => (
            <button
              key={`thumb-${img.url}-${idx}`}
              onClick={() => scrollTo(idx)}
              className={cn(
                "relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 snap-center",
                current === idx 
                  ? "border-primary shadow-md opacity-100" 
                  : "border-transparent opacity-60 hover:opacity-100 hover:border-border"
              )}
            >
              <SafeImage 
                src={img.url} 
                alt={`Thumbnail ${idx + 1}`} 
                className="w-full h-full object-cover" 
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
      {/* Lightbox */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-12 cursor-zoom-out"
          onClick={() => setLightboxImage(null)}
        >
          <button 
            className="absolute top-4 right-4 md:top-8 md:right-8 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); setLightboxImage(null); }}
          >
            <X size={24} />
          </button>
          <img 
            src={lightboxImage} 
            alt="Expanded view" 
            className="w-full h-full object-contain"
          />
        </div>
      )}
    </div>
  );
};
