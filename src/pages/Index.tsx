import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { GachaWheel } from '@/components/GachaWheel';
import { ResultModal } from '@/components/ResultModal';
import { TemplateSelector } from '@/components/TemplateSelector';
import { LanguageSelector } from '@/components/LanguageSelector';
import { gachaTemplates, getTemplate } from '@/lib/templates';
import { GachaItem, GachaTemplate, drawGacha, resetGacha } from '@/lib/gacha';
import { RotateCcw, Save, Download, Sparkles, Star, Crown, Gem, Award, Medal } from 'lucide-react';
import { initializeLanguage, t } from '@/lib/i18n';

const Index = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('default');
  const [currentTemplate, setCurrentTemplate] = useState<GachaTemplate | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnItem, setDrawnItem] = useState<GachaItem | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [drawnItems, setDrawnItems] = useState<GachaItem[]>([]);
  const [, setLanguageUpdate] = useState(0); // 언어 변경 시 리렌더링용
  const { toast } = useToast();

  // 언어 초기화
  useEffect(() => {
    initializeLanguage();

    const handleLanguageChange = () => {
      setLanguageUpdate(prev => prev + 1);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);

  // 템플릿 변경 시 현재 템플릿 업데이트
  useEffect(() => {
    const template = getTemplate(selectedTemplate);
    if (template) {
      // 저장된 상태가 있으면 불러오기
      const savedState = localStorage.getItem(`gacha-${selectedTemplate}`);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        setCurrentTemplate({
          ...template,
          items: parsedState.items || template.items
        });
        setDrawnItems(parsedState.drawnItems || []);
      } else {
        setCurrentTemplate({ ...template });
        setDrawnItems([]);
      }
    }
  }, [selectedTemplate]);

  // 상태 저장
  const saveState = () => {
    if (currentTemplate) {
      const stateToSave = {
        items: currentTemplate.items,
        drawnItems: drawnItems
      };
      localStorage.setItem(`gacha-${selectedTemplate}`, JSON.stringify(stateToSave));
      toast({
        title: "저장 완료!",
        description: "현재 상태가 저장되었습니다.",
      });
    }
  };

  // 뽑기 실행
  const handleDraw = async () => {
    if (!currentTemplate) return;

    setIsDrawing(true);
    
    // 애니메이션을 위한 딜레이
    setTimeout(() => {
      const result = drawGacha(currentTemplate.items);
      
      if (result) {
        // 아이템을 뽑힌 상태로 마킹
        const updatedItems = currentTemplate.items.map(item => 
          item.id === result.id ? { ...item, drawn: true } : item
        );
        
        setCurrentTemplate({
          ...currentTemplate,
          items: updatedItems
        });
        
        setDrawnItem(result);
        setDrawnItems(prev => [...prev, result]);
        setShowResult(true);
        
        // 자동 저장
        const stateToSave = {
          items: updatedItems,
          drawnItems: [...drawnItems, result]
        };
        localStorage.setItem(`gacha-${selectedTemplate}`, JSON.stringify(stateToSave));
      } else {
        toast({
          title: "뽑기 완료!",
          description: "모든 아이템을 뽑았습니다!",
          variant: "default",
        });
      }
      
      setIsDrawing(false);
    }, 2000);
  };

  // 리셋
  const handleReset = () => {
    if (currentTemplate) {
      resetGacha(currentTemplate.items);
      setCurrentTemplate({
        ...currentTemplate,
        items: currentTemplate.items.map(item => ({ ...item, drawn: false }))
      });
      setDrawnItems([]);
      setDrawnItem(null);
      
      // 저장된 상태 삭제
      localStorage.removeItem(`gacha-${selectedTemplate}`);
      
      toast({
        title: "리셋 완료!",
        description: "모든 아이템이 초기화되었습니다.",
      });
    }
  };

  const remainingCount = currentTemplate ? currentTemplate.items.filter(item => !item.drawn).length : 0;
  const totalCount = currentTemplate ? currentTemplate.items.length : 0;

  return (
    <div className="min-h-screen py-8 px-4 relative overflow-hidden japanese-pattern">
      {/* Japanese Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-red-500/5" />
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Japanese themed floating elements */}
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={`sakura-${i}`}
              className="absolute text-2xl"
              animate={{
                x: [0, 150, 0],
                y: [0, -120, 0],
                rotate: [0, 360, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 12 + 8,
                repeat: Infinity,
                delay: Math.random() * 6,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            >
              {i % 4 === 0 ? '🌸' : i % 4 === 1 ? '🎌' : i % 4 === 2 ? '⛩️' : '🏮'}
            </motion.div>
          ))}
          {/* Traditional Japanese confetti */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={`confetti-${i}`}
              className="absolute w-3 h-3 japanese-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with Language Selector */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          {/* Language Selector */}
          <div className="flex justify-end mb-6">
            <LanguageSelector />
          </div>

          <div className="relative inline-block mb-6">
            <h1 className="text-6xl font-bold text-japanese-title mb-4 flex items-center justify-center gap-4">
              <img src="/icon.png" alt="" />{t('title')}
            </h1>
            <motion.div
              className="absolute -top-2 -left-2 text-4xl"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ✨
            </motion.div>
            <motion.div
              className="absolute -top-2 -right-2 text-4xl"
              animate={{
                rotate: [360, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
            >
              ✨
            </motion.div>
          </div>
        </motion.div>

        {/* 템플릿 선택 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 flex justify-center"
        >
          <TemplateSelector
            templates={gachaTemplates}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={setSelectedTemplate}
          />
        </motion.div>

        {/* 메인 뽑기 영역 */}
        {currentTemplate && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* 뽑기 휠 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2"
            >
              <Card className="p-6 ichiban-ticket bg-card/90 backdrop-blur-sm border-4 border-red-500/30">
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-2xl">🎫</span>
                    <h3 className="text-2xl font-bold text-japanese-title">{t('drawTicket')}</h3>
                    <span className="text-2xl">🎫</span>
                  </div>
                  <p className="text-sm text-muted-foreground">※ 당첨 확률은 각 등급별로 설정되어 있습니다</p>
                </div>
                <GachaWheel
                  onDraw={handleDraw}
                  isDrawing={isDrawing}
                  drawnItem={drawnItem}
                  remainingCount={remainingCount}
                  totalCount={totalCount}
                />
              </Card>
            </motion.div>

            {/* 사이드 패널 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-6"
            >
              {/* 컨트롤 패널 */}
              <Card className="bg-card/80 backdrop-blur-sm border border-primary/20 card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    >
                      <RotateCcw className="w-5 h-5" />
                    </motion.div>
                    {t('controls')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={saveState}
                      variant="outline"
                      className="w-full glow border-green-500/50 hover:border-green-500 hover:bg-green-500/10"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {t('saveState')}
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleReset}
                      variant="destructive"
                      className="w-full glow hover:bg-red-500/80"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      {t('reset')}
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>

              {/* 통계 */}
              <Card className="bg-card/80 backdrop-blur-sm border border-primary/20 card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      📊
                    </motion.div>
                    {t('statistics')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* 전체 통계 */}
                    <div className="space-y-2 text-sm border-b border-muted/30 pb-3">
                      <div className="flex justify-between">
                        <span>{t('totalItems')}:</span>
                        <span className="font-semibold text-primary">{totalCount}개</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('remainingItems')}:</span>
                        <span className="font-semibold text-blue-500">{remainingCount}개</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('drawnItems')}:</span>
                        <span className="font-semibold text-green-500">{drawnItems.length}개</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('progress')}:</span>
                        <span className="font-semibold text-accent">
                          {Math.round(((totalCount - remainingCount) / totalCount) * 100)}%
                        </span>
                      </div>
                    </div>

                    {/* 등급별 상세 통계 */}
                    {currentTemplate && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-muted-foreground">등급별 상세</h4>
                        {[1, 2, 3, 4, 5].map((tier) => {
                          const tierItems = currentTemplate.items.filter(item => item.tier === tier);
                          const drawnTierItems = tierItems.filter(item => item.drawn);
                          const remainingTierItems = tierItems.filter(item => !item.drawn);

                          if (tierItems.length === 0) return null;

                          const tierNames = {
                            1: t('tierNames.1'),
                            2: t('tierNames.2'),
                            3: t('tierNames.3'),
                            4: t('tierNames.4'),
                            5: t('tierNames.5')
                          };

                          const tierColorClasses = {
                            1: "text-legendary",
                            2: "text-epic",
                            3: "text-rare",
                            4: "text-uncommon",
                            5: "text-common"
                          };

                          return (
                            <motion.div
                              key={tier}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: tier * 0.1 }}
                              className="bg-muted/20 rounded-lg p-3 space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <span className={`font-semibold text-sm ${tierColorClasses[tier as keyof typeof tierColorClasses]}`}>
                                  {tierNames[tier as keyof typeof tierNames]} 등급
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {drawnTierItems.length}/{tierItems.length}
                                </span>
                              </div>

                              {/* 진행률 바 */}
                              <div className="bg-muted/50 rounded-full h-2 overflow-hidden progress-bar">
                                <motion.div
                                  className={`h-full ${
                                    tier === 1 ? 'bg-legendary' :
                                    tier === 2 ? 'bg-epic' :
                                    tier === 3 ? 'bg-rare' :
                                    tier === 4 ? 'bg-uncommon' :
                                    'bg-common'
                                  }`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(drawnTierItems.length / tierItems.length) * 100}%` }}
                                  transition={{ duration: 0.8, delay: tier * 0.1 }}
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">{t('drawn')}:</span>
                                  <span className="font-medium text-green-500">{drawnTierItems.length}개</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">{t('remaining')}:</span>
                                  <span className="font-medium text-blue-500">{remainingTierItems.length}개</span>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 최근 뽑기 결과 */}
              {drawnItems.length > 0 && (
                <Card className="bg-card/80 backdrop-blur-sm border border-primary/20 card-hover">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        🎁
                      </motion.div>
                      {t('recentResults')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                      {drawnItems.slice(-5).reverse().map((item, index) => (
                        <motion.div
                          key={`${item.id}-${index}`}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex items-center justify-between text-sm p-2 rounded-lg bg-muted/20 border-l-4 ${
                            item.tier === 1 ? 'border-l-legendary bg-legendary/10' :
                            item.tier === 2 ? 'border-l-epic bg-epic/10' :
                            item.tier === 3 ? 'border-l-rare bg-rare/10' :
                            item.tier === 4 ? 'border-l-uncommon bg-uncommon/10' :
                            'border-l-common bg-common/10'
                          }`}
                        >
                          <span className="truncate font-medium">{item.name}</span>
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold text-xs px-2 py-1 rounded-full tier-badge ${
                              item.tier === 1 ? 'text-legendary bg-legendary/20' :
                              item.tier === 2 ? 'text-epic bg-epic/20' :
                              item.tier === 3 ? 'text-rare bg-rare/20' :
                              item.tier === 4 ? 'text-uncommon bg-uncommon/20' :
                              'text-common bg-common/20'
                            }`}>
                              {item.tier}등급
                            </span>
                            {item.tier <= 2 && (
                              <motion.div
                                animate={{ rotate: [0, 180, 360] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="sparkle"
                              >
                                ✨
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        )}

        {/* PWA 안내 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Card className="inline-block bg-card/60 backdrop-blur-sm border border-primary/20 px-6 py-3">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Download className="w-4 h-4" />
              {t('pwaInstall')}
            </p>
          </Card>
        </motion.div>
      </div>

      {/* 결과 모달 */}
      <ResultModal
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        item={drawnItem}
      />
    </div>
  );
};

export default Index;