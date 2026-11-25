# miniTA design system

Palette approved by the user on **24 November 2026**: deep navy shells with a light blue-grey
workspace, blue actions and a small teal accent. It replaces the earlier navy + teal direction.
Surface modes: **Operate** for the 22 business screens, **Persuade** for the public homepage.

## Direction

The product shell is navy, the work is light: a pale blue-grey canvas, white surfaces and forms,
and a deep navy rail or header that frames the workspace. Blue carries action (primary buttons,
links, focus, checked controls); navy frames; teal appears only as a small accent on dark
surfaces. Status keeps its own semantics (amber under review, violet shortlisted, green
hired/approved, red rejected) and is never expressed by blue alone. No gradients, no glass, no
emoji, no decorative serif, no ambient or scroll motion.

Signature move: the **pipeline strip** — a one-line count of applications per official stage
above the inbox table, in tabular numerals. It gives recruiters the shape of the queue without
a chart and without turning the score into a headline metric.

## Tokens

| Token | Value | Use |
| --- | --- | --- |
| `canvas` | `#F3F7F8` | Page ground, HR and candidate content |
| `surface` | `#FFFFFF` | Cards, tables, inputs, light headers |
| `surfaceSunken` | `#EAF1F4` | Table head, inline panels, feature frames |
| `navy` | `#0F172A` | HR rail, candidate/auth headers, homepage hero and footer |
| `navySoft` | `#1E293B` | Selected rail item, hover surfaces, illustration frame |
| `onNavy` | `#F8FAFC` | Wordmark, headings and labels on navy |
| `onNavyMuted` | `#CBD5E1` | Secondary copy on navy |
| `blueLight` | `#3B82F6` | Selection marker and focus ring on navy |
| `ink` | `#0F172A` | Headings and body text on light surfaces |
| `textSecondary` | `#526477` | Labels, descriptions, table head |
| `textMuted` | `#5F7283` | Helper text and metadata (measured per background) |
| `border` | `#D6E1E7` | Dividers and surface borders |
| `borderStrong` | `#748899` | Default control border (3.67:1 on white, 3.40:1 on canvas, 3.21:1 on sunken) |
| `accent` / primary | `#2563EB` | Primary button and checked control |
| `accentHover` | `#1D4ED8` | Primary hover |
| `accentPressed` | `#1E40AF` | Primary pressed |
| `accentSoft` | `#DBEAFE` | Selected/highlight fill on light, info callout |
| `selectedInk` | `#1E40AF` | Text on `accentSoft` |
| `link` / `linkHover` | `#1D4ED8` / `#1E40AF` | Links on light surfaces |
| `teal` | `#14B8A6` | Small accent only, e.g. the demo dot on navy |
| `contrastText` | `#FFFFFF` | Text/icon on blue |
| `neutralInk` / `neutralSoft` | `#475569` / `#E8EEF2` | Applied, Draft, neutral |
| `warn` / `warnSoft` | `#7A4D00` / `#FFF1D6` | Under Review, warnings |
| `infoInk` / `infoSoft` | `#4338A3` / `#EEEBFF` | Shortlisted |
| `success` / `successSoft` | `#25633B` / `#E7F3EA` | Hired, Approved, confirmations |
| `danger` / `dangerSoft` | `#A12825` / `#FBECEB` | Rejected, validation errors |

### Measured contrast (Chromium, theme-refresh run)

- Text: **27/27 pairs ≥ 4.5:1** — body on white 16.55, body on navy 17.06, selected nav on
  navy soft 13.98, muted text on navy 12.02, link on white 6.70, white on primary 5.17,
  muted helper on canvas 4.61, info callout 7.15, status labels 6.29–7.70.
- UI boundaries: **7/7 ≥ 3:1** — control border 3.67/3.40/3.21, primary button on white 5.17,
  nav marker on navy soft 3.98, focus ring on navy 4.85.
- Computed checks on the rendered app: **9/9** — selected rail item `#1E293B` / `#F8FAFC` /
  blue marker `#3B82F6`, link `#1D4ED8`, primary rest/hover/pressed
  `#2563EB`/`#1D4ED8`/`#1E40AF` with disabled `#E8EEF2`, navy hero/footer/header, blue submit,
  red invalid border and the light secondary CTA border (3.98:1).
- **Control border (WCAG 1.4.11):** `#748899` measures 3.67:1 on the rendered control
  (SCR-08); decorative dividers keep the lighter `border` token.
- These numbers cover text and UI-boundary contrast plus automated axe checks. They do not
  prove screen-reader behaviour, Edge rendering or backend authorization.
- Full table: `miniTA-screen-images/redesigned/docs/a11y-run.json`.

## Type

Geist Sans, bundled locally as woff2 (`public/fonts`, SIL OFL). No external font request.

| Role | Size / line / weight |
| --- | --- |
| Page title | `clamp(24px, 3.4vw, 28px)` / 1.2 / 600, tracking −0.02em |
| Section title | 17px / 1.4 / 600 |
| Body | 16px / 1.55 / 400 |
| Form label, table cell | 14–15px / 1.5 / 500 |
| Table head, metadata | 13–13.5px / 1.45 / 600 (head), 400 (metadata) |
| Numerals in tables and counts | tabular (`font-variant-numeric: tabular-nums`) |

Text measure stays under 72 characters; descriptions cap at 720px.

## Layout and density

- HR shell: 236px navy rail + 60px light header + content max 1160px, left aligned, 40px
  page padding.
- Rail: light wordmark and label on navy, three nav items at 42px. Hover and the selected item
  show a 3px `blueLight` marker; selected item uses `navySoft` fill and `onNavy` text. No
  dark-on-light switch: the rail is always dark. User identity stays in the light header.
- Candidate/auth shell: navy header, light content; no product navigation.
- Forms are one column with the label always visible above the control (notched outline).
- Controls: 44px buttons, 46px inputs/selects, 56–72px table rows, 4/8px spacing scale,
  8–10px radius, 1px borders, no shadows.

## Components

- **Status chip**: tinted background + outline icon + text label. Never colour alone.
- **Callout**: full border + tint + leading icon; info is blue-soft, warning amber, error red,
  success green. Borders are derived from the state token with `color-mix`, not new hex values.
- **Form field**: outlined TextField, label always visible, helper below, error replaces helper,
  `aria-required`, `aria-invalid`, `aria-describedby`. Focus = 2px blue border; an invalid field
  keeps its red border and gains a blue ring so focus and error stay distinct.
- **Skill chips**: removable pills with an icon button labelled `Remove <skill>`.
- **Pipeline strip**: definition list, counts in tabular numerals, one hairline above.
- **Buttons**: blue filled primary (`#2563EB` → hover `#1D4ED8` → pressed `#1E40AF`), outlined
  secondary (white, navy text, `borderStrong`), text tertiary. Disabled primary uses the neutral
  tint with muted text. Focus ring 2px blue on light, `blueLight` on navy.
- **File input**: native input styled as a dashed row; stays keyboard operable.
- **Dialog**: MUI dialog for confirmations (close job, change status); focus moves into the
  dialog, Escape cancels and focus returns to the trigger.
- **Radio groups**: native inputs inside a fieldset with a legend; the visible circle carries
  the focus ring, and the invalid field keeps its red border plus the blue ring.
- **Charts**: data marks never use the action blue. Matching distribution uses navy; pipeline
  conversion uses each status colour, so data meaning survives the palette change.

## Interaction rules

- Filters apply on change; no "Apply" button. Results count is announced politely.
- Errors appear as a focused summary plus inline messages; every message says how to fix it.
- Saving a scorecard and changing a status stay separate actions.
- Magic-link states are scenarios of the same screen, not new Screen IDs.
- Motion is limited to 120ms colour feedback; the capture build disables transitions.

## Accessibility baseline

- Focus visible on links, buttons, icon buttons, checkboxes and inputs (verified by trace).
- Contrast ≥ 4.5:1 for text; status uses label + icon + colour.
- Targets ≥ 24×24px (icon buttons), 44px for primary controls.
- Checked at 1280, 1024, 390 and 360px; no horizontal overflow in the theme-refresh run.

## Public homepage (Persuade)

The homepage is the only Persuade surface. It keeps the palette and Geist Sans but spends more
space on one message. The header, features and how-it-works sections stay light; the hero and
footer are navy. No gradients, decorative serif, emoji, scroll animation or faux chrome.

- Header: 72px light bar, wordmark, anchors to `#features` and `#how-it-works`, outlined Sign in.
- Hero: navy ground, headline, one-sentence description, blue `Explore demo` (gallery),
  secondary `See how it works` with light text and border, and the
  `Interactive prototype · Sample data` note with the teal demo dot.
- Hero art: the purple recruiting illustration supplied by the team, 1220×740, framed on
  `navySoft` with rounded corners and shown in full. It is not a product screenshot.
- Features: three alternating blocks; images are real crops of the current standard set
  (rubric weights, matching evidence, public job, candidate status), refreshed whenever the
  standard images change. The third block places two images full width below the copy.
- How it works: three numbered steps, then the final blue demo CTA.
- Footer: navy, light wordmark, teal demo dot, light links.
- Homepage CSS is local to `src/screens/public/homepage.css`; it reuses the CSS variables from
  `styles.css` and adds no dependency.

## Do not

Emoji as icons, site-wide search, demo links such as "View error state" inside a product
screen, centred page titles that repeat the breadcrumb, invented product features, large
marketing whitespace, faux browser chrome, scroll animations, blue used to mean success or a
data value, teal used as the action colour, or a status that relies on colour alone.
