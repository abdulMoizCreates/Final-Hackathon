# HCM Lite - Tracker

The single list of work. Read it every session. Update it before you stop.

How to update:
- Status values: `todo`, `in_progress`, `blocked`, `done`. Change only the Status cell (and Owner when you start).
- When you start a task set Status to `in_progress` and Owner to your agent or person name. When done, set `done` and add one line to the Log at the bottom saying what you verified.
- Never mark `done` without running it (RULES section 7). If partly done, leave `in_progress` and describe the remainder in the Handoff block in `MEMORY.md`.
- Add new tasks at the end of the right phase with the next free ID. Do not renumber.
- Lane: `BE` backend (`apps/api`), `FE` frontend (`apps/web`). Priority: P0 must ship, P1 should ship, P2 only if time remains. Refs point to PRD (F, BR, AC), ARCHITECTURE and DESIGN sections.

## Cut line (if time runs short)

Never cut: auth and RBAC, setup, employees, check-in and attendance, leave with approval, payroll with finalize and payslip, dashboards with correct numbers, AI chat and smart leave, audit log, README, hosted deploy, demo rehearsal.

Cut in this order, last item first: landing page (T-905), camera attendance (T-906), other bonus items (T-904 extras), CSV import and export (T-202, T-204), attendance corrections (T-302, T-304), announcements and notifications (T-802, T-803 second half), policy Q and A polish.

Suggested time split: first 10 percent foundations and an early deploy, 45 percent phases 1 to 5, 20 percent dashboards and AI, 10 percent audit and comms, last 15 percent polish, README and demo rehearsal. Do not start new features in the last 30 minutes; only fix bugs.

## Phase 0: Foundations

| ID | Lane | Pri | Task | Acceptance | Status | Owner |
|---|---|---|---|---|---|---|
| T-001 | BE+FE | P0 | Scaffold monorepo: `apps/api` and `apps/web`, TypeScript strict, lint, scripts, `.env.example`, README stub | Both apps start with one command each; typecheck passes | todo | |
| T-002 | FE | P0 | Design foundations: `tokens.css`, fonts, theme provider (light and dark), shadcn re-skin to tokens, app shell with sidebar and role nav config, shared components: PageHeader, EmptyState, ErrorState, Skeleton, StatusBadge, KpiStrip, DataTable, FilterBar | DESIGN sections 3 to 5 met; shell renders at 375, 768, 1280 in both themes; no hardcoded colors | todo | |
| T-003 | BE | P0 | Backend foundations: `config/env.ts`, db connection, `AppError` and error middleware, `validate`, `authenticate`, `authorize`, `audit` and `notify` libs, `lib/dates.ts` and `lib/money.ts` with tests, pagination helper | ARCHITECTURE sections 4, 6; date and working-day tests pass | todo | |
| T-004 | BE+FE | P0 | Early deploy of the skeleton: Atlas database, API host, Vercel web with `/api` rewrite, health endpoint | Hosted web calls hosted API through `/api/health`; cookie flow verified later in T-102 | todo | |

## Phase 1: Auth, setup, organization (F01 to F05)

| ID | Lane | Pri | Task | Acceptance | Status | Owner |
|---|---|---|---|---|---|---|
| T-101 | BE | P0 | `GET /setup/status`, `POST /setup`, optional Admin bootstrap from env, settings singleton | AC-01; setup unusable after first run; audit entry written | todo | |
| T-102 | BE | P0 | Login, logout, me, change-password; httpOnly cookie; `mustChangePassword` gate; login rate limit | BR-01 to BR-03; tests for wrong password, deactivated user, gate | todo | |
| T-103 | BE | P0 | Settings, departments, designations, leave types, holidays CRUD (Admin write, HR read), delete blocked when in use | BR-10 to BR-12; HR write returns 403; audit before and after | todo | |
| T-104 | BE | P0 | Users: create HR login with employee record, deactivate, reset password (temp password returned once) | AC-02; A-03 followed; temp password never logged | todo | |
| T-105 | FE | P0 | Setup, login and change-password screens | DESIGN 7.1 to 7.3; MO-01; all states; mobile layout | todo | |
| T-106 | FE | P0 | Organization page (settings, departments, designations, leave types, holidays) and Users page | DESIGN 7.14, 7.15; HR sees read-only organization | todo | |
| T-107 | FE | P0 | Auth guard, role navigation, forbidden and 404 states, session expiry handling | Each role sees only its menu; wrong-role URL shows Forbidden | todo | |

## Phase 2: Employees (F06 to F08)

| ID | Lane | Pri | Task | Acceptance | Status | Owner |
|---|---|---|---|---|---|---|
| T-201 | BE | P0 | Employees create and edit (creates login), search, filters, paging, Employee 360, salary endpoint, `/me/profile` | BR-20, BR-21, BR-23, AC-03, AC-06; salary hidden from non-privileged roles | todo | |
| T-202 | BE | P1 | CSV dry run, commit import, export | BR-22; dry run returns row, field, reason; no writes on dry run | todo | |
| T-203 | FE | P0 | Directory, register form with temp password dialog, Employee 360, own profile edit | DESIGN 7.11; all states; salary visible only to Admin and HR | todo | |
| T-204 | FE | P1 | CSV import page with dry-run error table | DESIGN 7.11 | todo | |

## Phase 3: Attendance (F09 to F11)

| ID | Lane | Pri | Task | Acceptance | Status | Owner |
|---|---|---|---|---|---|---|
| T-301 | BE | P0 | Check-in, check-out, today, me, board; status rules; `ensureClosedThrough`, close-day job and endpoint | BR-30 to BR-36, AC-04, AC-05; boundary tests at 09:15, 4h59m, 5h00m; duplicate check-in 409 | todo | |
| T-302 | BE | P1 | Attendance corrections: request, list, decide (not own) | Approval rewrites the day and recomputes status; audit and notification | todo | |
| T-303 | FE | P0 | Check-in widget with DayRail, employee month calendar and day drawer, HR and Admin board | DESIGN 5 (DayRail), 7.6 (widget), 7.7, 7.8; MO-03 | todo | |
| T-304 | FE | P1 | Correction request dialog and list | DESIGN 7.7 | todo | |

## Phase 4: Leave (F12, F13)

| ID | Lane | Pri | Task | Acceptance | Status | Owner |
|---|---|---|---|---|---|---|
| T-401 | BE | P0 | Balance, preview, apply, cancel, list, decision (comment rules), who is on leave | BR-40 to BR-44, AC-07, AC-08; overlap and over-balance return 422; self-approval blocked | todo | |
| T-402 | FE | P0 | Leave page (balances, form with live preview, history) and approvals inbox | DESIGN 7.9, 7.10; all states | todo | |

## Phase 5: Payroll (F14 to F17)

| ID | Lane | Pri | Task | Acceptance | Status | Owner |
|---|---|---|---|---|---|---|
| T-501 | BE | P0 | Payroll calculation function and tax slab, pure and tested | BR-50 to BR-54, AC-09; three hand-checked cases pass; band edges tested | todo | |
| T-502 | BE | P0 | Runs: create, regenerate (draft), finalize (Admin), locked after finalize; payslips list; PDF | BR-55, AC-10; finalized regenerate returns 409; PDF matches snapshot | todo | |
| T-503 | FE | P0 | Payroll runs list and detail, finalize dialog, employee payslips page, PDF download | DESIGN 7.12, 7.13, 8; MO-05 | todo | |

## Phase 6: Dashboards and analytics (F18)

| ID | Lane | Pri | Task | Acceptance | Status | Owner |
|---|---|---|---|---|---|---|
| T-601 | BE | P0 | `metrics.service` plus HR, Admin and Employee dashboard endpoints with date and department filters | PRD section 6 and 7; ARCHITECTURE 9.7 and 10; aggregation used; closed days only for rates | todo | |
| T-602 | FE | P0 | Three dashboards with charts, KPI strip, filters, admin setup checklist, empty states | DESIGN 4, 7.4 to 7.6; MO-02; numbers equal API output | todo | |

## Phase 7: AI assistant (F19 to F22)

| ID | Lane | Pri | Task | Acceptance | Status | Owner |
|---|---|---|---|---|---|---|
| T-701 | BE | P0 | LLM adapter, chat endpoint with tool loop, seven tools, rate limit, `aiLogs`, timeout and fallback | ARCHITECTURE 11.1, 11.2, 11.6; tools use services with actor scope; mocked-LLM tests | todo | |
| T-702 | BE | P0 | Smart leave endpoint with validated JSON, retry once, date table; dashboard summary; policy prompt | AC-13, AC-14; nothing saved by the AI | todo | |
| T-703 | FE | P0 | Assistant drawer with suggestions, tool status line, AI-generated label, failure states | DESIGN 7.19; MO-06 | todo | |
| T-704 | FE | P0 | Smart leave input on the leave form and the summary panel on dashboards | DESIGN 7.9; MO-04; manual form works when AI fails | todo | |
| T-705 | BE+FE | P0 | AI QA with the live questions from PRD section 8, compared with dashboard numbers | AC-11, AC-12; answers match; colleague salary refused | todo | |

## Phase 8: Comms and audit (F23 to F25)

| ID | Lane | Pri | Task | Acceptance | Status | Owner |
|---|---|---|---|---|---|---|
| T-801 | BE | P0 | Audit log read endpoint with filters; review that every audited action in ARCHITECTURE 12 writes an entry | AC-15; no mutation route exists; model blocks update and delete | todo | |
| T-802 | BE | P1 | Announcements and notifications (events listed in ARCHITECTURE 8) | BR-70; notification on leave decision, correction decision, payslip | todo | |
| T-803 | FE | P0/P1 | Audit log page with before and after drawer (P0); announcements feed and notification bell (P1) | DESIGN 7.16 to 7.18 | todo | |

## Phase 9: Polish, bonus, submission

| ID | Lane | Pri | Task | Acceptance | Status | Owner |
|---|---|---|---|---|---|---|
| T-901 | BE+FE | P0 | README: stack, run locally, create first Admin, set AI key, demo notes including half-day caution, honest done and not-done list | A judge can run it in under 10 minutes | todo | |
| T-902 | BE+FE | P0 | Remove any mock layer, scan for secrets and dummy data, verify `.env.example` | No `mocks` folder, no secrets in repo history | todo | |
| T-903 | BE+FE | P0 | Final deploy, warm-up, and the full 5-minute demo script on a fresh database by two people | PRD section 11 passes without edits | todo | |
| T-904 | BE+FE | P1 | Cheap bonus items: dark mode QA, Roman Urdu in the AI prompt, late penalty setting | Each verified; payroll still matches hand calculation with the penalty on | todo | |
| T-905 | FE | P2 | Public landing page with the GSAP story | DESIGN 9.1; reduced motion fallback; 375 px | todo | |
| T-906 | BE+FE | P2 | Camera attendance with face detection and location (web) | ARCHITECTURE 16; DESIGN 7.20 | todo | |
| T-907 | FE | P0 | Responsive and accessibility pass at 375, 768, 1280, light and dark, keyboard | DESIGN QA list passes on every screen | todo | |
| T-908 | BE | P0 | Test suite check against ARCHITECTURE section 15 list | Suite passes in under 30 seconds | todo | |

## Feature coverage map

| Feature | Tasks | Feature | Tasks |
|---|---|---|---|
| F01 | T-101, T-105 | F14 | T-201, T-501, T-503 |
| F02 | T-102, T-105, T-107 | F15 | T-502, T-503 |
| F03 | T-103, T-106 | F16 | T-502, T-503 |
| F04 | T-103, T-106 | F17 | T-502, T-503 |
| F05 | T-104, T-106 | F18 | T-601, T-602 |
| F06 | T-201, T-203 | F19 | T-701, T-703 |
| F07 | T-201, T-203 | F20 | T-702, T-704 |
| F08 | T-202, T-204 | F21 | T-702, T-704 |
| F09 | T-301, T-303 | F22 | T-702, T-703 |
| F10 | T-301, T-303 | F23 | T-802, T-803 |
| F11 | T-302, T-304 | F24 | T-802, T-803 |
| F12 | T-401, T-402 | F25 | T-801, T-803 |
| F13 | T-401, T-402 | | |

## Log (newest first)

Format: `date time | agent or person | task | what was verified`

- (no entries yet)
