import { useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { products } from '../data/site';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/Button';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const product = useMemo(() => products.find((item) => item.slug === slug), [slug]);
  const { addToCart } = useCart();
  const [selectedFlavor, setSelectedFlavor] = useState<string | undefined>(product?.flavors[0]);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <Navigate to="/products" replace />;
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1fr,0.9fr]">
      <div className="space-y-4">
        <div className="rounded-[2rem] border border-white/10 bg-neutral-950 p-6">
          <img src={product.image} alt={product.name} className="aspect-square w-full rounded-[1.5rem] object-cover" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {product.gallery.map((image) => (
            <img key={image} src={image} alt={product.name} className="aspect-square rounded-[1.25rem] border border-white/10 object-cover" />
          ))}
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">Product detail</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">{product.name}</h1>
          <p className="mt-3 text-lg text-neutral-300">{product.tagline}</p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-400">{product.description}</p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              {product.compareAtPrice ? (
                <p className="text-sm text-neutral-500 line-through">${product.compareAtPrice.toFixed(2)}</p>
              ) : null}
              <p className="text-3xl font-semibold text-white">${product.price.toFixed(2)}</p>
            </div>
            <p className="text-sm text-neutral-400">Wholesale-ready display copy</p>
          </div>

          <div className="mt-6 space-y-6">
            <div>
              <label htmlFor="flavor" className="text-sm text-neutral-400">Flavor</label>
              <select
                id="flavor"
                value={selectedFlavor}
                onChange={(event) => setSelectedFlavor(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
              >
                {product.flavors.map((flavor) => (
                  <option key={flavor} value={flavor}>
                    {flavor}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="quantity" className="text-sm text-neutral-400">Quantity</label>
              <input
                id="quantity"
                type="number"
                min={1}
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value))}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => addToCart({ product, selectedFlavor, quantity })}
                className="min-w-[180px]"
              >
                Add to cart
              </Button>
              <Button variant="secondary" onClick={() => addToCart({ product, selectedFlavor, quantity })}>
                Buy now later
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-neutral-950 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">Features</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-neutral-300">
              {product.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-neutral-950 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">Specs</p>
            <dl className="mt-4 space-y-3 text-sm text-neutral-300">
              {product.specs.map((spec) => (
                <div key={spec.label} className="flex items-center justify-between gap-4 border-b border-white/5 pb-3">
                  <dt>{spec.label}</dt>
                  <dd className="font-medium text-white">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
