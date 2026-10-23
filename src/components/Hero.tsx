import { useRef } from 'react';
import hero from '../assets/photos/hero.jpg';
import { useCountUp } from '../hooks/useCountUp';
import { useInView } from '../hooks/useInView';
import { useScramble } from '../hooks/useScramble';
import type { Resume } from '../lib/types';
import { Icon, type IconName } from './Icon';
import './Hero.css';

/** "Senior Physiotherapist | Sports & Orthopaedic Rehab" → ["Senior Physiotherapist", "Sports & Orthopaedic Rehab"] */
export const splitHeadline = (h: string) => h.split(/\s*[|•·,–—]\s*/).filter(Boolean);

function Feature({ icon, value, suffix = '', label, run, delay }: { icon: IconName; value: number | string; suffix?: string; label: string; run: boolean; delay: number }) {
  const numeric = typeof value === 'number';
  const n = useCountUp(numeric ? value : 0, run, { duration: 2200, delay });
  const text = useScramble(numeric ? '' : value, run && !numeric, { delay });
  const done = numeric ? n >= value * 0.98 : text === value;
  return (
    <li className="feature" style={{ ['--d' as string]: `${delay}ms` }}>
      <span className="feature__icon">
        <Icon name={icon} size={22} />
      </span>
      <b className="feature__value" aria-label={`${value}${suffix}`}>
        <span aria-hidden>
          {numeric ? Math.round(n) : text || ' '}
          {suffix && <i className={done ? 'is-on' : ''}>{suffix}</i>}
        </span>
      </b>
      <span className="feature__label">{label}</span>
    </li>
  );
}

interface Props {
  resume: Resume;
  isExample: boolean;
  onUpload: () => void;
}

export function Hero({ resume, isExample, onUpload }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [rowRef, rowIn] = useInView<HTMLUListElement>(0.4);
  const { stats } = resume;

  const words = resume.name.split(/\s+/);
  const last = words.length > 1 ? words.pop() : '';
  const [role, focus] = splitHeadline(resume.headline);
  const eyebrow = [focus, resume.location].filter(Boolean).join('  ·  ') || 'Portfolio';
  const intro = resume.tagline || (resume.summary ? resume.summary.split(/(?<=[.!?])\s/)[0] : '');
  const motto = (resume.motto || 'Move better. Live healthier.').replace(/[.!]/g, '').split(/\s+/).slice(0, 5);
  const edu = resume.education[0];

  // the photo drifts a few pixels against the pointer, so the page feels less flat
  const onPointerMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType === 'touch') return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--px', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
    el.style.setProperty('--py', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
  };

  return (
    <section id="home" className="hero" ref={ref} onPointerMove={onPointerMove} aria-label="Introduction">
      <div className="hero__photo" aria-hidden>
        <img src={hero} alt="" />
        <span className="hero__sun" />
        <span className="hero__rays" />
        <p className="hero__note hand">
          {motto.map((w, i) => (
            <span key={i} style={{ ['--i' as string]: i }}>
              {w}
            </span>
          ))}
          <svg viewBox="0 0 90 12" preserveAspectRatio="none">
            <path d="M2 8c20-5 50-7 86-4" />
            <path d="M10 11c18-3 40-4 66-2" />
          </svg>
        </p>
      </div>

      <div className="wrap hero__inner">
        <div className="hero__copy">
          {isExample && (
            <button className="hero__example" onClick={onUpload}>
              <span className="hero__example-dot" /> Example profile — upload a CV to make it yours
              <Icon name="arrowRight" size={13} />
            </button>
          )}
          <p className="label hero__eyebrow">{eyebrow}</p>

          <h1 className="display hero__title">
            {words.join(' ')} {last && <span className="accent">{last}</span>}
            {role && <span className="hero__role">{role}</span>}
          </h1>

          {intro && <p className="hero__intro">{intro}</p>}

          <div className="hero__actions">
            {isExample ? (
              <button className="pill" onClick={onUpload}>
                Upload your CV <Icon name="arrowRight" size={15} />
              </button>
            ) : (
              <a className="pill" href={resume.email ? `mailto:${resume.email}` : '#contact'}>
                Get in touch <Icon name="arrowRight" size={15} />
              </a>
            )}
            <a className="hero__story" href="#about">
              <span className="hero__play">
                <Icon name="play" size={14} />
              </span>
              View my story
            </a>
          </div>

          <ul className="hero__features" ref={rowRef} aria-label="At a glance">
            <Feature icon="award" value={stats.years} suffix={stats.yearsPlus ? '+' : ''} label="Years of experience" run={rowIn} delay={0} />
            <Feature icon="folder" value={stats.projects} suffix={stats.projectsPlus ? '+' : ''} label="Projects delivered" run={rowIn} delay={150} />
            <Feature icon="activity" value={stats.skills} label="Core skills" run={rowIn} delay={300} />
            <Feature icon="graduation" value={edu?.short || '—'} label={edu?.field || 'Education'} run={rowIn} delay={450} />
          </ul>
        </div>
      </div>
    </section>
  );
}
