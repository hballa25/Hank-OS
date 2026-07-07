---
name: grill-me
description: Intensive interview mode for Hank OS. Grills Hank with rounds of targeted questions to turn a fuzzy goal or idea into a complete vault note, plan, and dashboard section. Use whenever Hank says "grill me", starts any brainstorm, mentions filling in a goals file (Trading Goals, Fitness Goals), pitches a product/app/lesson idea that's still vague, or asks Claude to "build something great" from a loose description — even if he doesn't name the skill. Also use when about to build from a vault goal file that's blank or thin: grill first, build second.
---

# Grill Me

Turn vague intent into a build-ready plan by asking Hank rounds of sharp questions, then synthesizing his answers into the vault and acting on them. The principle: **structure comes from questions, not blank templates.** Hank thinks out loud; your job is to extract the numbers, constraints, and priorities he hasn't articulated yet.

## The interview

Use the AskUserQuestion tool in **rounds of up to 4 questions**, typically 2–4 rounds. Never dump one giant list — each round's questions should build on the previous round's answers.

**Round 1 — Territory.** The big shape: what's the real goal, what does success look like, what are the hard constraints (time, money, schedule)? For Hank, always consider his reality: teacher's schedule (school hours ~7:30–4:00 during the year, summers flexible), family/side-hustle time competition, builds things himself.

**Round 2 — Numbers and rules.** Convert every vague answer into something measurable: dollar amounts, times of day, frequencies, thresholds, deal-breakers. If he said "some risk is fine," ask "what's the most you can lose in a day before it affects your mood at dinner?"

**Round 3 — Tradeoffs and edge cases.** Force choices between things he probably wants both of. Surface contradictions between earlier answers and dig into them — a contradiction is the most information-rich thing an interview can find.

**Round 4 — Confirm the synthesis.** Present your distilled understanding as options ("here's the plan I heard — A as-is, B with modification X") before writing.

### Question craft

- Every option gets a real description with the tradeoff spelled out; put your recommended option first with "(Recommended)".
- Ask only what you can't find out yourself. Research facts; interview for preferences, constraints, and appetite.
- Use `multiSelect` when choices aren't exclusive.
- 2–4 rounds is the norm. Stop when a new question wouldn't change what you'd build.

## The synthesis

After the interview:

1. **Write the vault note** at the right location (check `vault/90 System/schema.md` for frontmatter types, `vault/90 System/index.md` for existing files). Structure: frontmatter → the plan → **Decisions** (what he chose and why) → **Open questions** (what's deliberately deferred). Wikilink related notes.
2. **Build forward.** The file is never the end product — do the thing the answers unlock (activate an agent, research a strategy, draft the product spec, generate the dashboard data). Say what you built and what changed.
3. **Housekeep**: update `index.md`, commit and push if the repo is clean to do so.

## Domain playbooks

**Trading (`50 Finance/Trading Goals.md`)** — interview covers: markets (futures vs stocks), account size and risk-per-trade, when he can actually trade given the school calendar, experience level, loss tolerance. Then: research popular, proven day-trading strategies for his markets/schedule; propose the best one to mimic; **paper-trade it virtually first** — The Trader agent tracks the virtual record before any real money moves. Update `agents/trader.md` assumptions if the interview contradicts them.

**Fitness (`60 Health/Fitness Goals.md`)** — interview covers: goal (cut/bulk/maintain + target), current stats he'll share, calorie/protein targets (compute for him — ask for inputs, not macros), cooking tolerance and repetition tolerance, allergies/dislikes, training schedule. Then stock `Pantry.md` structure and activate The Chef's first weekly plan.

**Product/app idea (`20 Hustles/` or `30 Apps/`)** — interview covers: who exactly buys/uses it, the one painful moment it solves, price point, smallest shippable version, what existing asset (lesson, template, code) it reuses. Then: write the `product`/`idea` note and draft next-step build tasks.

**Teaching unit (`10 Teaching/`)** — interview covers: standards, timeline, what worked/flopped last year, assessment style. Then: scaffold unit + lesson notes per the schema.

For a topic with no playbook, derive the rounds from first principles: territory → numbers → tradeoffs → confirm.
