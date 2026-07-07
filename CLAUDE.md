# Hank OS

Henry Hennep's ("Hank") personal second-brain operating system. A local-first Markdown vault + agents + a custom 3D dashboard. Full design: `HANK-OS-PLAN.md`.

## Who Hank is
Teacher (educator workflows are first-class) who also builds: **TaiGrader** and **XPScholar** (web apps) and **AI Workbooks for Teachers** (digital product hustle).

## Layout
- `vault/` — the brain. Plain Obsidian-compatible Markdown. Never store notes anywhere else.
  - `00 Inbox/` — raw captures land here; agents file them later. Never block capture on organization.
  - `10 Teaching/` `20 Hustles/` `30 Apps/` `40 Life/` `50 Finance/` `60 Health/` — domains
  - `90 System/` — schema, templates, prompts, briefings, agent logs
- `dashboard/` — the Hank OS app: Express vault API (port 5175) + React/Vite front end (port 5173). Run with `npm run dev` in `dashboard/`, or via the `hank-os-dashboard` launch config. 3D galaxy (react-force-graph-3d — keep THREE deduped via the package.json override or the scene renders black), built-in Markdown editor, Finance + Health tabs.

## Skills
- **/grill-me** (`.claude/skills/grill-me/`) — interview mode. Any time Hank brings a vague goal, brainstorm, or blank goals file, grill first, build second.

## Rules for every agent/session
1. **Read `vault/90 System/schema.md` before creating or editing notes** — use the supertag frontmatter types defined there.
2. New notes from captures go to `00 Inbox/` unless you're confident of the destination; filing is the Gardener's job.
3. Wikilinks (`[[Note Name]]`) for all connections — the graph is built from them.
4. **Student-identifiable data never goes into cloud AI calls or leaves this machine.** Standards/units/lessons are fine.
5. Finance content is research and decision support only — never execute or recommend executing trades automatically.
6. Log agent runs to `vault/90 System/agent-logs/` (one line per action taken).
7. Keep everything Obsidian-compatible: standard Markdown, YAML frontmatter, no proprietary syntax.
8. **Check the index first, open files second.** `vault/90 System/index.md` is a one-line-per-note catalogue of the whole vault (maintained nightly by the Gardener). Route retrieval through it before grepping or opening files.
9. **API keys are never pasted into chats, prompts, or anything browser-reachable.** They go into local config files by hand, and those files stay gitignored.
