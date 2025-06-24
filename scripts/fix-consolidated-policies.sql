-- Fix Auth RLS Initialization Plan warnings for consolidated policies
-- This script updates all policies to use the (SELECT auth.uid()) pattern

-- Fix affiliate_products policy
DROP POLICY IF EXISTS "Products access policy" ON public.affiliate_products;
CREATE POLICY "Products access policy" 
  ON public.affiliate_products
  USING (
    CASE 
      WHEN current_setting('role') IN ('anon', 'authenticated', 'authenticator', 'dashboard_user') AND current_setting('request.method') = 'GET' THEN true
      WHEN current_setting('role') IN ('anon', 'authenticated', 'authenticator', 'dashboard_user') AND (SELECT public.is_admin()) THEN true
      ELSE false
    END
  );

-- Fix authors policy
DROP POLICY IF EXISTS "Authors access policy" ON public.authors;
CREATE POLICY "Authors access policy" 
  ON public.authors
  USING (
    CASE 
      WHEN current_setting('role') IN ('anon', 'authenticated', 'authenticator', 'dashboard_user') AND current_setting('request.method') = 'GET' THEN true
      WHEN current_setting('role') IN ('anon', 'authenticated', 'authenticator', 'dashboard_user') AND (SELECT public.is_admin()) THEN true
      ELSE false
    END
  );

-- Fix blog_comments policy
DROP POLICY IF EXISTS "Blog comments access policy" ON public.blog_comments;
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

-- Fix blog_post_tags policy
DROP POLICY IF EXISTS "Blog post tags access policy" ON public.blog_post_tags;
CREATE POLICY "Blog post tags access policy" 
  ON public.blog_post_tags
  USING (
    CASE 
      WHEN current_setting('role') IN ('anon', 'authenticated', 'authenticator', 'dashboard_user') AND current_setting('request.method') = 'GET' THEN true
      WHEN current_setting('role') IN ('anon', 'authenticated', 'authenticator', 'dashboard_user') AND (SELECT public.is_admin()) THEN true
      ELSE false
    END
  );

-- Fix blog_posts policy
DROP POLICY IF EXISTS "Blog posts access policy" ON public.blog_posts;
CREATE POLICY "Blog posts access policy" 
  ON public.blog_posts
  USING (
    CASE 
      WHEN current_setting('request.method') = 'GET' AND (is_featured = true OR (SELECT auth.uid()) = user_id OR (SELECT public.is_admin())) THEN true
      WHEN current_setting('request.method') IN ('POST', 'PUT', 'PATCH', 'DELETE') AND ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin())) THEN true
      ELSE false
    END
  );

-- Fix engagement policy
DROP POLICY IF EXISTS "Engagement access policy" ON public.engagement;
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

-- Fix media policy
DROP POLICY IF EXISTS "Media access policy" ON public.media;
CREATE POLICY "Media access policy" 
  ON public.media
  USING (
    CASE 
      WHEN current_setting('request.method') = 'GET' THEN true
      WHEN current_setting('request.method') IN ('POST', 'PUT', 'PATCH', 'DELETE') AND ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin())) THEN true
      ELSE false
    END
  );

-- Fix page_views policy
DROP POLICY IF EXISTS "Page views access policy" ON public.page_views;
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

-- Fix product_reviews policy
DROP POLICY IF EXISTS "Product reviews access policy" ON public.product_reviews;
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

-- Fix recipe_comments policy
DROP POLICY IF EXISTS "Recipe comments access policy" ON public.recipe_comments;
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

-- Fix recipe_tags policy
DROP POLICY IF EXISTS "Recipe tags access policy" ON public.recipe_tags;
CREATE POLICY "Recipe tags access policy" 
  ON public.recipe_tags
  USING (
    CASE 
      WHEN current_setting('role') IN ('anon', 'authenticated', 'authenticator', 'dashboard_user') AND current_setting('request.method') = 'GET' THEN true
      WHEN current_setting('role') IN ('anon', 'authenticated', 'authenticator', 'dashboard_user') AND (SELECT public.is_admin()) THEN true
      ELSE false
    END
  );

-- Fix recipes policy
DROP POLICY IF EXISTS "Recipes access policy" ON public.recipes;
CREATE POLICY "Recipes access policy" 
  ON public.recipes
  USING (
    CASE 
      WHEN current_setting('request.method') = 'GET' AND (is_featured = true OR (SELECT auth.uid()) = user_id OR (SELECT public.is_admin())) THEN true
      WHEN current_setting('request.method') IN ('POST', 'PUT', 'PATCH', 'DELETE') AND ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin())) THEN true
      ELSE false
    END
  );

-- Fix tags policy
DROP POLICY IF EXISTS "Tags access policy" ON public.tags;
CREATE POLICY "Tags access policy" 
  ON public.tags
  USING (
    CASE 
      WHEN current_setting('role') IN ('anon', 'authenticated', 'authenticator', 'dashboard_user') AND current_setting('request.method') = 'GET' THEN true
      WHEN current_setting('role') IN ('anon', 'authenticated', 'authenticator', 'dashboard_user') AND (SELECT public.is_admin()) THEN true
      ELSE false
    END
  );

-- Fix user_preferences policy
DROP POLICY IF EXISTS "User preferences access policy" ON public.user_preferences;
CREATE POLICY "User preferences access policy" 
  ON public.user_preferences
  USING (
    CASE 
      WHEN ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin())) THEN true
      ELSE false
    END
  );

-- Fix users policy
DROP POLICY IF EXISTS "Users access policy" ON public.users;
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