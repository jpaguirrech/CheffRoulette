import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings, User, Camera, Save, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import AvatarSelector from "./avatar-selector";
import type { User as UserType } from "@shared/schema";

interface ProfileSettingsProps {
  user: UserType;
}

export default function ProfileSettings({ user }: ProfileSettingsProps) {
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [username, setUsername] = useState(user.username || "");
  const [profileImageUrl, setProfileImageUrl] = useState(user.profileImageUrl || "");
  const { toast } = useToast();

  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<UserType>) => {
      return await apiRequest("PATCH", `/api/user/${user.id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Profile updated!",
        description: "Your profile has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateProfileMutation.mutate({
      firstName: firstName.trim() || null,
      lastName: lastName.trim() || null,
      username: username.trim() || null,
      profileImageUrl: profileImageUrl || null,
    });
  };

  const handleAvatarSelect = (avatarUrl: string) => {
    setProfileImageUrl(avatarUrl);
    toast({
      title: "Avatar selected!",
      description: "Don't forget to save your changes.",
    });
  };

  const getDisplayName = () => {
    if (firstName || lastName) {
      return `${firstName || ''} ${lastName || ''}`.trim();
    }
    return username || user.email || 'Chef';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Profile Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture Section */}
          <div className="flex items-center space-x-6">
            <div className="flex flex-col items-center space-y-2">
              <img 
                src={profileImageUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face'}
                alt={`${getDisplayName()}'s profile`}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face';
                }}
              />
              <div className="flex space-x-2">
                <AvatarSelector 
                  currentAvatar={profileImageUrl}
                  onAvatarSelect={handleAvatarSelect}
                  trigger={
                    <Button variant="outline" size="sm">
                      <Camera className="w-4 h-4 mr-2" />
                      Chef Avatar
                    </Button>
                  }
                />
              </div>
            </div>
            
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-semibold">{getDisplayName()}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Trophy className="w-3 h-3" />
                  <span>{user.points || 0} points</span>
                </Badge>
                {user.isPro && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    Pro Member
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Personal Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Chef Name (Username)</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a unique chef name"
            />
            <p className="text-sm text-gray-500">
              This is how other chefs will see you in the community
            </p>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSave}
              disabled={updateProfileMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {updateProfileMutation.isPending ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5" />
            <span>Chef Stats</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{user.points || 0}</div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{user.streak || 0}</div>
              <div className="text-sm text-gray-600">Current Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{user.recipesCooked || 0}</div>
              <div className="text-sm text-gray-600">Recipes Cooked</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}