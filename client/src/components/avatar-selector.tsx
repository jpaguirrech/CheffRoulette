import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChefHat, Palette } from "lucide-react";

interface AvatarSelectorProps {
  currentAvatar?: string;
  onAvatarSelect: (avatarUrl: string) => void;
  trigger?: React.ReactNode;
}

export default function AvatarSelector({ currentAvatar, onAvatarSelect, trigger }: AvatarSelectorProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar || "");
  
  // Chef avatar collection - cartoon style cooking characters
  const chefAvatars = [
    {
      id: "chef-male-1",
      url: "https://api.dicebear.com/7.x/adventurer/svg?seed=chef1&backgroundColor=f1f5f9&hair=short01,short02,short03&hairColor=2c1b18,724133,a55728&eyes=default,happy&mouth=happy01,smile01&accessories=glasses01",
      name: "Chef Marco",
      style: "Italian Master"
    },
    {
      id: "chef-female-1", 
      url: "https://api.dicebear.com/7.x/adventurer/svg?seed=chef2&backgroundColor=fef7cd&hair=long01,long02&hairColor=6b46c1,7c3aed&eyes=default,happy&mouth=happy01&accessories=none",
      name: "Chef Sofia",
      style: "French Cuisine"
    },
    {
      id: "chef-male-2",
      url: "https://api.dicebear.com/7.x/adventurer/svg?seed=chef3&backgroundColor=dcfce7&hair=short04,short05&hairColor=92400e,b45309&eyes=default,wink&mouth=eating&accessories=mustache",
      name: "Chef Roberto",
      style: "BBQ Master"
    },
    {
      id: "chef-female-2",
      url: "https://api.dicebear.com/7.x/adventurer/svg?seed=chef4&backgroundColor=fce7f3&hair=long03,long04&hairColor=be185d,ec4899&eyes=default,happy&mouth=smile01&accessories=none",
      name: "Chef Amelia",
      style: "Pastry Expert"
    },
    {
      id: "chef-male-3",
      url: "https://api.dicebear.com/7.x/adventurer/svg?seed=chef5&backgroundColor=e0f2fe&hair=short06,buzz&hairColor=1e293b,475569&eyes=default,squint&mouth=serious&accessories=glasses02",
      name: "Chef David",
      style: "Asian Fusion"
    },
    {
      id: "chef-female-3",
      url: "https://api.dicebear.com/7.x/adventurer/svg?seed=chef6&backgroundColor=fef3c7&hair=long05,long06&hairColor=059669,10b981&eyes=default,happy&mouth=happy02&accessories=none",
      name: "Chef Luna",
      style: "Vegan Specialist"
    },
    {
      id: "chef-male-4",
      url: "https://api.dicebear.com/7.x/adventurer/svg?seed=chef7&backgroundColor=ede9fe&hair=short07,short08&hairColor=dc2626,ef4444&eyes=default,wink&mouth=smile02&accessories=mustache",
      name: "Chef Antonio",
      style: "Pizza Master"
    },
    {
      id: "chef-female-4",
      url: "https://api.dicebear.com/7.x/adventurer/svg?seed=chef8&backgroundColor=ecfdf5&hair=long07,long08&hairColor=0891b2,06b6d4&eyes=default,happy&mouth=happy01&accessories=none",
      name: "Chef Isabella",
      style: "Seafood Expert"
    }
  ];

  const handleSelect = (avatar: typeof chefAvatars[0]) => {
    setSelectedAvatar(avatar.url);
    onAvatarSelect(avatar.url);
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="flex items-center space-x-2">
      <Palette className="w-4 h-4" />
      <span>Choose Chef Avatar</span>
    </Button>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ChefHat className="w-5 h-5 text-green-600" />
            <span>Choose Your Chef Avatar</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {chefAvatars.map((avatar) => (
            <Card 
              key={avatar.id}
              className={`cursor-pointer transition-all hover:shadow-md hover:scale-105 ${
                selectedAvatar === avatar.url ? 'ring-2 ring-green-500 bg-green-50' : ''
              }`}
              onClick={() => handleSelect(avatar)}
            >
              <CardHeader className="p-3 pb-2">
                <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-gray-100">
                  <img 
                    src={avatar.url} 
                    alt={avatar.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-0 text-center">
                <h4 className="font-semibold text-sm text-gray-900">{avatar.name}</h4>
                <p className="text-xs text-gray-600 mt-1">{avatar.style}</p>
                {selectedAvatar === avatar.url && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Selected
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-center mt-6">
          <p className="text-sm text-gray-500 text-center">
            Select a chef avatar to represent you in the Chef Roulette community.<br />
            You can change this anytime from your profile settings.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}