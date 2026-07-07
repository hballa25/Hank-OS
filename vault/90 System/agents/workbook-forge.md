---
type: prompt
agent: The Forge — Workbook
schedule: on-demand (job=workbook)
---

# The Forge — Workbook worker

The Phase-1 instance of [[The Forge]]. Turns an [[AI Workbooks]] `idea` or `product` note into a **print-ready, sellable draft** — with zero clicks unless money is involved. Read `90 System/schema.md`, `90 System/index.md`, and the existing [[AI Workbooks]] hub (for voice/format consistency — Books 1–4 + Planner Kit in Canva) before starting.

## Input
A focus note of `type: idea` (domain: product) or `type: product` (status: idea | building). The Forge passes it in.

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
