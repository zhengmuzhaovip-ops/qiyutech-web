import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useCart } from '../context/CartContext';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);

  if (items.length === 0 && !submitted) {
    return <Navigate to="/cart" replace />;
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <div className="rounded-[2rem] border border-white/10 bg-neutral-950 p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">Order placed</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">Thank you for your order.</h1>
          <p className="mt-4 text-neutral-400">
            This page is intentionally simple. Next step is wiring this form to your real order API and success state.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-6 py-20 lg:grid-cols-[1fr,360px]">
      <section className="rounded-[2rem] border border-white/10 bg-neutral-950 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">Checkout</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Shorter path, fewer mistakes.</h1>
        <p className="mt-3 max-w-2xl text-neutral-400">
          The idea is to remove every non-essential field and keep the purchase flow professional and stable.
        </p>

        <form
          className="mt-8 grid gap-5 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            clearCart();
            setSubmitted(true);
          }}
        >
          <label className="block text-sm text-neutral-300">
            Full name
            <input required className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none" />
          </label>
          <label className="block text-sm text-neutral-300">
            Email
            <input type="email" required className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none" />
          </label>
          <label className="block text-sm text-neutral-300 md:col-span-2">
            Company
            <input className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none" />
          </label>
          <label className="block text-sm text-neutral-300 md:col-span-2">
            Shipping address
            <input required className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none" />
          </label>
          <label className="block text-sm text-neutral-300">
            Country
            <input required className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none" />
          </label>
          <label className="block text-sm text-neutral-300">
            Phone
            <input required className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none" />
          </label>
          <label className="block text-sm text-neutral-300 md:col-span-2">
            Notes
            <textarea rows={4} className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none" />
          </label>
          <div className="md:col-span-2">
            <Button type="submit">Submit order</Button>
          </div>
        </form>
      </section>

      <aside className="h-fit rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-xl font-semibold text-white">Summary</h2>
        <div className="mt-6 space-y-4 text-sm text-neutral-300">
          {items.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-3">
              <div>
                <p className="text-white">{item.name}</p>
                <p className="text-neutral-500">Qty {item.quantity}</p>
              </div>
              <p>${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 border-t border-white/10 pt-6">
          <p className="flex items-center justify-between text-lg font-semibold text-white">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </p>
        </div>
      </aside>
    </div>
  );
}
