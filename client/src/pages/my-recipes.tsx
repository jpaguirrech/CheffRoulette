import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Heart, Bookmark, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import type { Recipe } from "@shared/schema";

export default function MyRecipes() {
  const { data: recipes, isLoading } = useQuery<Recipe[]>({
    queryKey: ["/api/recipes"],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Recipes</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video bg-gray-200 animate-pulse" />
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const userRecipes = recipes?.filter(recipe => recipe.userId === 1) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Recipes</h1>
          <p className="text-gray-600 mt-2">
            {userRecipes.length} recipes saved
          </p>
        </div>
        <Link href="/">
          <Button>
            Capture New Recipe
          </Button>
        </Link>
      </div>

      {userRecipes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Heart className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No recipes yet</h2>
            <p>Start by capturing your first recipe from social media!</p>
          </div>
          <Link href="/">
            <Button className="mt-4">
              Capture Recipe
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userRecipes.map((recipe) => (
            <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative">
                <img
                  src={recipe.imageUrl || "/api/placeholder/400/240"}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  {recipe.isBookmarked && (
                    <Badge variant="secondary" className="bg-white/90">
                      <Bookmark className="w-3 h-3 mr-1" />
                      Saved
                    </Badge>
                  )}
                </div>
              </div>

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight mb-1">
                      {recipe.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {recipe.description}
                    </CardDescription>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {recipe.cookTime}m
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {recipe.servings}
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {recipe.likes}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="text-xs">
                    {recipe.cuisine}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {recipe.difficulty}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {recipe.category}
                  </Badge>
                  {recipe.dietaryTags?.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <ExternalLink className="w-4 h-4" />
                    <span>{recipe.sourcePlatform}</span>
                    {recipe.sourceUsername && (
                      <span className="text-blue-600">{recipe.sourceUsername}</span>
                    )}
                  </div>
                  <Link href={`/recipe/${recipe.id}`}>
                    <Button variant="outline" size="sm">
                      View Recipe
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}