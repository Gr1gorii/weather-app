/* eslint-disable react-hooks/purity */
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface WeatherAnimationProps {
  weatherCode: number;
  isDay: number;
}

export const WeatherAnimation: React.FC<WeatherAnimationProps> = ({ weatherCode, isDay }) => {
  const isNight = isDay === 0;

  // Generate particles based on weather code (not updated every second thanks to useMemo)
  const particles = useMemo(() => {
    const items = [];
    
    // 1. Rain (codes 51-65, 80-82)
    const isRain = (weatherCode >= 51 && weatherCode <= 65) || (weatherCode >= 80 && weatherCode <= 82);
    if (isRain) {
      for (let i = 0; i < 40; i++) {
        items.push(
          <motion.div
            key={`rain-${i}`}
            className="absolute bg-blue-300/40 rounded-full"
            style={{ 
              width: '1px',
              height: `${Math.random() * 20 + 10}px`,
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20 + 10}%`
            }}
            animate={{
              y: ['0vh', '110vh'],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 0.5 + 0.6,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 2
            }}
          />
        );
      }
    }

    // 2. Snow (codes 71-75, 85-86)
    const isSnow = (weatherCode >= 71 && weatherCode <= 75) || weatherCode === 85 || weatherCode === 86;
    if (isSnow) {
      for (let i = 0; i < 30; i++) {
        const size = Math.random() * 4 + 2;
        items.push(
          <motion.div
            key={`snow-${i}`}
            className="absolute bg-white/70 rounded-full"
            style={{ 
              width: `${size}px`,
              height: `${size}px`,
              left: `${Math.random() * 100}%`,
              top: `-5%`
            }}
            animate={{
              y: ['0vh', '110vh'],
              x: [0, Math.random() * 60 - 30],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 3,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }}
          />
        );
      }
    }

    // 3. Stars (Clear night, codes 0-1)
    if (isNight && weatherCode <= 1) {
      for (let i = 0; i < 30; i++) {
        const size = Math.random() * 2 + 1;
        items.push(
          <motion.div
            key={`star-${i}`}
            className="absolute bg-white rounded-full"
            style={{ 
              width: `${size}px`,
              height: `${size}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{ opacity: [0.1, 0.8, 0.1] }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3
            }}
          />
        );
      }
    }

    // 4. Soft clouds (codes 2-3) or Fog (45-48)
    const isCloudy = weatherCode === 2 || weatherCode === 3;
    const isFog = weatherCode === 45 || weatherCode === 48;
    if (isCloudy || isFog) {
      const count = isFog ? 2 : 4;
      for (let i = 0; i < count; i++) {
        items.push(
          <motion.div
            key={`cloud-${i}`}
            className="absolute bg-white/5 rounded-full blur-[100px]"
            style={{ 
              width: `${Math.random() * 300 + 200}px`,
              height: `${Math.random() * 200 + 100}px`,
              left: `${Math.random() * 100 - 20}%`,
              top: `${Math.random() * 60 - 10}%`
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, Math.random() * 20 - 10, 0]
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        );
      }
    }
    
    // 5. Thunderstorm (codes 95-99)
    if (weatherCode >= 95) {
      items.push(
        <motion.div
          key="thunder"
          className="absolute inset-0 bg-white"
          animate={{ opacity: [0, 0, 0.5, 0, 0.2, 0, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            times: [0, 0.9, 0.92, 0.94, 0.96, 0.98, 1],
            ease: "linear"
          }}
        />
      );
    }
    
    // 6. Soft glow for clear day (code 0-1)
    if (!isNight && weatherCode <= 1) {
      items.push(
        <motion.div
          key="sun-glow"
          className="absolute bg-yellow-200/20 rounded-full blur-[120px]"
          style={{ 
            width: '400px',
            height: '400px',
            left: '50%',
            top: '0%',
            transform: 'translate(-50%, -50%)'
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      );
    }

    return items;
  }, [weatherCode, isNight]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles}
    </div>
  );
};
