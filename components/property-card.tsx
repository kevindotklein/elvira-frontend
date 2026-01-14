"use client";

import { Bed, Bath, Maximize, MapPin, Car } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Property } from "../app/schemas/property-schema";
import Image from "next/image";

type PropertyCardProps = {
  property: Property;
  onClick: () => void;
};

export function PropertyCard({ property, onClick }: PropertyCardProps) {
  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group"
      onClick={onClick}
    >
      <div className="flex flex-col md:flex-row">
        <div className="relative w-full md:w-2/5 h-64 md:h-auto overflow-hidden">
          <Image
            src={
              property.property_images[0]
                ? property.property_images[0].public_url
                : "/placeholder.svg"
            }
            alt={property.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="flex-1 p-6 md:p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {property.name}
              </h2>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{property.location}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-orange-700">
                R$ {property.price}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 mb-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Bed className="h-5 w-5" />
              <span className="text-sm font-medium">
                {property.bedrooms} quartos
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Bath className="h-5 w-5" />
              <span className="text-sm font-medium">
                {property.bathrooms} banheiros
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Maximize className="h-5 w-5" />
              <span className="text-sm font-medium">{property.size} m²</span>
            </div>
            {property.garage !== 0 && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Car className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {property.garage} vagas
                </span>
              </div>
            )}
          </div>

          <p className="text-muted-foreground line-clamp-2 leading-relaxed">
            {property.description}
          </p>
        </div>
      </div>
    </Card>
  );
}
