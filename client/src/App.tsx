import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import RecipeDetail from "@/pages/recipe-detail";
import MyRecipes from "@/pages/my-recipes";
import NotFound from "@/pages/not-found";
import { Loader2 } from "lucide-react";
import type { User } from "@shared/schema";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

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
      <Route path="/recipe/:id" component={RecipeDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
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
