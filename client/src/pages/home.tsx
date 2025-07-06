import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import RouletteWheel from "@/components/roulette-wheel";
import RecipeCard from "@/components/recipe-card";
import RecipeCapture from "@/components/recipe-capture";
import GamificationPanel from "@/components/gamification-panel";
import AdBanner from "@/components/ad-banner";
import SubscriptionModal from "@/components/subscription-modal";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Grid, List } from "lucide-react";
import type { Recipe } from "@shared/schema";

interface RecipeFilters {
  cuisine?: string;
  difficulty?: string;
  category?: string;
  cookTime?: number;
  dietaryTags?: string[];
}

export default function Home() {
  const [filters, setFilters] = useState<RecipeFilters>({});
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedDietaryTags, setSelectedDietaryTags] = useState<string[]>([]);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const { data: recipes, isLoading } = useQuery<Recipe[]>({
    queryKey: ["/api/recipes", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.cuisine) params.append("cuisine", filters.cuisine);
      if (filters.difficulty) params.append("difficulty", filters.difficulty);
      if (filters.category) params.append("category", filters.category);
      if (filters.cookTime) params.append("cookTime", filters.cookTime.toString());
      if (selectedDietaryTags.length > 0) {
        selectedDietaryTags.forEach(tag => params.append("dietaryTags", tag));
      }
      
      const response = await fetch(`/api/recipes?${params}`);
      return response.json();
    },
  });

  const { data: user } = useQuery({
    queryKey: ["/api/user/1"],
  });

  const handleFilterChange = (key: keyof RecipeFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === "any" ? undefined : value
    }));
  };

  const handleDietaryTagToggle = (tag: string) => {
    setSelectedDietaryTags(prev => {
      const updated = prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag];
      
      setFilters(prevFilters => ({
        ...prevFilters,
        dietaryTags: updated.length > 0 ? updated : undefined
      }));
      
      return updated;
    });
  };

  const dietaryTags = ["Vegetarian", "Vegan", "Keto", "Gluten-Free"];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation 
        user={user} 
        onUpgradeClick={() => setShowSubscriptionModal(true)} 
      />
      
      {/* Hero Section */}
      <section className="chef-accent-gradient py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              Never Wonder "What's for Dinner?" Again
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Capture recipes from TikTok, Instagram, and YouTube. Let AI organize them. Spin the roulette when you're ready to cook.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-[hsl(14,100%,60%)] hover:bg-[hsl(14,100%,55%)]"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Capture Recipe
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-[hsl(174,60%,51%)] text-[hsl(174,60%,51%)] hover:bg-[hsl(174,60%,51%)] hover:text-white"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z"/>
                </svg>
                Spin Roulette
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Capture */}
      <RecipeCapture />

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Roulette & Filters */}
            <div className="lg:col-span-1">
              <RouletteWheel filters={filters} />
              
              {/* Filters */}
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <h3 className="text-xl font-display font-bold text-gray-900 mb-4">Filters</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine Type</label>
                    <Select onValueChange={(value) => handleFilterChange("cuisine", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any Cuisine" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Cuisine</SelectItem>
                        <SelectItem value="Italian">Italian</SelectItem>
                        <SelectItem value="Mexican">Mexican</SelectItem>
                        <SelectItem value="Korean">Korean</SelectItem>
                        <SelectItem value="American">American</SelectItem>
                        <SelectItem value="Healthy">Healthy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cook Time</label>
                    <Select onValueChange={(value) => handleFilterChange("cookTime", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any Time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Time</SelectItem>
                        <SelectItem value="15">Under 15 min</SelectItem>
                        <SelectItem value="30">15-30 min</SelectItem>
                        <SelectItem value="60">30-60 min</SelectItem>
                        <SelectItem value="999">1+ hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Needs</label>
                    <div className="flex flex-wrap gap-2">
                      {dietaryTags.map(tag => (
                        <Badge 
                          key={tag}
                          variant={selectedDietaryTags.includes(tag) ? "default" : "outline"}
                          className={`cursor-pointer ${
                            selectedDietaryTags.includes(tag) 
                              ? "bg-[hsl(52,100%,70%)] text-black hover:bg-[hsl(52,100%,65%)]" 
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() => handleDietaryTagToggle(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <GamificationPanel user={user} />
              
              {/* Pro Upgrade Prompt */}
              <div className="chef-gradient rounded-2xl p-6 text-white">
                <div className="flex items-center mb-3">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <h3 className="text-lg font-display font-bold">Upgrade to Pro</h3>
                </div>
                <ul className="space-y-2 text-sm mb-4">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Pantry mode & nutrition data
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Offline access & no ads
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Advanced filters & recommendations
                  </li>
                </ul>
                <Button 
                  className="bg-white text-[hsl(14,100%,60%)] hover:bg-gray-100 w-full"
                  onClick={() => setShowSubscriptionModal(true)}
                >
                  Start Free Trial - $4.99/month
                </Button>
              </div>
            </div>

            {/* Right Column: Recipe Feed */}
            <div className="lg:col-span-2">
              {/* Feed Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-display font-bold text-gray-900">Your Recipe Collection</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Recently Added</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="quick">Quick & Easy</SelectItem>
                      <SelectItem value="favorites">Favorites</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Recipe Cards */}
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[hsl(14,100%,60%)]" />
                </div>
              ) : (
                <div className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"} gap-6`}>
                  {recipes?.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              )}

              {/* Ad Banner for Free Tier */}
              {user && !user.isPro && (
                <AdBanner className="mt-8" />
              )}

              {/* Load More */}
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Load More Recipes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z"/>
                </svg>
                <h3 className="text-xl font-display font-bold">Chef Roulette</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Turn your social media food discoveries into organized, cookable recipes with AI-powered capture and smart discovery.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Recipe Capture</li>
                <li>AI Recipe Parsing</li>
                <li>Roulette Discovery</li>
                <li>Smart Tagging</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Challenges</li>
                <li>Leaderboards</li>
                <li>Recipe Sharing</li>
                <li>Cooking Tips</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Chef Roulette. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <SubscriptionModal 
        isOpen={showSubscriptionModal} 
        onClose={() => setShowSubscriptionModal(false)}
        user={user}
      />
    </div>
  );
}
