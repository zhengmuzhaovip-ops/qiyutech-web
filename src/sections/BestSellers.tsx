import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingCart, Star, TrendingUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

gsap.registerPlugin(ScrollTrigger);

export default function BestSellers() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const col3Ref = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { addToCart } = useCart();

  const bestSellers = products.filter(p => p.rating >= 4.5).slice(0, 6);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
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

      const columns = [col1Ref.current, col2Ref.current, col3Ref.current];
      columns.forEach((col, index) => {
        if (col) {
          gsap.fromTo(
            col,
            { y: 100, opacity: 0 },
            {
              y: 0,
              opacity: 1,
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

      if (col2Ref.current) {
        gsap.to(col2Ref.current, {
          y: -80,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }

      if (col3Ref.current) {
        gsap.to(col3Ref.current, {
          y: 40,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: typeof products[0]) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  const renderProductCard = (product: typeof products[0]) => (
    <Link
      key={product.id}
      to={`/product/${product.id}`}
      className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-brand-blue/50 transition-all duration-300 hover-lift shadow-sm hover:shadow-lg mb-6"
    >
      <div className="relative">
        <div className="absolute top-3 left-3 z-10 bg-brand-blue text-white text-xs font-body font-bold px-2 py-1 rounded flex items-center gap-1">
          <TrendingUp size={12} />
          {product.badge || t('bestSeller')}
        </div>

        <div className="aspect-square bg-gradient-to-b from-gray-50 to-transparent p-6 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={12}
              className={`${
                i < Math.floor(product.rating)
                  ? 'text-brand-blue fill-brand-blue'
                  : 'text-gray-200'
              }`}
            />
          ))}
          <span className="text-gray-400 text-xs font-body ml-1">
            ({product.reviews})
          </span>
        </div>

        <h3 className="text-gray-700 font-body text-sm line-clamp-2 mb-3 group-hover:text-brand-blue transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-brand-blue font-display text-xl">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-gray-400 font-body text-sm line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button 
            onClick={(e) => handleAddToCart(e, product)}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-brand-blue hover:text-white transition-colors"
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </Link>
  );

  return (
    <section
      ref={sectionRef}
      id="disposables"
      className="py-20 bg-white relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(45deg, #0066ff 25%, transparent 25%), linear-gradient(-45deg, #0066ff 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #0066ff 75%), linear-gradient(-45deg, transparent 75%, #0066ff 75%)`,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            ref={titleRef}
            className="font-display text-4xl sm:text-5xl text-gray-900 tracking-wide mb-4"
          >
            {t('best')} <span className="text-brand-blue">{t('sellers')}</span>
          </h2>
          <p className="text-gray-500 font-body max-w-2xl mx-auto">
            {t('bestSellersDesc')}
          </p>
          <div className="mt-4 h-1 w-32 bg-gradient-to-r from-transparent via-brand-blue to-transparent rounded-full mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div ref={col1Ref}>
            {bestSellers.filter((_, i) => i % 3 === 0).map(renderProductCard)}
          </div>

          <div ref={col2Ref} className="md:mt-16">
            {bestSellers.filter((_, i) => i % 3 === 1).map(renderProductCard)}
          </div>

          <div ref={col3Ref} className="hidden lg:block">
            {bestSellers.filter((_, i) => i % 3 === 2).map(renderProductCard)}
          </div>
        </div>

        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 bg-transparent border-2 border-gray-200 text-gray-700 font-body font-semibold px-8 py-3 rounded-full hover:border-brand-blue hover:text-brand-blue transition-colors">
            {t('viewAllBestSellers')}
            <span className="text-lg">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
