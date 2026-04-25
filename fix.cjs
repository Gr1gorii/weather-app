const fs = require('fs');
const path = require('path');

const fixTypes = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixTypes(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Fix types imports
      content = content.replace(/import\s+{([^}]+)}\s+from\s+['"](.*?\/?types\/.*?)['"]/g, "import type { $1 } from '$2'");
      
      // Fix LucideIcon type import in WeatherMetricCard
      if (fullPath.includes('WeatherMetricCard.tsx')) {
        content = content.replace(/import { LucideIcon } from 'lucide-react'/, "import type { LucideIcon } from 'lucide-react'");
      }
      
      // Fix ThemeType import in ThemeToggle
      if (fullPath.includes('ThemeToggle.tsx')) {
        content = content.replace(/import { getTheme, setTheme, ThemeType } from '\.\.\/utils\/storage';/, "import { getTheme, setTheme } from '../utils/storage';\nimport type { ThemeType } from '../utils/storage';");
      }

      // Fix unused variables in App.tsx
      if (fullPath.includes('App.tsx')) {
        content = content.replace(/import { searchCities } from '\.\/api\/geocodingApi';/, '');
        content = content.replace(/import { formatTime } from '\.\/utils\/date';/, '');
        content = content.replace(/const response = await fetch/g, 'await fetch');
        content = content.replace(/\(err\)/g, '()');
        content = content.replace(/import React, { useState, useEffect }/g, 'import { useState, useEffect }');
      }

      // Fix unused var in date.ts
      if (fullPath.includes('date.ts')) {
        content = content.replace(/const now = new Date\(\);\n\s*/g, '');
      }
      
      fs.writeFileSync(fullPath, content);
    }
  }
};

fixTypes(path.join(process.cwd(), 'src'));
console.log('Fixed types!');
