'use client';

import { useApp } from '@/hooks/use-app';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';

export function DashboardHeader() {
  const { logout, translations } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <Logo />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <LanguageSwitcher />
            <Button variant="ghost" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              {translations.logout}
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
