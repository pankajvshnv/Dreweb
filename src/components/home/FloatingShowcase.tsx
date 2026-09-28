import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { ShowcaseCard, ShowcaseCardData } from './ShowcaseCard';
import { useCollection } from '../../lib/useCollection';
import { SHOWCASE_CARDS } from '../../lib/data';

const MOBILE_PILLS = [
  'Web & SaaS Apps',
  'UI/UX Design',
  'AI Automation',
  'SEO & Growth'
];

export function FloatingShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Fetch cards from admin local storage, fallback to default (using new key to reset positions)
  const { data: dynamicCards } = useCollection<ShowcaseCardData>('showcase_hero_cards');
  const cards = dynamicCards && dynamicCards.length > 0 ? dynamicCards : SHOWCASE_CARDS;

  // Global mouse position for parallax depth
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates from -1 to 1 based on screen size
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      
      // Amplify movement
      mouseX.set(x * 40);
      mouseY.set(y * 40);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full overflow-hidden bg-white flex items-center justify-center pt-28 pb-16 sm:pt-32 sm:pb-24 md:pt-28 md:pb-36 lg:pb-40 select-none"
    >
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-50 via-white to-white z-0"></div>

      {/* Render Floating Cards - Hidden on mobile, visible from md up */}
      <div className="hidden md:block absolute inset-0 z-10 overflow-hidden pointer-events-none translate-y-20 lg:translate-y-32 scale-90 md:scale-100">
        <div className="relative w-full h-full pointer-events-auto">
          {cards.map((card, idx) => (
            <ShowcaseCard 
              key={card.id} 
              card={card as ShowcaseCardData} 
              mouseX={springX} 
              mouseY={springY} 
              index={idx} 
            />
          ))}
        </div>
      </div>

      {/* Central Content */}
      <div className="relative z-20 flex flex-col items-center text-center w-full max-w-7xl px-4 sm:px-6 md:px-8 pointer-events-none">
        
        {/* Top Tagline */}
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-zinc-200/80 shadow-sm mb-6 sm:mb-8 pointer-events-auto"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand-lime animate-pulse"></span>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-600">
            Book a call &bull; Finish project &bull; Get more leads
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1 
          initial={{ opacity: 0, filter: 'blur(8px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.8 }}
          className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-[80px] font-medium tracking-tight leading-[1.08] sm:leading-[1.05] text-zinc-900 mb-6 max-w-5xl"
        >
          Websites{' '}
          <em className="font-serif italic font-normal tracking-normal text-black bg-brand-lime px-2 py-0.5 rounded-md inline-block my-0.5">
            developed
          </em>{' '}
          for <br className="hidden sm:block" /> speed, clarity, and <br className="hidden sm:block" />{' '}
          <em className="font-serif italic font-normal tracking-normal text-black bg-brand-lime px-2 py-0.5 rounded-md inline-block my-0.5">
            conversion.
          </em>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-base sm:text-lg md:text-xl text-zinc-500 font-light max-w-2xl text-balance mb-8 sm:mb-12 px-2 leading-relaxed"
        >
          From structure to launch, we handle everything — creating a website that's simple to use, easy to trust, and built to convert.
        </motion.p>

        {/* CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto px-4 sm:px-0 pointer-events-auto mb-10 sm:mb-0"
        >
          <Link 
            to="/contact" 
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-brand-lime text-black font-medium hover:scale-105 active:scale-95 transition-all text-center"
          >
            Book a call today
          </Link>
          <Link 
            to="/work" 
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white border border-zinc-200 text-zinc-700 font-medium hover:bg-zinc-50 active:scale-95 transition-all inline-flex items-center justify-center gap-2"
          >
            <span>Recent projects</span>
            <ArrowUpRight size={16} />
          </Link>
        </motion.div>

        {/* Mobile-Only Feature Highlights Pill Strip */}
        <div className="flex md:hidden flex-wrap items-center justify-center gap-2 max-w-sm pointer-events-auto">
          {MOBILE_PILLS.map((pill) => (
            <span
              key={pill}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200/60 text-[11px] font-bold text-zinc-700"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {pill}
            </span>
          ))}
        </div>
        
      </div>
      
    </section>
  );
}
