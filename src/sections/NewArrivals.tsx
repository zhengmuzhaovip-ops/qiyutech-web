import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingCart, Eye } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useProducts, ApiProduct } from '../hooks/useProducts';

gsap.registerPlugin(ScrollTrigger);

export default function NewArrivals() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);
  const { t } = useLanguage();
  const { addToCart } = useCart();

  // ✅ 对接真实 API，取最新 6 条上架商品
  const { products: newProducts, isLoading } = useProducts({ limit: 6, sort: '-createdAt' });

  useEffect(() => {
    if (isLoading || newProducts.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
        {
          clipPath: 'inset(0 0% 0 0)',
          opacity: 1,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(
            card,
            { y: 80, opacity: 0, rotateY: -15 },
            {
              y: 0,
              opacity: 1,
              rotateY: 0,
              duration: 0.8,
              delay: index * 0.1,
              ease: 'expo.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 60%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoading, newProducts]);

  const handleAddToCart = (e: React.MouseEvent, product: ApiProduct) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '',
    });
  };

  return (
    <section ref={sectionRef} id="new" className="py-20 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center justify-between">
          <h2 ref={titleRef} className="font-display text-4xl sm:text-5xl text-gray-900 tracking-wide">
            {t('newArrival')} <span className="text-brand-blue">{t('arrival')}</span>
          </h2>
          <Link to="/products" className="hidden sm:flex items-center gap-2 text-gray-500 hover:text-brand-blue transition-colors font-body">
            {t('viewAll')}
            <span className="text-lg">→</span>
          </Link>
        </div>
        <div className="mt-4 h-1 w-32 bg-gradient-to-r from-brand-blue to-transparent rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-100 animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : newProducts.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No products available</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {newProducts.map((product, index) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                ref={(el) => { cardsRef.current[index] = el; }}
                className="group relative bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-brand-blue/50 transition-all duration-300 hover-lift shadow-sm hover:shadow-lg"
                style={{ perspective: '1000px' }}
              >
                <div className="absolute top-2 left-2 z-10 bg-brand-blue text-white text-xs font-body font-bold px-2 py-1 rounded">
                  NEW
                </div>

                <div className="relative aspect-square bg-gradient-to-b from-gray-50 to-transparent p-4 overflow-hidden">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Image</div>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <Link
                      to={`/product/${product._id}`}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800 hover:bg-brand-blue hover:text-white transition-colors"
                    >
                      <Eye size={18} />
                    </Link>
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="w-10 h-10 bg-brand-blue rounded-full flex items-center justify-center text-white hover:bg-brand-dark transition-colors"
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-gray-700 font-body text-sm line-clamp-2 mb-2 group-hover:text-brand-blue transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <p className="text-brand-blue font-display text-xl">${product.price.toFixed(2)}</p>
                    {product.comparePrice > 0 && (
                      <p className="text-gray-400 font-body text-sm line-through">${product.comparePrice.toFixed(2)}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
