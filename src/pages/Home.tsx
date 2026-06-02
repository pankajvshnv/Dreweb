import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code2, PenTool, Megaphone, ArrowUpRight, Layers, Play, Sparkles, TrendingUp, Bot, Smartphone, Globe, Zap, BarChart3 } from 'lucide-react';
import { PROJECTS } from '../lib/data';
import { useCollection } from '../lib/useCollection';
import { FadeIn, TextReveal, StaggerContainer, StaggerItem, TiltCard, Counter, Magnetic, Float, Parallax, SlideReveal, LineReveal, ScaleIn, MouseGradient } from '../components/motion/Animations';
import { FloatingShowcase } from '../components/home/FloatingShowcase';
import { CutoutCorner } from '../components/ui/CutoutCorner';
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
    <div className="w-full relative">
      <MouseGradient className="opacity-40" />
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
      <section className="py-24 lg:py-32 px-6 lg:px-8 max-w-7xl mx-auto relative">
        {/* Glow effect in background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-lime/5 rounded-full blur-[100px] pointer-events-none" />
        
        <FadeIn>
          <div className="mb-12 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
            <div className="max-w-2xl">
              <SlideReveal><span className="flex items-center gap-2 text-brand-indigo font-bold tracking-widest uppercase text-xs mb-4"><Sparkles className="w-4 h-4" /> Core Capabilities</span></SlideReveal>
              <TextReveal as="h3" className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter leading-[1.1]" delay={0.1}>Everything you need to dominate your market.</TextReveal>
            </div>
            <Magnetic><Link to="/services" className="inline-flex items-center gap-2 font-bold text-sm bg-black text-white px-6 py-3 rounded-full hover:bg-brand-lime hover:text-black transition-all duration-300 shadow-xl hover:shadow-brand-lime/20 hover:-translate-y-1 whitespace-nowrap">Explore All Services <ArrowRight className="w-4 h-4" /></Link></Magnetic>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[280px] md:auto-rows-[320px] relative z-10">
          
          {/* Card 1: Web & App Dev (Large) */}
          <FadeIn direction="right" distance={60} delay={0.1} once={false} className="md:col-span-2 lg:col-span-2 row-span-2 h-full">
            <TiltCard className="h-full bg-zinc-950 text-white rounded-[2rem] p-8 md:p-10 relative overflow-hidden group flex flex-col shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black z-0"></div>
              {/* Animated background grid */}
              <div className="absolute inset-0 opacity-[0.03] z-0" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
              <motion.div className="absolute -right-20 -top-20 w-64 h-64 bg-brand-lime/20 rounded-full blur-[80px] group-hover:bg-brand-lime/30 transition-colors duration-700 z-0" />
              
              <div className="relative z-10 flex justify-between items-start">
                <span className="px-4 py-2 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-white/10 backdrop-blur-md text-white border border-white/10">Flagship</span>
                <Globe className="text-white/30 w-8 h-8 group-hover:text-brand-lime group-hover:rotate-12 transition-all duration-500" />
              </div>
              
              <div className="relative z-10 flex flex-col justify-end mt-auto pt-20">
                <Float duration={4} distance={8} className="mb-6 w-16 h-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Code2 className="text-brand-lime w-8 h-8" />
                </Float>
                <h4 className="font-display text-3xl md:text-4xl font-extrabold mb-4 tracking-tight text-white">Web & App<br/>Development</h4>
                <p className="text-zinc-400 max-w-md font-medium text-sm md:text-base mb-8 leading-relaxed">Custom SaaS platforms, corporate websites, e-commerce stores, and high-performance applications built with modern frameworks and flawless architecture.</p>
                <Link to="/services/custom-website" className="inline-flex items-center gap-2 font-bold text-sm w-fit text-brand-lime hover:text-white transition-colors duration-300 group/link">
                  Explore Engineering <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </TiltCard>
          </FadeIn>

          {/* Card 2: UI/UX */}
          <FadeIn direction="left" distance={60} delay={0.2} once={false} className="md:col-span-1 lg:col-span-1 row-span-1 h-full">
            <TiltCard className="h-full bg-surface-gray rounded-[2rem] p-8 relative overflow-hidden group flex flex-col shadow-sm hover:shadow-xl transition-shadow duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center border border-zinc-100 mb-auto">
                  <PenTool className="text-brand-blue w-6 h-6" />
                </div>
                <div className="pt-8">
                  <h4 className="font-display text-2xl font-bold mb-2">UI/UX Design</h4>
                  <p className="text-zinc-500 text-sm font-medium mb-4">Crafting premium, conversion-focused digital interfaces.</p>
                  <Link to="/services/ui-ux-design" className="inline-flex items-center gap-1 font-bold text-xs uppercase tracking-wider text-brand-blue hover:text-black transition-colors">View Design <ArrowRight className="w-3 h-3" /></Link>
                </div>
              </div>
            </TiltCard>
          </FadeIn>

          {/* Card 3: AI Agents (New) */}
          <FadeIn direction="left" distance={60} delay={0.3} once={false} className="md:col-span-1 lg:col-span-1 row-span-1 h-full">
            <TiltCard className="h-full bg-brand-indigo rounded-[2rem] p-8 relative overflow-hidden group flex flex-col shadow-xl">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent z-0"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 mb-auto text-white">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="pt-8 text-white">
                  <h4 className="font-display text-2xl font-bold mb-2 text-white">AI Automation</h4>
                  <p className="text-white/70 text-sm font-medium mb-4">Smart agents & workflow automation to 10x your output.</p>
                  <Link to="/services/ai-automation" className="inline-flex items-center gap-1 font-bold text-xs uppercase tracking-wider text-brand-lime hover:text-white transition-colors">Integrate AI <ArrowRight className="w-3 h-3" /></Link>
                </div>
              </div>
            </TiltCard>
          </FadeIn>

          {/* Card 4: Brand Identity (New) */}
          <FadeIn direction="left" distance={60} delay={0.4} once={false} className="md:col-span-1 lg:col-span-1 row-span-1 h-full">
            <TiltCard className="h-full bg-brand-lime rounded-[2rem] p-8 relative overflow-hidden group flex flex-col shadow-lg">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/20 rounded-full blur-[20px] group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-auto text-white">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="pt-8 text-black">
                  <h4 className="font-display text-2xl font-extrabold mb-2">Brand Identity</h4>
                  <p className="text-black/70 text-sm font-medium mb-4">Unforgettable visual systems that capture attention.</p>
                  <Link to="/services/branding" className="inline-flex items-center gap-1 font-bold text-xs uppercase tracking-wider text-black/60 hover:text-black transition-colors">See Branding <ArrowRight className="w-3 h-3" /></Link>
                </div>
              </div>
            </TiltCard>
          </FadeIn>

          {/* Card 5: Growth & SEO */}
          <FadeIn direction="left" distance={60} delay={0.5} once={false} className="md:col-span-1 lg:col-span-1 row-span-1 h-full">
            <TiltCard className="h-full bg-white rounded-[2rem] p-8 relative overflow-hidden group flex flex-col shadow-sm hover:shadow-xl transition-shadow duration-500">
               <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center border border-orange-100 mb-auto">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="pt-8">
                  <h4 className="font-display text-2xl font-bold mb-2">SEO & Growth</h4>
                  <p className="text-zinc-500 text-sm font-medium mb-4">Data-driven marketing to dominate search rankings.</p>
                  <Link to="/services/seo-optimization" className="inline-flex items-center gap-1 font-bold text-xs uppercase tracking-wider text-orange-600 hover:text-black transition-colors">Scale Traffic <ArrowRight className="w-3 h-3" /></Link>
                </div>
              </div>
            </TiltCard>
          </FadeIn>

          {/* Card 6: Success / Testimonial (Wide) */}
          <FadeIn direction="right" distance={60} delay={0.6} once={false} className="md:col-span-2 lg:col-span-4 row-span-1 h-full">
            <TiltCard className="h-full bg-black text-white rounded-[2rem] p-8 md:p-10 relative overflow-hidden group flex flex-col shadow-2xl justify-between">
              <div className="absolute right-0 bottom-0 w-1/2 h-full bg-gradient-to-l from-brand-indigo/20 to-transparent blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10 flex justify-between items-start mb-6">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center overflow-hidden"><img src="https://i.pravatar.cc/150?u=1" alt="Client" className="w-full h-full object-cover grayscale" /></div>
                  <div className="w-10 h-10 rounded-full border-2 border-black bg-zinc-700 flex items-center justify-center overflow-hidden"><img src="https://i.pravatar.cc/150?u=2" alt="Client" className="w-full h-full object-cover grayscale" /></div>
                  <div className="w-10 h-10 rounded-full border-2 border-black bg-zinc-600 flex items-center justify-center text-xs font-bold">+25</div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-lime">
                  <BarChart3 className="w-3 h-3" /> Proven Results
                </div>
              </div>
              <div className="relative z-10 mt-auto">
                <h4 className="font-display text-xl md:text-2xl font-semibold mb-4 text-white text-balance leading-snug">"dreweb transformed our entire digital ecosystem, integrated custom AI agents, and helped us scale traffic by 300%."</h4>
                <Link to="/work" className="inline-flex items-center gap-2 font-bold text-sm w-fit text-zinc-400 hover:text-white transition-colors group/link">
                  Read Client Success Stories <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </TiltCard>
          </FadeIn>

        </div>
      </section>

      {/* ━━━ PORTFOLIO ━━━ */}
      <section className="py-24 lg:py-32 bg-surface-gray text-black relative overflow-hidden rounded-t-[3rem] lg:rounded-t-[5rem]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          
          <FadeIn>
            {/* Top Badge */}
            <div className="inline-flex items-center justify-center px-4 py-1.5 border border-black/20 rounded-full mb-8 bg-white">
              <span className="text-sm font-semibold tracking-wide">Our Work</span>
            </div>

            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <div className="max-w-2xl">
                <h2 className="font-display text-5xl md:text-6xl font-extrabold tracking-tighter mb-6 text-black">Our Latest Work</h2>
                <p className="text-zinc-600 text-lg md:text-xl font-medium max-w-lg leading-relaxed">
                  Our tailored solutions empower your online presence, ensuring growth and success in the digital landscape.
                </p>
              </div>
              <Magnetic>
                <Link to="/work" className="group inline-flex items-center justify-center gap-3 px-6 py-3 md:px-8 md:py-4 bg-zinc-900 text-white rounded-full font-bold transition-colors duration-300 hover:bg-black whitespace-nowrap">
                  <span>See more</span>
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </Link>
              </Magnetic>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {displayProjects.map((project: any, idx: number) => (
              <FadeIn direction={idx % 2 === 0 ? 'right' : 'left'} delay={0.1} distance={80} once={false} key={project.slug || idx} className="h-full">
                <Link to={`/work/${project.slug}`} className="group block relative h-full">
                  
                  {/* Card Container */}
                  <div className="relative aspect-video rounded-3xl bg-zinc-100 overflow-hidden">
                    
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

                      {/* Overlay for text */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                      
                      {/* Project Data Overlay */}
                      <div className="absolute bottom-8 left-8 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 z-20 translate-y-4 group-hover:translate-y-0 pointer-events-none pr-24">
                        <h3 className="font-display text-2xl font-bold mb-1 tracking-tight">{project.title}</h3>
                        <p className="text-xs uppercase tracking-widest text-white/80 font-bold">{project.industry}</p>
                      </div>
                    </div>
                    
                    {/* Perfect SVG Cutout Corner Mask */}
                    <CutoutCorner backgroundColor="#F9FAFB" />
                    
                    {/* Floating Circular Button inside the cutout */}
                    <div className="absolute bottom-2 right-2 z-30 transition-transform duration-500 group-hover:scale-110">
                      <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center text-white group-hover:bg-black transition-colors duration-300">
                        <ArrowUpRight className="w-6 h-6 group-hover:rotate-45 transition-transform duration-500" strokeWidth={2} />
                      </div>
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
      <section className="py-32 overflow-hidden bg-zinc-950 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] mix-blend-overlay"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-brand-lime/10 blur-[120px] rounded-full pointer-events-none"></div>

        <FadeIn distance={40} once={false}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-20 max-w-3xl text-center relative z-10">
            <span className="flex items-center justify-center gap-2 text-brand-lime font-bold tracking-widest uppercase text-xs mb-6">
              <Sparkles className="w-4 h-4" /> Client Stories
            </span>
            <TextReveal as="h2" className="font-display text-4xl lg:text-5xl lg:text-6xl font-extrabold tracking-tighter text-white">Don't just take our word for it.</TextReveal>
          </div>
        </FadeIn>

        <FadeIn direction="up" distance={80} delay={0.2} once={false}>
          <div className="relative flex overflow-x-hidden group z-10">
            <div className="animate-marquee flex gap-6 pr-6 min-w-max shrink-0 hover:[animation-play-state:paused]">
              {displayTestimonials.map((item: any, idx: number) => (
                <TiltCard key={`t1-${idx}`} className="w-[350px] md:w-[450px] shrink-0 bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between border border-white/10 hover:border-brand-lime/30 transition-colors duration-500 shadow-2xl">
                  <div>
                    <div className="flex items-center gap-4 mb-8">
                      {item.authorImage ? (<img src={item.authorImage} alt={item.author} className="w-14 h-14 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-500 border-2 border-white/10" />) : (<div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-white text-xl">{item.author?.[0]}</div>)}
                      <div>
                        <p className="font-display font-bold text-base tracking-wider uppercase text-white">{item.author}</p>
                        <p className="text-sm text-brand-lime mt-1 font-medium">{item.role}</p>
                      </div>
                    </div>
                    <p className="text-xl md:text-2xl font-medium leading-relaxed text-zinc-300 tracking-tight">"{item.quote}"</p>
                  </div>
                </TiltCard>
              ))}
            </div>
            
            <div className="animate-marquee flex gap-6 pr-6 min-w-max shrink-0 hover:[animation-play-state:paused]" aria-hidden="true">
              {displayTestimonials.map((item: any, idx: number) => (
                <TiltCard key={`t2-${idx}`} className="w-[350px] md:w-[450px] shrink-0 bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between border border-white/10 hover:border-brand-lime/30 transition-colors duration-500 shadow-2xl">
                  <div>
                    <div className="flex items-center gap-4 mb-8">
                      {item.authorImage ? (<img src={item.authorImage} alt={item.author} className="w-14 h-14 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-500 border-2 border-white/10" />) : (<div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-white text-xl">{item.author?.[0]}</div>)}
                      <div>
                        <p className="font-display font-bold text-base tracking-wider uppercase text-white">{item.author}</p>
                        <p className="text-sm text-brand-lime mt-1 font-medium">{item.role}</p>
                      </div>
                    </div>
                    <p className="text-xl md:text-2xl font-medium leading-relaxed text-zinc-300 tracking-tight">"{item.quote}"</p>
                  </div>
                </TiltCard>
              ))}
            </div>
            
            <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none"></div>
          </div>
        </FadeIn>
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
