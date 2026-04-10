import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import StableImage from '../components/ui/StableImage'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { siteSettings } from '../data/site'
import { fetchPublicProductBySlug, getCachedPublicProductBySlug, type PublicProduct } from '../lib/catalog'

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
  value?: string
  description: string
}) {
  return (
    <div
      style={{
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02)), #101010',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 24,
        padding: 24,
        minHeight: 250,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        boxShadow: '0 16px 50px rgba(0,0,0,0.22)',
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

      {value ? <h3 style={{ marginTop: 0, marginBottom: 14, fontSize: 24 }}>{value}</h3> : null}

      <p style={{ margin: 0, color: '#a5a5a5', lineHeight: 1.8 }}>{description}</p>
    </div>
  )
}

function MiniBadge({ text, compact = false }: { text: string; compact?: boolean }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: compact ? '7px 10px' : '8px 12px',
        borderRadius: 999,
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.03)',
        color: '#d9d9d9',
        fontSize: compact ? 12 : 13,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </span>
  )
}

export default function ProductDetailPage() {
  const { slug } = useParams()
  const location = useLocation()
  const { token } = useAuth()
  const { addToCart } = useCart()
  const routeState = location.state as { productPreview?: PublicProduct } | null
  const previewProduct =
    routeState?.productPreview && routeState.productPreview.slug === slug ? routeState.productPreview : null
  const cachedProduct = slug ? getCachedPublicProductBySlug(slug, token) : null
  const initialProduct = previewProduct || cachedProduct
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === 'undefined' ? 1440 : window.innerWidth,
  )
  const [remoteProduct, setRemoteProduct] = useState<PublicProduct | null>(initialProduct)
  const [isLoadingProduct, setIsLoadingProduct] = useState(() => !initialProduct && !!slug)
  const [productNotFound, setProductNotFound] = useState(false)

  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState<string | null>(null)
  const [contactModal, setContactModal] = useState<'pricing' | 'manager' | null>(null)

  useEffect(() => {
    setActiveImage(null)
    setQuantity(1)
  }, [slug])

  useEffect(() => {
    let active = true
    setProductNotFound(false)

    if (!slug) {
      setRemoteProduct(null)
      setIsLoadingProduct(false)
      setProductNotFound(true)
      return () => {
        active = false
      }
    }

    const currentPreview = previewProduct || getCachedPublicProductBySlug(slug, token)

    setRemoteProduct(currentPreview)
    setIsLoadingProduct(!currentPreview)

    fetchPublicProductBySlug(slug, token)
      .then((product) => {
        if (active) {
          setRemoteProduct(product)
          setProductNotFound(false)
          setIsLoadingProduct(false)
        }
      })
      .catch(() => {
        if (active) {
          if (currentPreview) {
            setRemoteProduct(currentPreview)
            setProductNotFound(false)
          } else {
            setRemoteProduct(null)
            setProductNotFound(true)
          }
          setIsLoadingProduct(false)
        }
      })

    return () => {
      active = false
    }
  }, [previewProduct, slug, token])

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

  useEffect(() => {
    if (!remoteProduct) {
      return
    }

    setQuantity((current) => {
      if (remoteProduct.stock <= 0) {
        return 1
      }

      return Math.min(current, remoteProduct.stock)
    })
  }, [remoteProduct])

  const product = remoteProduct

  if (isLoadingProduct) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="rounded-[2rem] border border-white/10 bg-neutral-950 px-6 py-16 text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">Product Detail</p>
          <h1 className="mt-4 text-3xl font-semibold text-white">Loading product...</h1>
        </div>
      </div>
    )
  }

  if (productNotFound || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="rounded-[2rem] border border-white/10 bg-neutral-950 px-6 py-16 text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">Product Detail</p>
          <h1 className="mt-4 text-3xl font-semibold text-white">This product is no longer available.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-neutral-400">
            The product link still exists, but the product record has been removed from the live catalog.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white transition hover:border-white/35"
          >
            Back to Catalog
          </Link>
        </div>
      </div>
    )
  }

  const normalizedSpecs = (product.specs || [])
    .map((spec) => ({
      label: spec.label || '',
      value: spec.value || '',
    }))
    .filter((spec) => spec.label && spec.value)
  const primaryDetailImage = product.gallery?.[0] || product.image
  const currentImage = activeImage || primaryDetailImage
  const isMobile = viewportWidth <= 768
  const isOutOfStock = product.stock <= 0
  const maxOrderQuantity = isOutOfStock ? 1 : Math.max(1, product.stock)
  const showCustomPrice = Boolean(product.hasCustomPrice && product.basePrice > product.price)
  const phoneHref = `tel:${siteSettings.phone.replace(/[^\d+]/g, '')}`
  const emailHref = `mailto:${siteSettings.email}`
  const modalCopy =
    contactModal === 'pricing'
      ? {
          eyebrow: 'Wholesale Pricing',
          title: 'Request Wholesale Pricing',
          description:
            'For volume pricing, MOQ details, and account-based rates, contact our wholesale team directly.',
        }
      : {
          eyebrow: 'Trade Support',
          title: 'Contact Account Manager',
          description:
            'For account setup, reorder planning, and store delivery coordination, contact our trade support team.',
        }

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top, rgba(255,255,255,0.06), transparent 20%), linear-gradient(180deg, #0a0a0a 0%, #070707 100%)',
        color: '#fff',
        padding: isMobile ? '20px 16px 40px' : '72px 40px 96px',
      }}
    >
      {contactModal ? (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            background: 'rgba(0,0,0,0.72)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 520,
              borderRadius: isMobile ? 24 : 28,
              border: '1px solid rgba(255,255,255,0.08)',
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.015)), #101010',
              boxShadow: '0 28px 100px rgba(0,0,0,0.42)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 16,
                padding: isMobile ? '20px 20px 0' : '24px 24px 0',
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    marginBottom: 10,
                    color: '#8f8f8f',
                    fontSize: 12,
                    letterSpacing: 1.8,
                    textTransform: 'uppercase',
                  }}
                >
                  {modalCopy.eyebrow}
                </p>
                <h2 style={{ margin: 0, fontSize: isMobile ? 26 : 32, lineHeight: 1.08 }}>
                  {modalCopy.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setContactModal(null)}
                aria-label="Close contact dialog"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: '#0f0f0f',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: 18,
                }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: isMobile ? 20 : 24 }}>
              <p
                style={{
                  marginTop: 0,
                  marginBottom: 20,
                  color: '#a8a8a8',
                  fontSize: isMobile ? 14 : 15,
                  lineHeight: 1.8,
                }}
              >
                {modalCopy.description}
              </p>

              <div
                style={{
                  display: 'grid',
                  gap: 14,
                }}
              >
                <a
                  href={phoneHref}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    padding: '16px 18px',
                    borderRadius: 18,
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.02)',
                    color: '#fff',
                    textDecoration: 'none',
                  }}
                >
                  <span
                    style={{
                      color: '#8f8f8f',
                      fontSize: 12,
                      letterSpacing: 1.5,
                      textTransform: 'uppercase',
                    }}
                  >
                    Call Trade Support
                  </span>
                  <span style={{ fontSize: isMobile ? 20 : 22, fontWeight: 700 }}>
                    {siteSettings.phone}
                  </span>
                </a>

                <a
                  href={emailHref}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    padding: '16px 18px',
                    borderRadius: 18,
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.02)',
                    color: '#fff',
                    textDecoration: 'none',
                  }}
                >
                  <span
                    style={{
                      color: '#8f8f8f',
                      fontSize: 12,
                      letterSpacing: 1.5,
                      textTransform: 'uppercase',
                    }}
                  >
                    Email Wholesale Team
                  </span>
                  <span style={{ fontSize: isMobile ? 16 : 18, fontWeight: 600 }}>
                    {siteSettings.email}
                  </span>
                </a>
              </div>

              <div
                style={{
                  marginTop: 20,
                  paddingTop: 18,
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                  color: '#929292',
                  fontSize: 13,
                  lineHeight: 1.7,
                }}
              >
                Business support: Monday to Friday, 9:00 AM to 6:00 PM (China Standard Time)
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1.02fr 0.98fr',
            gap: isMobile ? 18 : 34,
            alignItems: 'start',
          }}
        >
          <div>
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                background:
                  'radial-gradient(circle at top right, rgba(255,255,255,0.08), transparent 32%), linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02)), #101010',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: isMobile ? 26 : 34,
                padding: isMobile ? 14 : 22,
                marginBottom: isMobile ? 14 : 18,
                boxShadow: '0 28px 90px rgba(0,0,0,0.4)',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: isMobile ? 18 : 24,
                  background: '#0d0d0d',
                }}
              >
                <StableImage
                  src={currentImage}
                  alt={product.name}
                  loading="eager"
                  fetchPriority="high"
                  containerStyle={{
                    borderRadius: isMobile ? 18 : 24,
                  }}
                  placeholderStyle={{
                    borderRadius: isMobile ? 18 : 24,
                  }}
                  style={{
                    width: '100%',
                    height: isMobile ? 430 : 720,
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />

                <div
                  style={{
                    position: 'absolute',
                    left: isMobile ? 14 : 24,
                    right: isMobile ? 14 : 24,
                    bottom: isMobile ? 14 : 24,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    gap: isMobile ? 10 : 18,
                    flexWrap: 'wrap',
                  }}
                >
                  {!isMobile ? (
                    <div
                      style={{
                        padding: '14px 16px',
                        borderRadius: 18,
                        background: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          marginBottom: 8,
                          color: '#a7a7a7',
                          fontSize: 11,
                          letterSpacing: 1.5,
                          textTransform: 'uppercase',
                        }}
                      >
                        Product Presentation
                      </p>
                      <div style={{ fontSize: 20, fontWeight: 700 }}>{product.name}</div>
                    </div>
                  ) : null}

                  <div
                    style={{
                      padding: isMobile ? '12px 14px' : '14px 16px',
                      borderRadius: isMobile ? 16 : 18,
                      background: 'rgba(0,0,0,0.5)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      textAlign: 'right',
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        marginBottom: 8,
                        color: '#a7a7a7',
                        fontSize: 11,
                        letterSpacing: 1.5,
                        textTransform: 'uppercase',
                      }}
                    >
                      Product Type
                    </p>
                    <div style={{ fontSize: isMobile ? 14 : 16, fontWeight: 600 }}>Disposable Vape</div>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: isMobile ? 8 : 12,
              }}
            >
              {product.gallery.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  style={{
                    border:
                      currentImage === image
                        ? '1px solid rgba(255,255,255,0.6)'
                        : '1px solid rgba(255,255,255,0.08)',
                    background: '#111',
                    borderRadius: isMobile ? 14 : 18,
                    padding: isMobile ? 6 : 8,
                    cursor: 'pointer',
                    transition: '0.25s',
                  }}
                >
                  <StableImage
                    src={image}
                    alt={`${product.name} preview ${index + 1}`}
                    loading="lazy"
                    containerStyle={{
                      borderRadius: isMobile ? 10 : 12,
                    }}
                    placeholderStyle={{
                      borderRadius: isMobile ? 10 : 12,
                    }}
                    style={{
                      width: '100%',
                      height: isMobile ? 86 : 128,
                      objectFit: 'cover',
                      borderRadius: isMobile ? 10 : 12,
                      display: 'block',
                    }}
                  />
                </button>
              ))}
            </div>

            {!isMobile ? (
              <div
                style={{
                  marginTop: 30,
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 0.8fr',
                  gap: 18,
                }}
              >
                <div
                  style={{
                    padding: 28,
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02)), #101010',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 24,
                  }}
                >
                  <h3 style={{ marginTop: 0, marginBottom: 14, fontSize: 26 }}>
                    Wholesale Overview
                  </h3>

                  <p
                    style={{
                      color: '#a5a5a5',
                      lineHeight: 1.9,
                      marginTop: 0,
                      marginBottom: 0,
                      fontSize: 15,
                    }}
                  >
                    Built to support premium shelf presentation, cleaner restocking decisions, and
                    dependable replenishment planning for U.S. retail store accounts.
                  </p>
                </div>

                <div
                  style={{
                    padding: 28,
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02)), #101010',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 24,
                  }}
                >
                  <p
                    style={{
                      marginTop: 0,
                      marginBottom: 12,
                      color: '#8d8d8d',
                      fontSize: 12,
                      letterSpacing: 1.5,
                      textTransform: 'uppercase',
                    }}
                  >
                    Trade Notes
                  </p>

                  <div
                    style={{
                      display: 'grid',
                      gap: 12,
                      color: '#d6d6d6',
                      fontSize: 14,
                      lineHeight: 1.8,
                    }}
                  >
                    <div>Premium wholesale presentation</div>
                    <div>Built for U.S. retail store review</div>
                    <div>Prepared for repeat replenishment</div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div
            style={{
              position: isMobile ? 'static' : 'sticky',
              top: isMobile ? 'auto' : 92,
            }}
          >
            <div
              style={{
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015)), #101010',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: isMobile ? 26 : 34,
                padding: isMobile ? 20 : 30,
                boxShadow: '0 24px 80px rgba(0,0,0,0.36)',
              }}
            >
              <p
                style={{
                  color: '#8d8d8d',
                  letterSpacing: 2,
                  fontSize: 12,
                  marginBottom: isMobile ? 12 : 16,
                  textTransform: 'uppercase',
                }}
              >
                {product.flavor.toUpperCase()}
              </p>

              {isMobile ? (
                <div style={{ marginBottom: 14 }}>
                  <h1
                    style={{
                      fontSize: 34,
                      lineHeight: 1.02,
                      letterSpacing: -0.7,
                      margin: 0,
                    }}
                  >
                    {product.shortName}
                  </h1>
                  <p
                    style={{
                      margin: 0,
                      marginTop: 8,
                      color: '#f3f3f3',
                      fontSize: 22,
                      lineHeight: 1.08,
                      fontWeight: 500,
                    }}
                  >
                    {product.flavor}
                  </p>
                </div>
              ) : (
                <h1
                  style={{
                    fontSize: 52,
                    lineHeight: 1.02,
                    letterSpacing: -1.2,
                    margin: 0,
                    marginBottom: 16,
                  }}
                >
                  {product.name}
                </h1>
              )}

              <p
                style={{
                  color: '#a5a5a5',
                  fontSize: isMobile ? 14 : 16,
                  lineHeight: isMobile ? 1.72 : 1.9,
                  marginTop: 0,
                  marginBottom: isMobile ? 18 : 24,
                }}
              >
                {product.description}
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  flexWrap: isMobile ? 'nowrap' : 'wrap',
                  marginBottom: isMobile ? 20 : 28,
                  overflowX: isMobile ? 'auto' : 'visible',
                  paddingBottom: isMobile ? 2 : 0,
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                <MiniBadge text="Wholesale supply" compact={isMobile} />
                <MiniBadge text="U.S. retail ready" compact={isMobile} />
              </div>

              <div
                style={{
                  display: isMobile ? 'grid' : 'flex',
                  gridTemplateColumns: isMobile ? 'max-content minmax(0, 1fr)' : undefined,
                  alignItems: isMobile ? 'end' : 'flex-end',
                  justifyContent: 'space-between',
                  gap: isMobile ? 10 : 16,
                  marginBottom: isMobile ? 18 : 24,
                  flexWrap: isMobile ? 'nowrap' : 'wrap',
                  flexDirection: 'row',
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      color: '#7f7f7f',
                      fontSize: 13,
                      marginBottom: 8,
                    }}
                  >
                    Wholesale Price
                  </p>
                  {showCustomPrice ? (
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        marginBottom: 10,
                        padding: isMobile ? '6px 10px' : '7px 12px',
                        borderRadius: 999,
                        border: '1px solid rgba(52,211,153,0.18)',
                        background: 'rgba(16,185,129,0.1)',
                        color: '#d1fae5',
                        fontSize: isMobile ? 10 : 11,
                        letterSpacing: 0.6,
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Your account price
                    </div>
                  ) : null}
                  <div
                    style={{
                      fontSize: isMobile ? 34 : 42,
                      fontWeight: 800,
                      lineHeight: 1,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    ${product.price.toFixed(2)}
                  </div>
                  {showCustomPrice ? (
                    <div
                      style={{
                        marginTop: 10,
                        color: '#7f7f7f',
                        fontSize: isMobile ? 12 : 13,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Standard ${product.basePrice.toFixed(2)}
                    </div>
                  ) : null}
                </div>

                <div
                  style={{
                    padding: isMobile ? '10px 12px' : '12px 16px',
                    borderRadius: isMobile ? 16 : 18,
                    background: '#0c0c0c',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#d0d0d0',
                    fontSize: isMobile ? 12 : 13,
                    width: 'auto',
                    maxWidth: isMobile ? 200 : 'none',
                    lineHeight: isMobile ? 1.45 : 1.55,
                    justifySelf: isMobile ? 'end' : 'auto',
                  }}
                >
                  Volume pricing and MOQ are available for trade accounts.
                </div>
              </div>

              <div
                style={{
                  padding: isMobile ? 16 : 22,
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 22,
                  marginBottom: isMobile ? 16 : 20,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: isMobile ? 10 : 12,
                    alignItems: 'flex-start',
                    marginBottom: 16,
                    flexWrap: 'nowrap',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gap: 8,
                      flex: '0 0 auto',
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 16,
                        overflow: 'hidden',
                        background: '#0f0f0f',
                        width: 'fit-content',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                        style={{
                          ...qtyButtonStyle,
                          width: isMobile ? 38 : qtyButtonStyle.width,
                          height: isMobile ? 42 : qtyButtonStyle.height,
                        }}
                      >
                        -
                      </button>

                      <input
                        type="number"
                        min={1}
                        max={maxOrderQuantity}
                        value={quantity}
                        onChange={(event) => {
                          const rawValue = event.target.value
                          if (!rawValue) {
                            setQuantity(1)
                            return
                          }

                          const nextValue = Number.parseInt(rawValue, 10)
                          if (Number.isNaN(nextValue)) {
                            return
                          }

                          setQuantity(Math.min(maxOrderQuantity, Math.max(1, nextValue)))
                        }}
                        onBlur={() => {
                          setQuantity((prev) => Math.min(maxOrderQuantity, Math.max(1, prev)))
                        }}
                        inputMode="numeric"
                        style={{
                          width: isMobile ? 54 : 76,
                          height: isMobile ? 42 : 46,
                          border: 'none',
                          outline: 'none',
                          background: 'transparent',
                          color: '#fff',
                          textAlign: 'center',
                          fontWeight: 600,
                          fontSize: isMobile ? 16 : 18,
                          MozAppearance: 'textfield',
                        }}
                      />

                      <button
                        type="button"
                        onClick={() => setQuantity((prev) => Math.min(maxOrderQuantity, prev + 1))}
                        disabled={isOutOfStock || quantity >= maxOrderQuantity}
                        style={{
                          ...qtyButtonStyle,
                          width: isMobile ? 38 : qtyButtonStyle.width,
                          height: isMobile ? 42 : qtyButtonStyle.height,
                          opacity: isOutOfStock || quantity >= maxOrderQuantity ? 0.35 : 1,
                          cursor:
                            isOutOfStock || quantity >= maxOrderQuantity
                              ? 'not-allowed'
                              : qtyButtonStyle.cursor,
                        }}
                      >
                        +
                      </button>
                    </div>

                    <div style={{ color: '#8d8d8d', fontSize: 13 }}>
                      {isOutOfStock ? 'This item is currently unavailable.' : 'Enter quantity, then add to order'}
                    </div>
                  </div>

                  <div
                    style={{
                      width: isMobile ? 124 : 'auto',
                      minWidth: isMobile ? 124 : 196,
                      maxWidth: '100%',
                      padding: isMobile ? '0 10px' : '0 16px',
                      borderRadius: 16,
                      border: isOutOfStock
                        ? '1px solid rgba(248,113,113,0.2)'
                        : '1px solid rgba(255,255,255,0.08)',
                      background: isOutOfStock ? 'rgba(127,29,29,0.18)' : '#0f0f0f',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: isMobile ? 8 : 10,
                      height: isMobile ? 42 : 46,
                      flex: '0 0 auto',
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: isOutOfStock ? '#fecaca' : '#8d8d8d',
                        fontSize: isMobile ? 8 : 11,
                        letterSpacing: isMobile ? 0.6 : 1.4,
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                        flexShrink: 1,
                      }}
                    >
                      {isOutOfStock ? 'Out of stock' : 'In stock'}
                    </p>
                    <div
                      style={{
                        fontSize: isMobile ? 18 : 24,
                        fontWeight: 700,
                        lineHeight: 1,
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        minWidth: isMobile ? '2ch' : '7ch',
                        textAlign: 'right',
                        color: isOutOfStock ? '#fecaca' : '#fff',
                      }}
                    >
                      {product.stock}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: 10,
                  }}
                >
                  <Button
                    onClick={() => {
                      if (isOutOfStock) {
                        return
                      }

                      addToCart({
                        product: {
                          id: product.id,
                          slug: product.slug,
                          name: product.name,
                          tagline: product.flavor,
                          price: product.price,
                          compareAtPrice: showCustomPrice ? product.basePrice : undefined,
                          shortDescription: product.description,
                          description: product.description,
                          image: product.image,
                          gallery: product.gallery,
                          flavors: [product.flavor],
                          features: product.highlights,
                          specs: normalizedSpecs,
                        },
                        quantity,
                      })
                    }}
                    disabled={isOutOfStock}
                    className="disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {isOutOfStock ? 'Out of Stock' : 'Add to Order'}
                  </Button>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                      gap: 10,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setContactModal('pricing')}
                      style={secondaryActionStyle}
                    >
                      Request Pricing
                    </button>

                    <button
                      type="button"
                      onClick={() => setContactModal('manager')}
                      style={secondaryActionStyle}
                    >
                      Contact Account Manager
                    </button>
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: isMobile ? 16 : 20,
                  background: '#0d0d0d',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 20,
                  marginBottom: isMobile ? 16 : 24,
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gap: 10,
                  }}
                >
                  <DetailRow label="Order Access" value="Trade account login required" />
                  <DetailRow label="Market" value="U.S. retail stores" />
                  <DetailRow label="Support" value="Sales and trade support ready" />
                </div>
              </div>

              <div
                style={{
                  padding: isMobile ? 18 : 24,
                  background: '#0d0d0d',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 22,
                  marginBottom: isMobile ? 16 : 22,
                }}
              >
                <h3 style={{ marginTop: 0, marginBottom: 14, fontSize: isMobile ? 18 : 20 }}>
                  Flavor Options
                </h3>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 10,
                  }}
                >
                  {[product.flavor].map((flavor) => (
                    <MiniBadge key={flavor} text={flavor} />
                  ))}
                </div>
              </div>

              <div
                style={{
                  padding: isMobile ? 18 : 24,
                  background: '#0d0d0d',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 22,
                }}
              >
                <h3 style={{ marginTop: 0, marginBottom: 18, fontSize: isMobile ? 20 : 22 }}>
                  Specifications
                </h3>

                <div
                  style={{
                    display: 'grid',
                    gap: 12,
                  }}
                >
                  {normalizedSpecs.map((spec) => (
                    <div
                      key={spec.label}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 16,
                        paddingBottom: 12,
                        borderBottom: '1px solid #1f1f1f',
                        alignItems: 'flex-start',
                      }}
                    >
                      <span style={{ color: '#8d8d8d', fontSize: isMobile ? 13 : 14 }}>
                        {spec.label}
                      </span>
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: isMobile ? 13 : 14,
                          textAlign: 'right',
                        }}
                      >
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: isMobile ? 22 : 96 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1.15fr 0.85fr',
              gap: isMobile ? 14 : 20,
              alignItems: 'stretch',
            }}
          >
            {isMobile ? (
              <>
                <div
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02)), #101010',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 24,
                    padding: 18,
                    boxShadow: '0 18px 56px rgba(0,0,0,0.22)',
                  }}
                >
                  <h3 style={{ marginTop: 0, marginBottom: 14, fontSize: 22 }}>
                    Wholesale Overview
                  </h3>

                  <p
                    style={{
                      color: '#a5a5a5',
                      lineHeight: 1.82,
                      marginTop: 0,
                      marginBottom: 0,
                      fontSize: 15,
                    }}
                  >
                    Built to support premium shelf presentation, cleaner restocking decisions, and
                    dependable replenishment planning for U.S. retail store accounts.
                  </p>
                </div>

                <div
                  style={{
                    padding: 18,
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02)), #101010',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 24,
                  }}
                >
                  <p
                    style={{
                      marginTop: 0,
                      marginBottom: 12,
                      color: '#8d8d8d',
                      fontSize: 12,
                      letterSpacing: 1.5,
                      textTransform: 'uppercase',
                    }}
                  >
                    Trade Notes
                  </p>

                  <div
                    style={{
                      display: 'grid',
                      gap: 12,
                      color: '#d6d6d6',
                      fontSize: 14,
                      lineHeight: 1.8,
                    }}
                  >
                    <div>Premium wholesale presentation</div>
                    <div>Built for U.S. retail store review</div>
                    <div>Prepared for repeat replenishment</div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02)), #101010',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 28,
                    padding: 28,
                    boxShadow: '0 18px 56px rgba(0,0,0,0.22)',
                  }}
                >
                  <p
                    style={{
                      marginTop: 0,
                      marginBottom: 12,
                      color: '#8d8d8d',
                      fontSize: 12,
                      letterSpacing: 1.5,
                      textTransform: 'uppercase',
                    }}
                  >
                    Wholesale Overview
                  </p>

                  <h3 style={{ marginTop: 0, marginBottom: 12, fontSize: 26 }}>
                    Built for shelf presence and repeat ordering.
                  </h3>

                  <p
                    style={{
                      marginTop: 0,
                      marginBottom: 0,
                      color: '#a5a5a5',
                      lineHeight: 1.9,
                      fontSize: 15,
                      maxWidth: 720,
                    }}
                  >
                    A flavor-led SKU suited to retail accounts that need presentation quality, reorder
                    clarity, and steady wholesale continuity.
                  </p>
                </div>

                <InfoCard
                  title="Packaging and reorder fit"
                  value="Store-ready"
                  description="Clean presentation, practical shelf use, and dependable fit for repeat account ordering."
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 12,
        color: '#d6d6d6',
        fontSize: 14,
        alignItems: 'flex-start',
      }}
    >
      <span style={{ color: '#8d8d8d' }}>{label}</span>
      <span style={{ textAlign: 'right' }}>{value}</span>
    </div>
  )
}

const secondaryActionStyle: React.CSSProperties = {
  height: 48,
  padding: '0 18px',
  borderRadius: 999,
  border: '1px solid rgba(255,255,255,0.1)',
  background: '#101010',
  color: '#fff',
  cursor: 'pointer',
  fontSize: 14,
}
