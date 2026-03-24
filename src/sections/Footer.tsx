import { useState } from 'react';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard,
  Shield,
  Truck,
  RotateCcw
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const { t } = useLanguage();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail('');
  };

  const quickLinks = [
    { name: t('faqs'), href: '#' },
    { name: t('aboutUs'), href: '#' },
    { name: t('contactUs'), href: '#' },
    { name: t('myAccount'), href: '#' },
    { name: t('orderHistory'), href: '#' },
  ];

  const popularCategories = [
    { name: t('disposables'), href: '#' },
    { name: t('eLiquids'), href: '#' },
    { name: t('vapeStarterKits'), href: '#' },
    { name: t('vapeClearance'), href: '#' },
    { name: t('newArrivals'), href: '#' },
    { name: t('wholesaleByBrand'), href: '#' },
  ];

  const features = [
    { icon: Truck, title: t('freeShipping'), desc: t('freeShippingDesc') },
    { icon: Shield, title: t('securePayment'), desc: t('securePaymentDesc') },
    { icon: RotateCcw, title: t('easyReturns'), desc: t('easyReturnsDesc') },
    { icon: CreditCard, title: t('wholesalePricing'), desc: t('wholesalePricingDesc') },
  ];

  return (
    <footer className="bg-gray-50 relative">
      {/* Features Bar */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                  <feature.icon className="text-brand-blue" size={24} />
                </div>
                <div>
                  <h4 className="text-gray-800 font-body font-semibold text-sm">
                    {feature.title}
                  </h4>
                  <p className="text-gray-500 font-body text-xs">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* About */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <img 
                  src="/images/logo.png" 
                  alt="QIYU Tech" 
                  className="h-10 w-auto"
                />
              </div>
              
              <p className="text-gray-500 font-body text-sm mb-6">
                {t('footerDesc')}
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-500">
                  <MapPin size={16} className="text-brand-blue" />
                  <span className="font-body text-sm">Las Vegas, NV 89146</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                  <Phone size={16} className="text-brand-blue" />
                  <span className="font-body text-sm">+1 (800) 500-8486</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                  <Mail size={16} className="text-brand-blue" />
                  <span className="font-body text-sm">support@qiyutechs.com</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-display text-xl text-gray-800 mb-6">{t('quickLinks')}</h3>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-500 hover:text-brand-blue transition-colors font-body text-sm inline-flex items-center gap-2 group"
                    >
                      <span className="w-0 h-px bg-brand-blue transition-all duration-300 group-hover:w-3" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular */}
            <div>
              <h3 className="font-display text-xl text-gray-800 mb-6">{t('popularCategories')}</h3>
              <ul className="space-y-2">
                {popularCategories.map((category) => (
                  <li key={category.name}>
                    <a
                      href={category.href}
                      className="text-gray-500 hover:text-brand-blue transition-colors font-body text-sm inline-flex items-center gap-2 group"
                    >
                      <span className="w-0 h-px bg-brand-blue transition-all duration-300 group-hover:w-3" />
                      {category.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="font-display text-xl text-gray-800 mb-6">{t('newsletter')}</h3>
              <p className="text-gray-500 font-body text-sm mb-4">
                {t('newsletterDesc')}
              </p>
              
              <form onSubmit={handleSubscribe} className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('emailPlaceholder')}
                    className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder:text-gray-400 font-body text-sm focus:outline-none focus:border-brand-blue transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-brand-blue text-white px-4 py-3 rounded-lg font-body font-semibold hover:bg-brand-dark transition-colors"
                  >
                    {t('subscribe')}
                  </button>
                </div>
              </form>

              {/* Social Links */}
              <div className="flex gap-3">
                {[
                  { icon: Facebook, href: '#' },
                  { icon: Instagram, href: '#' },
                  { icon: Twitter, href: '#' },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-500 hover:bg-brand-blue hover:text-white transition-colors shadow-sm"
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 font-body text-xs">
              Copyright © 2025 QIYU Tech. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {[t('sitemap'), t('privacyPolicy'), t('termsOfService')].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-gray-400 hover:text-gray-600 transition-colors font-body text-xs"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
