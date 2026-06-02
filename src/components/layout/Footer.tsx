import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../../lib/data';
import { getSettings } from '../../lib/crud';

export default function Footer() {


  useEffect(() => {
    // Dynamic logo removed
  }, []);

  return (
    <footer className="bg-white text-black pt-24 pb-8 border-t border-surface-border mt-20 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-20">
          <div className="max-w-md">
            {/* Footer Logo */}
            <div className="mb-8">
              <Link to="/">
                <img src="/brand-logo.png" alt="Dreweb" className="h-12 md:h-16 w-auto" />
              </Link>
            </div>
            <h2 className="font-display text-5xl lg:text-7xl font-extrabold tracking-[-0.04em] mb-6">
              Let's build<br/>
              <span className="text-brand-blue italic">something great.</span>
            </h2>
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-2 text-xl font-bold border-b-2 border-black pb-1 hover:text-brand-blue hover:border-brand-blue transition-colors"
            >
              Start a Project 
              <span className="text-brand-blue">&rarr;</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 w-full md:w-auto">
            <div>
              <h4 className="font-bold text-black/50 mb-6 uppercase text-[11px] tracking-[0.1em]">Sitemap</h4>
              <ul className="space-y-4 text-black/80 font-bold text-sm">
                <li><Link to="/" className="hover:text-brand-blue transition-colors">Home</Link></li>
                <li><Link to="/work" className="hover:text-brand-blue transition-colors">Work</Link></li>
                <li><Link to="/about" className="hover:text-brand-blue transition-colors">About</Link></li>
                <li><Link to="/services" className="hover:text-brand-blue transition-colors">Services</Link></li>
                <li><Link to="/pricing" className="hover:text-brand-blue transition-colors">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-black/50 mb-6 uppercase text-[11px] tracking-[0.1em]">Connect</h4>
              <ul className="space-y-4 text-black/80 font-bold text-sm">
                <li><a href={`mailto:${BRAND.email}`} className="hover:text-brand-blue transition-colors">Email Us</a></li>
                <li><a href={`https://instagram.com/${BRAND.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-brand-blue transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-brand-blue transition-colors">Twitter</a></li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h4 className="font-bold text-black/50 mb-6 uppercase text-[11px] tracking-[0.1em]">Location</h4>
              <p className="text-black/80 max-w-[150px] leading-relaxed font-bold text-sm">
                {BRAND.location}
              </p>
            </div>
          </div>
        </div>

        {/* Marquee effect for categories */}
        <div className="py-8 border-y border-surface-border mb-8 whitespace-nowrap overflow-hidden flex items-center select-none text-black/10 font-display text-4xl sm:text-6xl uppercase font-bold">
          <div className="animate-marquee inline-block">
            <span>✦ WEB DEVELOPMENT</span>
            <span className="mx-8">✦ GRAPHIC DESIGN</span>
            <span>✦ VIDEO EDITING</span>
            <span className="mx-8">✦ BRANDING</span>
          </div>
          <div className="animate-marquee inline-block ml-8">
            <span>✦ WEB DEVELOPMENT</span>
            <span className="mx-8">✦ GRAPHIC DESIGN</span>
            <span>✦ VIDEO EDITING</span>
            <span className="mx-8">✦ BRANDING</span>
          </div>
        </div>

        {/* Bottom meta */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-black/40 text-[10px] uppercase tracking-[0.2em] font-bold">
          <div></div>
          <div className="flex items-center gap-4">
            <p>© {new Date().getFullYear()} {BRAND.name.toUpperCase()} AGENCY · ALL RIGHTS RESERVED</p>
            <Link to="/admin" className="hover:text-brand-blue transition-colors border-l border-surface-border pl-4">Admin Login</Link>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
