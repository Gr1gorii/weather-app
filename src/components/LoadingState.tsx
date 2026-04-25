import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading weather...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-white">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      >
        <Loader2 size={48} className="opacity-80 mb-4" />
      </motion.div>
      <p className="text-lg font-medium opacity-90">{message}</p>
    </div>
  );
};
