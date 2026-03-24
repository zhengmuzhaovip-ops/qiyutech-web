import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  { name: 'DISPOSABLES', color: '#0066ff' },
  { name: 'E-LIQUIDS', color: '#00ccff' },
  { name: 'NEW', color: '#0066ff' },
  { name: 'CLEARANCE', color: '#ff6600' },
  { name: 'VAPE KITS', color: '#0066ff' },
  { name: 'ACCESSORIES', color: '#00ccff' },
  { name: 'REBUILDABLES', color: '#0066ff' },
  { name: 'ALTERNATIVES', color: '#ff6600' },
  { name: 'NIC POUCHES', color: '#0066ff' },
  { name: 'BRANDS', color: '#00ccff' },
];

export default function CategoryCloud() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cloudRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        tagsRef.current,
        { y: 50, opacity: 0, rotateX: -90 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 bg-white relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #0066ff 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={cloudRef} className="flex flex-wrap justify-center gap-4">
          {categories.map((category, index) => (
            <a
              key={category.name}
              ref={(el) => { tagsRef.current[index] = el; }}
              href={`#${category.name.toLowerCase()}`}
              className="group relative px-6 py-3 bg-gray-100 border border-gray-200 rounded-full font-body text-sm font-semibold uppercase tracking-wider transition-all duration-300 hover:scale-110"
              style={{
                perspective: '1000px',
              }}
            >
              <span
                className="relative z-10 text-gray-700 group-hover:text-white transition-colors"
              >
                {category.name}
              </span>
              
              {/* Hover Glow */}
              <div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"
                style={{ backgroundColor: category.color }}
              />
              
              {/* Border Glow on Hover */}
              <div
                className="absolute inset-0 rounded-full border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ borderColor: category.color }}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
