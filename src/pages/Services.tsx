import { Link } from 'react-router-dom';
import { ArrowRight, Code2, PenTool, LayoutTemplate, Megaphone } from 'lucide-react';
import { useCollection } from '../lib/useCollection';
import { FadeIn, TextReveal, StaggerContainer, StaggerItem, TiltCard, ScaleIn, Magnetic, LineReveal } from '../components/motion/Animations';
import { motion } from 'motion/react';

import { SERVICES } from '../lib/data';

const DEFAULT_SERVICES = SERVICES.map((s, i) => ({
  id: String(i + 1),
  title: s.title,
  slug: s.slug,
  category: s.category,
  shortDescription: '',
  isPublished: true,
}));

import SEO from '../components/seo/SEO';

export default function Services() {
  const { data: dynamicServices, loading } = useCollection<any>('services');
  const services = dynamicServices && dynamicServices.length > 0
    ? dynamicServices.filter((s: any) => s.isPublished !== false)
    : DEFAULT_SERVICES;
  const categories = Array.from(new Set(services.map((s: any) => s.category)));

  return (
    <div className="w-full pb-24">
      <SEO 
        title="Our Services | Web Design, Engineering & SEO"
        description="Explore Dreweb's core services: Frontend Engineering, UI/UX Design, Web Applications, and Technical SEO."
        canonicalUrl="/services"
      />
      <section className="pt-24 pb-16 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-4xl">
          <TextReveal as="h1" className="font-display text-5xl md:text-7xl font-bold tracking-tighter mb-6">Services and Expertise.</TextReveal>
          <FadeIn delay={0.4}>
            <p className="text-xl text-zinc-500 font-light max-w-2xl text-balance">
              We provide end-to-end digital engineering and creative solutions for businesses that want to scale fast.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="px-6 lg:px-8 max-w-7xl mx-auto space-y-24">
        {loading ? (
          <div className="flex justify-center items-center py-20"><div className="w-8 h-8 border-4 border-brand-lime border-t-black rounded-full animate-spin"></div></div>
        ) : services.length === 0 ? (
          <div className="text-zinc-500 font-medium text-lg py-12 text-center">No services available yet. Check back soon.</div>
        ) : (
          categories.map((category) => (
            <div key={category as string}>
              <LineReveal className="mb-12" />
              <FadeIn>
                <h2 className="font-display text-3xl font-bold mb-12 flex items-center gap-4">
                  {category === 'Design' && <PenTool className="text-brand-lime bg-black p-2 rounded-lg" size={40} />}
                  {category === 'Development' && <Code2 className="text-brand-lime bg-black p-2 rounded-lg" size={40} />}
                  {category === 'Marketing' && <Megaphone className="text-brand-lime bg-black p-2 rounded-lg" size={40} />}
                  {category === 'Creative' && <LayoutTemplate className="text-brand-lime bg-black p-2 rounded-lg" size={40} />}
                  {category as string} Domain
                </h2>
              </FadeIn>
              
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.08}>
                {services.filter((s: any) => s.category === category).map((service: any) => (
                  <StaggerItem key={service.id}>
                    <Link to={`/services/${service.slug}`} className="group block h-full" data-cursor="View">
                      <TiltCard className="h-full">
                        <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="p-8 rounded-[2rem] bg-zinc-50 border border-zinc-100 hover:border-black hover:bg-white transition-all hover:shadow-xl h-full flex flex-col justify-between">
                          <div>
                            <h3 className="font-display text-xl font-bold mb-4 pr-8 group-hover:text-brand-indigo transition-colors">{service.title}</h3>
                            <p className="text-zinc-500 text-sm mb-8">{service.shortDescription || `Complete ${service.title.toLowerCase()} tailored to your specific business requirements.`}</p>
                          </div>
                          <div className="flex items-center gap-2 text-sm font-semibold mt-auto">
                            Explore Service <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                          </div>
                        </motion.div>
                      </TiltCard>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          ))
        )}
      </section>

      <section className="mt-32 px-6 lg:px-8 max-w-7xl mx-auto">
        <ScaleIn>
          <TiltCard className="bg-brand-lime rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
            <motion.div className="absolute -right-20 -top-20 w-64 h-64 bg-black/5 rounded-full blur-[80px]" />
            <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tighter mb-6 relative z-10">Didn't find what you need?</h2>
            <p className="text-black/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium relative z-10">We offer bespoke engineering and design. Tell us about your unique challenge and we'll craft a custom solution.</p>
            <Magnetic><Link to="/contact" className="relative z-10 inline-flex items-center justify-center px-8 py-4 bg-black text-white rounded-full font-semibold hover:bg-zinc-800 transition-colors" data-cursor="Let's Talk">Discuss Custom Project</Link></Magnetic>
          </TiltCard>
        </ScaleIn>
      </section>
    </div>
  );
}
