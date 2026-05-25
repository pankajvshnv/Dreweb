import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { ShowcaseCard, ShowcaseCardData } from './ShowcaseCard';
import { useCollection } from '../../lib/useCollection';
import { SHOWCASE_CARDS } from '../../lib/data';

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
      className="relative w-full overflow-hidden bg-white flex items-center justify-center pt-24 pb-32 lg:pt-24 lg:pb-40 select-none"
    >
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-50 via-white to-white z-0"></div>

      {/* Render Floating Cards - Pushed lower and scaled to avoid text overlap - Hidden on mobile */}
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
      <div className="relative z-20 flex flex-col items-center text-center w-full max-w-7xl px-4 md:px-8 pointer-events-none">
        
        {/* Top Tagline */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-zinc-200 shadow-sm mb-8 pointer-events-auto"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand-lime animate-pulse"></span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
            Book a call {'>'} Finish project {'>'} Get more leads
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1 
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1 }}
          className="font-display text-5xl md:text-7xl lg:text-[80px] font-medium tracking-tight leading-[1.05] text-zinc-900 mb-6"
        >
          Websites <em className="font-serif italic font-normal tracking-normal text-black bg-brand-lime px-2 mx-1">developed</em> for <br className="hidden md:block" /> speed, clarity, and <br className="hidden md:block" /> <em className="font-serif italic font-normal tracking-normal text-black bg-brand-lime px-2 ml-1">conversion.</em>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-zinc-500 font-light max-w-2xl text-balance mb-12"
        >
          From structure to launch, we handle everything - creating a website that's simple to use, easy to trust, and built to convert.
        </motion.p>

        {/* CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4 pointer-events-auto"
        >
          <Link 
            to="/contact" 
            className="px-8 py-3.5 rounded-full bg-brand-lime text-black font-medium hover:scale-105 transition-transform"
          >
            Book a call today
          </Link>
          <Link 
            to="/work" 
            className="px-8 py-3.5 rounded-full bg-white border border-zinc-200 text-zinc-700 font-medium hover:bg-zinc-50 transition-colors inline-flex items-center gap-2"
          >
            Recent projects <ArrowUpRight size={16} />
          </Link>
        </motion.div>
        
      </div>
      
    </section>
  );
}
