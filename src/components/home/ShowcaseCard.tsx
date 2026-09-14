import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ExternalLink, CheckCircle2, BarChart } from 'lucide-react';

export interface ShowcaseCardData {
  id: string;
  type: 'website-preview' | 'text-editorial' | 'image-showcase' | 'stats-card' | 'story-card' | 'pricing-card';
  title: string;
  subtitle?: string;
  imageUrl?: string;
  width: number;
  height: number;
  initialX: number;
  initialY: number;
  rotation: number;
  floatSpeed: number;
  scale: number;
  zIndex: number;
  stats?: Record<string, string>;
}

interface ShowcaseCardProps {
  card: ShowcaseCardData;
  mouseX: any;
  mouseY: any;
  index: number;
  key?: any;
}

export function ShowcaseCard({ card, mouseX, mouseY, index }: ShowcaseCardProps) {
  // Local hover state for 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(springY, [-100, 100], [15, -15]);
  const rotateY = useTransform(springX, [-100, 100], [-15, 15]);

  // Pseudo-randomize float paths based on index
  const randomY = index % 2 === 0 ? [-8, 12, -8] : [10, -10, 10];
  const randomX = index % 3 === 0 ? [-5, 8, -5] : index % 3 === 1 ? [6, -6, 6] : [0, 5, 0];
  const randomRotateFloat = index % 2 === 0 ? [0, 3, -1, 0] : [0, -2, 2, 0];
  const delayFloat = index * 0.7; // staggering the start of the float

  // Add spring physics to the parallax for smooth inertia
  const springMouseX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springMouseY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  // Parallax based on global mouse position (giving depth)
  // Higher zIndex = foreground = moves more (parallaxDepth is higher)
  const parallaxDepth = card.zIndex * 0.8; 
  const translateX = useTransform(springMouseX, (v: any) => Number(v) * parallaxDepth);
  const translateY = useTransform(springMouseY, (v: any) => Number(v) * parallaxDepth);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const renderCardContent = () => {
    switch (card.type) {
      case 'website-preview':
        return (
          <div className="w-full h-full bg-white flex flex-col">
            <div className="h-6 bg-zinc-100 flex items-center px-3 gap-1.5 shrink-0 border-b border-zinc-200">
              <div className="w-2 h-2 rounded-full bg-red-400"></div>
              <div className="w-2 h-2 rounded-full bg-amber-400"></div>
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
            </div>
            <div className="flex-1 relative overflow-hidden group">
              <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black">
                  <ExternalLink size={18} />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'text-editorial':
        return (
          <div className="w-full h-full relative overflow-hidden flex flex-col justify-between p-6">
            <img src={card.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="relative z-10 flex justify-between items-start">
              <span className="px-3 py-1 bg-brand-lime text-black text-[10px] font-bold tracking-widest uppercase rounded-sm">Modern</span>
            </div>
            <div className="relative z-10">
              <span className="text-brand-lime text-xs font-bold tracking-widest uppercase block mb-1">{card.subtitle}</span>
              <h3 className="text-white font-display text-4xl leading-none font-extrabold">{card.title}</h3>
            </div>
          </div>
        );

      case 'story-card':
        return (
          <div className="w-full h-full bg-white p-4 flex gap-4">
            <div className="w-1/3 h-full rounded-xl overflow-hidden shrink-0 relative">
               <img src={card.imageUrl} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <h4 className="font-display font-bold text-lg mb-1">{card.title}</h4>
              <p className="text-[10px] text-zinc-500 leading-relaxed mb-4">{card.subtitle}</p>
              <div className="flex items-center gap-2 text-[10px] font-medium border-t border-zinc-100 pt-3">
                <CheckCircle2 size={12} className="text-brand-lime" /> Clean Energy
              </div>
            </div>
          </div>
        );

      case 'stats-card':
        return (
          <div className="w-full h-full bg-zinc-900 text-white p-6 flex flex-col justify-between rounded-2xl relative overflow-hidden">
             <div className="absolute -right-8 -top-8 w-32 h-32 bg-brand-lime/20 blur-2xl rounded-full"></div>
             <div>
                <BarChart className="text-brand-lime mb-4" size={24} />
                <h4 className="font-bold text-lg">{card.title}</h4>
             </div>
             <div className="grid grid-cols-2 gap-4">
               {card.stats && Object.entries(card.stats).map(([key, val]) => (
                 <div key={key}>
                   <div className="text-2xl font-display font-bold text-brand-lime">{val}</div>
                   <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Metric {key}</div>
                 </div>
               ))}
             </div>
          </div>
        );

      case 'pricing-card':
        return (
          <div className="w-full h-full bg-white p-5 flex flex-col">
            <div className="flex justify-between items-start border-b border-zinc-100 pb-3 mb-3">
              <div>
                <h4 className="font-bold">{card.title}</h4>
                <p className="text-[10px] text-zinc-500">{card.subtitle}</p>
              </div>
              <div className="text-lg font-display font-bold">$990</div>
            </div>
            <div className="space-y-2 flex-1">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-2 text-[10px] text-zinc-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0"></div> Feature {i} included
                </div>
              ))}
            </div>
            <button className="w-full py-2 bg-black text-white text-[11px] font-bold rounded-lg mt-auto hover:bg-brand-lime hover:text-black transition-colors pointer-events-auto">Choose Plan</button>
          </div>
        );

      default:
        return <div className="p-4">{card.title}</div>;
    }
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: -600, right: 600, top: -400, bottom: 400 }}
      dragElastic={0.2}
      whileDrag={{ scale: 1.1, cursor: 'grabbing', zIndex: 50, boxShadow: "0 35px 75px -15px rgba(0,0,0,0.3)" }}
      whileHover={{ scale: 1.05, zIndex: 40, boxShadow: "0 30px 60px -15px rgba(0,0,0,0.25)" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: card.width,
        height: card.height,
        left: `calc(50% + ${card.initialX}%)`,
        top: `calc(50% + ${card.initialY}%)`,
        x: translateX,
        y: translateY,
        rotateX,
        rotateY,
        rotate: card.rotation,
        scale: card.scale,
        zIndex: card.zIndex,
        perspective: 1200
      }}
      className="absolute cursor-grab bg-white rounded-2xl shadow-[0_15px_35px_-12px_rgba(0,0,0,0.1)] overflow-hidden border border-black/5 transform-style-3d transition-shadow duration-500 -translate-x-1/2 -translate-y-1/2 hw-accelerate"
    >
      <motion.div
        animate={{
          y: randomY,
          x: randomX,
          rotate: randomRotateFloat
        }}
        transition={{
          duration: card.floatSpeed,
          delay: delayFloat,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut"
        }}
        className="w-full h-full pointer-events-none"
      >
        {renderCardContent()}
      </motion.div>
    </motion.div>
  );
}
