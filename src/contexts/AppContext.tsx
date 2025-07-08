'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { locales, Language, Translations } from '@/lib/locales';

type SurveyData = {
  healthStatus: string;
  dailyChallenges: string[];
  helpBarriers: string[];
  additionalInfo: string;
};

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  translations: Translations;
  isAuthenticated: boolean;
  isSurveyCompleted: boolean;
  surveyData: SurveyData | null;
  login: () => void;
  logout: () => void;
  completeSurvey: (data: SurveyData) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('tr');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSurveyCompleted, setIsSurveyCompleted] = useState(false);
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedLang = localStorage.getItem('cicek_terapi_lang') as Language;
    if (storedLang && locales[storedLang]) {
      setLang(storedLang);
    }
    
    const storedAuth = localStorage.getItem('cicek_terapi_auth');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }

    const storedSurveyStatus = localStorage.getItem('cicek_terapi_survey_completed');
    if (storedSurveyStatus === 'true') {
      setIsSurveyCompleted(true);
      const storedSurveyData = localStorage.getItem('cicek_terapi_survey_data');
      if (storedSurveyData) {
        setSurveyData(JSON.parse(storedSurveyData));
      }
    }
    setIsLoaded(true);
  }, []);
  
  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('cicek_terapi_lang', newLang);
  };

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem('cicek_terapi_auth', 'true');
    router.push(isSurveyCompleted ? '/dashboard' : '/survey');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsSurveyCompleted(false);
    setSurveyData(null);
    localStorage.removeItem('cicek_terapi_auth');
    localStorage.removeItem('cicek_terapi_survey_completed');
    localStorage.removeItem('cicek_terapi_survey_data');
    router.push('/');
  };

  const completeSurvey = (data: SurveyData) => {
    setSurveyData(data);
    setIsSurveyCompleted(true);
    localStorage.setItem('cicek_terapi_survey_completed', 'true');
    localStorage.setItem('cicek_terapi_survey_data', JSON.stringify(data));
    router.push('/dashboard');
  };

  const value = {
    lang,
    setLang: handleSetLang,
    translations: locales[lang],
    isAuthenticated,
    isSurveyCompleted,
    surveyData,
    login,
    logout,
    completeSurvey,
  };

  if (!isLoaded) {
    return null; // or a loading spinner
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
