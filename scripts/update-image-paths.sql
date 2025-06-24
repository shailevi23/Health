-- Update blog posts with correct image paths
UPDATE blog_posts
SET cover_image = '/images/blog/mindful-eating.jpg'
WHERE slug = 'mindful-eating';

UPDATE blog_posts
SET cover_image = '/images/blog/plant-based-nutrition.jpg'
WHERE slug = 'plant-based-nutrition';

UPDATE blog_posts
SET cover_image = '/images/blog/intermittent-fasting.jpg'
WHERE slug = 'intermittent-fasting';

UPDATE blog_posts
SET cover_image = '/images/blog/fitness-routine.jpg'
WHERE slug = 'fitness-routine';

-- Update recipes with correct image paths
UPDATE recipes
SET cover_image = '/images/recipes/smoothie-bowl.jpg'
WHERE slug = 'smoothie-bowl';

UPDATE recipes
SET cover_image = '/images/recipes/buddha-bowl.jpg'
WHERE slug = 'buddha-bowl';

UPDATE recipes
SET cover_image = '/images/recipes/chickpea-salad.jpg'
WHERE slug = 'chickpea-salad';

UPDATE recipes
SET cover_image = '/images/recipes/turmeric-latte.jpg'
WHERE slug = 'turmeric-latte';

-- Verify updates
SELECT slug, title, cover_image FROM blog_posts;
SELECT slug, title, cover_image FROM recipes; 