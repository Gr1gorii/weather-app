import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface WeatherMetricCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  description?: string;
  delay?: number;
}

export const WeatherMetricCard: React.FC<WeatherMetricCardProps> = ({
  icon: Icon,
  title,
  value,
  description,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-panel rounded-3xl p-5 flex flex-col justify-between aspect-square text-white"
    >
      <div className="flex items-center gap-2 text-white/70 font-medium text-sm mb-4">
        <Icon size={16} />
        <span className="uppercase tracking-wider text-xs">{title}</span>
      </div>
      
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-3xl font-semibold mb-2">{value}</div>
      </div>
      
      {description && (
        <div className="text-sm text-white/80 mt-auto leading-tight">
          {description}
        </div>
      )}
    </motion.div>
  );
};
