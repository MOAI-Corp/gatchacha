import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { GachaWheel } from '@/components/GachaWheel';
import { ResultModal } from '@/components/ResultModal';
import { TemplateSelector } from '@/components/TemplateSelector';
import { gachaTemplates, getTemplate } from '@/lib/templates';
import { GachaItem, GachaTemplate, drawGacha, resetGacha } from '@/lib/gacha';
import { RotateCcw, Save, Download, Sparkles } from 'lucide-react';

const Index = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('default');
  const [currentTemplate, setCurrentTemplate] = useState<GachaTemplate | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnItem, setDrawnItem] = useState<GachaItem | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [drawnItems, setDrawnItems] = useState<GachaItem[]>([]);
  const { toast } = useToast();

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
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold text-gradient mb-4 flex items-center justify-center gap-4">
            <Sparkles className="w-12 h-12" />
            뽑기판
            <Sparkles className="w-12 h-12" />
          </h1>
          <p className="text-xl text-muted-foreground">화려한 이펙트와 함께하는 마법의 뽑기 시스템</p>
        </motion.div>

        {/* 템플릿 선택 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
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
              <Card className="p-6 bg-card/80 backdrop-blur-sm border border-primary/20">
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
              <Card className="bg-card/80 backdrop-blur-sm border border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RotateCcw className="w-5 h-5" />
                    컨트롤
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={saveState}
                    variant="outline"
                    className="w-full"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    상태 저장
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="destructive"
                    className="w-full"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    리셋
                  </Button>
                </CardContent>
              </Card>

              {/* 통계 */}
              <Card className="bg-card/80 backdrop-blur-sm border border-primary/20">
                <CardHeader>
                  <CardTitle>통계</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>총 아이템:</span>
                      <span className="font-semibold">{totalCount}개</span>
                    </div>
                    <div className="flex justify-between">
                      <span>남은 아이템:</span>
                      <span className="font-semibold">{remainingCount}개</span>
                    </div>
                    <div className="flex justify-between">
                      <span>뽑은 아이템:</span>
                      <span className="font-semibold">{drawnItems.length}개</span>
                    </div>
                    <div className="flex justify-between">
                      <span>진행률:</span>
                      <span className="font-semibold">
                        {Math.round(((totalCount - remainingCount) / totalCount) * 100)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 최근 뽑기 결과 */}
              {drawnItems.length > 0 && (
                <Card className="bg-card/80 backdrop-blur-sm border border-primary/20">
                  <CardHeader>
                    <CardTitle>최근 뽑기 결과</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {drawnItems.slice(-5).reverse().map((item, index) => (
                        <div key={`${item.id}-${index}`} className="flex items-center justify-between text-sm">
                          <span className="truncate">{item.name}</span>
                          <span className={`font-semibold ${
                            item.tier === 1 ? 'text-legendary' :
                            item.tier === 2 ? 'text-epic' :
                            item.tier === 3 ? 'text-rare' :
                            item.tier === 4 ? 'text-uncommon' :
                            'text-common'
                          }`}>
                            {item.tier}등급
                          </span>
                        </div>
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
              브라우저 메뉴에서 "홈 화면에 추가"를 선택하여 앱으로 설치하세요!
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