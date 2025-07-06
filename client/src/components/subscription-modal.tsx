import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import type { User } from "@shared/schema";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
}

export default function SubscriptionModal({ isOpen, onClose, user }: SubscriptionModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const subscribeMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/subscribe", {
        userId: user?.id || 1,
        planType: "pro",
        duration: "monthly",
      });
    },
    onSuccess: () => {
      toast({
        title: "Welcome to Pro!",
        description: "Your subscription has been activated. Enjoy all Pro features!",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/user/${user?.id}`] });
      onClose();
    },
    onError: () => {
      toast({
        title: "Subscription failed",
        description: "Unable to process subscription. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubscribe = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      subscribeMutation.mutate();
      setIsProcessing(false);
    }, 2000);
  };

  const proFeatures = [
    {
      title: "Pantry Mode",
      description: "Smart recipe suggestions based on ingredients you have",
      icon: "🥘",
    },
    {
      title: "Nutrition Data",
      description: "Complete nutritional information for all recipes",
      icon: "📊",
    },
    {
      title: "Offline Access",
      description: "Download recipes and cook without internet",
      icon: "📱",
    },
    {
      title: "Ad-Free Experience",
      description: "Enjoy Chef Roulette without any advertisements",
      icon: "🚫",
    },
    {
      title: "Advanced Filters",
      description: "Filter by allergens, prep time, and more",
      icon: "🔍",
    },
    {
      title: "Carbon Footprint",
      description: "Track the environmental impact of your meals",
      icon: "🌱",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-display font-bold flex items-center">
              <svg className="w-6 h-6 mr-2 text-[hsl(52,100%,70%)]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              Upgrade to Chef Roulette Pro
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Pricing Card */}
          <Card className="chef-gradient text-white">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">$4.99/month</CardTitle>
              <p className="text-white/90">Everything you need for the perfect cooking experience</p>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <Badge className="bg-white text-[hsl(14,100%,60%)] mb-4">
                  7-day Free Trial
                </Badge>
                <p className="text-sm text-white/80">
                  Cancel anytime • No commitment • Instant access
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {proFeatures.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                <div className="text-2xl">{feature.icon}</div>
                <div>
                  <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              onClick={handleSubscribe}
              disabled={isProcessing || subscribeMutation.isPending}
              className="flex-1 bg-[hsl(14,100%,60%)] hover:bg-[hsl(14,100%,55%)] text-white py-3"
            >
              {isProcessing || subscribeMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Start Free Trial
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Maybe Later
            </Button>
          </div>

          {/* Terms */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              By subscribing, you agree to our{" "}
              <a href="#" className="text-[hsl(14,100%,60%)] hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-[hsl(14,100%,60%)] hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
