import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, Copy, Mail, Sparkles, ChevronDown, ChevronUp, ZoomIn, X as CloseIcon } from 'lucide-react';
import { arabicLogos, ArabicLogoItem } from '@/data/arabicLogosData';
import { Header } from '@/components/layout/Header';
import { useLanguage } from '@/context/LanguageContext';
import { collaborationGroups } from '@/data/portfolio';

const EMAIL = 'mala7.eg@gmail.com';

const Reveal: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = '' }) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (!('IntersectionObserver' in window)) {
      element.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add('is-visible');
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -24px 0px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div ref={elementRef} className={`reveal ${className}`}>{children}</div>;
};

interface BrandTileProps {
  company: { name: string; wordmark: string; logo: string; website: string; mark?: string };
  relationship: string;
  showRelationship?: boolean;
  decorative?: boolean;
}

const BrandTile: React.FC<BrandTileProps> = ({ company, relationship, showRelationship = true, decorative = false }) => {
  const [imageFailed, setImageFailed] = useState(!company.logo && !company.mark);

  return (
    <li className="brand-tile">
      <a
        className="brand-tile__link"
        href={company.website}
        target="_blank"
        rel="noreferrer"
        aria-label={decorative ? undefined : `${company.name} — ${relationship}`}
        aria-hidden={decorative || undefined}
        tabIndex={decorative ? -1 : undefined}
      >
        <span className={`brand-tile__mark${imageFailed ? ' is-wordmark' : ''}${company.mark ? ` brand-tile__mark--${company.mark}` : ''}`}>
          {company.mark === 'higgsfield' ? (
            <span className="brand-tile__official-mark">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
                <path d="M18.3498 9.83713L18.3339 9.65759C18.1831 7.93447 17.0963 4.69261 14.0816 4.69261C11.8445 4.69261 10.1545 6.97097 8.66311 8.97967C7.47302 10.5883 6.4419 11.9683 5.3073 11.9683C5.00574 11.9357 4.61708 11.7805 4.3792 11.4294C4.16497 11.1108 4.10948 10.7026 4.22046 10.2126C4.39489 9.43684 5.39463 8.7182 6.44963 7.95063C7.02864 7.54238 7.6238 7.10955 8.03634 6.69311C9.22643 5.5091 9.82932 4.65164 9.82932 3.2717C9.82932 1.89176 9.09157 1.20565 8.47276 0.911636C7.23514 0.323844 5.41851 0.666781 4.26026 1.69583C4.08583 1.85922 3.91117 2.01418 3.75243 2.16119C2.58622 3.23097 1.80094 3.95781 0 3.40232V5.63972C2.38791 6.72588 4.39512 4.65164 5.15675 3.69633C5.74372 3.06758 6.36253 2.70006 6.82283 2.70006H6.84671C7.05298 2.70825 7.22741 2.78995 7.35454 2.93696C7.56081 3.18204 7.64018 3.46786 7.60038 3.78622C7.51305 4.45594 6.83875 5.23967 5.60113 6.09713C4.14928 7.10159 1.7218 8.78374 1.53122 10.8987C1.3884 12.4177 2.15003 13.9365 3.34012 14.5243C6.11669 15.8798 7.80665 13.5444 9.5994 11.0783C10.9719 9.1756 12.273 7.37103 14.0818 7.37103C15.7081 7.37103 16.311 8.75916 16.311 9.63301V9.80459L16.1523 9.83713C12.2095 10.5558 10.0595 14.3611 10.0595 16.1167C10.0595 17.8724 11.5034 19.375 13.2804 19.375C15.359 19.375 17.9293 17.5458 18.3419 12.4013L18.3578 12.2136H20V9.83737H18.3498V9.83713ZM16.1998 12.4746C15.8826 15.5531 14.3513 16.9904 13.4232 16.9904C13.0027 16.9904 12.4158 16.631 12.4158 15.9615C12.4158 15.2104 13.5026 12.932 15.946 12.2543L16.2316 12.1808L16.1998 12.4748V12.4746Z" fill="currentColor" />
              </svg>
              <span>Higgsfield</span>
            </span>
          ) : !imageFailed ? (
            <img
              src={company.logo}
              alt=""
              loading="lazy"
              decoding="async"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <span dir="auto">{company.wordmark}</span>
          )}
        </span>
        <span className="brand-tile__name" dir="ltr">{company.name}</span>
        {showRelationship && <span className="brand-tile__relationship">{relationship}</span>}
      </a>
    </li>
  );
};

export const PortfolioPage: React.FC = () => {
  const { lang, copy } = useLanguage();
  const [activeSection, setActiveSection] = useState('top');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const [showAllLogos, setShowAllLogos] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<ArabicLogoItem | null>(null);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-nav-section]'));
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (current) setActiveSection(current.target.getAttribute('data-nav-section') || 'top');
      },
      { rootMargin: '-34% 0px -56% 0px', threshold: [0, 0.15, 0.3, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('failed');
    }
    window.setTimeout(() => setCopyStatus('idle'), 2400);
  };

  const contactLinks = [
    { label: copy.contact.linkedin, href: 'https://www.linkedin.com/in/eng-mala7' },
    { label: copy.contact.github, href: 'https://github.com/engmalaaa7' },
    { label: copy.contact.behance, href: 'https://www.behance.net/ahmedalmalah' },
  ];

  return (
    <div className={`portfolio portfolio--${lang}`}>
      <a className="skip-link" href="#main-content">{copy.skipToContent}</a>
      <Header activeSection={activeSection} />

      <main id="main-content" tabIndex={-1}>
        <section id="top" className="hero page-wrap" aria-labelledby="hero-title" data-nav-section="top">
          <div className="hero__copy">
            <p className="eyebrow hero__eyebrow"><span className="eyebrow__number">{copy.hero.eyebrow.split(' / ')[0]}</span>{copy.hero.eyebrow.split(' / ')[1]}</p>
            <h1 id="hero-title" className="hero__headline">
              {copy.hero.lines.map((line) => <span key={line}>{line}</span>)}
            </h1>
            <p className="hero__name" dir={lang === 'ar' ? 'rtl' : 'ltr'}>{copy.hero.name}</p>
            <p className="hero__role">{copy.hero.role}</p>
            <p className="hero__intro">{copy.hero.intro}</p>

            <div className="hero__focus" aria-label={copy.hero.disciplinesLabel}>
              <span className="eyebrow hero__focus-label">{copy.hero.disciplinesLabel}</span>
              <ul className="tag-list tag-list--plain">
                {copy.hero.disciplines.map((discipline) => <li key={discipline}>{discipline}</li>)}
              </ul>
            </div>

            <div className="hero__actions">
              <a className="button button--dark" href="#skills">
                <span>{copy.hero.skillsCta}</span><ArrowRight className="directional-icon" aria-hidden="true" size={18} />
              </a>
              <a className="button button--light" href="#contact">
                <span>{copy.hero.contactCta}</span><ArrowUpRight aria-hidden="true" size={17} />
              </a>
            </div>
          </div>

          <figure className="hero__portrait">
            <div className="portrait-frame">
              <span className="portrait-frame__index" dir="ltr">01 — AHMED AL MALAH</span>
              <img
                className="portrait-frame__image"
                src="/assets/images/ahmed-portrait.webp"
                alt={copy.hero.portraitAlt}
                width="900"
                height="1125"
                decoding="async"
              />
              <span className="portrait-frame__caption">{copy.hero.portraitLabel}</span>
            </div>
            <figcaption>{copy.hero.portraitCaption}</figcaption>
          </figure>

          <div className="hero__folio" aria-hidden="true"><span>AM</span><span>2026 / PORTFOLIO</span></div>
        </section>
        <section id="skills" className="section skills-section page-wrap" aria-labelledby="skills-title" data-nav-section="skills">
          <Reveal className="section-heading section-heading--split">
            <p className="eyebrow"><span className="eyebrow__number">{copy.skills.eyebrow.split(' / ')[0]}</span>{copy.skills.eyebrow.split(' / ')[1]}</p>
            <h2 id="skills-title">{copy.skills.title}</h2>
            <p className="section-intro">{copy.skills.intro}</p>
          </Reveal>
          <div className="skills-grid">
            {copy.skills.groups.map((group) => (
              <Reveal className="skill-group" key={group.number}>
                <span className="skill-group__number mono-index">{group.number}</span>
                <h3>{group.title}</h3>
                <ul className="tag-list">
                  {group.items.map((item) => <li key={item} dir="auto">{item}</li>)}
                </ul>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="about" className="section page-wrap about-section" aria-labelledby="about-title" data-nav-section="about">
          <Reveal className="section-heading section-heading--split">
            <p className="eyebrow"><span className="eyebrow__number">{copy.about.eyebrow.split(' / ')[0]}</span>{copy.about.eyebrow.split(' / ')[1]}</p>
            <h2 id="about-title">{copy.about.title}</h2>
          </Reveal>
          <div className="about-grid">
            <Reveal className="about-lead">
              <p>{copy.about.lead}</p>
            </Reveal>
            <Reveal className="about-detail">
              <p>{copy.about.body}</p>
              <p className="eyebrow about-method-label">{copy.about.methodLabel}</p>
              <ol className="method-list">
                {copy.about.method.map(([number, step]) => (
                  <li key={number}><span className="method-list__number">{number}</span><span>{step}</span></li>
                ))}
              </ol>
            </Reveal>
          </div>
        </section>



        <section id="experience" className="section experience-section" aria-labelledby="experience-title" data-nav-section="experience">
          <div className="page-wrap">
            <Reveal className="section-heading section-heading--split">
              <p className="eyebrow"><span className="eyebrow__number">{copy.experience.eyebrow.split(' / ')[0]}</span>{copy.experience.eyebrow.split(' / ')[1]}</p>
              <h2 id="experience-title">{copy.experience.title}</h2>
              <p className="section-intro">{copy.experience.intro}</p>
            </Reveal>

            <div className="experience-columns">
              <Reveal className="experience-column">
                <h3 className="subsection-title"><span className="mono-index">A</span>{copy.experience.professionalLabel}</h3>
                <div className="experience-list">
                  {copy.experience.professional.map((item, index) => (
                    <article className="experience-item" key={item.organization}>
                      <span className="experience-item__number mono-index">0{index + 1}</span>
                      <div>
                        <div className="experience-item__meta">
                          <span className="experience-item__relationship">{item.relationship}</span>
                          {'period' in item && <span className="experience-item__period mono-index">{item.period}</span>}
                        </div>
                        <h4 dir="auto">{item.organization}</h4>
                        <p className="experience-item__role">{item.role}</p>
                        {item.description && <p className="experience-item__description">{item.description}</p>}
                      </div>
                    </article>
                  ))}
                </div>
              </Reveal>

              <div className="experience-column experience-column--side">
                <Reveal>
                  <h3 className="subsection-title"><span className="mono-index">B</span>{copy.experience.communityLabel}</h3>
                  <div className="experience-list">
                    {copy.experience.community.map((item, index) => (
                      <article className="experience-item" key={item.organization}>
                        <span className="experience-item__number mono-index">0{index + 1}</span>
                        <div>
                          <p className="experience-item__relationship">{index === 0 ? copy.collaborations.relationships.leadership : copy.collaborations.relationships.community}</p>
                          <h4 dir="auto">{item.organization}</h4>
                          <p className="experience-item__role">{item.role}</p>
                          <p className="experience-item__description">{item.description}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </Reveal>

                {copy.experience.education && (
                  <Reveal className="experience-credentials">
                    <h3 className="subsection-title"><span className="mono-index">C</span>{lang === 'ar' ? 'التعليم الأكاديمي' : 'EDUCATION'}</h3>
                    <div className="credentials-card">
                      <h4 dir="auto">{copy.experience.education.degree}</h4>
                      <p className="credentials-card__inst" dir="auto">{copy.experience.education.institution}</p>
                      <span className="credentials-card__grad mono-index">{copy.experience.education.graduation}</span>
                    </div>

                    <h3 className="subsection-title" style={{ marginTop: '2rem' }}><span className="mono-index">D</span>{lang === 'ar' ? 'الجوائز والاعتمادات والشهادات' : 'HONORS, CERTIFICATIONS & LABS'}</h3>
                    <ul className="credentials-list">
                      {copy.experience.achievements.map((cert) => (
                        <li key={cert} dir="auto">
                          <span className="credentials-bullet" aria-hidden="true">■</span>
                          <span>{cert}</span>
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                )}
              </div>
            </div>
          </div>
        </section>


        <section id="arabic-logos" className="section arabic-logos-section" aria-labelledby="arabic-logos-title" data-nav-section="arabic-logos">
          <div className="page-wrap">
            <Reveal className="section-heading section-heading--split">
              <p className="eyebrow">
                <span className="eyebrow__number">{copy.arabicLogos.eyebrow.split(' / ')[0]}</span>
                {copy.arabicLogos.eyebrow.split(' / ')[1]}
              </p>
              <div className="heading-with-badge">
                <h2 id="arabic-logos-title">{copy.arabicLogos.title}</h2>
                <span className="arabic-logos__badge">
                  <Sparkles size={14} aria-hidden="true" />
                  <span>{copy.arabicLogos.badge}</span>
                </span>
              </div>
              <p className="section-intro">{copy.arabicLogos.intro}</p>
            </Reveal>

            <div className="arabic-logos__toolbar">
              <div className="arabic-logos__count">
                <span className="mono-index">{arabicLogos.length}</span>
                <span>{copy.arabicLogos.counter}</span>
              </div>
            </div>

            <div className="arabic-logos-grid">
              {(showAllLogos ? arabicLogos : arabicLogos.slice(0, 12)).map((item, index) => (
                <Reveal className="arabic-logo-card" key={item.id}>
                  <div
                    className="arabic-logo-card__canvas"
                    onClick={() => setSelectedLogo(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedLogo(item); } }}
                    aria-label={`${item.title[lang]} — تكبير الشعار`}
                  >
                    <span className="arabic-logo-card__index mono-index">{String(index + 1).padStart(2, '0')}</span>
                    <div className="arabic-logo-card__image-wrap">
                      <img
                        src={item.image}
                        alt={item.title[lang]}
                        loading="lazy"
                        decoding="async"
                        className="arabic-logo-card__image"
                      />
                    </div>
                    <div className="arabic-logo-card__zoom-hint" aria-hidden="true">
                      <ZoomIn size={16} />
                    </div>
                  </div>
                  <div className="arabic-logo-card__footer">
                    <h4 className="arabic-logo-card__title" dir="auto">{item.title[lang]}</h4>
                    <span className="arabic-logo-card__category" dir="auto">{item.category[lang]}</span>
                  </div>
                </Reveal>
              ))}
            </div>

            {arabicLogos.length > 12 && (
              <div className="arabic-logos__actions">
                <button
                  type="button"
                  className="button button--dark arabic-logos__toggle-btn"
                  onClick={() => setShowAllLogos((prev) => !prev)}
                >
                  {showAllLogos ? (
                    <>
                      <span>{copy.arabicLogos.showLess}</span>
                      <ChevronUp size={18} aria-hidden="true" />
                    </>
                  ) : (
                    <>
                      <span>{copy.arabicLogos.viewAll} ({arabicLogos.length})</span>
                      <ChevronDown size={18} aria-hidden="true" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Modal for previewing high resolution logo */}
        {selectedLogo && (
          <div
            className="logo-modal"
            role="dialog"
            aria-modal="true"
            aria-label={selectedLogo.title[lang]}
            onClick={() => setSelectedLogo(null)}
          >
            <div className="logo-modal__content" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="logo-modal__close"
                onClick={() => setSelectedLogo(null)}
                aria-label="إغلاق المعاينة"
              >
                <CloseIcon size={22} />
              </button>
              <div className="logo-modal__stage">
                <img
                  src={selectedLogo.image}
                  alt={selectedLogo.title[lang]}
                  className="logo-modal__image"
                />
              </div>
              <div className="logo-modal__info">
                <h3 dir="auto">{selectedLogo.title[lang]}</h3>
                <p dir="auto">{selectedLogo.category[lang]}</p>
              </div>
            </div>
          </div>
        )}

        <section id="impact" className="section impact-section" aria-labelledby="impact-title" data-nav-section="impact">
          <div className="page-wrap impact-grid">
            <Reveal className="impact-lead">
              <p className="eyebrow"><span className="eyebrow__number">{copy.impact.eyebrow.split(' / ')[0]}</span>{copy.impact.eyebrow.split(' / ')[1]}</p>
              <h2 id="impact-title">{copy.impact.title}</h2>
              <p>{copy.impact.lead}</p>
            </Reveal>
            <Reveal className="impact-record">
              <span className="impact-record__label">{copy.impact.seasonLabel}</span>
              <p className="impact-record__season" aria-label={copy.impact.seasonAria}>{copy.impact.season}</p>
              <ul>
                {copy.impact.notes.map((note) => <li key={note}>{note}</li>)}
              </ul>
            </Reveal>
          </div>
        </section>

        <section id="contact" className="section contact-section" aria-labelledby="contact-title" data-nav-section="contact">
          <div className="page-wrap contact-card">
            <Reveal className="contact-card__intro">
              <p className="eyebrow"><span className="eyebrow__number">{copy.contact.eyebrow.split(' / ')[0]}</span>{copy.contact.eyebrow.split(' / ')[1]}</p>
              <h2 id="contact-title">{copy.contact.title}</h2>
              <p>{copy.contact.body}</p>
              <a className="button button--dark contact-cta" href={`mailto:${EMAIL}`}>
                <Mail aria-hidden="true" size={18} /><span>{copy.contact.cta}</span><ArrowUpRight aria-hidden="true" size={17} />
              </a>
            </Reveal>

            <Reveal className="contact-card__details">
              <div className="contact-email-block">
                <span className="eyebrow">{copy.contact.emailLabel}</span>
                <a className="contact-email" href={`mailto:${EMAIL}`} dir="ltr">{EMAIL}</a>
                <div className="copy-row">
                  <button className="button button--light copy-button" type="button" onClick={handleCopyEmail}>
                    {copyStatus === 'copied' ? <Check aria-hidden="true" size={16} /> : <Copy aria-hidden="true" size={16} />}
                    <span>{copyStatus === 'copied' ? copy.contact.copied : copy.contact.copyEmail}</span>
                  </button>
                  <span className="copy-status" role="status" aria-live="polite">
                    {copyStatus === 'copied' ? copy.contact.copied : copyStatus === 'failed' ? copy.contact.copyFailed : ''}
                  </span>
                </div>
              </div>

              <div className="contact-social-block">
                <span className="eyebrow">{copy.contact.linksLabel}</span>
                <ul className="social-list">
                  {contactLinks.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} target="_blank" rel="noreferrer">
                        <span>{link.label}</span><ArrowUpRight aria-hidden="true" size={16} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="collaborations" className="section trusted-section" aria-labelledby="trusted-title">
          <div className="page-wrap">
            <Reveal className="section-heading section-heading--split">
              <p className="eyebrow"><span className="eyebrow__number">{copy.collaborations.eyebrow.split(' / ')[0]}</span>{copy.collaborations.eyebrow.split(' / ')[1]}</p>
              <h2 id="trusted-title">{copy.collaborations.title}</h2>
              <p className="section-intro">{copy.collaborations.intro}</p>
            </Reveal>

            <div className="trusted-marquees">
              {collaborationGroups.filter((group) => group.id !== 'community').map((group, groupIndex) => {
                const relationship = group.id === 'professional'
                  ? copy.collaborations.relationships.professional
                  : group.id === 'independent'
                    ? copy.collaborations.relationships.independent
                    : copy.collaborations.relationships.ecosystem;

                return (
                <Reveal className="trusted-group" key={group.id}>
                  <div className="trusted-group__heading">
                    <span className="mono-index">0{groupIndex + 1}</span>
                    <h3>{copy.collaborations.groups[group.id]}</h3>
                    <span className="trusted-group__relationship">{relationship}</span>
                  </div>
                  <div
                    className="logo-marquee"
                    dir="ltr"
                    style={{ '--marquee-duration': `${Math.max(22, group.companies.length * 3.2)}s` } as React.CSSProperties}
                  >
                    <ul className="logo-marquee__track">
                      {[...group.companies, ...group.companies].map((company, index) => (
                        <BrandTile
                          key={`${company.name}-${index}`}
                          company={company}
                          relationship={relationship}
                          showRelationship={group.id === 'professional' || group.id === 'independent'}
                          decorative={index >= group.companies.length}
                        />
                      ))}
                    </ul>
                  </div>
                </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer page-wrap">
        <a className="site-footer__name" href="#top">{copy.hero.name}</a>
        <p>{copy.footer.line}</p>
        <span>© {new Date().getFullYear()} {copy.hero.name}. {copy.footer.rights}</span>
      </footer>
    </div>
  );
};
