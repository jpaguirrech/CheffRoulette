import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Sparkles, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

export default function RecipeCapture() {
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const captureMutation = useMutation({
    mutationFn: async (url: string) => {
      return await apiRequest("POST", "/api/recipes/capture", {
        url
      });
    },
    onSuccess: () => {
      toast({
        title: "Recipe captured!",
        description: "Your recipe has been added to your collection.",
      });
      setUrl("");
      queryClient.invalidateQueries({ queryKey: ["/api/recipes"] });
    },
    onError: () => {
      toast({
        title: "Capture failed",
        description: "Unable to capture recipe. Please check the URL and try again.",
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

    captureMutation.mutate(url);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCapture();
    }
  };

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="chef-gradient-light border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-display font-bold text-gray-900">Quick Capture</h3>
              <div className="flex items-center space-x-2 text-lg">
                <span>🎵</span>
                <span>📸</span>
                <span>🎥</span>
                <span>📌</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Input
                  type="url"
                  placeholder="Paste link from TikTok, Instagram, YouTube, or Pinterest..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="text-base py-3 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <Button
                onClick={handleCapture}
                disabled={captureMutation.isPending}
                className="bg-green-600 hover:bg-green-700 px-6 py-3"
              >
                {captureMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Capturing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Capture
                  </>
                )}
              </Button>
            </div>
            
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <Info className="w-4 h-4 mr-1" />
              <span>Our AI will extract ingredients, instructions, and tags automatically</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
