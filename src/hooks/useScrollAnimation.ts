'use client';

import { useEffect, useState } from 'react';

export function useScrollAnimation() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate scale based on scroll position
  const calculateScale = () => {
    const maxScale = 1.2;
    const minScale = 1.0;
    const scrollThreshold = 500; // Adjust this value to control the animation range

    if (scrollY <= 0) return maxScale;
    if (scrollY >= scrollThreshold) return minScale;

    // Linear interpolation between maxScale and minScale
    const scale = maxScale - (scrollY / scrollThreshold) * (maxScale - minScale);
    return scale;
  };

  return {
    scale: calculateScale(),
    scrollY,
  };
} 