import React from 'react';
import AffiliateBox from '@/components/AffiliateBox';
import AdBanner from '@/components/AdBanner';
import { supabase } from '@/lib/supabase';
import type { AffiliateProduct } from '@/types';
import NewsletterSubscribe from '@/components/NewsletterSubscribe';

async function getAffiliateProducts() {
  const { data, error } = await supabase
    .from('affiliate_products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching affiliate products:', error);
    return [];
  }

  return data as AffiliateProduct[];
}

export default async function RecommendationsPage() {
  const products = await getAffiliateProducts();
  const categories = Array.from(new Set(products.map(product => product.category)));

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] flex items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/images/products/yoga-mat.jpg')] bg-cover bg-center opacity-40"></div>
        </div>
        <div className="container mx-auto px-6 relative z-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Recommended Products</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Quality products to support your wellness journey
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Curated With Care</h2>
            <p className="text-lg text-gray-600 mb-10">
              We've carefully curated these products based on quality, effectiveness, and value. 
              Our recommendations come from personal experience and thorough research to help you 
              make informed decisions about your health and wellness purchases.
            </p>
            <AdBanner slot="hero" className="max-w-4xl mx-auto" />
          </div>
        </div>
      </section>

      {/* Product Categories */}
      {categories.map((category) => (
        <section key={category} className="py-16 bg-gray-50 even:bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center capitalize">
                {category.replace('-', ' ')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products
                  .filter(product => product.category === category)
                  .map((product) => (
                    <AffiliateBox
                      key={product.id}
                      product={product}
                    />
                  ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Review Process */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Review Process</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-emerald-50 p-8 rounded-xl">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality & Effectiveness</h3>
                <p className="text-gray-600">
                  We assess the materials, manufacturing process, durability, and real benefits backed by research or reliable user experiences.
                </p>
              </div>
              <div className="bg-emerald-50 p-8 rounded-xl">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Value & User Feedback</h3>
                <p className="text-gray-600">
                  We consider the price-to-quality ratio and take into account real user reviews and experiences to ensure you get the best value.
                </p>
              </div>
            </div>

            <AdBanner slot="content" className="mb-12" />
            
            <div className="bg-gray-50 p-8 rounded-xl text-center">
              <p className="text-gray-600 italic">
                <span className="font-medium">Note:</span> Some links on this page are affiliate links. We may earn a commission if you make a purchase through these links, at no additional cost to you. This helps support our work in providing valuable, free content.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-500 to-teal-600">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Stay Updated</h2>
            <p className="text-xl text-white/90 mb-10">
              Get notified about new product recommendations and exclusive deals.
            </p>
            <NewsletterSubscribe 
              buttonText="Subscribe" 
              className="justify-center max-w-lg mx-auto" 
            />
          </div>
        </div>
      </section>
    </div>
  );
} 