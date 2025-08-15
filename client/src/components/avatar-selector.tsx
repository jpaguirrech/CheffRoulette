import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { ChefHat, Palette } from "lucide-react";

interface AvatarSelectorProps {
  currentAvatar?: string;
  onAvatarSelect: (avatarUrl: string) => void;
  trigger?: React.ReactNode;
}

interface ChefAvatar {
  id: string;
  url: string;
  name: string;
  style: string;
}

export default function AvatarSelector({ currentAvatar, onAvatarSelect, trigger }: AvatarSelectorProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar || "");
  const [isOpen, setIsOpen] = useState(false);
  
  // Chef avatar collection - using reliable avatar service
  const chefAvatars = [
    {
      id: "chef-male-1",
      url: "https://robohash.org/chef-marco.png?set=set5&size=150x150",
      name: "Chef Marco",
      style: "Italian Master"
    },
    {
      id: "chef-female-1", 
      url: "https://robohash.org/chef-sofia.png?set=set5&size=150x150",
      name: "Chef Sofia",
      style: "French Cuisine"
    },
    {
      id: "chef-male-2",
      url: "https://robohash.org/chef-roberto.png?set=set5&size=150x150",
      name: "Chef Roberto",
      style: "BBQ Master"
    },
    {
      id: "chef-female-2",
      url: "https://robohash.org/chef-amelia.png?set=set5&size=150x150",
      name: "Chef Amelia",
      style: "Pastry Expert"
    },
    {
      id: "chef-male-3",
      url: "https://robohash.org/chef-david.png?set=set5&size=150x150",
      name: "Chef David",
      style: "Asian Fusion"
    },
    {
      id: "chef-female-3",
      url: "https://robohash.org/chef-luna.png?set=set5&size=150x150",
      name: "Chef Luna",
      style: "Vegan Specialist"
    },
    {
      id: "chef-male-4",
      url: "https://robohash.org/chef-antonio.png?set=set5&size=150x150",
      name: "Chef Antonio",
      style: "Pizza Master"
    },
    {
      id: "chef-female-4",
      url: "https://robohash.org/chef-isabella.png?set=set5&size=150x150",
      name: "Chef Isabella",
      style: "Seafood Expert"
    }
  ];

  const handleSelect = (avatar: ChefAvatar) => {
    setSelectedAvatar(avatar.url);
  };

  const handleSave = () => {
    if (selectedAvatar) {
      onAvatarSelect(selectedAvatar);
      setIsOpen(false);
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="flex items-center space-x-2">
      <Palette className="w-4 h-4" />
      <span>Choose Chef Avatar</span>
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
        
        <div className="flex flex-col items-center mt-6 space-y-4">
          <p className="text-sm text-gray-500 text-center">
            Select a chef avatar to represent you in the Chef Roulette community.<br />
            You can change this anytime from your profile settings.
          </p>
          
          <div className="flex space-x-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              onClick={handleSave}
              disabled={!selectedAvatar}
              className="bg-green-600 hover:bg-green-700"
            >
              Save Avatar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}