---
type: prompt
source: JARVIS-Prompt-Pack.pdf
use-for: Building an interactive 3D knowledge galaxy viewer from a folder of markdown notes
---

# Prompt 1 — The Galaxy

> Run inside an empty project folder with Claude Code (`mkdir my-jarvis && cd my-jarvis && claude`). Prompt 1 of 6 — run in order, test each before moving on.

```
Build me an interactive 3D knowledge galaxy from my markdown notes.

My notes folder is: [PASTE THE FULL PATH — or replace this line with: "I have
no notes — generate 25 realistic sample notes about a small business into
./notes first"]

Requirements:
— A Python 3 script (build.py, standard library only — no pip installs) that
scans every .md file and writes viewer/graph-data.js containing const GRAPH =
{nodes: [...], links: [...]}. Each node: a label from the filename, its folder
as a group, and a ~700-character excerpt of the note text. Link two notes when
one mentions the other's title or they share [[wikilinks]].
— A single-page viewer (viewer/index.html) using the 3d-force-graph library
from a CDN — no npm, no build tools, no frameworks.
— Make it CINEMATIC: black space background with a starfield, nodes glowing and
color-coded by group, slow idle drift. Clicking a node flies the camera to it,
highlights its neighbors, and opens a side panel showing that note's excerpt.
— A tiny Python standard-library web server (server.py, port 4700) that serves
ONLY the viewer/ folder.
— IMPORTANT: give every node a numeric id equal to its position in the nodes
array — later features depend on looking nodes up by index.
— When done: start the server and tell me the URL to open in Chrome.
```

**Checkpoint (from the pack):** you're staring at your own knowledge as a galaxy. Fly around it.

## Hank OS adaptation

Point the notes-folder placeholder at `C:\Users\hball\Hank OS\vault` — the vault is already wikilink-rich, so folder groups map to domains (`10 Teaching`, `20 Hustles`, `30 Apps`...). This overlaps with the planned Phase 2 `dashboard/` 3D graph; treat this prompt as a fast prototype of it. Skip the "generate sample notes" branch — Hank has real notes.
