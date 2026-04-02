import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { items, subtotal, totalItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const estimatedShipping = subtotal >= 150 ? 0 : items.length > 0 ? 18 : 0;
  const estimatedTotal = subtotal + estimatedShipping;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-20">
      <div className="grid gap-5 sm:gap-8 lg:grid-cols-[1fr,360px]">
        <section className="rounded-[1.75rem] border border-white/10 bg-neutral-950 p-4 sm:rounded-[2rem] sm:p-6">
          <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-5 sm:items-center sm:gap-4 sm:pb-6">
            <div className="min-w-0">
              <h1 className="text-[2.25rem] font-semibold leading-none text-white sm:text-3xl">
                Order Review
              </h1>
              <p className="mt-3 max-w-[15rem] text-sm leading-8 text-neutral-400 sm:mt-2 sm:max-w-none sm:leading-6">
                Review store quantities, confirm line totals, and move into wholesale checkout.
              </p>
            </div>
            {items.length > 0 ? (
              <button
                onClick={clearCart}
                className="shrink-0 rounded-full border border-white/12 px-3 py-1.5 text-right text-sm leading-5 text-neutral-300 transition hover:border-white/25 hover:text-white sm:border-0 sm:px-0 sm:py-0"
              >
                Clear order
              </button>
            ) : null}
          </div>

          <div className="mt-5 space-y-4 sm:mt-6">
            {items.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-white/10 p-6 text-center text-neutral-400 sm:p-8">
                <p className="mx-auto inline-flex max-w-full items-center gap-1 whitespace-nowrap text-[13px] sm:text-base">
                  <span>Your order review is empty.</span>
                  <Link to="/products" className="text-white underline">
                    Review catalog
                  </Link>
                  <span>.</span>
                </p>
              </div>
            ) : (
              items.map((item) => (
                <article
                  key={item.id}
                  className="grid grid-cols-[96px,1fr] gap-x-4 gap-y-4 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-[120px,1fr,160px] sm:items-center"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-32 w-full rounded-[1.25rem] object-cover sm:aspect-square sm:h-auto sm:rounded-2xl"
                  />
                  <div className="min-w-0 pt-1 sm:pt-0">
                    <h2 className="text-[1.05rem] font-medium leading-tight text-white sm:text-lg">
                      {item.name}
                    </h2>
                    <p className="mt-1 text-sm text-neutral-400">{item.selectedFlavor ?? 'Trade SKU'}</p>
                    <p className="mt-2 text-sm text-neutral-300">${item.price.toFixed(2)}</p>
                    <p className="mt-3 text-sm text-neutral-500 sm:mt-3">
                      <span className="text-neutral-500">Line total </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </p>
                  </div>
                  <div className="col-span-2 grid gap-3 border-t border-white/10 pt-4 sm:col-span-1 sm:border-t-0 sm:pt-0">
                    <div className="flex items-center justify-between gap-3">
                      <label className="block text-xs uppercase tracking-[0.2em] text-neutral-500">
                        Order quantity
                      </label>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="rounded-full border border-white/12 px-3 py-1.5 text-sm text-neutral-300 transition hover:border-white/25 hover:text-white sm:hidden"
                      >
                        Remove item
                      </button>
                    </div>
                    <input
                      type="number"
                      min={1}
                      inputMode="numeric"
                      value={item.quantity}
                      onChange={(event) => updateQuantity(item.id, Number(event.target.value))}
                      className="h-11 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
                    />
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="hidden text-sm text-neutral-400 hover:text-white sm:block"
                    >
                      Remove item
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <aside className="h-fit rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 sm:rounded-[2rem] sm:p-6">
          <h2 className="text-xl font-semibold text-white">Wholesale order summary</h2>
          <div className="mt-5 space-y-4 text-sm text-neutral-300 sm:mt-6">
            <div className="flex items-center justify-between">
              <span>Units</span>
              <span>{totalItems}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Estimated shipping</span>
              <span>{estimatedShipping === 0 ? 'Free' : `$${estimatedShipping.toFixed(2)}`}</span>
            </div>
            <p className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-xs leading-6 text-neutral-400">
              Orders above $150 qualify for free estimated shipping. Final delivery and tax are
              confirmed during order submission.
            </p>
          </div>
          <div className="mt-5 border-t border-white/10 pt-5 sm:mt-6 sm:pt-6">
            <p className="flex items-center justify-between text-lg font-semibold text-white">
              <span>Estimated total</span>
              <span>${estimatedTotal.toFixed(2)}</span>
            </p>
          </div>
          {items.length > 0 ? (
            <Link
              to="/checkout"
              className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-white bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-neutral-100 sm:mt-6"
            >
              Continue to checkout
            </Link>
          ) : (
            <Link
              to="/products"
              className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white transition hover:border-white/40 sm:mt-6"
            >
              Back to catalog
            </Link>
          )}
          <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-neutral-950 px-4 py-4 text-sm text-neutral-400 sm:mt-6">
            Wholesale checkout remains protected by login and will return trade accounts to
            `/checkout` after authentication.
          </div>
        </aside>
      </div>
    </div>
  );
}
