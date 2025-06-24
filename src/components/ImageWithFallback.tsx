'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallbackSrc: string;
  fill?: boolean;
  className?: string;
  width?: number;
  height?: number;
}

export default function ImageWithFallback({
  src,
  alt,
  fallbackSrc,
  fill = false,
  className = '',
  width,
  height
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      className={className}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
} 