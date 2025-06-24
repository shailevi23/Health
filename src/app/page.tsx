'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import BlogCard from '@/components/BlogCard';
import NewsletterSubscribe from '@/components/NewsletterSubscribe';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { getFeaturedContent } from '@/lib/supabase';
import type { BlogPost, Recipe } from '@/types';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [featuredContent, setFeaturedContent] = useState<{
    posts: BlogPost[];
    recipes: Recipe[];
  }>({
    posts: [],
    recipes: []
  });

  const { scale } = useScrollAnimation();

  useEffect(() => {
    async function loadFeaturedContent() {
      try {
        const content = await getFeaturedContent();
        setFeaturedContent(content);
      } catch (error) {
        console.error('Error loading featured content:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadFeaturedContent();
  }, []);

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section - Full Width */}
      <section className="relative min-h-[90vh] w-screen flex items-center overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0 w-full h-full">
          <div 
            className="relative w-full h-full transform transition-transform duration-1000 ease-out will-change-transform"
            style={{
              transform: `scale(${scale})`,
            }}
          >
            <Image
              src="/images/blog/plant-based-nutrition.jpg"
              alt="Healthy lifestyle"
              fill
              className="object-cover object-center"
              priority
              quality={100}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-2xl animate-fade-up">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight">
                Your Journey to a{' '}
                <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                  Healthier Life
                </span>{' '}
                Starts Here
              </h1>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                Evidence-based articles, nutritious recipes, and expert advice to help you make informed decisions about your health.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/blog" className="button-primary">
                  Read Articles
                </Link>
                <Link href="/recipes" className="button-secondary">
                  Explore Recipes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center">Featured Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {isLoading ? (
              // Loading skeleton
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))
            ) : featuredContent.posts.length > 0 ? (
              featuredContent.posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))
            ) : (
              // Fallback content
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500">No featured articles available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="section-title">Stay Updated</h2>
            <p className="text-gray-600 mb-8">
              Get the latest health tips, recipes, and wellness advice delivered straight to your inbox.
            </p>
            <div className="max-w-md mx-auto">
              <NewsletterSubscribe />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-display font-bold text-gray-900 mb-2">Evidence-Based Content</h3>
              <p className="text-gray-600">
                All our articles are thoroughly researched and backed by scientific studies.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-secondary-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-display font-bold text-gray-900 mb-2">Expert Contributors</h3>
              <p className="text-gray-600">
                Articles written by health professionals and wellness experts.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-xl font-display font-bold text-gray-900 mb-2">Practical Tips</h3>
              <p className="text-gray-600">
                Actionable advice you can implement in your daily life.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 