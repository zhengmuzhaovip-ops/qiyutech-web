import { Link } from 'react-router-dom';
import { products, siteSettings } from '../data/site';
import SectionHeading from '../components/ui/SectionHeading';
import { ButtonLink } from '../components/ui/Button';

const featuredProducts = products.filter((product) => product.isFeatured);

export default function HomePage() {
  return (
    <div>
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_35%),linear-gradient(180deg,#101010_0%,#000_60%)]">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr,0.9fr] lg:items-center lg:py-28">
          <div className="space-y-8">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">Wholesale-focused storefront</p>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {siteSettings.heroTitle}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-neutral-300 sm:text-lg">
                {siteSettings.heroSubtitle}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <ButtonLink to={siteSettings.heroPrimaryCtaHref}>{siteSettings.heroPrimaryCtaLabel}</ButtonLink>
              <ButtonLink to={siteSettings.heroSecondaryCtaHref} variant="secondary">
                {siteSettings.heroSecondaryCtaLabel}
              </ButtonLink>
            </div>

            <ul className="grid gap-3 sm:grid-cols-3">
              {siteSettings.featureBullets.map((item) => (
                <li key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-neutral-300">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/40">
            <div className="rounded-[1.5rem] border border-white/10 bg-gradient-to-b from-neutral-900 to-neutral-950 p-6">
              <img
                src={featuredProducts[0]?.image}
                alt={featuredProducts[0]?.name}
                className="mx-auto aspect-[4/3] w-full max-w-md rounded-[1.5rem] object-cover"
              />
              <div className="mt-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Featured product</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{featuredProducts[0]?.name}</p>
                  <p className="mt-2 text-sm text-neutral-400">{featuredProducts[0]?.shortDescription}</p>
                </div>
                <p className="text-lg font-semibold text-white">${featuredProducts[0]?.price.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Core products"
            title="Two flagship products. Clear buying path."
            description="The front page should feel like a premium product site, not an overloaded marketplace."
          />
          <Link to="/products" className="hidden text-sm text-neutral-400 hover:text-white md:block">
            View all products
          </Link>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {featuredProducts.map((product) => (
            <article key={product.id} className="overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-950">
              <div className="border-b border-white/10 bg-white/[0.03] p-6">
                <img src={product.image} alt={product.name} className="aspect-[16/10] w-full rounded-[1.5rem] object-cover" />
              </div>
              <div className="space-y-4 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-white">{product.name}</h3>
                    <p className="mt-2 text-sm text-neutral-400">{product.tagline}</p>
                  </div>
                  <p className="text-lg font-semibold text-white">${product.price.toFixed(2)}</p>
                </div>
                <ul className="space-y-2 text-sm text-neutral-300">
                  {product.features.map((feature) => (
                    <li key={feature}>• {feature}</li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3 pt-2">
                  <ButtonLink to={`/products/${product.slug}`} variant="light">
                    View details
                  </ButtonLink>
                  <ButtonLink to="/cart" variant="secondary">
                    Go to cart
                  </ButtonLink>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            eyebrow="Why this redesign"
            title="A small catalog should feel more premium, not more empty."
            description="This structure removes the fake marketplace feeling and turns the site into a professional product storefront with a short path to order."
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {['Sharper first impression', 'Less clutter in checkout', 'Easier content changes later'].map((item) => (
              <div key={item} className="rounded-[1.5rem] border border-white/10 bg-black px-5 py-6 text-sm text-neutral-300">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
