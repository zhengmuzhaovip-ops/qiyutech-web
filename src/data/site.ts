import type { Product, SiteSettings } from '../types';

export const siteSettings: SiteSettings = {
  brandName: 'QiYuTech',
  heroTitle: 'A cleaner wholesale storefront for a focused vape product line.',
  heroSubtitle:
    'Built for a small catalog, faster buying, and easier content updates. No bloated marketplace feeling.',
  heroPrimaryCtaLabel: 'Shop Products',
  heroPrimaryCtaHref: '/products',
  heroSecondaryCtaLabel: 'Contact Sales',
  heroSecondaryCtaHref: '/account',
  phone: '+1 (800) 555-0199',
  whatsapp: '+1 800 555 0199',
  whatsappUrl: 'https://wa.me/18005550199',
  email: 'sales@qiyutechs.com',
  address: 'Shenzhen, China',
  footerCopyright: '© 2026 QiYuTech. All rights reserved.',
  featureBullets: ['Focused catalog', 'Fast wholesale ordering', 'Professional product presentation'],
};

export const products: Product[] = [
  {
    id: 'pod-01',
    slug: 'qiyu-ultra-6000',
    name: 'QiYu Ultra 6000',
    tagline: 'Balanced flavor delivery with a compact premium body.',
    price: 14.99,
    compareAtPrice: 18.99,
    shortDescription: '6000 puffs with fast draw activation and a clean metallic finish.',
    description:
      'QiYu Ultra 6000 is designed for distributors and retail buyers who want a polished, compact device with clear product communication and dependable day-to-day usability.',
    image: '/images/products/ultra-6000-main.jpg',
    gallery: [
      '/images/products/ultra-6000-main.jpg',
      '/images/products/ultra-6000-angle.jpg',
      '/images/products/ultra-6000-packaging.jpg',
    ],
    flavors: ['Blue Razz Ice', 'Watermelon Mint', 'Mango Peach'],
    features: ['Rechargeable USB-C', 'Mesh coil flavor output', 'Compact wholesale-ready packaging'],
    specs: [
      { label: 'Puffs', value: '6000' },
      { label: 'Battery', value: '650mAh' },
      { label: 'Charging', value: 'USB-C' },
      { label: 'Nicotine', value: '5%' },
    ],
    isFeatured: true,
  },
  {
    id: 'pod-02',
    slug: 'qiyu-max-12000',
    name: 'QiYu Max 12000',
    tagline: 'Longer battery life with a stronger shelf presence.',
    price: 19.99,
    compareAtPrice: 24.99,
    shortDescription: '12000 puffs with a larger body and clearer feature-focused merchandising.',
    description:
      'QiYu Max 12000 is built for a small premium catalog and works best when featured as a hero product with simplified ordering and high-clarity specs.',
    image: '/images/products/max-12000-main.jpg',
    gallery: [
      '/images/products/max-12000-main.jpg',
      '/images/products/max-12000-angle.jpg',
      '/images/products/max-12000-packaging.jpg',
    ],
    flavors: ['Grape Ice', 'Lush Ice', 'Strawberry Kiwi'],
    features: ['High-capacity battery', 'Large e-liquid volume', 'Retail display friendly box design'],
    specs: [
      { label: 'Puffs', value: '12000' },
      { label: 'Battery', value: '850mAh' },
      { label: 'Charging', value: 'USB-C' },
      { label: 'Nicotine', value: '5%' },
    ],
    isFeatured: true,
  },
];
