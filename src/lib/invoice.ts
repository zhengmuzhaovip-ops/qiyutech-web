import { jsPDF } from 'jspdf';
import { siteSettings } from '../data/site';
import type { CartItem } from '../types';

type InvoiceLineItem = Pick<CartItem, 'name' | 'price' | 'quantity' | 'selectedFlavor'>;

type ShippingAddress = {
  country: string;
  state: string;
  city: string;
  address: string;
  postalCode: string;
};

export type InvoiceOrderPayload = {
  orderId?: string;
  orderNumber: string;
  placedAt: string;
  orderStatus?: string;
  paymentStatus?: string;
  customer: string;
  email: string;
  phone?: string;
  company?: string;
  businessType?: string;
  paymentMethod?: 'bank_transfer';
  totalItems: number;
  subtotal: number;
  shippingFee: number;
  estimatedTax: number;
  orderTotal: number;
  notes?: string;
  items: InvoiceLineItem[];
  shippingAddress: ShippingAddress;
};

const bankTransferDetails = {
  accountName: 'To be provided',
  bankName: 'To be provided',
  accountNumber: 'To be provided',
  swiftCode: 'To be provided',
  bankAddress: 'To be provided',
  paymentReferenceLabel: 'Payment reference',
  paymentReferenceValue: 'Use the order number as your remittance reference.',
};

function formatCurrency(value: number) {
  return `$${value.toFixed(2)}`;
}

function drawWrappedText(doc: jsPDF, text: string, x: number, y: number, maxWidth: number) {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * 14;
}

export function downloadInvoicePdf(order: InvoiceOrderPayload) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 44;
  const contentWidth = pageWidth - marginX * 2;
  const labelColor = 130;
  let cursorY = 52;

  doc.setFillColor(10, 10, 10);
  doc.roundedRect(marginX, cursorY, contentWidth, 94, 18, 18, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text(siteSettings.brandName, marginX + 22, cursorY + 34);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Wholesale payment invoice', marginX + 22, cursorY + 58);
  doc.text(siteSettings.email, marginX + 22, cursorY + 76);
  doc.text(siteSettings.phone, marginX + 170, cursorY + 76);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Invoice', pageWidth - marginX - 92, cursorY + 34);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Invoice no. ${order.orderNumber}`, pageWidth - marginX - 140, cursorY + 58);
  doc.text(`Issued ${order.placedAt}`, pageWidth - marginX - 140, cursorY + 74);

  cursorY += 120;

  doc.setDrawColor(40, 40, 40);
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(marginX, cursorY, contentWidth / 2 - 8, 126, 16, 16, 'S');
  doc.roundedRect(marginX + contentWidth / 2 + 8, cursorY, contentWidth / 2 - 8, 126, 16, 16, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(labelColor);
  doc.text('Billed to', marginX + 18, cursorY + 22);
  doc.text('Ship to', marginX + contentWidth / 2 + 26, cursorY + 22);

  doc.setTextColor(20, 20, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(order.customer || 'Trade contact', marginX + 18, cursorY + 48);
  doc.text(order.shippingAddress.address || 'Shipping address pending', marginX + contentWidth / 2 + 26, cursorY + 48);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  let leftY = cursorY + 68;
  let rightY = cursorY + 68;

  if (order.company) {
    leftY = drawWrappedText(doc, order.company, marginX + 18, leftY, contentWidth / 2 - 44);
    leftY += 4;
  }
  leftY = drawWrappedText(doc, order.email || 'No email provided', marginX + 18, leftY, contentWidth / 2 - 44);
  leftY += 4;
  leftY = drawWrappedText(doc, order.phone || 'No phone provided', marginX + 18, leftY, contentWidth / 2 - 44);

  rightY = drawWrappedText(
    doc,
    `${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}`,
    marginX + contentWidth / 2 + 26,
    rightY,
    contentWidth / 2 - 44,
  );
  rightY += 4;
  rightY = drawWrappedText(
    doc,
    order.shippingAddress.country,
    marginX + contentWidth / 2 + 26,
    rightY,
    contentWidth / 2 - 44,
  );

  cursorY += 150;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(labelColor);
  doc.text('Order summary', marginX, cursorY);

  cursorY += 18;
  doc.setFillColor(18, 18, 18);
  doc.roundedRect(marginX, cursorY, contentWidth, 28, 10, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('Item', marginX + 14, cursorY + 18);
  doc.text('Qty', marginX + 276, cursorY + 18);
  doc.text('Unit', marginX + 344, cursorY + 18);
  doc.text('Total', pageWidth - marginX - 70, cursorY + 18);

  cursorY += 38;

  doc.setTextColor(20, 20, 20);
  doc.setFont('helvetica', 'normal');
  order.items.forEach((item) => {
    const itemLabel = item.selectedFlavor ? `${item.name} (${item.selectedFlavor})` : item.name;
    doc.line(marginX, cursorY - 8, pageWidth - marginX, cursorY - 8);
    const itemEndY = drawWrappedText(doc, itemLabel, marginX + 14, cursorY + 6, 240);
    doc.text(String(item.quantity), marginX + 276, cursorY + 6);
    doc.text(formatCurrency(item.price), marginX + 344, cursorY + 6);
    doc.text(formatCurrency(item.price * item.quantity), pageWidth - marginX - 70, cursorY + 6, {
      align: 'left',
    });
    cursorY = Math.max(cursorY + 24, itemEndY + 6);
  });

  cursorY += 12;
  doc.line(marginX, cursorY, pageWidth - marginX, cursorY);

  const totalsX = pageWidth - marginX - 170;
  cursorY += 24;
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal', totalsX, cursorY);
  doc.text(formatCurrency(order.subtotal), pageWidth - marginX, cursorY, { align: 'right' });
  cursorY += 18;
  doc.text('Shipping', totalsX, cursorY);
  doc.text(formatCurrency(order.shippingFee), pageWidth - marginX, cursorY, { align: 'right' });
  cursorY += 18;
  doc.text('Estimated tax', totalsX, cursorY);
  doc.text(formatCurrency(order.estimatedTax), pageWidth - marginX, cursorY, { align: 'right' });
  cursorY += 24;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Total due', totalsX, cursorY);
  doc.text(formatCurrency(order.orderTotal), pageWidth - marginX, cursorY, { align: 'right' });

  cursorY += 30;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(labelColor);
  doc.text('Bank transfer instructions', marginX, cursorY);

  cursorY += 14;
  doc.setTextColor(20, 20, 20);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.roundedRect(marginX, cursorY, contentWidth, 118, 16, 16, 'S');
  drawWrappedText(doc, `Payment method: Bank transfer`, marginX + 16, cursorY + 22, contentWidth - 32);
  drawWrappedText(doc, `Account name: ${bankTransferDetails.accountName}`, marginX + 16, cursorY + 40, contentWidth - 32);
  drawWrappedText(doc, `Bank name: ${bankTransferDetails.bankName}`, marginX + 16, cursorY + 58, contentWidth - 32);
  drawWrappedText(doc, `Account number: ${bankTransferDetails.accountNumber}`, marginX + 16, cursorY + 76, contentWidth - 32);
  drawWrappedText(doc, `SWIFT code: ${bankTransferDetails.swiftCode}`, marginX + 16, cursorY + 94, contentWidth - 32);
  drawWrappedText(doc, `Bank address: ${bankTransferDetails.bankAddress}`, marginX + 16, cursorY + 112, contentWidth - 32);

  cursorY += 136;
  const referenceNote = `${bankTransferDetails.paymentReferenceLabel}: ${order.orderNumber}. ${bankTransferDetails.paymentReferenceValue}`;
  const notesText = order.notes?.trim()
    ? `Order notes: ${order.notes.trim()}`
    : 'Order notes: No additional delivery notes were provided.';

  drawWrappedText(doc, referenceNote, marginX, cursorY, contentWidth);
  cursorY += 22;
  drawWrappedText(doc, notesText, marginX, cursorY, contentWidth);

  doc.setFontSize(9);
  doc.setTextColor(110, 110, 110);
  doc.text(
    'This invoice is generated from the current wholesale order flow. Replace the bank details with your live remittance information before production use.',
    marginX,
    pageHeight - 28,
  );

  const blob = doc.output('blob');
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = `${order.orderNumber}-invoice.pdf`;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
}
