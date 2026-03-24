import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    title: 'Premium Vape Collection',
    subtitle: 'Discover the latest disposable vapes with up to 50,000 puffs',
    image: '/images/hero-product.png',
    cta: 'Shop Now',
    bgText: 'VAPE',
  },
  {
    id: 2,
    title: 'Geek Bar Pulse',
    subtitle: 'Experience the ultimate vaping satisfaction',
    image: '/images/promo-product.png',
    cta: 'Shop Now',
    bgText: 'PULSE',
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bgTextRef.current,
        { y: '100%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 1.2, ease: 'expo.out' }
      );
      gsap.fromTo(
        imageRef.current,
        { rotateY: 45, scale: 0.8, opacity: 0 },
        { rotateY: 0, scale: 1, opacity: 1, duration: 1.4, ease: 'expo.out', delay: 0.2 }
      );
      gsap.fromTo(
        titleRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.7)', delay: 0.4 }
      );
      gsap.fromTo(
        subtitleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out', delay: 0.6 }
      );
      gsap.fromTo(
        ctaRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)', delay: 0.8 }
      );
    }, heroRef);

    return () => ctx.revert();
  }, [currentSlide]);

  useEffect(() => {
    const floatAnimation = gsap.to(imageRef.current, {
      y: -10,
      duration: 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    return () => {
      floatAnimation.kill();
    };
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <section
      ref={heroRef}
      className="relative min-h-[90vh] bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden flex items-center"
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,102,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,102,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Background Text */}
      <div
        ref={bgTextRef}
        className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 origin-left text-[15vw] font-display text-stroke opacity-5 whitespace-nowrap pointer-events-none select-none"
        style={{ transform: 'translateX(-30%) rotate(-90deg)' }}
      >
        {slide.bgText}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <div className="inline-block bg-brand-blue/10 border border-brand-blue/30 rounded-full px-4 py-1 mb-6">
              <span className="text-brand-blue text-sm font-body font-semibold uppercase tracking-wider">
                Featured Product
              </span>
            </div>

            <h1
              ref={titleRef}
              className="font-display text-5xl sm:text-6xl lg:text-7xl text-gray-900 mb-4 tracking-wide"
              style={{ textShadow: '3px 3px 0px rgba(0,102,255,0.2)' }}
            >
              {slide.title}
            </h1>

            <p
              ref={subtitleRef}
              className="text-xl sm:text-2xl text-gray-600 font-body mb-8"
            >
              {slide.subtitle}
            </p>

            <Link to="/product/1">
              <button
                ref={ctaRef}
                className="btn-primary inline-flex items-center gap-2 text-lg group"
              >
                {slide.cta}
                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </Link>
          </div>

          {/* Product Image */}
          <div className="order-1 lg:order-2 relative flex justify-center">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-brand-blue/20 blur-[100px] rounded-full" />

              {/* Product Image */}
              <img
                ref={imageRef}
                src={slide.image}
                alt={slide.title}
                className="relative z-10 w-full max-w-md lg:max-w-lg drop-shadow-2xl"
                style={{ perspective: '1000px' }}
              />

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-brand-blue text-white font-display text-2xl px-4 py-2 rounded-lg transform rotate-12 shadow-lg z-20">
                NEW!
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <button
          onClick={prevSlide}
          className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-colors shadow-lg"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-brand-blue w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-colors shadow-lg"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-2 h-2 bg-brand-blue rounded-full animate-pulse" />
      <div className="absolute bottom-40 left-20 w-3 h-3 bg-brand-cyan rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-brand-light rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
    </section>
  );
}
