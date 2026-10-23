# CV → Dashboard (Physiotherapy)

Candidates upload a CV (PDF, DOCX or TXT) and get an animated portfolio dashboard in a
physiotherapy-clinic style: warm white, deep forest green and a little sunrise gold, real clinic
photos, a handwritten motto on the wall and a sun rising over the treatment room.

Everything runs in the browser. The CV is read client-side and never sent to a server.

**Live site:** https://pragyamita-debug.github.io/physical-therapy-support/ (after Pages is switched on — see below)

## How it works

0. **Example first** — the page opens on the full design filled with neutral placeholder text
   (`src/data/placeholder.ts`: “Your Name”, “Your Role”, “Project One”…) and an **Upload CV** button.
1. **Upload** — drag a CV onto the drop zone, or try the bundled sample (`src/data/sample-cv.txt`, a fictional physiotherapist).
2. **Read** — PDF text comes from pdf.js, Word files from mammoth; both load only when needed.
3. **Parse** — `src/lib/parseResume.ts` splits the text into sections (Profile, Experience, Education,
   Skills, Projects, Achievements, Certifications, Goals, Motto…) and works out years of experience
   from the date ranges, counting overlapping jobs once. Healthcare degrees (MPT, BPT, DPT, MHA, MPH, MBBS…) are recognised.
4. **Review** — the candidate checks what was found and fixes anything before the dashboard is built.
5. **Dashboard** — saved to `localStorage`; the gear menu can upload another CV, edit, download or go back to the example.

## What the dashboard shows

| Section | Built from |
| --- | --- |
| Green strip | motto, phone (or email) |
| Top bar | leaf-and-sun mark, name, role, section links, **Upload CV** / **Get in touch** |
| Hero | specialty and city, name (last name in green), role, tagline, four counting facts — years, projects, skills, degree — and the photo with the motto handwritten on the wall |
| Areas of Expertise | six photo cards from the projects (skills fill in if there are fewer than six); **Learn more** opens the details |
| About me | photo of a clinician with a spine model, the summary, and a checklist of experience, degrees and certifications |
| Experience | roles on a timeline; the lit card walks from role to role and the years count up |
| Skills | icon tiles; **View all** shows the rest |
| Results | achievements and certifications as quote cards, stars filling in |
| Contact band | the next goal, a clinician photo, next step / location / certifications |
| Footer | links, skills, contact details, handwritten motto |

## Animations

| Effect | Where | How |
| --- | --- | --- |
| Counting numbers | hero facts, experience years | `useCountUp` — rAF + ease-out-expo, starts when in view; the “+” lands when the count finishes |
| Decoding text | degree | `useScramble` — characters settle left to right |
| Moving, lit borders | every card | conic gradient on `@property --angle`, masked to a thin ring, plus a blurred halo (`GlowCard`) |
| Hover | cards, icons, skills | pointer spotlight + slight 3D tilt, lift, photo zoom, icon turns green |
| Rising sun | hero photo | the sun climbs into place and the rays start turning |
| Handwriting | hero motto | each word is written in, then the underline draws |
| Role highlight | experience | the active role lights up and hands over to the next (pauses on hover) |

All motion respects `prefers-reduced-motion`.

## Getting started

```bash
npm install
npm run dev          # local dev server
npm test             # parser tests (vitest)
npm run build        # static build in dist/
npm run build:single # one self-contained index.html in dist-single/
```

## Publish on GitHub Pages

1. **Settings → Pages → Build and deployment → Source:** choose **GitHub Actions**.
2. **Actions → Deploy to GitHub Pages → Run workflow** (it also runs on every push to `main`).

## Writing a CV that parses well

- Clear headings: **Experience**, **Education**, **Skills**, **Projects**, **Achievements**, **Certifications**.
- Dates on the role line or the line after it: `Jan 2023 – Present`, `03/2021 - 06/2023`, `2019 - 2022`.
- Optional extras: **Goals** (`Goal: …`, `Next Step: …`), **Motto** (handwritten on the wall), **Interests**.
- Text-based PDFs only — scanned images have no text to read.

## Project structure

```
src/
  App.tsx                 example → upload → reading → review → dashboard
  data/placeholder.ts     the general example profile shown before any upload
  data/sample-cv.txt      fictional sample CV
  lib/
    extractText.ts        PDF / DOCX / TXT → text
    parseResume.ts        text → Resume (+ parseResume.test.ts)
    dates.ts              date ranges and overlap-aware experience totals
    storage.ts            safe localStorage wrapper
  hooks/                  useCountUp, useScramble, useInView, usePointerGlow, useScrollSpy
  components/
    UploadScreen.tsx      drop zone + reading progress
    ReviewDialog.tsx      check and fix the parsed fields
    NavBar.tsx, Hero.tsx, Sections.tsx, Dashboard.tsx
    GlowCard.tsx          the moving-border card
    Logo.tsx              leaf + sun mark
  assets/photos/          hero, six treatment photos, about photo (clinic.jpg), contact photo (doctor.jpg)
  styles/global.css       colour tokens, type, buttons
```

The photos in `src/assets/photos/` were cut from a design mock-up and enlarged 4× with an EDSR
super-resolution network (OpenCV `dnn_superres`) plus a light sharpen. They are much clearer than a plain
resize, but the source was small — swap in higher-resolution photos with the same file names for the sharpest page.
