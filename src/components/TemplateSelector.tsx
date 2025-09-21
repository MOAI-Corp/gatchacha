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
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h2 className="text-2xl font-bold text-gradient mb-2">뽑기 템플릿</h2>
        <p className="text-sm text-muted-foreground">원하는 테마를 선택하세요</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {templates.map((template, index) => {
          const ThemeIcon = themeIcons[template.theme as keyof typeof themeIcons];
          const themeColor = themeColors[template.theme as keyof typeof themeColors];
          const isSelected = selectedTemplate === template.id;

          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                className={`relative cursor-pointer transition-all duration-300 h-24 ${
                  isSelected
                    ? `border-2 ${
                        themeColor === 'legendary' ? 'border-legendary glow-legendary' :
                        themeColor === 'epic' ? 'border-epic glow-epic' :
                        themeColor === 'rare' ? 'border-rare glow-rare' :
                        themeColor === 'uncommon' ? 'border-uncommon' :
                        'border-primary glow'
                      }`
                    : 'border border-border hover:border-primary/50'
                } bg-card/80 backdrop-blur-sm overflow-hidden`}
                onClick={() => onSelectTemplate(template.id)}
              >
                {/* 배경 그라데이션 */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{ background: `var(--gradient-${themeColor})` }}
                />

                <CardContent className="relative z-10 p-3 h-full flex flex-col items-center justify-center text-center">
                  <ThemeIcon className={`w-6 h-6 mb-1 ${
                    themeColor === 'legendary' ? 'text-legendary' :
                    themeColor === 'epic' ? 'text-epic' :
                    themeColor === 'rare' ? 'text-rare' :
                    themeColor === 'uncommon' ? 'text-uncommon' :
                    'text-primary'
                  }`} />
                  <h3 className="text-xs font-semibold leading-tight">{template.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {template.items.length}개
                  </p>
                </CardContent>

                {/* 선택 시 체크마크 */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                  >
                    <span className="text-xs text-primary-foreground">✓</span>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}