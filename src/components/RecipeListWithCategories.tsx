'use client';

import React, { useState } from 'react';
import RecipeCard from './RecipeCard';
import AdBanner from './AdBanner';
import type { Recipe } from '@/types';

interface RecipeListWithCategoriesProps {
  recipes: Recipe[];
  featuredCategories: string[];
}

export default function RecipeListWithCategories({ recipes, featuredCategories }: RecipeListWithCategoriesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract tags from the Supabase nested structure if needed
  const extractTags = (recipe: Recipe) => {
    if (!recipe.tags) return [];
    
    if (Array.isArray(recipe.tags)) {
      // If tags is an array of strings
      if (recipe.tags.length === 0) return [];
      
      if (typeof recipe.tags[0] === 'string') {
        return recipe.tags as string[];
      }
      
      // If tags is an array of objects with a tag property
      return recipe.tags.map((tagObj: any) => {
        if (typeof tagObj === 'string') return tagObj;
        if (tagObj && tagObj.tag && tagObj.tag.name) return tagObj.tag.name;
        return '';
      }).filter(Boolean);
    }
    
    return [];
  };

  // Filter recipes based on selected category
  const filteredRecipes = selectedCategory 
    ? recipes.filter(recipe => {
        const recipeTags = extractTags(recipe);
        return recipeTags.includes(selectedCategory);
      })
    : recipes;

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null); // Deselect if already selected
    } else {
      setSelectedCategory(category);
    }
  };

  return (
    <>
      {/* Featured Categories */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4">
            {featuredCategories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={`px-6 py-3 rounded-full font-medium shadow-sm hover:shadow-md transition-all ${
                  selectedCategory === category
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Recipe Introduction */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {selectedCategory ? `${selectedCategory} Recipes` : 'Cook Healthy, Eat Happy'}
            </h2>
            <p className="text-lg text-gray-600">
              {selectedCategory 
                ? `Explore our delicious ${selectedCategory.toLowerCase()} recipes designed for optimal health and flavor.`
                : 'Our recipes are designed to be nutritious, delicious, and easy to prepare. Whether you\'re looking for quick weeknight dinners or impressive dishes for entertaining, we\'ve got you covered with options for every dietary preference.'}
            </p>
            {selectedCategory && (
              <button 
                onClick={() => setSelectedCategory(null)}
                className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
              >
                View all recipes
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Recipe List */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRecipes.map((recipe, index) => (
                <React.Fragment key={recipe.id}>
                  {index > 0 && index % 6 === 0 && (
                    <div className="col-span-full">
                      <AdBanner slot="content" />
                    </div>
                  )}
                  <RecipeCard recipe={recipe} priority={index < 3} />
                </React.Fragment>
              ))}
            </div>

            {filteredRecipes.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-700">No recipes found in this category</h3>
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  View all recipes
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
} 