-- Fix Multiple Permissive Policies warnings
-- This script consolidates multiple permissive policies for the same role and action

-- Fix affiliate_products table policies
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.affiliate_products;
DROP POLICY IF EXISTS "Products are editable by admins only" ON public.affiliate_products;
CREATE POLICY "Products access policy" 
  ON public.affiliate_products
  USING (
    CASE 
      WHEN current_setting('role') IN ('anon', 'authenticated', 'authenticator', 'dashboard_user') AND current_setting('request.method') = 'GET' THEN true
      WHEN current_setting('role') IN ('anon', 'authenticated', 'authenticator', 'dashboard_user') AND (SELECT public.is_admin()) THEN true
      ELSE false
    END
  );

-- Fix authors table policies
DROP POLICY IF EXISTS "Authors are viewable by everyone" ON public.authors;
DROP POLICY IF EXISTS "Authors are editable by admins only" ON public.authors;
CREATE POLICY "Authors access policy" 
  ON public.authors
  USING (
    CASE 
      WHEN current_setting('role') IN ('anon', 'authenticated', 'authenticator', 'dashboard_user') AND current_setting('request.method') = 'GET' THEN true
      WHEN current_setting('role') IN ('anon', 'authenticated', 'authenticator', 'dashboard_user') AND (SELECT public.is_admin()) THEN true
      ELSE false
    END
  );

-- Fix blog_comments table policies
DROP POLICY IF EXISTS "Approved blog comments are viewable by everyone" ON public.blog_comments;
DROP POLICY IF EXISTS "Users can create their own blog comments" ON public.blog_comments;
DROP POLICY IF EXISTS "Users can update their own blog comments" ON public.blog_comments;
DROP POLICY IF EXISTS "Admins can manage all blog comments" ON public.blog_comments;
CREATE POLICY "Blog comments access policy" 
  ON public.blog_comments
  USING (
    CASE 
      WHEN current_setting('request.method') = 'GET' AND (is_approved = true OR (SELECT auth.uid()) = user_id OR (SELECT public.is_admin())) THEN true
      WHEN current_setting('request.method') = 'POST' AND ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin())) THEN true
      WHEN current_setting('request.method') IN ('PUT', 'PATCH') AND ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin())) THEN true
      WHEN current_setting('request.method') = 'DELETE' AND (SELECT public.is_admin()) THEN true
      ELSE false
    END
  );

-- Fix blog_post_tags table policies
DROP POLICY IF EXISTS "Blog post tags are viewable by everyone" ON public.blog_post_tags;
DROP POLICY IF EXISTS "Blog post tags are editable by admins only" ON public.blog_post_tags;
CREATE POLICY "Blog post tags access policy" 
  ON public.blog_post_tags
  USING (
    CASE 
      WHEN current_setting('role') IN ('anon', 'authenticated', 'authenticator', 'dashboard_user') AND current_setting('request.method') = 'GET' THEN true
      WHEN current_setting('role') IN ('anon', 'authenticated', 'authenticator', 'dashboard_user') AND (SELECT public.is_admin()) THEN true
      ELSE false
    END
  );

-- Fix blog_posts table policies
DROP POLICY IF EXISTS "Published blog posts are viewable by everyone" ON public.blog_posts;
DROP POLICY IF EXISTS "Blog posts are editable by their authors and admins" ON public.blog_posts;
CREATE POLICY "Blog posts access policy" 
  ON public.blog_posts
  USING (
    CASE 
      WHEN current_setting('request.method') = 'GET' AND (is_featured = true OR (SELECT auth.uid()) = user_id OR (SELECT public.is_admin())) THEN true
      WHEN current_setting('request.method') IN ('POST', 'PUT', 'PATCH', 'DELETE') AND ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin())) THEN true
      ELSE false
    END
  );

-- Fix engagement table policies
DROP POLICY IF EXISTS "Users can see their own engagement" ON public.engagement;
DROP POLICY IF EXISTS "Users can create their own engagement" ON public.engagement;
DROP POLICY IF EXISTS "Users can update their own engagement" ON public.engagement;
DROP POLICY IF EXISTS "Admins can manage all engagement" ON public.engagement;
CREATE POLICY "Engagement access policy" 
  ON public.engagement
  USING (
    CASE 
      WHEN current_setting('request.method') = 'GET' AND ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin())) THEN true
      WHEN current_setting('request.method') = 'POST' AND ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin())) THEN true
      WHEN current_setting('request.method') IN ('PUT', 'PATCH') AND ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin())) THEN true
      WHEN current_setting('request.method') = 'DELETE' AND (SELECT public.is_admin()) THEN true
      ELSE false
    END
  );

-- Fix media table policies
DROP POLICY IF EXISTS "Media is viewable by everyone" ON public.media;
DROP POLICY IF EXISTS "Users can upload and manage their own media" ON public.media;
CREATE POLICY "Media access policy" 
  ON public.media
  USING (
    CASE 
      WHEN current_setting('request.method') = 'GET' THEN true
      WHEN current_setting('request.method') IN ('POST', 'PUT', 'PATCH', 'DELETE') AND ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin())) THEN true
      ELSE false
    END
  );

-- Fix page_views table policies
DROP POLICY IF EXISTS "Users can see their own page views" ON public.page_views;
DROP POLICY IF EXISTS "System can insert page views" ON public.page_views;
DROP POLICY IF EXISTS "Admins can manage all page views" ON public.page_views;
CREATE POLICY "Page views access policy" 
  ON public.page_views
  USING (
    CASE 
      WHEN current_setting('request.method') = 'GET' AND ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin())) THEN true
      WHEN current_setting('request.method') = 'POST' THEN true
      WHEN current_setting('request.method') IN ('PUT', 'PATCH', 'DELETE') AND (SELECT public.is_admin()) THEN true
      ELSE false
    END
  );

-- Fix product_reviews table policies
DROP POLICY IF EXISTS "Approved product reviews are viewable by everyone" ON public.product_reviews;
DROP POLICY IF EXISTS "Users can create their own product reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Users can update their own product reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Admins can manage all product reviews" ON public.product_reviews;
CREATE POLICY "Product reviews access policy" 
  ON public.product_reviews
  USING (
    CASE 
      WHEN current_setting('request.method') = 'GET' AND (is_approved = true OR (SELECT auth.uid()) = user_id OR (SELECT public.is_admin())) THEN true
      WHEN current_setting('request.method') = 'POST' AND ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin())) THEN true
      WHEN current_setting('request.method') IN ('PUT', 'PATCH') AND ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin())) THEN true
      WHEN current_setting('request.method') = 'DELETE' AND (SELECT public.is_admin()) THEN true
      ELSE false
    END
  );

-- Fix recipe_comments table policies
DROP POLICY IF EXISTS "Approved recipe comments are viewable by everyone" ON public.recipe_comments;
DROP POLICY IF EXISTS "Users can create their own recipe comments" ON public.recipe_comments;
DROP POLICY IF EXISTS "Users can update their own recipe comments" ON public.recipe_comments;
DROP POLICY IF EXISTS "Admins can manage all recipe comments" ON public.recipe_comments;
CREATE POLICY "Recipe comments access policy" 
  ON public.recipe_comments
  USING (
    CASE 
      WHEN current_setting('request.method') = 'GET' AND (is_approved = true OR (SELECT auth.uid()) = user_id OR (SELECT public.is_admin())) THEN true
      WHEN current_setting('request.method') = 'POST' AND ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin())) THEN true
      WHEN current_setting('request.method') IN ('PUT', 'PATCH') AND ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin())) THEN true
      WHEN current_setting('request.method') = 'DELETE' AND (SELECT public.is_admin()) THEN true
      ELSE false
    END
  );

-- Fix recipe_tags table policies
DROP POLICY IF EXISTS "Recipe tags are viewable by everyone" ON public.recipe_tags;
DROP POLICY IF EXISTS "Recipe tags are editable by admins only" ON public.recipe_tags;
CREATE POLICY "Recipe tags access policy" 
  ON public.recipe_tags
  USING (
    CASE 
      WHEN current_setting('role') IN ('anon', 'authenticated', 'authenticator', 'dashboard_user') AND current_setting('request.method') = 'GET' THEN true
      WHEN current_setting('role') IN ('anon', 'authenticated', 'authenticator', 'dashboard_user') AND (SELECT public.is_admin()) THEN true
      ELSE false
    END
  );

-- Fix recipes table policies
DROP POLICY IF EXISTS "Published recipes are viewable by everyone" ON public.recipes;
DROP POLICY IF EXISTS "Recipes are editable by their authors and admins" ON public.recipes;
CREATE POLICY "Recipes access policy" 
  ON public.recipes
  USING (
    CASE 
      WHEN current_setting('request.method') = 'GET' AND (is_featured = true OR (SELECT auth.uid()) = user_id OR (SELECT public.is_admin())) THEN true
      WHEN current_setting('request.method') IN ('POST', 'PUT', 'PATCH', 'DELETE') AND ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin())) THEN true
      ELSE false
    END
  );

-- Fix tags table policies
DROP POLICY IF EXISTS "Tags are viewable by everyone" ON public.tags;
DROP POLICY IF EXISTS "Tags are editable by admins only" ON public.tags;
CREATE POLICY "Tags access policy" 
  ON public.tags
  USING (
    CASE 
      WHEN current_setting('role') IN ('anon', 'authenticated', 'authenticator', 'dashboard_user') AND current_setting('request.method') = 'GET' THEN true
      WHEN current_setting('role') IN ('anon', 'authenticated', 'authenticator', 'dashboard_user') AND (SELECT public.is_admin()) THEN true
      ELSE false
    END
  );

-- Fix user_preferences table policies
DROP POLICY IF EXISTS "Users can see their own preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can update their own preferences" ON public.user_preferences;
CREATE POLICY "User preferences access policy" 
  ON public.user_preferences
  USING (
    CASE 
      WHEN ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin())) THEN true
      ELSE false
    END
  );

-- Fix users table policies
DROP POLICY IF EXISTS "Users can view other user profiles" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profiles" ON public.users;
DROP POLICY IF EXISTS "Admins can do everything with users" ON public.users;
CREATE POLICY "Users access policy" 
  ON public.users
  USING (
    CASE 
      WHEN current_setting('request.method') = 'GET' THEN true
      WHEN current_setting('request.method') IN ('PUT', 'PATCH') AND ((SELECT auth.uid()) = id OR (SELECT public.is_admin())) THEN true
      WHEN current_setting('request.method') IN ('POST', 'DELETE') AND (SELECT public.is_admin()) THEN true
      ELSE false
    END
  ); 