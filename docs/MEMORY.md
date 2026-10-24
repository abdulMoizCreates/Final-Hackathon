# HCM Lite - Project memory

This is the shared memory for every human and every AI agent on the project. It is how context survives when you switch agents or sessions. Keep it short, current and true.

Read this file first, in full, every session. Update it before you stop.

Rules for editing:
- The Handoff block (section 1) is rewritten at the end of every session. Replace the old content; do not append.
- Sections 2 to 7 are append-mostly. To change a decision, add a new entry that supersedes the old one and leave the old one in place marked `superseded by D-xx`.
- One fact per line. Facts, not narration. No emojis.

---

## 1. Handoff (rewrite every session)

- Last updated by: (agent name or person) at (time)
- Current focus: Project documents created. No code exists yet.
- Done this session: PRD, ARCHITECTURE, DESIGN, RULES, MEMORY, TRACKER, AGENTS written from the Saylani brief.
- Next action: start Phase 0 in TRACKER.md (T-001 repo scaffold, T-002 tokens and shell, T-003 env and first-run setup).
- Blocked by: Open questions Q-01 to Q-04 (stack confirmation, AI provider, hosting accounts, time available).
- Uncommitted or half-finished work: none.
- Warnings for the next agent: do not add dummy data; read RULES.md section 8 before coding.

## 2. Project snapshot

- Product: HCM Lite, AI-assisted HCM web app. Roles: Admin, HR, Employee. 9 modules, 25 functionalities (F01 to F25 in PRD).
- Event: Saylani Hackathon, 24 October 2026, Zaitoon Ashraf IT Park. Submit Git repo link and hosted link on lms.saylaniit.com.
- Team: 4 people (2 backend, 2 frontend), plus AI agents.
- Source of truth: the brief PDF. Then PRD, ARCHITECTURE, DESIGN.
- Starts empty: no pre-loaded or dummy data. Judges create the company, employees and activity on a fresh install.
- Scoring: Core HR flows 25, Data and analytics 20, AI 15, Code quality 15, UI/UX 10, Security and RBAC 10, Demo and docs 5, bonus up to +10.

Lanes (fill in names; agents use the lane to know which folder they own):

| Lane | Owner | Folder |
|---|---|---|
| BE1 | (name) | `apps/api` auth, org, employees, audit, comms |
| BE2 | (name) | `apps/api` attendance, leave, payroll, analytics, AI |
| FE1 | (name) | `apps/web` shell, auth, org, employees, leave, payroll screens |
| FE2 | (name) | `apps/web` dashboards, attendance, AI panel, design system, motion, landing |

## 3. Decisions (D-xx)

- D-01 TypeScript on both apps, strict. (default, confirm in Q-01)
- D-02 Monorepo: `apps/web` (Next.js App Router, Tailwind v4, shadcn/ui) and `apps/api` (Express, Mongoose, Zod).
- D-03 Web proxies `/api/*` to the API through a Next.js rewrite; auth is a JWT in an httpOnly cookie; Bearer in memory is the fallback.
- D-04 Leave balances are never stored; always computed from requests.
- D-05 Payslips are immutable snapshots created at payroll generation.
- D-06 Brand direction: Spruce primary, Marigold as the single "now" highlight, mineral neutrals; Geist for the interface, Newsreader for document-like moments; signature DayRail component. Details in DESIGN.md. (Replaces the earlier idea of a cream background with a serif display and a gold accent, which reads as a generic AI default.)
- D-07 Motion: one orchestrated moment per context, GSAP via `lib/motion.ts`, Lenis and pinned scroll story on the landing page only. The landing page is P2 and starts only after P0 flows work.
- D-08 AI: provider-agnostic OpenAI-compatible chat completions with tool calling, called from the API. Env vars `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL`. Provider choice is open (Q-02).
- D-09 Metrics have one implementation (`analytics/metrics.service.ts`) used by dashboards and AI tools.
- D-10 Day closing is lazy and idempotent (`ensureClosedThrough`) plus a nightly cron, because free hosts sleep.

## 4. Assumptions (A-xx)

Decisions the brief leaves open. Change here first if the team or the judges say otherwise.

- A-01 Tax is computed on the contractual monthly gross x 12; monthly tax = annual tax / 12, prorated by payable days over working days. Net = earned - deductions - tax. Rounded to whole PKR per line.
- A-02 Check-in returns 422 on non-working days and on days covered by approved leave.
- A-03 HR users are employees too (they check in, apply for leave, get payslips). Admin creates an HR login together with an employee record that includes basic salary. Nobody approves their own leave or correction; HR leave needs another HR user. HR cannot edit their own salary.
- A-04 Pending leave counts against the balance.
- A-05 Absent, on_leave and missing_checkout records are created when a day closes. Today is never absent.
- A-06 Status precedence at check-out: half_day, then late, then present. `isLate` is stored separately.
- A-07 Default company time zone is Asia/Karachi, stored in settings; all day boundaries use it.
- A-08 Weekend defaults to Saturday and Sunday (brief), stored as numbers 0 to 6 with 0 = Sunday.
- A-09 Employee `gender` is collected at registration (needed for the Admin dashboard gender split).
- A-10 HR enters basic salary; HRA 40 percent and medical 10 percent come from settings and can be overridden per employee.
- A-11 Leave requests can start in the past (for example backdated sick leave); no limit in v1.
- A-12 "Next Monday" means the first Monday strictly after today; the AI picks dates from a calendar table supplied by the server.
- A-13 Admin has no employee record: no check-in, leave or payslip.
- A-14 A payroll draft can be created for the current month; days not yet closed are not counted absent.
- A-15 Payroll dashboards use the run of the requested month in any status and display the status.

## 5. Open questions (Q-xx)

- Q-01 Confirm the stack with the team (TypeScript, Next.js, Express, MongoDB) and who is comfortable debugging it.
- Q-02 Which LLM provider with a free tier and working tool calling? Who owns the key? Verify current limits.
- Q-03 Hosting accounts: Vercel (web), Render or similar (API), MongoDB Atlas (database). Who creates them and when?
- Q-04 How many hours are available before submission? Use the cut line in TRACKER.md to decide scope.
- Q-05 When only one HR user exists, their own leave stays pending (A-03). Acceptable for the demo, which uses employee leave?
- Q-06 Names for lanes BE1, BE2, FE1, FE2.
- Q-07 If judges provide payroll examples, check A-01 against them.

## 6. Gotchas and lessons (append as you learn)

- A very short check-in followed by check-out gives `half_day` (under 5 hours). For demos either wait, use a correction, or have Admin lower `halfDayHours` first. Mention it in the README.
- Free API hosts sleep; the first request can be slow. Warm the API before the demo and before judging. Do not rely on the nightly cron.
- Day boundaries must use the company time zone, not UTC.
- Recharts and GSAP code must be inside client components.
- The cookie works because the browser only talks to the web origin (rewrite). If you call the API origin directly from the browser, cookies and CORS will fail.
- Dashboards and AI must call the same metrics functions. If numbers differ, the bug is a duplicated formula.
- Attendance rate must use closed days only, otherwise the open day inflates it.

## 7. Environment and links (fill in as they exist)

- Repository URL: (not created yet)
- Hosted web URL: (not deployed yet)
- Hosted API URL: (not deployed yet)
- Database: (MongoDB Atlas project, not created yet)
- AI provider and model: (not chosen yet)
- First Admin for local development: set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `apps/api/.env`, or use the setup screen. Never commit them.
- Run locally: (fill after T-001: install, run API, run web)

## 8. Glossary

- Actor: the authenticated person making a request: `{ userId, role, employeeId }`.
- Scope: the rows an actor may see. Employees see only their own `employeeId`.
- DayRail: the horizontal working-day timeline component, the product's signature element.
- Day close: the idempotent process that turns days with no record into absent or on_leave and open check-ins into missing_checkout.
- Run: a payroll run for one month, `draft` or `finalized`.
- Payslip: an immutable per-employee snapshot belonging to a run.
