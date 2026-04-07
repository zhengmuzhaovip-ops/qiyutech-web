import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ButtonLink } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { siteSettings } from '../data/site';
import { downloadWholesaleInvoicePdf, fetchMyOrders, type TradeOrder } from '../lib/orders';

export default function AccountPage() {
  const { isLoggedIn, user, token, logout } = useAuth();
  const [orders, setOrders] = useState<TradeOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [downloadingOrderId, setDownloadingOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setOrders([]);
      return;
    }

    let active = true;
    setIsLoadingOrders(true);

    fetchMyOrders(token)
      .then((nextOrders) => {
        if (!active) return;
        setOrders(nextOrders);
      })
      .catch(() => {
        if (!active) return;
        setOrders([]);
      })
      .finally(() => {
        if (!active) return;
        setIsLoadingOrders(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  if (!isLoggedIn || !user) {
    return <Navigate to="/login" replace state={{ from: '/account' }} />;
  }

  const accountId = `TRADE-${user.id.slice(0, 8).toUpperCase()}`;
  const businessContact = user.name || 'Not added yet';
  const primaryEmail = user.email || 'Not added yet';
  const mobileNumber = user.phone || 'Not added yet';
  const companyName = user.company || 'Not added yet';
  const shippingAddress =
    [
      user.address?.street,
      [user.address?.city, user.address?.state].filter(Boolean).join(', '),
      user.address?.zipCode,
      user.address?.country,
    ]
      .filter(Boolean)
      .join(', ') || 'No shipping address saved yet';

  async function handleDownloadInvoice(order: TradeOrder) {
    if (!token) return;

    try {
      setDownloadingOrderId(order.id);
      await downloadWholesaleInvoicePdf(token, order.id, order.orderNumber);
    } finally {
      setDownloadingOrderId(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl overflow-x-hidden px-4 py-8 sm:px-6 sm:py-20">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-wrap sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-500">
            Trade account
          </p>
          <h1 className="mt-3 max-w-[17rem] text-[2.1rem] font-semibold leading-[1.02] tracking-tight text-white sm:max-w-none sm:text-4xl">
            Welcome back, {businessContact}.
          </h1>
          <p className="mt-3 max-w-[20rem] text-sm leading-8 text-neutral-400 sm:max-w-xl sm:leading-6">
            Review your saved trade details, account readiness, and support options in one place.
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-white/10 bg-white/[0.03] px-4 py-2.5 sm:rounded-[1.25rem] sm:px-4 sm:py-3">
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">Account status</p>
          <div className="mt-2.5 flex flex-wrap items-center gap-2 sm:mt-2 sm:gap-3">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400" />
            <span className="text-sm text-white">Trade account active</span>
            <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-neutral-300 sm:px-3 sm:text-[11px]">
              Pricing access review
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-5 sm:gap-8 xl:grid-cols-[1.08fr,0.92fr]">
        <section className="min-w-0 rounded-[1.75rem] border border-white/10 bg-neutral-950 p-4 sm:rounded-[2rem] sm:p-6 sm:pt-7">
          <div className="grid min-w-0 gap-3 sm:gap-4 md:grid-cols-2">
            <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4 md:contents">
              <InfoCard label="Account ID" value={accountId} compact />
              <InfoCard label="Business contact" value={businessContact} compact />
            </div>
            <InfoCard label="Email" value={primaryEmail} truncate />
            <InfoCard label="Mobile number" value={mobileNumber} />
            <div className="md:col-span-2">
              <InfoCard label="Company" value={companyName} />
            </div>
            <div className="md:col-span-2">
              <InfoCard label="Shipping address" value={shippingAddress} truncate />
            </div>
          </div>

          <div className="mt-4 rounded-[1.4rem] border border-white/10 bg-white/[0.02] p-4 sm:mt-5 sm:rounded-[1.5rem] sm:p-5">
            <SectionEyebrow text="Recent order activity" />
            {isLoadingOrders ? (
              <div className="mt-4 rounded-[1.25rem] border border-white/10 bg-black px-5 py-6 text-sm leading-7 text-neutral-400">
                Loading your recent orders...
              </div>
            ) : orders.length > 0 ? (
              <div className="mt-4 space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="overflow-hidden rounded-[1.25rem] border border-white/10 bg-black"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedOrderId((current) => (current === order.id ? null : order.id))
                      }
                      className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left sm:px-5"
                    >
                      <div className="min-w-0">
                        <p className="text-base font-medium text-white sm:text-lg">
                          {order.orderNumber}
                        </p>
                        <p className="mt-1 text-sm text-neutral-400">
                          {new Date(order.placedAt).toLocaleString('en-US', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </p>
                      </div>
                      <div className="flex items-start gap-4 text-right">
                        <div>
                          <p className="text-base font-medium text-white sm:text-lg">
                            ${order.pricing.total.toFixed(2)}
                          </p>
                          <p className="mt-1 text-xs uppercase tracking-[0.22em] text-neutral-500">
                            {formatStatus(order.status)} · {formatStatus(order.paymentStatus)}
                          </p>
                        </div>
                        <span className="mt-1 text-sm text-neutral-500">
                          {expandedOrderId === order.id ? '-' : '+'}
                        </span>
                      </div>
                    </button>

                    {expandedOrderId === order.id ? (
                      <div className="border-t border-white/10 px-4 py-4 sm:px-5">
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div
                              key={`${order.id}-${item.id}`}
                              className="grid gap-3 rounded-[1rem] border border-white/10 bg-white/[0.02] px-4 py-3 sm:flex sm:items-center sm:justify-between sm:gap-4"
                            >
                              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                                <img
                                  src={
                                    item.image ||
                                    '/images/catalog-geek-bar-pulse-x-pear-of-thieves.png'
                                  }
                                  alt={`${item.name} ${item.selectedFlavor || ''}`.trim()}
                                  className="h-16 w-16 shrink-0 rounded-[1rem] border border-white/10 object-cover object-left sm:h-20 sm:w-20 sm:rounded-2xl"
                                />
                                <div className="min-w-0">
                                  <p className="truncate text-base font-medium text-white sm:text-lg">
                                    {item.name}
                                  </p>
                                  <p className="mt-1 truncate text-sm text-neutral-300">
                                    {item.selectedFlavor || 'Standard selection'}
                                  </p>
                                  <p className="mt-2 text-sm text-neutral-400">
                                    $
                                    {item.lineTotal?.toFixed(2) ??
                                      (item.price * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-3 sm:shrink-0 sm:border-t-0 sm:pt-0 sm:text-right">
                                <div>
                                  <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">
                                    Order quantity
                                  </p>
                                  <div className="mt-2 flex h-10 min-w-[72px] items-center justify-center rounded-[1rem] border border-white/10 bg-black px-4 text-lg font-medium text-white sm:h-11 sm:min-w-[80px]">
                                    {item.quantity}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={() => handleDownloadInvoice(order)}
                            disabled={downloadingOrderId === order.id}
                            className="inline-flex w-full items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white transition hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {downloadingOrderId === order.id ? 'Preparing invoice PDF...' : 'Download invoice PDF'}
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-[1.25rem] border border-dashed border-white/10 bg-black px-5 py-6 text-sm leading-7 text-neutral-400">
                No orders yet. Your completed wholesale orders will appear here automatically.
              </div>
            )}
          </div>

          <div className="mt-4 rounded-[1.4rem] border border-white/10 bg-white/[0.02] p-4 sm:mt-5 sm:rounded-[1.5rem] sm:p-5">
            <SectionEyebrow text="Quick actions" />
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap">
              <ButtonLink
                to="/products"
                variant="secondary"
                className="flex min-h-[42px] w-full min-w-0 px-3 py-2 text-[11.5px] leading-[1.15] tracking-[-0.01em] sm:min-h-0 sm:w-auto sm:px-5 sm:py-3 sm:text-sm sm:leading-normal sm:tracking-normal"
              >
                Continue to catalog
              </ButtonLink>
              <ButtonLink
                to="/cart"
                variant="secondary"
                className="flex min-h-[42px] w-full min-w-0 px-3 py-2 text-[11.5px] leading-[1.15] tracking-[-0.01em] sm:min-h-0 sm:w-auto sm:px-5 sm:py-3 sm:text-sm sm:leading-normal sm:tracking-normal"
              >
                Review order cart
              </ButtonLink>
              <ButtonLink
                to="/checkout"
                variant="secondary"
                className="flex min-h-[42px] w-full min-w-0 px-3 py-2 text-[11.5px] leading-[1.15] tracking-[-0.01em] sm:min-h-0 sm:w-auto sm:px-5 sm:py-3 sm:text-sm sm:leading-normal sm:tracking-normal"
              >
                Go to checkout
              </ButtonLink>
              <button
                type="button"
                onClick={logout}
                className="inline-flex min-h-[42px] w-full min-w-0 items-center justify-center rounded-full border border-white/20 px-3 py-2 text-[11.5px] font-medium leading-[1.15] tracking-[-0.01em] text-white transition hover:-translate-y-0.5 hover:border-white/50 sm:min-h-0 sm:w-auto sm:px-5 sm:py-3 sm:text-sm sm:leading-normal sm:tracking-normal"
              >
                Logout
              </button>
            </div>
          </div>
        </section>

        <aside className="min-w-0 space-y-4 sm:space-y-5">
          <div className="rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:rounded-[2rem] sm:p-6">
            <SectionEyebrow text="Trade support" />
            <div className="mt-4 space-y-3">
              <SupportCard
                label="Support line"
                value={siteSettings.phone}
                href={`tel:${siteSettings.phone.replace(/[^\d+]/g, '')}`}
              />
              <SupportCard
                label="Business email"
                value={siteSettings.email}
                href={`mailto:${siteSettings.email}`}
              />
              <SupportCard
                label="WhatsApp"
                value={siteSettings.whatsapp}
                href={siteSettings.whatsappUrl}
              />
              <SupportCard
                label="Coverage"
                value="Account setup, reorder planning, and pricing follow-up"
              />
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-neutral-950 p-5 sm:rounded-[2rem] sm:p-6">
            <SectionEyebrow text="Account status" />
            <div className="mt-4 space-y-3">
              <StatusRow label="Pricing access" value="Pending live verification" />
              <StatusRow
                label="Quote workflow"
                value={user.phone ? 'Ready for order follow-up' : 'Add mobile number to continue'}
              />
              <StatusRow
                label="Order profile"
                value={
                  orders.length > 0
                    ? 'Recent wholesale orders are available'
                    : user.address?.street
                      ? 'Saved from checkout activity'
                      : 'Waiting for first saved order details'
                }
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SectionEyebrow({ text }: { text: string }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-500">{text}</p>
  );
}

function InfoCard({
  label,
  value,
  truncate = false,
  compact = false,
}: {
  label: string;
  value: string;
  truncate?: boolean;
  compact?: boolean;
}) {
  return (
    <div className="min-w-0 max-w-full rounded-[1.25rem] border border-white/10 bg-white/[0.02] px-4 py-3 sm:rounded-[1.5rem] sm:px-5 sm:py-5">
      <p className="text-[12px] text-neutral-400 sm:text-sm">{label}</p>
      <p
        className={`mt-2.5 min-w-0 max-w-full font-medium leading-tight text-white sm:mt-4 ${
          compact ? 'text-[0.84rem] sm:text-2xl' : 'text-[0.96rem] sm:text-2xl'
        } ${truncate ? 'break-all sm:truncate sm:text-lg' : 'break-words'}`}
      >
        {value}
      </p>
    </div>
  );
}

function SupportCard({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">{label}</p>
      <p className="mt-3 break-all text-lg font-medium leading-tight text-white sm:mt-4 sm:break-words sm:text-xl">
        {value}
      </p>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noreferrer' : undefined}
        className="block min-w-0 max-w-full rounded-[1.35rem] border border-white/10 bg-black px-4 py-4 transition hover:border-white/20 sm:rounded-[1.5rem] sm:px-5 sm:py-5"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="min-w-0 max-w-full rounded-[1.35rem] border border-white/10 bg-black px-4 py-4 sm:rounded-[1.5rem] sm:px-5 sm:py-5">
      {content}
    </div>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 max-w-full rounded-[1.35rem] border border-white/10 bg-white/[0.02] px-4 py-4 sm:rounded-[1.5rem] sm:px-5 sm:py-5">
      <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">{label}</p>
      <p className="mt-3 break-words text-lg font-medium text-white sm:mt-4 sm:text-xl">
        {value}
      </p>
    </div>
  );
}

function formatStatus(value: string) {
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
