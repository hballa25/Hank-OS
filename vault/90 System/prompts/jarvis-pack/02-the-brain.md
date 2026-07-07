---
type: prompt
source: JARVIS-Prompt-Pack.pdf
use-for: Adding a Q&A endpoint that answers questions from your own notes via the Anthropic API
---

# Prompt 2 — The Brain

```
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
```

**Then (from the pack):** paste your API key into config.json, hard-reload Chrome, and interrogate your own brain.

**No API key?** Tell Claude: *"instead of the Anthropic API, make /chat shell out to claude -p so it runs on my Claude Code subscription."* Slower, but free.

## Hank OS adaptation

Hard rule before running this against the vault: **student-identifiable notes must never reach a cloud AI call.** Exclude any `type: student` notes (and `10 Teaching` student files) from the top-6 retrieval before the API call, or run the `claude -p` subscription variant fully local-machine only. Great for "what did I decide about XPScholar pricing?"-style recall across `20 Hustles` and `30 Apps`.
