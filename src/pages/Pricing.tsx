import { Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCollection } from '../lib/useCollection';
import { FadeIn, TextReveal, StaggerContainer, StaggerItem, TiltCard, Magnetic, ScaleIn } from '../components/motion/Animations';
import { motion } from 'motion/react';

const DEFAULT_TIERS = [
  { name: "Starter", headline: "For early stage", price: "$150", description: "Perfect for startups needing a professional digital presence fast.", features: ["3-Page Custom Website", "Responsive Design", "Basic SEO Setup", "Contact Form Integration", "1 Month Free Support"], nots: ["Custom Web App Development", "Advanced Animations", "E-commerce Functionality"], isFeatured: false, cta: "Start Project" },
  { name: "Professional", headline: "For growing brands", price: "$300", description: "Comprehensive digital solutions for established companies scaling up.", features: ["10 Pages", "Premium Custom UI/UX", "Advanced SEO & Analytics", "CMS Integration", "Complex Animations", "Fast Global CDN Hosting", "3 Months Support"], nots: ["Mobile Native App"], isFeatured: true, cta: "Get Professional" },
  { name: "Enterprise", headline: "For market leaders", price: "Custom", description: "End-to-end full stack development, branding, and ongoing growth strategy.", features: ["Custom Software/SaaS Development", "Backend Architecture", "Dedicated Team", "AI & API Integrations", "24/7 Priority Support", "Ongoing Performance Marketing"], nots: [], isFeatured: false, cta: "Contact Sales" }
];

export default function Pricing() {
  const { data: dynamicPlans } = useCollection<any>('pricing');
  const tiers = dynamicPlans && dynamicPlans.length > 0 ? dynamicPlans.filter((p: any) => p.isActive !== false) : DEFAULT_TIERS;

  return (
    <div className="w-full pb-24">
      <section className="pt-24 pb-16 px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <FadeIn>
          <TextReveal as="h1" className="font-display text-5xl md:text-7xl font-bold tracking-tighter mb-6">Simple, transparent pricing.</TextReveal>
        </FadeIn>
        <FadeIn delay={0.3}>
          <p className="text-xl text-zinc-500 font-light max-w-2xl mx-auto text-balance">
            No hidden fees. We price purely on value, scope, and the dedicated engineering power required to deliver world-class results.
          </p>
        </FadeIn>
      </section>

      <section className="px-6 lg:px-8 max-w-7xl mx-auto pt-8">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start" stagger={0.15}>
          {tiers.map((tier: any, idx: number) => (
            <StaggerItem key={tier.name || idx}>
              <TiltCard>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`rounded-[2.5rem] p-8 md:p-10 border transition-all ${tier.isFeatured ? 'bg-zinc-950 text-white border-zinc-900 shadow-2xl md:-translate-y-8 relative z-10' : 'bg-white text-black border-zinc-200 mt-4'
                    }`}
                >
                  {tier.isFeatured && (
                    <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-lime text-black px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">Most Popular</motion.div>
                  )}
                  <div className="mb-8">
                    <span className={`text-sm font-bold uppercase tracking-wider mb-2 block ${tier.isFeatured ? 'text-brand-lime' : 'text-brand-indigo'}`}>{tier.name}</span>
                    <h3 className={`text-4xl font-display font-bold mb-2 ${tier.price === '$300' ? 'text-brand-lime' : ''}`}>{tier.price}</h3>
                    <p className={`text-sm ${tier.isFeatured ? 'text-zinc-400' : 'text-zinc-500'}`}>{tier.description || tier.desc}</p>
                  </div>
                  <Magnetic strength={0.1}>
                    <Link to="/contact" className={`w-full block text-center py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] mb-8 ${tier.isFeatured ? 'bg-brand-lime text-black hover:shadow-lg hover:shadow-brand-lime/20' : 'bg-zinc-100 text-black hover:bg-zinc-200'}`}>
                      {tier.cta || 'Get Started'}
                    </Link>
                  </Magnetic>
                  <div className="space-y-4">
                    <p className={`text-sm font-semibold uppercase tracking-wider ${tier.isFeatured ? 'text-zinc-300' : 'text-zinc-900'}`}>What's included</p>
                    <ul className="space-y-3">
                      {(tier.features || []).map((f: string, fi: number) => (
                        <motion.li key={f} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: fi * 0.05 }} className={`flex items-start gap-3 text-sm font-medium ${tier.isFeatured ? 'text-zinc-300' : 'text-zinc-700'}`}>
                          <Check className={`w-5 h-5 shrink-0 ${tier.isFeatured ? 'text-brand-lime' : 'text-black'}`} />{f}
                        </motion.li>
                      ))}
                      {(tier.nots || []).map((n: string) => (
                        <li key={n} className="flex items-start gap-3 text-sm font-medium text-zinc-400 line-through"><X className="w-5 h-5 shrink-0 text-zinc-300" />{n}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <section className="mt-32 max-w-3xl mx-auto px-6 lg:px-8 text-center">
        <ScaleIn>
          <h2 className="font-display text-3xl font-bold mb-4">Have questions about pricing?</h2>
          <p className="text-zinc-500 mb-8 max-w-lg mx-auto">Every enterprise project is unique, and we structure our deliverables to maximize your ROI.</p>
          <Magnetic><Link to="/contact" className="text-black font-semibold border-b-2 border-brand-lime pb-1 hover:text-brand-lime transition-colors inline-block">Book a discovery call</Link></Magnetic>
        </ScaleIn>
      </section>
    </div>
  );
}
