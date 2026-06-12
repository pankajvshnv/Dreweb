import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useCollection } from '../lib/useCollection';
import { PROJECTS } from '../lib/data';
import { FadeIn, TextReveal, StaggerContainer, StaggerItem, Magnetic } from '../components/motion/Animations';
import { motion } from 'motion/react';
import SEO from '../components/seo/SEO';

export default function Portfolio() {
  const { data: dynamicProjects } = useCollection<any>('projects');
  const projects = dynamicProjects && dynamicProjects.length > 0
    ? dynamicProjects.filter((p: any) => p.isPublic !== false)
    : PROJECTS;

  return (
    <div className="w-full pb-24">
      <SEO 
        title="Our Portfolio | Dreweb Projects"
        description="A curated selection of Dreweb projects showcasing our design, engineering, and strategic capabilities."
        canonicalUrl="/work"
      />
      <section className="pt-24 pb-16 px-6 lg:px-8 max-w-7xl mx-auto">
        <TextReveal as="h1" className="font-display text-5xl md:text-7xl font-bold tracking-tighter mb-6 max-w-4xl">Our Work.</TextReveal>
        <FadeIn delay={0.4}>
          <p className="text-xl text-zinc-500 font-light max-w-2xl text-balance">
            A curated selection of projects that showcase our design, engineering, and strategic capabilities.
          </p>
        </FadeIn>
      </section>

      <section className="px-6 lg:px-8 max-w-7xl mx-auto">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-10" stagger={0.1}>
          {projects.map((project: any) => (
            <StaggerItem key={project.slug || project.id}>
              <Link to={`/work/${project.slug}`} className="group block" data-cursor="View">
                <motion.div whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                  <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-zinc-100 mb-6">
                    {project.heroImage ? (
                      <motion.img src={project.heroImage} alt={project.title} className="absolute inset-0 w-full h-full object-cover" whileHover={{ scale: 1.06 }} transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }} />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-zinc-300 font-display text-4xl font-bold uppercase tracking-widest">{project.title?.substring(0,2)}</div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center">
                      <motion.div initial={{ scale: 0, opacity: 0 }} whileHover={{ scale: 1, opacity: 1 }} className="w-16 h-16 bg-brand-lime text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-50 transition-all duration-300">
                        <ArrowUpRight size={24} strokeWidth={2.5}/>
                      </motion.div>
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-display text-2xl font-bold mb-1 group-hover:text-brand-indigo transition-colors duration-300">{project.title}</h3>
                      <p className="text-zinc-500 font-medium text-sm">{project.industry}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-zinc-400 border border-zinc-200 rounded-full px-3 py-1 text-sm">{project.year}</span>
                      { (project.link || project.liveUrl) && (
                        <a 
                          href={project.link || project.liveUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(project.link || project.liveUrl, '_blank'); }}
                          className="flex items-center gap-1 text-xs font-bold text-zinc-600 bg-white border border-zinc-200 hover:border-black hover:text-black px-3 py-1.5 rounded-full transition-all shadow-sm"
                        >
                          Visit Site <ArrowUpRight size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <section className="mt-32 max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <FadeIn>
          <h2 className="font-display text-4xl font-bold mb-4">Have a project in mind?</h2>
          <p className="text-zinc-500 mb-8 max-w-lg mx-auto">Let's discuss how we can bring your vision to life.</p>
          <Magnetic><Link to="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-black text-white rounded-full font-semibold hover:bg-zinc-800 transition-colors" data-cursor="Let's Talk">Start a Project</Link></Magnetic>
        </FadeIn>
      </section>
    </div>
  );
}
