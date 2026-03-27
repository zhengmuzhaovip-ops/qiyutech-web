import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export interface ApiProduct {
  _id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  comparePrice: number;
  category: string;
  brand: string;
  images: string[];
  stock: number;
  sku: string;
  isActive: boolean;
  isFeatured: boolean;
  rating: { average: number; count: number };
  createdAt: string;
}

interface UseProductsOptions {
  limit?: number;
  featured?: boolean;
  category?: string;
  search?: string;
  page?: number;
  sort?: string;
}

interface UseProductsResult {
  products: ApiProduct[];
  total: number;
  pages: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProducts(options: UseProductsOptions = {}): UseProductsResult {
  const { limit = 12, featured, category, search, page = 1, sort } = options;
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          ...(featured !== undefined && { featured: String(featured) }),
          ...(category && { category }),
          ...(search && { search }),
          ...(sort && { sort }),
        });
        const res = await fetch(`${API_BASE_URL}/products?${params}`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
          setTotal(data.total);
          setPages(data.pages);
        } else {
          setError(data.message || 'Failed to fetch products');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [limit, featured, category, search, page, sort, trigger]);

  return { products, total, pages, isLoading, error, refetch: () => setTrigger(t => t + 1) };
}
