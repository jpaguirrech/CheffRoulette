import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
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
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: randomRecipeResponse, refetch } = useQuery<{success: boolean, data: any}>({
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
      if (result.data?.success && result.data.data) {
        // Simulate spinning animation
        setTimeout(() => {
          setSelectedRecipe(result.data.data);
          setIsSpinning(false);
          toast({
            title: "Recipe Selected!",
            description: `You got: ${result.data.data.title}`,
          });
        }, 2000);
      }
    } catch (error) {
      setIsSpinning(false);
      toast({
        title: "No recipes found",
        description: "Try adjusting your filters or add more recipes to your collection.",
        variant: "destructive",
      });
    }
  };

  const handleViewRecipe = () => {
    if (selectedRecipe) {
      setLocation(`/recipe/${selectedRecipe.id}`);
    }
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
    </Card>
  );
}
