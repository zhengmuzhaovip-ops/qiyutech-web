import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Button, ButtonLink } from '../components/ui/Button'
import { useCart } from '../context/CartContext'

type ProductItem = {
  id: string
  slug: string
  name: string
  price: number
  image: string
  shortDescription: string
  puffs: string
  badge: string
}

const productList: ProductItem[] = [
  {
    id: 'qiyu-ultra-6000',
    slug: 'qiyu-ultra-6000',
    name: 'QiYu Ultra 6000',
    price: 12.99,
    image: '/images/qiyu-hero.png',
    shortDescription:
      'Premium metallic finish with a smoother draw and stronger shelf presence.',
    puffs: '6000 puffs',
    badge: 'Best Seller',
  },
  {
    id: 'qiyu-mini-4000',
    slug: 'qiyu-mini-4000',
    name: 'QiYu Mini 4000',
    price: 12.99,
    image: '/images/qiyu-products.png',
    shortDescription:
      'Compact disposable vape designed for simpler browsing and faster buying.',
    puffs: '4000 puffs',
    badge: 'Compact Choice',
  },
]

function SmallBadge({ text }: { text: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '8px 12px',
        borderRadius: 999,
        border: '1px solid #262626',
        background: '#111',
        color: '#d9d9d9',
        fontSize: 13,
      }}
    >
      {text}
    </span>
  )
}

export default function ProductsPage() {
  const { addToCart } = useCart()
  const products = useMemo(() => productList, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        color: '#fff',
        padding: '72px 40px 96px',
      }}
    >
      <section
        style={{
          maxWidth: 1320,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            marginBottom: 52,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ maxWidth: 760 }}>
            <p
              style={{
                color: '#8a8a8a',
                letterSpacing: 2,
                fontSize: 12,
                marginBottom: 14,
              }}
            >
              PRODUCT CATALOG
            </p>

            <h1
              style={{
                fontSize: 44,
                lineHeight: 1.1,
                margin: 0,
                marginBottom: 16,
              }}
            >
              A focused collection built for premium presentation and cleaner conversion.
            </h1>

            <p
              style={{
                color: '#a3a3a3',
                fontSize: 16,
                lineHeight: 1.8,
                margin: 0,
                maxWidth: 680,
              }}
            >
              Explore a smaller, more intentional product line designed for US-facing
              product presentation, wholesale inquiries, and direct online ordering.
            </p>
          </div>

          <ButtonLink to="/cart" variant="secondary">
            Go to Cart
          </ButtonLink>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: 28,
          }}
        >
          {products.map((product) => (
            <article
              key={product.id}
              style={{
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)), #111',
                border: '1px solid #222',
                borderRadius: 24,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 640,
                boxShadow: '0 18px 50px rgba(0,0,0,0.28)',
              }}
            >
              <Link
                to={`/products/${product.id}`}
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <div
                  style={{
                    padding: 20,
                    paddingBottom: 0,
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: 18,
                      background: '#0d0d0d',
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: 360,
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />

                    <div
                      style={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                      }}
                    >
                      <SmallBadge text={product.badge} />
                    </div>

                    <div
                      style={{
                        position: 'absolute',
                        right: 16,
                        bottom: 16,
                        padding: '10px 14px',
                        borderRadius: 16,
                        background: 'rgba(0,0,0,0.45)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: '#fff',
                        fontSize: 13,
                      }}
                    >
                      {product.puffs}
                    </div>
                  </div>
                </div>
              </Link>

              <div
                style={{
                  padding: 22,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  flex: 1,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 16,
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: 0,
                        color: '#8d8d8d',
                        fontSize: 12,
                        letterSpacing: 1.5,
                        textTransform: 'uppercase',
                        marginBottom: 8,
                      }}
                    >
                      Featured Product
                    </p>

                    <h2
                      style={{
                        margin: 0,
                        fontSize: 28,
                        lineHeight: 1.15,
                      }}
                    >
                      {product.name}
                    </h2>
                  </div>

                  <div
                    style={{
                      fontSize: 26,
                      fontWeight: 800,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    ${product.price.toFixed(2)}
                  </div>
                </div>

                <p
                  style={{
                    margin: 0,
                    color: '#a5a5a5',
                    fontSize: 15,
                    lineHeight: 1.8,
                  }}
                >
                  {product.shortDescription}
                </p>

                <div
                  style={{
                    display: 'flex',
                    gap: 10,
                    flexWrap: 'wrap',
                  }}
                >
                  <SmallBadge text="US market ready" />
                  <SmallBadge text="Retail & wholesale" />
                  <SmallBadge text="Fast ordering" />
                </div>

                <div
                  style={{
                    marginTop: 'auto',
                    display: 'flex',
                    gap: 10,
                    flexWrap: 'wrap',
                  }}
                >
                  <ButtonLink to={`/products/${product.id}`}>
                    View Details
                  </ButtonLink>

                  <Button
                    variant="secondary"
                    onClick={() =>
                      addToCart({
                        product: {
                          id: product.id,
                          slug: product.slug,
                          name: product.name,
                          tagline: product.puffs,
                          price: product.price,
                          shortDescription: product.shortDescription,
                          description: product.shortDescription,
                          image: product.image,
                          gallery: [product.image],
                          flavors: [],
                          features: [],
                          specs: [],
                        },
                        quantity: 1,
                      })
                    }
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
