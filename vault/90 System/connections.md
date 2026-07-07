# Connections Registry — how anything gets into Hank OS

Hank OS connects to the world through four doors. This note is the map; update it whenever a new account or app joins.

## Door 1 — Sources (any folder → the galaxy)
`dashboard/sources.json` lists local folders to index into the 3D graph. Each entry: `{"name": "...", "path": "...", "maxFiles": 200, "depth": 3}`. Every source becomes its own colored cluster with its own toggle, read-only. Restart the dashboard after editing.

**Multiple Google Drives connect here:** install [Google Drive for Desktop](https://www.google.com/drive/download/) and sign in with up to 4 Google accounts — each mounts as its own folder under `G:\`/`H:\` etc. Add one sources.json entry per account (point at the specific folders that matter, not the whole drive). Beyond 4 accounts, or for pick-and-choose sync: [rclone](https://rclone.org) supports unlimited Google accounts.

**Connected now:**
- `Downloads` — C:\Users\hball\Downloads (demo of a "my computer" source)
- *(add: school Drive, personal Drive, side-hustle Drive when Drive for Desktop is set up)*

## Door 2 — Gmail capture (any number of accounts)
No server needed. In **each** Gmail account: script.google.com → new project → paste `90 System/gmail-capture-script.md`'s code → set the account label + Drive folder → time-based trigger every 15 min. Emails you label `brain` become Markdown files in that account's `HankOS Inbox` Drive folder; Drive for Desktop syncs them to disk; that folder is a Source (or the Gardener sweeps it into `00 Inbox/`). Works identically for 2 or 10 accounts.

## Door 3 — MCP servers (agentic tools for Claude Code)
Claude Code reads `.mcp.json` in the repo root. Add a server per app — community Google Workspace MCP servers support **multiple Google accounts** in one server (e.g. taylorwilsdon/google_workspace_mcp). Same door for GitHub, Notion, Slack, anything with an MCP server. Registry: https://github.com/modelcontextprotocol/servers

## Door 4 — n8n (the always-on cloud box, when set up)
For scheduled pipelines that must run with the PC off: one n8n credential per Google account (unlimited), flows append to the vault via the GitHub repo. This replaces/upgrades Door 2 when the cloud box goes live.

## Rules
- Sources are **read-only** in the dashboard — the vault is the only writable brain.
- Student-identifiable data: never index a source folder that contains it unless it stays local-only.
- One account = one entry, named clearly (`Drive-School`, `Drive-Personal`, `Gmail-Hustle`), so graph colors and agent logs stay legible.
