import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy, Target } from "lucide-react";
import type { User, UserChallenge } from "@shared/schema";

interface GamificationPanelProps {
  user?: User;
}

export default function GamificationPanel({ user }: GamificationPanelProps) {
  const { data: challenges } = useQuery<UserChallenge[]>({
    queryKey: [`/api/user/${user?.id}/challenges`],
    enabled: !!user,
  });

  if (!user) return null;

  const activeChallenge = challenges?.[0];
  const challengeProgress = activeChallenge ? (activeChallenge.progress / 5) * 100 : 0;

  return (
    <Card className="mb-6">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
        <CardTitle className="text-xl font-display font-bold text-gray-900">
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Cooking Streak</span>
            <div className="flex items-center">
              <Flame className="w-4 h-4 text-orange-500 mr-1" />
              <span className="font-bold text-orange-500">{user.streak} days</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Recipes Cooked</span>
            <span className="font-bold text-[hsl(174,60%,51%)]">{user.recipesCooked}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Points This Week</span>
            <span className="font-bold text-[hsl(52,100%,70%)]">{user.weeklyPoints}</span>
          </div>
        </div>
        
        {activeChallenge && (
          <div className="mt-4 p-3 chef-gradient-light rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Target className="w-4 h-4 mr-2 text-[hsl(14,100%,60%)]" />
                <span className="text-sm font-medium text-gray-700">Weekly Challenge</span>
              </div>
              <span className="text-xs text-gray-500">
                {activeChallenge.progress}/5 complete
              </span>
            </div>
            
            <Progress value={challengeProgress} className="h-2 mb-2" />
            
            <p className="text-sm text-gray-600">Cook 5 vegetarian recipes</p>
            
            <div className="mt-2 flex items-center">
              <Trophy className="w-4 h-4 mr-1 text-yellow-500" />
              <span className="text-xs text-gray-600">Reward: 100 points</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
