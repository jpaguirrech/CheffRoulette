import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Star } from "lucide-react";
import type { User } from "@shared/schema";

interface NavigationProps {
  user?: User;
  onUpgradeClick: () => void;
}

export default function Navigation({ user, onUpgradeClick }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const navigationItems = [
    { name: "Discover", href: "/", current: location === "/" },
    { name: "My Recipes", href: "/my-recipes", current: location === "/my-recipes" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <svg className="w-8 h-8 mr-3 text-[hsl(14,100%,60%)]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z"/>
              </svg>
              <h1 className="text-xl font-display font-bold text-gray-900">Chef Roulette</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-medium transition-colors ${
                  item.current
                    ? "text-[hsl(14,100%,60%)]"
                    : "text-gray-700 hover:text-[hsl(14,100%,60%)]"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Points Display */}
            {user && (
              <div className="hidden sm:flex items-center bg-[hsl(52,100%,70%,0.2)] px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-[hsl(52,100%,70%)] mr-1" />
                <span className="text-sm font-medium text-gray-900">{user.points}</span>
              </div>
            )}

            {/* Authentication */}
            {user ? (
              <>
                {/* Upgrade Button */}
                {!user.isPro && (
                  <Button 
                    onClick={onUpgradeClick}
                    className="bg-[hsl(14,100%,60%)] hover:bg-[hsl(14,100%,55%)]"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    Upgrade to Pro
                  </Button>
                )}
                
                {/* User Profile */}
                <div className="flex items-center space-x-2">
                  <Link href="/profile">
                    <img 
                      src={user.profileImageUrl || `https://robohash.org/${user.id}.png?set=set5&size=80x80`} 
                      alt={`${user.firstName || user.username || 'User'}'s profile`}
                      className="w-8 h-8 rounded-full object-cover border border-gray-200 cursor-pointer hover:ring-2 hover:ring-green-500 transition-all"
                      onError={(e) => {
                        e.currentTarget.src = `https://robohash.org/default-chef.png?set=set5&size=80x80`;
                      }}
                    />
                  </Link>
                  <Link href="/profile">
                    <span className="text-sm font-medium text-gray-700 hidden sm:block hover:text-green-600 cursor-pointer">
                      {user.firstName || user.username || 'Chef'}
                    </span>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = '/api/logout'}
                  >
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 flex items-center space-x-2"
                size="sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Iniciar Sesión con Google</span>
              </Button>
            )}

            {/* Pro Badge */}
            {user?.isPro && (
              <Badge className="bg-[hsl(52,100%,70%)] text-black">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                Pro
              </Badge>
            )}

            {/* User Avatar */}
            <div className="w-8 h-8 bg-[hsl(174,60%,51%)] rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                  item.current
                    ? "text-[hsl(14,100%,60%)] bg-[hsl(14,100%,60%,0.1)]"
                    : "text-gray-700 hover:text-[hsl(14,100%,60%)] hover:bg-gray-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
