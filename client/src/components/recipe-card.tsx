import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, Heart, Bookmark, Share2 } from "lucide-react";
import type { Recipe } from "@shared/schema";

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const getPlatformIcon = (platform: string) => {
    switch (platform?.toLowerCase()) {
      case 'tiktok':
        return '🎵';
      case 'instagram':
        return '📸';
      case 'youtube':
        return '🎥';
      case 'pinterest':
        return '📌';
      default:
        return '🌐';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden cursor-pointer group">
      <Link href={`/recipe/${recipe.id}`}>
        <div className="relative">
          <img 
            src={recipe.imageUrl || "https://via.placeholder.com/400x300"} 
            alt={recipe.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {recipe.sourcePlatform && (
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
              {getPlatformIcon(recipe.sourcePlatform)} {recipe.sourcePlatform}
            </div>
          )}
        </div>
      </Link>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            {recipe.sourcePlatform && (
              <>
                <span>{getPlatformIcon(recipe.sourcePlatform)}</span>
                <span>{recipe.sourceUsername}</span>
              </>
            )}
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Heart className="w-3 h-3" />
            <span>{recipe.likes}</span>
          </div>
        </div>
        
        <Link href={`/recipe/${recipe.id}`}>
          <h4 className="font-display font-bold text-gray-900 mb-2 hover:text-[hsl(14,100%,60%)] transition-colors">
            {recipe.title}
          </h4>
        </Link>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {recipe.cookTime} min
          </span>
          <span className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {recipe.servings} servings
          </span>
        </div>
        
        <div className="flex items-center space-x-2 mb-3">
          <Badge variant="secondary" className="bg-[hsl(14,100%,60%,0.1)] text-[hsl(14,100%,60%)]">
            {recipe.cuisine}
          </Badge>
          <Badge variant="outline" className={getDifficultyColor(recipe.difficulty)}>
            {recipe.difficulty}
          </Badge>
          <Badge variant="outline" className="bg-[hsl(52,100%,70%,0.1)] text-gray-700">
            {recipe.category}
          </Badge>
        </div>
        
        {recipe.dietaryTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {recipe.dietaryTags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {recipe.dietaryTags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{recipe.dietaryTags.length - 2} more
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="p-1">
              <Bookmark className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-1">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
          <Link href={`/recipe/${recipe.id}`}>
            <Button size="sm" className="bg-[hsl(14,100%,60%)] hover:bg-[hsl(14,100%,55%)]">
              View Recipe
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
