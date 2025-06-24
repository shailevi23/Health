import { supabaseTestClient } from '../setup';
import type { Recipe } from '@/types';

describe('Recipes API', () => {
  let testRecipe: Recipe;

  beforeAll(async () => {
    // Create a test recipe
    const { data, error } = await supabaseTestClient
      .from('recipes')
      .insert({
        title: 'Test Recipe',
        slug: 'test-recipe',
        description: 'This is a test recipe',
        content: 'Test content for the recipe',
        image_url: '/images/recipes/test.jpg',
        difficulty: 'easy',
        servings: 4,
        ingredients: ['Ingredient 1', 'Ingredient 2'],
        instructions: ['Step 1', 'Step 2'],
        is_featured: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating test recipe:', error);
      throw error;
    }

    testRecipe = data as Recipe;

    // Add tags to the recipe
    const { error: tagError } = await supabaseTestClient
      .from('recipe_tags')
      .insert(
        global.__TEST_DATA__.tagIds.map(tagId => ({
          recipe_id: testRecipe.id,
          tag_id: tagId
        }))
      );

    if (tagError) {
      console.error('Error adding tags to test recipe:', tagError);
      throw tagError;
    }
  });

  afterAll(async () => {
    if (testRecipe?.id) {
      // Delete recipe tags first (foreign key constraint)
      await supabaseTestClient
        .from('recipe_tags')
        .delete()
        .eq('recipe_id', testRecipe.id);

      // Then delete the recipe
      await supabaseTestClient
        .from('recipes')
        .delete()
        .eq('id', testRecipe.id);
    }
  });

  describe('GET /api/recipes', () => {
    it('should return a list of recipes with tags', async () => {
      const { data, error } = await supabaseTestClient
        .from('recipes')
        .select(`
          *,
          tags:recipe_tags(tag:tag_id(*))
        `)
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.title).toBe('Test Recipe');
      expect(data?.tags).toBeDefined();
      expect(data?.tags).toHaveLength(2);
    });

    it('should include all recipe details', async () => {
      const { data, error } = await supabaseTestClient
        .from('recipes')
        .select(`
          *,
          tags:recipe_tags(tag:tag_id(*))
        `)
        .single();

      expect(error).toBeNull();
      expect(data).toMatchObject({
        title: 'Test Recipe',
        slug: 'test-recipe',
        description: 'This is a test recipe',
        difficulty: 'easy',
        servings: 4,
        ingredients: ['Ingredient 1', 'Ingredient 2'],
        instructions: ['Step 1', 'Step 2']
      });
      expect(data?.tags).toHaveLength(2);
    });
  });

  describe('GET /api/recipes/[slug]', () => {
    it('should return a single recipe by slug with full details', async () => {
      const { data, error } = await supabaseTestClient
        .from('recipes')
        .select(`
          *,
          tags:recipe_tags(tag:tag_id(*))
        `)
        .eq('slug', 'test-recipe')
        .single();

      expect(error).toBeNull();
      expect(data).toMatchObject({
        title: 'Test Recipe',
        slug: 'test-recipe',
        description: 'This is a test recipe',
        ingredients: ['Ingredient 1', 'Ingredient 2'],
        instructions: ['Step 1', 'Step 2'],
        difficulty: 'easy',
        servings: 4
      });
      expect(data?.tags).toHaveLength(2);
    });

    it('should return error for non-existent slug', async () => {
      const { data, error } = await supabaseTestClient
        .from('recipes')
        .select()
        .eq('slug', 'non-existent-recipe')
        .single();

      expect(data).toBeNull();
    });
  });

  describe('Recipe data validation', () => {
    it('should enforce required fields', async () => {
      const { error } = await supabaseTestClient
        .from('recipes')
        .insert({
          // Missing required fields
          title: 'Invalid Recipe'
        });

      expect(error).not.toBeNull();
    });

    it('should enforce unique slugs', async () => {
      const { error } = await supabaseTestClient
        .from('recipes')
        .insert({
          title: 'Duplicate Slug Recipe',
          slug: 'test-recipe', // Try to use existing slug
          description: 'This should fail',
          difficulty: 'easy',
          servings: 4,
          ingredients: ['Test'],
          instructions: ['Test']
        });

      expect(error).not.toBeNull();
    });

    it('should validate difficulty enum', async () => {
      const { error } = await supabaseTestClient
        .from('recipes')
        .insert({
          title: 'Invalid Recipe',
          slug: 'invalid-recipe',
          description: 'Test',
          difficulty: 'invalid', // Should be 'easy', 'medium', or 'hard'
          servings: 4,
          ingredients: ['Test'],
          instructions: ['Test']
        });

      expect(error).not.toBeNull();
    });

    it('should validate servings as a positive number', async () => {
      const { error } = await supabaseTestClient
        .from('recipes')
        .insert({
          title: 'Invalid Recipe',
          slug: 'invalid-recipe',
          description: 'Test',
          difficulty: 'easy',
          servings: -1, // Should be positive
          ingredients: ['Test'],
          instructions: ['Test']
        });

      expect(error).not.toBeNull();
    });
  });
}); 