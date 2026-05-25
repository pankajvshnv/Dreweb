import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useCollection } from '../lib/useCollection';
import { SERVICES } from '../lib/data';
import NotFound from './NotFound';
import { FadeIn, TextReveal, StaggerContainer, StaggerItem, TiltCard, ScaleIn, Magnetic } from '../components/motion/Animations';
import { motion } from 'motion/react';

const DEFAULT_SERVICES = SERVICES.map((s, i) => ({
  id: String(i + 1),
  title: s.title,
  slug: s.slug,
  category: s.category,
  shortDescription: '',
  isPublished: true,
}));

export default function ServiceDetail() {
  const { slug } = useParams();
  const { data: dynamicServices, loading } = useCollection<any>('services');
  const services = dynamicServices && dynamicServices.length > 0 ? dynamicServices : DEFAULT_SERVICES;
  const service = services.find((s: any) => s.slug === slug);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-brand-lime border-t-black rounded-full animate-spin"></div>
    </div>
  );

  if (!service) return <NotFound />;

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="pt-24 pb-20 px-6 lg:px-8 max-w-7xl mx-auto border-b border-zinc-100">
        <div className="max-w-4xl">
          <FadeIn>
            <Link to="/services" className="inline-flex items-center gap-2 text-zinc-500 hover:text-black transition-colors font-medium mb-8">
              <ArrowLeft className="w-4 h-4" /> Back to Services
            </Link>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-sm font-medium mb-6">
              {service.category}
            </div>
          </FadeIn>
          <TextReveal as="h1" className="font-display text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-[1.1]">
            {service.title}
          </TextReveal>
          <FadeIn delay={0.4}>
            <p className="text-xl text-zinc-500 font-light max-w-3xl text-balance leading-relaxed">
              {service.shortDescription || `Premium ${service.title.toLowerCase()} designed to elevate your brand, optimize performance, and drive measurable business results.`}
            </p>
          </FadeIn>
          <FadeIn delay={0.6} className="mt-10">
            <Magnetic>
              <Link to="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-brand-lime text-black rounded-full font-semibold hover:bg-brand-lime/90 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-brand-lime/20" data-cursor="Request">
                Request a Proposal
              </Link>
            </Magnetic>
          </FadeIn>
        </div>
      </section>

      {/* Details/Process Grid */}
      <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <FadeIn>
              <h2 className="font-display text-3xl font-bold mb-6">Why choose dreweb?</h2>
              <p className="text-zinc-500 mb-8 leading-relaxed">
                We don't just execute tasks. We partner with you to understand your core objectives and engineer solutions that provide a lasting return on investment.
              </p>
              <StaggerContainer className="space-y-4" stagger={0.1}>
                {['Industry-standard practices', 'Dedicated support team', 'Scalable architecture', 'Transparent reporting'].map((item, i) => (
                  <StaggerItem key={i}>
                    <div className="flex items-center gap-3 font-medium text-zinc-700">
                      <CheckCircle2 className="w-5 h-5 text-brand-lime bg-black rounded-full shrink-0" />
                      {item}
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </FadeIn>
          </div>
          
          <div className="lg:col-span-8">
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-8" stagger={0.15}>
              {[
                {
                  num: '01',
                  title: 'Premium Design Excellence',
                  desc: 'We create visually refined digital experiences with modern UI/UX, smooth interactions, and conversion-focused layouts that help brands stand out professionally.',
                },
                {
                  num: '02',
                  title: 'Fast & Scalable Development',
                  desc: 'Our websites are built using modern technologies like Next.js, React, and Tailwind CSS to ensure high performance, security, scalability, and future-ready architecture.',
                },
                {
                  num: '03',
                  title: 'SEO & Growth Focused',
                  desc: 'Every project is optimized for speed, mobile responsiveness, technical SEO, and user experience to improve search rankings, traffic, and business conversions.',
                },
                {
                  num: '04',
                  title: 'Dedicated Support & Transparency',
                  desc: 'We work closely with every client through transparent communication, regular updates, and long-term support to ensure smooth project delivery and growth.',
                }
              ].map((feature) => (
                <StaggerItem key={feature.num}>
                  <TiltCard className="bg-zinc-50 p-8 rounded-[2rem] border border-zinc-100 h-full hover:border-black transition-colors duration-300 flex flex-col">
                    <span className="text-4xl font-display font-bold text-zinc-200 mb-4 block group-hover:text-brand-lime transition-colors">{feature.num}</span>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                      {feature.desc}
                    </p>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Related/CTA */}
      <section className="py-24 bg-zinc-950 text-white text-center rounded-t-[3rem] mt-10">
        <ScaleIn>
          <TextReveal as="h2" className="font-display text-4xl md:text-5xl font-bold mb-8 tracking-tighter max-w-2xl mx-auto text-white">{`Ready to start your ${service.title} project?`}</TextReveal>
          <Magnetic>
            <Link to="/contact" className="inline-flex items-center gap-2 border-b-2 border-brand-lime pb-1 text-xl font-medium hover:text-brand-lime transition-colors" data-cursor="Let's Talk">
              Let's talk <ArrowRight className="w-5 h-5" />
            </Link>
          </Magnetic>
        </ScaleIn>
      </section>
    </div>
  );
}
