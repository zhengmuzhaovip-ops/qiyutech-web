import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { downloadInvoicePdf, type InvoiceOrderPayload } from '../lib/invoice';
import { getCustomerOrderPresentation } from '../lib/orderStatusPresentation';
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
  const orderPresentation = getCustomerOrderPresentation(
    order.orderStatus,
    order.paymentStatus,
  );
  const mobileSuccessCopy = getMobileSuccessCopy(orderPresentation.label);

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
        <div className="sm:hidden">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-400/80">
            Order received
          </p>
          <h1 className="mt-4 max-w-md text-[1.9rem] font-semibold leading-[0.98] tracking-[-0.04em] text-white">
            {mobileSuccessCopy.hero}
          </h1>
          <p className="mt-4 max-w-md text-[13px] leading-6 text-neutral-400">
            Saved under {order.orderNumber}. Download the invoice and use the order number as your
            payment reference.
          </p>

          <div className="mt-6 rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-3.5">
            <div className="min-w-0">
              <div className="flex items-center justify-between gap-3">
                <p className="whitespace-nowrap text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                  Status
                </p>
                <StatusPill
                  label={orderPresentation.label}
                  tone={orderPresentation.tone}
                  compact
                />
              </div>
              <h2 className="mt-2 text-[1.08rem] font-semibold leading-tight text-white">
                {mobileSuccessCopy.statusHeadline}
              </h2>
              <p className="mt-1.5 text-[12px] leading-5 text-neutral-400">
                {mobileSuccessCopy.statusDetail}
              </p>
            </div>

            <div className="mt-3.5 grid grid-cols-2 gap-2.5">
              <CompactInfo label="Order" value={order.orderNumber} />
              <CompactInfo label="Total" value={`$${order.orderTotal.toFixed(2)}`} />
              <CompactInfo label="Units" value={String(order.totalItems)} />
              <CompactInfo label="Method" value="Transfer" />
              <CompactInfo label="Placed" value={order.placedAt} className="col-span-2" />
            </div>

            <div className="mt-3.5 rounded-[1rem] border border-white/10 bg-black px-3.5 py-3.5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">Next step</p>
              <p className="mt-2.5 text-[12px] leading-5 text-white">
                {mobileSuccessCopy.nextStep}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
              What happens next
            </p>
            <div className="mt-4 space-y-3">
              <CompactStep
                step="01"
                title="Download invoice"
                body="Use the latest PDF from this page."
              />
              <CompactStep
                step="02"
                title="Send transfer"
                body={`Include ${order.orderNumber} in the transfer note.`}
              />
              <CompactStep
                step="03"
                title="We confirm status"
                body="Your account updates after payment confirmation."
              />
            </div>
          </div>

          <div className="mt-5 rounded-[1.4rem] border border-white/10 bg-black p-4">
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
              <Link
                to="/account"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white transition hover:border-white/40"
              >
                View trade account
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white transition hover:border-white/40"
              >
                Continue to catalog
              </Link>
            </div>
          </div>
        </div>

        <div className="hidden sm:block">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-400/80">
            Order received
          </p>
          <h1 className="mt-4 max-w-3xl text-[2rem] font-semibold leading-[0.96] tracking-[-0.04em] text-white sm:text-4xl sm:tracking-tight">
            Your wholesale order is in and ready for offline payment.
          </h1>
          <p className="mt-4 max-w-2xl text-[13px] leading-6 text-neutral-400 sm:text-sm sm:leading-7">
            We have saved your order under {order.orderNumber}. Download the invoice PDF, complete the
            bank transfer, and use the order number as your payment reference.
          </p>

          <div className="mt-6 rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-4 sm:mt-8 sm:rounded-[1.6rem] sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">
                  Current status
                </p>
                <h2 className="mt-3 text-[1.45rem] font-semibold leading-[1.04] text-white sm:text-2xl">
                  {orderPresentation.headline}
                </h2>
                <p className="mt-3 text-[13px] leading-6 text-neutral-400 sm:text-sm sm:leading-7">
                  {orderPresentation.detail}
                </p>
              </div>
              <StatusPill label={orderPresentation.label} tone={orderPresentation.tone} />
            </div>
            <div className="mt-5 rounded-[1.15rem] border border-white/10 bg-black px-4 py-4">
              <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">Next step</p>
              <p className="mt-3 text-sm leading-7 text-white">{orderPresentation.nextStep}</p>
            </div>
          </div>

          <div className="mt-8 hidden gap-4 sm:grid lg:grid-cols-3">
          <TrustCard
            title="Order recorded"
            body="Your wholesale order is linked to your account and available in the trade account order history."
          />
          <TrustCard
            title="Manual payment confirmation"
            body="After you complete bank transfer, the trade team manually confirms payment and updates the order status."
          />
          <TrustCard
            title="Invoice ready"
            body="The invoice PDF is ready now, so you can send payment using the correct order reference."
          />
        </div>

          <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-6 lg:grid-cols-[1.1fr,0.9fr]">
            <section className="rounded-[1.45rem] border border-white/10 bg-white/[0.03] p-4 sm:rounded-[1.75rem] sm:p-6">
            <div className="mb-4 border-b border-white/10 pb-4 sm:mb-5 sm:pb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                Order confirmation
              </p>
              <h2 className="mt-3 text-[1.55rem] font-semibold leading-[1.02] text-white sm:text-2xl">
                Saved under your trade account
              </h2>
              <p className="mt-2 text-[13px] leading-6 text-neutral-400 sm:text-sm sm:leading-7">
                This is the same order record your team can review later from the account page.
              </p>
            </div>
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
              <Info label="Order number" value={order.orderNumber} />
              <Info label="Placed at" value={order.placedAt} />
              <Info label="Business contact" value={order.customer} />
              <Info label="Email" value={order.email || 'Not provided'} />
              <Info label="Company" value={order.company || 'Store account'} />
              <Info label="Payment method" value="Bank transfer" />
              <Info label="Customer status" value={orderPresentation.label} />
              <Info label="Invoice" value="Ready to download" />
              <Info label="Units" value={String(order.totalItems)} />
              <Info
                label="Payment reference"
                value={`Use ${order.orderNumber} in your transfer note`}
              />
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
              Payment stays offline for now. Once your transfer is confirmed, the order will move
              into processing and shipment updates.
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
                Three simple steps from here
              </h2>
              <div className="mt-4 space-y-3">
                <TimelineStep
                  step="01"
                  title="Download the invoice"
                  body="Use the invoice PDF from this page so your team has the latest order total and payment reference."
                />
                <TimelineStep
                  step="02"
                  title="Send payment offline"
                  body="Complete bank transfer and include the order number in the remittance note."
                />
                <TimelineStep
                  step="03"
                  title="We confirm and process"
                  body="After payment is confirmed manually, your order status updates in the account page and moves toward shipment."
                />
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
                  This PDF follows the saved order record when available, with a browser fallback for
                  the current order details.
                </p>
                <Link
                  to="/account"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white transition hover:border-white/40"
                >
                  View trade account
                </Link>
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white transition hover:border-white/40"
                >
                  Continue to catalog
                </Link>
              </div>
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

function CompactInfo({
  label,
  value,
  className = '',
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={`min-w-0 rounded-[0.95rem] border border-white/10 bg-black px-3.5 py-2.5 ${className}`.trim()}
    >
      <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">{label}</p>
      <p className="mt-1.5 break-words text-[13px] text-white">{value}</p>
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

function TimelineStep({
  step,
  title,
  body,
}: {
  step: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[1.15rem] border border-white/10 bg-black px-4 py-4">
      <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">{step}</p>
      <p className="mt-3 text-sm font-medium text-white">{title}</p>
      <p className="mt-2 text-[13px] leading-6 text-neutral-400 sm:text-sm sm:leading-7">{body}</p>
    </div>
  );
}

function CompactStep({
  step,
  title,
  body,
}: {
  step: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[1.1rem] border border-white/10 bg-black px-4 py-3.5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-[11px] uppercase tracking-[0.22em] text-neutral-500">
          {step}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="mt-1 text-[13px] leading-6 text-neutral-400">{body}</p>
        </div>
      </div>
    </div>
  );
}

function getMobileSuccessCopy(label: string) {
  switch (label) {
    case 'Payment needed':
      return {
        hero: 'Order saved and awaiting payment.',
        statusHeadline: 'Waiting for payment.',
        statusDetail: 'Order received. Awaiting transfer.',
        nextStep: 'Download the invoice and use the order number as transfer reference.',
      };
    case 'Shipped':
      return {
        hero: 'Order confirmed and on the way.',
        statusHeadline: 'Shipment in transit.',
        statusDetail: 'Payment confirmed. Shipment in transit.',
        nextStep: 'Track updates from your trade account while delivery is in progress.',
      };
    case 'Completed':
      return {
        hero: 'Order completed successfully.',
        statusHeadline: 'Fulfillment complete.',
        statusDetail: 'Payment and fulfillment are complete.',
        nextStep: 'You can place another order anytime from the catalog.',
      };
    case 'Cancelled':
      return {
        hero: 'Order closed.',
        statusHeadline: 'Order cancelled.',
        statusDetail: 'This order is no longer active.',
        nextStep: 'Return to the catalog when you are ready to place a new order.',
      };
    default:
      return {
        hero: 'Order saved and in review.',
        statusHeadline: 'In preparation.',
        statusDetail: 'Payment confirmed. Order is in preparation.',
        nextStep: 'Check your trade account for status updates as the order moves forward.',
      };
  }
}

function StatusPill({
  label,
  tone,
  compact = false,
}: {
  label: string;
  tone: 'amber' | 'sky' | 'emerald' | 'rose' | 'slate';
  compact?: boolean;
}) {
  const toneClasses = {
    amber: 'border-amber-400/20 bg-amber-400/10 text-amber-200',
    sky: 'border-sky-400/20 bg-sky-400/10 text-sky-200',
    emerald: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200',
    rose: 'border-rose-400/20 bg-rose-400/10 text-rose-200',
    slate: 'border-white/15 bg-white/[0.06] text-neutral-200',
  }[tone];

  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold uppercase ${compact ? 'px-2.5 py-1 text-[10px] tracking-[0.16em]' : 'px-3 py-1 text-xs tracking-[0.18em]'} ${toneClasses}`}
    >
      {label}
    </span>
  );
}
