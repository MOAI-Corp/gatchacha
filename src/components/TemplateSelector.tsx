import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GachaTemplate } from '@/lib/gacha';
import { Sparkles, Crown, Zap, Rocket, Clock, Star } from 'lucide-react';

interface TemplateSelectorProps {
  templates: GachaTemplate[];
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

const themeIcons = {
  classic: Sparkles,
  golden: Crown,
  magical: Zap,
  neon: Star,
  vintage: Clock,
  cosmic: Rocket
} as const;

const themeColors = {
  classic: "primary",
  golden: "legendary", 
  magical: "epic",
  neon: "rare",
  vintage: "uncommon",
  cosmic: "primary"
} as const;

export function TemplateSelector({ templates, selectedTemplate, onSelectTemplate }: TemplateSelectorProps) {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-gradient mb-2">뽑기 템플릿 선택</h2>
        <p className="text-muted-foreground">다양한 테마의 뽑기를 즐겨보세요!</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, index) => {
          const ThemeIcon = themeIcons[template.theme as keyof typeof themeIcons];
          const themeColor = themeColors[template.theme as keyof typeof themeColors];
          const isSelected = selectedTemplate === template.id;
          
          // 등급별 아이템 개수 계산
          const tierCounts = {
            1: template.items.filter(item => item.tier === 1).length,
            2: template.items.filter(item => item.tier === 2).length,
            3: template.items.filter(item => item.tier === 3).length,
            4: template.items.filter(item => item.tier === 4).length,
            5: template.items.filter(item => item.tier === 5).length,
          };

          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`relative cursor-pointer transition-all duration-300 ${
                  isSelected 
                    ? `border-2 ${
                        themeColor === 'legendary' ? 'border-legendary glow-legendary' :
                        themeColor === 'epic' ? 'border-epic glow-epic' :
                        themeColor === 'rare' ? 'border-rare glow-rare' :
                        themeColor === 'uncommon' ? 'border-uncommon' :
                        themeColor === 'primary' ? 'border-primary glow' :
                        'border-primary glow'
                      }`
                    : 'border border-border hover:border-primary/50'
                } bg-card/80 backdrop-blur-sm overflow-hidden`}
                onClick={() => onSelectTemplate(template.id)}
              >
                {/* 배경 그라데이션 */}
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{ background: `var(--gradient-${themeColor})` }}
                />
                
                <CardHeader className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ThemeIcon className={`w-6 h-6 ${
                        themeColor === 'legendary' ? 'text-legendary' :
                        themeColor === 'epic' ? 'text-epic' :
                        themeColor === 'rare' ? 'text-rare' :
                        themeColor === 'uncommon' ? 'text-uncommon' :
                        'text-primary'
                      }`} />
                      <CardTitle className="text-xl">{template.name}</CardTitle>
                    </div>
                    {isSelected && (
                      <Badge variant={themeColor as any}>
                        선택됨
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    총 {template.items.length}개 아이템
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative z-10">
                  {/* 등급별 아이템 개수 */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-legendary">전설</span>
                      <span className="font-semibold">{tierCounts[1]}개</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-epic">영웅</span>
                      <span className="font-semibold">{tierCounts[2]}개</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-rare">희귀</span>
                      <span className="font-semibold">{tierCounts[3]}개</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-uncommon">고급</span>
                      <span className="font-semibold">{tierCounts[4]}개</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-common">일반</span>
                      <span className="font-semibold">{tierCounts[5]}개</span>
                    </div>
                  </div>

                  <Button 
                    variant={isSelected ? themeColor as any : "outline"}
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTemplate(template.id);
                    }}
                  >
                    {isSelected ? '선택됨' : '선택하기'}
                  </Button>
                </CardContent>
                
                {/* 선택 시 글로우 효과 */}
                {isSelected && (
                  <motion.div
                    className={`absolute inset-0 border-2 rounded-lg ${
                      themeColor === 'legendary' ? 'border-legendary/30' :
                      themeColor === 'epic' ? 'border-epic/30' :
                      themeColor === 'rare' ? 'border-rare/30' :
                      themeColor === 'uncommon' ? 'border-uncommon/30' :
                      'border-primary/30'
                    }`}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}