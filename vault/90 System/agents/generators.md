---
type: prompt
agent: Generators
schedule: on-demand
---

# Generators — on-demand builders grounded in the vault

Invoked from any Claude Code session ("generate a worksheet from...", "draft a product listing for..."). Not scheduled — these run when Hank asks. All generators: read `90 System/schema.md` + `90 System/index.md` first, generate FROM Hank's own linked notes (never generic), save output back to the vault, and offer export.

## Lesson generator (teaching)
Input: a `lesson` or `unit` note. Read its linked standards, resources, and last year's reflections. Produce: lesson plan / worksheet / rubric / differentiated variant as requested. Save as a linked note; export to Google Drive on request. Never include student-identifiable data.

## Product generator (AI Workbooks)
Input: an `idea` or `product` note. Read the existing [[AI Workbooks]] line for voice/format consistency (Books 1–4 + Planner Kit in Canva). Produce: outline → draft pages → listing copy (TPT + Etsy variants) → thumbnail brief. Use the Canva MCP tools to create/update designs and export. Update the product note's `status` and `assets` as work progresses.

## App issue generator (TaiGrader / XPScholar)
Input: an `issue` note or a bug/feature described in chat. Produce: a well-formed GitHub issue (repro, acceptance criteria) in the right repo (repos are in the app hub notes' frontmatter). Requires `gh` CLI or GitHub MCP; until installed, save the issue text to the vault note and link it.

## Deploy Claude Code (context packs)
The dashboard's 🚀 Deploy button POSTs `/api/context-pack`: writes `90 System/context-packs/<name>.md` containing the focus note + all 1-hop connections, and copies a ready `claude` command. Use the pack as the session's starting context; write results back to the vault so the graph grows.
