"use client";

import { useState, useEffect } from "react";
import { PropertyCard } from "@/components/property-card";
import { PropertyModal } from "@/components/property-modal";
import { AboutSection } from "@/components/about-section";
import { Header } from "@/components/header";
import Link from "next/link";
import type { Property } from "./schemas/property-schema";

export default function Page() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );

  const fetchProperties = async () => {
    try {
      const response = await fetch("http://localhost:8000/properties", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      const sorted: Property[] = data.properties.sort((a: Property, b: Property) => a.position - b.position);
      const sorted2 = sorted.map(p => {return {...p, property_images: p.property_images.sort((a, b) => a.position - b.position)}});
      setProperties(sorted2);
    } catch (error) {
      console.error("Erro ao carregar:", error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <section className="mb-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Encontre o Imóvel dos Seus Sonhos
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Imóveis selecionados com qualidade e excelência para você e sua
              família
            </p>
          </div>

          <div className="space-y-8">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onClick={() => setSelectedProperty(property)}
              />
            ))}
          </div>
        </section>

        <AboutSection />
      </main>

      <footer className="bg-primary text-primary-foreground py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <Link
            href="/login"
            className="text-sm hover:underline cursor-pointer"
          >
            © 2025 Imóveis Premium. Todos os direitos reservados.
          </Link>
        </div>
      </footer>

      {selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
}
