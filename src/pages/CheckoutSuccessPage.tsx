import { Link, useLocation, Navigate } from 'react-router-dom';

type SuccessState = {
  orderNumber: string;
  placedAt: string;
  customer: string;
  email: string;
  company?: string;
  totalItems: number;
  subtotal: number;
  shippingFee: number;
  estimatedTax: number;
  orderTotal: number;
};

export default function CheckoutSuccessPage() {
  const location = useLocation();
  const state = location.state as SuccessState | null;

  if (!state) {
    return <Navigate to="/products" replace />;
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <div className="rounded-[2.25rem] border border-white/10 bg-neutral-950 p-8 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-400/80">
          Order received
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
          The checkout flow now ends on a clear confirmation state.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-400">
          This is still demo-mode, but the buyer now gets a proper success screen with order
          details instead of stopping at an empty cart reset.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Info label="Order number" value={state.orderNumber} />
              <Info label="Placed at" value={state.placedAt} />
              <Info label="Buyer" value={state.customer} />
              <Info label="Email" value={state.email || 'Not provided'} />
              <Info label="Company" value={state.company || 'Retail order'} />
              <Info label="Units" value={String(state.totalItems)} />
            </div>
          </section>

          <aside className="rounded-[1.75rem] border border-white/10 bg-black p-6">
            <h2 className="text-xl font-semibold text-white">Order total</h2>
            <div className="mt-5 space-y-3 text-sm text-neutral-300">
              <PriceRow label="Subtotal" value={state.subtotal} />
              <PriceRow label="Shipping" value={state.shippingFee} freeLabel="Free" />
              <PriceRow label="Estimated tax" value={state.estimatedTax} />
            </div>
            <div className="mt-5 border-t border-white/10 pt-5">
              <div className="flex items-center justify-between text-lg font-semibold text-white">
                <span>Total</span>
                <span>${state.orderTotal.toFixed(2)}</span>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/products"
            className="inline-flex items-center justify-center rounded-full border border-white bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-neutral-100"
          >
            Continue shopping
          </Link>
          <Link
            to="/account"
            className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white transition hover:border-white/40"
          >
            Go to account
          </Link>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-black px-4 py-4">
      <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">{label}</p>
      <p className="mt-3 text-sm text-white">{value}</p>
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
