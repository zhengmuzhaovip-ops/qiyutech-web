import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, ButtonLink } from '../components/ui/Button'
import StableImage from '../components/ui/StableImage'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { wholesaleProducts } from '../data/wholesaleProducts'
import { fetchPublicCatalog, type PublicProduct, type PublicSeries } from '../lib/catalog'

function SmallBadge({ text }: { text: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '7px 11px',
        borderRadius: 999,
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.03)',
        color: '#e7e7e7',
        fontSize: 11,
        letterSpacing: 0.3,
      }}
    >
      {text}
    </span>
  )
}

function getCatalogFrameImage(slug: string) {
  if (slug === 'qiyu-ultra-6000') {
    return '/images/catalog-geek-bar-pulse-x-pear-of-thieves-4x3.png'
  }

  if (slug === 'qiyu-mini-4000') {
    return '/images/catalog-geek-bar-pulse-x-raspberry-peach-lime-4x3.png'
  }

  return null
}

function buildFallbackSeries(): PublicSeries[] {
  return [
    {
      id: 'fallback-geek-bar-pulse-x-series',
      slug: 'geek-bar-pulse-x-series',
      eyebrow: 'Wholesale Series',
      title: 'GEEK BAR PULSE X Series',
      description: 'Shelf-ready wholesale SKUs built for repeat retail ordering.',
      sortOrder: 0,
      productCount: wholesaleProducts.length,
      products: wholesaleProducts.map((product, index) => ({
        ...product,
        basePrice: product.price,
        hasCustomPrice: false,
        seriesId: 'fallback-geek-bar-pulse-x-series',
        seriesTitle: 'GEEK BAR PULSE X Series',
        seriesEyebrow: 'Wholesale Series',
        sortOrder: index,
      })),
    },
  ]
}

function CatalogProductCard({
  product,
  isMobile,
  onAdd,
  prioritizeImage = false,
}: {
  product: PublicProduct
  isMobile: boolean
  onAdd: (product: PublicProduct) => void
  prioritizeImage?: boolean
}) {
  const isOutOfStock = product.stock <= 0
  const pricingLabel = product.hasCustomPrice ? 'Your Price' : 'Price'
  const showBasePrice = product.hasCustomPrice && product.basePrice > product.price

  return (
    <article
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 32,
        border: '1px solid rgba(255,255,255,0.08)',
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.018) 42%, rgba(255,255,255,0.02) 100%), #101010',
        display: 'flex',
        flexDirection: 'column',
        minHeight: isMobile ? 'auto' : 700,
        boxShadow: '0 20px 56px rgba(0,0,0,0.24)',
      }}
    >
      <Link
        to={`/products/${product.slug}`}
        state={{ productPreview: product }}
        style={{
          display: 'block',
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        <div
          style={{
            position: 'relative',
            padding: isMobile ? 14 : 20,
            paddingBottom: 0,
          }}
        >
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 26,
              background:
                'radial-gradient(circle at top, rgba(255,255,255,0.1), transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01)), #0d0d0d',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 10,
                borderRadius: 20,
                border: '1px solid rgba(255,255,255,0.05)',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            />
            <StableImage
              src={getCatalogFrameImage(product.slug) || product.image}
              alt={product.name}
              loading={prioritizeImage ? 'eager' : 'lazy'}
              fetchPriority={prioritizeImage ? 'high' : 'auto'}
              decoding="async"
              containerStyle={{
                borderRadius: 26,
              }}
              placeholderStyle={{
                borderRadius: 26,
                background:
                  'radial-gradient(circle at 50% 18%, rgba(255,255,255,0.16), transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02) 34%, rgba(10,10,10,0.5) 100%), #111111',
              }}
              style={{
                width: '100%',
                height: isMobile ? 260 : 400,
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
                filter: 'saturate(0.9) contrast(1.04)',
                transform: 'scale(1.01)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: isMobile ? 12 : 18,
                right: isMobile ? 12 : 18,
                zIndex: 2,
              }}
            >
              <SmallBadge text={product.badge} />
            </div>
            <div
              style={{
                position: 'absolute',
                right: isMobile ? 12 : 18,
                bottom: isMobile ? 12 : 18,
                padding: isMobile ? '8px 12px' : '10px 14px',
                borderRadius: 18,
                background: 'rgba(0,0,0,0.38)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#fff',
                fontSize: isMobile ? 11 : 12,
                letterSpacing: 0.3,
                zIndex: 2,
              }}
            >
              {product.flavor}
            </div>
          </div>
        </div>

        <div
          style={{
            padding: isMobile ? '18px 16px 16px' : 26,
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? 12 : 14,
            flex: 1,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 16,
              paddingBottom: isMobile ? 12 : 16,
              borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  marginBottom: isMobile ? 10 : 12,
                  color: '#8d8d8d',
                  fontSize: isMobile ? 11 : 12,
                  letterSpacing: 1.7,
                  textTransform: 'uppercase',
                }}
              >
                Wholesale Item
              </p>
              <h2
                style={{
                  margin: 0,
                  fontSize: isMobile ? 20 : 24,
                  lineHeight: 1.04,
                  letterSpacing: isMobile ? -0.4 : -0.6,
                }}
              >
                {product.shortName}
              </h2>
              <p
                style={{
                  margin: 0,
                  marginTop: 6,
                  color: '#f3f3f3',
                  fontSize: isMobile ? 16 : 18,
                  lineHeight: 1.15,
                  fontWeight: 500,
                }}
              >
                {product.flavor}
              </p>
            </div>
            <div
              style={{
                padding: isMobile ? '8px 12px' : '10px 14px',
                borderRadius: 18,
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.02)',
                minWidth: isMobile ? 92 : 110,
                textAlign: 'right',
                flexShrink: 0,
              }}
            >
              <p
                style={{
                  margin: 0,
                  marginBottom: 6,
                  color: '#8f8f8f',
                  fontSize: isMobile ? 10 : 11,
                  letterSpacing: 0.4,
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                {pricingLabel}
              </p>
              <div
                style={{
                  fontSize: isMobile ? 18 : 21,
                  lineHeight: 1,
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                }}
              >
                ${product.price.toFixed(2)}
              </div>
              {showBasePrice ? (
                <div
                  style={{
                    marginTop: 6,
                    color: '#7d7d7d',
                    fontSize: isMobile ? 10 : 11,
                    whiteSpace: 'nowrap',
                    textDecoration: 'line-through',
                  }}
                >
                  ${product.basePrice.toFixed(2)}
                </div>
              ) : null}
            </div>
          </div>

          <p
            style={{
              margin: 0,
              color: '#a1a1a1',
              fontSize: isMobile ? 12 : 13,
              lineHeight: 1.75,
              maxWidth: isMobile ? 'none' : 460,
            }}
          >
            {product.shortDescription}
          </p>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', opacity: 0.92 }}>
            <SmallBadge text="Wholesale pricing" />
            <SmallBadge text="Shelf-ready" />
          </div>
        </div>
      </Link>

      <div
        style={{
          marginTop: 'auto',
          padding: isMobile ? '0 16px 16px' : '0 26px 26px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
        }}
      >
        <ButtonLink to={`/products/${product.slug}`} state={{ productPreview: product }} variant="secondary">
          Review Product
        </ButtonLink>
        <Button
          onClick={() => onAdd(product)}
          disabled={isOutOfStock}
          className="disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Order'}
        </Button>
      </div>
    </article>
  )
}

export default function ProductsPage() {
  const { token } = useAuth()
  const { addToCart } = useCart()
  const fallbackSeries = useMemo(() => buildFallbackSeries(), [])
  const [catalogSeries, setCatalogSeries] = useState<PublicSeries[]>(fallbackSeries)
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === 'undefined' ? 1440 : window.innerWidth,
  )

  useEffect(() => {
    let active = true

    fetchPublicCatalog(token)
      .then((series) => {
        if (active && series.length) {
          setCatalogSeries(series)
        }
      })
      .catch(() => {
        // Keep fallback when the backend catalog is not ready.
      })

    return () => {
      active = false
    }
  }, [token])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const handleResize = () => {
      setViewportWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = viewportWidth <= 768

  function handleAdd(product: PublicProduct) {
    if (product.stock <= 0) {
      return
    }

    addToCart({
      product: {
        id: product.id,
        slug: product.slug,
        name: product.shortName,
        tagline: product.flavor,
        price: product.price,
        compareAtPrice: product.hasCustomPrice ? product.basePrice : undefined,
        shortDescription: product.shortDescription,
        description: product.description,
        image: product.image,
        gallery: product.gallery,
        flavors: [product.flavor],
        features: product.highlights,
        specs: product.specs
          .map((spec) => ({ label: spec.label || '', value: spec.value || '' }))
          .filter((spec) => spec.label && spec.value),
      },
      selectedFlavor: product.flavor,
    })
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top, rgba(255,255,255,0.06), transparent 20%), linear-gradient(180deg, #0a0a0a 0%, #070707 100%)',
        color: '#fff',
        padding: isMobile ? '16px 16px 36px' : '72px 40px 96px',
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
            marginBottom: isMobile ? 20 : 46,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'center' : 'flex-end',
            gap: isMobile ? 14 : 24,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ maxWidth: 820 }}>
            <p
              style={{
                color: '#8a8a8a',
                letterSpacing: 2.2,
                fontSize: 12,
                marginBottom: isMobile ? 8 : 14,
                textTransform: 'uppercase',
              }}
            >
              Wholesale Catalog
            </p>

            <h1
              style={{
                fontSize: isMobile ? 34 : 48,
                lineHeight: isMobile ? 1 : 1.04,
                letterSpacing: isMobile ? -1 : -1.6,
                margin: 0,
                marginBottom: isMobile ? 10 : 16,
                maxWidth: isMobile ? 320 : 'none',
              }}
            >
              A refined catalog for retail supply.
            </h1>

            <p
              style={{
                color: '#a3a3a3',
                fontSize: isMobile ? 14 : 15,
                lineHeight: isMobile ? 1.7 : 1.8,
                margin: 0,
                maxWidth: isMobile ? 320 : 620,
              }}
            >
              Wholesale-ready products for U.S. retail partners, presented with a cleaner evaluation view.
            </p>
          </div>

          <div style={{ marginLeft: isMobile ? 'auto' : 0, marginTop: isMobile ? -12 : 0 }}>
            <ButtonLink to="/cart" variant="secondary">
              Review Order
            </ButtonLink>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(440px, 1fr))',
            gap: isMobile ? 18 : 30,
          }}
        >
          {catalogSeries.map((series) => (
            <div key={series.id} style={{ display: 'contents' }}>
              <div
                style={{
                  gridColumn: '1 / -1',
                  borderRadius: 28,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015)), #111111',
                  padding: isMobile ? '14px 14px 12px' : '18px 24px',
                  boxShadow: '0 16px 44px rgba(0,0,0,0.18)',
                }}
              >
                <div style={{ display: 'grid', gap: 10 }}>
                  <p
                    style={{
                      margin: 0,
                      color: '#8b8b8b',
                      fontSize: 12,
                      letterSpacing: 1.8,
                      textTransform: 'uppercase',
                    }}
                  >
                    {series.eyebrow}
                  </p>

                  <h2 style={{ margin: 0, fontSize: 32, lineHeight: 1.05 }}>
                    <span style={{ fontSize: isMobile ? 21 : 32, lineHeight: isMobile ? 1.08 : 1.05 }}>
                      {series.title}
                    </span>
                  </h2>

                  <p
                    style={{
                      margin: 0,
                      maxWidth: isMobile ? 320 : 640,
                      color: '#b1b1b1',
                      fontSize: isMobile ? 13 : 16,
                      lineHeight: isMobile ? 1.55 : 1.65,
                    }}
                  >
                    {series.description}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    flexWrap: 'wrap',
                    marginTop: isMobile ? 12 : 16,
                  }}
                >
                  <SmallBadge text={series.eyebrow} />
                  <SmallBadge text={`${series.products.length} SKU${series.products.length === 1 ? '' : 's'}`} />
                  <SmallBadge text="Shelf-ready" />
                </div>
              </div>

              {series.products.map((product, index) => (
                <CatalogProductCard
                  key={product.id}
                  product={product}
                  isMobile={isMobile}
                  onAdd={handleAdd}
                  prioritizeImage={index < 2}
                />
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
