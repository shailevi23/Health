-- Get the author ID
DO $$
DECLARE
  author_id UUID;
BEGIN
  SELECT id INTO author_id FROM authors WHERE name = 'Sarah Johnson' LIMIT 1;

  -- Insert blog posts
  INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, author_id, is_featured)
  VALUES (
    'Getting Started with Mindful Eating',
    'getting-started-with-mindful-eating',
    'Learn how mindful eating can transform your relationship with food and improve your overall well-being.',
    '# Getting Started with Mindful Eating

Mindful eating is a powerful practice that can transform your relationship with food and improve your overall well-being.

## What is Mindful Eating?

Mindful eating involves paying full attention to the experience of eating and drinking, both inside and outside the body. It includes:

- Observing how the food looks, smells, and tastes
- Being aware of physical hunger and satiety cues
- Recognizing emotional triggers for eating
- Understanding how food affects your feelings and body

## Benefits of Mindful Eating

Practicing mindful eating can lead to numerous benefits:

- **Reduced overeating and binge eating**
- **Better digestion**
- **Greater satisfaction from meals**
- **Healthier relationship with food**
- **Weight management**
- **Decreased stress around eating**

## How to Practice Mindful Eating

### 1. Slow Down

Take time to eat your meals. Put your fork down between bites and chew thoroughly. A meal should last at least 20 minutes to allow your body to register fullness.

### 2. Eliminate Distractions

Turn off the TV, put away your phone, and close your laptop. When you eat without distractions, you can give food your full attention.

### 3. Listen to Your Body

Eat when you''re hungry and stop when you''re full. Learn to distinguish between physical hunger and emotional hunger.

### 4. Engage All Senses

Notice the colors, smells, sounds, textures, and flavors of your food. Appreciate the experience of eating.

### 5. Practice Gratitude

Take a moment before eating to appreciate where your food came from and all the people involved in bringing it to your table.

## Getting Started

Begin with one mindful meal per day. Breakfast often works well as it''s typically less rushed than lunch and dinner. As you become more comfortable with the practice, you can extend it to other meals and snacks.

Remember, mindful eating is a practice, not perfection. Be patient with yourself as you develop this new relationship with food.',
    '/images/blog/mindful-eating.jpg',
    author_id,
    true
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, author_id, is_featured)
  VALUES (
    'The Benefits of Intermittent Fasting',
    'benefits-of-intermittent-fasting',
    'Discover how intermittent fasting can improve your metabolism, brain function, and overall health.',
    '# The Benefits of Intermittent Fasting

Intermittent fasting has gained popularity in recent years as more than just a weight loss strategy. This eating pattern, which cycles between periods of eating and fasting, has shown promising results for various aspects of health.

## What is Intermittent Fasting?

Intermittent fasting doesn''t specify which foods to eat, but rather when to eat them. It''s an eating pattern that cycles between periods of fasting and eating. Common intermittent fasting methods include:

- The 16/8 method: Fast for 16 hours and eat during an 8-hour window
- The 5:2 diet: Eat normally for 5 days and restrict calories for 2 non-consecutive days
- Eat-Stop-Eat: 24-hour fasts once or twice a week

## Health Benefits

### Improved Metabolic Health

Intermittent fasting can improve various metabolic markers, including:

- Reduced insulin resistance
- Lower blood sugar levels
- Decreased inflammation
- Improved lipid profiles

### Enhanced Brain Function

Research suggests that intermittent fasting may have neuroprotective effects by:

- Increasing BDNF (Brain-Derived Neurotrophic Factor)
- Reducing oxidative stress in the brain
- Supporting the growth of new neurons

### Weight Management

One of the most common reasons people try intermittent fasting is for weight management. It can help by:

- Reducing calorie intake
- Increasing metabolic rate
- Improving hormone function related to weight control

## Getting Started

If you''re interested in trying intermittent fasting, it''s important to start slowly. Begin with shorter fasting periods and gradually extend them as your body adapts. Always consult with a healthcare provider before starting, especially if you have any underlying health conditions.

Remember that intermittent fasting isn''t suitable for everyone, including pregnant women, those with a history of eating disorders, and people with certain medical conditions.

## Conclusion

Intermittent fasting offers a range of potential health benefits beyond weight loss. By giving your digestive system regular breaks, you may improve metabolic health, brain function, and overall longevity. As with any dietary approach, it''s important to find what works best for your individual needs and lifestyle.',
    '/images/blog/intermittent-fasting.jpg',
    author_id,
    true
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, author_id, is_featured)
  VALUES (
    'How to Create a Sustainable Fitness Routine',
    'create-sustainable-fitness-routine',
    'Learn how to build a fitness routine that you can maintain long-term for better physical and mental health.',
    '# How to Create a Sustainable Fitness Routine

Creating a fitness routine that you can maintain long-term is essential for achieving lasting health benefits. Many people start exercise programs with enthusiasm but struggle to maintain them over time. Here''s how to build a sustainable fitness routine that works for you.

## Find Activities You Enjoy

The most sustainable exercise is the one you actually enjoy doing. Consider:

- Group classes if you thrive on social interaction
- Solo activities like running or swimming if you prefer solitude
- Team sports if you enjoy competition
- Dance, hiking, or cycling if traditional gym workouts don''t appeal to you

## Start Small and Progress Gradually

One of the biggest mistakes people make is trying to do too much too soon. Instead:

- Begin with just 10-15 minutes of activity per day
- Gradually increase duration and intensity over weeks and months
- Celebrate small victories along the way

## Create a Realistic Schedule

Your fitness routine should fit into your life, not the other way around:

- Be honest about how much time you can realistically commit
- Schedule workouts like important appointments
- Have a backup plan for busy days (like a 10-minute home workout)

## Mix It Up

Variety is key to preventing both physical plateaus and mental boredom:

- Combine strength training, cardio, and flexibility work
- Try new activities periodically
- Adjust your routine with the seasons

## Listen to Your Body

Sustainable fitness means respecting your body''s needs:

- Take rest days when needed
- Modify exercises to accommodate limitations
- Distinguish between challenging discomfort and pain

## Track Progress Beyond the Scale

Sustainable motivation comes from recognizing various forms of progress:

- Improved energy levels
- Better sleep quality
- Increased strength or endurance
- Enhanced mood and stress management
- Greater confidence in daily activities

## Build a Support System

Social support can significantly improve adherence:

- Find a workout buddy
- Join fitness communities (in-person or online)
- Share your goals with friends and family

## Conclusion

A sustainable fitness routine isn''t about perfection—it''s about consistency and enjoyment. By finding activities you love, starting small, and being flexible, you can create a fitness habit that enhances your life for years to come. Remember that the best fitness plan is one that you can maintain, even if it''s simpler than what you initially envisioned.',
    '/images/blog/fitness-routine.jpg',
    author_id,
    true
  ) ON CONFLICT (slug) DO NOTHING;

  -- Insert recipes
  INSERT INTO recipes (title, slug, description, content, cover_image, prep_time, cook_time, servings, difficulty, ingredients, instructions, is_featured)
  VALUES (
    'Mediterranean Chickpea Salad',
    'mediterranean-chickpea-salad',
    'A refreshing and protein-rich salad perfect for lunch or as a side dish.',
    '# Mediterranean Chickpea Salad

This vibrant Mediterranean chickpea salad combines protein-rich legumes with fresh vegetables and a zesty lemon dressing. It''s perfect for meal prep as it keeps well in the refrigerator and actually tastes better after the flavors have had time to meld.

## Why You''ll Love This Recipe

- **Nutritionally balanced**: Provides protein, fiber, healthy fats, and plenty of vitamins
- **Make-ahead friendly**: Tastes even better the next day
- **No cooking required**: Perfect for hot summer days
- **Customizable**: Easy to adapt based on what you have available

## Ingredients

For the salad:
- 2 cans (15 oz each) chickpeas, drained and rinsed
- 1 English cucumber, diced
- 1 pint cherry tomatoes, halved
- 1 red bell pepper, diced
- 1/2 red onion, finely diced
- 1/2 cup kalamata olives, pitted and halved
- 1/2 cup crumbled feta cheese (omit for vegan version)
- 1/4 cup fresh parsley, chopped
- 2 tablespoons fresh mint, chopped

For the dressing:
- 1/4 cup extra virgin olive oil
- 2 tablespoons fresh lemon juice
- 1 tablespoon red wine vinegar
- 1 garlic clove, minced
- 1 teaspoon dried oregano
- 1/2 teaspoon salt
- 1/4 teaspoon freshly ground black pepper

## Instructions

1. In a large bowl, combine all salad ingredients: chickpeas, cucumber, tomatoes, bell pepper, red onion, olives, feta cheese, parsley, and mint.

2. In a small bowl or jar, whisk together all dressing ingredients: olive oil, lemon juice, red wine vinegar, garlic, oregano, salt, and pepper.

3. Pour the dressing over the salad and toss gently to combine.

4. For best flavor, refrigerate for at least 30 minutes before serving to allow the flavors to meld.

5. Serve chilled or at room temperature. The salad will keep well in the refrigerator for up to 3 days.

## Variations

- Add diced avocado just before serving for extra creaminess
- Include cooked quinoa or farro for a more substantial meal
- Substitute white beans for chickpeas
- Add artichoke hearts for extra Mediterranean flavor
- Include roasted red peppers for a smoky element

Enjoy this nutritious salad as a light lunch, side dish, or even stuffed into pita pockets for a satisfying sandwich!',
    '/images/recipes/chickpea-salad.jpg',
    '15 minutes',
    '0 minutes',
    4,
    'easy',
    ARRAY[
      '2 cans (15 oz each) chickpeas, drained and rinsed',
      '1 English cucumber, diced',
      '1 pint cherry tomatoes, halved',
      '1 red bell pepper, diced',
      '1/2 red onion, finely diced',
      '1/2 cup kalamata olives, pitted and halved',
      '1/2 cup crumbled feta cheese',
      '1/4 cup fresh parsley, chopped',
      '2 tablespoons fresh mint, chopped',
      '1/4 cup extra virgin olive oil',
      '2 tablespoons fresh lemon juice',
      '1 tablespoon red wine vinegar',
      '1 garlic clove, minced',
      '1 teaspoon dried oregano',
      '1/2 teaspoon salt',
      '1/4 teaspoon freshly ground black pepper'
    ],
    ARRAY[
      'In a large bowl, combine chickpeas, cucumber, tomatoes, bell pepper, red onion, olives, feta cheese, parsley, and mint.',
      'In a small bowl or jar, whisk together olive oil, lemon juice, red wine vinegar, garlic, oregano, salt, and pepper.',
      'Pour the dressing over the salad and toss gently to combine.',
      'For best flavor, refrigerate for at least 30 minutes before serving to allow the flavors to meld.',
      'Serve chilled or at room temperature. The salad will keep well in the refrigerator for up to 3 days.'
    ],
    true
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO recipes (title, slug, description, content, cover_image, prep_time, cook_time, servings, difficulty, ingredients, instructions, is_featured)
  VALUES (
    'Golden Turmeric Latte',
    'golden-turmeric-latte',
    'A warming anti-inflammatory beverage perfect for morning or evening.',
    '# Golden Turmeric Latte

This soothing golden turmeric latte combines the anti-inflammatory properties of turmeric with warming spices for a delicious and healthful beverage. Also known as "golden milk," this drink has roots in Ayurvedic tradition and offers numerous potential health benefits.

## Health Benefits

Turmeric contains curcumin, a compound with powerful anti-inflammatory and antioxidant properties. The black pepper in this recipe enhances curcumin absorption, while the healthy fats in the milk help make the curcumin more bioavailable.

## Ingredients

- 2 cups unsweetened plant milk (almond, coconut, or oat work well)
- 1 tablespoon fresh turmeric, grated (or 1 teaspoon dried turmeric powder)
- 1/2 tablespoon fresh ginger, grated (or 1/2 teaspoon dried ginger)
- 1 cinnamon stick (or 1/4 teaspoon ground cinnamon)
- 2-3 black peppercorns (or a pinch of ground black pepper)
- 1 tablespoon coconut oil or MCT oil (optional)
- 1-2 teaspoons maple syrup or honey, to taste
- 1/4 teaspoon vanilla extract

## Instructions

1. In a small saucepan, combine the plant milk, turmeric, ginger, cinnamon, and black peppercorns.

2. Heat over medium-low heat, whisking occasionally. Do not let it boil; gentle heating helps infuse the flavors.

3. When the mixture is hot (about 3-5 minutes), add the coconut oil if using, and whisk until melted and incorporated.

4. Remove from heat and strain through a fine-mesh sieve into mugs.

5. Stir in your sweetener of choice and vanilla extract.

6. For a frothy texture, use a handheld frother or blend the mixture in a blender for a few seconds.

7. Serve hot, with a sprinkle of cinnamon on top if desired.

## Tips

- **Make a paste**: For convenience, you can make a turmeric paste by combining turmeric, ginger, cinnamon, and black pepper with a little water. Store in the refrigerator and add a spoonful to warm milk whenever you want a quick golden latte.

- **Best time to enjoy**: Many people find this drink particularly beneficial in the evening as part of a relaxing bedtime routine, but it can be enjoyed any time of day.

- **Consistency**: If using fresh turmeric, be aware that it can stain surfaces and skin. Consider wearing gloves when handling it.

Enjoy this comforting beverage as a caffeine-free alternative to coffee or tea, especially during cold weather or when you''re feeling under the weather.',
    '/images/recipes/turmeric-latte.jpg',
    '2 minutes',
    '5 minutes',
    2,
    'easy',
    ARRAY[
      '2 cups unsweetened plant milk (almond, coconut, or oat)',
      '1 tablespoon fresh turmeric, grated (or 1 teaspoon dried turmeric powder)',
      '1/2 tablespoon fresh ginger, grated (or 1/2 teaspoon dried ginger)',
      '1 cinnamon stick (or 1/4 teaspoon ground cinnamon)',
      '2-3 black peppercorns (or a pinch of ground black pepper)',
      '1 tablespoon coconut oil or MCT oil (optional)',
      '1-2 teaspoons maple syrup or honey, to taste',
      '1/4 teaspoon vanilla extract'
    ],
    ARRAY[
      'In a small saucepan, combine the plant milk, turmeric, ginger, cinnamon, and black peppercorns.',
      'Heat over medium-low heat, whisking occasionally. Do not let it boil.',
      'When the mixture is hot (about 3-5 minutes), add the coconut oil if using, and whisk until melted and incorporated.',
      'Remove from heat and strain through a fine-mesh sieve into mugs.',
      'Stir in your sweetener of choice and vanilla extract.',
      'For a frothy texture, use a handheld frother or blend the mixture in a blender for a few seconds.',
      'Serve hot, with a sprinkle of cinnamon on top if desired.'
    ],
    false
  ) ON CONFLICT (slug) DO NOTHING;

  -- Associate blog posts with tags
  WITH blog_post_tag_data AS (
    SELECT 
      bp.id AS blog_post_id,
      t.id AS tag_id
    FROM blog_posts bp, tags t
    WHERE bp.slug = 'getting-started-with-mindful-eating'
    AND t.name IN ('Mindfulness', 'Nutrition', 'Wellness')
  )
  INSERT INTO blog_post_tags (blog_post_id, tag_id)
  SELECT blog_post_id, tag_id FROM blog_post_tag_data
  ON CONFLICT DO NOTHING;

  WITH blog_post_tag_data AS (
    SELECT 
      bp.id AS blog_post_id,
      t.id AS tag_id
    FROM blog_posts bp, tags t
    WHERE bp.slug = 'benefits-of-intermittent-fasting'
    AND t.name IN ('Intermittent Fasting', 'Wellness', 'Nutrition')
  )
  INSERT INTO blog_post_tags (blog_post_id, tag_id)
  SELECT blog_post_id, tag_id FROM blog_post_tag_data
  ON CONFLICT DO NOTHING;

  WITH blog_post_tag_data AS (
    SELECT 
      bp.id AS blog_post_id,
      t.id AS tag_id
    FROM blog_posts bp, tags t
    WHERE bp.slug = 'create-sustainable-fitness-routine'
    AND t.name IN ('Fitness', 'Wellness')
  )
  INSERT INTO blog_post_tags (blog_post_id, tag_id)
  SELECT blog_post_id, tag_id FROM blog_post_tag_data
  ON CONFLICT DO NOTHING;

  -- Associate recipes with tags
  WITH recipe_tag_data AS (
    SELECT 
      r.id AS recipe_id,
      t.id AS tag_id
    FROM recipes r, tags t
    WHERE r.slug = 'mediterranean-chickpea-salad'
    AND t.name IN ('Mediterranean', 'Recipes', 'Nutrition')
  )
  INSERT INTO recipe_tags (recipe_id, tag_id)
  SELECT recipe_id, tag_id FROM recipe_tag_data
  ON CONFLICT DO NOTHING;

  WITH recipe_tag_data AS (
    SELECT 
      r.id AS recipe_id,
      t.id AS tag_id
    FROM recipes r, tags t
    WHERE r.slug = 'golden-turmeric-latte'
    AND t.name IN ('Anti-Inflammatory', 'Wellness')
  )
  INSERT INTO recipe_tags (recipe_id, tag_id)
  SELECT recipe_id, tag_id FROM recipe_tag_data
  ON CONFLICT DO NOTHING;
END $$; 