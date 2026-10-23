import { useEffect, useRef, useState } from 'react';
import { Icon, type IconName } from './Icon';
import { Logo } from './Logo';

export const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'results', label: 'Results' },
  { id: 'contact', label: 'Contact' },
];

interface Props {
  name: string;
  role: string;
  phone?: string;
  email?: string;
  notice: string;
  active: string;
  isExample: boolean;
  onUploadNew: () => void;
  onEdit: () => void;
  onDownloadCv: () => void;
  onReset: () => void;
}

/** The thin green announcement strip plus the white navigation bar under it. */
export function NavBar({ name, role, phone, email, notice, active, isExample, onUploadNew, onEdit, onDownloadCv, onReset }: Props) {
  const [menu, setMenu] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setMenu(false);
        setMobile(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const actions: { icon: IconName; label: string; run: () => void }[] = [
    { icon: 'upload', label: isExample ? 'Upload a CV' : 'Upload a new CV', run: onUploadNew },
    { icon: 'edit', label: 'Edit details', run: onEdit },
    { icon: 'download', label: isExample ? 'Download the sample CV' : 'Download the CV', run: onDownloadCv },
  ];
  if (!isExample) actions.push({ icon: 'refresh', label: 'Back to the example', run: onReset });

  return (
    <>
      <div className="strip">
        <div className="wrap strip__inner">
          <span className="strip__spacer" aria-hidden />
          <p className="strip__notice">
            <Icon name="sparkle" size={13} />
            <span>{notice}</span>
          </p>
          <span className="strip__contact">
            {phone ? (
              <a href={`tel:${phone.replace(/[^\d+]/g, '')}`}>Call: {phone}</a>
            ) : email ? (
              <a href={`mailto:${email}`}>{email}</a>
            ) : null}
          </span>
        </div>
      </div>

      <header ref={ref} className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="wrap nav__inner">
          <a className="nav__brand" href="#home">
            <Logo />
            <span className="nav__name">
              <span className="wordmark">{name}</span>
              <small>{role}</small>
            </span>
          </a>

          <nav className={`nav__links ${mobile ? 'is-open' : ''}`} aria-label="Sections">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className={active === n.id ? 'is-active' : ''}
                aria-current={active === n.id ? 'location' : undefined}
                onClick={() => setMobile(false)}
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="nav__end">
            <div className="nav__pop">
              <button className="icon-btn" aria-label="Dashboard options" aria-haspopup="menu" aria-expanded={menu} onClick={() => setMenu((m) => !m)}>
                <Icon name="cog" size={17} />
              </button>
              {menu && (
                <ul className="popover" role="menu">
                  {actions.map((a) => (
                    <li key={a.label} role="none">
                      <button
                        role="menuitem"
                        onClick={() => {
                          setMenu(false);
                          a.run();
                        }}
                      >
                        <Icon name={a.icon} size={16} /> {a.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {isExample ? (
              <button className="pill pill--sm nav__cta" onClick={onUploadNew}>
                Upload CV <Icon name="arrowRight" size={14} />
              </button>
            ) : (
              <a className="pill pill--sm nav__cta" href={email ? `mailto:${email}` : '#contact'}>
                Get in touch <Icon name="arrowRight" size={14} />
              </a>
            )}
            <button className="icon-btn nav__burger" aria-label="Open menu" aria-expanded={mobile} onClick={() => setMobile((m) => !m)}>
              <Icon name={mobile ? 'close' : 'menu'} size={16} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
