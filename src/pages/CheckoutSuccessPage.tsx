import { useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { downloadInvoicePdf, type InvoiceOrderPayload } from '../lib/invoice';
import { useAuth } from '../context/AuthContext';
import { downloadWholesaleInvoicePdf } from '../lib/orders';

export default function CheckoutSuccessPage() {
  const location = useLocation();
  const { token } = useAuth();
  const state = location.state as InvoiceOrderPayload | null;
  const [isDownloading, setIsDownloading] = useState(false);

  if (!state) {
    return <Navigate to="/products" replace />;
  }

  const order = state;

  async function handleDownloadInvoice() {
    setIsDownloading(true);

    try {
      if (token && order.orderId) {
        await downloadWholesaleInvoicePdf(token, order.orderId, order.orderNumber);
      } else {
        downloadInvoicePdf(order);
      }
    } catch {
      downloadInvoicePdf(order);
    } finally {
      window.setTimeout(() => setIsDownloading(false), 500);
    }
  }

  return (
    <div className="mx-auto max-w-5xl overflow-x-hidden px-4 py-8 sm:px-6 sm:py-20">
      <div className="rounded-[1.85rem] border border-white/10 bg-neutral-950 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:rounded-[2.25rem] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-400/80">
          Wholesale order submitted
        </p>
        <h1 className="mt-4 max-w-3xl text-[2rem] font-semibold leading-[0.96] tracking-[-0.04em] text-white sm:text-4xl sm:tracking-tight">
          Your wholesale order has been submitted successfully.
        </h1>
        <p className="mt-4 max-w-2xl text-[13px] leading-6 text-neutral-400 sm:text-sm sm:leading-7">
          Your order details have been recorded and the cart has been cleared. The next step is to
          send payment offline by bank transfer for this order.
        </p>

        <div className="mt-6 grid gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-3">
          <TrustCard
            title="Order captured"
            body="Order details are saved in the current wholesale flow and linked to your account record."
          />
          <TrustCard
            title="Bank transfer next"
            body="This order is now ready for offline payment by bank transfer once the invoice and remittance details are provided."
          />
          <TrustCard
            title="Invoice ready"
            body="Download the invoice PDF from this page and use the order reference for your payment transfer."
          />
        </div>

        <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <section className="rounded-[1.45rem] border border-white/10 bg-white/[0.03] p-4 sm:rounded-[1.75rem] sm:p-6">
            <div className="mb-4 border-b border-white/10 pb-4 sm:mb-5 sm:pb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                Order confirmation
              </p>
              <h2 className="mt-3 text-[1.55rem] font-semibold leading-[1.02] text-white sm:text-2xl">
                Order details for your account
              </h2>
              <p className="mt-2 text-[13px] leading-6 text-neutral-400 sm:text-sm sm:leading-7">
                The order summary below matches the saved order record and invoice download for this transaction.
              </p>
            </div>
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
              <Info label="Order number" value={order.orderNumber} />
              <Info label="Placed at" value={order.placedAt} />
              <Info label="Business contact" value={order.customer} />
              <Info label="Email" value={order.email || 'Not provided'} />
              <Info label="Company" value={order.company || 'Store account'} />
              <Info label="Payment method" value="Bank transfer" />
              <Info label="Order status" value={formatStatus(order.orderStatus || 'pending')} />
              <Info
                label="Payment status"
                value={formatStatus(order.paymentStatus || 'unpaid')}
              />
              <Info label="Units" value={String(order.totalItems)} />
              <Info label="Invoice status" value="Ready to download" />
            </div>
          </section>

          <aside className="rounded-[1.45rem] border border-white/10 bg-black p-4 sm:rounded-[1.75rem] sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
              Order total
            </p>
            <h2 className="mt-3 text-xl font-semibold text-white">Commercial summary</h2>
            <div className="mt-5 space-y-3 text-sm text-neutral-300">
              <PriceRow label="Subtotal" value={order.subtotal} />
              <PriceRow label="Shipping" value={order.shippingFee} freeLabel="Free" />
              <PriceRow label="Estimated tax" value={order.estimatedTax} />
            </div>
            <div className="mt-5 border-t border-white/10 pt-5">
              <div className="flex items-center justify-between text-[1.85rem] font-semibold leading-none text-white sm:text-lg">
                <span>Total</span>
                <span>${order.orderTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-5 rounded-[1.15rem] border border-white/10 bg-white/[0.03] p-4 text-[13px] leading-6 text-neutral-400 sm:mt-6 sm:rounded-[1.25rem] sm:text-sm sm:leading-7">
              Download the invoice PDF, then use the bank-transfer details on that document to
              complete payment offline for this order.
            </div>
          </aside>
        </div>

        <div className="mt-6 rounded-[1.45rem] border border-white/10 bg-white/[0.03] p-4 sm:mt-8 sm:rounded-[1.75rem] sm:p-6">
          <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1.1fr,0.9fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                What happens next
              </p>
              <h2 className="mt-3 text-[1.55rem] font-semibold leading-[1.02] text-white sm:text-2xl">
                Next step: bank transfer
              </h2>
              <div className="mt-4 space-y-3 text-[13px] leading-6 text-neutral-400 sm:text-sm sm:leading-7">
                <p>Your order is submitted and ready for invoice and payment instructions.</p>
                <p>Complete payment by bank transfer after you receive the order remittance details.</p>
                <p>Store orders can then continue into payment confirmation and delivery processing.</p>
              </div>
            </div>

            <div className="rounded-[1.3rem] border border-white/10 bg-black p-4 sm:rounded-[1.5rem] sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                Invoice actions
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleDownloadInvoice}
                  disabled={isDownloading}
                  className="inline-flex items-center justify-center rounded-full border border-white bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isDownloading ? 'Preparing invoice PDF...' : 'Download invoice PDF'}
                </button>
                <p className="text-[12px] leading-5 text-neutral-500">
                  This invoice PDF is served by the order record when available, with a safe fallback
                  to the current order details in the browser.
                </p>
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white transition hover:border-white/40"
                >
                  Continue to catalog
                </Link>
                <Link
                  to="/account"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white transition hover:border-white/40"
                >
                  View account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrustCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4 sm:rounded-[1.5rem] sm:p-5">
      <p className="text-sm font-medium text-white">{title}</p>
      <p className="mt-3 text-[13px] leading-6 text-neutral-400 sm:text-sm sm:leading-7">{body}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-[1.15rem] border border-white/10 bg-black px-4 py-3.5 sm:rounded-[1.25rem] sm:py-4">
      <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">{label}</p>
      <p className="mt-3 break-words text-sm text-white">{value}</p>
    </div>
  );
}

function PriceRow({
  label,
  value,
  freeLabel,
}: {
  label: string;
  value: number;
  freeLabel?: string;
}) {
  const displayValue = value === 0 && freeLabel ? freeLabel : `$${value.toFixed(2)}`;

  return (
    <div className="flex items-center justify-between gap-4">
      <span>{label}</span>
      <span className="text-white">{displayValue}</span>
    </div>
  );
}

function formatStatus(value: string) {
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
