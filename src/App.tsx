import React from 'react';
import { LanguageProvider } from '@/context/LanguageContext';
import { PortfolioPage } from '@/components/portfolio/PortfolioPage';

export const App: React.FC = () => (
  <LanguageProvider>
    <PortfolioPage />
  </LanguageProvider>
);

export default App;
