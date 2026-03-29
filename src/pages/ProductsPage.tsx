import { products } from '../data/site';
import { ButtonLink } from '../components/ui/Button';

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">Products</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Focused catalog for faster buying.</h1>
        <p className="mt-4 text-base leading-7 text-neutral-400">
          Instead of burying two products inside a bloated shop, this layout keeps every product easy to compare and easier to order.
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {products.map((product) => (
          <article key={product.id} className="rounded-[2rem] border border-white/10 bg-neutral-950 p-6">
            <img src={product.image} alt={product.name} className="aspect-[16/10] w-full rounded-[1.5rem] object-cover" />
            <div className="mt-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">{product.name}</h2>
                <p className="mt-2 text-sm text-neutral-400">{product.shortDescription}</p>
              </div>
              <div className="text-right">
                {product.compareAtPrice ? (
                  <p className="text-sm text-neutral-500 line-through">${product.compareAtPrice.toFixed(2)}</p>
                ) : null}
                <p className="text-lg font-semibold text-white">${product.price.toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink to={`/products/${product.slug}`} variant="light">
                View details
              </ButtonLink>
              <ButtonLink to="/checkout" variant="secondary">
                Quick checkout
              </ButtonLink>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
