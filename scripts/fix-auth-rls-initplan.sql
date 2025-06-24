-- Fix Auth RLS Initialization Plan warnings
-- This script optimizes RLS policies by replacing direct auth.uid() calls with subqueries

-- Fix users table policies
DROP POLICY IF EXISTS "Users can update their own profiles" ON public.users;
CREATE POLICY "Users can update their own profiles" 
  ON public.users FOR UPDATE 
  USING ((SELECT auth.uid()) = id);

-- Fix blog_comments table policies
DROP POLICY IF EXISTS "Users can create their own blog comments" ON public.blog_comments;
CREATE POLICY "Users can create their own blog comments" 
  ON public.blog_comments FOR INSERT 
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own blog comments" ON public.blog_comments;
CREATE POLICY "Users can update their own blog comments" 
  ON public.blog_comments FOR UPDATE 
  USING ((SELECT auth.uid()) = user_id);

-- Fix recipe_comments table policies
DROP POLICY IF EXISTS "Users can create their own recipe comments" ON public.recipe_comments;
CREATE POLICY "Users can create their own recipe comments" 
  ON public.recipe_comments FOR INSERT 
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own recipe comments" ON public.recipe_comments;
CREATE POLICY "Users can update their own recipe comments" 
  ON public.recipe_comments FOR UPDATE 
  USING ((SELECT auth.uid()) = user_id);

-- Fix product_reviews table policies
DROP POLICY IF EXISTS "Users can create their own product reviews" ON public.product_reviews;
CREATE POLICY "Users can create their own product reviews" 
  ON public.product_reviews FOR INSERT 
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own product reviews" ON public.product_reviews;
CREATE POLICY "Users can update their own product reviews" 
  ON public.product_reviews FOR UPDATE 
  USING ((SELECT auth.uid()) = user_id);

-- Fix page_views table policies
DROP POLICY IF EXISTS "Users can see their own page views" ON public.page_views;
CREATE POLICY "Users can see their own page views" 
  ON public.page_views FOR SELECT 
  USING ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin()));

-- Fix engagement table policies
DROP POLICY IF EXISTS "Users can create their own engagement" ON public.engagement;
CREATE POLICY "Users can create their own engagement" 
  ON public.engagement FOR INSERT 
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can see their own engagement" ON public.engagement;
CREATE POLICY "Users can see their own engagement" 
  ON public.engagement FOR SELECT 
  USING ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin()));

DROP POLICY IF EXISTS "Users can update their own engagement" ON public.engagement;
CREATE POLICY "Users can update their own engagement" 
  ON public.engagement FOR UPDATE 
  USING ((SELECT auth.uid()) = user_id);

-- Fix user_preferences table policies
DROP POLICY IF EXISTS "Users can see their own preferences" ON public.user_preferences;
CREATE POLICY "Users can see their own preferences" 
  ON public.user_preferences FOR SELECT 
  USING ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin()));

DROP POLICY IF EXISTS "Users can update their own preferences" ON public.user_preferences;
CREATE POLICY "Users can update their own preferences" 
  ON public.user_preferences FOR ALL 
  USING ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin())); 