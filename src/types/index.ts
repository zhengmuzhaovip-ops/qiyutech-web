export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  price: number;
  compareAtPrice?: number;
  shortDescription: string;
  description: string;
  image: string;
  gallery: string[];
  flavors: string[];
  features: string[];
  specs: ProductSpec[];
  isFeatured?: boolean;
}

export interface SiteSettings {
  brandName: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryCtaLabel: string;
  heroPrimaryCtaHref: string;
  heroSecondaryCtaLabel: string;
  heroSecondaryCtaHref: string;
  phone: string;
  whatsapp: string;
  whatsappUrl: string;
  email: string;
  address: string;
  footerCopyright: string;
  featureBullets: string[];
}

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  selectedFlavor?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
}
