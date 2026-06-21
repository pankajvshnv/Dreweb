import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../../lib/data';
import { getSettings } from '../../lib/crud';

export default function Footer() {
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    async function loadLogo() {
      const data = await getSettings('branding');
      if (data && data.logoLight) {
        setLogoUrl(data.logoLight);
      }
    }
    loadLogo();

    const handleStorageChange = () => loadLogo();
    window.addEventListener('local-storage-change', handleStorageChange);
    return () => window.removeEventListener('local-storage-change', handleStorageChange);
  }, []);

  return (
    <footer className="bg-background text-white pt-24 pb-8 border-t border-white/5 mt-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-20">
          <div className="max-w-md">
            {/* Footer Logo */}
            <div className="mb-8">
              <Link to="/">
                {logoUrl ? (
                  <img src={logoUrl} alt="dreweb" className="h-16 w-auto opacity-90 hover:opacity-100 transition-opacity" />
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 glass-panel rounded-2xl flex items-center justify-center font-display font-light text-2xl text-white">d</div>
                    <span className="font-display font-light text-4xl tracking-widest text-white">dreweb</span>
                  </div>
                )}
              </Link>
            </div>
            <h2 className="font-display text-4xl lg:text-6xl font-light tracking-tighter mb-8 text-white/90">
              Let's build<br/>
              <span className="text-white/50 italic">something great.</span>
            </h2>
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-3 text-lg font-light border-b border-white/20 pb-2 hover:text-white hover:border-white transition-all duration-300 text-white/60"
            >
              Start a Project 
              <span className="text-white/40">&rarr;</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 w-full md:w-auto">
            <div>
              <h4 className="font-semibold text-white/40 mb-6 uppercase text-[10px] tracking-[0.2em]">Sitemap</h4>
              <ul className="space-y-4 text-white/70 font-light text-sm">
                <li><Link to="/" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Home</Link></li>
                <li><Link to="/work" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Work</Link></li>
                <li><Link to="/about" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300">About</Link></li>
                <li><Link to="/services" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Services</Link></li>
                <li><Link to="/pricing" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white/40 mb-6 uppercase text-[10px] tracking-[0.2em]">Connect</h4>
              <ul className="space-y-4 text-white/70 font-light text-sm">
                <li><a href={`mailto:${BRAND.email}`} className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Email Us</a></li>
                <li><a href={`https://instagram.com/${BRAND.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Instagram</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Twitter</a></li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h4 className="font-semibold text-white/40 mb-6 uppercase text-[10px] tracking-[0.2em]">Location</h4>
              <p className="text-white/70 max-w-[150px] leading-relaxed font-light text-sm">
                {BRAND.location}
              </p>
            </div>
          </div>
        </div>

        {/* Marquee effect for categories */}
        <div className="py-8 border-y border-white/5 mb-8 whitespace-nowrap overflow-hidden flex items-center select-none text-white/5 font-display text-4xl sm:text-6xl uppercase font-light tracking-[0.2em]">
          <div className="animate-marquee inline-block">
            <span>✦ WEB DEVELOPMENT</span>
            <span className="mx-12">✦ GRAPHIC DESIGN</span>
            <span>✦ VIDEO EDITING</span>
            <span className="mx-12">✦ BRANDING</span>
          </div>
          <div className="animate-marquee inline-block ml-12">
            <span>✦ WEB DEVELOPMENT</span>
            <span className="mx-12">✦ GRAPHIC DESIGN</span>
            <span>✦ VIDEO EDITING</span>
            <span className="mx-12">✦ BRANDING</span>
          </div>
        </div>

        {/* Bottom meta */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-white/30 text-[10px] uppercase tracking-[0.2em] font-semibold">
          <div className="flex items-center gap-4">
            <p>© {new Date().getFullYear()} {BRAND.name.toUpperCase()} AGENCY · ALL RIGHTS RESERVED</p>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/admin" className="hover:text-white/80 transition-colors">Admin Login</Link>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
