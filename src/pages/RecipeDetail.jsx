import React, { useState, useEffect } from "react";
import { Recipe } from "@/api/entities";
import { ArrowLeft, Clock, Users, ChefHat, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import AdBanner from "../components/AdBanner";

export default function RecipeDetailPage() {
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  useEffect(() => {
    loadRecipe();
  }, []);

  const loadRecipe = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const slug = urlParams.get('slug');
      
      if (!slug) {
        setError('Recipe not found: No slug provided');
        setIsLoading(false);
        return;
      }

      // Get all recipes and filter by slug
      const allRecipes = await Recipe.list();
      const foundRecipe = allRecipes.find(r => r.slug === slug);
      
      if (foundRecipe) {
        setRecipe(foundRecipe);
      } else {
        setError('Recipe not found');
      }
    } catch (err) {
      console.error('Error loading recipe:', err);
      setError('Failed to load recipe');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStep = (index) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedSteps(newCompleted);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-stone-200 rounded-lg mb-8 w-1/3"></div>
            <div className="h-64 bg-stone-200 rounded-2xl mb-8"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 bg-stone-200 rounded"></div>
                ))}
              </div>
              <div className="h-48 bg-stone-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-stone-800 mb-4">Recipe Not Found</h1>
          <p className="text-stone-600 mb-8">The recipe you're looking for doesn't exist.</p>
          <Link to={createPageUrl("Recipes")}>
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Recipes
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-stone-50 to-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to={createPageUrl("Recipes")}>
            <Button variant="ghost" className="mb-6 -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Recipes
            </Button>
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Recipe Info */}
            <div>
              <Badge 
                variant="secondary" 
                className="bg-amber-50 text-amber-700 border-amber-200 mb-4"
              >
                {recipe.recipe_type}
              </Badge>

              <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4 leading-tight">
                {recipe.title}
              </h1>

              <p className="text-lg text-stone-600 mb-6 leading-relaxed">
                {recipe.description}
              </p>

              {/* Recipe Meta */}
              <div className="flex flex-wrap gap-6 text-sm">
                {recipe.prep_time && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-stone-800">Prep Time</p>
                      <p className="text-stone-500">{recipe.prep_time}</p>
                    </div>
                  </div>
                )}
                {recipe.cook_time && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <ChefHat className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-stone-800">Cook Time</p>
                      <p className="text-stone-500">{recipe.cook_time}</p>
                    </div>
                  </div>
                )}
                {recipe.servings && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-stone-800">Servings</p>
                      <p className="text-stone-500">{recipe.servings}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recipe Image */}
            {recipe.featured_image && (
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={recipe.featured_image}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Ingredients */}
            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <Card className="border-0 bg-stone-50/50">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-stone-800 mb-4">Ingredients</h2>
                  <ul className="space-y-3">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-stone-700">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            {recipe.instructions && recipe.instructions.length > 0 && (
              <Card className="border-0 bg-white shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-stone-800 mb-6">Instructions</h2>
                  <div className="space-y-4">
                    {recipe.instructions.map((instruction, index) => (
                      <div key={index} className="flex gap-4">
                        <button
                          onClick={() => toggleStep(index)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                            completedSteps.has(index)
                              ? 'bg-emerald-500 text-white'
                              : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                          }`}
                        >
                          {completedSteps.has(index) ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <span className="text-sm font-medium">{index + 1}</span>
                          )}
                        </button>
                        <p className={`text-stone-700 leading-relaxed pt-1 ${
                          completedSteps.has(index) ? 'line-through opacity-60' : ''
                        }`}>
                          {instruction}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <Card className="border-0 bg-white shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-stone-800 mb-4">Recipe Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((tag, index) => (
                      <Badge 
                        key={index}
                        variant="outline" 
                        className="text-stone-600 border-stone-300"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <AdBanner />
            
            <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-2xl border border-emerald-100">
              <h3 className="font-semibold text-stone-800 mb-3">Love This Recipe?</h3>
              <p className="text-sm text-stone-600 mb-4 leading-relaxed">
                Get more healthy recipes and wellness tips delivered weekly.
              </p>
              <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700">
                Subscribe for More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}