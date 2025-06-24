-- Insert sample author
INSERT INTO authors (id, name, avatar, bio, twitter, instagram)
VALUES (
  '123e4567-e89b-12d3-a456-426614174000',
  'Sarah Johnson',
  '/images/authors/sarah.jpg',
  'Certified nutritionist and wellness coach passionate about helping others achieve their health goals.',
  'healthcoachsarah',
  'sarahhealthlife'
);

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, author_id, is_featured)
VALUES
  (
    'Getting Started with Mindful Eating',
    'getting-started-with-mindful-eating',
    'Learn how mindful eating can transform your relationship with food and improve your overall well-being.',
    '# Getting Started with Mindful Eating\n\nMindful eating is...',
    '/images/blog/mindful-eating.jpg',
    '123e4567-e89b-12d3-a456-426614174000',
    true
  ),
  (
    '10 Simple Morning Habits for Better Health',
    '10-simple-morning-habits',
    'Start your day right with these easy-to-implement morning habits that will boost your energy and health.',
    '# 10 Simple Morning Habits\n\n1. Drink water first thing...',
    '/images/blog/morning-habits.jpg',
    '123e4567-e89b-12d3-a456-426614174000',
    true
  );

-- Insert sample recipes
INSERT INTO recipes (title, slug, description, content, cover_image, prep_time, cook_time, servings, difficulty, ingredients, instructions, is_featured)
VALUES
  (
    'Quinoa Buddha Bowl',
    'quinoa-buddha-bowl',
    'A nourishing bowl packed with protein, healthy fats, and colorful vegetables.',
    '# Quinoa Buddha Bowl\n\nThis nutritious bowl...',
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
    '# Green Smoothie Bowl\n\nPacked with nutrients...',
    '/images/recipes/smoothie-bowl.jpg',
    '10 minutes',
    '0 minutes',
    1,
    'easy',
    ARRAY['2 bananas', '2 cups spinach', '1 cup almond milk', '1 tbsp chia seeds', 'Toppings: granola, berries, coconut flakes'],
    ARRAY['Blend bananas, spinach, and almond milk until smooth', 'Pour into a bowl', 'Top with granola, berries, and coconut flakes'],
    true
  );

-- Insert sample affiliate products
INSERT INTO affiliate_products (title, description, image, link, price, category, is_featured)
VALUES
  (
    'Premium Yoga Mat',
    'Eco-friendly, non-slip yoga mat perfect for your daily practice.',
    '/images/products/yoga-mat.jpg',
    'https://example.com/yoga-mat',
    '$68.00',
    'Fitness',
    true
  ),
  (
    'High-Speed Blender',
    'Professional-grade blender for smooth green smoothies and healthy soups.',
    '/images/products/blender.jpg',
    'https://example.com/blender',
    '$199.99',
    'Kitchen',
    true
  );

-- Insert sample tags
INSERT INTO tags (id, name)
VALUES
  ('223e4567-e89b-12d3-a456-426614174001', 'Nutrition'),
  ('223e4567-e89b-12d3-a456-426614174002', 'Wellness'),
  ('223e4567-e89b-12d3-a456-426614174003', 'Recipes'),
  ('223e4567-e89b-12d3-a456-426614174004', 'Mindfulness'),
  ('223e4567-e89b-12d3-a456-426614174005', 'Breakfast'),
  ('223e4567-e89b-12d3-a456-426614174006', 'Lunch'),
  ('223e4567-e89b-12d3-a456-426614174007', 'Vegan');

-- Link tags to blog posts
INSERT INTO blog_post_tags (blog_post_id, tag_id)
SELECT bp.id, t.id
FROM blog_posts bp
CROSS JOIN tags t
WHERE bp.slug = 'getting-started-with-mindful-eating'
  AND t.name IN ('Mindfulness', 'Wellness', 'Nutrition');

INSERT INTO blog_post_tags (blog_post_id, tag_id)
SELECT bp.id, t.id
FROM blog_posts bp
CROSS JOIN tags t
WHERE bp.slug = '10-simple-morning-habits'
  AND t.name IN ('Wellness', 'Mindfulness');

-- Link tags to recipes
INSERT INTO recipe_tags (recipe_id, tag_id)
SELECT r.id, t.id
FROM recipes r
CROSS JOIN tags t
WHERE r.slug = 'quinoa-buddha-bowl'
  AND t.name IN ('Recipes', 'Lunch', 'Vegan');

INSERT INTO recipe_tags (recipe_id, tag_id)
SELECT r.id, t.id
FROM recipes r
CROSS JOIN tags t
WHERE r.slug = 'green-smoothie-bowl'
  AND t.name IN ('Recipes', 'Breakfast', 'Vegan'); 