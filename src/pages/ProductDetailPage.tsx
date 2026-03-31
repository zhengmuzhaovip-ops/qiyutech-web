import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { useCart } from '../context/CartContext'

type ProductDetail = {
  id: string
  slug: string
  name: string
  price: number
  image: string
  gallery: string[]
  description: string
  puffs: string
  specs: Array<{ label: string; value: string }>
  highlights: string[]
  flavors: string[]
}

const ultraProduct: ProductDetail = {
  id: 'qiyu-ultra-6000',
  slug: 'qiyu-ultra-6000',
  name: 'QiYu Ultra 6000',
  price: 12.99,
  image: '/images/qiyu-hero.png',
  gallery: [
    '/images/qiyu-hero.png',
    '/images/qiyu-products.png',
    '/images/qiyu-hero.png',
  ],
  description:
    'QiYu Ultra 6000 is designed for a cleaner product presentation and a more premium buying experience. It combines stronger visual identity with practical everyday performance for a modern disposable vape line.',
  puffs: '6000 puffs',
  highlights: [
    'Smooth draw and premium finish',
    'Built for focused wholesale presentation',
    'Cleaner buying path for faster conversion',
  ],
  flavors: ['Blue Razz', 'Mint Ice', 'Strawberry', 'Watermelon'],
  specs: [
    { label: 'Puffs', value: '6000' },
    { label: 'Battery', value: 'Rechargeable' },
    { label: 'Product Type', value: 'Disposable Vape' },
    { label: 'Market', value: 'US Retail & Wholesale' },
  ],
}

const miniProduct: ProductDetail = {
  id: 'qiyu-mini-4000',
  slug: 'qiyu-mini-4000',
  name: 'QiYu Mini 4000',
  price: 12.99,
  image: '/images/qiyu-products.png',
  gallery: [
    '/images/qiyu-products.png',
    '/images/qiyu-hero.png',
    '/images/qiyu-products.png',
  ],
  description:
    'QiYu Mini 4000 offers a more compact option while keeping a clean premium presentation. It suits a smaller product catalog with a simpler choice structure for customers.',
  puffs: '4000 puffs',
  highlights: [
    'Compact and easier to browse',
    'Suitable for a smaller catalog',
    'Consistent storefront presentation',
  ],
  flavors: ['Peach Ice', 'Grape', 'Cola', 'Mango'],
  specs: [
    { label: 'Puffs', value: '4000' },
    { label: 'Battery', value: 'Integrated' },
    { label: 'Product Type', value: 'Disposable Vape' },
    { label: 'Market', value: 'US Retail & Wholesale' },
  ],
}

const qtyButtonStyle: React.CSSProperties = {
  width: 46,
  height: 46,
  border: 'none',
  background: '#111',
  color: '#fff',
  cursor: 'pointer',
  fontSize: 18,
}

function InfoCard({
  title,
  value,
  description,
}: {
  title: string
  value: string
  description: string
}) {
  return (
    <div
      style={{
        background: '#111',
        border: '1px solid #222',
        borderRadius: 20,
        padding: 22,
        minHeight: 260,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}
    >
      <p
        style={{
          marginTop: 0,
          marginBottom: 10,
          color: '#8d8d8d',
          fontSize: 12,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
        }}
      >
        {title}
      </p>

      <h3 style={{ marginTop: 0, marginBottom: 12, fontSize: 24 }}>{value}</h3>

      <p style={{ margin: 0, color: '#a5a5a5', lineHeight: 1.7 }}>{description}</p>
    </div>
  )
}

function MiniBadge({ text }: { text: string }) {
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

export default function ProductDetailPage() {
  const { id } = useParams()
  const { addToCart } = useCart()

  const product = useMemo(() => {
    const slug = (id || '').toLowerCase()
    if (slug.includes('mini')) return miniProduct
    if (slug.includes('ultra')) return ultraProduct
    return ultraProduct
  }, [id])

  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState<string | null>(null)

  const currentImage = activeImage || product.image

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        color: '#fff',
        padding: '72px 40px 96px',
      }}
    >
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.05fr 0.95fr',
            gap: 40,
            alignItems: 'start',
          }}
        >
          <div>
            <div
              style={{
                background:
                  'radial-gradient(circle at top right, rgba(255,255,255,0.09), transparent 35%), #111',
                border: '1px solid #222',
                borderRadius: 28,
                padding: 22,
                marginBottom: 16,
                boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
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
                  src={currentImage}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: 680,
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />

                <div
                  style={{
                    position: 'absolute',
                    left: 20,
                    right: 20,
                    bottom: 20,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    gap: 16,
                    flexWrap: 'wrap',
                  }}
                >
                  <div
                    style={{
                      padding: '12px 14px',
                      borderRadius: 16,
                      background: 'rgba(0,0,0,0.48)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        marginBottom: 6,
                        color: '#a7a7a7',
                        fontSize: 11,
                        letterSpacing: 1.5,
                        textTransform: 'uppercase',
                      }}
                    >
                      Featured Visual
                    </p>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{product.name}</div>
                  </div>

                  <div
                    style={{
                      padding: '12px 14px',
                      borderRadius: 16,
                      background: 'rgba(0,0,0,0.48)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      textAlign: 'right',
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        marginBottom: 6,
                        color: '#a7a7a7',
                        fontSize: 11,
                        letterSpacing: 1.5,
                        textTransform: 'uppercase',
                      }}
                    >
                      Product Type
                    </p>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>Disposable Vape</div>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 12,
              }}
            >
              {product.gallery.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  style={{
                    border:
                      currentImage === image ? '1px solid #fff' : '1px solid #222',
                    background: '#111',
                    borderRadius: 16,
                    padding: 8,
                    cursor: 'pointer',
                    transition: '0.25s',
                  }}
                >
                  <img
                    src={image}
                    alt={`${product.name} preview ${index + 1}`}
                    style={{
                      width: '100%',
                      height: 120,
                      objectFit: 'cover',
                      borderRadius: 10,
                      display: 'block',
                    }}
                  />
                </button>
              ))}
            </div>

            <div
              style={{
                marginTop: 28,
                display: 'grid',
                gridTemplateColumns: '1.2fr 0.8fr',
                gap: 18,
              }}
            >
              <div
                style={{
                  padding: 26,
                  background: '#111',
                  border: '1px solid #222',
                  borderRadius: 22,
                }}
              >
                <h3 style={{ marginTop: 0, marginBottom: 12, fontSize: 24 }}>
                  Product Story
                </h3>

                <p
                  style={{
                    color: '#a5a5a5',
                    lineHeight: 1.8,
                    marginTop: 0,
                    marginBottom: 0,
                  }}
                >
                  This section is ideal for future marketing copy: flavor experience,
                  material finish, battery convenience, or positioning for the US
                  market. It helps this page feel less like a template and more like
                  a commercial landing page.
                </p>
              </div>

              <div
                style={{
                  padding: 26,
                  background: '#111',
                  border: '1px solid #222',
                  borderRadius: 22,
                }}
              >
                <p
                  style={{
                    marginTop: 0,
                    marginBottom: 10,
                    color: '#8d8d8d',
                    fontSize: 12,
                    letterSpacing: 1.5,
                    textTransform: 'uppercase',
                  }}
                >
                  Quick Notes
                </p>

                <div
                  style={{
                    display: 'grid',
                    gap: 12,
                    color: '#d6d6d6',
                    fontSize: 14,
                  }}
                >
                  <div>• Premium storefront visual</div>
                  <div>• Built for US-focused product pages</div>
                  <div>• Ready for future single-product photography</div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              position: 'sticky',
              top: 92,
            }}
          >
            <div
              style={{
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01)), #111',
                border: '1px solid #222',
                borderRadius: 28,
                padding: 28,
                boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
              }}
            >
              <p
                style={{
                  color: '#8d8d8d',
                  letterSpacing: 2,
                  fontSize: 12,
                  marginBottom: 14,
                }}
              >
                {product.puffs.toUpperCase()}
              </p>

              <h1
                style={{
                  fontSize: 46,
                  lineHeight: 1.08,
                  margin: 0,
                  marginBottom: 14,
                }}
              >
                {product.name}
              </h1>

              <p
                style={{
                  color: '#a5a5a5',
                  fontSize: 16,
                  lineHeight: 1.8,
                  marginTop: 0,
                  marginBottom: 22,
                }}
              >
                {product.description}
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  flexWrap: 'wrap',
                  marginBottom: 24,
                }}
              >
                <MiniBadge text="Premium finish" />
                <MiniBadge text="US market ready" />
                <MiniBadge text="Fast ordering" />
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  gap: 16,
                  marginBottom: 24,
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      color: '#7f7f7f',
                      fontSize: 13,
                      marginBottom: 6,
                    }}
                  >
                    Unit Price
                  </p>
                  <div
                    style={{
                      fontSize: 38,
                      fontWeight: 800,
                      lineHeight: 1,
                    }}
                  >
                    ${product.price.toFixed(2)}
                  </div>
                </div>

                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: 14,
                    background: '#0d0d0d',
                    border: '1px solid #1d1d1d',
                    color: '#d0d0d0',
                    fontSize: 13,
                  }}
                >
                  MOQ / wholesale pricing can be configured later
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: 14,
                  alignItems: 'center',
                  marginBottom: 18,
                  flexWrap: 'wrap',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #222',
                    borderRadius: 14,
                    overflow: 'hidden',
                    background: '#111',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    style={qtyButtonStyle}
                  >
                    -
                  </button>

                  <div
                    style={{
                      minWidth: 56,
                      textAlign: 'center',
                      fontWeight: 600,
                    }}
                  >
                    {quantity}
                  </div>

                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => prev + 1)}
                    style={qtyButtonStyle}
                  >
                    +
                  </button>
                </div>

                <Button
                  onClick={() =>
                    addToCart({
                      product: {
                        id: product.id,
                        slug: product.slug,
                        name: product.name,
                        tagline: product.puffs,
                        price: product.price,
                        shortDescription: product.description,
                        description: product.description,
                        image: product.image,
                        gallery: product.gallery,
                        flavors: product.flavors,
                        features: product.highlights,
                        specs: product.specs,
                      },
                      quantity,
                    })
                  }
                >
                  Add to Cart
                </Button>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  flexWrap: 'wrap',
                  marginBottom: 24,
                }}
              >
                <button
                  type="button"
                  style={{
                    height: 46,
                    padding: '0 18px',
                    borderRadius: 999,
                    border: '1px solid #2a2a2a',
                    background: 'transparent',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: 14,
                  }}
                >
                  Request Wholesale
                </button>

                <button
                  type="button"
                  style={{
                    height: 46,
                    padding: '0 18px',
                    borderRadius: 999,
                    border: '1px solid #2a2a2a',
                    background: 'transparent',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: 14,
                  }}
                >
                  Contact Sales
                </button>
              </div>

              <div
                style={{
                  padding: 18,
                  background: '#0d0d0d',
                  border: '1px solid #1d1d1d',
                  borderRadius: 18,
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 12,
                      color: '#d6d6d6',
                      fontSize: 14,
                    }}
                  >
                    <span style={{ color: '#8d8d8d' }}>Checkout Logic</span>
                    <span>Login required at checkout</span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 12,
                      color: '#d6d6d6',
                      fontSize: 14,
                    }}
                  >
                    <span style={{ color: '#8d8d8d' }}>Market</span>
                    <span>US retail & wholesale</span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 12,
                      color: '#d6d6d6',
                      fontSize: 14,
                    }}
                  >
                    <span style={{ color: '#8d8d8d' }}>Support</span>
                    <span>Email / WhatsApp ready</span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gap: 12,
                  marginBottom: 26,
                }}
              >
                {product.highlights.map((item) => (
                  <div
                    key={item}
                    style={{
                      padding: '14px 16px',
                      border: '1px solid #222',
                      background: '#0e0e0e',
                      borderRadius: 14,
                      color: '#d8d8d8',
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div
                style={{
                  padding: 22,
                  background: '#0d0d0d',
                  border: '1px solid #1d1d1d',
                  borderRadius: 18,
                  marginBottom: 22,
                }}
              >
                <h3 style={{ marginTop: 0, marginBottom: 14, fontSize: 20 }}>
                  Available Flavors
                </h3>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 10,
                  }}
                >
                  {product.flavors.map((flavor) => (
                    <MiniBadge key={flavor} text={flavor} />
                  ))}
                </div>
              </div>

              <div
                style={{
                  padding: 24,
                  background: '#0d0d0d',
                  border: '1px solid #1d1d1d',
                  borderRadius: 20,
                }}
              >
                <h3 style={{ marginTop: 0, marginBottom: 16, fontSize: 22 }}>
                  Specifications
                </h3>

                <div
                  style={{
                    display: 'grid',
                    gap: 12,
                  }}
                >
                  {product.specs.map((spec) => (
                    <div
                      key={spec.label}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 20,
                        paddingBottom: 12,
                        borderBottom: '1px solid #1f1f1f',
                      }}
                    >
                      <span style={{ color: '#8d8d8d' }}>{spec.label}</span>
                      <span style={{ fontWeight: 600 }}>{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 80 }}>
          <h2 style={{ fontSize: 30, marginBottom: 20 }}>Video & Asset Slots</h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 0.9fr 0.9fr',
              gap: 20,
              alignItems: 'stretch',
            }}
          >
            <div
              style={{
                background: '#111',
                border: '1px solid #222',
                borderRadius: 22,
                padding: 22,
                minHeight: 420,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: 12, fontSize: 22 }}>
                Product Video Placeholder
              </h3>

              <p style={{ color: '#a3a3a3', marginTop: 0, marginBottom: 16 }}>
                Recommended video size: 1920 × 1080
              </p>

              <div
                style={{
                  aspectRatio: '16 / 9',
                  borderRadius: 16,
                  border: '1px dashed #333',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#777',
                  background: '#0d0d0d',
                  marginBottom: 16,
                }}
              >
                Video area for future product demo
              </div>

              <div
                style={{
                  display: 'grid',
                  gap: 10,
                  marginTop: 'auto',
                }}
              >
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 14,
                    border: '1px solid #1f1f1f',
                    background: '#0d0d0d',
                    color: '#d7d7d7',
                    fontSize: 14,
                  }}
                >
                  Suggested use: product rotation / detail showcase / flavor highlight
                </div>

                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 14,
                    border: '1px solid #1f1f1f',
                    background: '#0d0d0d',
                    color: '#d7d7d7',
                    fontSize: 14,
                  }}
                >
                  Ideal for future TikTok, Meta ads, and landing page conversion assets
                </div>
              </div>
            </div>

            <InfoCard
              title="Main Product Image"
              value="1600 × 2000"
              description="Use this slot for a clean single-product hero shot. Avoid placing large text directly on the image for premium detail pages."
            />

            <InfoCard
              title="Thumbnail Images"
              value="800 × 800"
              description="Use square supporting images for packaging, flavor variants, texture closeups, charging view, or side profile."
            />
          </div>

          <div
            style={{
              marginTop: 20,
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: 20,
            }}
          >
            <div
              style={{
                background: '#111',
                border: '1px solid #222',
                borderRadius: 20,
                padding: 20,
              }}
            >
              <p
                style={{
                  marginTop: 0,
                  marginBottom: 10,
                  color: '#8d8d8d',
                  fontSize: 12,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                }}
              >
                Flavor Visual Slot
              </p>
              <h3 style={{ marginTop: 0, marginBottom: 12, fontSize: 22 }}>
                1200 × 1200
              </h3>
              <p style={{ margin: 0, color: '#a5a5a5', lineHeight: 1.7 }}>
                Best for future flavor graphics, icons, or lifestyle square visuals.
              </p>
            </div>

            <div
              style={{
                background: '#111',
                border: '1px solid #222',
                borderRadius: 20,
                padding: 20,
              }}
            >
              <p
                style={{
                  marginTop: 0,
                  marginBottom: 10,
                  color: '#8d8d8d',
                  fontSize: 12,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                }}
              >
                Packaging Image Slot
              </p>
              <h3 style={{ marginTop: 0, marginBottom: 12, fontSize: 22 }}>
                1400 × 1800
              </h3>
              <p style={{ margin: 0, color: '#a5a5a5', lineHeight: 1.7 }}>
                Suitable for box shots, label closeups, and retail presentation.
              </p>
            </div>

            <div
              style={{
                background: '#111',
                border: '1px solid #222',
                borderRadius: 20,
                padding: 20,
              }}
            >
              <p
                style={{
                  marginTop: 0,
                  marginBottom: 10,
                  color: '#8d8d8d',
                  fontSize: 12,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                }}
              >
                Ad Banner Slot
              </p>
              <h3 style={{ marginTop: 0, marginBottom: 12, fontSize: 22 }}>
                1920 × 900
              </h3>
              <p style={{ margin: 0, color: '#a5a5a5', lineHeight: 1.7 }}>
                Good for campaign banners, category headers, and homepage promotional strips.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
