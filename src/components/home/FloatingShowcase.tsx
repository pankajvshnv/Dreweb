import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { ShowcaseCard, ShowcaseCardData } from './ShowcaseCard';
import { useCollection } from '../../lib/useCollection';
import { SHOWCASE_CARDS } from '../../lib/data';

export function FloatingShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Fetch cards from admin local storage, fallback to default
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
      className="relative w-full overflow-hidden bg-background flex items-center justify-center min-h-[95vh] pt-32 pb-24 lg:pt-40 lg:pb-32 select-none"
    >
      {/* Background dark radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.03] via-background to-background z-0"></div>

      {/* Render Floating Cards - Pushed lower and scaled to avoid text overlap - Hidden on mobile */}
      <div className="hidden md:block absolute inset-0 z-10 overflow-hidden pointer-events-none translate-y-20 lg:translate-y-32 scale-90 md:scale-100 opacity-80 mix-blend-screen">
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
          transition={{ delay: 0.2, duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-panel mb-10 pointer-events-auto shadow-[0_0_30px_rgba(255,255,255,0.05)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_10px_rgba(255,255,255,1)]"></span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">
            Digital Excellence • Global Reach
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, ease: [0.25, 0.4, 0.25, 1] }}
          className="font-display text-5xl md:text-7xl lg:text-[90px] font-light tracking-tighter leading-[1.05] text-white mb-8 drop-shadow-2xl"
        >
          Websites <em className="font-serif italic font-light tracking-normal text-white/80 px-2 mx-1">designed</em> for <br className="hidden md:block" /> speed, elegance, and <br className="hidden md:block" /> <em className="font-serif italic font-light tracking-normal text-white/80 px-2 ml-1">conversion.</em>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-lg md:text-2xl text-white/50 font-light max-w-2xl text-balance mb-14 leading-relaxed"
        >
          From cinematic structure to flawless launch, we build digital products that shape industries.
        </motion.p>

        {/* CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-6 pointer-events-auto"
        >
          <Link 
            to="/contact" 
            className="px-10 py-4 rounded-full bg-white text-black font-semibold tracking-widest text-sm uppercase hover:scale-105 hover:bg-white/90 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-500"
          >
            Start Your Project
          </Link>
          <Link 
            to="/work" 
            className="glass-button px-10 py-4 font-semibold tracking-widest text-sm uppercase flex items-center gap-2 group"
          >
            View Our Work 
            <motion.div
               className="group-hover:translate-x-1 transition-transform"
            >
               <ArrowUpRight size={16} />
            </motion.div>
          </Link>
        </motion.div>
        
      </div>
      
    </section>
  );
}
