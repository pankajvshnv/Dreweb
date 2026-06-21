import { motion, useMotionValue, useSpring } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code2, PenTool, Megaphone, Layers } from 'lucide-react';
import { PROJECTS } from '../lib/data';
import { useCollection } from '../lib/useCollection';
import { FadeIn, TextReveal, StaggerContainer, StaggerItem, TiltCard, Counter, Magnetic, SlideReveal, ScaleIn } from '../components/motion/Animations';
import { FloatingShowcase } from '../components/home/FloatingShowcase';
import { InfiniteWorkSlider } from '../components/home/InfiniteWorkSlider';
import SEO from '../components/seo/SEO';
import { useEffect } from 'react';

export default function Home() {
  const { data: testimonials } = useCollection<any>('testimonials');
  const { data: dynamicProjects } = useCollection<any>('projects');
  
  // We want all public projects for the infinite slider
  const displayProjects = dynamicProjects && dynamicProjects.length > 0
    ? dynamicProjects.filter((p: any) => p.isPublic !== false)
    : PROJECTS;

  const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : [
    { id: 1, quote: "The custom agentic workflows they built reduced our manual data entry by 90%, saving us hundreds of hours weekly.", author: "MARCUS CHENG", role: "Head of AI, Aetna", authorImage: "https://i.pravatar.cc/150?u=1" },
    { id: 2, quote: "Their team didn't just provide tools; they provided a roadmap for AI integration that actually makes sense for ROI.", author: "DAVID ROSSI", role: "Lead Dev, Cigna", authorImage: "https://i.pravatar.cc/150?u=2" },
    { id: 3, quote: "A game-changer for our R&D. The neural infrastructure is robust, secure, and perfectly tailored to our niche stack.", author: "SARAH JENKINS", role: "CTO, Anthem Group", authorImage: "https://i.pravatar.cc/150?u=3" },
    { id: 4, quote: "Incredible technical depth. They handled our complex RAG implementation with ease and delivered ahead of schedule.", author: "ELENA VANCE", role: "VP Eng, UnitedHealth", authorImage: "https://i.pravatar.cc/150?u=4" },
  ];

  // Mouse parallax for hero
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
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
    <div className="w-full bg-background text-white min-h-screen">
      <SEO
        title="Dreweb - Premium Web Design & Development Agency"
        description="We create visually refined digital experiences with modern UI/UX, fast and scalable development, and SEO optimization to help brands grow."
        canonicalUrl="/"
      />
      
      {/* ━━━ HERO SHOWCASE ━━━ */}
      <FloatingShowcase />

      {/* ━━━ MARQUEE ━━━ */}
      <section className="py-6 glass-panel overflow-hidden border-y border-white/5 relative z-10">
        <div className="whitespace-nowrap flex items-center select-none font-display text-2xl md:text-3xl uppercase font-light tracking-[0.2em] text-white/60">
          <div className="animate-marquee inline-block">
            <span>Premium Web Design</span><span className="mx-12 text-white/20">✦</span>
            <span>Cinematic Experiences</span><span className="mx-12 text-white/20">✦</span>
            <span>Digital Luxury</span><span className="mx-12 text-white/20">✦</span>
          </div>
          <div className="animate-marquee inline-block">
            <span>Premium Web Design</span><span className="mx-12 text-white/20">✦</span>
            <span>Cinematic Experiences</span><span className="mx-12 text-white/20">✦</span>
            <span>Digital Luxury</span><span className="mx-12 text-white/20">✦</span>
          </div>
        </div>
      </section>

      {/* ━━━ SERVICES BENTO ━━━ */}
      <section className="py-24 lg:py-40 px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <FadeIn>
          <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <SlideReveal><span className="text-white/40 font-semibold tracking-widest uppercase text-xs mb-4 block">Our Expertise</span></SlideReveal>
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.8 }}
                className="font-display text-4xl lg:text-6xl font-light tracking-tighter text-white"
              >
                Everything you need to <span className="text-white/50 italic">dominate</span> your market.
              </motion.h3>
            </div>
            <Magnetic><Link to="/services" className="glass-button px-6 py-3 font-medium flex items-center gap-2">View All Services <ArrowRight className="w-4 h-4" /></Link></Magnetic>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(320px,auto)]" stagger={0.12}>
          <StaggerItem className="md:col-span-2">
            <TiltCard className="h-full glass-card p-10 relative overflow-hidden group flex flex-col">
              <div className="absolute top-0 right-0 p-10 text-white/5 group-hover:text-white/10 transition-colors duration-700"><Code2 size={64} strokeWidth={1} /></div>
              <div className="flex justify-between items-start"><span className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest bg-white/5 text-white/80 border border-white/10 backdrop-blur-md">Featured Service</span><span className="font-light text-white/40">01</span></div>
              <div className="relative z-10 flex flex-col justify-end mt-auto pt-20">
                <h4 className="font-display text-3xl md:text-4xl font-semibold mb-4 drop-shadow-lg">Web & App Engineering</h4>
                <p className="text-white/60 max-w-md font-light leading-relaxed mb-8">Custom SaaS platforms, corporate websites, and high-performance applications built with modern architectural precision.</p>
                <Link to="/services/custom-website" className="inline-flex items-center gap-3 font-semibold text-sm w-fit group-hover:translate-x-3 transition-transform duration-500">Explore Engineering <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </TiltCard>
          </StaggerItem>

          <StaggerItem>
            <TiltCard className="h-full glass-card p-10 relative overflow-hidden group flex flex-col">
              <div className="flex justify-between items-start"><span className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest bg-white/5 text-white/80 border border-white/10 backdrop-blur-md">Design</span><span className="font-light text-white/40">02</span></div>
              <div className="relative z-10 flex flex-col justify-end mt-auto pt-16">
                <PenTool size={32} strokeWidth={1.5} className="text-white/60 mb-6 group-hover:rotate-12 transition-transform duration-700" />
                <h4 className="font-display text-3xl font-semibold mb-3">UI/UX</h4>
                <p className="text-white/50 mb-8 font-light leading-relaxed">Crafting premium, conversion-focused cinematic interfaces.</p>
                <Link to="/services/ui-ux-design" className="inline-flex items-center gap-3 font-semibold text-sm w-fit hover:text-white/80 transition-colors">View Design <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </TiltCard>
          </StaggerItem>

          <StaggerItem>
            <TiltCard className="h-full glass-card p-10 relative overflow-hidden group flex flex-col">
              <motion.div className="absolute -right-20 -bottom-20 w-40 h-40 bg-white/5 rounded-full blur-[60px] group-hover:scale-[2] transition-transform duration-1000" />
              <div className="flex justify-between items-start"><span className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest bg-white/5 text-white/80 border border-white/10 backdrop-blur-md">Growth</span><span className="font-light text-white/40">03</span></div>
              <div className="relative z-10 flex flex-col justify-end mt-auto pt-16">
                <Megaphone size={32} strokeWidth={1.5} className="text-white/60 mb-6 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-700" />
                <h4 className="font-display text-3xl font-semibold mb-3">Marketing</h4>
                <p className="text-white/50 mb-8 font-light leading-relaxed">Data-driven marketing and elegant SEO architecture to scale traffic.</p>
                <Link to="/services/seo-optimization" className="inline-flex items-center gap-3 font-semibold text-sm w-fit hover:text-white/80 transition-colors">Explore Growth <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </TiltCard>
          </StaggerItem>

          <StaggerItem className="md:col-span-2">
            <TiltCard className="h-full glass-card p-10 relative overflow-hidden group flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent"></div>
              <motion.div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
              <div className="relative z-10 flex justify-between items-start">
                <div className="w-14 h-14 glass-button flex items-center justify-center"><Layers size={24} strokeWidth={1.5} /></div>
                <span className="font-light text-white/40">04</span>
              </div>
              <div className="relative z-10 flex flex-col justify-end mt-auto pt-20">
                <div className="flex justify-between items-center mb-10">
                  <div className="flex -space-x-3 opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700">
                    <div className="w-10 h-10 rounded-full border border-white/20 bg-zinc-800"></div>
                    <div className="w-10 h-10 rounded-full border border-white/20 bg-zinc-700"></div>
                    <div className="w-10 h-10 rounded-full border border-white/20 bg-zinc-600"></div>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-white/40">Design • Develop • Deliver</span>
                </div>
                <div>
                  <h4 className="font-display text-3xl md:text-4xl font-light mb-8 text-white/90 text-balance leading-snug">"dreweb transformed our entire digital ecosystem and helped us scale with elegant precision."</h4>
                  <Link to="/work" className="inline-flex items-center gap-3 font-semibold text-sm w-fit hover:text-white/80 transition-colors">Read Case Studies <ArrowRight className="w-4 h-4" /></Link>
                </div>
              </div>
            </TiltCard>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* ━━━ PORTFOLIO SHOWCASE SLIDER ━━━ */}
      <section className="py-24 lg:py-40 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
              <div className="max-w-2xl">
                <TextReveal as="h2" className="font-display text-4xl lg:text-7xl font-light tracking-tighter mb-6 text-white drop-shadow-xl">Selected Work.</TextReveal>
                <p className="text-white/50 text-xl font-light leading-relaxed">We partner with visionary companies to build digital products that shape industries with absolute elegance.</p>
              </div>
              <Magnetic><Link to="/work" className="glass-button px-8 py-4 font-medium flex items-center gap-2 whitespace-nowrap">View All Projects</Link></Magnetic>
            </div>
          </FadeIn>
        </div>
        
        {/* Infinite Glassmorphism Slider */}
        <InfiniteWorkSlider projects={displayProjects} />
      </section>

      {/* ━━━ STATS ━━━ */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="glass-panel rounded-[2rem] p-12 md:p-20">
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center" stagger={0.1}>
              {[
                { value: 25, suffix: '+', label: 'Clients Served' },
                { value: 50, suffix: '+', label: 'Projects Delivered' },
                { value: 3, suffix: 'yrs', label: 'Experience' },
                { value: 98, suffix: '%', label: 'Client Satisfaction' },
              ].map((stat, i) => (
                <StaggerItem key={i}>
                  <p className="font-display text-5xl md:text-7xl font-light mb-4 text-white drop-shadow-lg">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-white/40 text-xs font-semibold uppercase tracking-[0.2em]">{stat.label}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* ━━━ TESTIMONIALS ━━━ */}
      <section className="py-32 overflow-hidden relative z-10">
        <ScaleIn>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-20 max-w-4xl text-center">
            <TextReveal as="h2" className="font-display text-4xl lg:text-6xl font-light tracking-tighter text-white">Don't just take our word for it.</TextReveal>
          </div>
        </ScaleIn>
        <div className="relative flex overflow-x-hidden group">
          <div className="animate-marquee flex gap-6 pr-6 min-w-max shrink-0 hover:[animation-play-state:paused]">
            {displayTestimonials.map((item: any, idx: number) => (
              <motion.div key={idx} whileHover={{ y: -8, transition: { duration: 0.5 } }} className="w-[350px] md:w-[450px] shrink-0 glass-card p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    {item.authorImage ? (<img src={item.authorImage} alt={item.author} className="w-12 h-12 rounded-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 border border-white/20" />) : (<div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-semibold text-white/80">{item.author?.[0]}</div>)}
                  </div>
                  <p className="text-lg font-light leading-relaxed text-white/90 mb-10">"{item.quote}"</p>
                </div>
                <div>
                  <p className="font-display font-semibold text-xs tracking-widest uppercase text-white/80">{item.author}</p>
                  <p className="text-xs text-white/40 mt-2 uppercase tracking-wider">{item.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="animate-marquee flex gap-6 pr-6 min-w-max shrink-0 hover:[animation-play-state:paused]" aria-hidden="true">
            {displayTestimonials.map((item: any, idx: number) => (
              <motion.div key={idx} whileHover={{ y: -8, transition: { duration: 0.5 } }} className="w-[350px] md:w-[450px] shrink-0 glass-card p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    {item.authorImage ? (<img src={item.authorImage} alt={item.author} className="w-12 h-12 rounded-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 border border-white/20" />) : (<div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-semibold text-white/80">{item.author?.[0]}</div>)}
                  </div>
                  <p className="text-lg font-light leading-relaxed text-white/90 mb-10">"{item.quote}"</p>
                </div>
                <div>
                  <p className="font-display font-semibold text-xs tracking-widest uppercase text-white/80">{item.author}</p>
                  <p className="text-xs text-white/40 mt-2 uppercase tracking-wider">{item.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
        </div>
      </section>

      {/* ━━━ PROCESS ━━━ */}
      <section className="py-32 px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/10 relative z-10">
        <ScaleIn>
          <div className="max-w-4xl mx-auto text-center mb-24">
            <TextReveal as="h2" className="font-display text-4xl lg:text-6xl font-light tracking-tighter mb-6 text-white drop-shadow-xl">How we operate.</TextReveal>
            <p className="text-white/50 text-xl font-light leading-relaxed">A simple, transparent, and results-driven process designed to move fast and break records with unmatched elegance.</p>
          </div>
        </ScaleIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-16" stagger={0.15}>
          {[
            { step: '01', title: 'Strategy', desc: 'Understanding your business goals and defining a luxury digital blueprint.' },
            { step: '02', title: 'Design', desc: 'Creating cinematic prototypes and a premium visual language that converts.' },
            { step: '03', title: 'Engineering', desc: 'Building scalable, fast architecture using modern GPU-accelerated stacks.' },
            { step: '04', title: 'Launch', desc: 'Rigorous QA, smooth deployment, and ongoing performance optimization.' }
          ].map((item, idx) => (
            <StaggerItem key={idx} className="relative group">
              <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center font-display font-light text-white/60 mb-8 group-hover:bg-white/10 group-hover:text-white group-hover:scale-110 transition-all duration-500">{item.step}</div>
              <h4 className="text-2xl font-light mb-4 text-white/90">{item.title}</h4>
              <p className="text-white/40 leading-relaxed font-light">{item.desc}</p>
              {idx !== 3 && <div className="hidden md:block absolute top-8 left-24 right-0 h-px bg-gradient-to-r from-white/20 to-transparent -z-10"></div>}
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

    </div>
  );
}
