export type PropertyImages = {
  id: number,
  public_url: string,
  position: number
}

export type Property = {
  id: number
  name: string
  location: string
  price: string
  bedrooms: number
  bathrooms: number
  suites: number
  size: number
  description: string
  balconies: number
  property_images: PropertyImages[]
  position: number
  garage: number
}

export type PropertySchema = {
  name: string
  location: string
  price: string
  bedrooms: number
  bathrooms: number
  suites: number
  size: number
  description: string
  balconies: number
  position: number
  garage: number
}