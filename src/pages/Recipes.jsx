import React, { useState, useEffect } from "react";
import { Recipe } from "@/api/entities";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RecipeCard from "../components/RecipeCard";

const recipeTypes = ["all", "breakfast", "lunch", "dinner", "snack", "dessert", "drink"];

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    loadRecipes();
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [recipes, searchTerm, selectedType]);

  const loadRecipes = async () => {
    try {
      const data = await Recipe.list('-created_date');
      setRecipes(data);
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterRecipes = () => {
    let filtered = recipes;

    if (selectedType !== "all") {
      filtered = filtered.filter(recipe => recipe.recipe_type === selectedType);
    }

    if (searchTerm) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (recipe.tags && recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    setFilteredRecipes(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-stone-50 py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
            Healthy Recipes
          </h1>
          <p className="text-stone-600 max-w-2xl mx-auto text-lg">
            Nourishing, delicious recipes that make healthy eating enjoyable and sustainable.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm border-stone-200 rounded-xl"
            />
          </div>

          {/* Type Filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {recipeTypes.map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type)}
                className={`rounded-full text-xs ${
                  selectedType === type
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "border-stone-300 text-stone-600 hover:bg-stone-50"
                }`}
              >
                {type === "all" ? "All Recipes" : type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        {!isLoading && (
          <div className="mb-6 text-center">
            <p className="text-stone-500 text-sm">
              {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'} found
            </p>
          </div>
        )}

        {/* Recipes Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-stone-100 rounded-2xl h-80 animate-pulse"></div>
            ))}
          </div>
        ) : filteredRecipes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-stone-400" />
            </div>
            <h3 className="text-lg font-semibold text-stone-600 mb-2">No recipes found</h3>
            <p className="text-stone-500 mb-4">
              Try adjusting your search or filter criteria.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedType("all");
              }}
              className="rounded-xl"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}