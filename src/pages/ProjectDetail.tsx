import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Play } from 'lucide-react';
import { useDocumentBySlug } from '../lib/useDocument';
import NotFound from './NotFound';
import { FadeIn, TextReveal, ScaleIn, Magnetic, ImageReveal } from '../components/motion/Animations';
import { motion } from 'motion/react';

export default function ProjectDetail() {
  const { slug } = useParams();
  const { data: project, loading } = useDocumentBySlug<any>('projects', slug);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-brand-lime border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) return <NotFound />;

  return (
    <div className="w-full bg-white pb-24">
      {/* Hero */}
      <section className="pt-24 pb-16 px-6 lg:px-8 max-w-7xl mx-auto">
        <FadeIn>
          <Link to="/work" className="inline-flex items-center gap-2 text-zinc-500 hover:text-black transition-colors font-medium mb-12">
            <ArrowLeft className="w-4 h-4" /> Back to Work
          </Link>
        </FadeIn>
        
        <div className="max-w-4xl">
          <FadeIn delay={0.1}>
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-4 py-1.5 bg-brand-lime text-black font-semibold text-sm rounded-full">{project.industry || project.client}</span>
              {project.year && <span className="px-4 py-1.5 border border-zinc-200 text-zinc-600 font-medium text-sm rounded-full">{project.year}</span>}
            </div>
          </FadeIn>
          
          <TextReveal as="h1" className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-[1.05]">
            {project.title}
          </TextReveal>
          
          <FadeIn delay={0.4}>
            <p className="text-xl text-zinc-600 font-light max-w-3xl text-balance leading-relaxed whitespace-pre-wrap">
              {project.shortDescription}
            </p>
            { (project.link || project.liveUrl) && (
              <div className="mt-8">
                <a href={project.link || project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full font-bold hover:bg-zinc-800 transition-colors">
                  Visit Website <ArrowUpRight className="w-5 h-5" />
                </a>
              </div>
            )}
          </FadeIn>
        </div>
      </section>

      {/* Main Media */}
      <section className="px-6 lg:px-8 max-w-7xl mx-auto mb-24">
        <ScaleIn delay={0.2}>
          <div className="w-full aspect-video bg-zinc-100 rounded-[2rem] md:rounded-[3rem] border border-zinc-200 flex items-center justify-center relative overflow-hidden group">
            {project.heroVideo ? (
              <>
                <video
                  src={project.heroVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={project.heroImage || undefined}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Subtle overlay on hover */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full flex items-center justify-center shadow-2xl"
                  >
                    <Play size={28} strokeWidth={2} fill="currentColor" />
                  </motion.div>
                </div>
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                  <Play size={11} fill="currentColor" /> VIDEO
                </div>
              </>
            ) : project.heroImage ? (
              <motion.img 
                src={project.heroImage} 
                alt={project.title} 
                className="w-full h-full object-cover relative z-10"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-200 to-zinc-50 opacity-50"></div>
                <motion.span whileHover={{ scale: 1.1 }} className="font-display text-6xl md:text-9xl font-bold text-zinc-300 uppercase tracking-widest relative z-10 transition-transform duration-500">Mockup</motion.span>
              </>
            )}
          </div>
        </ScaleIn>
      </section>

      {/* Project Details */}
      <section className="px-6 lg:px-8 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
        <div className="md:col-span-2">
          {project.challenge && (
            <FadeIn>
              <h2 className="font-display text-3xl font-bold mb-6">The Challenge</h2>
              <p className="text-zinc-600 mb-8 leading-relaxed text-lg whitespace-pre-wrap">
                {project.challenge}
              </p>
            </FadeIn>
          )}
          
          {project.solution && (
            <FadeIn delay={0.2}>
              <h2 className="font-display text-3xl font-bold mb-6 mt-12">The Solution</h2>
              <p className="text-zinc-600 leading-relaxed text-lg mb-6 whitespace-pre-wrap">
                {project.solution}
              </p>
            </FadeIn>
          )}
        </div>
        
        <div className="md:col-span-1">
          <FadeIn delay={0.3}>
            <div className="bg-zinc-50 p-8 rounded-[2rem] border border-zinc-100 hover:border-brand-lime/50 transition-colors duration-300">
              {project.technologies && project.technologies.length > 0 && (
                <>
                  <h3 className="font-bold text-lg mb-6">Technologies used</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech: string, i: number) => (
                      <motion.span 
                        key={tech} 
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="px-3 py-1 bg-white border border-zinc-200 rounded-md text-sm font-medium cursor-default hover:border-black transition-colors"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </FadeIn>
        </div>
      </section>
      
      {/* Next Project CTA */}
      <section className="mt-32 px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <ScaleIn>
          <p className="text-zinc-500 font-medium mb-4 uppercase tracking-widest text-sm">Next Project</p>
          <Magnetic>
            <Link to="/work" className="font-display text-5xl md:text-7xl font-bold tracking-tighter hover:text-brand-lime transition-colors inline-block" data-cursor="Next">
              View all work.
            </Link>
          </Magnetic>
        </ScaleIn>
      </section>
    </div>
  );
}
