import { useEffect, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ButtonLink } from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

type CheckoutFormState = {
  company: string;
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

const initialFormState: CheckoutFormState = {
  company: '',
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
        customer: form.contactName || user?.name || 'Demo Buyer',
        email: form.email || user?.email || '',
        company: form.company,
        totalItems,
        subtotal,
        shippingFee,
        estimatedTax,
        orderTotal,
      },
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-10 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-500">
          Secure Checkout
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
          Complete the order without breaking the buying flow.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-400">
          This stage stays login-protected, keeps the demo account flow intact, and is ready
          for future payment and order API integration.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-[2rem] border border-white/10 bg-neutral-950 p-8">
          <p className="text-neutral-400">Your cart is empty. Add products before entering checkout.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink to="/products">Browse products</ButtonLink>
            <ButtonLink to="/cart" variant="secondary">
              Back to cart
            </ButtonLink>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 xl:grid-cols-[1.15fr,0.85fr]">
          <form
            id="checkout-form"
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-white/10 bg-neutral-950 p-6 sm:p-8"
          >
            <div className="grid gap-8">
              <section>
                <div className="mb-5 flex items-center justify-between gap-4 border-b border-white/10 pb-5">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">Shipping details</h2>
                    <p className="mt-2 text-sm text-neutral-400">
                      Keep the form practical for retail orders and future wholesale follow-up.
                    </p>
                  </div>
                  <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-emerald-300">
                    Logged in
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Company"
                    value={form.company}
                    onChange={(value) => setForm((current) => ({ ...current, company: value }))}
                    placeholder="Optional for retail, useful for wholesale"
                  />
                  <Field
                    label="Contact name"
                    value={form.contactName}
                    onChange={(value) => setForm((current) => ({ ...current, contactName: value }))}
                    placeholder="Buyer contact"
                    required
                  />
                  <Field
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(value) => setForm((current) => ({ ...current, email: value }))}
                    placeholder="buyer@example.com"
                    required
                  />
                  <Field
                    label="Phone"
                    value={form.phone}
                    onChange={(value) => setForm((current) => ({ ...current, phone: value }))}
                    placeholder="+1 (555) 000-0000"
                    required
                  />
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
                    placeholder="Warehouse, store, or residential address"
                    required
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm text-neutral-300">
                    Order notes
                    <textarea
                      value={form.notes}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, notes: event.target.value }))
                      }
                      rows={4}
                      placeholder="Flavor preferences, delivery timing, or wholesale follow-up notes"
                      className="mt-2 w-full rounded-[1.25rem] border border-white/10 bg-black px-4 py-3 text-white outline-none placeholder:text-neutral-500"
                    />
                  </label>
                </div>
              </section>

              <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
                <h3 className="text-lg font-semibold text-white">Order review</h3>
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
                            Qty {item.quantity}
                            {item.selectedFlavor ? ` • ${item.selectedFlavor}` : ''}
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

          <aside className="h-fit rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-2xl font-semibold text-white">Checkout panel</h2>
            <div className="mt-6 space-y-4 text-sm text-neutral-300">
              <Row label="Units" value={String(totalItems)} />
              <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
              <Row
                label="Shipping"
                value={shippingFee === 0 ? 'Free shipping' : `$${shippingFee.toFixed(2)}`}
              />
              <Row label="Estimated tax" value={`$${estimatedTax.toFixed(2)}`} />
            </div>
            <div className="mt-6 border-t border-white/10 pt-6">
              <div className="flex items-center justify-between text-lg font-semibold text-white">
                <span>Order total</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-neutral-950 p-4 text-sm leading-7 text-neutral-400">
              Buyers must be logged in before checkout. Payment is still demo-mode, but the
              page now collects shipping info and finishes on a dedicated success state.
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                Account snapshot
              </p>
              <p className="mt-3 text-white">{user?.name ?? 'Demo Buyer'}</p>
              <p className="mt-1 text-sm text-neutral-400">{user?.email ?? 'No email available'}</p>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="submit"
                form="checkout-form"
                className="inline-flex items-center justify-center rounded-full border border-white bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-neutral-100"
              >
                Place demo order
              </button>
              <ButtonLink to="/cart" variant="secondary">
                Back to cart
              </ButtonLink>
            </div>
          </aside>
        </div>
      )}
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
        className="mt-2 w-full rounded-[1.25rem] border border-white/10 bg-black px-4 py-3 text-white outline-none placeholder:text-neutral-500"
      />
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span>{label}</span>
      <span className="text-right text-white">{value}</span>
    </div>
  );
}
