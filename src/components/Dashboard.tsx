import { useScrollSpy } from '../hooks/useScrollSpy';
import type { StoredProfile } from '../lib/types';
import { Hero, splitHeadline } from './Hero';
import { NAV, NavBar } from './NavBar';
import { AboutSection, CtaBand, ExperienceSection, ExpertiseSection, Footer, ResultsSection, SkillsSection } from './Sections';
import './Dashboard.css';

const IDS = NAV.map((n) => n.id);

interface Props {
  profile: StoredProfile;
  isExample: boolean;
  onUploadNew: () => void;
  onEdit: () => void;
  onReset: () => void;
  onDownloadCv: () => void;
}

export function Dashboard({ profile, isExample, onUploadNew, onEdit, onReset, onDownloadCv }: Props) {
  const { resume } = profile;
  const active = useScrollSpy(IDS, 160);
  const motto = resume.motto || 'Move better. Live healthier.';

  return (
    <>
      <NavBar
        name={resume.name}
        role={splitHeadline(resume.headline)[0] || resume.headline}
        phone={resume.phone}
        email={resume.email}
        notice={`Open to new opportunities  |  ${motto}`}
        active={active}
        isExample={isExample}
        onUploadNew={onUploadNew}
        onEdit={onEdit}
        onDownloadCv={onDownloadCv}
        onReset={onReset}
      />
      <main>
        <Hero resume={resume} isExample={isExample} onUpload={onUploadNew} />
        <ExpertiseSection resume={resume} />
        <AboutSection resume={resume} onDownloadCv={onDownloadCv} isExample={isExample} />
        <ExperienceSection resume={resume} />
        <SkillsSection resume={resume} />
        <ResultsSection resume={resume} />
        <CtaBand resume={resume} />
      </main>
      <Footer resume={resume} />
    </>
  );
}
