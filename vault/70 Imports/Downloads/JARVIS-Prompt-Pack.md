---
type: import
source: "Downloads"
original: "C:/Users/hball/Downloads/JARVIS-Prompt-Pack.pdf"
converted: 2026-07-07T06:27:35.424Z
---

# JARVIS-Prompt-Pack

B U I L D Y O U R O W N J A R V I S
The Free Prompt Pack — by Zubair Trabzada · AI Workshop
6 PROMPTS · ONE EVENING · A TALKING AI SECOND BRAIN
This is the exact method I used to build JARVIS with Claude Code — boiled down to a prompt
sequence anyone can run. Paste them in order, one at a time, and Claude builds the whole thing for
you. No coding required. You just supervise.
What you'll have at the end: a 3D knowledge galaxy of your own notes · a voice assistant that
answers from them out loud · the fly-to-source camera dive · and a personality with a razor wit that
calls you "sir."
Before you start (5 minutes)
Claude Code installed and logged in → claude.com/claude-code
Google Chrome — the mic and voice need it (Safari won't cut it)
A folder of markdown notes (Obsidian vault, exported Notion, anything with .md files).
None? Prompt 1 has you covered.
An Anthropic API key for the brain → console.anthropic.com ($5 of credit is plenty;
answers cost fractions of a cent)
⚠ The one rule: never paste your API key into any chat window. You'll type it into a config file
yourself in Prompt 2. Anything pasted into a chat should be treated as exposed. Trust me on this

-- 1 of 6 --

one.
Open a terminal, make an empty folder, and start Claude Code inside it:
mkdir my-jarvis && cd my-jarvis && claude
Run the prompts in order. Let each one finish and test it before moving on.
P R O M P T 1
The Galaxy 🌌
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
Checkpoint: you're staring at your own knowledge as a galaxy. Fly around it. This alone is worth a screen
recording.

-- 2 of 6 --

P R O M P T 2
The Brain 🧠
Now give my galaxy a brain — I want to type a question and get an answer from
MY notes.
— Create config.json in the project root (NOT inside viewer/ — it must never be
reachable from the browser) with placeholders: {"api_key": "PUT-YOUR-KEY-HERE",
"model": "claude-opus-4-8"}. I will paste my API key into that file myself — do
not ask me for it.
— Add a POST /chat endpoint to server.py: score every note against my question
by keyword overlap (title matches weigh extra), take the top 6, and call the
Anthropic Messages API (the model from config.json) with a system prompt that
says: answer ONLY from these notes, in 2–3 sentences, and admit it when the
notes don't cover it.
— The endpoint returns {"answer": "...", "nodes": [array indexes of the notes
used]}.
— Keep a short per-session conversation history server-side so follow-up
questions work.
— Add a sleek input bar at the bottom of the viewer that shows the answer on
screen.
— The API key must never appear in the browser, the HTML, or any file the
server serves.
— When done, restart the server and give me 3 example questions to try based on
my actual notes.
Then: paste your API key into config.json, hard-reload Chrome, and interrogate your own brain.
No API key? Tell Claude: "instead of the Anthropic API, make /chat shell out to claude -p so it runs on my
Claude Code subscription." Slower, but free.

-- 3 of 6 --

P R O M P T 3
The Voice 🗣
Give it a voice — both directions. Free, built into the browser, no paid
services:
— Speak every answer out loud with the Web Speech API (speechSynthesis). Prefer
a British English voice if the system has one.
— Add a 🎙 mic button using webkitSpeechRecognition (Chrome): click, speak, and
the transcript goes through the same /chat flow.
— Show a status line while it's listening and thinking ("● listening…", "●
thinking…").
— Browsers block audio until the user interacts with the page — make sure
speech starts reliably after the first click.
— Test-plan me: list what I should click and say to verify both directions
work.
Checkpoint: you're now talking to your notes — and they're talking back.
P R O M P T 4
The Magic ✨ — fly-to-source
When Jarvis answers from a note, I want the galaxy to PROVE it:
— Use the nodes array that /chat already returns: fly the camera to the top
source node, light it up along with its direct neighbors, and open its side
panel — so I can see exactly where the answer came from.
— If the answer drew on 4+ notes, light up the whole cluster instead of flying
to one.
— Don't read the whole note aloud — the note is on screen. The spoken answer
stays short.
Checkpoint: this is the moment people gasp in demos. Ask it something and watch the camera dive.

-- 4 of 6 --

P R O M P T 5
The Personality 🎩
Give it the personality. Update the /chat system prompt so the assistant:
— Is a dry, impeccably polite British butler with a razor wit. Addresses me as
"sir" (occasionally, not every sentence). One genuinely funny line beats three
bland ones.
— Answers questions about my notes in ONE witty sentence plus the facts — never
recites the note back (it's on screen).
— Handles small talk and jokes WITHOUT dragging the camera around the graph —
only fly to nodes when I actually asked about my notes.
— Add a boot greeting: when the page loads, it says "Good evening, sir. [N]
notes indexed, all present and accounted for" — with the real note count.
P R O M P T 6
Total Recall 📝 — bonus
One more power: let me grow the brain by voice.
— When I say or type something starting with "remember that…", POST it to a new
/remember endpoint that writes a real markdown note into a captures/ folder
inside my notes directory, with a sensible title from the first few words.
— Then add the new node to the galaxy LIVE — born at its most related node's
position, with a brief glow pulse — and fly the camera to it.
— Confirm out loud with one witty line.
Try: "remember that prompt packs make excellent free gifts" — and watch a new star get born.
Troubleshooting (90% of all issues)
SY M P TO M 	F I X
Mic button does nothing 	Chrome → lock icon in the address bar → allow Microphone. Must
be Chrome/Edge.
No sound 	Click anywhere on the page once, then ask again (browsers block
audio before the first interaction).

-- 5 of 6 --

Page looks stale after a change 	Hard reload: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows).
"model not configured" 	You didn't paste your key into config.json, or left the placeholder
text in.
Answers are generic 	Your notes folder path was wrong in Prompt 1 — re-run it with the
full absolute path.
Anything else 	Paste the exact error into Claude Code and say "fix it." That's the
whole method.
Where this stops — and JARVIS begins
What you just built is the skeleton. It's real, it works, and it's yours. The JARVIS I use every day is
what happens after hundreds of hours and millions of tokens of iteration on top of that
skeleton:
🎬 The Iron-Man reactor HUD that pulses in rhythm with his voice
🔊 A cloned ElevenLabs voice + wake word ("Jarvis…") + true barge-in — interrupt him
mid-sentence
☀ "Good morning" briefings from your REAL Gmail + Calendar, inbox triage, and a
"what needs me?" agent inbox
🌐 Live web research by voice — "Jarvis, research X" → searched, summarized, sources
on a card
✋ Agent hands — drafts emails, researches, repurposes content — with a "do it"
confirmation gate
👀 Screen vision · 🍎 Mac control by voice · 🕰 a Time Machine ("what was I doing
last Tuesday?")
🧠 Model hot-swap — "Jarvis, try on Grok" — and TARS-style personality dials
Plus the click-by-click install guide, every update he gets, and the community building
alongside you
Jarvis is not for sale — members get him.
The finished build, the 5-minute install, and every future version live inside the AI Workshop.
👉 skool.com/aiworkshop
Built with Claude Code + Claude Fable 5. Build your own? Post it in the community — the best one gets featured in the
next video. · © Zubair Trabzada

-- 6 of 6 --
