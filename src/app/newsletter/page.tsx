'use client';

import Image from 'next/image';
import NewsletterSubscribe from '@/components/NewsletterSubscribe';

export default function NewsletterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900">
                Stay Updated with{' '}
                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  Health & Wellness
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Join our community and receive weekly insights on nutrition, fitness, mental health, and evidence-based wellness tips.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              <h2 className="text-2xl font-display font-semibold text-gray-800">
                What You'll Get:
              </h2>
              <ul className="space-y-3">
                {[
                  'Weekly curated health & wellness articles',
                  'Exclusive healthy recipes and meal plans',
                  'Expert tips on nutrition and fitness',
                  'Early access to new content and features',
                  'Special offers on wellness products'
                ].map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <svg
                      className="h-6 w-6 text-primary-500 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-gray-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Subscribe Form */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-display font-semibold text-gray-800 mb-6">
                Subscribe to Our Newsletter
              </h3>
              <NewsletterSubscribe />
            </div>
          </div>

          {/* Image */}
          <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/images/blog/mindful-eating.jpg"
              alt="Healthy lifestyle newsletter"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            Join over 10,000+ health enthusiasts who trust our newsletter.
            We respect your privacy and will never share your information.
          </p>
        </div>
      </div>
    </div>
  );
} 