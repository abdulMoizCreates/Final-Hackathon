# HCM Lite - Design

Read this file when: building or changing any screen, component, style, animation, copy, empty state or PDF.
Authority: this file overrides any palette, font or style an agent or a design skill would choose by default. If you use a design skill such as `frontend-design`, follow its process (plan, review against the brief, build, critique) but take every visual decision from here. The skill's list of generic AI traits is built into section 12.

---

## 1. Brand identity

**Product:** HCM Lite, a human capital management system for small and mid-size companies in Pakistan. Three kinds of people use it: an Admin who sets up the company, an HR team that runs daily operations, and employees who check in, request leave and read payslips.

**Promise:** Attendance, leave and payroll that agree with each other. Every number on a screen, in a payslip and in an AI answer traces to the same record. This is the product truth the brand expresses.

**Personality:** precise, calm, trustworthy, quietly confident. It should feel like a well-kept ledger in a well-designed office: exact, unhurried, nothing shouting. Premium comes from restraint, generous space, exact type and numbers that line up, not from effects.

**What it must not feel like:** a generic SaaS template, a fintech app, a startup landing page, an AI demo. No purple, no gradients, no glass, no decoration without a job.

**Color story:** Spruce is the brand color: the deep green of ledgers and trust, not the corporate blue or fintech purple every competitor uses. Marigold is the "now" color: used only for the one live or attention element on a screen (the current time on the DayRail, today on a calendar, the pending count). Everything else is mineral neutrals. Marigold is never a background for body text and never used for more than one element per view region.

**Type story:** Geist carries the interface and every number. Newsreader, a text serif with optical sizes, appears only where the product behaves like a document: page titles, the company name, the payslip and the public landing headline. This is deliberate. HR is paperwork, and the serif marks the moments that are records.

**Signature element: the DayRail.** A thin horizontal timeline of the working day with the office start, grace window, check-in point and worked time. It is the memorable thing in this product. It appears in the check-in widget, attendance rows, auth screens and the landing page. Everything around it stays quiet.

**Logo.** Rounded square in Spruce with a white horizontal line (the rail) and a Marigold dot on the line (a person checking in). Wordmark is "HCM Lite" in Geist 600, letter-spacing -0.02em, one weight, one color. Minimum mark size 24 px; clear space equals half the mark height. The mark is also the favicon.

```svg
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="8" fill="#0F4C45"/>
  <rect x="7" y="15" width="18" height="2" rx="1" fill="#FFFFFF"/>
  <circle cx="14.5" cy="16" r="3.5" fill="#F2B01E"/>
</svg>
```

**Voice:** plain, specific, sentence case, active verbs. No exclamation marks, no "Oops", no filler, no emojis, no marketing adjectives. Say what happened and what to do next. Dates are absolute ("25 Oct 2026"). Names of things are what users already say: Attendance, Leave, Payroll, Payslips. The AI assistant may answer in Roman Urdu when the user writes in it; the interface itself is English.

**Local conventions:** currency "PKR 185,000" (no decimals), time in 12-hour format ("9:07 AM"), dates "25 Oct 2026", week starts Monday in calendars, weekend Saturday and Sunday by default.

## 2. Design principles

1. **The day is the unit.** Time and status are shown on the DayRail, not in prose.
2. **Numbers are the hero.** Large, tabular, undecorated. No icons or sparklines beside KPIs by default.
3. **Quiet surfaces.** Separate content with tone (white on mineral) and space. Lines only where they carry meaning: table row dividers, input outlines, focus.
4. **Spend boldness in one place.** The Spruce sidebar and the DayRail. Everything else is disciplined.
5. **Empty is the first impression.** The product starts with no data, so empty states are designed screens with a clear next action.
6. **Say it plainly.** Every word does one job.
7. **Consistency over cleverness.** One component for one job, reused everywhere.

## 3. Tokens

Source of truth: `apps/web/src/styles/tokens.css`. Components use tokens only. No hex values, pixel sizes or font names outside this file.

### 3.1 Color

| Token | Light | Dark | Use |
|---|---|---|---|
| `--canvas` | `#F2F5F3` | `#0B1513` | App background |
| `--surface` | `#FFFFFF` | `#12201D` | Cards, panels, tables |
| `--sunken` | `#E8EEEB` | `#0E1A17` | Hover, track, skeleton, secondary button |
| `--ink` | `#10231F` | `#E7EFEC` | Primary text (deep spruce, not neutral black) |
| `--ink-2` | `#3E524D` | `#AEC0BA` | Secondary text |
| `--ink-3` | `#5F716C` | `#839690` | Labels, hints (AA on canvas and surface) |
| `--line` | `#D3DCD8` | `#223632` | Input outlines, table row dividers |
| `--primary` | `#0F4C45` | `#3FB59B` | Primary button, links, selected, DayRail worked time |
| `--primary-hover` | `#0A3D37` | `#59C8AF` | Hover |
| `--primary-soft` | `#DCEBE6` | `#12332D` | Selected rows, avatar fill, prefill highlight |
| `--on-primary` | `#FFFFFF` | `#06201B` | Text on primary |
| `--highlight` | `#F2B01E` | `#F2B01E` | The one "now" element per region |
| `--highlight-soft` | `#FCEFC9` | `#3A2E0C` | Grace window on the DayRail, today cell |
| `--on-highlight` | `#10231F` | `#10231F` | Text on highlight |
| `--sidebar` | `#0F2420` | `#08110F` | Sidebar background |
| `--sidebar-ink` | `#DCE8E4` | `#DCE8E4` | Sidebar text |
| `--sidebar-ink-2` | `#8FA7A0` | `#8FA7A0` | Sidebar secondary text, inactive items |
| `--sidebar-active` | `#1B3731` | `#16302A` | Active item fill |
| `--focus` | `#1C7C6E` | `#59C8AF` | 2 px focus ring, 2 px offset |
| `--scrim` | `rgba(16,35,31,0.45)` | `rgba(0,0,0,0.6)` | Dialog backdrop |

Status colors (foreground on soft background; the label text is always shown, color is never the only signal):

| Status | Light fg / bg | Dark fg / bg |
|---|---|---|
| present | `#17694B` / `#DDF0E7` | `#6FD3A8` / `#123B2D` |
| late | `#9A4A00` / `#FBE6D3` | `#F0A56A` / `#3A2312` |
| half_day | `#5E3F96` / `#ECE6F6` | `#B9A2E8` / `#2A2142` |
| absent | `#A7261B` / `#FBE3E0` | `#F08C82` / `#3C1A17` |
| on_leave | `#1F5F99` / `#DEEBF7` | `#7DB5EA` / `#142B42` |
| missing_checkout | `#4C5B57` / `#E3E9E6` | `#A5B6B1` / `#1E2B28` |

Request states reuse the same family: pending uses missing_checkout colors, approved uses present, rejected uses absent, cancelled uses missing_checkout, draft uses half_day, finalized uses present.

Chart series in order: `--chart-1 #0F4C45`, `--chart-2 #F2B01E`, `--chart-3 #1F5F99`, `--chart-4 #7A5BB5`, `--chart-5 #9AAAA5` (dark mode lifts each by about 25 percent lightness). A single-series chart always uses chart-1; use chart-2 only to mark the selected or current bar.

```css
:root {
  --canvas:#F2F5F3; --surface:#FFFFFF; --sunken:#E8EEEB;
  --ink:#10231F; --ink-2:#3E524D; --ink-3:#5F716C; --line:#D3DCD8;
  --primary:#0F4C45; --primary-hover:#0A3D37; --primary-soft:#DCEBE6; --on-primary:#FFFFFF;
  --highlight:#F2B01E; --highlight-soft:#FCEFC9; --on-highlight:#10231F;
  --sidebar:#0F2420; --sidebar-ink:#DCE8E4; --sidebar-ink-2:#8FA7A0; --sidebar-active:#1B3731;
  --focus:#1C7C6E; --scrim:rgba(16,35,31,0.45);
  --st-present-fg:#17694B; --st-present-bg:#DDF0E7;
  --st-late-fg:#9A4A00; --st-late-bg:#FBE6D3;
  --st-half-fg:#5E3F96; --st-half-bg:#ECE6F6;
  --st-absent-fg:#A7261B; --st-absent-bg:#FBE3E0;
  --st-leave-fg:#1F5F99; --st-leave-bg:#DEEBF7;
  --st-missing-fg:#4C5B57; --st-missing-bg:#E3E9E6;
  --chart-1:#0F4C45; --chart-2:#F2B01E; --chart-3:#1F5F99; --chart-4:#7A5BB5; --chart-5:#9AAAA5;

  --font-sans: var(--font-geist), ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-display: var(--font-newsreader), Georgia, "Times New Roman", serif;

  --r-control:8px; --r-card:12px; --r-panel:16px; --r-pill:999px;
  --shadow-overlay: 0 16px 48px rgba(16,35,31,0.16), 0 2px 8px rgba(16,35,31,0.06);

  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px; --space-5:24px;
  --space-6:32px; --space-7:48px; --space-8:64px; --space-9:96px;

  --dur-fast:120ms; --dur-base:200ms; --dur-slow:360ms;
  --ease-out:cubic-bezier(0.22,1,0.36,1);
}
.dark {
  --canvas:#0B1513; --surface:#12201D; --sunken:#0E1A17;
  --ink:#E7EFEC; --ink-2:#AEC0BA; --ink-3:#839690; --line:#223632;
  --primary:#3FB59B; --primary-hover:#59C8AF; --primary-soft:#12332D; --on-primary:#06201B;
  --highlight-soft:#3A2E0C;
  --sidebar:#08110F; --sidebar-active:#16302A;
  --focus:#59C8AF; --scrim:rgba(0,0,0,0.6);
  --st-present-fg:#6FD3A8; --st-present-bg:#123B2D;
  --st-late-fg:#F0A56A; --st-late-bg:#3A2312;
  --st-half-fg:#B9A2E8; --st-half-bg:#2A2142;
  --st-absent-fg:#F08C82; --st-absent-bg:#3C1A17;
  --st-leave-fg:#7DB5EA; --st-leave-bg:#142B42;
  --st-missing-fg:#A5B6B1; --st-missing-bg:#1E2B28;
}
@theme inline {
  --color-canvas: var(--canvas); --color-surface: var(--surface); --color-sunken: var(--sunken);
  --color-ink: var(--ink); --color-ink-2: var(--ink-2); --color-ink-3: var(--ink-3); --color-line: var(--line);
  --color-primary: var(--primary); --color-primary-soft: var(--primary-soft);
  --color-highlight: var(--highlight);
  --font-sans: var(--font-sans); --font-display: var(--font-display);
  --radius-control: var(--r-control); --radius-card: var(--r-card); --radius-panel: var(--r-panel);
}
```

Map every shadcn/ui variable (`--background`, `--foreground`, `--card`, `--border`, `--ring`, `--primary`, `--muted`, `--destructive`, and so on) to these tokens in `globals.css`. Do not leave shadcn defaults in place.

### 3.2 Typography

Fonts load with `next/font` (Geist and Newsreader from Google Fonts), `display: swap`, with the fallbacks in `--font-sans` and `--font-display`. Newsreader uses its optical size axis (`font-optical-sizing: auto`).

| Style | Family | Size / line | Weight | Tracking | Use |
|---|---|---|---|---|---|
| display-xl | Newsreader | 72 / 76 | 300 | -0.02em | Landing headline only |
| display-l | Newsreader | 56 / 60 | 300 | -0.02em | Setup and login hero text |
| page-title | Newsreader | 32 / 40 | 400 | -0.01em | Page title, company name, payslip title |
| heading | Geist | 18 / 26 | 600 | -0.01em | Panel and section headings |
| kpi | Geist | 36 / 40 | 500 | -0.02em | KPI values (tabular) |
| body | Geist | 14 / 20 | 400 | 0 | Default interface text |
| body-lg | Geist | 16 / 24 | 400 | 0 | Form inputs on mobile, long text, AI answers |
| label | Geist | 13 / 18 | 500 | 0 | Field labels, KPI labels, table headers |
| caption | Geist | 12 / 16 | 400 | 0 | Hints, timestamps, helper text |

Rules:
- Sentence case everywhere. No all-caps labels, no tracked-out eyebrows.
- All numbers in tables, KPIs, charts and times use `font-variant-numeric: tabular-nums` (utility class `num`).
- Maximum line length 72 characters for prose. Serif prose gets one step more line height.
- No single-word emphasis (one italic or colored word) in any heading.
- Monospace is allowed only for JSON before/after in the audit log and for employee codes in tables.
- Inputs are 16 px on screens under 768 px wide to prevent mobile zoom.

### 3.3 Spacing, radius, elevation

- Spacing is a 4 px base on an 8 px rhythm: 4, 8, 12, 16, 24, 32, 48, 64, 96. Nothing else.
- Radius by hierarchy, not one value for everything: controls 8, cards 12, panels and dialogs 16, pills 999. Nested elements use the smaller radius.
- Cards have no border and no shadow. They are white on a mineral canvas. Only overlays (popovers, dialogs, drawers, toasts) use `--shadow-overlay`.
- Border policy: 1 px `--line` is allowed on inputs, selects, and as a hairline between table rows and between list items. Nothing else gets a border. Never border a card, a KPI, a chart, a sidebar item or an image.

### 3.4 Breakpoints

`base` 375 px and up, `sm` 640, `md` 768, `lg` 1024, `xl` 1280. Mobile first. Nothing may break at 375 px.

## 4. Layout system

**App shell.** Sidebar plus content on `--canvas`.
- Sidebar: 264 px wide at `xl`, 72 px icon rail at `md` to `lg`, off-canvas drawer below `md`. Background `--sidebar`. Contains the logo, role navigation, and at the bottom the signed-in person (name, role as plain text) with a menu. Active item uses `--sidebar-active` fill and `--sidebar-ink` text; inactive uses `--sidebar-ink-2`. No left bar, no border, no badges except a small count for approvals and notifications.
- Content: max width 1200 px, centered in the remaining space. Horizontal padding 40 px at `xl`, 32 at `md`, 16 at base.
- Top region: no heavy top bar. Each page starts with a header row: page title (page-title style) on the left; the page actions and the notification bell and the assistant button on the right. Below the title a caption line with real context (for example the date, or the company name).

**Grid.** 12 columns, gap 24 px (16 px at base). Content blocks span whole columns; never place a card at an arbitrary width.

**Vertical rhythm.** 32 px between page sections, 24 px between panels in a grid, 16 px between a heading and its content, 8 px between a label and its field. Panel padding 24 px (16 px at base).

**Page anatomy.** Header row, optional filter bar (one row, controls aligned left, results count aligned right), primary content panel, secondary panels. One primary action per page, top right.

**Dashboard compositions** (ASCII, columns out of 12):

```
Employee dashboard (xl)
+-------------------------------------------+---------------------------+
| Check-in panel (cols 1-7)                 | This week (cols 8-12)     |
| DayRail large, status, [Check in] 48 px   | hours 31.5 of 40 h, bar   |
|                                           | late count, leave left    |
+-------------------------------------------+---------------------------+
| Last payslip (cols 1-5)  | Announcements (cols 6-12)                  |
+---------------------------+--------------------------------------------+

HR dashboard (xl)
+--------------------------------------------------------------------+
| KPI strip: Headcount | Present | On leave | Late today | Pending    |
+-------------------------------------------+------------------------+
| Attendance trend (cols 1-8)               | Top late-comers (9-12) |
+----------------------+--------------------+------------------------+
| Absenteeism by dept  | Leave by type      | Summary (AI)           |
+----------------------+--------------------+------------------------+

Admin dashboard (xl)
+--------------------------------------------------------------------+
| Setup panel while incomplete (numbered steps)                      |
+--------------------------------------------------------------------+
| KPI strip: Headcount | Attrition YTD | Payroll cost | Average salary|
+----------------------------+---------------------------------------+
| Headcount by department    | Payroll cost by department            |
+----------------------------+--------------------+------------------+
| Gender and tenure          | Recent activity    | Summary (AI)     |
+----------------------------+--------------------+------------------+
```

Below `lg` every grid collapses to one column in reading order (KPIs first, then the primary chart). The KPI strip becomes 2 by 2.

## 5. Components

Build on shadcn/ui and Radix, re-skinned with the tokens. Each component below has one implementation in `components/ui` or `components/shared`.

**Button.** Heights: small 36, default 40, large 48 (check-in). Radius `--r-control`. Label in `label` style, sentence case, no icon-plus-arrow endings. Variants: `primary` (Spruce fill), `secondary` (`--sunken` fill, no border), `ghost` (text only, hover `--sunken`), `danger` (absent-fg text on absent-bg; the confirm button inside a danger dialog may be solid absent-fg). Disabled is 45 percent opacity with `not-allowed`. Loading replaces the label with a small spinner and keeps width. One primary button per view.

**Input, textarea, select.** Height 40 (44 at base), radius 8, 1 px `--line`, `--surface` fill, 12 px horizontal padding. Label above (`label` style), hint or error below (`caption`). Focus: 2 px `--focus` ring with 2 px offset, border unchanged. Error: message in absent-fg text under the field; the field gets an `aria-invalid` outline in absent-fg. No floating labels, no placeholder-as-label.

**Card and panel.** `--surface`, radius 12 (panel 16), padding 24, no border, no shadow. A panel has a `heading` and an optional caption; actions sit right of the heading.

**KpiStrip.** One panel containing 4 to 5 KPIs in a grid, separated by space only (no dividers). Each KPI: label (`label`, `--ink-3`), value (`kpi`, `--ink`, tabular), optional hint (`caption`). No icons, no sparklines, no color tint. A delta is shown only when the metric defines a comparison period.

**StatusBadge.** Pill, `caption` style at weight 500, padding 2 by 10, status fg on bg, text label always present ("Present", "Late", "Half day", "Absent", "On leave", "Missing check-out", "Pending", "Approved", "Rejected", "Draft", "Finalized"). No border, no dot.

**DataTable.** Server-driven (search, filter, sort, page come from the API). Header row `label` style on `--surface`, sticky. Rows 56 px (48 px in dense mode), hairline `--line` between rows only, no vertical lines, no zebra. Hover `--sunken`. Selected `--primary-soft`. Numbers right aligned and tabular. Row click opens detail. Footer: result count left, pagination right. Below `md` rows become stacked list items (name and status on the first line, key facts on the second) that open a detail view. Employee codes may use monospace.

**FilterBar.** One row: search input first, then selects and a date range, then a text-style "Clear filters" appearing only when filters are active. Applied filters are visible in the controls themselves, not as extra chips.

**Segmented control (tabs).** Track `--sunken`, selected segment `--surface` with `--ink` text, radius 8. Used for page-level views (for example Overview, Attendance, Leave, Payroll on Employee 360).

**Dialog and drawer.** Radix primitives. Dialog radius 16, width 480 (full-width bottom sheet at base), `--shadow-overlay`, `--scrim` backdrop. Destructive and irreversible actions always confirm with a dialog that states the consequence in one sentence. The assistant is a right drawer, 420 px, full screen at base.

**Toast.** sonner, bottom right (bottom center at base), one short sentence using the same verb as the action ("Leave request sent", "Changes saved"). Errors say what happened and what to do. Auto-dismiss 4 seconds; errors stay until dismissed.

**Avatar.** Initials on `--primary-soft` with `--primary` text, circle, 32 or 40 px. No photos in v1.

**Chart.** Recharts, styled by tokens. Bars: radius 4 on top corners, 24 px max width, 8 px gap. Lines: 2 px, round joins, dots only on hover. Axes: `caption` style in `--ink-3`, no axis lines, a single baseline in `--line`, at most 3 horizontal grid lines in `--line` at 50 percent. No chart border, no legend box (label series directly or use a compact inline legend). Tooltip is a small overlay with `--shadow-overlay`. Every chart has a "View as table" toggle for accessibility and a one-line `aria-label` summary. Numbers formatted with `lib/format.ts`.

**DayRail (signature).** Props: `date`, `checkInAt`, `checkOutAt`, `officeStart`, `graceMinutes`, `halfDayHours`, `now`, `size` (`lg` or `sm`).
- Track: horizontal, 08:00 to 20:00 by default, `--sunken`, radius pill, height 10 (lg) or 6 (sm).
- Grace window: a segment from office start to office start plus grace in `--highlight-soft`.
- Ticks (lg only): small vertical ticks at office start and grace end with `caption` times above them ("9:00 AM", "9:15 AM"), and a faint tick at check-in plus the half-day threshold labeled "5 h".
- Worked time: a `--primary` segment from check-in to check-out, or to now while checked in. The check-in point is a circle (12 px lg, 8 px sm) filled with the status foreground color. The live end while checked in is a `--highlight` dot labeled "Now". This is the only marigold on the panel.
- Without a check-in, the track shows only the grace window and a caption "Not checked in".
- `sm` (attendance board rows): 120 px wide, no labels, details in a tooltip that also opens on keyboard focus.
- Accessibility: `role="img"` with `aria-label`, for example "Checked in 9:07 AM, checked out 6:02 PM, 8 hours 55 minutes, present".

**EmptyState.** Inside the panel where the data would appear: a `heading`, one sentence in `body` `--ink-2` (max 44 characters per line), one primary action when the user can act, and underneath a ghost of the expected structure (3 rows of `--sunken` bars for tables, a baseline and three faint grid lines for charts) at 50 percent opacity. No illustrations, no emoji, no mascots.

**Skeleton.** `--sunken` blocks matching the final layout's dimensions. A slow horizontal shimmer (1.4 s linear); static under reduced motion. Spinners are used only inside buttons.

**ErrorState.** Inline in the panel: what failed in one sentence, a "Try again" secondary button. Page-level 403 and 404 states have a title, one sentence and a "Go to dashboard" button.

**PageHeader.** Title (`page-title`), caption, actions. The notification bell and assistant button are in the shell header region, right aligned, as icon buttons with tooltips and accessible names. The bell has a small `--highlight` dot only when there are unread notifications.

Icons: lucide-react only, 16 px in navigation and buttons, 20 px for standalone, stroke width 1.5. Icons support a label; they never replace it except in the collapsed sidebar rail and icon buttons with tooltips. Never place an icon in a tinted square above a card title.

## 6. Navigation

Single config in `lib/nav.ts`. Labels are plain nouns.

| Role | Items in order |
|---|---|
| Admin | Dashboard, Employees, Attendance, Leave, Payroll, Organization, Users, Announcements, Audit log |
| HR | Dashboard, Employees, Attendance, Leave, Payroll, Organization (read only), Announcements |
| Employee | Dashboard, Attendance, Leave, Payslips, Announcements, Profile |

Counts appear only on Leave (pending approvals for HR) and the notification bell. The Leave item for HR opens the approvals inbox first and has a segmented control for "Approvals" and "My leave".

## 7. Screen blueprints

Every screen implements loading, empty, error and forbidden states (section 10). Copy in quotes is the default text.

**7.1 Setup (first run).** Split layout at `lg`: left 5 of 12 columns on `--sidebar` with the logo, the sentence "Attendance, leave and payroll that agree with each other" in display-l, and a large animated DayRail; right 7 columns on `--canvas` with a form 440 px wide. Below `lg` the left part collapses to a 120 px Spruce band with the logo. Two steps with a visible step indicator ("Step 1 of 2"): Company (company name, time zone preselected) then Admin account (name, email, password with a 8-character minimum and a visible show toggle). Submit "Create company". After success go to the Admin dashboard. If already initialized the route redirects to login.

**7.2 Login.** Same split. Fields: email, password. Button "Sign in". Error under the form: "Email or password is incorrect." No forgot-password link; below the form: "Forgot your password? Ask your HR team to reset it." A deactivated account shows "This account is turned off. Contact your HR team."

**7.3 Change password (forced).** Centered 440 px panel on canvas. "Choose a new password" with one sentence: "You signed in with a temporary password. Set your own to continue." Fields: current, new, confirm. Button "Save password".

**7.4 Admin dashboard.** Header: company name in page-title style, caption with today's date. While setup is incomplete, the first panel is "Set up HCM Lite" with a numbered list (these steps are a true sequence, so numbers are correct): 1 Company details, 2 Office hours and location, 3 Departments, 4 Leave types, 5 HR login, 6 First employee. Each step shows a done state or a link; a thin progress line shows completion. The panel disappears once all steps are done. Below: KPI strip, department charts, gender and tenure, recent activity (audit feed, 10 items), AI summary panel with a "Summarize" button. Filters: date range and department in a FilterBar under the header.

**7.5 HR dashboard.** KPI strip (headcount, present, on leave, late today, pending approvals), attendance trend (line), top 5 late-comers (list with count and DayRail-free rows), absenteeism by department (bars), leave by type (bars), AI summary, announcements. The pending approvals KPI links to the approvals inbox.

**7.6 Employee dashboard.** The check-in panel is the hero: large DayRail, current status in `heading` ("Not checked in", "Checked in at 9:07 AM", "Checked out at 6:02 PM"), one 48 px button ("Check in" or "Check out"). If today is not a working day: "Today is a weekend. Check-in is closed." If on leave: "You are on approved leave today." Right panel: hours this week against 40 h (thin progress bar in primary), late count this month, leave remaining per type. Below: last payslip (month, net pay, "Download payslip") and announcements. At base the check-in button is pinned to the bottom of the viewport above the safe area.

**7.7 Attendance (employee).** Month calendar, Monday first. Each day cell shows the day number and a status badge-sized soft fill; today has a `--highlight-soft` fill with `--ink` number. Selecting a day opens a drawer with the DayRail, check-in and out times, worked hours, status, and a "Request correction" button. Correction dialog: date, check-in time, check-out time, reason (required). Corrections list below the calendar with status badges.

**7.8 Attendance board (HR, Admin).** Date picker defaults to today, filters for department and status. Table columns: Employee (avatar, name, code), Department, Check-in, Check-out, DayRail (sm), Status. Summary line above the table: "42 present, 3 late, 5 on leave" using the same metrics as the dashboard. The Admin view is read only. HR also has "Close day" under an overflow menu, with a dialog explaining that missing records become absent.

**7.9 Leave (employee).** Top: balance strip with one entry per leave type (remaining of quota; unpaid shows "No limit"). Then the apply panel. Above the form fields sits the smart leave input: a single-line textarea with the label "Describe your leave" and placeholder "For example: next Monday and Tuesday off for my sister's wedding", and a button "Fill form". On success the form fields fill in sequence with a brief `--primary-soft` highlight and a caption line: "Filled from your sentence. Check the dates, then send." Form fields: type, start, end, reason, a live line "2 working days, 8 casual days left after this" from `/leave/preview`, and the button "Send request". If the AI fails: "The assistant is unavailable. Fill the form manually." and the form is already visible. History table below with Cancel for pending or future approved requests.

**7.10 Leave approvals (HR).** Two-column at `lg`: list of requests on the left (employee, type, dates, days, submitted time) with a filter segmented control (Pending, Approved, Rejected); detail on the right with employee name, dates, day count, balance before and after, conflict warnings, the reason, a comment field, and buttons "Approve" (primary) and "Reject" (secondary; comment required). At base the detail opens as a full-screen sheet. Admin sees the same list read only.

**7.11 Employees.** Directory DataTable (columns: Employee, Code, Department, Designation, Status, Joined). Search and filters. Primary action "Register employee" (HR only). Register form in a full page, three groups with `heading` titles: Personal (name, email, phone, gender, address), Job (code, department, designation, join date, status), Pay (basic salary with live gross preview "Gross PKR 150,000"). On success a dialog shows the temporary password once with a copy button and the line "Share this with the employee. They must change it at first sign-in." CSV import is a secondary page: upload, "Check file" (dry run), an error table (row, field, reason), then "Import valid rows". Employee 360: header with name in page-title style, code, status badge; segmented control Overview, Attendance, Leave, Payroll; salary is hidden from Employees and shown to Admin and HR.

**7.12 Payroll.** Runs list by month (month, status badge, employees, net total). "Create draft" opens a month picker. Run detail: summary strip (employees, gross, deductions, tax, net) using the KpiStrip style, a payslip table (Employee, Payable days, Gross, Deductions, Tax, Net) with department filter, and actions in the header: "Regenerate" (HR, draft only) and "Finalize payroll" (Admin, draft only). Finalize opens a dialog: "Finalizing locks this month. Payslips become visible to employees and the run can no longer be changed." Finalized runs show "Finalized on 30 Oct 2026 by Name" in the caption and have no edit controls.

**7.13 Payslips (employee).** A simple list by month (month, net pay, "Download payslip"). Empty: "No payslips yet" with the sentence "Your payslip appears here after Admin finalizes the month."

**7.14 Organization (Admin; HR read only).** Sections stacked: Company (name, time zone), Working hours (office start, grace minutes, half day hours, weekend days), Office location (latitude, longitude, radius, a "Use my current location" button), Departments, Designations, Leave types and quotas, Holidays (add by date and name). A sticky save bar appears at the bottom when a section has unsaved changes: "Unsaved changes" with "Save changes". For HR all inputs are disabled with one caption: "Only Admin can change company settings."

**7.15 Users (Admin).** Table of HR and employee logins (name, email, role, status, last sign-in) with actions Deactivate, Reset password (shows temp password once). "Create HR login" opens a form that includes the employee fields and basic salary (Assumption A-03).

**7.16 Announcements.** Feed, newest first, each with title, body, author, date. HR and Admin see "Post announcement". The latest announcement also shows on every dashboard.

**7.17 Notifications.** Bell opens a popover with the 10 latest; a full list page exists. Unread items are `--primary-soft`. "Mark all as read" text button. Empty: "You are up to date."

**7.18 Audit log (Admin).** Table (When, Actor, Action, Entity) with filters (actor, entity type, action, date range). A row opens a drawer with before and after JSON side by side in monospace, changed lines highlighted with `--highlight-soft`. No edit or delete controls exist.

**7.19 Assistant panel.** Right drawer opened from the header button. Header "Assistant". Empty state shows three suggested questions for the role as buttons (HR: "Who is on leave today?", "Who came late most this month?", "What is this month's attendance rate?"; Employee: "How many sick leaves do I have left?", "What are the office hours?", "How is my pay calculated?"). Conversation: the user's message right aligned on `--primary-soft`; the assistant's answer left aligned on plain surface in `body-lg`, followed by a small caption "AI-generated". While a tool runs a status line appears in `--ink-3`: "Checking attendance for October". Failure: "The assistant could not answer. Try again in a moment." Rate limit: "You reached the hourly limit. Try again later." Input at the bottom with a send button. Keyboard: Enter sends, Shift+Enter adds a line, Escape closes.

**7.20 Camera check-in (bonus).** Dialog with a live preview square, four corner brackets over the frame (turn from `--ink-3` to `--primary` when exactly one face is detected), a status line ("Looking for your face", "Move closer", "Outside the office area", "Ready"), and "Check in" enabled only when ready. Say what is captured: "Your photo is not saved."

## 8. Payslip PDF and documents

A4 portrait, margins 48 pt, one page, light theme only.
- Header: logo mark and company name left (Newsreader 20), "Payslip" and the month right (Newsreader 20 for the title, Geist 10 for the month).
- Employee block: name in Newsreader 16, then code, department, designation in Geist 9.5 `--ink-2` as plain lines (no table borders).
- Body: two columns, "Earnings" and "Deductions", each a list of label and amount rows in Geist 10 with amounts right aligned and tabular. Basic, house rent allowance, medical allowance, gross; absent days, unpaid leave days, half days, late penalty, deduction amount, income tax.
- Net pay: a single large line at the bottom of the body: "Net pay" label and "PKR 142,350" in Newsreader 28. This is the emphasis of the page.
- Footer: "Working days 22, payable days 22" and "Generated 30 Oct 2026". One hairline rule above the footer only. No boxes, no background fills except a `--primary-soft` tint behind the net pay line.
- Colors from the light tokens. No emoji, no images other than the logo mark.

## 9. Motion and GSAP

Principle: one orchestrated moment per context, and motion that answers a user action. No fade-and-slide on every section, no hover lift on cards, no idle loops.

Setup (`lib/motion.ts`): register `ScrollTrigger` and `SplitText` once on the client; export `useGSAP`-based helpers; wrap every effect in `gsap.matchMedia()` with a `(prefers-reduced-motion: no-preference)` branch. Under reduced motion every element renders in its final state. Animate only `transform`, `opacity` and SVG `stroke-dashoffset`; never width, height, top or left. Easing default `power3.out` (matches `--ease-out`). Never block input during an animation. Kill tweens on unmount via the `useGSAP` scope.

| ID | Where | Trigger | Effect and parameters |
|---|---|---|---|
| MO-01 | Setup and login hero | Mount, once | DayRail track draws left to right (`scaleX` 0 to 1, origin left, 0.9 s `expo.out`), tick marks and the Marigold point appear in sequence (0.35 s, stagger 0.12), then the headline lines reveal with a mask (`yPercent` 100 to 0, 0.8 s, stagger 0.08) |
| MO-02 | Dashboards | First load per session per dashboard | KPI numbers count from 0 to the value (0.9 s `power2.out`, formatted per type), bars grow from the baseline (`scaleY` 0 to 1, 0.7 s, stagger 0.04), line paths draw (`stroke-dashoffset`, 0.9 s). No card fade or translate. Data refetches do not replay it |
| MO-03 | Check-in and check-out | Success response | The DayRail marker moves to its new position (`x`, 0.4 s `power3.out`), the worked segment extends, the status label crossfades (0.2 s), then the toast appears |
| MO-04 | Smart leave | Proposal received | Fields fill one by one (120 ms apart); each gets a `--primary-soft` background that fades out over 0.8 s |
| MO-05 | Payroll finalize | Confirmed | Status badge swaps with a 0.3 s scale from 0.96 to 1; edit controls fade out (0.2 s) |
| MO-06 | Assistant drawer | Open and new message | Drawer `x` 24 to 0 with opacity (0.28 s); each new message reveals with opacity and 8 px `y` (0.2 s) |
| MO-07 | Dialogs, popovers | Open | CSS only: opacity and scale 0.98 to 1 over 180 ms |
| MO-08 | Route changes | Navigate | None. Instant |
| MO-09 | Landing hero | Mount, once | SplitText line mask reveal (0.9 s, stagger 0.08) plus MO-01 DayRail draw |
| MO-10 | Landing story | Scroll | See 9.1 |
| MO-11 | Landing assistant section | Enters view, once | Two chat messages appear in sequence (0.4 s, 0.5 s apart) |

Durations: UI feedback 120 to 200 ms, panels 280 to 360 ms, data reveal up to 900 ms. Nothing in the app exceeds 900 ms.

### 9.1 Landing page (public `/`, P2, build only after core flows work)

Visible only when the system is initialized and nobody is signed in; an uninitialized system redirects `/` to `/setup`. Lenis smooth scroll runs on this page only, is destroyed on navigation, drives `ScrollTrigger.update`, and is disabled under reduced motion.

1. Hero. Headline in display-xl: "Attendance, leave and payroll that agree with each other." One sentence below in body-lg: "One record for every day, one calculation for every payslip, and an assistant that answers from the same numbers." Buttons "Sign in" (primary). A large DayRail occupies the right half and runs MO-09.
2. Pinned story, about 300 vh, ScrollTrigger `pin` with `scrub: 1`. One timeline, three beats with text swapping on the left: "A day becomes a record" (the DayRail fills from 9:07 and the status reads On time), "A month becomes a payslip" (the rail rows stack into a calendar of status fills, then collapse into a payslip card whose net pay counts up), "Every number traces back" (a line from the payslip net to the attendance cells highlights). It is one continuous scrubbed scene, not three separate reveals.
3. Roles. Three columns, static: Admin, HR, Employee, each with two plain sentences about what that person does in the product. No icons, no hover effects.
4. Assistant. A real exchange (question "Who is on leave today?", answer "Five employees: three casual, two sick.") with MO-11.
5. Closing band on `--sidebar` with "Sign in". Footer: logo, "Built for the Saylani Hackathon, 24 October 2026".

Performance: landing JS loads only on `/`; no images (everything is HTML, CSS and SVG); test at 375 px; the story section falls back to stacked static panels below `md` and under reduced motion.

## 10. States and copy

Every data view has four states. A view without all four is not done.

| State | Treatment |
|---|---|
| Loading | Skeleton of the final layout. Buttons show an inline spinner. No full-page spinner except the very first auth check |
| Empty | EmptyState component with the copy below |
| Error | Inline ErrorState: "Could not load {thing}. Check your connection and try again." with "Try again" |
| Forbidden | "You do not have access to this page." with "Go to dashboard" |

Default empty copy (title, then sentence, then action):

| Where | Copy |
|---|---|
| Admin dashboard, fresh install | "Set up HCM Lite", "Add your company details, office hours and a department. Then create a login for HR.", action: next incomplete step |
| Employees, HR | "No employees yet", "Register your first employee. They get a login with a temporary password.", "Register employee" |
| Employees, Admin | "No employees yet", "HR registers employees. Create an HR login to get started.", "Create HR login" |
| Attendance board, no records | "No check-ins on 25 Oct", "Check-ins appear here as people arrive." |
| Attendance, employee calendar | "No attendance this month", "Your check-ins appear here." |
| Leave approvals | "Nothing waiting for approval", "New leave requests appear here." |
| Leave history | "No leave requests", "Requests you send appear here with their status." |
| Payroll runs | "No payroll runs", "Create a draft for a month once attendance is recorded.", "Create draft" |
| Payslips | "No payslips yet", "Your payslip appears here after Admin finalizes the month." |
| Announcements | "No announcements", "Posts from HR and Admin appear here." |
| Audit log | "No activity recorded yet", "Approvals, payroll changes and other key actions appear here." |
| Notifications | "You are up to date" |
| Charts without data | Baseline and ghost grid with the caption "No data for this period" |

Action vocabulary (button, toast and audit action use the same verb): Register employee / "Employee registered"; Save changes / "Changes saved"; Check in / "Checked in at 9:07 AM"; Check out / "Checked out at 6:02 PM"; Send request / "Leave request sent"; Approve / "Request approved"; Reject / "Request rejected"; Create draft / "Draft created"; Regenerate / "Draft regenerated"; Finalize payroll / "Payroll finalized"; Download payslip; Post announcement / "Announcement posted"; Reset password / "Password reset".

Validation copy examples: "Enter a valid email address." "Password must be at least 8 characters." "End date must be on or after the start date." "You have 2 casual days left. This request needs 3." Server `fields` messages are shown as returned.

Never use: "Oops", "Whoops", "Something went wrong" without a next step, "Welcome back!", exclamation marks, emoji, placeholder names such as "John Doe", lorem ipsum.

## 11. Responsive and accessibility

Responsive:
- Sidebar becomes a drawer below 768 px; a menu button sits in the header row.
- Tables become stacked list rows below 768 px. Filter bars wrap, search first.
- Dialogs become bottom sheets at base. Drawers become full screen.
- The KPI strip is 2 by 2 at base. Charts keep a minimum height of 220 px and scroll horizontally only inside their own container when they need width.
- The page body never scrolls horizontally.
- Touch targets are at least 44 by 44 px at base. Inputs are 16 px. Safe-area insets are respected for pinned bars.

Accessibility (WCAG 2.2 AA):
- Contrast: token pairs above are verified for AA; do not introduce new text colors.
- Visible focus on every interactive element: 2 px `--focus` ring, 2 px offset. Never remove outlines without a replacement.
- Full keyboard operation: tab order follows reading order; dialogs trap focus and return it; Escape closes overlays; the DayRail and charts expose their data through text alternatives.
- Status is always text plus color. Charts have a "View as table" toggle.
- Forms: every input has a visible label; errors are linked with `aria-describedby`; required fields are marked in the label text.
- Respect `prefers-reduced-motion` (section 9) and `prefers-color-scheme` as the default theme with a manual switch in the profile menu.
- Set `lang="en"`. Use landmarks (`nav`, `main`, `header`). Page titles update per route.

## 12. Generic-AI checklist (reject any change that breaks these)

Forbidden:
- Emojis anywhere, including toasts, empty states and docs.
- Gradients, gradient text, glassmorphism, blurred backdrops (except the dialog scrim), purple or blue-violet accents, neon glows.
- Borders on cards, KPIs, charts, images or sidebar items; colored left-border cards; double outlines; shadows on resting cards.
- The same rounded card repeated for every piece of content; one radius on everything.
- An icon inside a tinted square above each card title; icon rows used as decoration.
- All-caps labels, tracked-out eyebrows above headings, numbered markers on content that is not a sequence, meta strings joined with middle dots, labels shaped like "WORD - fragment", arrows or chevrons appended to button and link text.
- Warm cream backgrounds with a high-contrast serif and a terracotta accent; near-black with an acid accent; hairline broadsheet layouts. Our identity is Spruce on mineral neutrals and does not use these.
- Neutral near-black such as `#0B0B0B` or `#111` as text or surface; use `--ink` and `--sidebar`.
- Hover lift or scale on cards, fade-and-slide-up on every section, looping or idle animations, parallax inside the app.
- Stat cards where every KPI carries a tiny sparkline or icon.
- Decorative illustrations, stock photos, mascots, hero blobs.
- Generic copy: "Welcome back, X", "Oops", "Seamless", "Powerful", "Effortless", "Revolutionize", "Unlock".
- Hardcoded colors, sizes or fonts in components; any `style` color; any Tailwind arbitrary color value.
- Dummy data in the UI to make a screen look full.

Pre-merge visual QA for every UI task:
1. Uses tokens and shared components only.
2. Loading, empty, error and forbidden states exist and use the copy in section 10.
3. Checked at 375, 768 and 1280 px, in light and dark.
4. Keyboard path works; focus visible; no horizontal page scroll.
5. Numbers are tabular and aligned; dates, times and currency use `lib/format.ts`.
6. Text is sentence case, plain, with no emoji and no exclamation marks.
7. There is exactly one boldness point on the screen (the DayRail or the sidebar); everything else is quiet. Remove one decoration before you finish.
8. Motion follows section 9 and is absent under reduced motion.
