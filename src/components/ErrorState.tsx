import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  message = 'An error occurred while loading data', 
  onRetry 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass p-8 rounded-3xl flex flex-col items-center justify-center text-center text-white max-w-md mx-auto my-10"
    >
      <AlertCircle size={48} className="text-red-400 mb-4" />
      <h3 className="text-xl font-semibold mb-2">Oops, an error!</h3>
      <p className="text-white/80 mb-6">{message}</p>
      
      {onRetry && (
        <button 
          onClick={onRetry}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors px-6 py-3 rounded-full font-medium"
        >
          <RefreshCw size={18} />
          Try Again
        </button>
      )}
    </motion.div>
  );
};
