import { useEffect, useState } from 'react';
import care1 from '../assets/photos/care-1.jpg';
import care2 from '../assets/photos/care-2.jpg';
import care3 from '../assets/photos/care-3.jpg';
import care4 from '../assets/photos/care-4.jpg';
import care5 from '../assets/photos/care-5.jpg';
import care6 from '../assets/photos/care-6.jpg';
import clinic from '../assets/photos/clinic.jpg';
import doctor from '../assets/photos/doctor.jpg';
import { useCountUp } from '../hooks/useCountUp';
import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { Resume } from '../lib/types';
import { GlowCard, type Accent } from './GlowCard';
import { splitHeadline } from './Hero';
import { Icon, type IconName } from './Icon';
import { Logo } from './Logo';
import { NAV } from './NavBar';
import { Reveal } from './Reveal';

const PHOTOS = [care1, care2, care3, care4, care5, care6];
const CARE_ICONS: IconName[] = ['spine', 'move', 'shield', 'user', 'users', 'heart'];
const SKILL_ICONS: IconName[] = ['spine', 'user', 'move', 'dumbbell', 'activity', 'heart', 'shield', 'leaf', 'target', 'bulb'];
const ACCENTS: Accent[] = ['green', 'teal', 'amber', 'green', 'blue', 'amber'];

function SectionHead({ label, title, id, link }: { label: string; title: React.ReactNode; id: string; link?: { href?: string; text: string; onClick?: () => void } }) {
  return (
    <Reveal className="head">
      <div>
        <span className="label">{label}</span>
        <h2 id={id} className="title">
          {title}
        </h2>
      </div>
      {link &&
        (link.onClick ? (
          <button className="text-link head__link" onClick={link.onClick}>
            {link.text} <Icon name="arrowRight" size={15} />
          </button>
        ) : (
          <a className="text-link head__link" href={link.href}>
            {link.text} <Icon name="arrowRight" size={15} />
          </a>
        ))}
    </Reveal>
  );
}

/* ================= expertise: the six photo cards ("Our Services") ================= */

export function ExpertiseSection({ resume }: { resume: Resume }) {
  const [open, setOpen] = useState<number | null>(null);
  // projects first; if the CV lists fewer than six, skills fill the remaining cards
  const cards = [
    ...resume.projects.map((p) => ({ title: p.title, text: p.description, more: [p.meta, p.tags.join(', ')].filter(Boolean).join(' · ') })),
    ...resume.skills.map((s) => ({ title: s, text: '', more: '' })),
  ].slice(0, 6);

  return (
    <section id="expertise" className="section" aria-labelledby="expertise-title">
      <div className="wrap">
        <SectionHead label="What I do" id="expertise-title" title="Areas of Expertise & Projects" link={{ href: '#experience', text: 'View experience' }} />
        <div className="care">
          {cards.map((c, i) => (
            <Reveal key={c.title + i} delay={i * 90} className="care__cell">
              <GlowCard className="care-card" accent={ACCENTS[i]} phase={i * 0.17} speed={6 + i * 0.6}>
                <div className="care-card__photo">
                  <img src={PHOTOS[i % PHOTOS.length]} alt="" loading="lazy" />
                </div>
                <span className="care-card__icon" aria-hidden>
                  <Icon name={CARE_ICONS[i % CARE_ICONS.length]} size={20} />
                </span>
                <div className="care-card__body">
                  <h3>{c.title}</h3>
                  {c.text && <p>{c.text}</p>}
                  {c.more && open === i && <p className="care-card__more">{c.more}</p>}
                  {c.more ? (
                    <button className="care-card__link" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
                      {open === i ? 'Show less' : 'Learn more'} <Icon name="arrowRight" size={13} />
                    </button>
                  ) : (
                    <a className="care-card__link" href="#skills">
                      Learn more <Icon name="arrowRight" size={13} />
                    </a>
                  )}
                </div>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= about ("Why choose us"): clinic photo + story + checklist ================= */

export function AboutSection({ resume, onDownloadCv, isExample }: { resume: Resume; onDownloadCv: () => void; isExample: boolean }) {
  const [role] = splitHeadline(resume.headline);
  const { stats } = resume;
  const points: { icon: IconName; text: string }[] = [
    { icon: 'award' as IconName, text: `${stats.years}${stats.yearsPlus ? '+' : ''} years of hands-on experience` },
    ...resume.education.slice(0, 2).map((e) => ({ icon: 'graduation' as IconName, text: e.degree })),
    ...resume.certifications.map((c) => ({ icon: 'shield' as IconName, text: c })),
    ...resume.languages.slice(0, 1).map(() => ({ icon: 'globe' as IconName, text: `Speaks ${resume.languages.join(', ')}` })),
    ...resume.interests.slice(0, 1).map(() => ({ icon: 'heart' as IconName, text: `Interested in ${resume.interests.slice(0, 3).join(', ').toLowerCase()}` })),
  ].slice(0, 5);
  const first = resume.name.split(/\s+/)[0];

  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <div className="about__photo">
        <img src={clinic} alt="" loading="lazy" />
      </div>

      <Reveal className="about__copy">
        <span className="label">About me</span>
        <h2 id="about-title" className="title">
          More Than Just <span className="accent">{role || 'a CV'}</span>
        </h2>
        <p>{resume.summary || resume.tagline}</p>
        <div className="about__actions">
          <a className="pill pill--sm" href="#experience">
            My story <Icon name="arrowRight" size={14} />
          </a>
          <button className="pill pill--sm pill--ghost" onClick={onDownloadCv}>
            <Icon name="download" size={14} /> {isExample ? 'Sample CV' : `${first}’s CV`}
          </button>
        </div>
      </Reveal>

      <ul className="about__points">
        {points.map((p, i) => (
          <Reveal as="li" key={p.text} delay={150 + i * 110}>
            <span className="about__icon">
              <Icon name={p.icon} size={17} />
            </span>
            {p.text}
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

/* ================= experience timeline ================= */

function Years({ value, plus }: { value: number; plus: boolean }) {
  const [ref, inView] = useInView<HTMLSpanElement>(0.5);
  const n = useCountUp(value, inView, { duration: 2200 });
  return (
    <span ref={ref} className="years" aria-label={`${value}${plus ? '+' : ''} years`}>
      <b aria-hidden>
        {Math.round(n)}
        {plus && <i className={n >= value * 0.98 ? 'is-on' : ''}>+</i>}
      </b>
      <small>
        years of
        <br />
        experience
      </small>
    </span>
  );
}

export function ExperienceSection({ resume }: { resume: Resume }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const roles = resume.experience;

  // the highlight walks from role to role, like the lit step in the reference video
  useEffect(() => {
    if (reduced || paused || roles.length < 2) return;
    const t = window.setInterval(() => setActive((a) => (a + 1) % roles.length), 3000);
    return () => clearInterval(t);
  }, [reduced, paused, roles.length]);

  return (
    <section id="experience" className="section" aria-labelledby="experience-title">
      <div className="wrap">
        <div className="exp__head">
          <SectionHead label="Experience" id="experience-title" title={<>Where I’ve Made a <span className="accent">Difference</span></>} />
          <Years value={resume.stats.years} plus={resume.stats.yearsPlus} />
        </div>

        {roles.length ? (
          <ol className="exp" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
            <span className="exp__rail" aria-hidden>
              <span style={{ width: roles.length > 1 ? `${(active / (roles.length - 1)) * 100}%` : '100%' }} />
            </span>
            {roles.slice(0, 4).map((e, i) => (
              <Reveal as="li" key={e.role + i} delay={i * 120} onPointerEnter={() => setActive(i)}>
                <span className={`exp__dot ${i <= active ? 'is-on' : ''}`} aria-hidden />
                <GlowCard className={`role ${i === active ? 'is-current' : ''}`} accent={i === active ? 'amber' : 'green'} active={i === active} phase={i * 0.3} speed={7} tilt={false}>
                  {e.period && <span className={`role__period ${e.current ? 'is-now' : ''}`}>{e.period}</span>}
                  <h3>{e.role}</h3>
                  <p className="role__org">{[e.company, e.location].filter(Boolean).join(' · ')}</p>
                  {e.bullets.length > 0 && (
                    <ul>
                      {e.bullets.slice(0, 3).map((b, j) => (
                        <li key={j}>{b}</li>
                      ))}
                    </ul>
                  )}
                </GlowCard>
              </Reveal>
            ))}
          </ol>
        ) : (
          <p className="empty">No experience section was found in the CV.</p>
        )}
      </div>
    </section>
  );
}

/* ================= skills ("Conditions we treat") ================= */

export function SkillsSection({ resume }: { resume: Resume }) {
  const [all, setAll] = useState(false);
  const skills = all ? resume.skills : resume.skills.slice(0, 8);
  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="wrap">
        <SectionHead
          label="Skills"
          id="skills-title"
          title="What I Work With"
          link={resume.skills.length > 8 ? { text: all ? 'Show fewer' : `View all ${resume.skills.length} skills`, onClick: () => setAll((a) => !a) } : undefined}
        />
        <ul className="skills">
          {skills.map((s, i) => (
            <Reveal as="li" key={s} delay={(i % 8) * 60}>
              <GlowCard className="skill" accent={i % 3 === 1 ? 'amber' : 'green'} phase={i * 0.12} speed={5 + (i % 4)}>
                <span className="skill__icon">
                  <Icon name={SKILL_ICONS[i % SKILL_ICONS.length]} size={24} />
                </span>
                <span className="skill__name">{s}</span>
              </GlowCard>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ================= results ("What our patients say") ================= */

function Stars({ run }: { run: boolean }) {
  return (
    <span className={`stars ${run ? 'is-on' : ''}`} aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <Icon key={i} name="star" size={15} style={{ ['--i' as string]: i }} />
      ))}
    </span>
  );
}

export function ResultsSection({ resume }: { resume: Resume }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  const items = [
    ...resume.achievements.map((t) => ({ text: t, kind: 'Achievement' })),
    ...resume.certifications.map((t) => ({ text: t, kind: 'Certification' })),
    ...resume.goals.map((g) => ({ text: g.value, kind: g.label })),
  ].slice(0, 3);
  const initials = resume.name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <section id="results" className="section" aria-labelledby="results-title">
      <div className="wrap results" ref={ref}>
        <Reveal className="results__intro">
          <span className="label">Results</span>
          <h2 id="results-title" className="title results__title">
            Real Work.
            <br />
            Real Results.
          </h2>
        </Reveal>
        {items.map((it, i) => (
          <Reveal key={it.text + i} delay={i * 120}>
            <GlowCard className="quote" accent={i === 1 ? 'amber' : 'green'} phase={i * 0.33} speed={8}>
              <Icon name="quote" size={22} className="quote__mark" />
              <p>{it.text}</p>
              <footer>
                <span className="quote__avatar">{initials}</span>
                <span className="quote__who">
                  <b>{resume.name}</b>
                  <small>{it.kind}</small>
                </span>
                <Stars run={inView} />
              </footer>
            </GlowCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ================= call to action band with the rising sun ================= */

export function CtaBand({ resume }: { resume: Resume }) {
  const goal = resume.goals[0];
  const next = resume.goals[1];
  const certs = resume.certifications.length;
  const perks: { icon: IconName; title: string; text: string }[] = [
    next ? { icon: 'calendar', title: next.label, text: next.value } : { icon: 'calendar', title: 'Available', text: 'for new roles' },
    { icon: 'pin', title: resume.location?.split(',')[0] || 'Location', text: 'on-site or remote' },
    { icon: 'shield', title: certs ? `${certs} Certified` : 'Always learning', text: certs === 1 ? 'credential' : certs ? 'credentials' : 'new skills' },
  ];

  return (
    <section id="contact" className="cta" aria-labelledby="contact-title">
      <div className="wrap cta__inner">
        <Reveal className="cta__copy">
          <span className="label cta__label">Take the next step</span>
          <h2 id="contact-title" className="cta__title">
            {goal ? goal.value : 'A healthier, stronger team is possible'}
          </h2>
          <p>{goal?.note ? `Goal: ${goal.note}. ` : ''}Get in touch to talk about how I can help your patients and your team.</p>
        </Reveal>
        <a className="pill pill--white cta__btn" href={resume.email ? `mailto:${resume.email}` : '#home'}>
          Get in touch <Icon name="arrowRight" size={15} />
        </a>
        <div className="cta__photo" aria-hidden>
          <img src={doctor} alt="" loading="lazy" />
        </div>
        <ul className="cta__perks">
          {perks.map((p) => (
            <li key={p.title}>
              <Icon name={p.icon} size={26} />
              <b>{p.title}</b>
              <small>{p.text}</small>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ================= footer ================= */

export function Footer({ resume }: { resume: Resume }) {
  const motto = (resume.motto || 'Move better. Live healthier.').replace(/[.!]/g, '').split(/\s+/).slice(0, 5);
  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <div className="footer__brand">
          <span className="footer__logo">
            <Logo size={36} />
            <span>
              <b className="wordmark">{resume.name}</b>
              <small>{splitHeadline(resume.headline)[0]}</small>
            </span>
          </span>
          <p>{resume.motto || resume.tagline}</p>
          <nav className="footer__social" aria-label="Profiles">
            {resume.links.linkedin && (
              <a href={resume.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <Icon name="linkedin" size={18} />
              </a>
            )}
            {resume.links.github && (
              <a href={resume.links.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                <Icon name="github" size={18} />
              </a>
            )}
            {resume.email && (
              <a href={`mailto:${resume.email}`} aria-label="Email">
                <Icon name="mail" size={18} />
              </a>
            )}
          </nav>
        </div>

        <div>
          <h4>Quick links</h4>
          <ul>
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`}>{n.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Skills</h4>
          <ul>
            {resume.skills.slice(0, 7).map((s) => (
              <li key={s}>
                <a href="#skills">{s}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Contact</h4>
          <ul className="footer__contact">
            {resume.location && (
              <li>
                <Icon name="pin" size={15} /> {resume.location}
              </li>
            )}
            {resume.phone && (
              <li>
                <Icon name="phone" size={15} /> <a href={`tel:${resume.phone.replace(/[^\d+]/g, '')}`}>{resume.phone}</a>
              </li>
            )}
            {resume.email && (
              <li>
                <Icon name="mail" size={15} /> <a href={`mailto:${resume.email}`}>{resume.email}</a>
              </li>
            )}
            <li>
              <Icon name="clock" size={15} /> Open to new opportunities
            </li>
          </ul>
        </div>

        <p className="footer__hand hand" aria-hidden>
          {motto.map((w, i) => (
            <span key={i}>{w}</span>
          ))}
        </p>
      </div>
      <div className="wrap footer__base">
        <span>
          © {new Date().getFullYear()} {resume.name}. Built from a CV.
        </span>
        <a href="#home">Back to top ↑</a>
      </div>
    </footer>
  );
}
