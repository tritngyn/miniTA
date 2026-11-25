# miniTA frontend prototype (PA3 §6.1–6.3)

Interactive React + TypeScript + Vite prototype used to produce the screen inventory,
the 28 standard screenshots and the accessibility evidence for PA3 §6.

Status: **P2 complete** — all 22 Screen IDs and 28 standard images implemented. Nineteen of
them were built in P2 on top of the approved navy + blue design system. A public homepage at
`/` introduces the product and links into the demo; it has no business Screen ID.

## Requirements

Node 20+ and npm. Nothing else; the Geist Sans woff2 files are committed under `public/fonts`.

```bash
npm install
npm run dev          # http://localhost:5173  (redirects to /gallery)
```

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | `tsc --noEmit` plus a production build into `dist/` |
| `npm run preview` | Serve the built app on port 4173 |
| `npm run shoot` | Build, then capture all 28 standard images |
| `npm run shoot:one -- SCR-07` | Capture one Screen ID (comma separated list allowed) |
| `node scripts/screenshot.mjs --evidence` | Capture the extra scenario states into `redesigned/evidence` |
| `npm run shoot:home` | Capture the homepage at 1280×800 and 390×844 into `redesigned/evidence` |
| `npm run check:manifest` | Verify 22 Screen IDs, 28 image paths and the frozen basenames |
| `npm run a11y` | axe (WCAG 2.0/2.1/2.2 A/AA), contrast pairs, keyboard trace, hover/selected/error states |
| `npm run test:flows` | 34 functional checks: auth, job publish prerequisites, rubric validity, application errors, magic link, notes/scorecard/status independence |

`shoot`, `a11y` and `test:flows` start `vite preview` themselves and stop it afterwards. If
bundled Chromium is missing, the scripts fall back to the installed Chrome channel
(`PLAYWRIGHT_CHANNEL=edge` switches to Edge).

## Screens and scenarios

| Route | Screen | Scenarios |
| --- | --- | --- |
| `/` | Public homepage (supplementary, no Screen ID) | — |
| `/gallery` | Review gallery (never captured) | — |
| `/screens/SCR-01` | Login | `?state=loading` |
| `/screens/SCR-02` | Login error | — |
| `/screens/SCR-03` | Access denied | — |
| `/screens/SCR-04` | Applicant Inbox | `?state=empty`, `?job=JOB-FE` |
| `/screens/SCR-05` | Create / edit job | `?state=new`, `?state=validation`, `?job=` |
| `/screens/SCR-06` | Job postings | `?state=empty` |
| `/screens/SCR-07` | Job detail, publish, close | `?state=draft`, `?state=closed`, `?job=` |
| `/screens/SCR-08` | Rubric builder (manual) | `?job=` |
| `/screens/SCR-09` | Rubric builder — error | preloaded invalid weights |
| `/screens/SCR-10` | AI rubric draft — JD input | `?state=unavailable`, `?state=invalid` |
| `/screens/SCR-11` | Review AI rubric draft | — |
| `/screens/SCR-12` | Application form | `?state=duplicate` |
| `/screens/SCR-13` | Application form — error | preloaded missing fields |
| `/screens/SCR-14` | Application submitted | `?application=` |
| `/screens/SCR-15` | Status portal (magic link) | `?state=expired`, `?state=invalid`, `?application=` |
| `/screens/SCR-16` | Link unavailable / replacement | `?state=invalid` |
| `/screens/SCR-17` | Applicant detail | `?state=extraction-failed`, `?application=` |
| `/screens/SCR-18` | Internal notes | `?application=` |
| `/screens/SCR-19` | Human scorecard | `?state=incomplete`, `?application=` |
| `/screens/SCR-20` | Update application status | `?state=confirmed`, `?application=` |
| `/screens/SCR-21` | Recruitment dashboard | `?state=empty`, `?state=error` |
| `/screens/SCR-22` | Public job page | `?state=closed` |

Screen IDs and image basenames are frozen. Extra states are query parameters on the same
screen, never new IDs. `SCR-09` and `SCR-13` reuse the SCR-08 and SCR-12 components.

The homepage is a marketing surface, not a business screen: it introduces who miniTA is for,
shows five cropped screenshots of the prototype and links to `/gallery`, SCR-01 and SCR-22.
It is not part of the 28-image set and has no entry in `screen-manifest.json`.

## Screenshots

Output: `../miniTA-screen-images/redesigned/screens/{hr-desktop,candidate-desktop,candidate-mobile}`
with the same basenames as the original images. Scenario evidence goes to
`../miniTA-screen-images/redesigned/evidence`.

| Group | Viewport | DPR | Result |
| --- | --- | --- | --- |
| `hr-desktop`, `candidate-desktop` | 1280 × 800 | 1 | full page, variable height |
| `candidate-mobile` | 390 × 844 | 2 | 780px wide full page |

Each capture waits for the app-ready marker and `document.fonts.ready`, disables transitions,
resets the fixture by loading the page fresh and records browser, viewport, route and scenario
in `redesigned/docs/{screenshot,evidence}-run.json`.

## Review workflow

1. `npm run dev`, open `/gallery`.
2. Pick a screen or scenario; use `Reset demo data` after trying actions (the fixture is shared
   by every screen and lives only in memory).
3. `npm run check:manifest`, `npm run a11y`, `npm run test:flows` to refresh evidence.
4. `npm run shoot` and `node scripts/screenshot.mjs --evidence` for images.

## Structure

```
screen-manifest.json        single source for gallery, capture and completeness
src/theme.ts                tokens, MUI theme, status palette
src/data/fixtures.ts        shared demo data, fixed clock, magic links, AI draft
src/data/store.tsx          in-memory store, reset, job/rubric/application actions
src/components/             shell, page header, fields, status chip, callout, dialogs,
                            stage rail, pipeline strip, applicant header
src/screens/auth/           SCR-01, SCR-02, SCR-03
src/screens/hr/             jobs, rubric, applicant, notes, scorecard, status, dashboard
src/screens/candidate/      application, submitted, status portal, link, public job
src/screens/public/         homepage (Persuade surface, local CSS)
src/gallery/                review-only gallery
scripts/                    screenshots, homepage shots, manifest check, accessibility, flow checks
public/homepage/            cropped homepage images derived from the standard screenshots
PRODUCT.md, DESIGN.md       product truth and design system decisions
```

## Known limits

No backend, auth, database, email, AI or PDF processing. File choice is validated in the
browser and only its name is kept. Role gating, magic-link validation and status permissions
are rendered, not enforced. Open issues (PDF scan, email recovery, Hiring Manager rights,
matching basis, scorecard scale, status transitions) are listed in `PRODUCT.md` and on the
gallery page.
