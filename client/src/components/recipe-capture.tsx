import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Sparkles, Info, Clock, Users, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

export default function RecipeCapture() {
  const [url, setUrl] = useState("");
  const [recipeName, setRecipeName] = useState("");
  const { toast } = useToast();

  const captureMutation = useMutation({
    mutationFn: async (data: { url: string; recipeName?: string }) => {
      return await apiRequest("POST", "/api/recipes/capture", {
        url: data.url,
        recipeName: data.recipeName
      });
    },
    onSuccess: (response: any) => {
      if (response.success) {
        toast({
          title: "Recipe captured!",
          description: `${response.data.title} has been processed and added to your collection.`,
        });
        setUrl("");
        setRecipeName("");
        queryClient.invalidateQueries({ queryKey: ["/api/recipes"] });
      } else {
        toast({
          title: "Processing issue",
          description: response.message || response.error || "This video may be private or doesn't contain extractable recipe content. Try another video.",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Capture failed",
        description: error.message || "Unable to capture recipe. Please check the URL and try again.",
        variant: "destructive",
      });
    },
  });

  const handleCapture = () => {
    if (!url.trim()) {
      toast({
        title: "URL required",
        description: "Please enter a valid URL to capture a recipe.",
        variant: "destructive",
      });
      return;
    }

    captureMutation.mutate({ url, recipeName });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCapture();
    }
  };

  const supportedPlatforms = [
    "TikTok", "Instagram", "YouTube", "Pinterest", "Facebook", "Twitter/X"
  ];

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="chef-gradient-light border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-display font-bold text-gray-900">AI Video Recipe Capture</h3>
                <p className="text-sm text-gray-600 mt-1">Extract recipes from social media videos using AI</p>
              </div>
              <div className="flex items-center space-x-2 text-lg">
                <span>🎵</span>
                <span>📸</span>
                <span>🎥</span>
                <span>📌</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
                <Info className="h-4 w-4 text-green-600" />
                <div>
                  <p className="font-medium">Supported platforms: {supportedPlatforms.join(", ")}</p>
                  <p className="text-xs mt-1">Processing time: 30-60 seconds • Powered by AI</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video URL *
                  </label>
                  <Input
                    placeholder="https://www.tiktok.com/@chef/video/123456789"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipe Name (optional)
                  </label>
                  <Input
                    placeholder="e.g., Spicy Chicken Tacos"
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave blank to auto-detect from video content
                  </p>
                </div>
                
                <Button 
                  onClick={handleCapture}
                  disabled={captureMutation.isPending}
                  className="w-full chef-button-primary"
                  size="lg"
                >
                  {captureMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Video...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Extract Recipe with AI
                    </>
                  )}
                </Button>
                
                {captureMutation.isPending && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 text-sm text-blue-700">
                      <Clock className="h-4 w-4" />
                      <span>AI is analyzing the video and extracting recipe details...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
