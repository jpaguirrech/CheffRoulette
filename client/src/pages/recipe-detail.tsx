import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, Users, Heart, Bookmark, Share2, CheckCircle } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Recipe } from "@shared/schema";

export default function RecipeDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: recipe, isLoading } = useQuery<Recipe>({
    queryKey: [`/api/recipes/${id}`],
  });

  const recordActionMutation = useMutation({
    mutationFn: async (action: string) => {
      return await apiRequest("POST", "/api/user-actions", {
        userId: 1, // Mock user ID
        recipeId: parseInt(id!),
        action,
      });
    },
    onSuccess: (_, action) => {
      toast({
        title: "Action recorded",
        description: `Recipe ${action} successfully!`,
      });
      queryClient.invalidateQueries({ queryKey: [`/api/recipes/${id}`] });
    },
  });

  const handleAction = (action: string) => {
    recordActionMutation.mutate(action);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(14,100%,60%)] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Recipe not found</h2>
          <p className="text-gray-600 mb-4">The recipe you're looking for doesn't exist.</p>
          <Button onClick={() => setLocation("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button 
              variant="ghost" 
              onClick={() => setLocation("/")}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Recipes
            </Button>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAction("liked")}
              >
                <Heart className="w-4 h-4 mr-1" />
                {recipe.likes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAction("bookmarked")}
              >
                <Bookmark className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAction("shared")}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image and Info */}
          <div>
            <div className="mb-6">
              <img 
                src={recipe.imageUrl || "https://via.placeholder.com/600x400"} 
                alt={recipe.title}
                className="w-full h-80 object-cover rounded-2xl"
              />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recipe Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <span className="text-sm">{recipe.cookTime} min</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-gray-500" />
                    <span className="text-sm">{recipe.servings} servings</span>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{recipe.cuisine}</Badge>
                    <Badge variant="outline">{recipe.difficulty}</Badge>
                    <Badge variant="outline">{recipe.category}</Badge>
                    {recipe.dietaryTags.map(tag => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
                
                {recipe.sourceUrl && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Source</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>{recipe.sourcePlatform}</span>
                        <span>•</span>
                        <span>{recipe.sourceUsername}</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Title, Description, Ingredients, Instructions */}
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                {recipe.title}
              </h1>
              {recipe.description && (
                <p className="text-gray-600 text-lg">{recipe.description}</p>
              )}
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl">Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[hsl(14,100%,60%)] rounded-full" />
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-[hsl(14,100%,60%)] text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 leading-relaxed">{instruction}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {/* Action Button */}
            <div className="mt-8 text-center">
              <Button 
                size="lg" 
                className="bg-[hsl(174,60%,51%)] hover:bg-[hsl(174,60%,46%)]"
                onClick={() => handleAction("cooked")}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Mark as Cooked
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
