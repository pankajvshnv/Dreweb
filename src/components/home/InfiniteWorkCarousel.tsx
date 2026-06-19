import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimationControls } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

export default function InfiniteWorkCarousel({ projects }: { projects: any[] }) {
  // Duplicate the array multiple times to ensure it fills ultra-wide screens
  // We need an EVEN multiplier so that translating by -50% shifts exactly half the total items.
  const duplicatedProjects = [...projects, ...projects, ...projects, ...projects];

  return (
    <section className="py-24 lg:py-32 bg-zinc-950 text-white overflow-hidden relative rounded-t-[3rem] lg:rounded-t-[5rem]">
      <div className="container mx-auto px-6 mb-16 text-center">
        <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">
          Our Work
        </h2>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          A selection of our finest digital experiences, meticulously crafted for modern brands.
        </p>
      </div>

      <div 
        className="relative flex w-full group"
        style={{
          // Creates the smooth fade mask on left and right edges
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        }}
      >
        <div 
          className="flex w-max gap-6 px-4 animate-marquee-infinite group-hover:[animation-play-state:paused]"
        >
          {duplicatedProjects.map((project, idx) => (
            <motion.div 
              key={`${project.id || project.slug}-${idx}`} 
              className="relative w-[300px] sm:w-[400px] md:w-[500px] aspect-[16/9] flex-shrink-0 rounded-3xl overflow-hidden cursor-pointer bg-zinc-900 border border-white/5 transition-all duration-700 hover:z-10 group/card"
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                // Allows clicking on mobile to pause or interact
              }}
            >
              {/* Background Image/Fallback */}
              {project.heroImage ? (
                <img 
                  src={project.heroImage} 
                  alt={project.title} 
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover/card:opacity-100 group-hover/card:scale-110 transition-all duration-1000 ease-[cubic-bezier(0.25,0.4,0.25,1)]" 
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-zinc-800 font-display text-4xl font-bold uppercase tracking-widest bg-zinc-900">
                  {project.title?.substring(0, 2)}
                </div>
              )}

              {/* Glassmorphism gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity duration-500 group-hover/card:opacity-70" />

              {/* Content overlay */}
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
                <div className="flex justify-between items-end transform translate-y-2 group-hover/card:translate-y-0 transition-transform duration-500 ease-out">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-1 shadow-sm">
                      {project.title}
                    </h3>
                    <p className="text-zinc-300 font-medium text-sm sm:text-base">
                      {project.industry}
                    </p>
                  </div>

                  { (project.link || project.liveUrl) && (
                    <a 
                      href={project.link || project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        window.open(project.link || project.liveUrl, '_blank'); 
                      }}
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-brand-lime hover:text-black transition-colors duration-300 shadow-xl"
                      title="Visit Live Website"
                    >
                      <ArrowUpRight size={20} strokeWidth={2.5} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
