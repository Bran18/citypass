'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { BookOpen, Leaf, Stamp } from 'lucide-react';
import { SampleStamp } from './sample-stamp';

export function PassportPreview() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  return (
    <div className="passport-preview">
      <div className={`passport-journal ${open ? 'is-open' : ''}`}>
        <div className="journal-page" inert={!open}>
          <SampleStamp />
        </div>
        <div className="passport-book journal-cover" aria-hidden={open}>
          <Leaf size={46} />
          <span>Iguazú</span>
          <h2>Passport</h2>
          <div className="book-seal">
            <Stamp size={52} />
          </div>
          <p>{t('passportCover')}</p>
          <small>{t('location')}</small>
        </div>
      </div>
      <button
        type="button"
        className="stamp-preview-button journal-toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <BookOpen size={18} />
        {t(open ? 'experience.closePassport' : 'experience.openPassport')}
      </button>
      <p className="journal-hint">{t('experience.bookHint')}</p>
    </div>
  );
}
