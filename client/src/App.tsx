import { Switch, Route } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useAnalytics } from "@/hooks/use-analytics";
import { initGA } from "./lib/analytics";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import RecipeDetail from "@/pages/recipe-detail";
import MyRecipes from "@/pages/my-recipes";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";
import { Loader2 } from "lucide-react";
import type { User } from "@shared/schema";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Track page views when routes change
  useAnalytics();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If user is not authenticated, show public routes
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/demo" component={Dashboard} />
        <Route component={Landing} />
      </Switch>
    );
  }

  // If user is authenticated, show private routes
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/my-recipes" component={MyRecipes} />
      <Route path="/profile" component={Profile} />
      <Route path="/recipe/:id" component={RecipeDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Initialize Google Analytics when app loads
  useEffect(() => {
    // Verify required environment variable is present
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
      console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    } else {
      initGA();
      console.log('Google Analytics initialized with ID:', import.meta.env.VITE_GA_MEASUREMENT_ID);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
