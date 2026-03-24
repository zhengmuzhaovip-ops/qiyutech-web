import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function PromoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: 0.2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        imageRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        badgeRef.current,
        { rotate: -180, scale: 0 },
        {
          rotate: 0,
          scale: 1,
          duration: 0.8,
          delay: 0.5,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: 0.7,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.to(imageRef.current, {
        y: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to(badgeRef.current, {
        rotate: 45,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const pulseAnimation = gsap.to(badgeRef.current, {
      scale: 1.1,
      duration: 1,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    return () => {
      pulseAnimation.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="clearance"
      className="py-20 bg-white relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-brand-blue/10 border border-brand-blue/30 rounded-full px-4 py-1 mb-6">
              <Zap size={16} className="text-brand-blue" />
              <span className="text-brand-blue text-sm font-body font-semibold uppercase tracking-wider">
                {t('limitedOffer')}
              </span>
            </div>

            <h2
              ref={titleRef}
              className="font-display text-5xl sm:text-6xl lg:text-7xl text-gray-900 mb-4 tracking-wide"
              style={{ textShadow: '3px 3px 0px rgba(0,102,255,0.2)' }}
            >
              {t('geekbarPulse')} <span className="text-brand-blue">{t('pulse')}</span>
            </h2>

            <p
              ref={subtitleRef}
              className="text-xl sm:text-2xl text-gray-600 font-body mb-8"
            >
              {t('slushEdition')}
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-gray-400 font-body line-through text-xl">
                  {t('originalPrice')}
                </span>
                <span className="text-brand-blue font-display text-4xl">
                  {t('salePrice')}
                </span>
              </div>
              <div className="bg-brand-blue text-white text-sm font-body font-bold px-3 py-1 rounded">
                {t('save')}
              </div>
            </div>

            <Link to="/product/10">
              <button
                ref={ctaRef}
                className="btn-primary inline-flex items-center gap-2 text-lg group"
              >
                {t('shopNow')}
                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </Link>

            <div className="mt-10 grid grid-cols-3 gap-4">
              {[t('puffs25000'), t('iceControl'), t('rechargeable')].map((feature) => (
                <div
                  key={feature}
                  className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <span className="text-gray-700 font-body text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 relative flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-blue/20 blur-[120px] rounded-full" />
              <img
                ref={imageRef}
                src="/images/promo-product.png"
                alt="Geek Bar Pulse"
                className="relative z-10 w-full max-w-md lg:max-w-lg drop-shadow-2xl"
              />
              <div
                ref={badgeRef}
                className="absolute -top-4 -right-4 w-24 h-24 bg-brand-blue rounded-full flex items-center justify-center shadow-glow z-20"
              >
                <div className="text-center">
                  <span className="font-display text-3xl text-white">50%</span>
                  <span className="block text-white text-xs font-body">OFF</span>
                </div>
              </div>
              <div className="absolute bottom-10 -left-10 bg-white rounded-lg px-4 py-2 border border-gray-100 shadow-lg">
                <span className="text-brand-blue font-display text-lg">★★★★★</span>
                <span className="text-gray-500 text-xs font-body ml-2">{t('reviews')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-blue/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-blue/30 to-transparent" />
    </section>
  );
}
