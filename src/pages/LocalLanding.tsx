import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import SEO from '../components/seo/SEO';
import { FadeIn, TextReveal, ScaleIn } from '../components/motion/Animations';

// This acts as a generic template for Local SEO pages
// e.g. /locations/indore/website-development-company
export default function LocalLanding() {
  const { city = 'indore', service = 'website-development' } = useParams();

  // Format the slugs into readable strings
  const formattedCity = city.charAt(0).toUpperCase() + city.slice(1);
  const formattedService = service.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const title = `${formattedService} Company in ${formattedCity} | Dreweb`;
  const description = `Looking for the best ${formattedService.toLowerCase()} agency in ${formattedCity}? Dreweb delivers premium, high-performance digital solutions tailored for your business.`;

  return (
    <main className="w-full bg-white pb-24">
      <SEO 
        title={title}
        description={description}
        canonicalUrl={`/locations/${city}/${service}`}
        schema={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": `Dreweb - ${formattedService} in ${formattedCity}`,
          "image": "https://dreweb.online/og-image.jpg",
          "telephone": "+911234567890",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": formattedCity,
            "addressRegion": "Madhya Pradesh",
            "addressCountry": "IN"
          }
        }}
      />
      
      {/* Hero */}
      <section className="pt-32 pb-24 px-6 lg:px-8 max-w-7xl mx-auto text-center border-b border-zinc-100">
        <ScaleIn>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-lime/10 text-brand-lime text-sm font-bold mb-8 uppercase tracking-widest">
            {formattedCity} Region
          </div>
        </ScaleIn>
        <TextReveal as="h1" className="font-display text-5xl md:text-7xl font-bold tracking-tighter mb-6 max-w-4xl mx-auto text-balance">
          Premium {formattedService} in {formattedCity}
        </TextReveal>
        <FadeIn delay={0.2}>
          <p className="text-xl text-zinc-500 font-light max-w-2xl mx-auto text-balance mb-12">
            Elevate your brand with award-winning design and high-performance engineering tailored for businesses in {formattedCity}.
          </p>
          <button className="px-8 py-4 bg-black text-white rounded-full font-bold hover:bg-zinc-800 transition-colors">
            Book a Free Consultation
          </button>
        </FadeIn>
      </section>

      {/* Local Content Section */}
      <section className="py-24 px-6 lg:px-8 max-w-4xl mx-auto">
        <FadeIn>
          <h2 className="font-display text-4xl font-bold mb-6">Why choose Dreweb in {formattedCity}?</h2>
          <div className="prose prose-lg text-zinc-600">
            <p>
              As a leading digital agency, we understand the local market dynamics in {formattedCity}. 
              Whether you need a simple landing page or a complex SaaS application, our {formattedService.toLowerCase()} 
              services are designed to convert visitors into loyal customers.
            </p>
            <p>
              We combine stunning aesthetics with modern tech stacks (React, Next.js, Node) to ensure your website is fast, secure, and fully optimized for Google Search.
            </p>
          </div>
        </FadeIn>
      </section>
    </main>
  );
}
