import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-display text-[12rem] leading-none font-bold text-zinc-100 tracking-tighter mb-4 relative">
          404
          <span className="absolute inset-0 flex items-center justify-center text-5xl font-bold tracking-tighter text-black">
            Are you lost?
          </span>
        </h1>
        <p className="text-zinc-500 text-lg mb-10 max-w-md mx-auto">
          The page you're looking for doesn't exist, has been moved, or is currently under construction.
        </p>
        <Link to="/" className="inline-flex items-center justify-center px-8 py-4 bg-brand-lime text-black rounded-full font-semibold hover:bg-black hover:text-white transition-colors duration-300">
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
