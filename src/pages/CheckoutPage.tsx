import { useEffect, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ButtonLink } from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import type { InvoiceOrderPayload } from '../lib/invoice';

type CheckoutFormState = {
  company: string;
  businessType: string;
  contactName: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  address: string;
  postalCode: string;
  notes: string;
};

type PaymentMethod = 'bank_transfer';

const initialFormState: CheckoutFormState = {
  company: '',
  businessType: '',
  contactName: '',
  email: '',
  phone: '',
  country: 'United States',
  state: '',
  city: '',
  address: '',
  postalCode: '',
  notes: '',
};

export default function CheckoutPage() {
  const { items, subtotal, totalItems, clearCart } = useCart();
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState<CheckoutFormState>(() => ({
    ...initialFormState,
    contactName: user?.name ?? '',
    email: user?.email ?? '',
  }));
  const paymentMethod: PaymentMethod = 'bank_transfer';

  const shippingFee = subtotal >= 150 ? 0 : items.length > 0 ? 18 : 0;
  const estimatedTax = subtotal > 0 ? subtotal * 0.08 : 0;
  const orderTotal = subtotal + shippingFee + estimatedTax;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', {
        replace: true,
        state: { from: location.pathname },
      });
    }
  }, [isLoggedIn, navigate, location.pathname]);

  useEffect(() => {
    if (user) {
      setForm((current) => ({
        ...current,
        contactName: current.contactName || user.name,
        email: current.email || user.email,
      }));
    }
  }, [user]);

  if (!isLoggedIn) {
    return null;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (items.length === 0) {
      return;
    }

    const orderNumber = `QY-${Date.now().toString().slice(-8)}`;
    const placedAt = new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    clearCart();
    navigate('/checkout/success', {
      replace: true,
      state: {
        orderNumber,
        placedAt,
        customer: form.contactName || user?.name || 'Store Purchasing Contact',
        email: form.email || user?.email || '',
        phone: form.phone,
        company: form.company,
        businessType: form.businessType,
        paymentMethod,
        totalItems,
        subtotal,
        shippingFee,
        estimatedTax,
        orderTotal,
        notes: form.notes,
        items: items.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          selectedFlavor: item.selectedFlavor,
        })),
        shippingAddress: {
          country: form.country,
          state: form.state,
          city: form.city,
          address: form.address,
          postalCode: form.postalCode,
        },
      } satisfies InvoiceOrderPayload,
    });
  }

  return (
    <div className="mx-auto max-w-7xl overflow-x-hidden px-4 py-8 sm:px-6 sm:py-20">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-wrap sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-500">
            Wholesale Checkout
          </p>
          <h1 className="mt-3 max-w-none whitespace-nowrap text-[1.42rem] font-semibold leading-[0.98] tracking-[-0.03em] text-white sm:max-w-none sm:text-4xl sm:tracking-tight">
            Review wholesale order.
          </h1>
          <p className="mt-3 max-w-none whitespace-nowrap text-[11px] leading-5 tracking-[-0.01em] text-neutral-400 sm:max-w-xl sm:text-sm sm:leading-6 sm:tracking-normal">
            Confirm details before payment.
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-white/10 bg-white/[0.03] px-4 py-2.5 sm:rounded-[1.25rem] sm:px-4 sm:py-3">
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">Account status</p>
          <div className="mt-2.5 flex items-center gap-2.5 sm:mt-2 sm:gap-3">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400" />
            <span className="text-sm text-white">Trade account access confirmed</span>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-[1.75rem] border border-white/10 bg-neutral-950 p-6 sm:rounded-[2rem] sm:p-8">
          <p className="text-neutral-400">
            Your order review is empty. Add products before submitting a wholesale order.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink to="/products">Review catalog</ButtonLink>
            <ButtonLink to="/cart" variant="secondary">
              Back to order review
            </ButtonLink>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 sm:gap-8 xl:grid-cols-[1.12fr,0.88fr]">
          <form
            id="checkout-form"
            onSubmit={handleSubmit}
            className="min-w-0 rounded-[1.75rem] border border-white/10 bg-neutral-950 p-4 sm:rounded-[2rem] sm:p-7"
          >
            <div className="grid gap-5">
              <section className="rounded-[1.35rem] border border-white/10 bg-white/[0.02] p-4 sm:rounded-[1.5rem] sm:p-5">
                <SectionHeader
                  eyebrow="01"
                  title="Contact information"
                  description="Use one contact for order and shipping."
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Contact name"
                    value={form.contactName}
                    onChange={(value) => setForm((current) => ({ ...current, contactName: value }))}
                    placeholder="Business contact"
                    required
                  />
                  <Field
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(value) => setForm((current) => ({ ...current, email: value }))}
                    placeholder="orders@yourstore.com"
                    required
                  />
                  <Field
                    label="Phone"
                    value={form.phone}
                    onChange={(value) => setForm((current) => ({ ...current, phone: value }))}
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                  <div className="hidden min-w-0 rounded-[1.15rem] border border-white/10 bg-black px-4 py-3 sm:block sm:rounded-[1.25rem]">
                    <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">Account</p>
                    <p className="mt-2 text-sm text-white">
                      {user?.name ?? 'Store Purchasing Contact'}
                    </p>
                    <p className="mt-1 break-all text-sm text-neutral-400 sm:break-words">
                      {user?.email ?? 'No email available'}
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-[1.35rem] border border-white/10 bg-white/[0.02] p-4 sm:rounded-[1.5rem] sm:p-5">
                <SectionHeader
                  eyebrow="02"
                  title="Shipping address"
                  description="Add the delivery address."
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Country"
                    value={form.country}
                    onChange={(value) => setForm((current) => ({ ...current, country: value }))}
                    placeholder="United States"
                    required
                  />
                  <Field
                    label="State"
                    value={form.state}
                    onChange={(value) => setForm((current) => ({ ...current, state: value }))}
                    placeholder="California"
                    required
                  />
                  <Field
                    label="City"
                    value={form.city}
                    onChange={(value) => setForm((current) => ({ ...current, city: value }))}
                    placeholder="Los Angeles"
                    required
                  />
                  <Field
                    label="Postal code"
                    value={form.postalCode}
                    onChange={(value) => setForm((current) => ({ ...current, postalCode: value }))}
                    placeholder="90001"
                    required
                  />
                </div>

                <div className="mt-4">
                  <Field
                    label="Street address"
                    value={form.address}
                    onChange={(value) => setForm((current) => ({ ...current, address: value }))}
                    placeholder="Store, warehouse, or receiving location"
                    required
                  />
                </div>
              </section>

              <details className="rounded-[1.35rem] border border-white/10 bg-white/[0.02] p-4 sm:rounded-[1.5rem] sm:p-5">
                <summary className="flex cursor-pointer list-none flex-col items-start justify-between gap-3 text-left sm:flex-row sm:items-center sm:gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                      03
                    </p>
                    <h2 className="mt-2 max-w-none whitespace-nowrap text-[1.08rem] font-semibold leading-[1.02] tracking-[-0.02em] text-white sm:max-w-none sm:text-xl sm:tracking-normal">
                      Company or reseller details
                    </h2>
                    <p className="mt-2 max-w-none whitespace-nowrap text-[11px] leading-5 tracking-[-0.01em] text-neutral-400 sm:mt-1 sm:max-w-none sm:text-sm sm:leading-6 sm:tracking-normal">
                      Add company or business details.
                    </p>
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-neutral-400 sm:text-xs">
                    Optional
                  </span>
                </summary>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <Field
                    label="Company"
                    value={form.company}
                    onChange={(value) => setForm((current) => ({ ...current, company: value }))}
                    placeholder="Store, distributor, or company name"
                  />
                  <Field
                    label="Business type"
                    value={form.businessType}
                    onChange={(value) => setForm((current) => ({ ...current, businessType: value }))}
                    placeholder="Retail store, distributor, reseller"
                  />
                </div>
              </details>

              <details className="rounded-[1.35rem] border border-white/10 bg-white/[0.02] p-4 sm:rounded-[1.5rem] sm:p-5">
                <summary className="flex cursor-pointer list-none flex-col items-start justify-between gap-3 text-left sm:flex-row sm:items-center sm:gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                      04
                    </p>
                    <h2 className="mt-2 whitespace-nowrap text-[1.12rem] font-semibold leading-[1.02] tracking-[-0.02em] text-white sm:text-xl sm:tracking-normal">
                      Order notes
                    </h2>
                    <p className="mt-2 max-w-none whitespace-nowrap text-[11px] leading-5 tracking-[-0.01em] text-neutral-400 sm:mt-1 sm:max-w-2xl sm:text-sm sm:leading-6 sm:tracking-normal">
                      Add optional delivery or billing notes.
                    </p>
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-neutral-400 sm:text-xs">
                    Optional
                  </span>
                </summary>

                <label className="mt-5 block text-sm text-neutral-300">
                  Notes
                  <textarea
                    value={form.notes}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, notes: event.target.value }))
                    }
                    rows={2}
                    placeholder="Store delivery note or reseller follow-up request"
                    className="mt-2 min-h-[96px] w-full rounded-[1.15rem] border border-white/10 bg-black px-4 py-3 text-white outline-none placeholder:text-neutral-500 sm:min-h-0 sm:rounded-[1.25rem]"
                  />
                </label>
              </details>

              <section className="hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                <SectionHeader
                  eyebrow="Order review"
                  title="Review items before placing the order"
                  description="A tighter summary keeps the final payment-ready step clear."
                />
                <div className="mt-5 space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 border-b border-white/10 pb-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 rounded-2xl object-cover"
                        />
                        <div>
                          <p className="font-medium text-white">{item.name}</p>
                          <p className="mt-1 text-sm text-neutral-400">
                            {item.selectedFlavor ? `${item.selectedFlavor} · ` : ''}Qty {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </form>

          <aside className="min-w-0 rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:h-fit sm:rounded-[2rem] sm:p-6">
            <div className="rounded-[1.35rem] border border-white/10 bg-black/70 p-4 sm:rounded-[1.5rem] sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                Wholesale order summary
              </p>
              <div className="mt-5 space-y-4 text-sm text-neutral-300">
                <Row label="Units" value={String(totalItems)} />
                <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
                <Row
                  label="Shipping"
                  value={shippingFee === 0 ? 'Free shipping' : `$${shippingFee.toFixed(2)}`}
                />
                <Row label="Estimated tax" value={`$${estimatedTax.toFixed(2)}`} />
              </div>
              <div className="mt-6 border-t border-white/10 pt-6">
                <div className="flex items-center justify-between text-[1.95rem] font-semibold leading-none text-white sm:text-xl">
                  <span>Order total</span>
                  <span>${orderTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-5 space-y-3 border-t border-white/10 pt-5">
                {items.slice(0, 2).map((item) => (
                  <div key={item.id} className="grid gap-2.5 text-sm sm:flex sm:items-center sm:justify-between sm:gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-11 w-11 rounded-xl border border-white/10 object-cover sm:h-12 sm:w-12"
                      />
                      <div className="min-w-0">
                        <p className="truncate pr-2 text-[13px] text-white sm:pr-0 sm:text-sm">{item.name}</p>
                        <p className="text-neutral-500">
                          {item.selectedFlavor ? `${item.selectedFlavor} · ` : ''}Qty {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="pl-14 text-[13px] text-neutral-300 sm:pl-0 sm:text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                {items.length > 2 ? (
                  <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                    +{items.length - 2} more items
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-4 rounded-[1.35rem] border border-white/10 bg-black p-4 sm:mt-5 sm:rounded-[1.5rem] sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                Trade account
              </p>
              <p className="mt-3 text-white">{user?.name ?? 'Store Purchasing Contact'}</p>
              <p className="mt-1 break-all text-sm text-neutral-400 sm:break-words">{user?.email ?? 'No email available'}</p>
            </div>

            <div className="mt-4 rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-4 sm:mt-5 sm:rounded-[1.5rem] sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                Payment method
              </p>
              <div className="mt-4 rounded-[1.15rem] border border-white/30 bg-white/[0.05] px-4 py-3 sm:rounded-[1.25rem]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">Bank transfer</p>
                    <p className="mt-1 text-sm leading-6 text-neutral-400">
                      Place the order first, then complete payment offline with the invoice and
                      bank details provided for this order.
                    </p>
                  </div>
                  <span className="mt-1 h-4 w-4 rounded-full border border-white bg-white" />
                </div>
              </div>
              <p className="mt-3 text-xs leading-5 text-neutral-500">
                Credit or debit card payment can be connected later if you want to add an online
                payment link.
              </p>
            </div>

            <div className="mt-4 rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-4 sm:mt-5 sm:rounded-[1.5rem] sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                Order submission
              </p>
              <p className="mt-3 text-sm leading-6 text-neutral-400">
                Place the order to generate the bank-transfer step and prepare the invoice details.
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:mt-6">
              <button
                type="submit"
                form="checkout-form"
                className="inline-flex items-center justify-center rounded-full border border-white bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-neutral-100"
              >
                Place order
              </button>
              <ButtonLink to="/cart" variant="secondary">
                Back to order review
              </ButtonLink>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-4 border-b border-white/10 pb-4">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
        {eyebrow}
      </p>
      <h2 className="mt-2 max-w-none whitespace-nowrap text-[1.12rem] font-semibold leading-[1.02] tracking-[-0.02em] text-white sm:max-w-none sm:text-xl sm:tracking-normal">{title}</h2>
      <p className="mt-2 max-w-none whitespace-nowrap text-[11px] leading-5 tracking-[-0.01em] text-neutral-400 sm:mt-1 sm:max-w-2xl sm:text-sm sm:leading-6 sm:tracking-normal">{description}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block text-sm text-neutral-300">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="mt-2 h-11 w-full min-w-0 rounded-[1.15rem] border border-white/10 bg-black px-4 py-3 text-[15px] text-white outline-none placeholder:text-neutral-500 sm:rounded-[1.25rem]"
      />
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span>{label}</span>
      <span className="text-right text-white">{value}</span>
    </div>
  );
}
