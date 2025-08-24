import { AdSenseBannerHorizontal, AdSenseSquare, AdSenseResponsive } from "./adsense-banner";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdBannerProps {
  className?: string;
  onUpgrade?: () => void;
  type?: "banner" | "square" | "responsive";
  showFallback?: boolean;
}

export default function AdBanner({ 
  className, 
  onUpgrade, 
  type = "banner",
  showFallback = false 
}: AdBannerProps) {
  
  // Show real AdSense ads for production, fallback for development
  const shouldShowRealAds = process.env.NODE_ENV === 'production' && !showFallback;
  
  if (shouldShowRealAds) {
    switch (type) {
      case "square":
        return <AdSenseSquare className={className} onUpgrade={onUpgrade} />;
      case "responsive":
        return <AdSenseResponsive className={className} onUpgrade={onUpgrade} />;
      case "banner":
      default:
        return <AdSenseBannerHorizontal className={className} onUpgrade={onUpgrade} />;
    }
  }
  
  // Fallback placeholder for development
  return (
    <div className={cn(
      "bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative",
      className
    )}>
      <div className="flex items-center justify-center mb-2">
        <div className="text-2xl text-gray-400 mr-2">📢</div>
        <span className="text-sm text-gray-500 font-medium">Advertisement</span>
      </div>
      
      <div className="space-y-2">
        <p className="text-gray-400 text-sm">
          {type === "banner" && "Banner Ad Space (728x90)"}
          {type === "square" && "Square Ad Space (300x250)"}
          {type === "responsive" && "Responsive Ad Space"}
        </p>
        <p className="text-gray-400 text-sm">
          [Your recipe ingredients could be delivered fresh to your door!]
        </p>
      </div>
      
      <div className="mt-4 flex items-center justify-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onUpgrade}
          className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
        >
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
          Remove ads with Pro
        </Button>
        
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
