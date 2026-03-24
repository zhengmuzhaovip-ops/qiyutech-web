export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  inStock: boolean;
  rating: number;
  reviews: number;
  badge?: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Beiinfun 30,000 Puffs Disposable',
    price: 10.50,
    originalPrice: 14.99,
    image: '/images/product-1.png',
    category: 'disposables',
    description: 'The Beiinfun 30,000 Puffs Disposable Vape delivers an exceptional vaping experience with its massive puff count and premium flavor options. Featuring a sleek design and long-lasting battery, this device is perfect for vapers who want convenience without compromising on quality.',
    features: [
      '30,000 puffs per device',
      'Rechargeable Type-C port',
      'Adjustable airflow control',
      'LED display screen',
      'Multiple flavor options',
    ],
    specifications: {
      'Puff Count': '30,000',
      'Battery Capacity': '650mAh',
      'E-Liquid Capacity': '18ml',
      'Nicotine Strength': '5% (50mg)',
      'Charging': 'Type-C',
      'Dimensions': '85mm x 45mm x 22mm',
    },
    inStock: true,
    rating: 4.8,
    reviews: 245,
    badge: 'NEW',
  },
  {
    id: 2,
    name: 'KUMI Oro 40K Puffs Disposable Vape',
    price: 63.75,
    originalPrice: 79.99,
    image: '/images/product-2.png',
    category: 'disposables',
    description: 'Experience luxury vaping with the KUMI Oro 40K Puffs Disposable. This premium device features a stunning gold finish and delivers an impressive 40,000 puffs of rich, flavorful vapor. The advanced mesh coil technology ensures consistent flavor from the first puff to the last.',
    features: [
      '40,000 puffs per device',
      'Premium gold finish design',
      'Advanced mesh coil technology',
      'Smart display screen',
      'Dual airflow system',
    ],
    specifications: {
      'Puff Count': '40,000',
      'Battery Capacity': '1000mAh',
      'E-Liquid Capacity': '25ml',
      'Nicotine Strength': '5% (50mg)',
      'Charging': 'Type-C Fast Charge',
      'Dimensions': '95mm x 50mm x 25mm',
    },
    inStock: true,
    rating: 4.9,
    reviews: 189,
    badge: 'PREMIUM',
  },
  {
    id: 3,
    name: 'SMOK Nord Replacement Pod',
    price: 4.75,
    originalPrice: 6.99,
    image: '/images/product-3.png',
    category: 'accessories',
    description: 'Genuine SMOK Nord Replacement Pods designed for optimal performance with your SMOK Nord device. These high-quality pods feature a 3ml e-liquid capacity and are compatible with Nord coils for a customizable vaping experience.',
    features: [
      '3ml e-liquid capacity',
      'Easy side-fill design',
      'Compatible with Nord coils',
      'Leak-resistant construction',
      'Pack of 3 pods',
    ],
    specifications: {
      'Capacity': '3ml',
      'Material': 'PCTG',
      'Coil Compatibility': 'Nord Coils',
      'Quantity': '3 per pack',
      'Connection': 'Magnetic',
    },
    inStock: true,
    rating: 4.6,
    reviews: 523,
  },
  {
    id: 4,
    name: 'Unflavored 100ml E-Juice',
    price: 8.75,
    originalPrice: 12.99,
    image: '/images/product-4.png',
    category: 'e-liquids',
    description: 'Pure unflavored e-liquid base for DIY mixing or those who prefer a clean, pure vaping experience. Made with pharmaceutical-grade ingredients and available in various VG/PG ratios to suit your preference.',
    features: [
      'Pharmaceutical-grade ingredients',
      'Customizable VG/PG ratio',
      'Perfect for DIY mixing',
      'Child-resistant cap',
      'Large 100ml bottle',
    ],
    specifications: {
      'Volume': '100ml',
      'VG/PG Ratio': '70/30 (Customizable)',
      'Nicotine': '0mg (Add your own)',
      'Bottle Type': 'Chubby Gorilla',
      'Origin': 'USA Made',
    },
    inStock: true,
    rating: 4.4,
    reviews: 156,
  },
  {
    id: 5,
    name: 'Smogger GB50000 Puff Disposable',
    price: 17.50,
    originalPrice: 24.99,
    image: '/images/product-5.png',
    category: 'disposables',
    description: 'The Smogger GB50000 sets a new standard for disposable vapes with an incredible 50,000 puff capacity. Featuring a massive 18ml e-liquid reservoir and a powerful rechargeable battery, this device is built to last.',
    features: [
      'Massive 50,000 puff capacity',
      '18ml e-liquid reservoir',
      'Rechargeable 850mAh battery',
      'Dual mesh coil system',
      'Adjustable airflow',
    ],
    specifications: {
      'Puff Count': '50,000',
      'Battery Capacity': '850mAh',
      'E-Liquid Capacity': '18ml',
      'Nicotine Strength': '5% (50mg)',
      'Charging': 'Type-C',
      'Coil Type': 'Dual Mesh',
    },
    inStock: true,
    rating: 4.7,
    reviews: 312,
    badge: 'BEST SELLER',
  },
  {
    id: 6,
    name: 'Salt Bae 50 40K Puff Disposable',
    price: 13.99,
    originalPrice: 18.99,
    image: '/images/product-6.png',
    category: 'disposables',
    description: 'Salt Bae 50 delivers a premium vaping experience with 40,000 puffs of smooth, satisfying vapor. The elegant design houses a powerful battery and generous e-liquid capacity for extended use.',
    features: [
      '40,000 puffs capacity',
      'Premium salt nicotine formula',
      'Sleek, portable design',
      'Draw-activated firing',
      'Multiple flavor options',
    ],
    specifications: {
      'Puff Count': '40,000',
      'Battery Capacity': '600mAh',
      'E-Liquid Capacity': '16ml',
      'Nicotine Strength': '5% (50mg)',
      'Activation': 'Draw-Activated',
      'Weight': '65g',
    },
    inStock: true,
    rating: 4.5,
    reviews: 278,
  },
  {
    id: 7,
    name: 'RODMAN Playoffs 50,000 Puffs Ice-Nic Control Disposable',
    price: 16.99,
    originalPrice: 24.99,
    image: '/images/bestseller-1.png',
    category: 'disposables',
    description: 'The RODMAN Playoffs edition features innovative Ice-Nic Control technology, allowing you to adjust both the cooling sensation and nicotine delivery. With 50,000 puffs, this basketball-themed device is a game-changer.',
    features: [
      'Ice-Nic Control technology',
      '50,000 puffs capacity',
      'Adjustable cooling levels',
      'Adjustable nicotine strength',
      'Sports-themed design',
    ],
    specifications: {
      'Puff Count': '50,000',
      'Battery Capacity': '900mAh',
      'E-Liquid Capacity': '20ml',
      'Nicotine Range': '0% - 5%',
      'Ice Levels': '3 Settings',
      'Charging': 'Type-C Fast',
    },
    inStock: true,
    rating: 4.9,
    reviews: 456,
    badge: 'BEST SELLER',
  },
  {
    id: 8,
    name: 'VooPoo Vmate Topfill Replacement Pods',
    price: 5.00,
    originalPrice: 7.99,
    image: '/images/bestseller-2.png',
    category: 'accessories',
    description: 'Authentic VooPoo Vmate Topfill Replacement Pods feature an innovative top-fill design for mess-free refilling. Compatible with the Vmate series devices, these pods deliver excellent flavor and vapor production.',
    features: [
      'Convenient top-fill design',
      '2ml e-liquid capacity',
      'Leak-proof construction',
      'Compatible with Vmate series',
      'Pack of 2 pods',
    ],
    specifications: {
      'Capacity': '2ml',
      'Material': 'Food-grade PCTG',
      'Coil': 'Built-in 0.7Ω',
      'Quantity': '2 per pack',
      'Fill Type': 'Top-fill',
    },
    inStock: true,
    rating: 4.6,
    reviews: 234,
  },
  {
    id: 9,
    name: 'SMOK RPM 3 Coils 5-Pack',
    price: 10.99,
    originalPrice: 14.99,
    image: '/images/bestseller-3.png',
    category: 'accessories',
    description: 'Genuine SMOK RPM 3 replacement coils deliver exceptional flavor and vapor production. These mesh coils are designed for use with RPM 3 devices and come in a convenient 5-pack for extended vaping enjoyment.',
    features: [
      'Mesh coil technology',
      '5 coils per pack',
      'Enhanced flavor production',
      'Long-lasting performance',
      'Easy installation',
    ],
    specifications: {
      'Resistance': '0.15Ω',
      'Wattage Range': '40W - 80W',
      'Material': 'Kanthal Mesh',
      'Quantity': '5 per pack',
      'Compatibility': 'RPM 3 Series',
    },
    inStock: true,
    rating: 4.8,
    reviews: 567,
  },
  {
    id: 10,
    name: 'Geek Bar Pulse X Slush Edition 25,000 Puffs',
    price: 15.00,
    originalPrice: 19.99,
    image: '/images/bestseller-4.png',
    category: 'disposables',
    description: 'The Geek Bar Pulse X Slush Edition delivers an icy-cool vaping experience with 25,000 puffs of refreshing flavor. The unique slush-inspired design and dual-core heating system ensure consistent, satisfying hits every time.',
    features: [
      '25,000 puffs capacity',
      'Slush-inspired cooling',
      'Dual-core heating system',
      'Full-screen display',
      '20+ flavor options',
    ],
    specifications: {
      'Puff Count': '25,000',
      'Battery Capacity': '550mAh',
      'E-Liquid Capacity': '16ml',
      'Nicotine Strength': '5% (50mg)',
      'Display': 'Full-screen LED',
      'Charging': 'Type-C',
    },
    inStock: true,
    rating: 4.7,
    reviews: 389,
  },
  {
    id: 11,
    name: 'Suorin Air Pod V2',
    price: 2.75,
    originalPrice: 4.99,
    image: '/images/bestseller-5.png',
    category: 'accessories',
    description: 'The Suorin Air Pod V2 is a compact, refillable pod designed for the Suorin Air device. With its 2ml capacity and easy side-fill design, this pod offers convenience and portability for on-the-go vaping.',
    features: [
      '2ml e-liquid capacity',
      'Side-fill design',
      'Magnetic connection',
      'Leak-resistant',
      'Pack of 1 pod',
    ],
    specifications: {
      'Capacity': '2ml',
      'Coil Resistance': '1.0Ω',
      'Material': 'Food-grade plastic',
      'Connection': 'Magnetic',
      'Compatibility': 'Suorin Air V2',
    },
    inStock: true,
    rating: 4.3,
    reviews: 178,
  },
  {
    id: 12,
    name: 'Geek Bar Pulse 15,000 Puffs Disposable Sour Edition',
    price: 13.49,
    originalPrice: 17.99,
    image: '/images/bestseller-6.png',
    category: 'disposables',
    description: 'The Sour Edition of the Geek Bar Pulse delivers tangy, mouth-puckering flavors with 15,000 satisfying puffs. Perfect for vapers who enjoy bold, sour taste profiles with a smooth nicotine hit.',
    features: [
      '15,000 puffs capacity',
      'Sour flavor profiles',
      'Dual mesh coil',
      'Compact design',
      'Draw-activated',
    ],
    specifications: {
      'Puff Count': '15,000',
      'Battery Capacity': '650mAh',
      'E-Liquid Capacity': '12ml',
      'Nicotine Strength': '5% (50mg)',
      'Flavor Type': 'Sour Series',
      'Weight': '58g',
    },
    inStock: true,
    rating: 4.6,
    reviews: 267,
  },
];

export function getProductById(id: number): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function getRelatedProducts(productId: number, limit: number = 4): Product[] {
  const product = getProductById(productId);
  if (!product) return [];
  
  return products
    .filter((p) => p.id !== productId && p.category === product.category)
    .slice(0, limit);
}
