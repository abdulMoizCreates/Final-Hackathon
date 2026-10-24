# HCM Lite - Agent entry point

Copy this file to the repo root as both `AGENTS.md` (Codex, opencode, Antigravity and others) and `CLAUDE.md` (Claude Code). Keep the two identical.

Project: HCM Lite, an AI-assisted Human Capital Management web app with three roles (Admin, HR, Employee), built for the Saylani Hackathon on 24 October 2026. The system starts empty. There is no dummy data.

## Read order (every session, every agent, no exceptions)

1. `docs/MEMORY.md` - handoff note, current state, decisions, assumptions, gotchas. Short. Read all of it.
2. `docs/TRACKER.md` - what is done, what is in progress, what is next. Read all of it.
3. `docs/RULES.md` - non-negotiable rules for code, UI, security and process. Read all of it.
4. Then read only the sections you need from:
   - `docs/PRD.md` - what to build and the exact business rules
   - `docs/ARCHITECTURE.md` - stack, data model, API contract, algorithms
   - `docs/DESIGN.md` - brand, tokens, components, screens, motion

The PDF `Saylani_Hackathon_HCM_Lite_Brief.pdf` is the source of truth. If any doc conflicts with it, the PDF wins. Record the conflict in `docs/MEMORY.md`.

## Before you write code

- Pick one task from `docs/TRACKER.md`. Set it to `in_progress` with your agent name.
- Check the task's acceptance criteria and the files it touches. Do not start work that is not in the tracker; add it first.
- Stay inside your lane: backend agents edit `apps/api`, frontend agents edit `apps/web`. Cross-lane changes go through the API contract in `docs/ARCHITECTURE.md`.

## Before you stop (every session)

1. Update task statuses in `docs/TRACKER.md`.
2. Rewrite the Handoff block at the top of `docs/MEMORY.md` (current focus, what changed, what is next, what is blocked).
3. Append any new decision, assumption or gotcha to `docs/MEMORY.md`.
4. If you changed an endpoint, a data model, a token or a component rule, update `docs/ARCHITECTURE.md` or `docs/DESIGN.md` in the same commit.
5. Make sure the app still builds and the dev server starts.

## The rules that get broken most often

- No emojis anywhere: UI, code, comments, commit messages, docs.
- No dummy, seed or placeholder data in the app. Empty states are real designs.
- No extra borders, gradients, glass effects, colored left-border cards or icon-in-tinted-square decoration. Follow `docs/DESIGN.md` tokens only. No hardcoded colors, sizes or fonts.
- Business rules live in backend services only. The frontend never decides a status, a balance or a payroll number.
- Every API call checks role and data scope on the server. The AI assistant uses the same services as the REST API.
- Never commit secrets. Only `.env.example` is committed.
