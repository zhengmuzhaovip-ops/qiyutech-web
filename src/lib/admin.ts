import { API_BASE_URL } from '../config';

type ApiFailure = {
  success: false;
  message?: string;
};

type AdminDashboardResponse = {
  success: true;
  stats: {
    totalUsers: number;
    totalOrders: number;
    totalProducts: number;
    totalRevenue: string;
    monthRevenue: string;
    pendingOrders: number;
    processingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    lowStockProducts: number;
  };
  dailyOrders: Array<{
    _id: string;
    count: number;
    revenue: number;
  }>;
  recentOrders: unknown[];
  recentUsers: unknown[];
};

type RawAdminOrder = {
  _id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  pricing: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
  note?: string;
  createdAt: string;
  updatedAt: string;
  paymentInfo?: {
    method?: string;
  };
  shippingInfo?: {
    contactName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    company?: string;
    businessType?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  user?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  items?: Array<{
    _id?: string;
    product?: string | { _id?: string };
    slug?: string;
    name: string;
    selectedFlavor?: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
};

type AdminOrdersResponse = {
  success: true;
  total: number;
  page: number;
  pages: number;
  orders: RawAdminOrder[];
};

type RawAdminUser = {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  businessType?: string;
  role?: string;
  isActive?: boolean;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  createdAt?: string;
  updatedAt?: string;
};

type AdminUsersResponse = {
  success: true;
  total: number;
  page: number;
  pages: number;
  users: RawAdminUser[];
};

type RawAdminSpec = {
  label?: string;
  value?: string;
};

type RawAdminProductSeries = {
  _id: string;
  eyebrow?: string;
  title?: string;
  slug?: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

type RawAdminProduct = {
  _id: string;
  name: string;
  shortName?: string;
  flavor?: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  badge?: string;
  price: number;
  comparePrice?: number;
  category?: string;
  brand?: string;
  series?: string | RawAdminProductSeries;
  image?: string;
  gallery?: string[];
  images?: string[];
  highlights?: string[];
  specs?: RawAdminSpec[];
  stock?: number;
  sku?: string;
  weight?: number;
  sortOrder?: number;
  tags?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type AdminProductSeriesResponse = {
  success: true;
  series: RawAdminProductSeries[];
};

type AdminProductsResponse = {
  success: true;
  total: number;
  page: number;
  pages: number;
  products: RawAdminProduct[];
};

type AdminCatalogBootstrapResponse = {
  success: true;
  importedSeriesCount: number;
  importedProductCount: number;
  message: string;
};

export type AdminDashboard = AdminDashboardResponse['stats'];

export type AdminOrder = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  customer: string;
  email: string;
  phone: string;
  company: string;
  businessType: string;
  addressLine: string;
  note: string;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  items: Array<{
    id: string;
    name: string;
    selectedFlavor: string;
    quantity: number;
    price: number;
    image: string;
    lineTotal: number;
  }>;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  businessType: string;
  role: string;
  isActive: boolean;
  addressLine: string;
  createdAt: string;
};

export type AdminProductSpec = {
  label: string;
  value: string;
};

export type AdminProductSeries = {
  id: string;
  eyebrow: string;
  title: string;
  slug: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminProductSeriesPayload = {
  eyebrow: string;
  title: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
};

export type AdminProduct = {
  id: string;
  name: string;
  shortName: string;
  flavor: string;
  slug: string;
  description: string;
  shortDescription: string;
  badge: string;
  price: number;
  comparePrice: number;
  category: string;
  brand: string;
  seriesId: string;
  seriesTitle: string;
  image: string;
  gallery: string[];
  images: string[];
  highlights: string[];
  specs: AdminProductSpec[];
  stock: number;
  sku: string;
  weight: number;
  sortOrder: number;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminProductPayload = {
  name: string;
  shortName: string;
  flavor: string;
  description: string;
  shortDescription: string;
  badge: string;
  price: number;
  comparePrice: number;
  category: string;
  brand: string;
  seriesId: string;
  image: string;
  gallery: string[];
  highlights: string[];
  specs: AdminProductSpec[];
  stock: number;
  sku: string;
  weight: number;
  sortOrder: number;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
};

function getFailureMessage(result: { message?: string }, fallback: string) {
  return result.message || fallback;
}

async function authorizedRequest<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(init?.headers || {}),
      },
    });
  } catch {
    throw new Error('Unable to reach the server. Please make sure the local API is running.');
  }

  const result = (await response.json()) as T | ApiFailure;

  if (!response.ok || !(result as { success?: boolean }).success) {
    throw new Error(getFailureMessage(result as { message?: string }, 'Request failed.'));
  }

  return result as T;
}

function mapAdminOrder(order: RawAdminOrder): AdminOrder {
  const customer =
    order.shippingInfo?.contactName ||
    [order.shippingInfo?.firstName, order.shippingInfo?.lastName].filter(Boolean).join(' ').trim() ||
    [order.user?.firstName, order.user?.lastName].filter(Boolean).join(' ').trim() ||
    'Trade contact';

  const addressLine =
    [
      order.shippingInfo?.address,
      [order.shippingInfo?.city, order.shippingInfo?.state].filter(Boolean).join(', '),
      order.shippingInfo?.zipCode,
      order.shippingInfo?.country,
    ]
      .filter(Boolean)
      .join(', ') || 'No shipping address';

  return {
    id: order._id,
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentInfo?.method || 'bank_transfer',
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    customer,
    email: order.shippingInfo?.email || order.user?.email || '',
    phone: order.shippingInfo?.phone || '',
    company: order.shippingInfo?.company || '',
    businessType: order.shippingInfo?.businessType || '',
    addressLine,
    note: order.note || '',
    total: order.pricing?.total || 0,
    subtotal: order.pricing?.subtotal || 0,
    shipping: order.pricing?.shipping || 0,
    tax: order.pricing?.tax || 0,
    items: (order.items || []).map((item) => ({
      id: item._id || String(item.product || item.slug || item.name),
      name: item.name,
      selectedFlavor: item.selectedFlavor || '',
      quantity: item.quantity,
      price: item.price,
      image: item.image || '/images/catalog-geek-bar-pulse-x-pear-of-thieves.png',
      lineTotal: item.price * item.quantity,
    })),
  };
}

function mapAdminUser(user: RawAdminUser): AdminUser {
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || 'Trade user';
  const addressLine =
    [
      user.address?.street,
      [user.address?.city, user.address?.state].filter(Boolean).join(', '),
      user.address?.zipCode,
      user.address?.country,
    ]
      .filter(Boolean)
      .join(', ') || 'No saved address';

  return {
    id: user._id,
    name,
    email: user.email || '',
    phone: user.phone || '',
    company: user.company || '',
    businessType: user.businessType || '',
    role: user.role || 'user',
    isActive: Boolean(user.isActive),
    addressLine,
    createdAt: user.createdAt || '',
  };
}

function mapAdminProductSeries(series: RawAdminProductSeries): AdminProductSeries {
  return {
    id: series._id,
    eyebrow: series.eyebrow || 'Wholesale Series',
    title: series.title || 'Untitled Series',
    slug: series.slug || '',
    description: series.description || '',
    sortOrder: series.sortOrder || 0,
    isActive: Boolean(series.isActive),
    productCount: series.productCount || 0,
    createdAt: series.createdAt || '',
    updatedAt: series.updatedAt || '',
  };
}

function mapAdminProduct(product: RawAdminProduct): AdminProduct {
  const image = product.image || product.images?.[0] || '/images/catalog-geek-bar-pulse-x-pear-of-thieves.png';
  const gallery = product.gallery?.length
    ? product.gallery
    : (product.images || []).filter((item) => item && item !== image);
  const rawSeries =
    product.series && typeof product.series === 'object'
      ? product.series
      : undefined;
  const seriesId =
    typeof product.series === 'string'
      ? product.series
      : rawSeries?._id || '';

  return {
    id: product._id,
    name: product.name,
    shortName: product.shortName || product.name,
    flavor: product.flavor || '',
    slug: product.slug,
    description: product.description || '',
    shortDescription: product.shortDescription || '',
    badge: product.badge || '',
    price: product.price || 0,
    comparePrice: product.comparePrice || 0,
    category: product.category || 'other',
    brand: product.brand || '',
    seriesId,
    seriesTitle: rawSeries?.title || '',
    image,
    gallery,
    images: [image, ...gallery].filter(Boolean),
    highlights: (product.highlights || []).filter(Boolean),
    specs: (product.specs || [])
      .map((item) => ({
        label: String(item?.label || '').trim(),
        value: String(item?.value || '').trim(),
      }))
      .filter((item) => item.label && item.value),
    stock: product.stock || 0,
    sku: product.sku || '',
    weight: product.weight || 0,
    sortOrder: product.sortOrder || 0,
    tags: (product.tags || []).filter(Boolean),
    isActive: Boolean(product.isActive),
    isFeatured: Boolean(product.isFeatured),
    createdAt: product.createdAt || '',
    updatedAt: product.updatedAt || '',
  };
}

export async function fetchAdminDashboard(token: string): Promise<AdminDashboard> {
  const result = await authorizedRequest<AdminDashboardResponse>('/admin/dashboard', token, {
    method: 'GET',
  });

  return result.stats;
}

export async function fetchAdminOrders(
  token: string,
  filters?: { status?: string; paymentStatus?: string; search?: string },
): Promise<AdminOrder[]> {
  const params = new URLSearchParams();

  if (filters?.status) params.set('status', filters.status);
  if (filters?.paymentStatus) params.set('paymentStatus', filters.paymentStatus);
  if (filters?.search) params.set('search', filters.search);

  const queryString = params.toString();
  const result = await authorizedRequest<AdminOrdersResponse>(
    `/admin/orders${queryString ? `?${queryString}` : ''}`,
    token,
    {
      method: 'GET',
    },
  );

  return result.orders.map(mapAdminOrder);
}

export async function fetchAdminUsers(
  token: string,
  filters?: { search?: string; role?: string },
): Promise<AdminUser[]> {
  const params = new URLSearchParams();

  if (filters?.search) params.set('search', filters.search);
  if (filters?.role) params.set('role', filters.role);

  const queryString = params.toString();
  const result = await authorizedRequest<AdminUsersResponse>(
    `/admin/users${queryString ? `?${queryString}` : ''}`,
    token,
    {
      method: 'GET',
    },
  );

  return result.users.map(mapAdminUser);
}

export async function updateAdminOrderStatus(
  token: string,
  orderId: string,
  payload: { status?: string; paymentStatus?: string },
): Promise<void> {
  await authorizedRequest<{ success: true; order: RawAdminOrder }>(
    `/admin/orders/${orderId}/status`,
    token,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
  );
}

export async function fetchAdminProductSeries(token: string): Promise<AdminProductSeries[]> {
  const result = await authorizedRequest<AdminProductSeriesResponse>('/admin/product-series', token, {
    method: 'GET',
  });

  return result.series.map(mapAdminProductSeries);
}

export async function createAdminProductSeries(
  token: string,
  payload: AdminProductSeriesPayload,
): Promise<AdminProductSeries> {
  const result = await authorizedRequest<{ success: true; series: RawAdminProductSeries }>(
    '/admin/product-series',
    token,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );

  return mapAdminProductSeries(result.series);
}

export async function updateAdminProductSeries(
  token: string,
  seriesId: string,
  payload: AdminProductSeriesPayload,
): Promise<AdminProductSeries> {
  const result = await authorizedRequest<{ success: true; series: RawAdminProductSeries }>(
    `/admin/product-series/${seriesId}`,
    token,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
  );

  return mapAdminProductSeries(result.series);
}

export async function deleteAdminProductSeries(token: string, seriesId: string): Promise<void> {
  await authorizedRequest<{ success: true; message: string }>(`/admin/product-series/${seriesId}`, token, {
    method: 'DELETE',
  });
}

export async function fetchAdminProducts(
  token: string,
  filters?: { search?: string; category?: string; isActive?: string; seriesId?: string },
): Promise<AdminProduct[]> {
  const params = new URLSearchParams();

  if (filters?.search) params.set('search', filters.search);
  if (filters?.category) params.set('category', filters.category);
  if (filters?.isActive) params.set('isActive', filters.isActive);
  if (filters?.seriesId) params.set('seriesId', filters.seriesId);

  const queryString = params.toString();
  const result = await authorizedRequest<AdminProductsResponse>(
    `/admin/products${queryString ? `?${queryString}` : ''}`,
    token,
    {
      method: 'GET',
    },
  );

  return result.products.map(mapAdminProduct);
}

export async function createAdminProduct(
  token: string,
  payload: AdminProductPayload,
): Promise<AdminProduct> {
  const result = await authorizedRequest<{ success: true; product: RawAdminProduct }>(
    '/admin/products',
    token,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );

  return mapAdminProduct(result.product);
}

export async function updateAdminProduct(
  token: string,
  productId: string,
  payload: AdminProductPayload,
): Promise<AdminProduct> {
  const result = await authorizedRequest<{ success: true; product: RawAdminProduct }>(
    `/admin/products/${productId}`,
    token,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
  );

  return mapAdminProduct(result.product);
}

export async function deleteAdminProduct(token: string, productId: string): Promise<void> {
  await authorizedRequest<{ success: true; message: string }>(`/admin/products/${productId}`, token, {
    method: 'DELETE',
  });
}

export async function bootstrapAdminCatalog(token: string): Promise<AdminCatalogBootstrapResponse> {
  return authorizedRequest<AdminCatalogBootstrapResponse>('/admin/catalog/bootstrap', token, {
    method: 'POST',
  });
}
