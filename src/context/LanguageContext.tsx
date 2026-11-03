import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { content, type Language } from '@/data/portfolio';

interface LanguageContextValue {
  lang: Language;
  setLang: (language: Language) => void;
  copy: (typeof content)[Language];
}

const LANGUAGE_STORAGE_KEY = 'ahmed_portfolio_lang';

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'ar';

  try {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return saved === 'en' || saved === 'ar' ? saved : 'ar';
  } catch {
    return 'ar';
  }
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLanguage] = useState<Language>(getInitialLanguage);

  const setLang = useCallback((language: Language) => {
    setLanguage(language);
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // The language still changes for this visit if storage is unavailable.
    }
  }, []);

  useEffect(() => {
    const current = content[lang];
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = current.siteTitle;

    document.querySelector('meta[name="description"]')?.setAttribute('content', current.siteDescription);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', current.siteTitle);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', current.siteDescription);
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', lang === 'ar' ? 'ar_EG' : 'en_US');
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, copy: content[lang] }), [lang, setLang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export function useLanguage(): LanguageContextValue {
  const value = useContext(LanguageContext);
  if (!value) throw new Error('useLanguage must be used within a LanguageProvider');
  return value;
}
