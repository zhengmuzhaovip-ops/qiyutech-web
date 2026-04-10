import { API_BASE_URL } from '../config';

type ApiOrderItem = {
  id?: string;
  product?: string | null;
  slug?: string;
  name: string;
  selectedFlavor?: string;
  price: number;
  quantity: number;
  image?: string;
  lineTotal?: number;
};

type ApiOrder = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
  customer: string;
  email?: string;
  phone?: string;
  company?: string;
  businessType?: string;
  note?: string;
  placedAt: string;
  pricing: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
  shippingAddress: {
    country: string;
    state: string;
    city: string;
    address: string;
    postalCode: string;
  };
  shipment?: {
    provider: string;
    trackingNumber: string;
    carrierCode: string;
    carrierName: string;
    trackingTag?: string;
    trackingUrl?: string;
    registrationStatus: string;
    registeredAt?: string | null;
    lastSyncedAt?: string | null;
    syncError?: string;
    latestStatus?: string;
    latestStatusCode?: string;
    latestSubStatus?: string;
    latestDescription?: string;
    latestLocation?: string;
    latestCheckpointAt?: string | null;
    events?: Array<{
      timestamp?: string | null;
      status?: string;
      subStatus?: string;
      description?: string;
      location?: string;
    }>;
  } | null;
  items: ApiOrderItem[];
};

type ApiOrderSuccess = {
  success: true;
  order: ApiOrder;
};

type ApiFailure = {
  success: false;
  message?: string;
};

export type TradeOrder = ApiOrder;

export type CreateOrderPayload = {
  items: Array<{
    product?: string | null;
    slug: string;
    name: string;
    selectedFlavor?: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  shippingInfo: {
    contactName: string;
    email?: string;
    phone: string;
    company?: string;
    businessType?: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentInfo: {
    method: 'bank_transfer';
  };
  pricing: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
  note?: string;
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
    throw new Error(
      getFailureMessage(result as { message?: string }, 'The order request could not be completed.'),
    );
  }

  return result as T;
}

export async function createWholesaleOrder(token: string, payload: CreateOrderPayload): Promise<TradeOrder> {
  const result = await authorizedRequest<ApiOrderSuccess>('/orders', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return result.order;
}

export async function fetchMyOrders(token: string): Promise<TradeOrder[]> {
  const result = await authorizedRequest<{ success: true; orders: ApiOrder[] }>(
    '/orders/my-orders',
    token,
    {
      method: 'GET',
    },
  );

  return result.orders;
}

export async function downloadWholesaleInvoicePdf(
  token: string,
  orderId: string,
  orderNumber?: string,
): Promise<void> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/orders/${orderId}/invoice`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    throw new Error('Unable to reach the server. Please make sure the local API is running.');
  }

  if (!response.ok) {
    let failureMessage = 'Unable to download the invoice PDF.';

    try {
      const result = (await response.json()) as ApiFailure;
      failureMessage = getFailureMessage(result, failureMessage);
    } catch {
      // Keep the generic message when the response body is not JSON.
    }

    throw new Error(failureMessage);
  }

  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = `${orderNumber || orderId}-invoice.pdf`;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
}
