import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { X, Plus } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Recipe } from "@shared/schema";

// Form validation schema
const editRecipeSchema = z.object({
  recipeTitle: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  prepTime: z.union([z.number().min(0), z.undefined()]).optional(),
  cookTime: z.union([z.number().min(0), z.undefined()]).optional(),
  servings: z.union([z.number().min(1), z.undefined()]).optional(),
  difficultyLevel: z.enum(["easy", "medium", "hard"]).optional(),
  cuisineType: z.string().optional(),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack", "dessert"]).optional(),
  ingredients: z.array(z.object({
    name: z.string(),
    amount: z.string().optional(),
    unit: z.string().optional(),
  })),
  instructions: z.array(z.object({
    step: z.coerce.number(),
    description: z.string(),
  })),
  dietaryTags: z.array(z.string()),
});

type EditRecipeFormData = z.infer<typeof editRecipeSchema>;

interface RecipeEditModalProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
}

export default function RecipeEditModal({ recipe, isOpen, onClose }: RecipeEditModalProps) {
  const { toast } = useToast();
  const [dietaryTagInput, setDietaryTagInput] = useState("");

  // Transform recipe data for form - handle both legacy Recipe and ExtractedRecipe types
  const getDefaultValues = (): EditRecipeFormData => ({
    recipeTitle: (recipe as any).recipeTitle || recipe.title || "",
    description: recipe.description || "",
    prepTime: (recipe as any).prepTime || undefined,
    cookTime: (recipe as any).cookTime || recipe.cookTime || undefined,
    servings: recipe.servings || undefined,
    difficultyLevel: ((recipe as any).difficultyLevel || recipe.difficulty || "medium") as "easy" | "medium" | "hard",
    cuisineType: (recipe as any).cuisineType || recipe.cuisine || "",
    mealType: ((recipe as any).mealType || recipe.category || "lunch") as "breakfast" | "lunch" | "dinner" | "snack" | "dessert",
    ingredients: Array.isArray(recipe.ingredients) 
      ? recipe.ingredients.map((ing, index) => ({
          name: typeof ing === 'string' ? ing : ing.name || "",
          amount: typeof ing === 'string' ? "" : ing.amount || "",
          unit: typeof ing === 'string' ? "" : ing.unit || "",
        }))
      : [{ name: "", amount: "", unit: "" }],
    instructions: Array.isArray(recipe.instructions)
      ? recipe.instructions.map((inst, index) => ({
          step: index + 1,
          description: typeof inst === 'string' ? inst : inst.description || inst,
        }))
      : [{ step: 1, description: "" }],
    dietaryTags: recipe.dietaryTags || [],
  });

  const form = useForm<EditRecipeFormData>({
    resolver: zodResolver(editRecipeSchema),
    defaultValues: getDefaultValues(),
  });

  const updateRecipeMutation = useMutation({
    mutationFn: async (data: EditRecipeFormData) => {
      // Filter out undefined values to avoid overwriting existing data
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined)
      );
      return await apiRequest("PATCH", `/api/extracted-recipes/${recipe.id}`, filteredData);
    },
    onSuccess: () => {
      toast({
        title: "Recipe updated",
        description: "Your recipe has been successfully updated!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/extracted-recipes", recipe.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/extracted-recipes"] });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update recipe",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: EditRecipeFormData) => {
    updateRecipeMutation.mutate(data);
  };

  const addIngredient = () => {
    const ingredients = form.getValues("ingredients");
    form.setValue("ingredients", [...ingredients, { name: "", amount: "", unit: "" }]);
  };

  const removeIngredient = (index: number) => {
    const ingredients = form.getValues("ingredients");
    form.setValue("ingredients", ingredients.filter((_, i) => i !== index));
  };

  const addInstruction = () => {
    const instructions = form.getValues("instructions");
    const newStep = instructions.length + 1;
    form.setValue("instructions", [...instructions, { step: newStep, description: "" }]);
  };

  const removeInstruction = (index: number) => {
    const instructions = form.getValues("instructions");
    const filtered = instructions.filter((_, i) => i !== index);
    // Re-number steps
    const renumbered = filtered.map((inst, i) => ({ ...inst, step: i + 1 }));
    form.setValue("instructions", renumbered);
  };

  const addDietaryTag = () => {
    if (dietaryTagInput.trim()) {
      const currentTags = form.getValues("dietaryTags");
      if (!currentTags.includes(dietaryTagInput.trim())) {
        form.setValue("dietaryTags", [...currentTags, dietaryTagInput.trim()]);
      }
      setDietaryTagInput("");
    }
  };

  const removeDietaryTag = (tagToRemove: string) => {
    const currentTags = form.getValues("dietaryTags");
    form.setValue("dietaryTags", currentTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Recipe: {(recipe as any).recipeTitle || recipe.title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold text-lg">Basic Information</h3>
                
                <FormField
                  control={form.control}
                  name="recipeTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipe Title</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-recipe-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          rows={3}
                          data-testid="textarea-description" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="prepTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prep Time (min)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            value={field.value ?? ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === "" ? undefined : Number(value));
                            }}
                            data-testid="input-prep-time"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cookTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cook Time (min)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            value={field.value ?? ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === "" ? undefined : Number(value));
                            }}
                            data-testid="input-cook-time"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="servings"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Servings</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            value={field.value ?? ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === "" ? undefined : Number(value));
                            }}
                            data-testid="input-servings"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="difficultyLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger data-testid="select-difficulty">
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="easy">Easy</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cuisineType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cuisine Type</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-cuisine" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mealType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meal Type</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger data-testid="select-meal-type">
                              <SelectValue placeholder="Select meal type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="breakfast">Breakfast</SelectItem>
                              <SelectItem value="lunch">Lunch</SelectItem>
                              <SelectItem value="dinner">Dinner</SelectItem>
                              <SelectItem value="snack">Snack</SelectItem>
                              <SelectItem value="dessert">Dessert</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Dietary Tags */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold text-lg">Dietary Tags</h3>
                
                <div className="flex space-x-2">
                  <Input
                    value={dietaryTagInput}
                    onChange={(e) => setDietaryTagInput(e.target.value)}
                    placeholder="Add dietary tag (e.g., Vegetarian, Gluten-Free)"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDietaryTag())}
                    data-testid="input-dietary-tag"
                  />
                  <Button type="button" onClick={addDietaryTag}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {form.watch("dietaryTags").map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeDietaryTag(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ingredients */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">Ingredients</h3>
                  <Button type="button" onClick={addIngredient} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Ingredient
                  </Button>
                </div>

                {form.watch("ingredients").map((_, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name={`ingredients.${index}.amount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="1" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name={`ingredients.${index}.unit`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="cup" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-7">
                      <FormField
                        control={form.control}
                        name={`ingredients.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ingredient</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Ingredient name" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeIngredient(index)}
                        className="h-9"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">Instructions</h3>
                  <Button type="button" onClick={addInstruction} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Step
                  </Button>
                </div>

                {form.watch("instructions").map((_, index) => (
                  <div key={index} className="flex space-x-2 items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-[hsl(14,100%,60%)] text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <FormField
                        control={form.control}
                        name={`instructions.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Describe this step..."
                                rows={2}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeInstruction(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={updateRecipeMutation.isPending}
                className="bg-[hsl(174,60%,51%)] hover:bg-[hsl(174,60%,46%)]"
                data-testid="button-save-recipe"
              >
                {updateRecipeMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}