import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ButtonLink } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { siteSettings } from '../data/site';
import {
  getCustomerOrderPresentation,
  isAwaitingPaymentOrder,
  isClosedOrderStatus,
  isShippedOrder,
  type OrderTone,
} from '../lib/orderStatusPresentation';
import { downloadWholesaleInvoicePdf, fetchMyOrders, type TradeOrder } from '../lib/orders';

export default function AccountPage() {
  const initialVisibleOrders = 1;
  const { isLoggedIn, user, token, logout } = useAuth();
  const [orders, setOrders] = useState<TradeOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [downloadingOrderId, setDownloadingOrderId] = useState<string | null>(null);
  const [visibleOrderCount, setVisibleOrderCount] = useState(initialVisibleOrders);

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
        setVisibleOrderCount(initialVisibleOrders);
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
  const visibleOrders = orders.slice(0, visibleOrderCount);
  const hasMoreOrders = orders.length > visibleOrderCount;
  const currentOrder =
    orders.find((order) => !isClosedOrderStatus(order.status, order.paymentStatus) && isAwaitingPaymentOrder(order.paymentStatus)) ||
    orders.find((order) => !isClosedOrderStatus(order.status, order.paymentStatus)) ||
    orders[0] ||
    null;
  const currentOrderPresentation = currentOrder
    ? getCustomerOrderPresentation(currentOrder.status, currentOrder.paymentStatus)
    : null;
  const openOrdersCount = orders.filter(
    (order) => !isClosedOrderStatus(order.status, order.paymentStatus),
  ).length;
  const awaitingPaymentCount = orders.filter((order) =>
    isAwaitingPaymentOrder(order.paymentStatus),
  ).length;
  const shippedOrdersCount = orders.filter((order) => isShippedOrder(order.status)).length;

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
          <div className="mt-3 sm:hidden">
            <p className="text-[1.85rem] font-semibold leading-[0.98] tracking-tight text-white">
              Welcome back.
            </p>
            <p className="truncate text-[1.85rem] font-semibold leading-[0.98] tracking-tight text-white">
              {businessContact}
            </p>
          </div>
          <h1 className="mt-3 hidden max-w-[12rem] text-[1.85rem] font-semibold leading-[0.98] tracking-tight text-white sm:max-w-none sm:text-4xl">
            Welcome back, {businessContact}.
          </h1>
          <p className="mt-3 max-w-[18rem] text-sm leading-6 text-neutral-400 sm:max-w-xl">
            Review your account, active orders, and next steps in one place.
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:gap-8 xl:grid-cols-[1.08fr,0.92fr]">
        <section className="min-w-0 space-y-4 sm:space-y-5">
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            <MetricCard
              label="Open orders"
              mobileLabel="Open"
              value={isLoadingOrders ? '...' : String(openOrdersCount)}
              hint="Active orders"
            />
            <MetricCard
              label="Payment due"
              mobileLabel="Due"
              value={isLoadingOrders ? '...' : String(awaitingPaymentCount)}
              hint="Awaiting transfer"
            />
            <MetricCard
              label="In transit"
              mobileLabel="Transit"
              value={isLoadingOrders ? '...' : String(shippedOrdersCount)}
              hint="Shipped orders"
            />
          </div>

          <div className="rounded-[1.55rem] border border-white/10 bg-neutral-950 p-4 sm:rounded-[2rem] sm:p-6 sm:pt-7">
            <SectionEyebrow text="Current order status" />
            {isLoadingOrders ? (
              <div className="mt-4 rounded-[1.25rem] border border-white/10 bg-black px-5 py-6 text-sm leading-7 text-neutral-400">
                Loading your latest order status...
              </div>
            ) : currentOrder && currentOrderPresentation ? (
              <div className="mt-4 grid gap-4 lg:grid-cols-[1.05fr,0.95fr]">
                <div className="rounded-[1.25rem] border border-white/10 bg-black p-4 sm:rounded-[1.5rem] sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">
                        {currentOrder.orderNumber}
                      </p>
                      <p className="mt-2 text-sm text-neutral-400">
                        {formatPlacedAt(currentOrder.placedAt)}
                      </p>
                    </div>
                    <StatusPill
                      label={currentOrderPresentation.label}
                      tone={currentOrderPresentation.tone}
                    />
                  </div>

                  <h2 className="mt-5 text-[1.12rem] font-semibold leading-[1.05] text-white sm:max-w-none sm:text-2xl">
                    {getCompactHeadline(currentOrderPresentation.headline)}
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-400">
                    {currentOrderPresentation.detail}
                  </p>

                  <div className="mt-5 rounded-[1.15rem] border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">
                      Next step
                    </p>
                    <p className="mt-3 text-[13px] leading-6 text-white sm:text-sm sm:leading-7">
                      {currentOrderPresentation.nextStep}
                    </p>
                  </div>
                </div>

                <div className="rounded-[1.25rem] border border-white/10 bg-black p-4 sm:rounded-[1.5rem] sm:p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">
                    Order snapshot
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-1">
                    <SnapshotRow
                      label="Order total"
                      mobileLabel="Total"
                      value={`$${currentOrder.pricing.total.toFixed(2)}`}
                    />
                    <SnapshotRow
                      label="Units"
                      mobileLabel="Units"
                      value={String(
                        currentOrder.items.reduce((total, item) => total + item.quantity, 0),
                      )}
                    />
                    <SnapshotRow
                      label="Payment method"
                      mobileLabel="Method"
                      value="Bank transfer"
                      mobileValue="Transfer"
                      desktopValue="Bank transfer"
                    />
                    <SnapshotRow
                      label="Payment"
                      mobileLabel="Status"
                      value={isAwaitingPaymentOrder(currentOrder.paymentStatus) ? 'Pending' : 'Confirmed'}
                    />
                  </div>
                  <div className="mt-5 flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => handleDownloadInvoice(currentOrder)}
                      disabled={downloadingOrderId === currentOrder.id}
                      className="inline-flex items-center justify-center rounded-full border border-white bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {downloadingOrderId === currentOrder.id
                        ? 'Preparing invoice PDF...'
                        : 'Download invoice PDF'}
                    </button>
                    <p className="text-[12px] leading-5 text-neutral-500">
                      Keep the invoice handy and use the order number as your remittance reference.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-[1.25rem] border border-dashed border-white/10 bg-black px-5 py-6 text-sm leading-7 text-neutral-400">
                No active orders right now. Once you place a wholesale order, the current status and next step will show here automatically.
              </div>
            )}
          </div>

          <div className="rounded-[1.55rem] border border-white/10 bg-neutral-950 p-4 sm:rounded-[2rem] sm:p-6">
            <SectionEyebrow text="Recent order activity" />
            {isLoadingOrders ? (
              <div className="mt-4 rounded-[1.25rem] border border-white/10 bg-black px-5 py-6 text-sm leading-7 text-neutral-400">
                Loading your recent orders...
              </div>
            ) : orders.length > 0 ? (
              <div className="mt-4 space-y-3">
                {visibleOrders.map((order) => {
                  const presentation = getCustomerOrderPresentation(
                    order.status,
                    order.paymentStatus,
                  );

                  return (
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
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-base font-medium text-white sm:text-lg">
                              {order.orderNumber}
                            </p>
                            <StatusPill label={presentation.label} tone={presentation.tone} compact />
                          </div>
                          <p className="mt-1 text-sm text-neutral-400">
                            {formatPlacedAt(order.placedAt)}
                          </p>
                          <p className="mt-2 max-w-xl text-sm text-neutral-400">
                            {presentation.detail}
                          </p>
                        </div>
                        <div className="flex items-start gap-4 text-right">
                          <div>
                            <p className="text-base font-medium text-white sm:text-lg">
                              ${order.pricing.total.toFixed(2)}
                            </p>
                            <p className="mt-1 text-xs uppercase tracking-[0.22em] text-neutral-500">
                              {order.items.reduce((total, item) => total + item.quantity, 0)} units
                            </p>
                          </div>
                          <span className="mt-1 text-sm text-neutral-500">
                            {expandedOrderId === order.id ? '-' : '+'}
                          </span>
                        </div>
                      </button>

                      {expandedOrderId === order.id ? (
                        <div className="border-t border-white/10 px-4 py-4 sm:px-5">
                          <div className="mb-4 rounded-[1rem] border border-white/10 bg-white/[0.03] px-4 py-3">
                            <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">
                              Next step
                            </p>
                            <p className="mt-2 text-[13px] leading-6 text-white sm:text-sm sm:leading-7">
                              {presentation.nextStep}
                            </p>
                          </div>
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
                        </div>
                      ) : null}
                    </div>
                  );
                })}
                {orders.length > initialVisibleOrders ? (
                  <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-neutral-500">
                      Showing {visibleOrders.length} of {orders.length} orders
                    </p>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      {hasMoreOrders ? (
                        <button
                          type="button"
                          onClick={() =>
                            setVisibleOrderCount((current) =>
                              Math.min(current + initialVisibleOrders, orders.length),
                            )
                          }
                          className="inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:border-white/40"
                        >
                          Load more orders
                        </button>
                      ) : null}
                      {visibleOrderCount > initialVisibleOrders ? (
                        <button
                          type="button"
                          onClick={() => {
                            setVisibleOrderCount(initialVisibleOrders);
                            if (
                              expandedOrderId &&
                              !orders
                                .slice(0, initialVisibleOrders)
                                .some((order) => order.id === expandedOrderId)
                            ) {
                              setExpandedOrderId(null);
                            }
                          }}
                          className="inline-flex items-center justify-center rounded-full border border-white/10 px-4 py-2 text-sm text-neutral-300 transition hover:border-white/30 hover:text-white"
                        >
                          Collapse list
                        </button>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="mt-4 rounded-[1.25rem] border border-dashed border-white/10 bg-black px-5 py-6 text-sm leading-7 text-neutral-400">
                No orders yet. Your completed wholesale orders will appear here automatically.
              </div>
            )}
          </div>

          <div className="rounded-[1.55rem] border border-white/10 bg-neutral-950 p-4 sm:rounded-[2rem] sm:p-6">
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
          <details className="rounded-[1.55rem] border border-white/10 bg-neutral-950 p-4 sm:hidden">
            <summary className="cursor-pointer list-none text-xs font-semibold uppercase tracking-[0.28em] text-neutral-500 [&::-webkit-details-marker]:hidden">
              Account details
            </summary>
            <div className="mt-4 grid min-w-0 gap-3">
              <div className="grid min-w-0 grid-cols-2 gap-3">
                <InfoCard label="Account ID" value={accountId} compact />
                <InfoCard label="Business contact" value={businessContact} compact />
              </div>
              <InfoCard label="Email" value={primaryEmail} truncate />
              <InfoCard label="Mobile number" value={mobileNumber} />
              <InfoCard label="Company" value={companyName} />
              <InfoCard label="Shipping address" value={shippingAddress} truncate />
            </div>
          </details>

          <div className="hidden rounded-[1.75rem] border border-white/10 bg-neutral-950 p-4 sm:block sm:rounded-[2rem] sm:p-6 sm:pt-7">
            <SectionEyebrow text="Account details" />
            <div className="mt-4 grid min-w-0 gap-3 sm:gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <InfoCard
                  label="Account ID"
                  value={accountId}
                  compact
                  valueClassName="sm:text-[1.9rem] xl:text-[2.1rem] sm:whitespace-nowrap sm:break-normal"
                />
              </div>
              <InfoCard label="Business contact" value={businessContact} compact />
              <InfoCard label="Mobile number" value={mobileNumber} valueClassName="sm:whitespace-nowrap sm:break-normal" />
              <div className="md:col-span-2">
                <InfoCard
                  label="Email"
                  value={primaryEmail}
                  truncate
                  valueClassName="sm:text-[1.2rem] xl:text-[1.35rem] sm:break-all xl:break-normal"
                />
              </div>
              <div className="md:col-span-2">
                <InfoCard label="Company" value={companyName} />
              </div>
              <div className="md:col-span-2">
                <InfoCard
                  label="Shipping address"
                  value={shippingAddress}
                  valueClassName="sm:text-[1.05rem] xl:text-[1.12rem] sm:leading-7 sm:break-words"
                />
              </div>
            </div>
          </div>

          <div className="hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:block sm:rounded-[2rem] sm:p-6">
            <SectionEyebrow text="Trade support" />
            <div className="mt-4 space-y-3">
              <SupportCard
                label="Phone (USA)"
                value={siteSettings.phoneUs}
                href={`tel:${siteSettings.phoneUs.replace(/[^\d+]/g, '')}`}
              />
              <SupportCard
                label="Business email"
                value={siteSettings.email}
                href={`mailto:${siteSettings.email}`}
              />
              <SupportCard
                label="Phone (China)"
                value={siteSettings.phoneChina}
                href={`tel:${siteSettings.phoneChina.replace(/[^\d+]/g, '')}`}
              />
              <SupportCard
                label="Coverage"
                value="Payment follow-up, reorder planning, shipment updates, and trade support."
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
  valueClassName = '',
}: {
  label: string;
  value: string;
  truncate?: boolean;
  compact?: boolean;
  valueClassName?: string;
}) {
  return (
    <div className="min-w-0 max-w-full rounded-[1.25rem] border border-white/10 bg-white/[0.02] px-4 py-3 sm:rounded-[1.5rem] sm:px-5 sm:py-5">
      <p className="text-[12px] text-neutral-400 sm:text-sm">{label}</p>
      <p
        className={`mt-2.5 min-w-0 max-w-full font-medium leading-tight text-white sm:mt-4 ${
          compact ? 'text-[0.84rem] sm:text-2xl' : 'text-[0.96rem] sm:text-2xl'
        } ${truncate ? 'break-all sm:truncate sm:text-lg' : 'break-words'} ${valueClassName}`}
      >
        {value}
      </p>
    </div>
  );
}

function MetricCard({
  label,
  mobileLabel,
  value,
  hint,
}: {
  label: string;
  mobileLabel?: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-[1rem] border border-white/10 bg-gradient-to-b from-white/[0.045] to-black px-2.5 py-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:rounded-[1.2rem] sm:bg-black sm:px-4 sm:py-4 sm:shadow-none">
      <div className="mx-auto mb-2 h-[2px] w-6 rounded-full bg-white/12 sm:hidden" />
      <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-400 sm:text-xs sm:tracking-[0.22em] sm:text-neutral-500">
        <span className="whitespace-nowrap sm:hidden">{mobileLabel || label}</span>
        <span className="hidden sm:inline">{label}</span>
      </p>
      <p className="mt-2 whitespace-nowrap text-[2.15rem] font-semibold leading-none text-white sm:mt-3 sm:text-center sm:text-[2.7rem]">
        {value}
      </p>
      <p className="mt-2 hidden text-center text-[12px] leading-5 text-neutral-500 sm:block">
        {hint}
      </p>
    </div>
  );
}

function StatusPill({
  label,
  tone,
  compact = false,
}: {
  label: string;
  tone: OrderTone;
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
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${toneClasses} ${
        compact ? 'py-0.5 text-[10px]' : ''
      }`}
    >
      {label}
    </span>
  );
}

function SnapshotRow({
  label,
  mobileLabel,
  value,
  mobileValue,
  desktopValue,
}: {
  label: string;
  mobileLabel?: string;
  value: string;
  mobileValue?: string;
  desktopValue?: string;
}) {
  return (
    <div className="grid grid-cols-[auto,1fr] items-center gap-2 rounded-[1rem] border border-white/10 bg-white/[0.03] px-3 py-3 sm:flex sm:items-center sm:justify-between sm:gap-3 sm:px-4">
      <span className="text-xs uppercase tracking-[0.14em] text-neutral-500 sm:max-w-[6rem] sm:text-sm sm:normal-case sm:tracking-normal sm:leading-5 sm:text-neutral-400">
        <span className="sm:hidden">{mobileLabel || label}</span>
        <span className="hidden sm:inline">{label}</span>
      </span>
      <span className="overflow-hidden text-right text-[13px] font-medium leading-5 text-white tabular-nums sm:max-w-[7rem] sm:text-sm">
        <span className="whitespace-nowrap sm:hidden">{mobileValue || value}</span>
        <span className="hidden sm:inline">{desktopValue || value}</span>
      </span>
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

function formatPlacedAt(value: string) {
  return new Date(value).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function getCompactHeadline(value: string) {
  const compactMap: Record<string, string> = {
    'Your order is waiting for payment.': 'Waiting for payment.',
    'Your order has left our warehouse.': 'Order shipped.',
    'Payment is confirmed.': 'Payment confirmed.',
    'This order is complete.': 'Order complete.',
    'This order was cancelled.': 'Order cancelled.',
    'This order was refunded.': 'Order refunded.',
  };

  return compactMap[value] || value;
}
