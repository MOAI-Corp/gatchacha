import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Gift, Zap, Trophy, Crown, Star } from 'lucide-react';
import { GachaItem, tierColors, tierNames } from '@/lib/gacha';
import { t } from '@/lib/i18n';
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
  const [, setLanguageUpdate] = useState(0); // 언어 변경 시 리렌더링용

  // 언어 변경 감지
  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguageUpdate(prev => prev + 1);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);

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

      {/* Japanese Style Prize Wheel */}
      <Card className="relative w-80 h-80 rounded-full japanese-wheel overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-yellow-500/20 to-blue-500/20" />

        {/* Traditional Japanese ornaments around the wheel */}
        <div className="absolute inset-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-8 h-8 text-2xl"
              style={{
                left: '50%',
                top: '50%',
                transformOrigin: '0 120px',
                transform: `rotate(${i * 45}deg)`,
              }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              {i % 2 === 0 ? '🌸' : '🏮'}
            </motion.div>
          ))}
        </div>

        <motion.div
          className="relative w-full h-full flex items-center justify-center"
          animate={isDrawing ? { rotate: 720 } : { rotate: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <div className="text-center">
            <motion.div
              animate={isDrawing ? { scale: [1, 1.3, 1], rotate: [0, 180, 360] } : { scale: 1 }}
              transition={{ duration: 0.6, repeat: isDrawing ? Infinity : 0 }}
              className="relative"
            >
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-red-500 to-yellow-500 rounded-full flex items-center justify-center text-white text-4xl shadow-lg">
                🎁
              </div>
              <div className="absolute -top-2 -left-2 text-2xl animate-pulse">
                ✨
              </div>
              <div className="absolute -top-2 -right-2 text-2xl animate-pulse">
                ✨
              </div>
            </motion.div>
            <h3 className="text-2xl font-bold text-japanese-title mb-2">{t('lotteryBox')}</h3>
            <div className="bg-white/90 rounded-lg px-3 py-1 text-sm font-semibold text-gray-800">
              {remainingCount} / {totalCount} {t('remainingCount')}
            </div>
          </div>
        </motion.div>

        {/* Traditional Japanese glow effect */}
        <div className="absolute inset-0 rounded-full border-4 border-red-500/40 animate-pulse-glow" />
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-yellow-500/60"
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </Card>

      {/* Japanese Style Draw Button */}
      <motion.div
        className="mt-8"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={handleDraw}
          disabled={isDrawing || remainingCount === 0}
          size="lg"
          className="relative px-12 py-6 text-xl font-bold japanese-button animate-lucky-draw disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <motion.div
            className="flex items-center gap-3"
            animate={isDrawing ? { opacity: [1, 0.5, 1] } : { opacity: 1 }}
            transition={{ duration: 0.5, repeat: isDrawing ? Infinity : 0 }}
          >
            {isDrawing ? (
              <>
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="text-2xl"
                >
                  🎌
                </motion.span>
                {t('drawingInProgress')}
                <motion.span
                  animate={{ rotate: [360, 0] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="text-2xl"
                >
                  🎌
                </motion.span>
              </>
            ) : remainingCount === 0 ? (
              <>
                <Crown className="w-6 h-6" />
                {t('completed')}
                <Crown className="w-6 h-6" />
              </>
            ) : (
              <>
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-2xl"
                >
                  🏮
                </motion.span>
                {t('drawButton')}
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                  className="text-2xl"
                >
                  🏮
                </motion.span>
              </>
            )}
          </motion.div>

          {/* Traditional Japanese button decoration */}
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-yellow-400 rounded-full" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-yellow-400 rounded-full" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full" />
        </Button>
      </motion.div>

      {/* Japanese Style Progress Indicator */}
      <div className="mt-6 w-80">
        <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-full h-4 overflow-hidden border-2 border-red-500/50 shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-red-600 relative"
            initial={{ width: "100%" }}
            animate={{ width: `${(remainingCount / totalCount) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            <motion.div
              className="absolute right-0 top-0 h-full w-1 bg-yellow-400 shadow-lg"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </div>
        <div className="flex justify-between text-sm font-semibold mt-3">
          <div className="bg-white/90 px-3 py-1 rounded-full border border-red-500/30">
            <span className="text-red-600">{t('completedProgress')}: {Math.round(((totalCount - remainingCount) / totalCount) * 100)}%</span>
          </div>
          <div className="bg-white/90 px-3 py-1 rounded-full border border-blue-500/30">
            <span className="text-blue-600">{remainingCount}/{totalCount} {t('remainingCount')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}