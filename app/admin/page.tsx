"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Plus,
  Bed,
  Bath,
  Home,
  MapPin,
  DollarSign,
  Maximize,
  FileText,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContexts";
import { useRouter } from "next/navigation";
import type {
  Property,
  PropertyImages,
  PropertySchema,
} from "../schemas/property-schema";

export default function AdminDashboard() {
  const { token, loading, authFetch } = useAuth();
  const router = useRouter();

  if (loading) return <div>Carregando...</div>;

  if (!token) {
    router.push("/");
  }

  const [properties, setProperties] = useState<Property[]>([]);

  const fetchProperties = async () => {
    try {
      const response = await fetch("http://localhost:8000/properties", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setProperties(data.properties);

      if (!selectedProperty && data.properties.length > 0) {
        setSelectedProperty(data.properties[0]);
      }
    } catch (error) {
      console.error("Erro ao carregar:", error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProperty, setNewProperty] = useState({
    name: "",
    location: "",
    price: "",
    bedrooms: 0,
    bathrooms: 0,
    suites: 0,
    size: 0,
    description: "",
    position: 0,
    balconies: 0,
    garage: 0,
  });
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  const handleAddProperty = async (propertySchema: PropertySchema) => {
    try {
      const res = await authFetch(`http://localhost:8000/properties/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(propertySchema),
      });

      fetchProperties();
    } catch (error) {
      console.error("erro no upload: ", error);
    }

    setIsAddDialogOpen(false);
  };

  const handleImageUpload = (propertyId: number, index: number) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await authFetch(
          `http://localhost:8000/properties/${propertyId}/upload?position=${index}`,
          {
            method: "POST",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        const newPropertyImage: PropertyImages = await res.json();
        setProperties((prev) => {
          return prev.map((p) => {
            if (p.id === propertyId) {
              return {
                ...p,
                property_images: [...p.property_images, newPropertyImage],
              };
            }
            return p;
          });
        });
      } catch (error) {
        console.error("erro no upload: ", error);
      }
    };

    input.click();
  };

  const handleRemoveImage = async (propertyId: number, imageId: number) => {
    try {
      const res = await authFetch(
        `http://localhost:8000/properties/${propertyId}/upload/${imageId}`,
        {
          method: "DELETE",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchProperties();
    } catch (error) {
      console.error("erro ao remover imagem: ", error);
    }
  };

  const handleUpdateProperty = async (property: Property) => {
    const propertySchema: PropertySchema = property as PropertySchema;
    try {
      const res = await authFetch(
        `http://localhost:8000/properties/${property.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(propertySchema),
        }
      );

      fetchProperties();
    } catch (error) {
      console.error("erro no upload: ", error);
    }
  };

  const handleDeleteProperty = async (propertyId: number) => {
    try {
      const res = await authFetch(
        `http://localhost:8000/properties/${propertyId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchProperties();
    } catch (error) {
      console.error("erro ao deletar imovel: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border sticky top-0 z-40 backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">
                Painel Administrativo
              </span>
            </div>
            <Button onClick={() => router.replace("/")} variant="outline">
              Voltar ao Site
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Gerenciar Imóveis
            </h1>
            <p className="text-muted-foreground">
              Edite as informações e fotos dos seus imóveis
            </p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Adicionar Imóvel
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Imóvel</DialogTitle>
                <DialogDescription>
                  Preencha as informações do novo imóvel. As fotos podem ser
                  adicionadas depois.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="new-title">Título</Label>
                  <Input
                    id="new-title"
                    value={newProperty.name}
                    onChange={(e) =>
                      setNewProperty({ ...newProperty, name: e.target.value })
                    }
                    placeholder="Ex: Apartamento Moderno no Centro"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-location">Localização</Label>
                  <Input
                    id="new-location"
                    value={newProperty.location}
                    onChange={(e) =>
                      setNewProperty({
                        ...newProperty,
                        location: e.target.value,
                      })
                    }
                    placeholder="Ex: Centro, São Paulo - SP"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-price">Preço (R$)</Label>
                    <Input
                      id="new-price"
                      value={newProperty.price}
                      onChange={(e) =>
                        setNewProperty({
                          ...newProperty,
                          price: e.target.value,
                        })
                      }
                      placeholder="850.000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-area">Área (m²)</Label>
                    <Input
                      id="new-area"
                      value={newProperty.size}
                      onChange={(e) => {
                        const val = e.target.value;
                        const numericVal =
                          val === "" ? 0 : Number.parseInt(val);
                        setNewProperty({
                          ...newProperty,
                          size: numericVal,
                        });
                      }}
                      placeholder="120"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-bedrooms">Quartos</Label>
                    <Input
                      id="new-bedrooms"
                      type="number"
                      value={newProperty.bedrooms}
                      onChange={(e) =>
                        setNewProperty({
                          ...newProperty,
                          bedrooms: Number.parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-bathrooms">Banheiros</Label>
                    <Input
                      id="new-bathrooms"
                      type="number"
                      value={newProperty.bathrooms}
                      onChange={(e) =>
                        setNewProperty({
                          ...newProperty,
                          bathrooms: Number.parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-suites">Suítes</Label>
                    <Input
                      id="new-suites"
                      type="number"
                      value={newProperty.suites}
                      onChange={(e) =>
                        setNewProperty({
                          ...newProperty,
                          suites: Number.parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-garage">Vagas</Label>
                    <Input
                      id="new-garage"
                      type="number"
                      value={newProperty.garage}
                      onChange={(e) =>
                        setNewProperty({
                          ...newProperty,
                          garage: Number.parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-description">Descrição</Label>
                  <Textarea
                    id="new-description"
                    value={newProperty.description}
                    onChange={(e) =>
                      setNewProperty({
                        ...newProperty,
                        description: e.target.value,
                      })
                    }
                    placeholder="Descreva as características do imóvel..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-position">Posição</Label>
                  <Input
                    id="new-position"
                    type="number"
                    value={newProperty.position}
                    onChange={(e) =>
                      setNewProperty({
                        ...newProperty,
                        position: Number.parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() =>
                    handleAddProperty(newProperty as PropertySchema)
                  }
                >
                  Adicionar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {properties.length > 0 && (
          <Tabs
            value={
              selectedProperty?.id.toString() || properties[0]?.id.toString()
            }
            onValueChange={(value) => {
              const property = properties.find(
                (p) => p.id.toString() === value
              );
              if (property) {
                setSelectedProperty(property);
              }
            }}
          >
            <TabsList className="mb-6 flex-wrap h-auto">
              {properties.map((property) => (
                <TabsTrigger
                  key={property.id}
                  value={property.id.toString()}
                  className="shrink-0"
                >
                  {property.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {properties.map((property) => (
              <TabsContent key={property.id} value={property.id.toString()}>
                <Card>
                  <CardHeader>
                    <CardTitle>Editar Imóvel</CardTitle>
                    <CardDescription>
                      Atualize as informações e fotos do imóvel
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">
                        Fotos do Imóvel (até 20)
                      </Label>
                      <div className="grid grid-cols-4 gap-4">
                        {Array.from({ length: 20 }).map((_, index) => {
                          const imageByIndex: PropertyImages | undefined =
                            property.property_images.find(
                              (i) => i.position === index
                            );
                          return (
                            <div
                              key={index}
                              className="aspect-square border-2 border-dashed border-muted-foreground/30 rounded-lg overflow-hidden relative group"
                            >
                              {imageByIndex ? (
                                <>
                                  <img
                                    src={
                                      imageByIndex.public_url ||
                                      "/placeholder.svg"
                                    }
                                    alt={`Foto ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveImage(
                                        property.id,
                                        imageByIndex.id
                                      )
                                    }
                                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="h-8 w-8 text-white" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleImageUpload(property.id, index)
                                  }
                                  className="w-full h-full hover:border-primary hover:bg-muted/50 transition-colors flex items-center justify-center"
                                >
                                  <Plus className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Clique em qualquer espaço para adicionar uma foto (JPG,
                        PNG, WEBP, etc.)
                      </p>
                    </div>
                    <div className="space-y-4 pt-6 border-t">
                      <div className="space-y-2">
                        <Label htmlFor={`title-${property.id}`}>
                          <FileText className="h-4 w-4 inline mr-2" />
                          Título
                        </Label>
                        <Input
                          id={`title-${property.id}`}
                          value={selectedProperty?.name || property.name}
                          onChange={(e) =>
                            setSelectedProperty((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    name: e.target.value,
                                  }
                                : prev
                            )
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`location-${property.id}`}>
                          <MapPin className="h-4 w-4 inline mr-2" />
                          Localização
                        </Label>
                        <Input
                          id={`location-${property.id}`}
                          value={
                            selectedProperty?.location || property.location
                          }
                          onChange={(e) =>
                            setSelectedProperty((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    location: e.target.value,
                                  }
                                : prev
                            )
                          }
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`price-${property.id}`}>
                            <DollarSign className="h-4 w-4 inline mr-2" />
                            Preço (R$)
                          </Label>
                          <Input
                            id={`price-${property.id}`}
                            type="number"
                            value={selectedProperty?.price ?? ""}
                            onChange={(e) =>
                              setSelectedProperty((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      price: e.target.value,
                                    }
                                  : prev
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`area-${property.id}`}>
                            <Maximize className="h-4 w-4 inline mr-2" />
                            Área (m²)
                          </Label>
                          <Input
                            id={`area-${property.id}`}
                            value={
                              selectedProperty?.size === 0
                                ? ""
                                : selectedProperty?.size
                            }
                            onChange={(e) => {
                              const val = e.target.value;
                              const numericVal =
                                val === "" ? 0 : Number.parseInt(val);

                              setSelectedProperty((prev) =>
                                prev ? { ...prev, size: numericVal } : prev
                              );
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`bedrooms-${property.id}`}>
                            <Bed className="h-4 w-4 inline mr-2" />
                            Quartos
                          </Label>
                          <Input
                            id={`bedrooms-${property.id}`}
                            type="number"
                            value={
                              selectedProperty?.bedrooms || property.bedrooms
                            }
                            onChange={(e) =>
                              setSelectedProperty((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      bedrooms:
                                        Number.parseInt(e.target.value) || 0,
                                    }
                                  : prev
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`bathrooms-${property.id}`}>
                            <Bath className="h-4 w-4 inline mr-2" />
                            Banheiros
                          </Label>
                          <Input
                            id={`bathrooms-${property.id}`}
                            type="number"
                            value={
                              selectedProperty?.bathrooms || property.bathrooms
                            }
                            onChange={(e) =>
                              setSelectedProperty((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      bathrooms: Number.parseInt(
                                        e.target.value
                                      ),
                                    }
                                  : prev
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`suites-${property.id}`}>
                            <Home className="h-4 w-4 inline mr-2" />
                            Suítes
                          </Label>
                          <Input
                            id={`suites-${property.id}`}
                            type="number"
                            value={selectedProperty?.suites || property.suites}
                            onChange={(e) =>
                              setSelectedProperty((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      suites:
                                        Number.parseInt(e.target.value) || 0,
                                    }
                                  : prev
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`garage-${property.id}`}>
                            <Home className="h-4 w-4 inline mr-2" />
                            Vagas
                          </Label>
                          <Input
                            id={`garage-${property.id}`}
                            type="number"
                            value={selectedProperty?.garage || property.garage}
                            onChange={(e) =>
                              setSelectedProperty((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      garage:
                                        Number.parseInt(e.target.value) || 0,
                                    }
                                  : prev
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`description-${property.id}`}>
                          Descrição
                        </Label>
                        <Textarea
                          id={`description-${property.id}`}
                          value={
                            selectedProperty?.description ||
                            property.description
                          }
                          onChange={(e) =>
                            setSelectedProperty((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    description: e.target.value,
                                  }
                                : prev
                            )
                          }
                          rows={5}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`position-${property.id}`}>
                          Posição
                        </Label>
                        <Input
                          id={`position-${property.id}`}
                          type="number"
                          value={
                            selectedProperty?.position || property.position
                          }
                          onChange={(e) =>
                            setSelectedProperty((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    position:
                                      Number.parseInt(e.target.value) || 0,
                                  }
                                : prev
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="flex justify-between pt-4 border-t">
                      <Button
                        onClick={() =>
                          selectedProperty && setIsDeleteOpen(true)
                        }
                        size="lg"
                        variant={"destructive"}
                        disabled={!selectedProperty}
                      >
                        Excluir Imóvel
                      </Button>

                      <Button
                        onClick={() =>
                          selectedProperty &&
                          handleUpdateProperty(selectedProperty)
                        }
                        size="lg"
                        disabled={!selectedProperty}
                      >
                        Salvar Alterações
                      </Button>
                    </div>

                    {isDeleteOpen && (
                      <div
                        className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                        onClick={() => setIsDeleteOpen(false)}
                      >
                        <div
                          className="bg-card border border-border p-6 rounded-xl shadow-2xl max-w-sm w-full space-y-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="space-y-2">
                            <h3 className="text-xl font-bold text-foreground">
                              Deletar
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              Deseja deletar o imóvel{" "}
                              <strong>{selectedProperty?.name}</strong>?
                            </p>
                          </div>

                          <div className="flex justify-around gap-3 pt-2">
                            <Button
                              onClick={() => setIsDeleteOpen(false)}
                              className="px-4 py-2 text-sm font-medium rounded-md"
                              variant={"default"}
                            >
                              Cancelar
                            </Button>
                            <Button
                              onClick={() => {
                                selectedProperty &&
                                  handleDeleteProperty(selectedProperty?.id);
                                setIsDeleteOpen(false);
                              }}
                              className="px-4 py-2 text-sm font-medium rounded-md"
                              variant={"destructive"}
                            >
                              Sim, Excluir
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </main>
    </div>
  );
}
