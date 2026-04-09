import { API_BASE_URL } from '../config';

type PublicSpec = {
  label?: string;
  value?: string;
};

type PublicProductResponse = {
  success: true;
  product: PublicProduct;
};

type PublicCatalogResponse = {
  success: true;
  series: PublicSeries[];
};

export type PublicProduct = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  flavor: string;
  price: number;
  basePrice: number;
  hasCustomPrice: boolean;
  stock: number;
  image: string;
  gallery: string[];
  shortDescription: string;
  description: string;
  badge: string;
  highlights: string[];
  specs: PublicSpec[];
  seriesId?: string;
  seriesTitle?: string;
  seriesEyebrow?: string;
  sortOrder?: number;
};

export type PublicSeries = {
  id: string;
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  sortOrder: number;
  productCount: number;
  products: PublicProduct[];
};

async function request<T>(path: string, token?: string | null): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  });
  const result = await response.json();

  if (!response.ok || result?.success === false) {
    throw new Error(result?.message || 'Request failed');
  }

  return result as T;
}

export async function fetchPublicCatalog(token?: string | null): Promise<PublicSeries[]> {
  const result = await request<PublicCatalogResponse>('/products/catalog', token);
  return result.series || [];
}

export async function fetchPublicProductBySlug(slug: string, token?: string | null): Promise<PublicProduct> {
  const result = await request<PublicProductResponse>(`/products/slug/${slug}`, token);
  return result.product;
}
