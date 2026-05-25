import { BRAND } from '../lib/data';
import { Link } from 'react-router-dom';
import { FadeIn, TextReveal, StaggerContainer, StaggerItem, ScaleIn, TiltCard, Counter, Magnetic, Parallax } from '../components/motion/Animations';
import { motion } from 'motion/react';
import SEO from '../components/seo/SEO';

export default function About() {
  return (
    <div className="w-full">
      <SEO 
        title="About Dreweb | Digital Agency Philosophy & Values"
        description="Founded in 2022, dreweb bridges the gap between world-class premium design and agile engineering. We specialize in SaaS aesthetics and conversion optimization."
        canonicalUrl="/about"
      />
      {/* Hero */}
      <section className="pt-24 pb-16 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-4xl">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 border border-zinc-200 text-sm font-medium mb-8">
              Established {BRAND.founded} in {BRAND.location.split(',')[0]}
            </div>
          </FadeIn>
          <TextReveal as="h1" className="font-display text-5xl md:text-7xl font-bold tracking-tighter leading-[1.05]">
            We are a collective of designers, engineers, and strategists.
          </TextReveal>
        </div>
      </section>

      {/* Intro */}
      <section className="px-6 lg:px-8 max-w-7xl mx-auto py-12 md:py-24 border-t border-zinc-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <FadeIn direction="left">
            <h2 className="font-display text-3xl font-bold mb-6">The dreweb philosophy.</h2>
            <p className="text-zinc-600 text-lg leading-relaxed mb-6">
              Founded in 2022, dreweb was born from a simple observation: most agency websites look the same, and most custom software takes too long to build. We bridge the gap between world-class premium design and agile engineering.
            </p>
            <p className="text-zinc-600 text-lg leading-relaxed">
              We specialize in the "SaaS aesthetic"—clean lines, massive typography, strict bento grids, and purposeful motion. We don't just build websites; we architect digital systems that position your brand strictly at the premium end of your market.
            </p>
          </FadeIn>
          <FadeIn direction="right" delay={0.2}>
            <TiltCard className="bg-brand-lime rounded-[2.5rem] p-12 flex flex-col justify-center h-full">
              <h3 className="font-display text-4xl font-bold leading-tight mb-6">Design • Develop • Deliver</h3>
              <p className="font-medium text-black/70">Our tagline isn't just a phrase, it's our exact operational sequence. We guarantee transparent communication and uncompromising technical standards.</p>
            </TiltCard>
          </FadeIn>
        </div>
      </section>

      {/* Stats */}
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

      {/* Core Values */}
      <section className="py-24 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScaleIn><h2 className="font-display text-4xl font-bold mb-16 text-center">Our Core Values</h2></ScaleIn>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" stagger={0.1}>
            {[
              { title: 'Radical Quality', desc: 'If it\'s not the best in your industry, we don\'t ship it.' },
              { title: 'Speed of Execution', desc: 'We move fast. Agile sprints with transparent, weekly deliverables.' },
              { title: 'Absolute Ownership', desc: 'We treat your business and your KPIs as our own.' },
              { title: 'Design as Strategy', desc: 'Aesthetics directly influence trust, conversion, and scale.' }
            ].map((v, i) => (
              <StaggerItem key={i}>
                <TiltCard className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm h-full group hover:shadow-xl hover:border-brand-lime/30 transition-all duration-300">
                  <motion.span whileHover={{ scale: 1.1 }} className="text-brand-lime font-display text-4xl font-bold mb-4 block">0{i+1}</motion.span>
                  <h4 className="font-bold text-xl mb-3">{v.title}</h4>
                  <p className="text-zinc-500 text-sm">{v.desc}</p>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 lg:px-8 text-center text-balance max-w-4xl mx-auto">
        <ScaleIn>
          <TextReveal as="h2" className="font-display text-5xl md:text-6xl font-bold tracking-tighter mb-8">Ready to build something extraordinary?</TextReveal>
          <Magnetic>
            <Link to="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-black text-white rounded-full font-semibold hover:bg-zinc-800 transition-colors text-lg" data-cursor="Let's Go">
              Connect with our team
            </Link>
          </Magnetic>
        </ScaleIn>
      </section>
    </div>
  );
}
