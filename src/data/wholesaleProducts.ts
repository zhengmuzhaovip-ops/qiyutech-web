export type WholesaleProduct = {
  id: string
  slug: string
  name: string
  shortName: string
  flavor: string
  price: number
  stock: number
  image: string
  gallery: string[]
  shortDescription: string
  description: string
  badge: string
  highlights: string[]
  specs: Array<{ label: string; value: string }>
}

export const wholesaleProducts: WholesaleProduct[] = [
  {
    id: 'geek-bar-pulse-x-pear-of-thieves',
    slug: 'qiyu-ultra-6000',
    name: 'GEEK BAR PULSE X — Pear Of Thieves',
    shortName: 'GEEK BAR PULSE X',
    flavor: 'Pear Of Thieves',
    price: 12.99,
    stock: 128,
    image: '/images/catalog-geek-bar-pulse-x-pear-of-thieves.png',
    gallery: [
      '/images/detail-geek-bar-pulse-x-pear-of-thieves-hero.png',
      '/images/detail-geek-bar-pulse-x-pear-of-thieves-packaging-back.png',
      '/images/detail-geek-bar-pulse-x-pear-of-thieves-macro.png',
    ],
    shortDescription:
      'Pear Of Thieves format with premium shelf presence and dependable wholesale reordering.',
    description:
      'GEEK BAR PULSE X — Pear Of Thieves is built for U.S. retail stores that need dependable wholesale supply, stronger shelf presentation, and a premium flavor-led SKU suited to repeat replenishment.',
    badge: 'Best Seller',
    highlights: [
      'Premium finish for store-ready presentation',
      'Wholesale-friendly for repeat replenishment',
      'Organized for efficient account ordering',
    ],
    specs: [
      { label: 'Flavor', value: 'Pear Of Thieves' },
      { label: 'Battery', value: 'Rechargeable' },
      { label: 'Product Type', value: 'Disposable Vape' },
      { label: 'Market', value: 'U.S. Retail Stores' },
    ],
  },
  {
    id: 'geek-bar-pulse-x-raspberry-peach-lime',
    slug: 'qiyu-mini-4000',
    name: 'GEEK BAR PULSE X — Raspberry Peach Lime',
    shortName: 'GEEK BAR PULSE X',
    flavor: 'Raspberry Peach Lime',
    price: 12.99,
    stock: 86,
    image: '/images/catalog-geek-bar-pulse-x-raspberry-peach-lime.png',
    gallery: [
      '/images/detail-geek-bar-pulse-x-raspberry-peach-lime-hero.png',
      '/images/detail-geek-bar-pulse-x-raspberry-peach-lime-packaging-back.png',
      '/images/detail-geek-bar-pulse-x-raspberry-peach-lime-macro.png',
    ],
    shortDescription:
      'Raspberry Peach Lime profile suited to smoke shops and streamlined restocking.',
    description:
      'GEEK BAR PULSE X — Raspberry Peach Lime offers a flavor-forward wholesale option for retailers that need clean shelf assortment, practical reorder volume, and a premium presentation.',
    badge: 'Flavor Focus',
    highlights: [
      'Flavor-led profile for retail assortment',
      'Well suited to smoke shops and convenience stores',
      'Consistent presentation across reorder cycles',
    ],
    specs: [
      { label: 'Flavor', value: 'Raspberry Peach Lime' },
      { label: 'Battery', value: 'Integrated' },
      { label: 'Product Type', value: 'Disposable Vape' },
      { label: 'Market', value: 'U.S. Retail Stores' },
    ],
  },
]

export function getWholesaleProductBySlug(slug: string) {
  return wholesaleProducts.find((product) => product.slug === slug)
}
