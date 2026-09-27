import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import { Menu, X, ArrowUpRight, Phone, Mail, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { BRAND } from '../../lib/data';
import { Magnetic } from '../motion/Animations';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Work', path: '/work' },
  { name: 'Templates', path: '/templates' },
  { name: 'Blog', path: '/blog' },
  { name: 'About', path: '/about' },
  { name: 'Pricing', path: '/pricing' }
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = lastScrollY.current;
    setIsScrolled(latest > 50);
    // Hide on scroll down, show on scroll up (desktop & closed mobile menu only)
    if (!mobileMenuOpen && latest > 200 && latest > previous) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
    lastScrollY.current = latest;
  });

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: isHidden && !mobileMenuOpen ? -100 : 0, opacity: isHidden && !mobileMenuOpen ? 0 : 1 }}
        transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out border-b",
          isScrolled 
            ? "bg-white/85 backdrop-blur-xl py-3 border-zinc-100 shadow-[0_1px_25px_rgba(0,0,0,0.04)]" 
            : "bg-transparent py-4 md:py-6 border-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 relative z-50">
            <motion.div 
              whileHover={{ scale: 1.03 }} 
              whileTap={{ scale: 0.97 }}
              className="flex items-center"
            >
              <img 
                src="/brand-logo.png" 
                alt="Dreweb" 
                className="h-8 sm:h-9 md:h-10 w-auto transition-all duration-300"
              />
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.path} 
                  to={link.path}
                  className="relative px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors hover:text-black text-zinc-500"
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-zinc-100 rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className={cn("relative z-10", isActive && "text-black")}>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center">
            <Magnetic strength={0.15}>
              <Link 
                to="/contact" 
                className="group relative inline-flex items-center justify-center px-6 py-3 rounded-full bg-black text-white font-bold text-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                data-cursor="Let's Talk"
              >
                <span className="relative z-10">Start Your Project</span>
                <motion.div 
                  className="absolute inset-0 bg-brand-lime"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
                />
                <span className="absolute inset-0 z-10 flex items-center justify-center font-bold text-sm text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Start Your Project
                </span>
              </Link>
            </Magnetic>
          </div>

          {/* Mobile Right Controls: Quick CTA + Menu Toggle */}
          <div className="flex md:hidden items-center gap-2 relative z-50">
            <Link 
              to="/contact"
              className="px-3.5 py-1.5 rounded-full bg-black text-white text-xs font-bold tracking-tight shadow-sm active:scale-95 transition-transform"
            >
              Talk to us
            </Link>

            <button 
              type="button"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 active:scale-90 flex items-center justify-center text-zinc-900 transition-all focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X size={20} strokeWidth={2.5} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu size={20} strokeWidth={2.5} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            {/* Slide-out Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="absolute right-0 top-0 bottom-0 w-[88vw] max-w-sm bg-white shadow-2xl flex flex-col justify-between overflow-y-auto overscroll-contain"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Top / Header */}
              <div className="p-6 pt-20 border-b border-zinc-100">
                <p className="text-[11px] font-extrabold tracking-widest text-zinc-400 uppercase mb-4">
                  Navigation
                </p>
                <div className="space-y-1">
                  {NAV_LINKS.map((link, idx) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <motion.div
                        key={link.path}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * idx, duration: 0.25 }}
                      >
                        <Link 
                          to={link.path}
                          className={cn(
                            "flex items-center justify-between py-3 px-3 rounded-2xl transition-all font-display text-xl font-bold tracking-tight active:scale-[0.98]",
                            isActive 
                              ? "bg-zinc-900 text-white shadow-sm" 
                              : "text-zinc-800 hover:bg-zinc-50 active:bg-zinc-100"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span className={cn(
                              "text-xs font-mono font-bold", 
                              isActive ? "text-brand-lime" : "text-zinc-400"
                            )}>
                              0{idx + 1}
                            </span>
                            <span>{link.name}</span>
                          </div>
                          <ArrowUpRight className={cn(
                            "w-4 h-4 transition-transform", 
                            isActive ? "text-brand-lime" : "text-zinc-400"
                          )} />
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Drawer Bottom Actions */}
              <div className="p-6 bg-zinc-50/70 border-t border-zinc-100 space-y-4">
                <Link
                  to="/contact"
                  className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-brand-lime text-black font-extrabold text-sm shadow-md active:scale-98 transition-transform"
                >
                  <span>Start Your Project</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <a
                    href={`tel:${BRAND.phone.replace(/\s+/g, '')}`}
                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white border border-zinc-200 text-xs font-bold text-zinc-800 active:bg-zinc-100"
                  >
                    <Phone className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Call Us</span>
                  </a>
                  <a
                    href={`mailto:${BRAND.email}`}
                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white border border-zinc-200 text-xs font-bold text-zinc-800 active:bg-zinc-100"
                  >
                    <Mail className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Email</span>
                  </a>
                </div>

                <div className="pt-2 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                    {BRAND.name} Studio · {BRAND.location}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
