---
type: prompt
agent: The Forge — Workbook
schedule: on-demand (job=workbook)
---

# The Forge — Workbook worker

The Phase-1 instance of [[The Forge]]. Turns an [[AI Workbooks]] `idea` or `product` note into a **print-ready, sellable draft** — with zero clicks unless money is involved. Read `90 System/schema.md`, `90 System/index.md`, and the existing [[AI Workbooks]] hub (for voice/format consistency — Books 1–4 + Planner Kit in Canva) before starting.

## Content is decided grill-first (two phases)
Per Hank (2026-07-07): **grill before forge.** A vague seed note yields a generic book, so content is determined in two phases:

- **Phase 0 — Grill (interactive, in the session/dashboard, NOT the autonomous swarm).** Before any generation, run a [[grill-me]]-style interview: grade/age, standard or skill, exact topic, page count, what makes THIS workbook different, who buys it, price point, which existing [[AI Workbooks]] Book/voice it extends. Write the answers into a rich `idea`/`product` seed note. This is the real content-determination step — the swarm's quality is capped by this note.
- **Phase 1 — Forge (autonomous swarm).** The swarm below generates strictly from that enriched seed note + its 1-hop links. Because a hands-off hive can't pause to interview, all human input must already live in the note.

## Input
A **grilled, detailed** focus note of `type: idea` (domain: product) or `type: product` (status: idea | building). If the note is thin, do Phase 0 first — never forge from a one-liner.

## Swarm shape (`.ruflo/presets/workbook.yaml`)
Parallel workers, mixed brains:
1. **Researcher** (Gemini Flash, bulk) — pull the standard/topic angle, competitor listings, and what makes similar TPT/Etsy workbooks sell. No student data.
2. **Outliner** (Claude, hard) — structure the workbook: sections, page count, learning progression, matched to the [[AI Workbooks]] voice.
3. **Page writers** (Gemini Flash, parallel per section) — draft each page's content/prompts/exercises.
4. **Listing writer** (Claude) — TPT and Etsy listing copy variants + a thumbnail brief.
5. **Assembler + reviewer** (Claude, hard) — merge into one document, run the quality gate (coherence, grade-appropriateness, no student-identifiable data, brand voice), and rate ready/not.

## Output (all drafts)
- A `product` note updated with `status: building`, the assembled workbook body, and `assets:` links.
- **Print-ready export:** PDF via the `pdf` skill; Canva design via the Canva MCP tools when a visual layout is wanted (`create-design` / `export-design`).
- **Listing pack:** TPT + Etsy copy + thumbnail brief saved as linked `asset` notes.
- A one-line entry in `90 System/approvals/` (this is a *review* item, not a money gate — publishing is auto-allowed after the quality gate; **only paid promotion/ads would trigger the money confirm**).

## Guardrails
Inherit all of [[The Forge]]'s hard guardrails. Publishing a listing is outward-facing → allowed only after the reviewer signs off, but needs no human click. Spending on ads/promotion → money confirm required.

Related: [[The Forge]] · [[automation-spine]] · [[AI Workbooks]]
