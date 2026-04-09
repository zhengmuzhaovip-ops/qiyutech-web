export type OrderTone = 'amber' | 'sky' | 'emerald' | 'rose' | 'slate';

export type CustomerOrderPresentation = {
  label: string;
  headline: string;
  detail: string;
  nextStep: string;
  tone: OrderTone;
};

function normalize(value?: string, fallback = '') {
  return (value || fallback).trim().toLowerCase();
}

export function getCustomerOrderPresentation(
  orderStatus?: string,
  paymentStatus?: string,
): CustomerOrderPresentation {
  const status = normalize(orderStatus, 'pending');
  const payment = normalize(paymentStatus, 'unpaid');

  if (status === 'cancelled') {
    return {
      label: 'Cancelled',
      headline: 'This order was cancelled.',
      detail: 'Order cancelled.',
      nextStep: 'Place a new order or contact trade support if you need assistance.',
      tone: 'rose',
    };
  }

  if (payment === 'refunded') {
    return {
      label: 'Refunded',
      headline: 'This order was refunded.',
      detail: 'Payment refunded.',
      nextStep: 'Contact trade support if a replacement order is needed.',
      tone: 'slate',
    };
  }

  if (payment !== 'paid') {
    return {
      label: 'Payment needed',
      headline: 'Your order is waiting for payment.',
      detail: 'Order received. Awaiting transfer.',
      nextStep: 'Download the invoice and use the order number as transfer reference.',
      tone: 'amber',
    };
  }

  if (status === 'shipped') {
    return {
      label: 'Shipped',
      headline: 'Your order has left our warehouse.',
      detail: 'Shipment in transit.',
      nextStep: 'Please wait for delivery or contact support if you need shipment help.',
      tone: 'sky',
    };
  }

  if (status === 'delivered' || status === 'completed') {
    return {
      label: 'Completed',
      headline: 'This order is complete.',
      detail: 'Fulfillment complete.',
      nextStep: 'You can place another order anytime from the catalog.',
      tone: 'emerald',
    };
  }

  return {
    label: 'Paid',
    headline: 'Payment is confirmed.',
    detail: 'In preparation.',
    nextStep: 'No action is needed. We will update the order as processing continues.',
    tone: 'emerald',
  };
}

export function isAwaitingPaymentOrder(paymentStatus?: string) {
  return normalize(paymentStatus, 'unpaid') !== 'paid';
}

export function isClosedOrderStatus(orderStatus?: string, paymentStatus?: string) {
  const status = normalize(orderStatus);
  const payment = normalize(paymentStatus);

  return status === 'completed' || status === 'delivered' || status === 'cancelled' || payment === 'refunded';
}

export function isShippedOrder(orderStatus?: string) {
  const status = normalize(orderStatus);
  return status === 'shipped' || status === 'delivered';
}
