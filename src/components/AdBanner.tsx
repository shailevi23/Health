import React from 'react';
import type { AdBannerProps } from '@/types';

const AdBanner: React.FC<AdBannerProps> = ({ slot, className = '' }) => {
  // This is a placeholder component that would be replaced with actual ad implementation
  // (e.g., Google AdSense, Carbon Ads, etc.)
  return (
    <div
      className={`bg-gray-100 rounded-xl p-4 text-center ${
        slot === 'hero' ? 'min-h-[250px]' : 'min-h-[100px]'
      } ${className}`}
      data-ad-slot={slot}
    >
      <div className="flex items-center justify-center h-full">
        <span className="text-gray-400 text-sm">Advertisement</span>
      </div>
    </div>
  );
};

export default AdBanner; 