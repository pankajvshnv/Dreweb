import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function InfiniteWorkSlider({ projects }: { projects: any[] }) {
  const controls = useAnimation();
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  // Duplicate the projects enough times to ensure it overflows the screen
  const duplicatedProjects = [
    ...projects, ...projects, ...projects, ...projects,
    ...projects, ...projects, ...projects, ...projects
  ];

  useEffect(() => {
    if (!isHovered && projects.length > 0) {
      controls.start({
        x: ['0%', '-50%'],
        transition: {
          ease: 'linear',
          duration: projects.length * 15, // Speed relative to number of items
          repeat: Infinity,
        },
      });
    } else {
      controls.stop();
    }
  }, [isHovered, controls, projects.length]);

  const handleMouseEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setIsHovered(false);
    }, 5000); // Wait 5 seconds before resuming
  };

  if (!projects || projects.length === 0) return null;

  return (
    <div 
      className="relative w-full overflow-hidden py-12 cursor-grab active:cursor-grabbing" 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
    >
      <motion.div 
        className="flex gap-6 w-max px-4"
        animate={controls}
      >
        {duplicatedProjects.map((project, idx) => (
          <div key={`${project.slug}-${idx}`} className="w-[300px] md:w-[400px] shrink-0">
            <Link to={`/work/${project.slug}`} className="group block h-full">
              <div className="glass-card h-[400px] flex flex-col p-6 relative">
                {/* Background image container */}
                <div className="absolute inset-0 z-0">
                  {project.heroImage ? (
                    <img 
                      src={project.heroImage} 
                      alt={project.title} 
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out" 
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center group-hover:bg-zinc-800 transition-colors duration-700">
                       <span className="text-zinc-800 group-hover:text-zinc-700 transition-colors font-display text-6xl font-bold uppercase">{project.title?.substring(0, 2)}</span>
                    </div>
                  )}
                  {/* Subtle gradient overlay to ensure text is readable */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                  {/* Glassmorphism ambient glow on hover */}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-500"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex justify-end">
                     {(project.link || project.liveUrl) && (
                        <a 
                          href={project.link || project.liveUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(project.link || project.liveUrl, '_blank'); }}
                          className="glass-button w-12 h-12 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500"
                        >
                          <ArrowUpRight size={20} />
                        </a>
                     )}
                  </div>
                  
                  <div className="transform group-hover:translate-y-[-8px] transition-transform duration-500">
                    <h3 className="text-white font-display text-2xl font-bold mb-1 drop-shadow-md">{project.title}</h3>
                    <p className="text-white/70 font-medium text-sm">{project.industry}</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
