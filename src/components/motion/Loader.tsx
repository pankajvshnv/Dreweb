import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'reveal' | 'done'>('loading');

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setPhase('reveal'), 200);
          setTimeout(() => {
            setPhase('done');
            onComplete();
          }, 900);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 60);
    return () => clearInterval(timer);
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <AnimatePresence>
      <motion.div
        key="loader"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[99999] bg-black flex items-center justify-center"
      >
        <motion.div
          animate={phase === 'reveal' ? { scale: 20, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
          className="flex flex-col items-center gap-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <img src="/logo.png" alt="Logo" className="h-16 w-auto" />
          </motion.div>

          {/* Progress bar */}
          <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-brand-lime rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>

          {/* Progress text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            className="text-white text-[10px] font-bold uppercase tracking-[0.3em]"
          >
            Loading Experience
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
