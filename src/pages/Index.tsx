import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GachaWheel } from '@/components/GachaWheel';
import { ResultModal } from '@/components/ResultModal';
import { TemplateSelector } from '@/components/TemplateSelector';
import { UserProfile } from '@/components/UserProfile';
import { GachaItem, GachaTemplate, drawGacha, resetGacha, tierNames, tierColors } from '@/lib/gacha';
import { useAuth } from '@/hooks/useAuth';
import { useGachaData } from '@/hooks/useGachaData';
import { RotateCcw, Sparkles, User, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Index() {
  const { user, loading: authLoading } = useAuth();
  const { templates, loading: templatesLoading, saveGachaResult } = useGachaData();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('00000000-0000-0000-0000-000000000001');
  const [currentTemplate, setCurrentTemplate] = useState<GachaTemplate | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnItem, setDrawnItem] = useState<GachaItem | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('gacha');
  const { toast } = useToast();

  // 템플릿에서 현재 템플릿 가져오기
  const getTemplateById = (id: string) => {
    return templates.find(template => template.id === id);
  };

  // 로컬스토리지에서 상태 로드 (비로그인 사용자용)
  useEffect(() => {
    const template = getTemplateById(selectedTemplate);
    if (template) {
      if (!user) {
        // 비로그인 사용자는 로컬스토리지 사용
        const savedState = localStorage.getItem(`gacha-state-${selectedTemplate}`);
        if (savedState) {
          try {
            const parsedState = JSON.parse(savedState);
            template.items = parsedState.items || template.items;
          } catch (error) {
            console.error('Failed to load saved state:', error);
          }
        }
      }
      setCurrentTemplate(template);
    }
  }, [selectedTemplate, templates, user]);

  // 상태 저장 (비로그인 사용자용)
  const saveState = (template: GachaTemplate) => {
    if (!user) {
      localStorage.setItem(`gacha-state-${template.id}`, JSON.stringify({
        items: template.items
      }));
    }
  };

  const handleDraw = async () => {
    if (!currentTemplate || isDrawing) return;

    setIsDrawing(true);
    
    setTimeout(async () => {
      const item = drawGacha(currentTemplate.items);
      
      if (item) {
        // 아이템을 뽑힘 상태로 변경
        item.drawn = true;
        setDrawnItem(item);
        saveState(currentTemplate);
        
        // 로그인한 사용자는 결과를 데이터베이스에 저장
        if (user) {
          await saveGachaResult(currentTemplate.id, currentTemplate.name, item);
        }
        
        toast({
          title: "뽑기 성공!",
          description: `${tierNames[item.tier]} 등급 "${item.name}"을(를) 획득했습니다!`,
        });
        
        setTimeout(() => {
          setShowResult(true);
          setIsDrawing(false);
        }, 1000);
      } else {
        toast({
          title: "뽑기 완료",
          description: "모든 아이템을 뽑았습니다!",
        });
        setIsDrawing(false);
      }
    }, 2000);
  };

  const handleReset = () => {
    if (!currentTemplate) return;
    
    resetGacha(currentTemplate.items);
    saveState(currentTemplate);
    setCurrentTemplate({ ...currentTemplate });
    
    toast({
      title: "리셋 완료",
      description: "모든 아이템이 다시 뽑을 수 있게 되었습니다!",
    });
  };

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleCloseResult = () => {
    setShowResult(false);
    setDrawnItem(null);
  };

  if (authLoading || templatesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentTemplate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">템플릿을 찾을 수 없습니다</h2>
          <Button onClick={() => setSelectedTemplate('00000000-0000-0000-0000-000000000001')}>
            기본 템플릿으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const remainingItems = currentTemplate.items.filter(item => !item.drawn).length;
  const totalItems = currentTemplate.items.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1"></div>
            <h1 className="text-4xl md:text-6xl font-bold text-gradient">
              ✨ 뽑기판 ✨
            </h1>
            <div className="flex-1 flex justify-end">
              {user ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('profile')}
                  className="flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  프로필
                </Button>
              ) : (
                <Link to="/auth">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    로그인
                  </Button>
                </Link>
              )}
            </div>
          </div>
          
          <p className="text-lg text-muted-foreground mb-6">
            운을 시험해보세요! 화려한 이펙트와 함께하는 뽑기 게임
          </p>
          
          {/* 현재 템플릿 정보 */}
          <Card className="inline-block px-6 py-3 bg-card/80 backdrop-blur-sm border-2 border-primary/20">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-semibold">{currentTemplate.name}</span>
              <Badge variant="outline">{currentTemplate.theme}</Badge>
            </div>
          </Card>
        </motion.header>

        {/* 메인 컨텐츠 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="gacha">뽑기</TabsTrigger>
            <TabsTrigger value="templates">템플릿</TabsTrigger>
            <TabsTrigger value="profile" disabled={!user}>프로필</TabsTrigger>
          </TabsList>

          <TabsContent value="gacha">
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              {/* 뽑기 휠 영역 */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <GachaWheel
                    onDraw={handleDraw}
                    isDrawing={isDrawing}
                    drawnItem={drawnItem}
                    remainingCount={remainingItems}
                    totalCount={totalItems}
                  />
                </motion.div>

                {/* 리셋 버튼 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center mt-8"
                >
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="lg"
                    className="px-8 py-3 border-2 border-primary/50 hover:border-primary"
                    disabled={remainingItems === totalItems}
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    리셋하기
                  </Button>
                </motion.div>
              </div>

              {/* 통계 및 템플릿 선택 영역 */}
              <div className="space-y-6">
                {/* 뽑기 통계 */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="p-6 bg-card/80 backdrop-blur-sm border-2 border-primary/20">
                    <h3 className="text-xl font-bold mb-4 text-center">현재 상태</h3>
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map(tier => {
                        const tierItems = currentTemplate.items.filter(item => item.tier === tier);
                        const drawnCount = tierItems.filter(item => item.drawn).length;
                        const totalCount = tierItems.length;
                        
                        return (
                          <div key={tier} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={tierColors[tier as keyof typeof tierColors] as any}
                                className="min-w-[60px] justify-center"
                              >
                                {tierNames[tier as keyof typeof tierNames]}
                              </Badge>
                            </div>
                            <div className="text-sm font-medium">
                              {drawnCount} / {totalCount}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <Separator className="my-4" />
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {totalItems - remainingItems} / {totalItems}
                      </div>
                      <div className="text-sm text-muted-foreground">전체 진행률</div>
                    </div>
                  </Card>
                </motion.div>

                {/* 템플릿 빠른 선택 */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="p-6 bg-card/80 backdrop-blur-sm border-2 border-primary/20">
                    <h3 className="text-xl font-bold mb-4 text-center">빠른 템플릿 변경</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {templates.slice(0, 3).map((template) => (
                        <Button
                          key={template.id}
                          variant={selectedTemplate === template.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleSelectTemplate(template.id)}
                          className="justify-start"
                        >
                          {template.name}
                        </Button>
                      ))}
                    </div>
                    <Separator className="my-4" />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      onClick={() => setActiveTab('templates')}
                    >
                      모든 템플릿 보기
                    </Button>
                  </Card>
                </motion.div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates">
            <TemplateSelector
              templates={templates}
              selectedTemplate={selectedTemplate}
              onSelectTemplate={(templateId) => {
                handleSelectTemplate(templateId);
                setActiveTab('gacha');
              }}
            />
          </TabsContent>

          <TabsContent value="profile">
            {user ? (
              <UserProfile />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">로그인이 필요합니다.</p>
                <Link to="/auth">
                  <Button>로그인하기</Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* 결과 모달 */}
        <AnimatePresence>
          {showResult && drawnItem && (
            <ResultModal
              isOpen={showResult}
              onClose={handleCloseResult}
              item={drawnItem}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}