# miniTA prototype — product decisions

This file is the product truth for the PA3 §6.1–6.3 prototype. It records what the demo
does, what it deliberately does not do, and which questions stay open. The UI copy is English.

## Purpose

A working frontend for the miniTA hiring product (PA1/PA2 baseline), used to review screen
design and interaction states for the Software Design document. The prototype exists to:

1. produce the 22-screen inventory and the 28 standard screenshots (16 HR desktop,
   6 candidate desktop, 6 candidate mobile);
2. make validation, error and empty states visible and reviewable;
3. give the accessibility and responsive checklist real evidence from a browser.

It is **not** a production build. There is no backend, database, authentication, email
delivery, AI call or PDF processing.

## Users and surfaces

| Surface | Role | What the person is doing |
| --- | --- | --- |
| HR workspace | Recruiter (Hiring Manager rights OPEN) | Create a job, configure and approve a rubric, review applicants, save a scorecard, change an official status |
| Candidate | Candidate | Read a public job page, apply with one PDF CV, track the official status through a magic link |

A Candidate never sees internal notes, scorecards, recommendations, matching evidence or
other candidates. The prototype enforces that in rendering only; it proves no backend
authorisation.

## Scope

All 22 Screen IDs from PA2 are implemented, with the 28 standard images captured. The demo
covers access control, job lifecycle, rubric authoring (manual and AI-assisted), candidate
application and status tracking, applicant review (notes, scorecard, status), and the
recruitment dashboard. Nineteen screens were built in P2 on top of the P1 design system.

A gallery at `/gallery` lists every screen, its scenarios and the open issues; it is a review
tool and never appears in the 28 standard screenshots. There is no marketing homepage and no
extra Screen ID for one.

## Product rules the prototype shows

- **Job lifecycle** Draft → Published → Closed; applications are accepted only while
  Published (BR-08).
- **Rubric** weights are positive percentages that must total exactly 100% before approval
  (BR-09). Editing an approved rubric resets it to Draft and needs re-approval (BR-06,
  UC-03 A2). AI is an optional drafting path; manual entry always works (BR-07).
- **Application** requires contact details, every screening question, exactly one PDF ≤ 5 MB
  with selectable text, and explicit privacy consent (UC-04). One active application per
  email and job (BR-10). A scanned PDF is accepted and flagged for manual review; the
  prototype states this instead of pretending to process it.
- **Matching score** is decision support only. It never changes a status; a recruiter decides
  every status change (FR-25, UC-07).
- **Official status** is what the Candidate sees. Notes, scorecards and matching evidence stay
  internal (BR-05).
- **Magic link** is valid for 72 hours; expired and invalid links lead to a replacement
  request by email (UC-05 A1/E1/E2). The demo uses a fixed clock (2025-11-20T09:00Z).

## Behaviour implemented in the demo

- **Access control:** sign-in validates a demo account list and a wrong account reaches the
  error screen; access denied offers sign-out as the only recovery. No session, token or
  password check is real.
- **Jobs:** create/edit validates title and JD (UC-02 E1), saves a draft or changes, publishes
  only when one approved rubric exists, generates the public link on publish, and closes a job
  after confirmation. Closed jobs disable applications.
- **Rubrics:** one structured editor shared by manual entry, the error state and AI review.
  Weights must be finite, positive and total exactly 100%; the total bar says `Weights valid`
  only then. Editing an approved rubric requires re-approval; an unchanged approved rubric
  cannot be re-approved. The AI path can time out or return an unusable proposal; both fall
  back to the manual editor.
- **Applications:** one PDF with selectable text up to 5 MB, every screening question, and
  consent are required; invalid type, oversize file, missing fields and duplicate active
  applications are rejected in the browser. A successful submit reaches the confirmation with
  the reference and the 72-hour link notice.
- **Status portal:** read-only official status and submitted details; expired or invalid links
  are refused and a replacement can be requested by email without revealing whether the address
  is registered.
- **Review workspace:** applicant detail with matching evidence or an extraction-failed state,
  CV metadata, screening answers and the latest notes; notes, scorecard and status are three
  separate actions. Saving a scorecard never changes the status; a status change never requires
  a scorecard and is confirmed in a dialog.
- **Dashboard:** counts by job and status, matching distribution and basic conversion, all
  derived from the same fixture, with an empty state and an error state with retry.

## Fixtures

One in-memory fixture set is shared by every screen (`src/data/fixtures.ts`):

- 4 jobs: UI/UX Designer, Software Engineer (Backend), Software Engineer (Frontend) —
  Published; Product Marketing Manager — Closed, zero applications (used for the empty
  inbox state).
- 6 applications spanning Applied, Under Review, Shortlisted and Rejected, including one
  whose CV text could not be extracted (`N/A` score) and one with `N/A` for the empty state.
- Rubrics for all three published jobs; the Frontend rubric is approved and holds three
  screening questions.

`Reset demo data` in the review gallery restores the seed. Dates come from the fixed clock,
never from the machine.

## Explicitly out of scope

No backend, no real authentication, no database, no email delivery, no AI request, no PDF
parsing, no file storage, no analytics, no production API. Uploads are validated in the
browser and only the file name is kept.

## Open issues (not decisions)

| ID | What stays open | How the prototype handles it |
| --- | --- | --- |
| ISSUE-01 | Scanned PDF handling | File is accepted; the screen says it may need manual review. No extraction is claimed. |
| ISSUE-02 | Email delivery failure recovery | No email is sent. The submitted screen states the link is emailed; recovery UI is P2. |
| ISSUE-03 | Hiring Manager rights outside the scorecard demo | SCR-19 demonstrates required comments and one recommendation for shortlisted applicants on assigned jobs. Official status updates stay with the Recruiter. |
| ISSUE-04 | Matching basis / confidence | Scores come from fixtures. No confidence label is shown. |
| Rating scale | Scorecard criteria and 1–5 scale | Illustrative data only; marked as such in the interface and in §6. |
| O-1 | Approved role-permission matrix | Access denied and role gating are demo-only; the matrix is not invented. |
| Q-A1 | Allowed official status transitions | The prototype allows any of the five statuses and records it; no transition graph is asserted. |
| Scorecard rubric | Criteria and the 1–5 scale | Four criteria and the scale are illustrative; the screen says so. |
| Email delivery | Confirmation and replacement emails | Simulated only: no message is sent and no delivery failure UI is claimed. |
| Magic link | 72-hour validity | Validated with a fixed clock (2025-11-20T09:00Z); tokens are fixture strings, not signed. |
| Matching basis | How a score is produced | Scores and evidence are fixture values presented as decision support (ISSUE-04). |

## Public homepage (supplementary)

`/` is a product introduction for demo viewers, not a business screen. It has no Screen ID and
no entry in the manifest. It states who the product is for, shows five cropped screenshots of
the prototype and links to the gallery, sign-in and the sample job. It is labelled
`Interactive prototype · Sample data` and makes no commercial claims: no pricing, signup,
customer logos, testimonials, integrations or job-board scope. Matching, AI and email wording
follows the same OPEN issues as the app (AI drafts are reviewed by a recruiter, scores support
human review, official status is set by a recruiter). The gallery remains a review tool at
`/gallery`.

## Visual direction

The interface uses the palette approved on **24 November 2026**: deep navy shells (HR rail,
candidate and auth headers, homepage hero and footer) around a light blue-grey workspace with
white surfaces, blue primary actions and links, and a small teal accent on dark surfaces.
Status keeps its own colours. It replaces the earlier navy + teal direction; layout, type and
behaviour did not change. Tokens, measured contrast and the per-surface allocation are recorded
in `DESIGN.md` and in `miniTA-screen-images/redesigned/docs/a11y-run.json`.

## Copy rules

Plain product language, no marketing verbs. Controls name their action ("Approve rubric",
"Attach one PDF CV"), errors name the field and the recovery. No emoji, no invented features
(site search, markdown notes, @mentions, time filters).
