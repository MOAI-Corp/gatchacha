// 다국어 지원 시스템
export type Language = 'ko' | 'en';

export interface Translations {
  // 메인 페이지
  title: string;
  subtitle: string;
  drawTicket: string;
  drawButton: string;
  drawingInProgress: string;
  completed: string;
  lotteryBox: string;

  // 결과 모달
  resultTitle: string;
  congratulations: {
    legendary: string;
    epic: string;
    rare: string;
    common: string;
  };
  prizeRanks: {
    legendary: string;
    epic: string;
    rare: string;
    uncommon: string;
    common: string;
  };
  confirm: string;

  // 컨트롤 패널
  controls: string;
  saveState: string;
  reset: string;
  statistics: string;

  // 통계
  totalItems: string;
  remainingItems: string;
  drawnItems: string;
  progress: string;
  drawn: string;
  remaining: string;
  recentResults: string;

  // 진행률
  completedProgress: string;
  remainingCount: string;

  // PWA
  pwaInstall: string;

  // 등급명
  tierNames: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
  };

  // 언어 선택
  language: string;
  korean: string;
  english: string;
}

export const translations: Record<Language, Translations> = {
  ko: {
    title: 'Gatchacha',
    subtitle: '인터넷 뽑기',
    drawTicket: '뽑기 티켓',
    drawButton: '뽑기 시작!',
    drawingInProgress: '뽑는 중...',
    completed: '완료!',
    lotteryBox: '추첨함',

    resultTitle: '당첨 발표!',
    congratulations: {
      legendary: '축하합니다!',
      epic: '대단해요!',
      rare: '잘하셨어요!',
      common: '감사합니다!',
    },
    prizeRanks: {
      legendary: '특등상',
      epic: '1등상',
      rare: '2등상',
      uncommon: '3등상',
      common: '참가상',
    },
    confirm: '확인',

    controls: '컨트롤',
    saveState: '상태 저장',
    reset: '리셋',
    statistics: '통계',

    totalItems: '전체 갯수',
    remainingItems: '남은 갯수',
    drawnItems: '뽑은 갯수',
    progress: '진행률',
    drawn: '뽑음',
    remaining: '남음',
    recentResults: '최근 뽑기 결과',

    completedProgress: '완료',
    remainingCount: '개 남음',

    pwaInstall: '브라우저 메뉴에서 "홈 화면에 추가"를 선택하여 앱으로 설치하세요!',

    tierNames: {
      1: '전설',
      2: '영웅',
      3: '희귀',
      4: '고급',
      5: '일반',
    },

    language: '언어',
    korean: '한국어',
    english: 'English',
  },

  en: {
    title: 'Gatchacha',
    subtitle: 'Internet Lottery',
    drawTicket: 'Draw Ticket',
    drawButton: 'Start Draw!',
    drawingInProgress: 'Drawing...',
    completed: 'Complete!',
    lotteryBox: 'Lottery Box',

    resultTitle: 'Prize Announcement!',
    congratulations: {
      legendary: 'Congratulations!',
      epic: 'Amazing!',
      rare: 'Well done!',
      common: 'Thank you!',
    },
    prizeRanks: {
      legendary: 'Grand Prize',
      epic: '1st Prize',
      rare: '2nd Prize',
      uncommon: '3rd Prize',
      common: 'Participation Prize',
    },
    confirm: 'OK',

    controls: 'Controls',
    saveState: 'Save State',
    reset: 'Reset',
    statistics: 'Statistics',

    totalItems: 'Total Items',
    remainingItems: 'Remaining Items',
    drawnItems: 'Drawn Items',
    progress: 'Progress',
    drawn: 'Drawn',
    remaining: 'Remaining',
    recentResults: 'Recent Results',

    completedProgress: 'Complete',
    remainingCount: ' remaining',

    pwaInstall: 'Select "Add to Home Screen" from the browser menu to install as an app!',

    tierNames: {
      1: 'Legendary',
      2: 'Epic',
      3: 'Rare',
      4: 'Uncommon',
      5: 'Common',
    },

    language: 'Language',
    korean: '한국어',
    english: 'English',
  },
};

// 언어 상태 관리
let currentLanguage: Language = 'ko';

export const getCurrentLanguage = (): Language => currentLanguage;

export const setLanguage = (language: Language): void => {
  currentLanguage = language;
  localStorage.setItem('gacha-language', language);

  // 언어 변경 이벤트 발생
  window.dispatchEvent(new CustomEvent('languageChange', { detail: language }));
};

export const initializeLanguage = (): Language => {
  const savedLanguage = localStorage.getItem('gacha-language') as Language;
  if (savedLanguage && (savedLanguage === 'ko' || savedLanguage === 'en')) {
    currentLanguage = savedLanguage;
  }
  return currentLanguage;
};

export const t = (key: keyof Translations | string): string => {
  const keys = key.split('.');
  let value: any = translations[currentLanguage];

  for (const k of keys) {
    value = value?.[k];
  }

  return value || key;
};

// 중첩된 객체 접근을 위한 헬퍼 함수
export const getNestedTranslation = (path: string): string => {
  const keys = path.split('.');
  let value: any = translations[currentLanguage];

  for (const key of keys) {
    value = value?.[key];
  }

  return value || path;
};