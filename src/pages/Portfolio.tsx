import { Link } from 'react-router-dom';
import { ArrowUpRight, Play } from 'lucide-react';
import { useCollection } from '../lib/useCollection';
import { PROJECTS } from '../lib/data';
import { FadeIn, TextReveal, StaggerContainer, StaggerItem, Magnetic } from '../components/motion/Animations';
import { motion } from 'motion/react';
import { CutoutCorner } from '../components/ui/CutoutCorner';
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

      <section className="px-6 lg:px-8 pb-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {projects.map((project: any, idx: number) => (
            <FadeIn direction={idx % 2 === 0 ? 'right' : 'left'} delay={0.1} distance={80} once={false} key={project.slug || project.id || idx} className="h-full">
              <Link to={`/work/${project.slug}`} className="group block relative h-full">
                
                {/* Card Container */}
                <div className="relative aspect-[16/10] rounded-3xl bg-zinc-100 overflow-hidden">
                  
                  {/* Image / Video Wrapper */}
                  <div className="absolute inset-0 rounded-3xl overflow-hidden">
                    {project.heroVideo ? (
                      <video
                        src={project.heroVideo}
                        autoPlay
                        muted
                        loop
                        playsInline
                        poster={project.heroImage || undefined}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                      />
                    ) : project.heroImage ? (
                      <motion.img src={project.heroImage} alt={project.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
                    ) : (
                       <div className="absolute inset-0 flex items-center justify-center bg-zinc-200 text-zinc-400 font-display text-5xl font-bold uppercase tracking-widest">{project.title?.substring(0, 2)}</div>
                    )}

                    {/* Overlay for hover effect */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                  </div>
                  
                  {/* Perfect SVG Cutout Corner Mask */}
                  <CutoutCorner backgroundColor="#FFFFFF" />
                  
                  {/* Floating Circular Button inside the cutout */}
                  <div className="absolute bottom-2 right-2 z-30 transition-transform duration-500 group-hover:scale-110">
                    <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center text-white group-hover:bg-black transition-colors duration-300">
                      <ArrowUpRight className="w-6 h-6 group-hover:rotate-45 transition-transform duration-500" strokeWidth={2} />
                    </div>
                  </div>

                </div>

                {/* Text Below Card */}
                <div className="mt-6 flex flex-col">
                  <h3 className="font-display text-2xl md:text-3xl font-bold mb-2 tracking-tight group-hover:text-brand-lime transition-colors duration-300 text-zinc-900">{project.title}</h3>
                  <p className="text-xs md:text-sm uppercase tracking-widest text-zinc-500 font-bold">{project.industry}</p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
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
