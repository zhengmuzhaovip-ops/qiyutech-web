import { API_BASE_URL, config } from '../config';

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
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), config.api.timeout);

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('The catalog request timed out. Please make sure the backend is running.');
    }

    throw new Error('Unable to reach the catalog service. Please check the backend connection.');
  } finally {
    window.clearTimeout(timeoutId);
  }

  const contentType = response.headers.get('content-type') || '';
  const result = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok || result?.success === false) {
    throw new Error(result?.message || 'Request failed');
  }

  if (!result) {
    throw new Error('Catalog response was not valid JSON.');
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
