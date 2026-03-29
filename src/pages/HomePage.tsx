import { ButtonLink } from '../components/ui/Button'

export default function HomePage() {
  return (
    <div
      style={{
        padding: '80px 40px',
        background: '#0a0a0a',
        color: '#fff',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 80,
        }}
      >
        <div style={{ maxWidth: 600 }}>
          <p
            style={{
              color: '#888',
              letterSpacing: 2,
              fontSize: 12,
              marginBottom: 16,
            }}
          >
            WHOLESALE-FOCUSED STOREFRONT
          </p>

          <h1
            style={{
              fontSize: 52,
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: 20,
            }}
          >
            A cleaner wholesale storefront for a focused vape product line.
          </h1>

          <p
            style={{
              color: '#aaa',
              marginBottom: 30,
              fontSize: 16,
            }}
          >
            Built for a small catalog, faster buying, and easier content updates.
          </p>

          <div style={{ display: 'flex', gap: 16 }}>
            <ButtonLink to="/products">Shop Products</ButtonLink>
            <ButtonLink to="/contact" variant="secondary">
              Contact Sales
            </ButtonLink>
          </div>

          <div
            style={{
              marginTop: 40,
              display: 'flex',
              gap: 16,
            }}
          >
            <Feature text="Focused catalog" />
            <Feature text="Fast ordering" />
            <Feature text="Professional UI" />
          </div>
        </div>

        <div
          style={{
            width: 340,
            borderRadius: 20,
            padding: 24,
            background: '#111',
            border: '1px solid #222',
          }}
        >
          <img
            src="/images/qiyu-hero.png"
            alt="QiYu Ultra"
            style={{
              width: '100%',
              borderRadius: 12,
              marginBottom: 16,
            }}
          />

          <p style={{ color: '#888', fontSize: 12 }}>FEATURED PRODUCT</p>

          <h3 style={{ fontSize: 22, margin: '10px 0' }}>
            QiYu Ultra 6000
          </h3>

          <p style={{ color: '#aaa', fontSize: 14 }}>
            6000 puffs with smooth draw and premium metallic finish.
          </p>

          <p
            style={{
              marginTop: 12,
              fontWeight: 600,
              fontSize: 18,
            }}
          >
            $14.99
          </p>
        </div>
      </div>

      <div style={{ marginTop: 120 }}>
        <h2 style={{ fontSize: 30, marginBottom: 40 }}>
          Featured Products
        </h2>

        <div
          style={{
            display: 'flex',
            gap: 30,
          }}
        >
          <ProductCard
            name="QiYu Ultra 6000"
            price="$12.99"
          />
          <ProductCard
            name="QiYu Mini 4000"
            price="$12.99"
          />
        </div>
      </div>
    </div>
  )
}

function Feature({ text }: { text: string }) {
  return (
    <div
      style={{
        padding: '10px 14px',
        border: '1px solid #222',
        borderRadius: 12,
        fontSize: 12,
      }}
    >
      {text}
    </div>
  )
}

function ProductCard({
  name,
  price,
}: {
  name: string
  price: string
}) {
  return (
    <div
      style={{
        flex: 1,
        background: '#111',
        padding: 20,
        borderRadius: 16,
        border: '1px solid #222',
        transition: '0.3s',
      }}
    >
      <img
        src="/images/qiyu-products.png"
        alt={name}
        style={{
          width: '100%',
          borderRadius: 10,
          marginBottom: 12,
        }}
      />

      <h4 style={{ fontSize: 18 }}>{name}</h4>

      <p style={{ color: '#888', fontSize: 14 }}>
        High performance disposable vape.
      </p>

      <p
        style={{
          marginTop: 10,
          fontWeight: 600,
        }}
      >
        {price}
      </p>
    </div>
  )
}