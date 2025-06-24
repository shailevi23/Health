-- First, create the author
INSERT INTO public.authors (id, name, avatar, bio, twitter, instagram)
VALUES (
  '123e4567-e89b-12d3-a456-426614174000',
  'Sarah Johnson',
  '/images/authors/sarah.jpg',
  'Certified nutritionist and wellness coach passionate about helping others achieve their health goals.',
  'healthcoachsarah',
  'sarahhealthlife'
) ON CONFLICT (id) DO NOTHING;

-- Create tags
INSERT INTO public.tags (id, name)
VALUES 
  ('223e4567-e89b-12d3-a456-426614174001', 'Nutrition'),
  ('223e4567-e89b-12d3-a456-426614174002', 'Wellness'),
  ('223e4567-e89b-12d3-a456-426614174003', 'Recipes'),
  ('223e4567-e89b-12d3-a456-426614174004', 'Mindfulness'),
  ('223e4567-e89b-12d3-a456-426614174005', 'Breakfast'),
  ('223e4567-e89b-12d3-a456-426614174006', 'Lunch'),
  ('223e4567-e89b-12d3-a456-426614174007', 'Vegan')
ON CONFLICT (name) DO NOTHING;

-- Insert featured blog posts
INSERT INTO public.blog_posts (
  title, 
  slug, 
  excerpt, 
  content, 
  cover_image, 
  author_id, 
  is_featured
)
VALUES
  (
    'Getting Started with Mindful Eating',
    'getting-started-with-mindful-eating',
    'Learn how mindful eating can transform your relationship with food and improve your overall well-being.',
    '# Getting Started with Mindful Eating\n\nMindful eating is a powerful practice that can transform your relationship with food...',
    '/images/blog/mindful-eating.jpg',
    '123e4567-e89b-12d3-a456-426614174000',
    true
  ),
  (
    'The Benefits of Plant-Based Nutrition',
    'benefits-of-plant-based-nutrition',
    'Discover the numerous health benefits of adopting a plant-based diet and how to get started.',
    '# The Benefits of Plant-Based Nutrition\n\nA plant-based diet can provide numerous health benefits...',
    '/images/blog/plant-based-nutrition.jpg',
    '123e4567-e89b-12d3-a456-426614174000',
    true
  ),
  (
    'Creating a Sustainable Fitness Routine',
    'creating-sustainable-fitness-routine',
    'Learn how to build a fitness routine that you can maintain long-term for better health.',
    '# Creating a Sustainable Fitness Routine\n\nBuilding a sustainable fitness routine is key to long-term success...',
    '/images/blog/fitness-routine.jpg',
    '123e4567-e89b-12d3-a456-426614174000',
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- Insert featured recipes
INSERT INTO public.recipes (
  title,
  slug,
  description,
  content,
  cover_image,
  prep_time,
  cook_time,
  servings,
  difficulty,
  ingredients,
  instructions,
  is_featured
)
VALUES
  (
    'Quinoa Buddha Bowl',
    'quinoa-buddha-bowl',
    'A nourishing bowl packed with protein, healthy fats, and colorful vegetables.',
    '# Quinoa Buddha Bowl\n\nThis nutritious bowl is perfect for a healthy lunch or dinner...',
    '/images/recipes/buddha-bowl.jpg',
    '15 minutes',
    '20 minutes',
    2,
    'easy',
    ARRAY['1 cup quinoa', '2 cups water', '1 avocado', '1 cup cherry tomatoes', '2 cups baby spinach', '1/4 cup hummus'],
    ARRAY['Cook quinoa according to package instructions', 'Slice avocado and tomatoes', 'Arrange all ingredients in bowls', 'Top with hummus and serve'],
    true
  ),
  (
    'Green Smoothie Bowl',
    'green-smoothie-bowl',
    'Start your day with this antioxidant-rich smoothie bowl topped with fresh fruits and seeds.',
    '# Green Smoothie Bowl\n\nPacked with nutrients to start your day right...',
    '/images/recipes/smoothie-bowl.jpg',
    '10 minutes',
    '0 minutes',
    1,
    'easy',
    ARRAY['2 bananas', '2 cups spinach', '1 cup almond milk', '1 tbsp chia seeds', 'Toppings: granola, berries, coconut flakes'],
    ARRAY['Blend bananas, spinach, and almond milk until smooth', 'Pour into a bowl', 'Top with granola, berries, and coconut flakes'],
    true
  ),
  (
    'Mediterranean Chickpea Salad',
    'mediterranean-chickpea-salad',
    'A refreshing and protein-rich salad perfect for lunch or as a side dish.',
    '# Mediterranean Chickpea Salad\n\nThis vibrant salad is perfect for meal prep...',
    '/images/recipes/chickpea-salad.jpg',
    '15 minutes',
    '0 minutes',
    4,
    'easy',
    ARRAY['2 cans chickpeas', '1 cucumber', '1 cup cherry tomatoes', '1/2 red onion', '1/2 cup olives', 'Feta cheese', 'Olive oil', 'Lemon juice'],
    ARRAY['Drain and rinse chickpeas', 'Chop vegetables', 'Combine all ingredients', 'Dress with olive oil and lemon juice'],
    true
  );

-- Link tags to blog posts
INSERT INTO public.blog_post_tags (blog_post_id, tag_id)
SELECT bp.id, t.id
FROM blog_posts bp
CROSS JOIN tags t
WHERE bp.slug = 'getting-started-with-mindful-eating'
  AND t.name IN ('Mindfulness', 'Wellness', 'Nutrition')
ON CONFLICT DO NOTHING;

INSERT INTO public.blog_post_tags (blog_post_id, tag_id)
SELECT bp.id, t.id
FROM blog_posts bp
CROSS JOIN tags t
WHERE bp.slug = 'benefits-of-plant-based-nutrition'
  AND t.name IN ('Nutrition', 'Wellness', 'Vegan')
ON CONFLICT DO NOTHING;

INSERT INTO public.blog_post_tags (blog_post_id, tag_id)
SELECT bp.id, t.id
FROM blog_posts bp
CROSS JOIN tags t
WHERE bp.slug = 'creating-sustainable-fitness-routine'
  AND t.name IN ('Wellness')
ON CONFLICT DO NOTHING;

-- Link tags to recipes
INSERT INTO public.recipe_tags (recipe_id, tag_id)
SELECT r.id, t.id
FROM recipes r
CROSS JOIN tags t
WHERE r.slug = 'quinoa-buddha-bowl'
  AND t.name IN ('Recipes', 'Lunch', 'Vegan')
ON CONFLICT DO NOTHING;

INSERT INTO public.recipe_tags (recipe_id, tag_id)
SELECT r.id, t.id
FROM recipes r
CROSS JOIN tags t
WHERE r.slug = 'green-smoothie-bowl'
  AND t.name IN ('Recipes', 'Breakfast', 'Vegan')
ON CONFLICT DO NOTHING;

INSERT INTO public.recipe_tags (recipe_id, tag_id)
SELECT r.id, t.id
FROM recipes r
CROSS JOIN tags t
WHERE r.slug = 'mediterranean-chickpea-salad'
  AND t.name IN ('Recipes', 'Lunch', 'Vegan')
ON CONFLICT DO NOTHING; 