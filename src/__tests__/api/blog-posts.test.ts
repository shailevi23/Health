import { supabaseTestClient } from '../setup';
import type { BlogPost } from '@/types';

describe('Blog Posts API', () => {
  let testPost: BlogPost;

  beforeAll(async () => {
    // Create a test post
    const { data, error } = await supabaseTestClient
      .from('blog_posts')
      .insert({
        title: 'Test Blog Post',
        slug: 'test-blog-post',
        excerpt: 'This is a test blog post',
        content: 'Test content for the blog post',
        image_url: '/images/blog/test.jpg',
        author_id: global.__TEST_DATA__.authorId,
        is_featured: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating test post:', error);
      throw error;
    }

    testPost = data as BlogPost;

    // Add tags to the post
    const { error: tagError } = await supabaseTestClient
      .from('blog_post_tags')
      .insert(
        global.__TEST_DATA__.tagIds.map(tagId => ({
          blog_post_id: testPost.id,
          tag_id: tagId
        }))
      );

    if (tagError) {
      console.error('Error adding tags to test post:', tagError);
      throw tagError;
    }
  });

  afterAll(async () => {
    if (testPost?.id) {
      // Delete post tags first (foreign key constraint)
      await supabaseTestClient
        .from('blog_post_tags')
        .delete()
        .eq('blog_post_id', testPost.id);

      // Then delete the post
      await supabaseTestClient
        .from('blog_posts')
        .delete()
        .eq('id', testPost.id);
    }
  });

  describe('GET /api/blog/posts', () => {
    it('should return a list of blog posts', async () => {
      const { data, error } = await supabaseTestClient
        .from('blog_posts')
        .select(`
          *,
          author:authors(*),
          tags:blog_post_tags(tag:tag_id(*))
        `)
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.title).toBe('Test Blog Post');
      expect(data?.author).toBeDefined();
      expect(data?.tags).toBeDefined();
    });

    it('should include author and tags in the response', async () => {
      const { data, error } = await supabaseTestClient
        .from('blog_posts')
        .select(`
          *,
          author:authors(*),
          tags:blog_post_tags(tag:tag_id(*))
        `)
        .single();

      expect(error).toBeNull();
      expect(data).toMatchObject({
        title: 'Test Blog Post',
        slug: 'test-blog-post',
        excerpt: 'This is a test blog post'
      });
      expect(data?.author).toBeDefined();
      expect(data?.author.name).toBe('Test Author');
      expect(data?.tags).toHaveLength(2);
    });
  });

  describe('GET /api/blog/posts/[slug]', () => {
    it('should return a single blog post by slug with full details', async () => {
      const { data, error } = await supabaseTestClient
        .from('blog_posts')
        .select(`
          *,
          author:authors(*),
          tags:blog_post_tags(tag:tag_id(*))
        `)
        .eq('slug', 'test-blog-post')
        .single();

      expect(error).toBeNull();
      expect(data).toMatchObject({
        title: 'Test Blog Post',
        slug: 'test-blog-post',
        excerpt: 'This is a test blog post',
        content: 'Test content for the blog post',
        author_id: global.__TEST_DATA__.authorId
      });
      expect(data?.author).toBeDefined();
      expect(data?.tags).toHaveLength(2);
    });

    it('should return error for non-existent slug', async () => {
      const { data, error } = await supabaseTestClient
        .from('blog_posts')
        .select()
        .eq('slug', 'non-existent-post')
        .single();

      expect(data).toBeNull();
    });
  });

  describe('Blog post validation', () => {
    it('should enforce required fields', async () => {
      const { error } = await supabaseTestClient
        .from('blog_posts')
        .insert({
          // Missing required fields
          title: 'Invalid Post'
        });

      expect(error).not.toBeNull();
    });

    it('should enforce unique slugs', async () => {
      const { error } = await supabaseTestClient
        .from('blog_posts')
        .insert({
          title: 'Duplicate Slug Post',
          slug: 'test-blog-post', // Try to use existing slug
          excerpt: 'This should fail',
          content: 'Content',
          author_id: global.__TEST_DATA__.authorId
        });

      expect(error).not.toBeNull();
    });
  });
}); 