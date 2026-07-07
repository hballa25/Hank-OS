---
type: reference
agent: The Forge
status: building
created: 2026-07-07
---

# The Automation Spine ("The Forge")

The reusable machine that turns any Hank OS job into a **verified draft** with almost no clicks. Built from the tools installed 2026-07-07 (see [[external-ai-tools]]): **ruflo** (swarm orchestration), **superpowers** + **andrej-karpathy-skills** (quality gates), **ECC** (agent library + hooks), **open-design** (polished exports), **Vibe-Trading** (backtests). Grilled into shape via [[grill-me]] on 2026-07-07.

## The one-line idea
> **Trigger → ruflo swarm (mixed brains) → worker agents with quality gates → draft lands in the vault → you're notified → it finalizes/exports. The only thing that ever waits for your click is spending money.**

## Architecture

```
 TRIGGERS (all hit one endpoint)          THE FORGE ENGINE                    OUTPUT
 ┌───────────────────────────┐    ┌──────────────────────────────┐   ┌──────────────────┐
 │ • Dashboard button (1-click)│──▶│ dashboard server = host      │──▶│ draft note in     │
 │ • Voice ("run the …")       │   │  · job queue + scheduler     │   │ vault (#draft)    │
 │ • Schedule (cron-like)      │   │  · calls `ruflo` swarm       │   │ + export (PDF/    │
 │ • Swarm auto (chained jobs) │   │  · mixed brains:             │   │ Canva/PPTX/PR)    │
 └───────────────────────────┘    │    Claude CLI = hard reason  │   └──────────────────┘
                                   │    Gemini Flash = bulk       │            │
                                   │  · quality gates (superpowers│            ▼
                                   │    /karpathy/ECC hooks)      │   NOTIFY: dashboard
                                   │  · student-data hook (hard)  │   inbox · Briefing ·
                                   └──────────────────────────────┘   PWA push · voice
```

**Host:** the always-on dashboard server (`dashboard/server/index.js`, autostarted by [[autostart]]) gains a **job runner + scheduler + approval store**. Every trigger becomes a POST to `/api/forge/run`. This unifies all four run-modes through one place — nothing new to keep running.

**Brains (mixed, per grill):** ruflo routes heavy reasoning to the local `claude` CLI (no per-token cost, on Hank's plan) and high-volume grunt work to **Gemini Flash** via API key (cheap bulk tier). *Requires a Gemini API key in local config — see Open questions.*

**Quality gates (baked in, per grill "gate everything"):** any code an agent writes goes through TDD + self-review + verification (superpowers) with karpathy discipline; any outward-facing artifact is checked by a reviewer agent before it lands. These are the *automated* gate that replaces manual approval clicks.

## The approval model (resolved contradiction)
Grill Round 2 said "draft → approve"; Round 3/4 said "only money needs a click." Resolution:

| Action | Gate |
|---|---|
| Reversible (vault notes, drafts, files, git branches, backtests) | **None** — auto-finalizes |
| Outward-facing (push to app `main`, publish/list a product, send as Hank) | **Automated gate only** — reviewer agent + passing tests must sign off; no human click |
| **Spending real money** (ads, purchases, anything that debits an account) | **One-button human confirm** — always |
| Student-identifiable data in a cloud AI call | **Hard-blocked** — never, silent hook (CLAUDE.md rule 4) |

## Build phases (focused-weekend scope, then expand)
1. **Spine foundation** — server job runner + scheduler + approval store; `ruflo init` in the repo; the student-data guard hook; the mixed-brains config.
2. **Workbook Forge** (first instance) — from an [[AI Workbooks]] `idea`/`product` note: research → outline → page drafts → listing copy → thumbnail brief → print-ready draft (PDF via the pdf skill, Canva via MCP). Lands as a `product` draft. See [[The Forge — Workbook]].
3. **Dashboard: Automations / Approval inbox tab** — lists pending drafts (preview + the money-confirm button) and a "Run a Forge" launcher. Voice + schedule reuse the same endpoint.
4. **App Copilot** (Phase 2) — describe a bug/feature for [[TaiGrader]]/[[XPScholar]] → plan → implement on a branch → TDD+review+verify → open PR (auto-merge on green, per the model above).
5. **Teaching → Finance/Health** (Phase 3) — lesson/worksheet generators; The Trader on real [[Strategy Playbook]] backtests via Vibe-Trading; The Chef weekly plans. All ride the same spine.

## Decisions (what Hank chose in the grill, and why)
- **Two wins at once:** automation *and* better outputs — the spine delivers both by construction.
- **Order:** shared spine first, then Workbook Forge, then App Copilot, then teaching, then finance/health.
- **All four triggers** wanted; **hands-off swarm** is the day-one engine, with the dashboard button as its visible control surface.
- **Mixed brains** — Claude plan for hard reasoning, cheap Gemini Flash for bulk (best economics).
- **All notification channels** — dashboard inbox + Briefing + PWA push + spoken summary.
- **Approval = money-only** human gate; everything else protected by automated quality gates.
- **Quality gates on from day one** — accept slower per-task for far fewer broken outputs.

## Open questions (deliberately deferred)
- ~~Gemini API key for the bulk tier~~ **DONE 2026-07-07** — key in `~/.vibe-trading/.env` (by hand), model corrected to `gemini-2.5-flash`, verified with a live completion. The dashboard server loads it from that single file (never copied into the repo) and exposes readiness at `/api/forge/config`; the Automations tab shows "⚡ Bulk tier: Gemini ready".
- **PWA push** — needs the production/HTTPS path ([[pwa-go-live]]) live for real phone notifications; until then, dashboard inbox + Briefing cover it.
- **ECC footprint** — 277 skills/67 agents adds session context; keep enabled only if the App Copilot phase actually leans on it, else disable.
- Which ruflo plugins beyond `ruflo-core` to add (swarm, sparc, rag-memory, market-data…) — decide per phase.

Related: [[external-ai-tools]] · [[The Forge — Workbook]] · [[The Gardener]] · [[The Briefing]] · [[AI Workbooks]] · [[autostart]] · [[pwa-go-live]]
