'use client';

import React, { useMemo, useState, useContext, createContext, useCallback } from 'react';

export enum Language {
  KA = 'KA',
  ENG = 'ENG',
}

interface LanguageContextType {
  language: Language;
  changeLanguage: (newLanguage: Language) => Language;
  renderLanguage: (ka: string, eng: string) => string;
}

const defaultLanguageContext: LanguageContextType = {
  language: Language.KA,
  renderLanguage: (ka: string) => ka,
  changeLanguage: (newLanguage: Language) => newLanguage,
};

const LanguageContext = createContext<LanguageContextType>(defaultLanguageContext);

export function LanguageProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [language, setLanguage] = useState(Language.KA);

  const changeLanguage = useCallback((newLanguage: Language): Language => {
    setLanguage(newLanguage);
    return newLanguage;
  }, []);

  const renderLanguage = useCallback(
    (ka: string, eng: string): string => (language === Language.KA ? ka : eng),
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      changeLanguage,
      renderLanguage,
    }),
    [language, changeLanguage, renderLanguage] 
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
