import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeFromCart, clearCart } = useCart();

  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid gap-8 lg:grid-cols-[1fr,360px]">
        <section className="rounded-[2rem] border border-white/10 bg-neutral-950 p-6">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <h1 className="text-3xl font-semibold text-white">Cart</h1>
              <p className="mt-2 text-sm text-neutral-400">Keep this screen simple and fast. No clutter, no fake upsells.</p>
            </div>
            {items.length > 0 ? (
              <button onClick={clearCart} className="text-sm text-neutral-400 hover:text-white">
                Clear cart
              </button>
            ) : null}
          </div>

          <div className="mt-6 space-y-4">
            {items.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-white/10 p-8 text-center text-neutral-400">
                Your cart is empty. <Link to="/products" className="text-white underline">Browse products</Link>.
              </div>
            ) : (
              items.map((item) => (
                <article key={item.id} className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-[120px,1fr,120px] sm:items-center">
                  <img src={item.image} alt={item.name} className="aspect-square w-full rounded-2xl object-cover" />
                  <div>
                    <h2 className="text-lg font-medium text-white">{item.name}</h2>
                    {item.selectedFlavor ? <p className="mt-1 text-sm text-neutral-400">Flavor: {item.selectedFlavor}</p> : null}
                    <p className="mt-2 text-sm text-neutral-300">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(event) => updateQuantity(item.id, Number(event.target.value))}
                      className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
                    />
                    <button onClick={() => removeFromCart(item.id)} className="text-sm text-neutral-400 hover:text-white">
                      Remove
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <aside className="h-fit rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-semibold text-white">Order summary</h2>
          <div className="mt-6 space-y-4 text-sm text-neutral-300">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
          </div>
          <div className="mt-6 border-t border-white/10 pt-6">
            <p className="flex items-center justify-between text-lg font-semibold text-white">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </p>
          </div>
          <Link to="/checkout" className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-white bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-neutral-100">
            Continue to checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}
