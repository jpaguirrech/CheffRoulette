import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Clock, Users, ChefHat, Star, X } from "lucide-react";
import type { Recipe } from "@shared/schema";

interface RouletteWheelProps {
  filters?: {
    cuisine?: string;
    difficulty?: string;
    category?: string;
    cookTime?: number;
    dietaryTags?: string[];
  };
}

export default function RouletteWheel({ filters }: RouletteWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: randomRecipe, refetch } = useQuery<Recipe>({
    queryKey: ["/api/recipes/random", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.cuisine) params.append("cuisineType", filters.cuisine);
      if (filters?.difficulty) params.append("difficultyLevel", filters.difficulty);
      if (filters?.category) params.append("mealType", filters.category);
      if (filters?.cookTime) params.append("maxCookTime", filters.cookTime.toString());
      
      const response = await fetch(`/api/recipes/random?${params}`);
      if (!response.ok) {
        throw new Error("No recipes found");
      }
      return response.json();
    },
    enabled: false, // Don't fetch automatically
  });

  const handleSpin = async () => {
    setIsSpinning(true);
    setSelectedRecipe(null);
    
    try {
      const result = await refetch();
      if (result.data) {
        // Simulate spinning animation
        setTimeout(() => {
          setSelectedRecipe(result.data);
          setIsSpinning(false);
          setShowRecipeModal(true);
          toast({
            title: "Recipe Selected!",
            description: `You got: ${result.data.title}`,
          });
        }, 2000);
      }
    } catch (error) {
      setIsSpinning(false);
      console.error('Roulette error:', error);
      toast({
        title: "No recipes found",
        description: "Try adjusting your filters or add more recipes to your collection.",
        variant: "destructive",
      });
    }
  };

  const handleViewRecipe = () => {
    if (selectedRecipe) {
      setShowRecipeModal(false);
      setLocation(`/recipe/${selectedRecipe.id}`);
    }
  };

  const handleCloseModal = () => {
    setShowRecipeModal(false);
  };

  const handleSpinAgain = () => {
    setShowRecipeModal(false);
    setSelectedRecipe(null);
    handleSpin();
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-display font-bold text-gray-900">
          Recipe Roulette
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <div className={`w-48 h-48 mx-auto chef-gradient rounded-full flex items-center justify-center shadow-lg transition-transform duration-2000 ${
              isSpinning ? "roulette-spin" : ""
            }`}>
              <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center relative">
                {selectedRecipe ? (
                  <div className="text-center">
                    <div className="text-2xl mb-2">🍽️</div>
                    <div className="text-xs font-medium text-gray-600 px-2">
                      {selectedRecipe.title.substring(0, 20)}
                      {selectedRecipe.title.length > 20 ? "..." : ""}
                    </div>
                  </div>
                ) : (
                  <svg className="w-12 h-12 text-[hsl(14,100%,60%)]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                  </svg>
                )}
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                  <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-[hsl(14,100%,60%)]" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <Button 
              onClick={handleSpin}
              disabled={isSpinning}
              className="bg-[hsl(14,100%,60%)] hover:bg-[hsl(14,100%,55%)]"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z"/>
              </svg>
              {isSpinning ? "Spinning..." : "Spin the Wheel!"}
            </Button>
            
            {selectedRecipe && (
              <Button 
                onClick={handleViewRecipe}
                variant="outline"
                className="block w-full"
              >
                View Recipe
              </Button>
            )}
          </div>
        </div>
      </CardContent>

      {/* Recipe Preview Modal */}
      <Dialog open={showRecipeModal} onOpenChange={setShowRecipeModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <div className="text-3xl">🎉</div>
                Your Recipe is Ready!
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseModal}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DialogDescription className="text-gray-600">
              Here's what the roulette selected for you today
            </DialogDescription>
          </DialogHeader>

          {selectedRecipe && (
            <div className="space-y-6">
              {/* Recipe Header */}
              <div className="text-center space-y-4">
                <div className="relative">
                  <img
                    src={selectedRecipe.imageUrl || "/placeholder-recipe.jpg"}
                    alt={selectedRecipe.title}
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 text-gray-700">
                      {(selectedRecipe as any).platform?.toUpperCase() || 'RECIPE'}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedRecipe.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {selectedRecipe.description}
                  </p>
                </div>
              </div>

              {/* Recipe Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 mx-auto mb-1 text-[hsl(142,71%,45%)]" />
                  <div className="text-sm font-medium text-gray-700">
                    {(selectedRecipe as any).totalTime || ((selectedRecipe as any).prepTime || 0) + (selectedRecipe.cookTime || 0)} min
                  </div>
                  <div className="text-xs text-gray-500">Total Time</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Users className="w-5 h-5 mx-auto mb-1 text-[hsl(142,71%,45%)]" />
                  <div className="text-sm font-medium text-gray-700">
                    {selectedRecipe.servings}
                  </div>
                  <div className="text-xs text-gray-500">Servings</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <ChefHat className="w-5 h-5 mx-auto mb-1 text-[hsl(142,71%,45%)]" />
                  <div className="text-sm font-medium text-gray-700 capitalize">
                    {selectedRecipe.difficulty}
                  </div>
                  <div className="text-xs text-gray-500">Difficulty</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Star className="w-5 h-5 mx-auto mb-1 text-[hsl(142,71%,45%)]" />
                  <div className="text-sm font-medium text-gray-700">
                    {(selectedRecipe as any).cuisine || 'International'}
                  </div>
                  <div className="text-xs text-gray-500">Cuisine</div>
                </div>
              </div>

              {/* Quick Preview */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Quick Preview</h4>
                  <div className="flex flex-wrap gap-2">
                    {((selectedRecipe as any).dietaryTags || [])?.slice(0, 4).map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-1">
                    Key Ingredients ({selectedRecipe.ingredients?.length || 0})
                  </h5>
                  <p className="text-sm text-gray-600">
                    {selectedRecipe.ingredients?.slice(0, 3).map(ing => 
                      typeof ing === 'string' ? ing : (ing as any).name
                    ).join(", ")}
                    {selectedRecipe.ingredients?.length > 3 && "..."}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-6">
            <Button 
              variant="outline" 
              onClick={handleSpinAgain}
              className="w-full sm:w-auto"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z"/>
              </svg>
              Spin Again
            </Button>
            <Button 
              onClick={handleViewRecipe}
              className="bg-[hsl(142,71%,45%)] hover:bg-[hsl(142,71%,40%)] w-full sm:w-auto"
            >
              Let's Cook This! →
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
