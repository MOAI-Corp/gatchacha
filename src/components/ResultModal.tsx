import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Crown, Star, Diamond, Gem } from 'lucide-react';
import { GachaItem, tierColors, tierNames } from '@/lib/gacha';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: GachaItem | null;
}

const tierIcons = {
  1: Crown,
  2: Diamond,
  3: Gem, 
  4: Star,
  5: Sparkles
} as const;

export function ResultModal({ isOpen, onClose, item }: ResultModalProps) {
  if (!item) return null;

  const TierIcon = tierIcons[item.tier];
  const tierColor = tierColors[item.tier];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-card/95 backdrop-blur-sm border-2" style={{
        borderColor: `hsl(var(--${tierColor}))`
      }}>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="flex items-center justify-center gap-2"
            >
              <TierIcon className={`w-8 h-8 text-${tierColor}`} />
              뽑기 결과!
              <TierIcon className={`w-8 h-8 text-${tierColor}`} />
            </motion.div>
          </DialogTitle>
        </DialogHeader>

        <div className="text-center py-8">
          {/* 아이템 카드 */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={`relative mx-auto w-48 h-32 rounded-xl border-2 p-4 mb-6 ${
              tierColor === 'legendary' ? 'border-legendary' :
              tierColor === 'epic' ? 'border-epic' :
              tierColor === 'rare' ? 'border-rare' :
              tierColor === 'uncommon' ? 'border-uncommon' :
              'border-common'
            } ${
              tierColor === 'legendary' ? 'glow-legendary' :
              tierColor === 'epic' ? 'glow-epic' :
              tierColor === 'rare' ? 'glow-rare' :
              ''
            }`}
            style={{
              background: `var(--gradient-${tierColor})`
            }}
          >
            <div className="absolute inset-0 rounded-xl bg-black/20" />
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-white">
              <TierIcon className="w-12 h-12 mb-2" />
              <h3 className="font-bold text-lg">{item.name}</h3>
            </div>
            
            {/* 반짝이는 효과 */}
            <motion.div
              className="absolute inset-0 rounded-xl"
              animate={{ 
                background: [
                  "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 40% 40%, rgba(255,255,255,0.3) 0%, transparent 50%)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          {/* 등급 배지 */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="mb-6"
          >
            <Badge 
              variant={tierColor as any}
              className="text-lg px-6 py-2"
            >
              {tierNames[item.tier]} 등급
            </Badge>
          </motion.div>

          {/* 축하 메시지 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-6"
          >
            {item.tier === 1 && (
              <p className="text-legendary font-bold text-xl">🎉 전설 등급 획득! 🎉</p>
            )}
            {item.tier === 2 && (
              <p className="text-epic font-bold text-lg">✨ 영웅 등급 획득! ✨</p>
            )}
            {item.tier === 3 && (
              <p className="text-rare font-semibold">💎 희귀 등급 획득!</p>
            )}
            {item.tier >= 4 && (
              <p className="text-muted-foreground">획득 완료!</p>
            )}
          </motion.div>

          {/* 확인 버튼 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              onClick={onClose}
              variant={tierColor as any}
              className="px-8 py-3"
            >
              확인
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}