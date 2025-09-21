import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Crown, Star, Diamond, Gem, Trophy, Award, Medal } from 'lucide-react';
import { GachaItem, tierColors, tierNames } from '@/lib/gacha';
import { t } from '@/lib/i18n';

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

  if (!item) return null;

  const TierIcon = tierIcons[item.tier];
  const tierColor = tierColors[item.tier];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto prize-banner backdrop-blur-sm border-4 border-red-600">
        {/* Japanese confetti animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 japanese-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <DialogHeader className="relative z-10">
          <DialogTitle className="text-center text-3xl font-bold">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="flex items-center justify-center gap-3 mb-2"
            >
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-4xl"
              >
                🎊
              </motion.span>
              <span className="text-japanese-title">{t('resultTitle')}</span>
              <motion.span
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-4xl"
              >
                🎊
              </motion.span>
            </motion.div>
            <div className="flex justify-center gap-2 text-2xl">
              <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }}>🌸</motion.span>
              <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}>🎌</motion.span>
              <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}>🏮</motion.span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="text-center py-8 relative z-10">
          {/* Japanese Prize Card */}
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.5 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
            className="relative mx-auto w-64 h-40 mb-6"
          >
            {/* Traditional Japanese prize ticket design */}
            <div className={`w-full h-full rounded-2xl border-4 p-6 relative overflow-hidden ${
              item.tier === 1 ? 'border-yellow-500 bg-gradient-to-br from-yellow-200 to-orange-300' :
              item.tier === 2 ? 'border-purple-500 bg-gradient-to-br from-purple-200 to-pink-300' :
              item.tier === 3 ? 'border-blue-500 bg-gradient-to-br from-blue-200 to-cyan-300' :
              item.tier === 4 ? 'border-green-500 bg-gradient-to-br from-green-200 to-emerald-300' :
              'border-gray-500 bg-gradient-to-br from-gray-200 to-gray-300'
            }`}>

              {/* Traditional Japanese pattern overlay */}
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23dc2626' fill-opacity='0.3'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: '30px 30px'
                }} />
              </div>

              {/* Prize content */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="mb-3"
                >
                  <TierIcon className={`w-16 h-16 ${
                    item.tier === 1 ? 'text-yellow-600' :
                    item.tier === 2 ? 'text-purple-600' :
                    item.tier === 3 ? 'text-blue-600' :
                    item.tier === 4 ? 'text-green-600' :
                    'text-gray-600'
                  }`} />
                </motion.div>
                <h3 className="font-bold text-xl text-gray-800 mb-1">{item.name}</h3>
                <div className="text-xs text-gray-600 border border-gray-400 px-2 py-1 rounded-full bg-white/50">
                  Prize #{item.id}
                </div>
              </div>

              {/* Corner decorations */}
              <div className="absolute top-2 left-2 text-2xl">🌸</div>
              <div className="absolute top-2 right-2 text-2xl">🌸</div>
              <div className="absolute bottom-2 left-2 text-2xl">🏮</div>
              <div className="absolute bottom-2 right-2 text-2xl">🏮</div>

              {/* Sparkle effects for high tier items */}
              {item.tier <= 2 && (
                <>
                  <motion.div
                    className="absolute top-1/4 left-1/4 text-2xl"
                    animate={{
                      scale: [0, 1.5, 0],
                      rotate: [0, 180, 360],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                  >
                    ✨
                  </motion.div>
                  <motion.div
                    className="absolute top-3/4 right-1/4 text-2xl"
                    animate={{
                      scale: [0, 1.5, 0],
                      rotate: [360, 180, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  >
                    ✨
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>

          {/* Japanese Style Prize Rank Banner */}
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: "spring", duration: 0.8 }}
            className="mb-6"
          >
            <div className={`inline-block px-8 py-3 rounded-full border-4 font-bold text-xl relative ${
              item.tier === 1 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 border-yellow-600 text-white' :
              item.tier === 2 ? 'bg-gradient-to-r from-purple-400 to-pink-500 border-purple-600 text-white' :
              item.tier === 3 ? 'bg-gradient-to-r from-blue-400 to-cyan-500 border-blue-600 text-white' :
              item.tier === 4 ? 'bg-gradient-to-r from-green-400 to-emerald-500 border-green-600 text-white' :
              'bg-gradient-to-r from-gray-400 to-gray-500 border-gray-600 text-white'
            }`}>
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {item.tier === 1 ? '🏆 ' : item.tier === 2 ? '🥇 ' : item.tier === 3 ? '🥈 ' : item.tier === 4 ? '🥉 ' : '🎖️ '}
                {t(`prizeRanks.${item.tier === 1 ? 'legendary' : item.tier === 2 ? 'epic' : item.tier === 3 ? 'rare' : item.tier === 4 ? 'uncommon' : 'common'}`)} 등급
                {item.tier === 1 ? ' 🏆' : item.tier === 2 ? ' 🥇' : item.tier === 3 ? ' 🥈' : item.tier === 4 ? ' 🥉' : ' 🎖️'}
              </motion.span>

              {/* Prize rank ribbon effect */}
              <div className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
            </div>
          </motion.div>

          {/* Japanese Congratulations Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mb-6"
          >
            {item.tier === 1 && (
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-4 border-yellow-500 rounded-2xl p-4 mx-4">
                <p className="text-yellow-700 font-bold text-2xl flex items-center justify-center gap-2">
                  <motion.span animate={{ rotate: [0, 360] }} transition={{ duration: 2, repeat: Infinity }}>🎊</motion.span>
                  {t('congratulations.legendary')}
                  <motion.span animate={{ rotate: [360, 0] }} transition={{ duration: 2, repeat: Infinity }}>🎊</motion.span>
                </p>
                <p className="text-yellow-600 font-semibold text-lg mt-2">{t('prizeRanks.legendary')}을 획득하셨습니다!</p>
              </div>
            )}
            {item.tier === 2 && (
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-4 border-purple-500 rounded-2xl p-4 mx-4">
                <p className="text-purple-700 font-bold text-xl flex items-center justify-center gap-2">
                  <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>✨</motion.span>
                  {t('congratulations.epic')}
                  <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}>✨</motion.span>
                </p>
                <p className="text-purple-600 font-semibold">{t('prizeRanks.epic')}을 획득하셨습니다!</p>
              </div>
            )}
            {item.tier === 3 && (
              <div className="bg-gradient-to-r from-blue-100 to-cyan-100 border-4 border-blue-500 rounded-2xl p-4 mx-4">
                <p className="text-blue-700 font-bold text-lg flex items-center justify-center gap-2">
                  💎 {t('congratulations.rare')} 💎
                </p>
                <p className="text-blue-600 font-semibold">{t('prizeRanks.rare')}을 획득하셨습니다!</p>
              </div>
            )}
            {item.tier >= 4 && (
              <div className="bg-gradient-to-r from-gray-100 to-green-100 border-4 border-green-500 rounded-2xl p-4 mx-4">
                <p className="text-green-700 font-bold flex items-center justify-center gap-2">
                  🌸 {t('congratulations.common')} 🌸
                </p>
                <p className="text-green-600 font-semibold">상품을 획득하셨습니다!</p>
              </div>
            )}
          </motion.div>

          {/* Japanese Style Confirmation Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <Button
              onClick={onClose}
              className="px-10 py-4 text-xl font-bold japanese-button"
            >
              <motion.div
                className="flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="text-2xl"
                >
                  🌸
                </motion.span>
                {t('confirm')}
                <motion.span
                  animate={{ rotate: [360, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="text-2xl"
                >
                  🌸
                </motion.span>
              </motion.div>
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}