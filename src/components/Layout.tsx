'use client';

import React from 'react';
import Head from 'next/head';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  image?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'Health Life - Your Journey to Wellness',
  description = 'Discover healthy recipes, wellness tips, and lifestyle advice to help you live your best life.',
  image = '/og-image.jpg'
}) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://healthlife.com';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={`${siteUrl}${image}`} />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${siteUrl}${image}`} />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </>
  );
};

export default Layout; 