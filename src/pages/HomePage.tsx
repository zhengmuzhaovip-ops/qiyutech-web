import { useEffect, useState } from 'react'
import { ButtonLink } from '../components/ui/Button'

const heroSignals = [
  'Wholesale pricing',
  'Store delivery',
  'Reliable supply',
]

const featuredHighlights = [
  'Premium shelf presence',
  'Reliable reorder cadence',
  'Store-ready delivery support',
]

const trustProofPoints = [
  {
    title: 'Wholesale pricing structure',
    detail: 'Clear account-based pricing built for steady store ordering.',
  },
  {
    title: 'Store delivery coordination',
    detail: 'Supply flow aligned with practical retail receiving windows.',
  },
  {
    title: 'Repeat replenishment support',
    detail: 'Structured for ongoing reorder cycles rather than one-off buying.',
  },
  {
    title: 'Shelf presentation support',
    detail: 'Presentation quality suited to premium store-facing environments.',
  },
]

const retailPartnerCards = [
  {
    title: 'Smoke Shops',
    description: 'For smoke shops balancing shelf presence, margin discipline, and faster reorders.',
    points: ['Wholesale pricing', 'Shelf-ready'],
  },
  {
    title: 'Convenience Stores',
    description: 'For convenience accounts where compact assortment and delivery timing drive movement.',
    points: ['Store delivery', 'Repeat replenishment'],
  },
  {
    title: 'Multi-location Retail Accounts',
    description: 'For multi-store buyers who need cleaner ordering continuity across locations.',
    points: ['Account support', 'Multi-store continuity'],
  },
]

const AGE_GATE_STORAGE_KEY = 'qiyutech-age-verified'

export default function HomePage() {
  const [isVerified, setIsVerified] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return window.localStorage.getItem(AGE_GATE_STORAGE_KEY) === 'true'
  })
  const [isDenied, setIsDenied] = useState(false)
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === 'undefined' ? 1440 : window.innerWidth,
  )

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
  const isCompact = viewportWidth <= 1100

  const handleConfirmAge = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(AGE_GATE_STORAGE_KEY, 'true')
    }

    setIsVerified(true)
    setIsDenied(false)
  }

  const handleDenyAge = () => {
    setIsDenied(true)
  }

  const mobileProofPoints = [trustProofPoints[0], trustProofPoints[2]]

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#070707',
        color: '#fff',
        padding: isMobile ? '12px 16px 28px' : '76px 40px 124px',
      }}
    >
      {!isVerified ? (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px',
            background:
              'radial-gradient(circle at top, rgba(120,16,16,0.3), transparent 28%), linear-gradient(180deg, rgba(22,0,0,0.98) 0%, rgba(8,8,8,0.98) 100%)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 900,
              borderRadius: isMobile ? 28 : 36,
              border: '1px solid rgba(255,255,255,0.08)',
              background:
                'linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015) 40%, rgba(255,255,255,0.02) 100%), #0c0c0c',
              boxShadow: '0 36px 140px rgba(0,0,0,0.55)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '0.94fr 1.06fr',
                minHeight: isMobile ? 'auto' : 520,
              }}
            >
              <div
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRight: isMobile ? 'none' : '1px solid rgba(255,255,255,0.06)',
                  borderBottom: isMobile ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  background:
                    'radial-gradient(circle at top left, rgba(140,22,22,0.42), transparent 36%), linear-gradient(180deg, rgba(70,8,8,0.42), rgba(8,8,8,0.18)), #120808',
                  padding: isMobile ? '28px 22px' : '44px 38px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'radial-gradient(circle at 30% 18%, rgba(255,255,255,0.08), transparent 22%), linear-gradient(180deg, transparent, rgba(0,0,0,0.28))',
                    pointerEvents: 'none',
                  }}
                />

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <p
                    style={{
                      margin: 0,
                      marginBottom: 12,
                      color: '#d6c6c6',
                      letterSpacing: 2.4,
                      fontSize: 11,
                      textTransform: 'uppercase',
                    }}
                  >
                    Age Verification
                  </p>

                  <h1
                    style={{
                      margin: 0,
                      fontSize: isMobile ? 34 : 56,
                      lineHeight: 0.98,
                      letterSpacing: isMobile ? -1.1 : -1.8,
                    }}
                  >
                    Access restricted to verified 21+ trade visitors.
                  </h1>

                  <p
                    style={{
                      margin: 0,
                      marginTop: 22,
                      maxWidth: isMobile ? '100%' : 360,
                      color: '#dfd2d2',
                      fontSize: isMobile ? 14 : 15,
                      lineHeight: isMobile ? 1.7 : 1.85,
                    }}
                  >
                    This wholesale website is intended only for adult visitors of legal smoking age
                    in their jurisdiction. Please confirm your age before entering the site.
                  </p>
                </div>

                <div
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    gap: 10,
                    flexWrap: 'wrap',
                  }}
                >
                  <AgeSignal text="21+ access only" />
                  <AgeSignal text="Wholesale website" />
                  <AgeSignal text="Nicotine warning applies" />
                </div>
              </div>

              <div
                style={{
                  padding: isMobile ? '28px 22px' : '44px 40px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background:
                    'radial-gradient(circle at top, rgba(255,255,255,0.05), transparent 28%), #0b0b0b',
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      marginBottom: 16,
                      color: '#8e8e8e',
                      fontSize: 12,
                      letterSpacing: 1.8,
                      textTransform: 'uppercase',
                    }}
                  >
                    Entry Confirmation
                  </p>

                  <div
                    style={{
                      padding: '18px 18px 16px',
                      borderRadius: 22,
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: '#f2f2f2',
                        fontSize: 18,
                        lineHeight: 1.5,
                        fontWeight: 500,
                      }}
                    >
                      Confirm that you are at least 21 years old to continue to the wholesale site.
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                      gap: 14,
                      marginTop: 26,
                    }}
                  >
                    <button
                      type="button"
                      onClick={handleDenyAge}
                      style={ageActionButtonStyle}
                    >
                      Under 21
                    </button>

                    <button
                      type="button"
                      onClick={handleConfirmAge}
                      style={{
                        ...ageActionButtonStyle,
                        background: '#fff',
                        color: '#000',
                        border: '1px solid #fff',
                      }}
                    >
                      I am 21+
                    </button>
                  </div>

                  <p
                    style={{
                      margin: 0,
                      marginTop: 18,
                      color: isDenied ? '#f0c4c4' : '#8f8f8f',
                      fontSize: 13,
                      lineHeight: 1.7,
                    }}
                  >
                    {isDenied
                      ? 'Access to this website is restricted. You must be at least 21 years old to continue.'
                      : 'By entering, you confirm that you meet the applicable age requirement for nicotine-related products.'}
                  </p>
                </div>

                <div
                  style={{
                    paddingTop: 28,
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: '#d9d9d9',
                      fontSize: 14,
                      lineHeight: 1.8,
                    }}
                  >
                    WARNING: This product contains nicotine. Nicotine is an addictive chemical.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        {isMobile ? (
          <>
            <section
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 30,
                border: '1px solid rgba(255,255,255,0.08)',
                background:
                  'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.018) 38%, rgba(255,255,255,0.025) 100%), #0d0d0d',
                boxShadow: '0 26px 100px rgba(0,0,0,0.38)',
                padding: '24px 20px 20px',
              }}
            >
              <p
                style={{
                  margin: 0,
                  marginBottom: 14,
                  color: '#9f9f9f',
                  letterSpacing: 2.4,
                  fontSize: 10.5,
                  textTransform: 'uppercase',
                }}
              >
                U.S. Wholesale Supply
              </p>

              <h1
                style={{
                  margin: 0,
                  maxWidth: 320,
                  fontSize: 34,
                  lineHeight: 1.02,
                  letterSpacing: -0.8,
                  fontWeight: 700,
                }}
              >
                <>
                  Built for premium
                  <br />
                  retail supply.
                </>
              </h1>

              <p
                style={{
                  margin: 0,
                  marginTop: 24,
                  maxWidth: 268,
                  color: '#b6b6b6',
                  fontSize: 14,
                  lineHeight: 1.72,
                }}
              >
                <>
                  Trade-ready pricing, store delivery,
                  <br />
                  and dependable reorder support.
                </>
              </p>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8,
                  marginTop: 18,
                }}
              >
                {heroSignals.map((text) => (
                  <SignalPill key={text} text={text} compact />
                ))}
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  marginTop: 18,
                }}
              >
                <ButtonLink to="/products">View Wholesale Catalog</ButtonLink>
                <ButtonLink to="/account" variant="secondary">
                  Open Trade Account
                </ButtonLink>
              </div>

              <div
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  marginTop: 18,
                  borderRadius: 24,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background:
                    'radial-gradient(circle at top, rgba(255,255,255,0.12), transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)), #0f0f0f',
                  minHeight: 404,
                  padding: 10,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 12,
                    borderRadius: 18,
                    border: '1px solid rgba(255,255,255,0.05)',
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                />

                <img
                  src="/images/home-hero-geek-bar-pulse-x.png"
                  alt="GEEK BAR PULSE X"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: 384,
                    objectFit: 'cover',
                    objectPosition: 'center 28%',
                    borderRadius: 18,
                    display: 'block',
                    filter: 'saturate(0.9) contrast(1.08)',
                  }}
                />

                <div
                  style={{
                    position: 'absolute',
                    left: 18,
                    right: 18,
                    bottom: 18,
                    padding: '12px 13px 11px',
                    borderRadius: 18,
                    background: 'rgba(8,8,8,0.44)',
                    backdropFilter: 'blur(14px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    zIndex: 2,
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: '#56e3a6',
                      fontSize: 11,
                      letterSpacing: 1.4,
                      textTransform: 'uppercase',
                      textShadow: '0 0 18px rgba(56,211,159,0.18)',
                    }}
                  >
                    Featured wholesale product
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      marginTop: 8,
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: 16,
                        lineHeight: 1.12,
                        fontWeight: 600,
                      }}
                    >
                      GEEK BAR PULSE X
                    </p>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      marginTop: 10,
                      color: '#c8c8c8',
                      fontSize: 12.5,
                      lineHeight: 1.45,
                    }}
                  >
                    Premium shelf presence with a cleaner fit for repeat store ordering.
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      marginTop: 10,
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: '#d8d8d8',
                        fontSize: 12.5,
                        lineHeight: 1.5,
                        fontWeight: 500,
                      }}
                    >
                      Browse the full series from View Wholesale Catalog.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section style={{ marginTop: 24 }}>
              <div
                style={{
                  borderRadius: 24,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.015)), #0e0e0e',
                  padding: '18px 16px',
                  boxShadow: '0 18px 56px rgba(0,0,0,0.22)',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    marginBottom: 8,
                    color: '#878787',
                    letterSpacing: 1.8,
                    fontSize: 11,
                    textTransform: 'uppercase',
                  }}
                >
                  Wholesale Confidence
                </p>
                <h2 style={{ margin: 0, fontSize: 26, lineHeight: 1.04 }}>
                  Built for repeat store ordering.
                </h2>
                <p
                  style={{
                    margin: 0,
                    marginTop: 12,
                    color: '#a3a3a3',
                    fontSize: 13.5,
                    lineHeight: 1.62,
                  }}
                >
                  Focused support around pricing clarity, delivery coordination, and replenishment
                  continuity.
                </p>

                <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
                  {mobileProofPoints.map((point) => (
                    <div
                      key={point.title}
                      style={{
                        padding: '14px 14px 12px',
                        borderRadius: 16,
                        border: '1px solid rgba(255,255,255,0.07)',
                        background: 'rgba(255,255,255,0.02)',
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          marginBottom: 6,
                          color: '#f2f2f2',
                          fontSize: 15,
                          lineHeight: 1.28,
                          fontWeight: 600,
                        }}
                      >
                        {point.title}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          color: '#9c9c9c',
                          fontSize: 12.5,
                          lineHeight: 1.56,
                        }}
                      >
                        {point.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section style={{ marginTop: 24 }}>
              <div
                style={{
                  borderRadius: 26,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015)), #0f0f0f',
                  padding: '20px 16px 18px',
                  boxShadow: '0 24px 80px rgba(0,0,0,0.24)',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    marginBottom: 10,
                    color: '#8e8e8e',
                    letterSpacing: 2,
                    fontSize: 11,
                    textTransform: 'uppercase',
                  }}
                >
                  Retail Partners
                </p>
                <h2 style={{ margin: 0, fontSize: 28, lineHeight: 1 }}>
                  Built around the store environments we support.
                </h2>
                <p
                  style={{
                    margin: 0,
                    marginTop: 12,
                    color: '#a8a8a8',
                    fontSize: 13.5,
                    lineHeight: 1.62,
                  }}
                >
                  A clearer view of the account types we serve across delivery, replenishment, and
                  trade continuity.
                </p>

                <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
                  <RetailPartnerMobileCard card={retailPartnerCards[0]} index={1} />

                  <div
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: 28,
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: '#111',
                      minHeight: 208,
                    }}
                  >
                    <img
                      src="/images/retail-display-geek-bar-pulse-x.png"
                      alt="GEEK BAR PULSE X retail display in store"
                      style={{
                        width: '100%',
                        height: '100%',
                        minHeight: 208,
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />

                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                          'linear-gradient(180deg, rgba(0,0,0,0.06), rgba(0,0,0,0.58) 78%, rgba(0,0,0,0.78) 100%)',
                      }}
                    />

                    <div
                      style={{
                        position: 'absolute',
                        left: 16,
                        right: 16,
                        bottom: 16,
                      }}
                    >
                      <p
                        style={{
                          marginTop: 0,
                          marginBottom: 8,
                          color: '#9e9e9e',
                          fontSize: 11,
                          letterSpacing: 1.5,
                          textTransform: 'uppercase',
                        }}
                      >
                        Retail display
                      </p>
                      <h3
                        style={{
                          margin: 0,
                          marginBottom: 10,
                          fontSize: 18,
                          lineHeight: 1.12,
                        }}
                      >
                        Shelf-ready presentation for store-facing retail environments.
                      </h3>
                    </div>
                  </div>

                  <RetailPartnerMobileCard card={retailPartnerCards[2]} index={2} />

                  <div
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: 28,
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: '#111',
                      minHeight: 208,
                    }}
                  >
                    <img
                      src="/images/delivery-geek-bar-pulse-x-retail-store.png"
                      alt="GEEK BAR PULSE X wholesale delivery to retail store"
                      style={{
                        width: '100%',
                        height: '100%',
                        minHeight: 208,
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />

                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                          'linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.6) 78%, rgba(0,0,0,0.8) 100%)',
                      }}
                    />

                    <div
                      style={{
                        position: 'absolute',
                        left: 16,
                        right: 16,
                        bottom: 16,
                      }}
                    >
                      <p
                        style={{
                          marginTop: 0,
                          marginBottom: 8,
                          color: '#9e9e9e',
                          fontSize: 11,
                          letterSpacing: 1.5,
                          textTransform: 'uppercase',
                        }}
                      >
                        Store delivery
                      </p>
                      <h3
                        style={{
                          margin: 0,
                          marginBottom: 10,
                          fontSize: 18,
                          lineHeight: 1.12,
                        }}
                      >
                        Delivery support aligned with real retail receiving workflows.
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section style={{ marginTop: 24 }}>
              <div
                style={{
                  borderRadius: 26,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015)), #0f0f0f',
                  padding: '22px 18px 20px',
                  boxShadow: '0 22px 72px rgba(0,0,0,0.24)',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    marginBottom: 8,
                    color: '#8e8e8e',
                    letterSpacing: 2,
                    fontSize: 11,
                    textTransform: 'uppercase',
                  }}
                >
                  Featured Wholesale Series
                </p>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 20,
                    lineHeight: 1.04,
                    whiteSpace: 'nowrap',
                    letterSpacing: -1,
                  }}
                >
                  GEEK BAR PULSE X Series
                </h2>
                <p
                  style={{
                    margin: 0,
                    marginTop: 14,
                    color: '#a3a3a3',
                    fontSize: 14,
                    lineHeight: 1.68,
                  }}
                >
                  Shelf-ready wholesale SKUs built for repeat retail ordering.
                </p>

                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    flexWrap: 'wrap',
                    marginTop: 16,
                  }}
                >
                  <SeriesMetaTag text="2 SKUs" />
                  <SeriesMetaTag text="Shelf-ready" />
                  <SeriesMetaTag text="Repeat ordering" />
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    marginTop: 20,
                  }}
                >
                  <ButtonLink to="/products">View Wholesale Catalog</ButtonLink>
                  <ButtonLink to="/account" variant="secondary">
                    Open Trade Account
                  </ButtonLink>
                </div>

                <div
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 22,
                    border: '1px solid rgba(255,255,255,0.08)',
                    background:
                      'radial-gradient(circle at top, rgba(255,255,255,0.1), transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)), #0d0d0d',
                    minHeight: 212,
                    padding: 10,
                    marginTop: 20,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 10,
                      borderRadius: 16,
                      border: '1px solid rgba(255,255,255,0.05)',
                      pointerEvents: 'none',
                    }}
                  />

                  <img
                    src="/images/home-series-geek-bar-pulse-x-7x4.png"
                    alt="GEEK BAR PULSE X Series"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    style={{
                      width: '100%',
                      height: 192,
                      objectFit: 'cover',
                      objectPosition: 'center',
                      display: 'block',
                      filter: 'saturate(0.92) contrast(1.03)',
                      transform: 'scale(1.02)',
                      transformOrigin: 'center',
                      borderRadius: 16,
                    }}
                  />
                </div>
              </div>
            </section>
          </>
        ) : (
          <>
        <section
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: isMobile ? 28 : 36,
            border: '1px solid rgba(255,255,255,0.08)',
            background:
              'linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.015) 34%, rgba(255,255,255,0.025) 100%), #0d0d0d',
            boxShadow: '0 34px 140px rgba(0,0,0,0.5)',
            padding: isMobile ? '26px 20px 24px' : '60px 56px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at top right, rgba(255,255,255,0.12), transparent 28%), radial-gradient(circle at bottom left, rgba(255,255,255,0.05), transparent 30%)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: isCompact ? '1fr' : '1.08fr 0.92fr',
              gap: isMobile ? 20 : 36,
              alignItems: 'stretch',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <p
                  style={{
                    margin: 0,
                    marginBottom: isMobile ? 14 : 22,
                    color: '#9a9a9a',
                    letterSpacing: 3,
                    fontSize: 12,
                    textTransform: 'uppercase',
                  }}
                >
                  U.S. Wholesale Supply
                </p>

                <h1
                  style={{
                    margin: 0,
                    maxWidth: 700,
                    fontSize: isMobile ? 40 : isCompact ? 54 : 72,
                    lineHeight: 0.98,
                    fontWeight: 700,
                    letterSpacing: isMobile ? -1.5 : -2.6,
                  }}
                >
                  Premium wholesale supply for retail stores that expect consistency.
                </h1>

                <p
                  style={{
                    marginTop: 22,
                    marginBottom: 0,
                    maxWidth: isMobile ? '100%' : 540,
                    color: '#b3b3b3',
                    fontSize: isMobile ? 14 : 15,
                    lineHeight: isMobile ? 1.72 : 1.85,
                  }}
                >
                  Wholesale pricing, store delivery, and dependable replenishment for U.S. retail
                  partners operating with long-term account expectations.
                </p>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 10,
                    marginTop: isMobile ? 22 : 32,
                  }}
                >
                  {heroSignals.map((text) => (
                    <SignalPill key={text} text={text} />
                  ))}
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: 12,
                    marginTop: isMobile ? 24 : 38,
                    flexWrap: 'wrap',
                  }}
                >
                  <ButtonLink to="/products">View Wholesale Catalog</ButtonLink>
                  <ButtonLink to="/account" variant="secondary">
                    Open Trade Account
                  </ButtonLink>
                </div>
              </div>
            </div>

            <div
                style={{
                  display: 'grid',
                  gridTemplateRows: '1fr auto',
                  gap: isMobile ? 14 : 18,
                }}
              >
              <div
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: isMobile ? 26 : 34,
                  border: '1px solid rgba(255,255,255,0.06)',
                  background:
                    'radial-gradient(circle at top, rgba(255,255,255,0.14), transparent 24%), linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01)), #0f0f0f',
                  minHeight: isMobile ? 420 : isCompact ? 500 : 590,
                  padding: isMobile ? 8 : 10,
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 32px 100px rgba(0,0,0,0.32)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 10,
                    borderRadius: 30,
                    background:
                      'linear-gradient(180deg, rgba(0,0,0,0.01), rgba(0,0,0,0.26) 44%, rgba(0,0,0,0.48) 100%), radial-gradient(circle at 50% 0%, rgba(255,255,255,0.1), transparent 32%)',
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: isMobile ? 12 : 18,
                    borderRadius: isMobile ? 20 : 26,
                    border: '1px solid rgba(255,255,255,0.05)',
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '10%',
                    width: '58%',
                    height: '48%',
                    transform: 'translateX(-50%)',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.14), transparent 70%)',
                    filter: 'blur(34px)',
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: isMobile ? 18 : 26,
                    left: isMobile ? 18 : 26,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: isMobile ? '8px 11px' : '10px 14px',
                    borderRadius: 999,
                    border: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(8,8,8,0.28)',
                  backdropFilter: 'blur(8px)',
                  fontSize: isMobile ? 10 : 11,
                  letterSpacing: 1.4,
                  textTransform: 'uppercase',
                  color: '#56e3a6',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 0 20px rgba(56,211,159,0.08)',
                  zIndex: 2,
                }}
              >
                  Featured Wholesale Product
                </div>

                <img
                  src="/images/home-hero-geek-bar-pulse-x.png"
                  alt="GEEK BAR PULSE X"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: '100%',
                    minHeight: isMobile ? 404 : 540,
                    objectFit: 'cover',
                    objectPosition: 'center top',
                    borderRadius: 30,
                    display: 'block',
                    filter: 'saturate(0.88) contrast(1.1)',
                    transform: 'scale(1.02)',
                    transformOrigin: 'center',
                  }}
                />

                <div
                  style={{
                    position: 'absolute',
                    left: isMobile ? 16 : 24,
                    right: isMobile ? 16 : 24,
                    bottom: isMobile ? 16 : 24,
                    display: 'grid',
                    gap: isMobile ? 10 : 14,
                    padding: isMobile ? 14 : 20,
                    borderRadius: isMobile ? 18 : 24,
                    background: 'rgba(8,8,8,0.52)',
                    backdropFilter: 'blur(14px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    zIndex: 2,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      paddingBottom: 14,
                      borderBottom: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <div>
                      <p
                        style={{
                          margin: 0,
                          marginBottom: 10,
                          color: '#a0a0a0',
                          fontSize: isMobile ? 11 : 12,
                          letterSpacing: 1.6,
                          textTransform: 'uppercase',
                        }}
                      >
                        GEEK BAR PULSE X
                      </p>
                      <h3
                        style={{
                          margin: 0,
                          maxWidth: 540,
                          fontSize: isMobile ? 22 : 28,
                          lineHeight: 1.1,
                        }}
                      >
                        Premium shelf presence for repeat store replenishment.
                      </h3>
                    </div>
                  </div>

                  <p
                    style={{
                      margin: 0,
                      color: '#c9c9c9',
                      fontSize: isMobile ? 13 : 14,
                      lineHeight: isMobile ? 1.65 : 1.75,
                      maxWidth: 430,
                    }}
                  >
                    Designed for retail accounts that expect presentation quality, stable movement,
                    and disciplined reorder flow.
                  </p>

                  <p
                    style={{
                      margin: 0,
                      color: '#e7e7e7',
                      fontSize: isMobile ? 12.5 : 13,
                      lineHeight: 1.5,
                      fontWeight: 500,
                    }}
                  >
                    Browse the full series from View Wholesale Catalog.
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 8,
                      paddingTop: 2,
                    }}
                  >
                    {featuredHighlights.slice(0, 2).map((item) => (
                      <span
                        key={item}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '7px 11px',
                          borderRadius: 999,
                          border: '1px solid rgba(255,255,255,0.07)',
                          background: 'rgba(10,10,10,0.26)',
                          color: '#e3e3e3',
                          fontSize: 11,
                          letterSpacing: 0.35,
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section style={{ marginTop: 34 }}>
          <div
            style={{
              borderRadius: isMobile ? 20 : 24,
              border: '1px solid rgba(255,255,255,0.08)',
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.015)), #0e0e0e',
              padding: isMobile ? '18px 16px 18px' : '20px 24px 22px',
              boxShadow: '0 18px 56px rgba(0,0,0,0.22)',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'end',
                gap: 24,
                marginBottom: 18,
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    marginBottom: 8,
                    color: '#878787',
                    letterSpacing: 1.8,
                    fontSize: 11,
                    textTransform: 'uppercase',
                  }}
                >
                  Wholesale Confidence
                </p>
                <h2 style={{ margin: 0, fontSize: isMobile ? 21 : 24, lineHeight: 1.08 }}>
                  Built for repeat store ordering.
                </h2>
              </div>

              <p
                style={{
                  margin: 0,
                  maxWidth: 480,
                  color: '#9f9f9f',
                  fontSize: 14,
                  lineHeight: 1.7,
                  textAlign: isMobile ? 'left' : 'right',
                }}
              >
                A concise operating layer around pricing, delivery, replenishment, and trade
                account continuity.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile
                  ? '1fr'
                  : isCompact
                    ? 'repeat(2, minmax(0, 1fr))'
                    : 'repeat(4, minmax(0, 1fr))',
                gap: 14,
              }}
            >
              {trustProofPoints.map((point) => (
                <div
                  key={point.title}
                  style={{
                    padding: '16px 16px 14px',
                    borderRadius: 18,
                    border: '1px solid rgba(255,255,255,0.07)',
                    background: 'rgba(255,255,255,0.02)',
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      marginBottom: 8,
                      color: '#f2f2f2',
                      fontSize: 14,
                      lineHeight: 1.35,
                      fontWeight: 600,
                    }}
                  >
                    {point.title}
                  </p>

                  <p
                    style={{
                      margin: 0,
                      color: '#9c9c9c',
                      fontSize: 12.5,
                      lineHeight: 1.65,
                    }}
                  >
                    {point.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ marginTop: isMobile ? 72 : 104 }}>
          <div
            style={{
              borderRadius: isMobile ? 26 : 32,
              border: '1px solid rgba(255,255,255,0.08)',
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015)), #0f0f0f',
              padding: isMobile ? '24px 18px 24px' : '34px 34px 36px',
              boxShadow: '0 24px 80px rgba(0,0,0,0.28)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'flex-start' : 'end',
                gap: 24,
                flexWrap: 'wrap',
                marginBottom: 18,
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    marginBottom: 10,
                    color: '#8e8e8e',
                    letterSpacing: 2,
                    fontSize: 12,
                    textTransform: 'uppercase',
                  }}
                >
                  Retail Partners
                </p>
                <h2 style={{ margin: 0, fontSize: isMobile ? 25 : 31, lineHeight: 1.08 }}>
                  Structured around the store environments we actually support.
                </h2>
              </div>

              <p
                style={{
                  margin: 0,
                  maxWidth: 430,
                  color: '#a8a8a8',
                  fontSize: isMobile ? 13 : 14,
                  lineHeight: 1.7,
                }}
              >
                A clearer view of the account types we support across store delivery, replenishment,
                and trade continuity.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : isCompact ? '1fr' : 'repeat(3, minmax(0, 1fr))',
                gap: 16,
                marginTop: 6,
              }}
            >
              {retailPartnerCards.map((card, index) => (
                <div
                  key={card.title}
                  style={{
                    borderRadius: 22,
                    border: '1px solid rgba(255,255,255,0.08)',
                    background:
                      'radial-gradient(circle at top left, rgba(255,255,255,0.08), transparent 34%), linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.018)), #121212',
                    padding: isMobile ? '18px 18px 16px' : 22,
                    minHeight: isMobile ? 'auto' : 188,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 18px 54px rgba(0,0,0,0.2)',
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: isMobile ? 14 : 18,
                      }}
                    >
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: 38,
                          height: 26,
                          padding: '0 10px',
                          borderRadius: 999,
                          border: '1px solid rgba(255,255,255,0.08)',
                          background: 'rgba(255,255,255,0.03)',
                          color: '#d6d6d6',
                          fontSize: 11,
                          letterSpacing: 1.2,
                          textTransform: 'uppercase',
                        }}
                      >
                        {`0${index + 1}`}
                      </div>

                      <div
                        style={{
                          width: isMobile ? 24 : 34,
                          height: isMobile ? 24 : 34,
                          borderRadius: 999,
                          border: '1px solid rgba(255,255,255,0.08)',
                          background: 'rgba(255,255,255,0.03)',
                        }}
                      />
                    </div>

                    <h3
                      style={{
                        marginTop: 0,
                        marginBottom: isMobile ? 10 : 12,
                        fontSize: isMobile ? 17 : 22,
                        lineHeight: isMobile ? 1.18 : 1.12,
                      }}
                    >
                      {card.title}
                    </h3>

                    <p
                      style={{
                        margin: 0,
                        color: '#adadad',
                        fontSize: isMobile ? 12.5 : 13.5,
                        lineHeight: isMobile ? 1.58 : 1.65,
                        maxWidth: isMobile ? '100%' : 300,
                      }}
                    >
                      {card.description}
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 8,
                      marginTop: isMobile ? 16 : 20,
                    }}
                  >
                    {card.points.map((point) => (
                      <span
                        key={point}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '7px 11px',
                          borderRadius: 999,
                          border: '1px solid rgba(255,255,255,0.08)',
                          background: 'rgba(255,255,255,0.03)',
                          color: '#e4e4e4',
                          fontSize: 11.5,
                          letterSpacing: 0.3,
                        }}
                      >
                        {point}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {isMobile ? (
              <div style={{ marginTop: 20, display: 'grid', gap: 12 }}>
                <RetailPartnerMobileCard card={retailPartnerCards[0]} index={1} />

                <div
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 28,
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: '#111',
                    minHeight: 240,
                  }}
                >
                  <img
                    src="/images/retail-display-geek-bar-pulse-x.png"
                    alt="GEEK BAR PULSE X retail display in store"
                    style={{
                      width: '100%',
                      height: '100%',
                      minHeight: 240,
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />

                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(180deg, rgba(0,0,0,0.06), rgba(0,0,0,0.58) 78%, rgba(0,0,0,0.78) 100%)',
                    }}
                  />

                  <div
                    style={{
                      position: 'absolute',
                      left: 16,
                      right: 16,
                      bottom: 16,
                    }}
                  >
                    <p
                      style={{
                        marginTop: 0,
                        marginBottom: 10,
                        color: '#9e9e9e',
                        fontSize: 11,
                        letterSpacing: 1.5,
                        textTransform: 'uppercase',
                      }}
                    >
                      Retail display
                    </p>
                    <h3
                      style={{
                        margin: 0,
                        marginBottom: 10,
                        fontSize: 21,
                        lineHeight: 1.12,
                      }}
                    >
                      Shelf-ready presentation for store-facing retail environments.
                    </h3>
                  </div>
                </div>

                <RetailPartnerMobileCard card={retailPartnerCards[2]} index={2} />

                <div
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 28,
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: '#111',
                    minHeight: 240,
                  }}
                >
                  <img
                    src="/images/delivery-geek-bar-pulse-x-retail-store.png"
                    alt="GEEK BAR PULSE X wholesale delivery to retail store"
                    style={{
                      width: '100%',
                      height: '100%',
                      minHeight: 240,
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />

                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.6) 78%, rgba(0,0,0,0.8) 100%)',
                    }}
                  />

                  <div
                    style={{
                      position: 'absolute',
                      left: 16,
                      right: 16,
                      bottom: 16,
                    }}
                  >
                    <p
                      style={{
                        marginTop: 0,
                        marginBottom: 10,
                        color: '#9e9e9e',
                        fontSize: 11,
                        letterSpacing: 1.5,
                        textTransform: 'uppercase',
                      }}
                    >
                      Store delivery
                    </p>
                    <h3
                      style={{
                        margin: 0,
                        marginBottom: 10,
                        fontSize: 21,
                        lineHeight: 1.12,
                      }}
                    >
                      Delivery support aligned with real retail receiving workflows.
                    </h3>
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  marginTop: 20,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: 18,
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 28,
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: '#111',
                    minHeight: 300,
                  }}
                >
                  <img
                    src="/images/retail-display-geek-bar-pulse-x.png"
                    alt="GEEK BAR PULSE X retail display in store"
                    style={{
                      width: '100%',
                      height: '100%',
                      minHeight: 300,
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />

                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(180deg, rgba(0,0,0,0.06), rgba(0,0,0,0.58) 78%, rgba(0,0,0,0.78) 100%)',
                    }}
                  />

                  <div
                    style={{
                      position: 'absolute',
                      left: 22,
                      right: 22,
                      bottom: 22,
                    }}
                  >
                    <p
                      style={{
                        marginTop: 0,
                        marginBottom: 10,
                        color: '#9e9e9e',
                        fontSize: 11,
                        letterSpacing: 1.5,
                        textTransform: 'uppercase',
                      }}
                    >
                      Retail display
                    </p>
                    <h3
                      style={{
                        margin: 0,
                        marginBottom: 10,
                        fontSize: 24,
                        lineHeight: 1.12,
                      }}
                    >
                      Shelf-ready presentation for store-facing retail environments.
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        maxWidth: 440,
                        color: '#c9c9c9',
                        fontSize: 14,
                        lineHeight: 1.75,
                      }}
                    >
                      Visual merchandising that feels credible for smoke shops, convenience stores,
                      and premium retail counters.
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 28,
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: '#111',
                    minHeight: 300,
                  }}
                >
                  <img
                    src="/images/delivery-geek-bar-pulse-x-retail-store.png"
                    alt="GEEK BAR PULSE X wholesale delivery to retail store"
                    style={{
                      width: '100%',
                      height: '100%',
                      minHeight: 300,
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />

                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.6) 78%, rgba(0,0,0,0.8) 100%)',
                    }}
                  />

                  <div
                    style={{
                      position: 'absolute',
                      left: 22,
                      right: 22,
                      bottom: 22,
                    }}
                  >
                    <p
                      style={{
                        marginTop: 0,
                        marginBottom: 10,
                        color: '#9e9e9e',
                        fontSize: 11,
                        letterSpacing: 1.5,
                        textTransform: 'uppercase',
                      }}
                    >
                      Store delivery
                    </p>
                    <h3
                      style={{
                        margin: 0,
                        marginBottom: 10,
                        fontSize: 24,
                        lineHeight: 1.12,
                      }}
                    >
                      Delivery support aligned with real retail receiving workflows.
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        maxWidth: 440,
                        color: '#c9c9c9',
                        fontSize: 14,
                        lineHeight: 1.75,
                      }}
                    >
                      Account supply coordination designed for repeat replenishment, store delivery,
                      and practical wholesale follow-up.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section style={{ marginTop: isMobile ? 72 : 108 }}>
          <div
            style={{
              borderRadius: isMobile ? 26 : 32,
              border: '1px solid rgba(255,255,255,0.08)',
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015)), #0f0f0f',
              padding: isMobile ? '20px 16px 18px' : '30px 30px 32px',
              boxShadow: '0 22px 72px rgba(0,0,0,0.24)',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '0.94fr 1.06fr',
                gap: isMobile ? 18 : 28,
                alignItems: 'center',
              }}
            >
              <div style={{ maxWidth: isMobile ? '100%' : 470 }}>
                <p
                  style={{
                    margin: 0,
                    marginBottom: 8,
                    color: '#8e8e8e',
                    letterSpacing: 2,
                    fontSize: 12,
                    textTransform: 'uppercase',
                  }}
                >
                  Featured Wholesale Series
                </p>
                <h2
                  style={{
                    margin: 0,
                    fontSize: isMobile ? 20 : 36,
                    lineHeight: isMobile ? 1.04 : 1.06,
                    maxWidth: 820,
                    whiteSpace: isMobile ? 'nowrap' : 'normal',
                    letterSpacing: isMobile ? -1 : 0,
                  }}
                >
                  GEEK BAR PULSE X Series
                </h2>
                <p
                  style={{
                    margin: 0,
                    marginTop: 12,
                    maxWidth: isMobile ? '100%' : 420,
                    color: '#a3a3a3',
                    fontSize: isMobile ? 13.5 : 15,
                    lineHeight: isMobile ? 1.6 : 1.75,
                  }}
                >
                  Shelf-ready wholesale SKUs built for repeat retail ordering.
                </p>

                <div
                  style={{
                    display: 'flex',
                    gap: 7,
                    flexWrap: 'wrap',
                    marginTop: 16,
                  }}
                >
                  <SeriesMetaTag text="2 SKUs" />
                  <SeriesMetaTag text="Shelf-ready" />
                  <SeriesMetaTag text="Repeat ordering" />
                </div>

                <div
                  style={{
                    marginTop: 18,
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: 10,
                    alignItems: isMobile ? 'stretch' : 'flex-start',
                  }}
                >
                  <ButtonLink to="/products">View Wholesale Catalog</ButtonLink>
                  {isMobile ? (
                    <ButtonLink to="/account" variant="secondary">
                      Open Trade Account
                    </ButtonLink>
                  ) : null}
                </div>
              </div>

              <div
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 28,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background:
                    'radial-gradient(circle at top, rgba(255,255,255,0.1), transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)), #0d0d0d',
                  minHeight: isMobile ? 176 : 340,
                  padding: isMobile ? 10 : 16,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: isMobile ? 10 : 14,
                    borderRadius: isMobile ? 16 : 20,
                    border: '1px solid rgba(255,255,255,0.05)',
                    pointerEvents: 'none',
                  }}
                />

                <img
                  src="/images/home-series-geek-bar-pulse-x-7x4.png"
                  alt="GEEK BAR PULSE X Series"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: isMobile ? 152 : 308,
                    objectFit: 'cover',
                    objectPosition: isMobile ? 'center 50%' : 'center',
                    display: 'block',
                    filter: 'saturate(0.92) contrast(1.03)',
                    transform: isMobile ? 'scale(1.08)' : 'scale(1.08)',
                    transformOrigin: 'center',
                  }}
                />

                {!isMobile ? (
                  <div
                    style={{
                      position: 'absolute',
                      left: 20,
                      bottom: 20,
                      padding: '9px 13px',
                      borderRadius: 999,
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(8,8,8,0.42)',
                      backdropFilter: 'blur(10px)',
                      color: '#ececec',
                      fontSize: 12,
                      letterSpacing: 0.3,
                    }}
                  >
                    Series preview
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>
          </>
        )}
      </div>
    </div>
  )
}

function SignalPill({ text, compact = false }: { text: string; compact?: boolean }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: compact ? '8px 12px' : '10px 14px',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 999,
        background: 'rgba(255,255,255,0.03)',
        fontSize: compact ? 11 : 12,
        color: '#dddddd',
        letterSpacing: compact ? 0.25 : 0.4,
      }}
    >
      {text}
    </div>
  )
}

function AgeSignal({ text }: { text: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '8px 12px',
        borderRadius: 999,
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'rgba(255,255,255,0.04)',
        color: '#f0e6e6',
        fontSize: 11.5,
        letterSpacing: 0.3,
      }}
    >
      {text}
    </span>
  )
}

function SeriesMetaTag({ text }: { text: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '7px 11px',
        borderRadius: 999,
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.025)',
        color: '#d7d7d7',
        fontSize: 11.5,
        letterSpacing: 0.25,
      }}
    >
      {text}
    </span>
  )
}

function RetailPartnerMobileCard({
  card,
  index,
}: {
  card: { title: string; description: string; points: string[] }
  index: number
}) {
  return (
    <div
      style={{
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.08)',
        background:
          'radial-gradient(circle at top left, rgba(255,255,255,0.07), transparent 34%), linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.018)), #121212',
        padding: '14px 14px 12px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 36,
            height: 24,
            padding: '0 10px',
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.03)',
            color: '#d6d6d6',
            fontSize: 11,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
          }}
        >
          {`0${index}`}
        </div>
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.03)',
          }}
        />
      </div>

      <h3 style={{ margin: 0, fontSize: 18, lineHeight: 1.14 }}>{card.title}</h3>
      <p
        style={{
          margin: 0,
          marginTop: 8,
          color: '#adadad',
          fontSize: 12.5,
          lineHeight: 1.56,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {card.description}
      </p>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 7,
          marginTop: 12,
        }}
      >
        {card.points.map((point) => (
          <span
            key={point}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '6px 10px',
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
              color: '#e4e4e4',
              fontSize: 11,
              letterSpacing: 0.2,
            }}
          >
            {point}
          </span>
        ))}
      </div>
    </div>
  )
}

const ageActionButtonStyle: React.CSSProperties = {
  height: 54,
  borderRadius: 999,
  border: '1px solid rgba(255,255,255,0.16)',
  background: 'transparent',
  color: '#fff',
  cursor: 'pointer',
  fontSize: 15,
  fontWeight: 600,
  transition: '0.2s ease',
}
