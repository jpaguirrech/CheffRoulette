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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Grid, List, TrendingUp, Target, Clock, Users } from "lucide-react";
import type { Recipe, User } from "@shared/schema";

interface RecipeFilters {
  cuisine?: string;
  difficulty?: string;
  category?: string;
  cookTime?: number;
  dietaryTags?: string[];
}

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<RecipeFilters>({});
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
  });

  const { data: recipes, isLoading: recipesLoading } = useQuery<Recipe[]>({
    queryKey: ["/api/recipes"],
  });

  const { data: challenges, isLoading: challengesLoading } = useQuery({
    queryKey: ["/api/user/1/challenges"],
  });

  const filteredRecipes = recipes?.filter(recipe => {
    if (filters.cuisine && recipe.cuisine !== filters.cuisine) return false;
    if (filters.difficulty && recipe.difficulty !== filters.difficulty) return false;
    if (filters.category && recipe.category !== filters.category) return false;
    if (filters.cookTime && recipe.cookTime > filters.cookTime) return false;
    if (filters.dietaryTags && filters.dietaryTags.length > 0) {
      if (!recipe.dietaryTags?.some(tag => filters.dietaryTags?.includes(tag))) return false;
    }
    return true;
  }) || [];

  const handleUpgradeClick = () => {
    setShowSubscriptionModal(true);
  };

  const recentRecipes = recipes?.slice(0, 3) || [];
  const totalRecipes = recipes?.length || 0;

  if (userLoading || recipesLoading || challengesLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation user={user} onUpgradeClick={handleUpgradeClick} />
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} onUpgradeClick={handleUpgradeClick} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.username || 'Chef'}!
              </h1>
              <p className="text-gray-600 mt-2">
                Ready to discover your next favorite recipe?
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {totalRecipes} recipes saved
              </Badge>
              {user?.streak && user.streak > 0 && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {user.streak} day streak 🔥
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Recipes</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRecipes}</div>
              <p className="text-xs text-muted-foreground">
                +{recentRecipes.length} this week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cooking Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.streak || 0}</div>
              <p className="text-xs text-muted-foreground">
                days in a row
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recipes Cooked</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.recipesCooked || 0}</div>
              <p className="text-xs text-muted-foreground">
                lifetime total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Points</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.points || 0}</div>
              <p className="text-xs text-muted-foreground">
                +{user?.weeklyPoints || 0} this week
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">What's Cooking Today?</h2>
              <p className="text-green-100 mb-6">
                Capture recipes from social media or spin the roulette to discover something new!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-green-600 hover:bg-gray-100"
                >
                  + Capture Recipe
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-green-600"
                >
                  🎰 Spin Roulette
                </Button>
              </div>
            </div>

            {/* Quick Capture */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Capture</h3>
              <RecipeCapture />
            </div>

            {/* Recent Recipes */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Recent Recipes</h3>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
              {recentRecipes.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="text-gray-400 mb-4">
                      <Target className="w-12 h-12 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No recipes yet</h3>
                      <p>Start by capturing your first recipe from social media!</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {recentRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              )}
            </div>

            {/* Roulette Wheel */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Recipe Roulette</h3>
                <p className="text-gray-600">Can't decide? Let us help!</p>
              </div>
              <RouletteWheel filters={filters} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Gamification Panel */}
            <GamificationPanel user={user} />

            {/* Ad Banner (for free users) */}
            {!user?.isPro && (
              <AdBanner onUpgrade={handleUpgradeClick} />
            )}

            {/* Quick Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Filters</CardTitle>
                <CardDescription>
                  Filter recipes by your preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Cuisine</label>
                  <Select onValueChange={(value) => setFilters({...filters, cuisine: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any cuisine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Italian">Italian</SelectItem>
                      <SelectItem value="Korean">Korean</SelectItem>
                      <SelectItem value="American">American</SelectItem>
                      <SelectItem value="Healthy">Healthy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Difficulty</label>
                  <Select onValueChange={(value) => setFilters({...filters, difficulty: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Max Cook Time</label>
                  <Select onValueChange={(value) => setFilters({...filters, cookTime: parseInt(value)})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setFilters({})}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        user={user}
      />
    </div>
  );
}