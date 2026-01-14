"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Bed,
  Bath,
  Home,
  MessageCircle,
  Maximize,
  Car,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Property } from "../app/schemas/property-schema";
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";

type PropertyModalProps = {
  property: Property;
  onClose: () => void;
};

export function PropertyModal({ property, onClose }: PropertyModalProps) {
  const isMobile = useIsMobile();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  const nextImage = () => {
    setCurrentImageIndex(
      (prev) => (prev + 1) % property.property_images.length
    );
  };

  const previousImage = () => {
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + property.property_images.length) %
        property.property_images.length
    );
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 bg-background/80 backdrop-blur-sm hover:bg-background rounded-full p-2 transition-colors"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative h-96 bg-muted">
          <Image
            src={
              property.property_images[currentImageIndex]
                ? property.property_images[currentImageIndex].public_url
                : "/placeholder.svg"
            }
            alt={`${property.name} - Imagem ${currentImageIndex + 1}`}
            fill
            className="object-cover"
          />

          {property.property_images.length > 1 && (
            <>
              <button
                onClick={previousImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background rounded-full p-2 transition-colors"
                aria-label="Imagem anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background rounded-full p-2 transition-colors"
                aria-label="Próxima imagem"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {property.property_images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? "bg-background w-8"
                        : "bg-background/50 hover:bg-background/80"
                    }`}
                    aria-label={`Ir para imagem ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-8">
          <div
            className={`flex ${
              isMobile && "flex-col gap-4"
            } items-start justify-between mb-6`}
          >
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {property.name}
              </h2>
              <p className="text-muted-foreground">{property.location}</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-orange-700">
                R$ {property.price}
              </p>
            </div>
          </div>

          <div
            className={`${
              isMobile ? "flex flex-wrap" : "flex"
            } items-center gap-8 mb-6 pb-6 border-b border-border`}
          >
            {property.bedrooms ? (
              <div className="flex items-center gap-3 w-32">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Bed className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quartos</p>
                  <p className="text-xl font-bold text-foreground">
                    {property.bedrooms}
                  </p>
                </div>
              </div>
            ) : null}

            {property.bathrooms ? (
              <div className="flex items-center gap-3 w-32">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Bath className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Banheiros</p>
                  <p className="text-xl font-bold text-foreground">
                    {property.bathrooms}
                  </p>
                </div>
              </div>
            ) : null}

            {property.suites ? (
              <div className="flex items-center gap-3 w-32">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Suítes</p>
                  <p className="text-xl font-bold text-foreground">
                    {property.suites}
                  </p>
                </div>
              </div>
            ) : null}

            <div className="flex items-center gap-3 w-32">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Car className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">vagas</p>
                <p className="text-xl font-bold text-foreground">
                  {property.garage}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-32">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Maximize className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Área</p>
                <p className="text-xl font-bold text-foreground">
                  {property.size} m²
                </p>
              </div>
            </div>


          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-foreground mb-3">
              Descrição
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {property.description}
            </p>
          </div>

          <Button
            asChild
            size="lg"
            className="w-full bg-orange-700 hover:bg-orange-700/90 text-white font-semibold"
          >
            <a
              target="_blank"
              href={`https://wa.me/5511998091991?text=Olá%2C%20vim%20pelo%20site%21%0A%0AGostaria%20de%20informações%20sobre%20o%20imóvel:%20${property.name}%20%28${property.size}m²%29`}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Entrar em Contato via WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
