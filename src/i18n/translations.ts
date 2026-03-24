export type Language = 'en' | 'zh';

export interface Translations {
  [key: string]: string;
}

export const translations = {
  en: {
    // Header
    warning: 'WARNING: This product contains nicotine. Nicotine is an addictive chemical.',
    welcome: 'Welcome to Vape Wholesale USA',
    signIn: 'Sign In',
    createAccount: 'Create an Account',
    contactUs: 'Contact Us',
    searchPlaceholder: 'Search entire store here...',
    myCart: 'My Cart',

    // Categories
    disposables: 'Disposables',
    eLiquids: 'E-Liquids',
    new: 'New',
    clearance: 'Clearance',
    vapeKits: 'Vape Kits',
    accessories: 'Accessories',
    rebuildables: 'Rebuildables',
    alternatives: 'Alternatives',
    nicPouches: 'Nic Pouches',
    brands: 'Brands',

    // Hero
    featuredProduct: 'Featured Product',
    shopNow: 'Shop Now',
    newBadge: 'NEW!',

    // Hero Slides
    rodmanTitle: 'Rodman Playoffs',
    rodmanSubtitle: '50,000 Puffs Ice-Nic Control Disposable',
    geekbarTitle: 'Geek Bar Ice Prince',
    geekbarSubtitle: '50,000 Puffs Premium Disposable',

    // Category Cloud
    categories: 'Categories',

    // New Arrivals
    newArrival: 'NEW',
    arrival: 'ARRIVAL',
    viewAll: 'View All',

    // Products
    beiinfun: 'Beiinfun 30,000 Puffs Disposable',
    kumi: 'KUMI Oro 40K Puffs Disposable Vape',
    smokNord: 'SMOK Nord Replacement Pod',
    eJuice: 'Unflavored 100ml E-Juice',
    smogger: 'Smogger GB50000 Puff Disposable',
    saltBae: 'Salt Bae 50 40K Puff Disposable',

    // Promo Section
    limitedOffer: 'Limited Time Offer',
    geekbarPulse: 'GEEK BAR',
    pulse: 'PULSE',
    slushEdition: 'X Slush Edition 25,000 Puffs',
    originalPrice: '$29.99',
    salePrice: '$14.99',
    save: 'SAVE 50%',
    puffs25000: '25,000 Puffs',
    iceControl: 'Ice Control',
    rechargeable: 'Rechargeable',
    reviews: '2.5k+ Reviews',

    // Best Sellers
    best: 'BEST',
    sellers: 'SELLERS',
    bestSellersDesc: 'Our most popular products, loved by thousands of customers worldwide',
    viewAllBestSellers: 'View All Best Sellers',
    bestSeller: 'BEST SELLER',
    popular: 'POPULAR',
    topRated: 'TOP RATED',
    trending: 'TRENDING',
    value: 'VALUE',

    // Best Seller Products
    rodmanPlayoffs: 'RODMAN Playoffs 50,000 Puffs Ice-Nic Control Disposable',
    voopoo: 'VooPoo Vmate Topfill Replacement Pods',
    smokRpm: 'SMOK RPM 3 Coils 5-Pack',
    geekbarSlush: 'Geek Bar Pulse X Slush Edition 25,000 Puffs',
    suorin: 'Suorin Air Pod V2',
    geekbarSour: 'Geek Bar Pulse 15,000 Puffs Disposable Sour Edition',

    // Footer
    footerDesc: 'Your trusted source for premium vaping products at wholesale prices. Quality guaranteed, fast shipping worldwide.',
    quickLinks: 'Quick Links',
    popularCategories: 'Popular',
    newsletter: 'Get the latest News & Offers!',
    newsletterDesc: 'Subscribe to our newsletter for exclusive deals and updates.',
    emailPlaceholder: 'Enter your email',
    subscribe: 'Subscribe',
    freeShipping: 'Free Shipping',
    freeShippingDesc: 'On orders over $100',
    securePayment: 'Secure Payment',
    securePaymentDesc: '100% secure checkout',
    easyReturns: 'Easy Returns',
    easyReturnsDesc: '30-day return policy',
    wholesalePricing: 'Wholesale Pricing',
    wholesalePricingDesc: 'Best prices guaranteed',
    copyright: 'Copyright © 2025 Vape Wholesale USA. All rights reserved.',
    sitemap: 'Sitemap',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',

    // Footer Links
    faqs: 'FAQs',
    aboutUs: 'About Us',
    myAccount: 'My Account',
    orderHistory: 'Order History',
    agePolicy: 'Age Policy',
    privacy: 'Privacy Policy',
    returns: 'Returns & Exchange',
    rewardProgram: 'Reward Program',
    terms: 'Terms & Conditions',
    disposableVapes: 'Disposable Vapes',
    vapeStarterKits: 'Vape Starter Kits',
    vapeClearance: 'Vape Clearance',
    newArrivals: 'New Arrivals',
    wholesaleByBrand: 'Vape Wholesale by Brand',

    // Language Switch
    language: 'Language',
    english: 'English',
    chinese: '中文',
  },
  zh: {
    // Header
    warning: '警告：本产品含有尼古丁。尼古丁是一种成瘾性化学物质。',
    welcome: '欢迎来到 Vape Wholesale USA',
    signIn: '登录',
    createAccount: '创建账户',
    contactUs: '联系我们',
    searchPlaceholder: '搜索全店商品...',
    myCart: '我的购物车',

    // Categories
    disposables: '一次性电子烟',
    eLiquids: '烟油',
    new: '新品',
    clearance: '清仓',
    vapeKits: '电子烟套装',
    accessories: '配件',
    rebuildables: '可重建式',
    alternatives: '替代品',
    nicPouches: '尼古丁袋',
    brands: '品牌',

    // Hero
    featuredProduct: '精选产品',
    shopNow: '立即购买',
    newBadge: '新品!',

    // Hero Slides
    rodmanTitle: 'Rodman Playoffs',
    rodmanSubtitle: '50,000口 冰爽尼古丁控制一次性电子烟',
    geekbarTitle: 'Geek Bar Ice Prince',
    geekbarSubtitle: '50,000口 高端一次性电子烟',

    // Category Cloud
    categories: '商品分类',

    // New Arrivals
    newArrival: '新品',
    arrival: '上架',
    viewAll: '查看全部',

    // Products
    beiinfun: 'Beiinfun 30,000口一次性电子烟',
    kumi: 'KUMI Oro 40K口一次性电子烟',
    smokNord: 'SMOK Nord 替换烟弹',
    eJuice: '无味 100ml 烟油',
    smogger: 'Smogger GB50000口一次性电子烟',
    saltBae: 'Salt Bae 50 40K口一次性电子烟',

    // Promo Section
    limitedOffer: '限时优惠',
    geekbarPulse: 'GEEK BAR',
    pulse: 'PULSE',
    slushEdition: 'X 冰沙版 25,000口',
    originalPrice: '$29.99',
    salePrice: '$14.99',
    save: '省 50%',
    puffs25000: '25,000口',
    iceControl: '冰爽控制',
    rechargeable: '可充电',
    reviews: '2.5k+ 评价',

    // Best Sellers
    best: '畅销',
    sellers: '产品',
    bestSellersDesc: '我们最受欢迎的产品，深受全球数千名客户喜爱',
    viewAllBestSellers: '查看全部畅销产品',
    bestSeller: '畅销',
    popular: '热门',
    topRated: '高评分',
    trending: '趋势',
    value: '超值',

    // Best Seller Products
    rodmanPlayoffs: 'RODMAN Playoffs 50,000口 冰爽尼古丁控制一次性电子烟',
    voopoo: 'VooPoo Vmate 顶部填充替换烟弹',
    smokRpm: 'SMOK RPM 3 线圈 5包装',
    geekbarSlush: 'Geek Bar Pulse X 冰沙版 25,000口',
    suorin: 'Suorin Air Pod V2',
    geekbarSour: 'Geek Bar Pulse 15,000口 酸爽版一次性电子烟',

    // Footer
    footerDesc: '您值得信赖的高端电子烟产品批发来源。品质保证，全球快速发货。',
    quickLinks: '快速链接',
    popularCategories: '热门分类',
    newsletter: '获取最新资讯和优惠！',
    newsletterDesc: '订阅我们的通讯，获取独家优惠和更新。',
    emailPlaceholder: '输入您的邮箱',
    subscribe: '订阅',
    freeShipping: '免费 shipping',
    freeShippingDesc: '订单满$100',
    securePayment: '安全支付',
    securePaymentDesc: '100% 安全结账',
    easyReturns: '轻松退货',
    easyReturnsDesc: '30天退货政策',
    wholesalePricing: '批发价格',
    wholesalePricingDesc: '保证最优价格',
    copyright: '版权所有 © 2025 Vape Wholesale USA。保留所有权利。',
    sitemap: '网站地图',
    privacyPolicy: '隐私政策',
    termsOfService: '服务条款',

    // Footer Links
    faqs: '常见问题',
    aboutUs: '关于我们',
    myAccount: '我的账户',
    orderHistory: '订单历史',
    agePolicy: '年龄政策',
    privacy: '隐私政策',
    returns: '退换货政策',
    rewardProgram: '奖励计划',
    terms: '条款与条件',
    disposableVapes: '一次性电子烟',
    vapeStarterKits: '电子烟入门套装',
    vapeClearance: '电子烟清仓',
    newArrivals: '新品上架',
    wholesaleByBrand: '按品牌批发',

    // Language Switch
    language: '语言',
    english: 'English',
    chinese: '中文',
  },
};

export type TranslationKey = keyof typeof translations.en;
