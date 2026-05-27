import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getSettings } from '../../lib/crud';
import { Magnetic } from '../motion/Animations';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Work', path: '/work' },
  { name: 'About', path: '/about' },
  { name: 'Pricing', path: '/pricing' }
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const location = useLocation();
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = lastScrollY.current;
    setIsScrolled(latest > 50);
    // Hide on scroll down, show on scroll up
    if (latest > 200 && latest > previous) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
    lastScrollY.current = latest;
  });

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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: isHidden ? -100 : 0, opacity: isHidden ? 0 : 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out border-b border-transparent",
        isScrolled ? "bg-black/30 backdrop-blur-2xl py-4 border-white/5 shadow-2xl" : "bg-transparent py-6"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 relative z-50">
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3"
          >
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-10 w-auto" />
            ) : (
              <>
                <div className="w-10 h-10 glass-panel rounded-xl flex items-center justify-center font-display font-light text-xl text-white">d</div>
                <span className="font-display font-light text-2xl tracking-widest text-white">dreweb</span>
              </>
            )}
          </motion.div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-2 py-1">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.path} 
                to={link.path}
                className="relative px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors hover:text-white text-white/60"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-white/10 rounded-full border border-white/5"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className={cn("relative z-10", isActive && "text-white")}>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center">
          <Magnetic strength={0.15}>
            <Link 
              to="/contact" 
              className="glass-button px-6 py-2.5 text-xs font-semibold uppercase tracking-widest"
              data-cursor="Let's Talk"
            >
              Start Project
            </Link>
          </Magnetic>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden relative z-50 p-2 rounded-full glass-panel text-white transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <AnimatePresence mode="wait">
            {mobileMenuOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <X size={20} />
              </motion.div>
            ) : (
              <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Menu size={20} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center gap-8"
          >
            {NAV_LINKS.map((link, i) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.05, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
              >
                <Link 
                  to={link.path}
                  className={cn(
                    "font-display text-4xl font-light tracking-widest uppercase transition-colors",
                    location.pathname === link.path ? "text-white" : "text-white/40 hover:text-white/80"
                  )}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: NAV_LINKS.length * 0.05 + 0.1, duration: 0.6 }}
              className="mt-8"
            >
              <Link 
                to="/contact" 
                className="glass-button px-10 py-4 text-sm font-semibold uppercase tracking-widest"
              >
                Start a Project
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
