import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { Language } from '@/data/portfolio';

interface HeaderProps {
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({ activeSection }) => {
  const { lang, setLang, copy } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { id: 'skills', label: copy.nav.skills },
    { id: 'about', label: copy.nav.about },
    { id: 'experience', label: copy.nav.experience },
    { id: 'arabic-logos', label: copy.nav.arabicLogos },
    { id: 'contact', label: copy.nav.contact },
  ];

  const handleLanguageChange = () => {
    const nextLanguage: Language = lang === 'ar' ? 'en' : 'ar';
    setLang(nextLanguage);
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <a className="site-brand" href="#top" aria-label={copy.siteTitle} onClick={() => setMenuOpen(false)}>
        <span className="site-brand__mark" aria-hidden="true">AM</span>
        <span className="site-brand__name">{copy.hero.name}</span>
      </a>

      <nav id="site-navigation" className="site-nav" aria-label={copy.navLabel} hidden={!menuOpen}>
        {navItems.map((item) => (
          <a
            className={`site-nav__link${activeSection === item.id ? ' is-active' : ''}`}
            href={`#${item.id}`}
            aria-current={activeSection === item.id ? 'location' : undefined}
            key={item.id}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="site-header__actions">
        <button
          type="button"
          className="language-toggle"
          onClick={handleLanguageChange}
          aria-label={copy.languageLabel}
        >
          <span className="language-toggle__code" aria-hidden="true">{lang === 'ar' ? 'EN' : 'عربي'}</span>
          <span className="language-toggle__label">{lang === 'ar' ? 'English' : 'العربية'}</span>
        </button>
        <button
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? copy.menuClose : copy.menuOpen}
          aria-controls="site-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
        </button>
      </div>
    </header>
  );
};
