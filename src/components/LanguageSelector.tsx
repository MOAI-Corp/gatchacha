import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages, Globe } from 'lucide-react';
import { Language, getCurrentLanguage, setLanguage, t } from '@/lib/i18n';

export function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState<Language>(getCurrentLanguage());

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setCurrentLang(event.detail);
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  const handleLanguageChange = (language: Language) => {
    setLanguage(language);
    setCurrentLang(language);
  };

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'ko', name: t('korean'), flag: '🇰🇷' },
    { code: 'en', name: t('english'), flag: '🇺🇸' },
  ];

  const currentLanguageInfo = languages.find(lang => lang.code === currentLang);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="outline"
            className="flex items-center gap-2 japanese-button border-2 border-red-500/50 hover:border-red-500"
          >
            <Globe className="w-4 h-4" />
            <span className="text-lg">{currentLanguageInfo?.flag}</span>
            <span className="hidden sm:inline font-semibold">
              {currentLanguageInfo?.name}
            </span>
            <Languages className="w-4 h-4" />
          </Button>
        </motion.div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="backdrop-blur-sm border-2 border-red-500/30 rounded-lg"
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer rounded-md transition-all ${
              currentLang === language.code
                ? 'bg-red-100 text-red-700 font-semibold'
                : 'hover:bg-gray-100'
            }`}
          >
            <span className="text-xl">{language.flag}</span>
            <span className="font-medium">{language.name}</span>
            {currentLang === language.code && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-auto text-red-500"
              >
                ✓
              </motion.span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}