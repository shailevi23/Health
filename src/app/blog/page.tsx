import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Metadata } from 'next';
import BlogList from '@/components/BlogList';
import type { BlogPost } from '@/types';

export const metadata: Metadata = {
  title: 'Blog - Health Blog',
  description: 'Expert insights on nutrition, fitness, and mindful living for a healthier lifestyle.',
};

async function getBlogPosts(): Promise<BlogPost[]> {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      author:authors(*),
      tags:blog_post_tags(tag:tag_id(*))
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }

  // Transform the data to match the BlogPost interface
  const transformedData = data?.map(post => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || post.description, // Use description as fallback for excerpt
    content: post.content,
    cover_image: post.image_url,
    author_id: post.author_id,
    author: post.author,
    tags: post.tags,
    created_at: post.created_at,
    updated_at: post.updated_at,
    is_featured: post.is_featured
  })) || [];

  return transformedData;
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-primary-50 to-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Health & Wellness Blog
            </h1>
            <p className="text-xl text-gray-600">
              Expert insights on nutrition, fitness, and mindful living
            </p>
          </div>
        </div>
      </div>

      {/* Featured Topics */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Featured Topics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-white shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Nutrition</h3>
              <p className="text-gray-600">
                Evidence-based nutrition advice for optimal health and wellness.
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-white shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Fitness</h3>
              <p className="text-gray-600">
                Workout tips and exercise routines for all fitness levels.
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-white shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Mental Health</h3>
              <p className="text-gray-600">
                Strategies for maintaining mental wellness and reducing stress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Latest Articles
          </h2>
          <BlogList posts={posts} />
        </div>
      </section>
    </div>
  );
} 