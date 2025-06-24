import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { AffiliateProduct } from '@/types';
import ImageWithFallback from './ImageWithFallback';

interface AffiliateBoxProps {
  product: AffiliateProduct;
  className?: string;
}

const AffiliateBox: React.FC<AffiliateBoxProps> = ({ product, className = '' }) => {
  // Default image if the product image is missing
  const defaultProductImage = '/images/blog/plant-based-nutrition.jpg';
  
  return (
    <div className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
      <div className="relative h-48 w-full mb-4">
        <ImageWithFallback
          src={product.image || ''}
          fallbackSrc={defaultProductImage}
          alt={product.title}
          fill
          className="object-contain"
        />
      </div>
      <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">
        {product.title}
      </h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {product.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-lg font-medium text-emerald-600">
          {product.price}
        </span>
        <a
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          Learn More
          <ExternalLink className="ml-1 h-4 w-4" />
        </a>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          * This is an affiliate link. I may earn a commission if you make a purchase.
        </span>
      </div>
    </div>
  );
};

export default AffiliateBox; 