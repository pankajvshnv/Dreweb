import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code2, PenTool, Megaphone, ArrowUpRight, Layers } from 'lucide-react';
import { PROJECTS } from '../lib/data';
import { useCollection } from '../lib/useCollection';
import { FadeIn, TextReveal, StaggerContainer, StaggerItem, TiltCard, Counter, Magnetic, Float, Parallax, SlideReveal, LineReveal, ScaleIn } from '../components/motion/Animations';
import { FloatingShowcase } from '../components/home/FloatingShowcase';
import SEO from '../components/seo/SEO';
import { useRef, useEffect, useState } from 'react';

export default function Home() {
  const { data: testimonials } = useCollection<any>('testimonials');
  const { data: dynamicProjects } = useCollection<any>('projects');
  const displayProjects = dynamicProjects && dynamicProjects.length > 0
    ? dynamicProjects.filter((p: any) => p.isPublic !== false).slice(0, 4)
    : PROJECTS.slice(0, 4);

  const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : [
    { id: 1, quote: "The custom agentic workflows they built reduced our manual data entry by 90%, saving us hundreds of hours weekly.", author: "MARCUS CHENG", role: "Head of AI, Aetna", authorImage: "https://i.pravatar.cc/150?u=1" },
    { id: 2, quote: "Their team didn't just provide tools; they provided a roadmap for AI integration that actually makes sense for ROI.", author: "DAVID ROSSI", role: "Lead Dev, Cigna", authorImage: "https://i.pravatar.cc/150?u=2" },
    { id: 3, quote: "A game-changer for our R&D. The neural infrastructure is robust, secure, and perfectly tailored to our niche stack.", author: "SARAH JENKINS", role: "CTO, Anthem Group", authorImage: "https://i.pravatar.cc/150?u=3" },
    { id: 4, quote: "Incredible technical depth. They handled our complex RAG implementation with ease and delivered ahead of schedule.", author: "ELENA VANCE", role: "VP Eng, UnitedHealth", authorImage: "https://i.pravatar.cc/150?u=4" },
  ];

  // Mouse parallax for hero
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <div className="w-full">
      <SEO
        title="Dreweb - Premium Web Design & Development Agency"
        description="We create visually refined digital experiences with modern UI/UX, fast and scalable development, and SEO optimization to help brands grow."
        canonicalUrl="/"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Dreweb",
          "url": "https://dreweb.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://dreweb.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }}
      />
      {/* ━━━ HERO SHOWCASE ━━━ */}
      <FloatingShowcase />

      {/* ━━━ MARQUEE ━━━ */}
      <section className="py-10 bg-brand-lime text-black overflow-hidden rotate-[-1deg] scale-105 origin-center border-y border-black/5 relative z-10">
        <div className="whitespace-nowrap flex items-center select-none font-display text-3xl md:text-5xl uppercase font-extrabold tracking-wider">
          <div className="animate-marquee inline-block">
            <span>Mobile App Development</span><span className="mx-8 text-black/20">✦</span>
            <span>Website Development</span><span className="mx-8 text-black/20">✦</span>
            <span>MODERN DEVELOPMENT</span><span className="mx-8 text-black/20">✦</span>
          </div>
          <div className="animate-marquee inline-block">
            <span>Mobile App Development</span><span className="mx-8 text-black/20">✦</span>
            <span>Website Development</span><span className="mx-8 text-black/20">✦</span>
            <span>MODERN DEVELOPMENT</span><span className="mx-8 text-black/20">✦</span>
          </div>
        </div>
      </section>

      {/* ━━━ SERVICES BENTO ━━━ */}
      <section className="py-24 lg:py-32 px-6 lg:px-8 max-w-7xl mx-auto">
        <FadeIn>
          <div className="mb-10 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <SlideReveal><span className="text-brand-indigo font-semibold tracking-wide uppercase text-sm mb-3 block">Our Expertise</span></SlideReveal>
              <TextReveal as="h3" className="font-display text-4xl lg:text-5xl font-bold tracking-tighter" delay={0.1}>Everything you need to dominate your market.</TextReveal>
            </div>
            <Magnetic><Link to="/services" className="inline-flex items-center gap-2 font-medium border-b border-black pb-1 hover:text-brand-lime hover:border-brand-lime transition-colors whitespace-nowrap">View All Services <ArrowRight className="w-4 h-4" /></Link></Magnetic>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(280px,auto)]" stagger={0.12}>
          <StaggerItem className="md:col-span-2">
            <TiltCard className="h-full bg-brand-lime rounded-[24px] p-8 relative overflow-hidden group border border-surface-border flex flex-col">
              <div className="absolute top-0 right-0 p-8 text-black/20 group-hover:text-black/50 transition-colors"><Code2 size={48} strokeWidth={2} /></div>
              <div className="flex justify-between items-start"><span className="px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.05em] bg-black text-white">Featured Service</span><span className="font-bold">01</span></div>
              <div className="relative z-10 flex flex-col justify-end mt-auto pt-20">
                <h4 className="font-display text-3xl font-extrabold mb-2">Web & App Development</h4>
                <p className="text-black/70 max-w-md font-medium mb-6">Custom SaaS platforms, corporate websites, e-commerce stores, and high-performance applications built with modern stacks.</p>
                <Link to="/services/custom-website" className="inline-flex items-center gap-2 font-bold text-sm w-fit group-hover:translate-x-2 transition-transform duration-300">Explore Engineering <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </TiltCard>
          </StaggerItem>

          <StaggerItem>
            <TiltCard className="h-full bg-surface-gray rounded-[24px] p-8 relative overflow-hidden group border border-surface-border flex flex-col">
              <div className="flex justify-between items-start"><span className="px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.05em] bg-white text-black border border-surface-border">Design</span><span className="font-bold">02</span></div>
              <div className="relative z-10 flex flex-col justify-end mt-auto pt-12">
                <PenTool size={32} className="text-brand-blue mb-4 group-hover:rotate-12 transition-transform duration-500" />
                <h4 className="font-display text-3xl font-extrabold mb-2">UI/UX</h4>
                <p className="text-zinc-500 mb-6 text-sm font-medium">Crafting premium, conversion-focused interfaces.</p>
                <Link to="/services/ui-ux-design" className="inline-flex items-center gap-2 font-bold text-sm w-fit text-brand-blue hover:text-black transition-colors">View Design <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </TiltCard>
          </StaggerItem>

          <StaggerItem>
            <TiltCard className="h-full bg-black text-white rounded-[24px] p-8 relative group border border-black overflow-hidden flex flex-col">
              <motion.div className="absolute -right-20 -bottom-20 w-40 h-40 bg-brand-lime/10 rounded-full blur-[60px] group-hover:scale-[2] transition-transform duration-700" />
              <div className="flex justify-between items-start"><span className="px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.05em] bg-white/10 text-white">Growth</span><span className="font-bold">03</span></div>
              <div className="relative z-10 flex flex-col justify-end mt-auto pt-12">
                <Megaphone size={32} className="text-brand-lime mb-4 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500" />
                <h4 className="font-display text-3xl font-extrabold mb-2">Marketing</h4>
                <p className="text-zinc-400 mb-6 text-sm font-medium">Data-driven marketing and SEO to scale traffic.</p>
                <Link to="/services/seo-optimization" className="inline-flex items-center gap-2 font-bold text-sm w-fit text-white hover:text-brand-lime transition-colors">Explore Growth <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </TiltCard>
          </StaggerItem>

          <StaggerItem className="md:col-span-2">
            <TiltCard className="h-full bg-brand-indigo rounded-[24px] p-8 relative overflow-hidden group flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-indigo to-blue-600"></div>
              <motion.div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-[50px] group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10 flex justify-between items-start"><div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white"><Layers size={24} /></div><span className="font-bold text-white/50">04</span></div>
              <div className="relative z-10 flex flex-col justify-end mt-auto pt-16">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex -space-x-3"><div className="w-10 h-10 rounded-full border-2 border-brand-indigo bg-gray-300"></div><div className="w-10 h-10 rounded-full border-2 border-brand-indigo bg-gray-400"></div><div className="w-10 h-10 rounded-full border-2 border-brand-indigo bg-gray-500"></div></div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-white/80 italic">Design • Develop • Deliver</span>
                </div>
                <div>
                  <h4 className="font-display text-2xl md:text-3xl font-semibold mb-6 text-white text-balance leading-snug">"dreweb transformed our entire digital ecosystem and helped us scale faster."</h4>
                  <Link to="/work" className="inline-flex items-center gap-2 font-bold text-sm w-fit text-white hover:text-brand-lime transition-colors">Read Case Studies <ArrowRight className="w-4 h-4" /></Link>
                </div>
              </div>
            </TiltCard>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* ━━━ PORTFOLIO ━━━ */}
      <section className="py-24 lg:py-32 bg-zinc-950 text-white rounded-t-[3rem] lg:rounded-t-[5rem]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="max-w-2xl">
                <TextReveal as="h2" className="font-display text-4xl lg:text-6xl font-bold tracking-tighter mb-6 text-white">Selected Work.</TextReveal>
                <p className="text-zinc-400 text-lg sm:text-xl font-light">We partner with visionary companies to build digital products that shape industries.</p>
              </div>
              <Magnetic><Link to="/work" className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-full font-medium hover:bg-white hover:text-black transition-all whitespace-nowrap" data-cursor="View All">View All Projects</Link></Magnetic>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {displayProjects.map((project: any, idx: number) => (
              <FadeIn key={project.slug || idx} delay={idx * 0.1}>
                <Link to={`/work/${project.slug}`} className="group block" data-cursor="View">
                  <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-zinc-900 mb-6">
                    {project.heroImage ? (
                      <motion.img src={project.heroImage} alt={project.title} className="absolute inset-0 w-full h-full object-cover" whileHover={{ scale: 1.08 }} transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }} />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-zinc-800 font-display text-3xl font-bold uppercase tracking-widest">{project.title.substring(0, 2)}</div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <motion.div className="w-16 h-16 bg-brand-lime text-black rounded-full flex items-center justify-center" initial={{ scale: 0.5, opacity: 0 }} whileHover={{ scale: 1 }} animate={{}} whileInView={{}}><ArrowUpRight size={24} strokeWidth={2.5} /></motion.div>
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-display text-2xl font-bold mb-2 group-hover:text-brand-lime transition-colors duration-300">{project.title}</h3>
                      <p className="text-zinc-500 font-medium">{project.industry}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-zinc-500 border border-white/10 rounded-full px-3 py-1 text-sm">{project.year}</span>
                      { (project.link || project.liveUrl) && (
                        <a 
                          href={project.link || project.liveUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(project.link || project.liveUrl, '_blank'); }}
                          className="flex items-center gap-1 text-xs font-bold text-white bg-white/10 hover:bg-white/20 hover:text-brand-lime px-3 py-1.5 rounded-full transition-all"
                        >
                          Visit Site <ArrowUpRight size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ STATS ━━━ */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center" stagger={0.1}>
            {[
              { value: 25, suffix: '+', label: 'Clients Served' },
              { value: 50, suffix: '+', label: 'Projects Delivered' },
              { value: 3, suffix: 'yrs', label: 'Experience' },
              { value: 98, suffix: '%', label: 'Client Satisfaction' },
            ].map((stat, i) => (
              <StaggerItem key={i}>
                <p className="font-display text-5xl md:text-6xl font-bold mb-2 text-brand-lime">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-zinc-400 text-sm font-semibold uppercase tracking-wider">{stat.label}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ━━━ TESTIMONIALS ━━━ */}
      <section className="py-24 overflow-hidden bg-white">
        <ScaleIn>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16 max-w-3xl text-center">
            <TextReveal as="h2" className="font-display text-4xl lg:text-5xl font-bold tracking-tighter text-black">Don't just take our word for it.</TextReveal>
          </div>
        </ScaleIn>
        <div className="relative flex overflow-x-hidden group">
          <div className="animate-marquee flex gap-6 pr-6 min-w-max shrink-0 hover:[animation-play-state:paused]">
            {displayTestimonials.map((item: any, idx: number) => (
              <motion.div key={idx} whileHover={{ y: -8, transition: { duration: 0.3 } }} className="w-[350px] md:w-[400px] shrink-0 bg-surface-gray rounded-3xl p-8 flex flex-col justify-between border border-surface-border hover:border-brand-lime/30 transition-colors duration-300">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    {item.authorImage ? (<img src={item.authorImage} alt={item.author} className="w-10 h-10 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />) : (<div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-black">{item.author?.[0]}</div>)}
                  </div>
                  <p className="text-lg font-medium leading-relaxed text-black mb-8">{item.quote}</p>
                </div>
                <div>
                  <p className="font-display font-bold text-sm tracking-widest uppercase text-black">{item.author}</p>
                  <p className="text-sm text-zinc-500 mt-1">{item.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="animate-marquee flex gap-6 pr-6 min-w-max shrink-0 hover:[animation-play-state:paused]" aria-hidden="true">
            {displayTestimonials.map((item: any, idx: number) => (
              <motion.div key={idx} whileHover={{ y: -8, transition: { duration: 0.3 } }} className="w-[350px] md:w-[400px] shrink-0 bg-surface-gray rounded-3xl p-8 flex flex-col justify-between border border-surface-border hover:border-brand-lime/30 transition-colors duration-300">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    {item.authorImage ? (<img src={item.authorImage} alt={item.author} className="w-10 h-10 rounded-full object-cover grayscale" />) : (<div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-black">{item.author?.[0]}</div>)}
                  </div>
                  <p className="text-lg font-medium leading-relaxed text-black mb-8">{item.quote}</p>
                </div>
                <div>
                  <p className="font-display font-bold text-sm tracking-widest uppercase text-black">{item.author}</p>
                  <p className="text-sm text-zinc-500 mt-1">{item.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
        </div>
      </section>

      {/* ━━━ PROCESS ━━━ */}
      <section className="py-24 lg:py-32 px-6 lg:px-8 max-w-7xl mx-auto border-b border-zinc-100">
        <ScaleIn>
          <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
            <TextReveal as="h2" className="font-display text-4xl lg:text-5xl font-bold tracking-tighter mb-6">How we operate.</TextReveal>
            <p className="text-zinc-500 text-lg">A simple, transparent, and results-driven process designed to move fast and break records.</p>
          </div>
        </ScaleIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-12" stagger={0.15}>
          {[
            { step: '01', title: 'Discovery & Strategy', desc: 'Understanding your business goals, target audience, and competitive landscape.' },
            { step: '02', title: 'UX/UI Design', desc: 'Creating wireframes, prototypes, and a premium visual language that converts.' },
            { step: '03', title: 'Development', desc: 'Building scalable, fast, and SEO-optimized architecture using modern frameworks.' },
            { step: '04', title: 'Launch & Scale', desc: 'Rigorous QA, smooth deployment, and ongoing performance optimization.' }
          ].map((item, idx) => (
            <StaggerItem key={idx} className="relative group">
              <div className="w-12 h-12 rounded-full border border-zinc-200 flex items-center justify-center font-display font-bold text-zinc-400 mb-6 group-hover:bg-brand-lime group-hover:text-black group-hover:border-brand-lime group-hover:scale-110 transition-all duration-300">{item.step}</div>
              <h4 className="text-xl font-bold mb-3">{item.title}</h4>
              <p className="text-zinc-500 leading-relaxed text-sm">{item.desc}</p>
              {idx !== 3 && <div className="hidden md:block absolute top-6 left-16 right-0 h-px bg-zinc-200 -z-10"></div>}
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

    </div>
  );
}
