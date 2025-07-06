import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import RecipeDetail from "@/pages/recipe-detail";
import MyRecipes from "@/pages/my-recipes";
import NotFound from "@/pages/not-found";
import { Loader2 } from "lucide-react";
import type { User } from "@shared/schema";

function Router() {
  // For demo: Start with landing page, then implement authentication
  // In production, this would check real authentication state
  const isAuthenticated = false; // Change to true to see dashboard

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
