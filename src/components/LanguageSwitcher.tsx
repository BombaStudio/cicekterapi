'use client';

import { useApp } from '@/hooks/use-app';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const { lang, setLang } = useApp();

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'tr' : 'en');
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleLanguage} aria-label="Switch language">
      <Languages className="h-5 w-5" />
    </Button>
  );
}
