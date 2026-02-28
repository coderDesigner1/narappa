import React, { createContext, useContext, useState } from 'react';

// Language flags used as DB column values
// E = English, T = Telugu, H = Hindi
export const LANGUAGES = [
  { flag: 'E', label: 'English', nativeLabel: 'English' },
  { flag: 'T', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { flag: 'H', label: 'Hindi',  nativeLabel: 'हिन्दी' },
];

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('E'); // default: English

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
};