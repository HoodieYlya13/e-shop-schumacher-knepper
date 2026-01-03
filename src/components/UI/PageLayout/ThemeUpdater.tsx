'use client';

import { useEffect, type ReactNode } from 'react';

type ThemeUpdaterProps = {
  colors: string[] | null;
  children: ReactNode;
};

export default function ThemeUpdater({ colors, children }: ThemeUpdaterProps) {
  useEffect(() => {
    if (colors && colors.length === 10) {
      const root = document.documentElement;
      
      root.style.setProperty('--primary-color', colors[0]);
      root.style.setProperty('--secondary-color', colors[1]);
      root.style.setProperty('--accent-color', colors[2]);
      root.style.setProperty('--accent-dark-color', colors[3]);
      root.style.setProperty('--dark-color', colors[4]);
      root.style.setProperty('--light-color', colors[5]);
      root.style.setProperty('--valid-color', colors[6]);
      root.style.setProperty('--invalid-color', colors[7]);
      root.style.setProperty('--ultra-dark-color', colors[8]);
      root.style.setProperty('--ultra-light-color', colors[9]);
    }
  }, [colors]);

  return children;
}