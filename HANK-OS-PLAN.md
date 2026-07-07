# HANK OS — Master Plan

*Henry Hennep's personal second-brain operating system. Drafted 2026-07-06, before any build.*
*Based on: JARVIS Prompt Pack + Second Brain Principles guides, tailored for an educator and app/product builder, plus fresh web research on the 2025–26 second-brain landscape.*

---

## 1. Vision

One system that holds everything — teaching, school, side hustles, both web apps, Google Drive, Gmail, Canva, GitHub, local files — remembers all of it, shows the connections in a living 3D dashboard, and can deploy Claude Code with full context to build anything on demand. Talk to it. Use it from your phone. It never stops expanding.

### Design principles (the non-negotiables)

These come straight from why most second brains die, per the research:

1. **Capture in under 10 seconds, zero decisions.** The #1 reason people abandon second brains is capture friction. You dump; the AI files, tags, and links it later. Organization is a background process, never a prerequisite.
2. **Plain Markdown is the substrate. Everything else is a view.** The vault is local `.md` files (Obsidian-compatible). The 3D dashboard, mobile app, and voice interface are all just renderers on top. No lock-in, any AI can read it, and it survives any company shutting down (Limitless/Rewind users learned this the hard way when Meta bought them and killed capture in Dec 2025).
3. **The OS gardens itself.** Scheduled agents maintain the vault while you sleep — filing inbox captures, linking orphan notes, refreshing dashboards, drafting your morning briefing. You never do maintenance.
4. **Structure is retroactive, typed, and light.** Tana-style "supertags" (typed frontmatter) give every note a shape without forcing you to think about it at capture time.
5. **Retrieval happens *to* you.** Local embeddings passively surface related notes as you work (Smart Connections pattern) — fixing the "capture without retrieval" failure mode.
6. **Student data stays local.** Anything student-identifiable never leaves the machine in cloud AI calls. Standards, units, lessons — fine. Names and grades — local only.

---

## 2. How It Looks and Feels

### The 3D Dashboard (the centerpiece)

Open Hank OS and you're floating in a galaxy of your own mind:

- **Nodes** are notes, files, emails, designs, repos, products. **Color = supertag** (lessons glow one color, side-hustle products another, web-app code a third). **Size = importance** (how connected/central a node is).
- **Clusters** form naturally — your Teaching nebula, your Side Hustle nebula, your Personal nebula — with bridges between them.
- **Toggleable connection layers**: flip switches to show/hide link types — "show me only lesson→standard links," "hide email links," "show only what changed this week."
- **Drill-down**: click a node and the camera flies to it; a side panel opens the actual note/file, its connections, related items surfaced by AI, and action buttons (open in Obsidian, open in Drive, send to Claude Code, generate from this).
- **The Gap Finder** (stolen from InfraNodus): AI highlights *empty space* — disconnected clusters — and suggests bridges. "Your `#lesson` notes on fractions and your `#product` templates never touch. A fractions worksheet pack could be a product." Coverage gaps in your curriculum literally look like holes in the graph.
- **Modes/tabs**: Galaxy (everything), Curriculum (standards ↔ units ↔ lessons ↔ resources), Product Pipeline (idea → build → asset → launched), Focus (one project + 2 hops), **Finance** (daily trading plan, watchlist, charts), **Health** (meal plan, pantry, goals).
- **Command bar + voice**: hit a hotkey or talk — "show me everything about Unit 4" — and the graph filters and flies.

Tech reality check from research: `react-force-graph-3d` (Three.js/WebGL) is the proven library; smooth to ~5,000 visible nodes. Filters and modes aren't just UX — they keep us under that ceiling forever.

### A day in the life

**6:45 AM — Morning Briefing.** Overnight, the Gardener agent filed yesterday's captures and the Briefing agent drafted today's note: 1st period needs the lab worksheet printed, a parent email came in flagged `#followup`, your web app's GitHub had 2 new signups-related issues, and your Etsy-style product got a question. One note, everything linked.

**11:20 AM — Planning period.** "Hank OS, draft a differentiated version of Thursday's lesson for my inclusion class, aligned to the linked standard." It generates *from your own vault* — your unit note, the linked standard, last year's reflection that said the pacing was too fast — and saves the draft back as a vault object, exported to Drive, worksheet mocked in Canva.

**4:30 PM — Capture on the drive home** (parked!): hold the phone button, brain-dump three ideas. Whisper transcribes, an LLM cleans it up, auto-tags `#idea #product`, drops it in the inbox. Ten seconds of your attention.

**8:00 PM — Build mode.** Open the dashboard, fly to the Product Pipeline. The Gap Finder flagged that "teacher planner template" idea from March connects to 14 lesson-format notes. One click: "Deploy Claude Code with this context." A session opens already knowing the product idea, your design conventions from Canva, your existing product repo structure. You build. Progress writes back to the vault, and the graph grows a new node.

**Sunday — Weekly Review.** An agent drafts it: what you captured, what moved, what's stale, what's ready to ship. You approve/adjust in 10 minutes.

---

## 3. Architecture — Five Layers

```
┌─────────────────────────────────────────────────────────┐
│  L4  INTERFACES    3D Dashboard · Voice · Mobile PWA     │
├─────────────────────────────────────────────────────────┤
│  L3  AGENTS        Claude Code sessions · Gardener ·     │
│                    Briefing · Generators · Gap Finder    │
├─────────────────────────────────────────────────────────┤
│  L2  INTEGRATION   MCP toolbelt (Gmail, Drive, Canva,    │
│      SPINE         GitHub, Gemini) · n8n pipelines       │
├─────────────────────────────────────────────────────────┤
│  L1  THE BRAIN     Embeddings index · Graph index ·      │
│                    Memory · Supertag schema              │
├─────────────────────────────────────────────────────────┤
│  L0  THE VAULT     Plain Markdown files, local-first,    │
│                    Obsidian-compatible, git-versioned    │
└─────────────────────────────────────────────────────────┘
```

### L0 — The Vault
- `C:\Users\hball\Hank OS\vault\` — plain Markdown, openable in Obsidian from day one.
- Loose PARA-ish top level (research says strict PARA gets abandoned; loose wins):
  - `00 Inbox/` — everything lands here first, untagged is fine
  - `10 Teaching/` — units, lessons, standards, school admin
  - `20 Hustles/` — one folder per hustle (starting with **AI Workbooks for Teachers**); products, ideas, launches
  - `30 Apps/` — one folder per web app (**TaiGrader**, **XPScholar**); decisions, issues, roadmaps
  - `40 Life/` — personal
  - `50 Finance/` — daily trading briefings, watchlists, trade journal, goals
  - `60 Health/` — pantry inventory, fitness goals, weekly meal plans, workout notes
  - `90 System/` — dashboards, agent logs, briefings, schema docs
- Git-versioned (private GitHub repo) → history, sync, and mobile access for free.

### L1 — The Brain
- **Supertag schema** (YAML frontmatter types): `#lesson`, `#unit`, `#standard`, `#student` (local-only), `#idea`, `#product`, `#asset`, `#app`, `#issue`, `#contact`, `#meeting`, `#followup`. Each type has fields (a `#lesson` has `unit`, `standards`, `resources`, `date`, `reflection`). Structure applied retroactively by agents.
- **Embeddings index**: local semantic index over the whole vault (Smart Connections / Khoj pattern) → powers passive related-notes, voice Q&A, and the Gap Finder.
- **Graph index**: a small service that parses links + tags into a JSON graph the 3D dashboard renders.
- **Memory**: Claude Code's persistent memory + a `90 System/memory/` convention so every agent session knows the current state of every project.

### L2 — Integration Spine (two lanes)
- **MCP toolbelt** (agentic, on-demand — "read that parent email, update the student note, open a GitHub issue" in one conversation):
  - Google-managed MCP servers for **Gmail + Drive** (first-party, shipped by Google)
  - Official **GitHub** MCP server (repos, issues, PRs for both web apps)
  - **Canva** MCP (already connected to this Claude Code setup — design search, generation, export, brand templates)
  - **Google Drive** MCP (also already connected here)
  - Obsidian REST MCP once the vault is live
  - **Gemini** via API for specific jobs (long-doc analysis, Gemini Live-style voice later)
- **n8n** (self-hosted, deterministic pipelines — free, unlimited runs):
  - Gmail label `→brain` → Markdown note in Inbox
  - New Drive file in watched folders → indexed + linked
  - GitHub issues/releases on your apps → app dashboard notes
  - Product platform notifications → hustle notes

### L3 — Agents
- **The Gardener** (nightly): files Inbox captures, applies supertags, links orphans, flags duplicates, logs what it did.
- **The Briefing** (each morning): Gmail + calendar + open projects + yesterday's captures → one morning note.
- **The Cartographer** (weekly): recomputes clusters/centrality, runs the Gap Finder, drafts the weekly review.
- **Generators** (on-demand, Brisk/MagicSchool-style but grounded in YOUR vault): lesson plans, rubrics, differentiated materials, product listings, Canva design drafts, email drafts.
- **The Trader** (every market morning, pre-open): researches the day's most promising futures and stock setups, key levels and catalysts to watch, and writes a comprehensive trading plan for the day — rendered in the dashboard's Finance tab with charts and visuals, plus an end-of-day journal prompt. *Decision support and research only — Hank makes every trade; no student-loan-the-account moves get auto-executed, ever.*
- **The Chef** (weekly + on-demand): reads the pantry inventory note and fitness goals, generates the week's meal-prep plan (macros aligned to current goals), and produces a grocery list for only what's missing. Pantry updates by voice capture ("just used the last of the chicken").
- **Builder deploys**: "Deploy Claude Code on X" assembles a context pack (relevant notes, schema, repo state, design assets) and launches a session. This is the "build faster with more context" engine.

### L4 — Interfaces
- **3D Dashboard**: custom web app — React + `react-force-graph-3d` + Three.js — with a **built-in Markdown note editor** (CodeMirror/Milkdown-class: live preview, wikilinks, supertag autocomplete) so Hank OS is the daily writing surface, not just a viewer. Command bar, connection toggles, drill-down panel, modes/tabs, Gap Finder overlay. Polished enough it could *become* a product someday.
- **Voice, two tiers** (ship tier 1 first — it's the proven high-value piece):
  1. *Brain-dump*: push-to-talk on phone/desktop → Whisper transcription → LLM cleanup + auto-tag → Inbox.
  2. *Conversation*: talk to the vault ("what did I plan for Unit 4?") — RAG over the embeddings index, Gemini Live-style.
- **Mobile**: the dashboard built as a **PWA** (installable from the browser, no app store) + vault on the phone via Obsidian Mobile with git sync. Phone priorities: capture, search/ask, briefing, graph viewing.

---

## 4. What It Can Do — Capability Map

### As a teacher
- Curriculum-as-graph: standards ↔ units ↔ lessons ↔ resources rendered in 3D; coverage gaps are visibly empty regions
- Generate lesson plans, rubrics, differentiated materials *from your own linked notes*, saved back to the vault and exported to Drive/Canva
- Parent-email workflow: email → summarized → linked to (local-only) student note → drafted reply
- Year-over-year reuse: last year's tagged lessons resurface automatically when you hit that unit again
- (Research context: teachers using AI weekly save ~5.9 hrs/week — this system aims past that because it's grounded in your own materials)

### As a builder
- Product pipeline view: `#idea → #product → #asset → launched`, each stage linked to Canva designs, repos, listings
- One-click Claude Code deployment with a full context pack per project
- Both web apps tracked as living dashboards: GitHub issues, decisions, roadmaps as linked notes
- Canva integration: search/generate/export designs from inside a Hank OS conversation
- Gap Finder cross-pollination: teaching expertise × product skills = product ideas nobody else can make

### As a trader (Finance tab)
- Pre-market daily briefing: most promising futures/stock setups, key levels, catalysts, and a full trading plan for the day
- Charts and visuals rendered in the dashboard (candlesticks, watchlist heat, plan checklist)
- Trade journal notes linked to the plans that spawned them — over time the graph shows which setups actually work *for you*
- Strictly research + decision support; execution stays 100% human

### As a health coach (Health tab)
- Living pantry inventory (updated by voice: "used the last of the rice")
- Weekly meal-prep plan generated from what's actually at home, aligned to current fitness goals and macros
- Grocery list for only the gaps; goals and progress tracked as linked notes

### As a life OS
- Morning briefing, weekly review, universal capture, universal search ("ask my brain anything")
- Ever-expanding: every new app/folder/cloud/repo is just a new n8n pipeline or MCP server — the architecture doesn't change

---

## 5. Best Ideas Stolen from the Research

1. **Sub-10-second capture, AI files it later** — attacks the #1 abandonment cause
2. **Markdown substrate, everything else is a view** — the anti-lock-in insurance policy
3. **Tana-style supertags** applied retroactively by agents
4. **Self-maintaining scheduled agents** (Khoj automations / obsidian-second-brain's 44-command pattern — the vault gardens itself)
5. **3D graph with intelligence**: InfraNodus-style clustering + centrality sizing + AI structural-gap detection, not just eye candy
6. **Passive semantic recall** (Smart Connections): related notes surface without being asked
7. **Two-tier voice**: capture first (solved tech), conversation second (frontier)
8. **Teacher generators grounded in the vault** (Brisk/MagicSchool capability, your content)
9. **MCP toolbelt as the spine** — Google's first-party Gmail/Drive servers + official GitHub + Canva + Obsidian
10. **Curriculum-as-graph** — the showpiece visualization doubles as a real planning tool

Validation from the wild: "Claude Code + Obsidian vault as agent memory" is a genuine 2026 movement with working examples (Eleanor Konik cleared years of backlog "in minutes a day"; the obsidian-second-brain project runs scheduled vault-maintenance agents nightly). Hank OS is this pattern, plus the 3D dashboard and educator layer nobody has built yet.

---

## 6. Build Roadmap

**Phase 0 — Foundation (weekend one).** Vault structure + supertag schema + git repo + Obsidian open on it. Migrate starter prompts from both PDFs into `90 System/prompts/`. CLAUDE.md so every Claude Code session knows the OS.

**Phase 1 — The Brain awakens (week 1–2).** Inbox capture conventions. The Gardener + Briefing agents as scheduled Claude Code runs. Gmail→inbox and Drive→index pipelines (n8n or Apps Script). *Value ships here already.*

**Phase 2 — The Dashboard (week 2–4).** Graph index service + React/`react-force-graph-3d` app: galaxy view, supertag colors, toggles, drill-down, command bar. Then modes + Gap Finder.

**Phase 3 — Full spine (month 2).** GitHub MCP wired to both apps. Canva + Gemini flows. Generator agents (lesson tools, product tools). "Deploy Claude Code" context packs.

**Phase 4 — Voice (month 2–3).** Whisper brain-dump capture (phone + desktop), then conversational RAG.

**Phase 5 — Mobile (month 3).** Dashboard as installable PWA; Obsidian Mobile + git sync for the vault; capture + ask + briefing on the go.

**Ongoing — Expansion.** Each new integration = one new pipeline or MCP server. The Cartographer keeps the graph healthy as it grows.

---

## 7. Decisions Made (2026-07-06)

1. **Fully custom app** — Hank OS gets its own built-in Markdown note editor (CodeMirror/Milkdown-class) inside the dashboard, no Obsidian dependency. Vault files stay 100% Obsidian-compatible plain Markdown as the escape hatch / mobile fallback.
2. **Vault sync**: private GitHub repo (Hank creates it).
3. **First integrations**: **TaiGrader** + **XPScholar** (web apps) and **AI Workbooks for Teachers** (product hustle) — all three wired in Phase 3, TaiGrader as the template.
4. **n8n**: always-on cloud box.
5. **New modules added**: Finance tab (The Trader daily briefing) and Health tab (The Chef meal-prep planner).
