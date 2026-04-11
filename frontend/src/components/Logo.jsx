import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Logo({ className = "", showText = true }) {
  return (
    <div className={`flex items-center gap-4 ${className} select-none`}>
      <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-xl border-2 border-accent opacity-20" 
        />
        <div className="w-6 h-6 bg-gradient-to-br from-accent to-accent-glow rounded-lg shadow-[0_0_20px_rgba(34,197,94,0.4)]" />
      </div>
      
      <AnimatePresence mode="wait">
        {showText && (
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="text-2xl font-black tracking-tighter uppercase font-sans whitespace-nowrap"
          >
            Forge<span className="text-accent italic">.</span>
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};
