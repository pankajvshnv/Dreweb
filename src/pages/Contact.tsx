import React, { useState } from 'react';
import { Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react';
import { BRAND } from '../lib/data';
import { createDocument } from '../lib/crud';
import { FadeIn, TextReveal, StaggerContainer, StaggerItem, ScaleIn, Magnetic } from '../components/motion/Animations';
import { motion } from 'motion/react';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    company: '',
    service: '',
    currency: '$', // Added currency state
    budget: '',
    message: ''
  });

  const handleChange = (e: any) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createDocument('leads', {
        ...formData,
        status: 'new',
        createdAt: new Date().toISOString(),
      });
      setSuccess(true);
      // Reset form including currency
      setFormData({ name: '', email: '', mobile: '', company: '', service: '', currency: '$', budget: '', message: '' });
    } catch (error) {
      console.error(error);
      alert('Failed to send message: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <section className="pt-24 pb-16 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <TextReveal as="h1" className="font-display text-5xl md:text-7xl font-bold tracking-tighter mb-6">
              Let's talk about your project.
            </TextReveal>
            <FadeIn delay={0.4}>
              <p className="text-xl text-zinc-500 font-light max-w-md text-balance mb-12">
                Ready to transform your business with a stunning website?
              </p>
            </FadeIn>

            <StaggerContainer className="space-y-8" stagger={0.1}>
              <StaggerItem>
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 group-hover:bg-brand-lime transition-colors duration-300">
                    <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Email</h4>
                    <a href={`mailto:${BRAND.email}`} className="text-zinc-500 hover:text-black transition-colors">{BRAND.email}</a>
                  </div>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 group-hover:bg-brand-lime transition-colors duration-300">
                    <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Phone / WhatsApp</h4>
                    <a href={`tel:${BRAND.phone.replace(/\s+/g, '')}`} className="text-zinc-500 hover:text-black transition-colors">{BRAND.phone}</a>
                  </div>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 group-hover:bg-brand-lime transition-colors duration-300">
                    <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Office</h4>
                    <p className="text-zinc-500">{BRAND.location}</p>
                  </div>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>

          <ScaleIn delay={0.2}>
            <div className="bg-zinc-50 rounded-[2.5rem] p-8 md:p-12 border border-zinc-200">
              {success ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center h-full space-y-4 py-12">
                  <motion.div animate={{ rotate: [0, 10, -10, 10, 0] }} transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }} className="w-16 h-16 bg-brand-lime rounded-full flex items-center justify-center">
                    <span className="text-2xl">👋</span>
                  </motion.div>
                  <h3 className="text-2xl font-bold font-display">Message Sent!</h3>
                  <p className="text-zinc-500 max-w-sm">We've received your request and will be in touch shortly.</p>
                  <button onClick={() => setSuccess(false)} className="mt-4 text-sm font-bold border-b border-black pb-0.5 hover:text-brand-lime hover:border-brand-lime transition-colors">Send another message</button>
                </motion.div>
              ) : (
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="text-sm font-semibold text-zinc-700">Full Name</label>
                      <input type="text" id="name" required value={formData.name} onChange={handleChange} className="bg-white px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" placeholder="John Doe" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="text-sm font-semibold text-zinc-700">Email Address</label>
                      <input type="email" id="email" required value={formData.email} onChange={handleChange} className="bg-white px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" placeholder="john@company.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="mobile" className="text-sm font-semibold text-zinc-700">Mobile No.</label>
                      <input type="tel" id="mobile" value={formData.mobile} onChange={handleChange} className="bg-white px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" placeholder="+1 234 567 8900" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="company" className="text-sm font-semibold text-zinc-700">Company Name</label>
                      <input type="text" id="company" value={formData.company} onChange={handleChange} className="bg-white px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" placeholder="Acme Corp" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="service" className="text-sm font-semibold text-zinc-700">Service Needed</label>
                    <select id="service" value={formData.service} onChange={handleChange} className="bg-white px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all appearance-none cursor-pointer">
                      <option value="">Select a service...</option>
                      <option value="web">Website Design & Development</option>
                      <option value="app">Mobile App Development</option>
                      <option value="seo">SEO & Marketing</option>
                      <option value="brand">Branding & Logo</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* BUDGET SECTION UPDATED */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="budget" className="text-sm font-semibold text-zinc-700">Estimated Budget</label>
                    <div className="flex gap-3">
                      <select 
                        id="currency" 
                        value={formData.currency} 
                        onChange={handleChange} 
                        className="bg-white px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all appearance-none cursor-pointer w-24 shrink-0"
                      >
                        <option value="$">$ (USD)</option>
                        <option value="₹">₹ (INR)</option>
                      </select>
                      <input 
                        type="number" 
                        id="budget" 
                        value={formData.budget} 
                        onChange={handleChange} 
                        className="flex-1 bg-white px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" 
                        placeholder="Enter amount" 
                      />
                    </div>
                  </div>

                  {/* MESSAGE SECTION UPDATED */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-sm font-semibold text-zinc-700">Tell us about your project:</label>
                    <textarea id="message" required value={formData.message} onChange={handleChange} rows={4} className="bg-white px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all resize-none" placeholder="Tell us about your goals..."></textarea>
                  </div>

                  <Magnetic strength={0.05}>
                    <button type="submit" disabled={isSubmitting} className="group relative w-full inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold text-black bg-brand-lime rounded-xl overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed">
                      <span className="relative z-10">{isSubmitting ? 'Sending...' : 'Send Request'}</span>
                      {!isSubmitting && <ArrowUpRight className="w-5 h-5 relative z-10 group-hover:rotate-45 transition-transform" />}
                      <div className="absolute inset-0 bg-white/20 transform -translate-x-full skew-x-12 group-hover:translate-x-full transition-transform duration-500"></div>
                    </button>
                  </Magnetic>
                </form>
              )}
            </div>
          </ScaleIn>
        </div>
      </section>
    </div>
  );
}
