import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useGachaData } from '@/hooks/useGachaData';
import { User, History, LogOut, Sparkles } from 'lucide-react';
import { tierNames, tierColors } from '@/lib/gacha';

interface GachaResult {
  id: string;
  template_name: string;
  item_name: string;
  tier: number;
  drawn_at: string;
}

export function UserProfile() {
  const { user, signOut } = useAuth();
  const { getGachaHistory } = useGachaData();
  const [history, setHistory] = useState<GachaResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      const results = await getGachaHistory();
      setHistory(results);
      setLoading(false);
    };

    if (user) {
      loadHistory();
    }
  }, [user, getGachaHistory]);

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
  };

  const tierStats = history.reduce((acc, result) => {
    acc[result.tier] = (acc[result.tier] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* User Info Card */}
      <Card className="border-2 border-primary/20 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-epic flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  사용자 프로필
                  <Sparkles className="w-5 h-5 text-primary" />
                </CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </div>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(tier => (
              <div key={tier} className="text-center">
                <div className={`text-2xl font-bold text-${tierColors[tier as keyof typeof tierColors]}`}>
                  {tierStats[tier] || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  {tierNames[tier as keyof typeof tierNames]}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* History Card */}
      <Card className="border-2 border-primary/20 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            뽑기 히스토리
          </CardTitle>
          <CardDescription>
            최근 {history.length}개의 뽑기 결과
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              아직 뽑기 기록이 없습니다.
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {history.map((result) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background/50"
                >
                  <div className="flex-1">
                    <div className="font-semibold">{result.item_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {result.template_name} • {new Date(result.drawn_at).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                  <Badge variant={tierColors[result.tier as keyof typeof tierColors] as any}>
                    {tierNames[result.tier as keyof typeof tierNames]}
                  </Badge>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}