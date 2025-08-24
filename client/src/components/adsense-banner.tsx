import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdSenseBannerProps {
  className?: string;
  onUpgrade?: () => void;
  slot: string;
  format?: "auto" | "rectangle" | "vertical" | "horizontal";
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function AdSenseBanner({ 
  className, 
  onUpgrade, 
  slot, 
  format = "auto",
  style = { display: "block" }
}: AdSenseBannerProps) {
  
  useEffect(() => {
    try {
      // Initialize AdSense ad
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div className={cn("relative", className)}>
      {/* AdSense Ad Unit */}
      <ins 
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-2923350065194117"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      
      {/* Upgrade to Pro overlay */}
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={onUpgrade}
          className="bg-white/90 backdrop-blur-sm text-green-600 border-green-600 hover:bg-green-600 hover:text-white text-xs"
        >
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
          Remove ads
        </Button>
      </div>
    </div>
  );
}

// Banner Ad Component (728x90)
export function AdSenseBannerHorizontal({ className, onUpgrade }: { className?: string; onUpgrade?: () => void }) {
  return (
    <AdSenseBanner
      className={cn("w-full max-w-[728px] mx-auto", className)}
      onUpgrade={onUpgrade}
      slot="9876543210" // Banner ad slot
      format="horizontal"
      style={{ display: "block", width: "728px", height: "90px" }}
    />
  );
}

// Square Ad Component (300x250)
export function AdSenseSquare({ className, onUpgrade }: { className?: string; onUpgrade?: () => void }) {
  return (
    <AdSenseBanner
      className={cn("w-[300px] h-[250px]", className)}
      onUpgrade={onUpgrade}
      slot="1357924680" // Square ad slot
      format="rectangle"
      style={{ display: "block", width: "300px", height: "250px" }}
    />
  );
}

// Responsive Ad Component
export function AdSenseResponsive({ className, onUpgrade }: { className?: string; onUpgrade?: () => void }) {
  return (
    <AdSenseBanner
      className={cn("w-full", className)}
      onUpgrade={onUpgrade}
      slot="2468013579" // Responsive ad slot
      format="auto"
      style={{ display: "block" }}
    />
  );
}