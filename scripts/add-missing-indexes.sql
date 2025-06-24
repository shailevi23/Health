-- Add missing indexes for foreign keys
-- This script creates indexes for all foreign key columns that don't have them

-- next_auth schema indexes
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON next_auth.accounts ("userId");
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON next_auth.sessions ("userId");

-- public schema indexes
CREATE INDEX IF NOT EXISTS idx_affiliate_products_featured_media_id ON public.affiliate_products (featured_media_id);

-- blog_comments indexes
CREATE INDEX IF NOT EXISTS idx_blog_comments_blog_post_id ON public.blog_comments (blog_post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_parent_comment_id ON public.blog_comments (parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_user_id ON public.blog_comments (user_id);

-- blog_post_tags indexes
CREATE INDEX IF NOT EXISTS idx_blog_post_tags_tag_id ON public.blog_post_tags (tag_id);

-- blog_posts indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON public.blog_posts (author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured_media_id ON public.blog_posts (featured_media_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_user_id ON public.blog_posts (user_id);

-- engagement indexes
CREATE INDEX IF NOT EXISTS idx_engagement_user_id ON public.engagement (user_id);

-- media indexes
CREATE INDEX IF NOT EXISTS idx_media_user_id ON public.media (user_id);

-- page_views indexes
CREATE INDEX IF NOT EXISTS idx_page_views_user_id ON public.page_views (user_id);

-- product_reviews indexes
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON public.product_reviews (product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON public.product_reviews (user_id);

-- recipe_comments indexes
CREATE INDEX IF NOT EXISTS idx_recipe_comments_parent_comment_id ON public.recipe_comments (parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_recipe_comments_recipe_id ON public.recipe_comments (recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_comments_user_id ON public.recipe_comments (user_id);

-- recipe_tags indexes
CREATE INDEX IF NOT EXISTS idx_recipe_tags_tag_id ON public.recipe_tags (tag_id);

-- recipes indexes
CREATE INDEX IF NOT EXISTS idx_recipes_featured_media_id ON public.recipes (featured_media_id);
CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON public.recipes (user_id); 