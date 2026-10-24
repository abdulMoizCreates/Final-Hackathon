# HCM Lite - Product Requirements (PRD)

Source of truth: `Saylani_Hackathon_HCM_Lite_Brief.pdf` (24 October 2026, Zaitoon Ashraf IT Park). If this file conflicts with the PDF, the PDF wins; log the conflict in `MEMORY.md`.

Read this file when: planning a feature, writing tests, deciding priority, or checking a business rule. Rule IDs (BR-xx), metric IDs (M-xx) and acceptance IDs (AC-xx) are stable; reference them in tests and commits.

Items marked "Assumption A-xx" are decisions the brief leaves open. They are listed in `MEMORY.md` and can be changed there.

---

## 1. Goal

Ship a web-based HR system for the daily work of an HR team, with an AI assistant that answers from real data. The team is 4 people (2 backend, 2 frontend). The system starts empty: Admin sets up the company, HR registers employees, employees use the app, and every number on every screen and in every AI answer comes from what people did in the app.

Judges start from a fresh install on the hosted link, create the company, a few employees and their activity, then check that dashboards and AI answers match those records. Correctness and consistency beat feature count.

### What the scoring means for priority

| Criteria | Points | What it means for us |
|---|---|---|
| Core HR flows | 25 | Login per role, employees, check-in, leave approval, payroll run, end to end. Build first. |
| Data and analytics | 20 | One metrics service feeds dashboards and AI. Filters (date range, department) must work. |
| AI features | 15 | Correct live answers, role scoping, smart leave, summaries, graceful failure. |
| Code quality | 15 | Module structure, rules in services, validation, tests. |
| UI / UX | 10 | Clarity, consistency, loading / empty / error states, responsive from 375 px. |
| Security and RBAC | 10 | Server-side scope checks, hashed passwords, AI key on server, audit log. |
| Demo and docs | 5 | 5-minute story, working hosted link, README a judge can follow in under 10 minutes. |
| Bonus | +10 | Camera attendance, attrition risk, anomaly flags, late penalty, Roman Urdu AI, dark mode / PWA. |

UI/UX is 10 of 100 points, but empty, loading and error states are on the judge's checklist and a fresh install is empty everywhere. Design quality shows most in the first 60 seconds of the demo.

## 2. Product summary

HCM Lite has 9 modules:

| Module | Name | Contents |
|---|---|---|
| M1 | Auth and Access | JWT login, 3 roles, role and data-scope guard |
| M2 | Organization Setup | Company settings, departments, designations, leave types, holidays, rules, users |
| M3 | Employees | Directory and search, Employee 360, CSV import and export |
| M4 | Attendance | Web check-in and out, status rules, corrections, optional camera and location |
| M5 | Leave | Apply, balance, overlap and holiday checks, approval inbox |
| M6 | Payroll Lite | Salary structure, monthly run, tax slab, payslip PDF |
| M7 | Dashboards and Analytics | Admin, HR and Employee dashboards, KPIs, trends, insights |
| M8 | AI Assistant | Chat with tools, dashboard summary, smart leave, policy Q and A |
| M9 | Comms and Audit | Announcements, notifications, audit log |

## 3. Roles

| Role | Purpose | Cannot do |
|---|---|---|
| Admin | Company level. Sets up the company and rules, creates HR logins, finalizes payroll, owns the audit log. | Edit a finalized payroll run. Delete or change audit entries. Check in, apply for leave or have attendance of their own (Admin has no employee record). |
| HR | People operations. Registers employees, manages salary structures, approves leave and corrections, prepares payroll drafts, posts announcements. | Change company settings, rules or office location. Create Admin users. Finalize payroll. View the audit log. |
| Employee | Self-service. Checks in and out, applies for leave, downloads payslips, uses the assistant on own data. | See any other employee's data or salary. Approve anything. Edit own salary, role or attendance directly. |

Access is checked on the server for every request. Hiding a button is not access control. The AI assistant works with the same access as the person using it.

First run: a fresh install asks for the company name and the Admin account, or reads `ADMIN_EMAIL` and `ADMIN_PASSWORD` from the env file. Admin then creates HR logins. HR registering an employee creates that employee's login with a temporary password that must be changed on first sign-in.

## 4. Functional scope (25 functionalities)

Access key: Manage = create and change, All = see every record, Own = own records only, View = read only, dash = no access.
Priority: P0 must ship, P1 should ship, P2 only if time remains.

| ID | Functionality | Admin | HR | Employee | Priority |
|---|---|---|---|---|---|
| F01 | First-run setup: company profile and the Admin account | Manage | - | - | P0 |
| F02 | Login, logout, change password; role-based menus and dashboards | Own | Own | Own | P0 |
| F03 | Company settings: office hours, grace time, weekend, office location and radius | Manage | View | - | P0 |
| F04 | Departments, designations, leave types and quotas, public holidays | Manage | View | - | P0 |
| F05 | Create HR logins; deactivate or reset any login | Manage | - | - | P0 |
| F06 | Register an employee (creates their login) and edit details | View | Manage | Own phone and address | P0 |
| F07 | Employee directory with search and filters; Employee 360 profile | All | All | Own | P0 |
| F08 | CSV import with dry-run error report; CSV export | - | Manage | - | P1 |
| F09 | Check in and check out on the web | - | Own | Own | P0 |
| F10 | Attendance calendar and daily attendance board | All | All | Own | P0 |
| F11 | Attendance correction: request and approve | View | Approve | Request | P1 |
| F12 | Apply for or cancel leave; see balance and history | - | Own | Own | P0 |
| F13 | Approve or reject leave with a comment | View | Approve | - | P0 |
| F14 | Salary structure per employee | View | Manage | - | P0 |
| F15 | Monthly payroll: create and review the draft | View | Manage | - | P0 |
| F16 | Finalize payroll (locks the month) | Manage | - | - | P0 |
| F17 | Payslips with PDF download | All | All | Own | P0 |
| F18 | Dashboards, KPIs, trends and insight lists with filters | Company | HR | Personal | P0 |
| F19 | AI assistant chat answering from real data | All data | HR data | Own data | P0 |
| F20 | AI dashboard summary | Yes | Yes | - | P1 |
| F21 | Smart leave: type a sentence, get a pre-filled leave form | - | Own | Own | P0 |
| F22 | Policy Q and A on attendance, leave and payroll rules | Yes | Yes | Yes | P1 |
| F23 | Announcements | Post | Post | Read | P1 |
| F24 | In-app notifications (leave decisions, payslips) | Own | Own | Own | P1 |
| F25 | Audit log of create, update, approve and finalize actions | View | - | - | P0 |

## 5. Business rules

Numbers below are exact and come from the brief. These rules live in backend services only.

### M1 Auth
- BR-01 JWT login. Passwords hashed with bcrypt.
- BR-02 Every API checks role and data scope. An Employee only reads rows with their own `employeeId`.
- BR-03 A temporary password forces a password change on first sign-in. Until changed, the only usable endpoints are change-password, logout and me.

### M2 Setup
- BR-10 Defaults: office start 09:00, grace 15 minutes, half day under 5 hours, weekend Saturday and Sunday, office location plus radius (for example 150 m).
- BR-11 Rules are stored as settings and applied to new records only. Changing a setting never rewrites existing attendance records or payslips.
- BR-12 Only Admin changes settings, departments, designations, leave types, holidays and quotas. HR reads them.

### M3 Employees
- BR-20 HR registers each employee with job details and salary. This creates the employee's login with a temporary password.
- BR-21 Search, filters and paging happen on the server.
- BR-22 CSV import has a dry run that returns row, field and reason for every error. Validation: required fields present, unique employee code, unique email, valid email, known department, ISO date, salary greater than 0.
- BR-23 Employee code and email are unique across the company.

### M4 Attendance
- BR-30 The server stamps the time. The client never sends the check-in or check-out time.
- BR-31 One record per employee per day. A second check-in on the same day returns 409.
- BR-32 Late: check-in after 09:15 (office start plus grace).
- BR-33 half_day: worked time under 5 hours.
- BR-34 absent: a working day with no record and no approved leave.
- BR-35 missing_checkout: check-in exists but no check-out when the day closes.
- BR-36 Statuses: present, late, half_day, absent, on_leave, missing_checkout.
- Assumption A-02: check-in is rejected with 422 on a non-working day (weekend or holiday) and on a day covered by approved leave.
- Assumption A-06: status precedence at check-out is half_day, then late, then present. The `isLate` flag is stored separately so late-comer lists stay accurate.
- Assumption A-05: absent, on_leave and missing_checkout records are created when a day closes (see ARCHITECTURE section 9.2). "Today" is never shown as absent.

### M5 Leave
- BR-40 Days are counted on working days only, skipping weekends and public holidays.
- BR-41 Yearly quotas: annual 14, sick 8, casual 10, unpaid unlimited.
- BR-42 An overlapping request or a request over the balance returns 422.
- Assumption A-04: pending requests count against the balance (reserved), so two pending requests cannot overdraw it.
- BR-43 HR approves or rejects with a comment. Reject requires a comment.
- BR-44 An employee can cancel own pending request, or an approved request that has not started. Cancelling restores balance.
- Assumption A-03: nobody approves their own request. HR leave and corrections need another HR user.

### M6 Payroll
- BR-50 Gross = 1.5 x basic (HRA 40 percent of basic, medical 10 percent of basic).
- BR-51 Per day = gross divided by working days in the month.
- BR-52 Deduct per-day pay for each absent day, each unpaid leave day, and 0.5 day for each half day.
- BR-53 Prorate joiners and leavers by the working days they were employed in the month.
- BR-54 Tax slab on annual gross (gross x 12), illustrative:

| Annual gross (PKR) | Annual tax |
|---|---|
| 0 to 600,000 | 0 |
| 600,001 to 1,200,000 | 5 percent of the amount above 600,000 |
| 1,200,001 to 2,400,000 | 30,000 plus 15 percent of the amount above 1,200,000 |
| 2,400,001 to 3,600,000 | 210,000 plus 25 percent of the amount above 2,400,000 |
| Above 3,600,000 | 510,000 plus 35 percent of the amount above 3,600,000 |

- Assumption A-01: tax is computed on the contractual monthly gross x 12; monthly tax = annual tax / 12, prorated by payable days over working days for joiners and leavers. Net = earned pay - deductions - monthly tax. Amounts are rounded to whole PKR at each stored line.
- BR-55 HR creates and reviews the monthly draft. Only Admin finalizes. A finalized run is locked: no edits, no regeneration.
- BR-56 Late penalty (bonus rule): when enabled in settings, every 3 late days add 0.5 day to the deduction.

### M7 Dashboards
- BR-60 All numbers are computed on the server using database aggregation and are filterable by date range and department.
- BR-61 Dashboards and AI tools read from the same metrics service so numbers always match.

### M9 Comms and Audit
- BR-70 Announcements appear on all dashboards. In-app notifications exist for leave decisions, correction decisions and payslips.
- BR-71 The audit log records actor, action, entity, and before/after JSON for create, update, approve, reject, finalize and reset actions. Entries can never be edited or deleted.

## 6. Metric definitions

One implementation in `apps/api/src/modules/analytics/metrics.service.ts`. Dashboards and AI tools call it. Do not re-implement a metric anywhere else.

| ID | Metric | Formula |
|---|---|---|
| M-01 | Headcount | Employees with status active or probation on the end date of the period |
| M-02 | Attrition | Exits in period / average headcount x 100 |
| M-03 | Attendance rate | (present + late + missing_checkout + 0.5 x half_day) / (working-day records - on_leave) |
| M-04 | Late percent | late / (present + late) |
| M-05 | Absenteeism | absent days / expected working days, per department |
| M-06 | Leave utilization | approved days / quota, per leave type and department |
| M-07 | Payroll cost | Sum of gross and of net by month and department |
| M-08 | Average salary | Mean gross by department and designation |
| M-09 | Top late-comers | Employees ranked by count of days with `isLate`, top 5 |
| M-10 | Hours this week | Sum of worked minutes Monday to today vs 40 hours |

## 7. Dashboards

| Dashboard | Content |
|---|---|
| HR | KPIs: headcount, present, on leave, late today, pending approvals. Attendance trend. Absenteeism by department. Leave by type. Top 5 late-comers. AI summary. Announcements. |
| Admin | KPIs: headcount, attrition YTD, payroll cost, average salary. Headcount by department. Payroll cost by department. Gender and tenure. Audit feed. AI summary. Announcements. Onboarding checklist while setup is incomplete. |
| Employee | Check-in widget. Hours this week vs 40 h. Late count. Leave balance. Last payslip. Announcements. Ask my assistant. |

All dashboards support date range and department filters (Employee dashboard has date range only).

## 8. AI assistant requirements

Any hosted LLM API with tool calling. The AI explains and assists; the database is the only source of truth.

| Feature | Who | Behavior |
|---|---|---|
| Ask the assistant | All roles | Chat panel calls `POST /ai/chat`. The model picks a tool, the backend runs it with the user's scope, the model writes the answer. |
| Dashboard summary | Admin, HR | Sends the KPI JSON for the current filters, returns 3 to 5 insight bullets using only those numbers. |
| Smart leave | Employee, HR | One sentence in, JSON `{type, start, end, reason}` out, pre-filled form. The user confirms. |
| Policy Q and A | All roles | Section 5 rules sit in the system prompt. The model answers only from them or says it does not know. |

Tools: `get_headcount`, `get_attendance_summary`, `get_late_comers`, `get_leave_summary`, `get_my_leave_balance`, `get_payroll_summary`, `search_employees`.

Guardrails:
- The API key lives only in the backend env variable `AI_API_KEY`. The browser never calls the AI provider.
- The model never queries the database directly. Tools reuse the same services and permission checks as the REST API.
- The AI never saves data on its own. JSON output is validated; on failure retry once, then fall back to the normal form.
- 15 second timeout with a friendly fallback, about 20 requests per user per hour, every call logged in `ai_logs`. Answers carry an "AI-generated" label.

Live questions judges will ask:

| As | Question | Good answer |
|---|---|---|
| HR | How many active employees are in {department}? Who came late most often this month? What is this month's attendance rate? | Same numbers as the dashboard |
| Employee | How many sick leaves do I have left this year? | Own balance after approved leaves |
| Employee | What is {colleague}'s salary? | Politely refuses |
| Employee | I need next Monday and Tuesday off for my sister's wedding | Pre-filled casual leave with correct dates |

## 9. Bonus (up to +10)

Cheapest first: dark mode (tokens already support it), AI understands Roman Urdu (system prompt), late penalty rule (BR-56), camera attendance with face detection and location, absence anomaly flags, attrition risk score, PWA.

Camera attendance rules if built: accept only when exactly one face is detected, the phone or laptop is inside the Admin-set radius, and GPS accuracy is 100 m or better. The server computes distance (Haversine) and decides. Store the result, not a photo. A failed check falls back to an HR correction.

## 10. Acceptance criteria

Each criterion maps to at least one test or one line in the demo checklist.

- AC-01 On a fresh database `GET /setup/status` returns `initialized: false`; the web app opens the setup screen. After setup it returns `initialized: true` and `/setup` is no longer usable.
- AC-02 Admin creates an HR login. HR logs in and sees only the HR menu. HR calling any Admin-only endpoint gets 403.
- AC-03 HR registers an employee. A login exists with a temporary password. First sign-in forces a password change.
- AC-04 An employee checks in at 09:10: status present. At 09:20: status late. A second check-in the same day returns 409.
- AC-05 An employee checking out after 4 hours 30 minutes gets status half_day.
- AC-06 An employee cannot read another employee's attendance, leave, payslip or profile, even by editing an ID in the URL (403 or 404).
- AC-07 An employee applies for leave over a weekend: the day count excludes the weekend and any holiday. Overlap returns 422. Exceeding the balance returns 422.
- AC-08 HR approves leave with a comment. The employee gets a notification and the balance drops. HR cannot approve their own request.
- AC-09 Payroll draft for a month matches hand calculation for gross, deductions, tax and net for at least three cases: full month, one absent day with one half day, and a mid-month joiner.
- AC-10 Admin finalizes the run. Any later edit or regeneration of that month returns 409. Employees see the payslip and can download the PDF.
- AC-11 Dashboard KPIs equal what the AI assistant returns for the same question and filters.
- AC-12 An employee asking for a colleague's salary is refused politely and no salary leaves the server.
- AC-13 "Need next Monday and Tuesday off for my sister's wedding" returns a casual leave proposal with correct dates and a computed day count; nothing is saved until the user confirms.
- AC-14 If the AI provider fails or times out, the UI shows a plain message and the normal leave form remains usable.
- AC-15 The audit log shows actor, action, entity and before/after for create, update, approve and finalize actions, and has no edit or delete endpoint.
- AC-16 Every screen has a designed loading state, empty state and error state. Layout holds from 375 px wide.

## 11. Demo script (5 minutes)

1. Fresh install: Admin sets up company, office hours and location, a department and leave types, creates an HR login.
2. HR registers two or three employees. One signs in, changes the password and checks in.
3. Employee types a leave request in plain words and confirms the pre-filled form. HR approves.
4. HR opens the dashboard, clicks Summarize, asks who is on leave, runs payroll for the month. Admin finalizes it.
5. Employee downloads the payslip and asks for a colleague's salary (refused). Admin shows the audit log.

## 12. Non-goals

Recruiting, performance reviews, shift scheduling, multi-company tenancy, email delivery, biometric hardware, real tax compliance (the slab is illustrative), and any pre-loaded data.

## 13. Open questions

Tracked in `MEMORY.md` under "Open questions". Do not decide them silently; record the decision there.
