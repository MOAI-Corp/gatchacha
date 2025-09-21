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
import { RotateCcw, Save } from 'lucide-react';
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

      <div className="max-w-7xl mx-auto">
        {/* Header with Language Selector */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {/* Language Selector */}
          <div className="flex justify-end mb-6">
            <LanguageSelector />
          </div>

          <div className="relative inline-block mb-6">
            <h1 className="text-6xl font-bold text-japanese-title flex items-center justify-center gap-4">
              <img src="/icon.png" alt="" />{t('title')}<img src="/icon.png" alt="" />
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
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
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
              {/* 컨트롤 패널 */}
              <Card className="col-span-1 mt-6 bg-card/80 backdrop-blur-sm border border-primary/20 card-hover">
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
            </motion.div>

            {/* 사이드 패널 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="col-span-3 space-y-4 overflow-y-auto"
            >
              {/* 일본 복권판 스타일 통계 */}
              <Card className="bg-gradient-to-br from-red-50 to-yellow-50 border-4 border-red-500 rounded-2xl relative overflow-hidden">
                {/* 복권판 배경 패턴 */}
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23dc2626' fill-opacity='0.4'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm0 0c0 5.5 4.5 10 10 10s10-4.5 10-10-4.5-10-10-10-10 4.5-10 10z'/%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '20px 20px'
                  }} />
                </div>

                {/* 복권판 헤더 */}
                <CardHeader className="relative z-10 bg-gradient-to-r from-red-600 to-red-700 text-white border-b-4 border-yellow-400">
                  <CardTitle className="flex items-center justify-center gap-3 text-2xl font-bold">
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="text-3xl"
                    >
                      🎟️
                    </motion.div>
                    <span className="text-shadow">{t('statistics')}</span>
                    <motion.div
                      animate={{
                        rotate: [360, 0],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="text-3xl"
                    >
                      📋
                    </motion.div>
                  </CardTitle>
                  {/* 복권판 테두리 장식 */}
                  <div className="absolute top-2 left-2 w-6 h-6 bg-yellow-400 rounded-full border-2 border-white"></div>
                  <div className="absolute top-2 right-2 w-6 h-6 bg-yellow-400 rounded-full border-2 border-white"></div>
                </CardHeader>

                <CardContent className="relative z-10 p-4">
                  <div className="space-y-4">
                    {/* 메인 통계 박스들 */}
                    <div className="grid grid-cols-4 gap-3">
                      <motion.div
                        className="bg-white/90 border-3 border-red-400 rounded-xl p-3 text-center shadow-lg"
                        whileHover={{ scale: 1.05, rotate: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="text-xs text-gray-600 font-semibold">{t('totalItems')}</div>
                        <div className="text-xl font-bold text-red-600">{totalCount}</div>
                      </motion.div>

                      <motion.div
                        className="bg-white/90 border-3 border-blue-400 rounded-xl p-3 text-center shadow-lg"
                        whileHover={{ scale: 1.05, rotate: -1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="text-xs text-gray-600 font-semibold">{t('remainingItems')}</div>
                        <div className="text-xl font-bold text-blue-600">{remainingCount}</div>
                      </motion.div>

                      <motion.div
                        className="bg-white/90 border-3 border-green-400 rounded-xl p-3 text-center shadow-lg"
                        whileHover={{ scale: 1.05, rotate: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="text-xs text-gray-600 font-semibold">{t('drawnItems')}</div>
                        <div className="text-xl font-bold text-green-600">{drawnItems.length}</div>
                      </motion.div>

                      <motion.div
                        className="bg-white/90 border-3 border-purple-400 rounded-xl p-3 text-center shadow-lg"
                        whileHover={{ scale: 1.05, rotate: -1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="text-xs text-gray-600 font-semibold">{t('progress')}</div>
                        <div className="text-xl font-bold text-purple-600">
                          {Math.round(((totalCount - remainingCount) / totalCount) * 100)}%
                        </div>
                      </motion.div>
                    </div>

                    {/* 진행률 바 - 복권판 스타일 */}
                    <div className="bg-white/90 border-3 border-red-400 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-red-700 flex items-center gap-2 text-sm">
                          <span className="text-lg">🎯</span>
                          전체 진행률
                        </span>
                        <span className="bg-red-100 px-2 py-1 rounded-full text-red-700 font-bold text-sm">
                          {Math.round(((totalCount - remainingCount) / totalCount) * 100)}%
                        </span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-4 overflow-hidden border-2 border-red-300">
                        <motion.div
                          className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 relative"
                          initial={{ width: 0 }}
                          animate={{ width: `${((totalCount - remainingCount) / totalCount) * 100}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          />
                        </motion.div>
                      </div>
                    </div>
                  </div>

                    {/* 일본 쿠지판 스타일 등급별 디스플레이 */}
                    {currentTemplate && (
                      <div className="bg-gradient-to-br from-red-100 via-white to-yellow-100 border-6 border-red-600 rounded-2xl p-4 relative shadow-2xl">
                        {/* 쿠지판 장식 헤더 */}

                        {/* 쿠지판 메인 보드 */}
                        <div className="bg-white/60 border-3 border-red-400 rounded-xl p-3 relative">
                          {/* 일본 전통 패턴 배경 */}
                          <div className="absolute inset-0 opacity-5">
                            <div className="w-full h-full" style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23dc2626'%3E%3Cpath d='M30 0c16.569 0 30 13.431 30 30s-13.431 30-30 30S0 46.569 0 30 13.431 0 30 0zM15 30c0-8.284 6.716-15 15-15s15 6.716 15 15-6.716 15-15 15-15-6.716-15-15z'/%3E%3C/g%3E%3C/svg%3E")`,
                              backgroundSize: '30px 30px'
                            }} />
                          </div>

                          <div className="relative z-10 space-y-2">
                            {[1, 2, 3, 4, 5].map((tier) => {
                              const tierItems = currentTemplate.items.filter(item => item.tier === tier);
                              const drawnTierItems = tierItems.filter(item => item.drawn);

                              if (tierItems.length === 0) return null;

                              const tierNames = {
                                1: t('tierNames.1'),
                                2: t('tierNames.2'),
                                3: t('tierNames.3'),
                                4: t('tierNames.4'),
                                5: t('tierNames.5')
                              };

                              const tierData = {
                                1: { label: "特等賞", color: "from-yellow-300 to-orange-400", emoji: "🏆", border: "border-yellow-500" },
                                2: { label: "一等賞", color: "from-purple-300 to-pink-400", emoji: "🥇", border: "border-purple-500" },
                                3: { label: "二等賞", color: "from-blue-300 to-cyan-400", emoji: "🥈", border: "border-blue-500" },
                                4: { label: "三等賞", color: "from-green-300 to-emerald-400", emoji: "🥉", border: "border-green-500" },
                                5: { label: "参加賞", color: "from-gray-300 to-gray-400", emoji: "🎖️", border: "border-gray-500" }
                              };

                              const data = tierData[tier as keyof typeof tierData];

                              return (
                                <motion.div
                                  key={tier}
                                  initial={{ opacity: 0, x: -50 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: tier * 0.15, type: "spring", stiffness: 100 }}
                                  className={`bg-gradient-to-r ${data.color} ${data.border} border-3 rounded-xl p-3 shadow-lg relative overflow-hidden`}
                                >

                                  {/* 점선 구분선 */}
                                  <div className="absolute left-8 right-8 top-0 bottom-0 border-l-2 border-r-2 border-dashed border-white/40"></div>

                                  <div className="relative z-10 flex items-center justify-between">
                                    {/* 왼쪽: 등급 정보 */}
                                    <div className="flex items-center gap-3">
                                      <div className="bg-white/90 rounded-full p-2 border-2 border-gray-600">
                                        <span className="text-2xl">{data.emoji}</span>
                                      </div>
                                      <div>
                                        <div className="bg-white/80 px-3 py-1 rounded-lg border-2 border-gray-600">
                                          <p className="text-xs text-gray-600 font-semibold">{tierNames[tier as keyof typeof tierNames]} 등급</p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* 가운데: 뽑기판 스타일 슬롯 그리드 */}
                                    <div className="flex-1 mx-4">
                                      <div className="grid grid-cols-8 gap-1 bg-white/80 p-2 rounded-lg border-2 border-gray-600">
                                        {tierItems.map((item, index) => (
                                          <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.05, type: "spring" }}
                                            className={`w-6 h-6 border-2 rounded-md flex items-center justify-center text-xs ${
                                              item.drawn
                                                ? `bg-gradient-to-br ${data.color} border-gray-700 shadow-md`
                                                : 'bg-gray-100 border-gray-400 hover:bg-gray-200'
                                            }`}
                                          >
                                            {item.drawn ? (
                                              <motion.span
                                                initial={{ scale: 0, rotate: -180 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{ type: "spring", stiffness: 200 }}
                                                className="text-lg"
                                              >
                                                {data.emoji}
                                              </motion.span>
                                            ) : (
                                              <span className="text-gray-400 text-xs">📦</span>
                                            )}
                                          </motion.div>
                                        ))}
                                      </div>
                                      <div className="flex justify-center mt-1 text-xs font-bold">
                                        <span className="text-gray-700">{drawnTierItems.length}/{tierItems.length} 완료</span>
                                      </div>
                                    </div>

                                    {/* 오른쪽: 수량 정보 */}
                                    <div className="text-right">
                                      <div className="bg-white/90 rounded-lg p-2 border-2 border-gray-600 min-w-[100px]">
                                        <div className="text-lg font-bold text-red-600 mb-1">
                                          {drawnTierItems.length}/{tierItems.length}
                                        </div>
                                        <div className="text-xs text-gray-600 font-semibold">
                                          남은: <span className="text-blue-600">{tierItems.length - drawnTierItems.length}장</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* 고등급 특수 효과 */}
                                  {tier <= 2 && (
                                    <>
                                      <motion.div
                                        className="absolute top-2 left-1/2 transform -translate-x-1/2 text-3xl"
                                        animate={{
                                          scale: [1, 1.4, 1],
                                          rotate: [0, 180, 360],
                                        }}
                                        transition={{ duration: 3, repeat: Infinity, delay: tier * 0.7 }}
                                      >
                                        ✨
                                      </motion.div>
                                      <motion.div
                                        className="absolute bottom-2 right-1/4 text-2xl"
                                        animate={{
                                          scale: [1, 1.2, 1],
                                          opacity: [0.5, 1, 0.5],
                                        }}
                                        transition={{ duration: 2, repeat: Infinity, delay: tier * 0.4 }}
                                      >
                                        🌟
                                      </motion.div>
                                    </>
                                  )}
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>


                        {/* 쿠지판 모서리 장식들 */}
                        <div className="absolute -top-4 -left-4 w-12 h-12 bg-yellow-400 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                          <span className="text-2xl">🎯</span>
                        </div>
                        <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                          <span className="text-2xl">🏮</span>
                        </div>
                        <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-yellow-400 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                          <span className="text-2xl">🌸</span>
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                          <span className="text-2xl">⛩️</span>
                        </div>
                      </div>
                    )}
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