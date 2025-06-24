import { createServerSupabaseClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import type { BlogPost } from '@/types';

interface PageProps {
  params: {
    slug: string;
  };
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      author:authors(*),
      tags:blog_post_tags(tag:tag_id(*))
    `)
    .eq('slug', slug)
    .single();

  if (error || !data) {
    console.error('Error fetching blog post:', error);
    return null;
  }

  // Transform the data to match the BlogPost interface
  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt || data.description,
    content: data.content,
    cover_image: data.image_url,
    author_id: data.author_id,
    author: data.author,
    tags: data.tags,
    created_at: data.created_at,
    updated_at: data.updated_at,
    is_featured: data.is_featured
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found - Health Blog',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: `${post.title} - Health Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  // Format the date
  const formattedDate = new Date(post.created_at || '').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <Image
          src={post.cover_image || '/images/blog/mindful-eating.jpg'}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {post.title}
            </h1>
            <div className="flex items-center space-x-4 text-white/90">
              {post.author && (
                <>
                  <div className="flex items-center">
                    <div className="relative h-8 w-8 rounded-full overflow-hidden mr-3">
                      <Image
                        src={post.author.avatar || '/images/authors/sarah.jpg'}
                        alt={post.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span>{post.author.name}</span>
                  </div>
                  <span>•</span>
                </>
              )}
              <time>{formattedDate}</time>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tagItem, index) => {
                const tagName = typeof tagItem === 'string' 
                  ? tagItem 
                  : tagItem.tag?.name;
                return tagName ? (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
                  >
                    {tagName}
                  </span>
                ) : null;
              })}
            </div>
          )}

          {/* Article Content */}
          <article className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {post.excerpt}
            </p>
            <div 
              className="prose prose-lg prose-primary"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* Author Bio */}
          {post.author && (
            <div className="mt-12 p-8 bg-gray-50 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4">
                  <Image
                    src={post.author.avatar || '/images/authors/sarah.jpg'}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {post.author.name}
                  </h3>
                  <p className="text-gray-600">Author</p>
                </div>
              </div>
              {post.author.bio && (
                <p className="text-gray-600">
                  {post.author.bio}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 