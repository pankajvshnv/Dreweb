import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { FadeIn, TextReveal, Magnetic } from '../components/motion/Animations';
import { motion } from 'motion/react';
import { CutoutCorner } from '../components/ui/CutoutCorner';
import SEO from '../components/seo/SEO';
import { useCollection } from '../lib/useCollection';

export default function Templates() {
  const { data: dynamicTemplates } = useCollection<any>('templates');
  const templates = dynamicTemplates && dynamicTemplates.length > 0
    ? dynamicTemplates.filter((t: any) => t.isPublic !== false)
    : [];
  return (
    <div className="w-full pb-24">
      <SEO 
        title="Project Templates | Dreweb Shop"
        description="Browse our collection of premium, high-performance project templates for agencies, businesses, and e-commerce."
        canonicalUrl="/templates"
      />
      <section className="pt-24 pb-16 px-6 lg:px-8 max-w-7xl mx-auto">
        <TextReveal as="h1" className="font-display text-5xl md:text-7xl font-bold tracking-tighter mb-6 max-w-4xl">Premium Templates.</TextReveal>
        <FadeIn delay={0.4}>
          <p className="text-xl text-zinc-500 font-light max-w-2xl text-balance">
            Jumpstart your next project with our expertly crafted, high-performance templates designed for modern web experiences.
          </p>
        </FadeIn>
      </section>

      <section className="px-6 lg:px-8 pb-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {templates.map((template, idx) => (
            <FadeIn direction="up" delay={0.1 * idx} distance={40} once={true} key={template.id || idx} className="h-full flex flex-col">
              <div className="group block relative h-full flex flex-col">
                
                {/* Card Container */}
                <div className="relative aspect-[4/3] rounded-3xl bg-zinc-100 overflow-hidden mb-6">
                  {/* Image Wrapper */}
                  <div className="absolute inset-0 rounded-3xl overflow-hidden">
                    <motion.img 
                      src={template.heroImage} 
                      alt={template.title} 
                      loading="lazy" 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" 
                    />
                    {/* Overlay for hover effect */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                  </div>
                  
                  {/* Price Tag */}
                  <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full font-bold text-zinc-900 shadow-lg">
                    {template.price}
                  </div>

                  {/* Perfect SVG Cutout Corner Mask */}
                  <CutoutCorner backgroundColor="#FFFFFF" />
                  
                  {/* Buy Button inside the cutout */}
                  <div className="absolute bottom-2 right-2 z-30 transition-transform duration-500 group-hover:scale-110">
                    <Link to={`/checkout?template=${template.id}`} className="w-16 h-16 bg-brand-lime rounded-full flex items-center justify-center text-black hover:bg-lime-400 transition-colors duration-300 shadow-lg">
                      <ShoppingCart className="w-6 h-6" strokeWidth={2.5} />
                    </Link>
                  </div>
                </div>

                {/* Text Below Card */}
                <div className="flex-grow flex flex-col">
                  <p className="text-xs uppercase tracking-widest text-brand-lime font-bold mb-2">{template.category}</p>
                  <h3 className="font-display text-2xl font-bold mb-3 tracking-tight text-zinc-900">{template.title}</h3>
                  <ul className="space-y-2 mb-6 text-sm text-zinc-600">
                    {(template.description || '').split('\n').filter((f: string) => f.trim() !== '').map((feature: string, fIdx: number) => (
                      <li key={fIdx} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full mr-2 mt-1.5 shrink-0"></span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-auto pt-4 border-t border-zinc-100">
                    <div className="flex items-center justify-between mb-4 pt-2">
                      <p className="font-bold text-xl text-black">
                        {template.price}
                        {template.priceINR && <span className="text-zinc-400 text-sm ml-2">| {template.priceINR}</span>}
                      </p>
                    </div>
                    <Link to={`/checkout?template=${template.id}`} className="inline-flex items-center justify-center w-full px-6 py-3 bg-zinc-900 text-white rounded-xl font-semibold hover:bg-black transition-colors">
                      Buy Template
                    </Link>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}
