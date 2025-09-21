import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Gift, Zap } from 'lucide-react';
import { GachaItem, tierColors, tierNames } from '@/lib/gacha';
import confetti from 'canvas-confetti';

interface GachaWheelProps {
  onDraw: () => void;
  isDrawing: boolean;
  drawnItem: GachaItem | null;
  remainingCount: number;
  totalCount: number;
}

export function GachaWheel({ onDraw, isDrawing, drawnItem, remainingCount, totalCount }: GachaWheelProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    if (drawnItem) {
      // 뽑기 성공시 confetti 효과
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // 등급별 추가 효과
      if (drawnItem.tier <= 2) {
        setTimeout(() => {
          confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.4 }
          });
        }, 500);
      }
    }
  }, [drawnItem]);

  const createParticles = () => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 400,
      y: Math.random() * 400
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 2000);
  };

  const handleDraw = () => {
    createParticles();
    onDraw();
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[500px]">
      {/* 배경 파티클 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ opacity: 1, scale: 0, x: particle.x, y: particle.y }}
              animate={{ 
                opacity: 0, 
                scale: 1, 
                x: particle.x + (Math.random() - 0.5) * 200,
                y: particle.y - 100
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
              className="absolute w-2 h-2 bg-primary rounded-full"
            />
          ))}
        </AnimatePresence>
      </div>

      {/* 메인 뽑기 휠 */}
      <Card className="relative w-80 h-80 rounded-full border-4 border-primary/50 bg-card/80 backdrop-blur-sm overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-epic/20" />
        
        <motion.div
          className="relative w-full h-full flex items-center justify-center"
          animate={isDrawing ? { rotate: 720 } : { rotate: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <div className="text-center">
            <motion.div
              animate={isDrawing ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              transition={{ duration: 0.5, repeat: isDrawing ? Infinity : 0 }}
            >
              <Gift className="w-16 h-16 mx-auto mb-4 text-primary" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gradient">뽑기 휠</h3>
            <p className="text-muted-foreground mt-2">
              {remainingCount} / {totalCount} 남음
            </p>
          </div>
        </motion.div>

        {/* 글로우 효과 */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-pulse-glow" />
      </Card>

      {/* 뽑기 버튼 */}
      <motion.div
        className="mt-8"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={handleDraw}
          disabled={isDrawing || remainingCount === 0}
          size="lg"
          className="relative px-12 py-6 text-xl font-bold bg-gradient-to-r from-primary to-epic hover:from-primary/80 hover:to-epic/80 border-2 border-primary/50 glow transition-all duration-300"
        >
          <motion.div
            className="flex items-center gap-3"
            animate={isDrawing ? { opacity: [1, 0.5, 1] } : { opacity: 1 }}
            transition={{ duration: 0.5, repeat: isDrawing ? Infinity : 0 }}
          >
            {isDrawing ? (
              <>
                <Zap className="w-6 h-6" />
                뽑는 중...
                <Zap className="w-6 h-6" />
              </>
            ) : remainingCount === 0 ? (
              "완료!"
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                뽑기 시작!
                <Sparkles className="w-6 h-6" />
              </>
            )}
          </motion.div>
          
          {/* 버튼 글로우 */}
          <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary/20 to-epic/20 blur-sm -z-10" />
        </Button>
      </motion.div>

      {/* 진행률 바 */}
      <div className="mt-6 w-80">
        <div className="bg-muted rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-epic"
            initial={{ width: "100%" }}
            animate={{ width: `${(remainingCount / totalCount) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">
          진행률: {Math.round(((totalCount - remainingCount) / totalCount) * 100)}%
        </p>
      </div>
    </div>
  );
}