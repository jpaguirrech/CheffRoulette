import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Clock, Users, ChefHat, Star, Coffee, Soup, UtensilsCrossed, IceCream } from "lucide-react";
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

const MEAL_TYPE_FILTERS = [
  { value: 'breakfast', label: 'Breakfast', icon: Coffee, color: 'bg-amber-500', emoji: '🌅' },
  { value: 'lunch', label: 'Lunch', icon: Soup, color: 'bg-blue-500', emoji: '☀️' },
  { value: 'dinner', label: 'Dinner', icon: UtensilsCrossed, color: 'bg-purple-500', emoji: '🌙' },
  { value: 'dessert', label: 'Desserts', icon: IceCream, color: 'bg-pink-500', emoji: '🍰' },
];

export default function RouletteWheel({ filters: externalFilters }: RouletteWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Merge external filters with meal type filter
  const filters = {
    ...externalFilters,
    category: selectedMealType || externalFilters?.category,
  };

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
            title: "¡Receta Seleccionada!",
            description: `Has obtenido: ${result.data.title}`,
          });
        }, 3000); // Increased to 3 seconds for better animation
      }
    } catch (error) {
      setIsSpinning(false);
      console.error('Roulette error:', error);
      toast({
        title: "No se encontraron recetas",
        description: "Intenta ajustar tus filtros o agregar más recetas a tu colección.",
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
    <Card className="mb-6 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-display font-bold text-gray-900 text-center flex items-center justify-center gap-2">
          <span className="text-3xl">🎰</span>
          Recipe Roulette
          <span className="text-3xl">🎰</span>
        </CardTitle>
        <p className="text-center text-sm text-gray-600 mt-2">
          ¡Gira la ruleta y descubre tu próxima aventura culinaria!
        </p>
      </CardHeader>
      <CardContent>
        {/* Meal Type Filters */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">
            Selecciona el tipo de comida:
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {MEAL_TYPE_FILTERS.map((mealType) => {
              const Icon = mealType.icon;
              const isSelected = selectedMealType === mealType.value;
              return (
                <button
                  key={mealType.value}
                  data-testid={`filter-${mealType.value}`}
                  onClick={() => setSelectedMealType(isSelected ? null : mealType.value)}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all duration-300
                    ${isSelected 
                      ? `${mealType.color} border-transparent text-white shadow-lg scale-105 transform` 
                      : 'bg-white border-gray-200 text-gray-700 hover:border-green-300 hover:shadow-md'
                    }
                  `}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl">{mealType.emoji}</span>
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                    <span className="text-xs font-semibold">{mealType.label}</span>
                  </div>
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {selectedMealType && (
            <div className="mt-3 text-center">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Filtrando por: {MEAL_TYPE_FILTERS.find(m => m.value === selectedMealType)?.label}
              </Badge>
            </div>
          )}
        </div>

        {/* Roulette Wheel */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            {/* Decorative outer ring */}
            <div className="absolute inset-0 -m-4">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 opacity-20 blur-xl animate-pulse"></div>
            </div>
            
            {/* Main wheel container */}
            <div className="relative z-10">
              <div className={`
                w-64 h-64 mx-auto rounded-full flex items-center justify-center
                transition-all duration-3000 ease-out relative
                ${isSpinning ? "roulette-spin-enhanced" : ""}
              `}>
                {/* Colorful wheel segments */}
                <div className="absolute inset-0 rounded-full overflow-hidden shadow-2xl">
                  <div className="w-full h-full relative roulette-wheel-segments">
                    {/* Segment 1 - Breakfast */}
                    <div className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left bg-gradient-to-br from-amber-400 to-amber-600 roulette-segment" style={{ transform: 'rotate(0deg)' }}></div>
                    {/* Segment 2 - Lunch */}
                    <div className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left bg-gradient-to-br from-blue-400 to-blue-600 roulette-segment" style={{ transform: 'rotate(90deg)' }}></div>
                    {/* Segment 3 - Dinner */}
                    <div className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left bg-gradient-to-br from-purple-400 to-purple-600 roulette-segment" style={{ transform: 'rotate(180deg)' }}></div>
                    {/* Segment 4 - Dessert */}
                    <div className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left bg-gradient-to-br from-pink-400 to-pink-600 roulette-segment" style={{ transform: 'rotate(270deg)' }}></div>
                  </div>
                </div>

                {/* Center circle with content */}
                <div className="absolute inset-8 bg-white rounded-full flex items-center justify-center shadow-inner z-10">
                  {selectedRecipe ? (
                    <div className="text-center p-4 animate-bounce-in">
                      <div className="text-4xl mb-2">🎉</div>
                      <div className="text-sm font-bold text-gray-800 px-2 leading-tight">
                        {selectedRecipe.title.substring(0, 30)}
                        {selectedRecipe.title.length > 30 ? "..." : ""}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ChefHat className={`w-16 h-16 mx-auto text-green-600 ${isSpinning ? 'animate-spin' : ''}`} />
                      <div className="text-xs font-semibold text-gray-600 mt-2">
                        {isSpinning ? "Girando..." : "¡Gira!"}
                      </div>
                    </div>
                  )}
                </div>

                {/* Pointer/Arrow at top */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="relative">
                    <div className="w-0 h-0 border-l-[16px] border-r-[16px] border-t-[24px] border-l-transparent border-r-transparent border-t-red-500 drop-shadow-lg"></div>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Decorative dots around wheel */}
                <div className="absolute inset-0 roulette-dots">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: `rotate(${i * 30}deg) translateY(-140px)`,
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 space-y-3">
            <Button 
              data-testid="button-spin-wheel"
              onClick={handleSpin}
              disabled={isSpinning}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-6 px-8 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z"/>
              </svg>
              {isSpinning ? "¡Girando la Ruleta...!" : "¡Girar la Ruleta!"}
            </Button>
            
            {selectedRecipe && !isSpinning && (
              <Button 
                data-testid="button-view-selected-recipe"
                onClick={handleViewRecipe}
                variant="outline"
                size="lg"
                className="block w-full border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold"
              >
                Ver Receta Completa →
              </Button>
            )}
          </div>
        </div>
      </CardContent>

      {/* Recipe Preview Modal */}
      <Dialog open={showRecipeModal} onOpenChange={setShowRecipeModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <div className="text-3xl">🎉</div>
              ¡Tu Receta Está Lista!
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Esto es lo que la ruleta seleccionó para ti hoy
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
                  <Clock className="w-5 h-5 mx-auto mb-1 text-green-600" />
                  <div className="text-sm font-medium text-gray-700">
                    {(selectedRecipe as any).totalTime || ((selectedRecipe as any).prepTime || 0) + (selectedRecipe.cookTime || 0)} min
                  </div>
                  <div className="text-xs text-gray-500">Tiempo Total</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Users className="w-5 h-5 mx-auto mb-1 text-green-600" />
                  <div className="text-sm font-medium text-gray-700">
                    {selectedRecipe.servings}
                  </div>
                  <div className="text-xs text-gray-500">Porciones</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <ChefHat className="w-5 h-5 mx-auto mb-1 text-green-600" />
                  <div className="text-sm font-medium text-gray-700 capitalize">
                    {selectedRecipe.difficulty}
                  </div>
                  <div className="text-xs text-gray-500">Dificultad</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Star className="w-5 h-5 mx-auto mb-1 text-green-600" />
                  <div className="text-sm font-medium text-gray-700">
                    {(selectedRecipe as any).cuisine || 'Internacional'}
                  </div>
                  <div className="text-xs text-gray-500">Cocina</div>
                </div>
              </div>

              {/* Quick Preview */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Vista Rápida</h4>
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
                    Ingredientes Principales ({selectedRecipe.ingredients?.length || 0})
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
              data-testid="button-spin-again"
              variant="outline" 
              onClick={handleSpinAgain}
              className="w-full sm:w-auto"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z"/>
              </svg>
              Girar de Nuevo
            </Button>
            <Button 
              data-testid="button-cook-recipe"
              onClick={handleViewRecipe}
              className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
            >
              ¡Vamos a Cocinar! →
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
