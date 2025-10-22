import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import ProfileSettings from "@/components/profile-settings";
import { Link } from "wouter";
import type { User } from "@shared/schema";

export default function Profile() {
  const { toast } = useToast();
  
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
  });

  const handleUpgradeClick = () => {
    toast({
      title: "Upgrade to Pro",
      description: "Pro features coming soon! Get unlimited recipe captures, advanced filtering, and more.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation user={user} onUpgradeClick={handleUpgradeClick} />
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation user={user} onUpgradeClick={handleUpgradeClick} />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h1>
            <p className="text-gray-600 mb-6">You need to be logged in to access your profile.</p>
            <div className="flex items-center justify-center space-x-4">
              <Button 
                onClick={() => window.location.href = '/api/google/login'}
                className="bg-red-600 hover:bg-red-700"
              >
                Login with Google
              </Button>
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="bg-green-600 hover:bg-green-700"
              >
                Login with Replit
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} onUpgradeClick={handleUpgradeClick} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your profile, avatar, and preferences</p>
        </div>

        <ProfileSettings user={user} />
      </div>

      <Footer />
    </div>
  );
}