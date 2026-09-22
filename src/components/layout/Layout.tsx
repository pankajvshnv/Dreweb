import { ReactNode, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Navbar from './Navbar';
import Footer from './Footer';

import Loader from '../motion/Loader';
import { PageTransition } from '../motion/Animations';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [loaded, setLoaded] = useState(false);
  const location = useLocation();
  const handleComplete = useCallback(() => setLoaded(true), []);

  return (
    <div className="flex flex-col min-h-screen">
      {!loaded && <Loader onComplete={handleComplete} />}

      <Navbar />
      <main className="flex-grow pt-24">{children}</main>
      <Footer />
    </div>
  );
}
