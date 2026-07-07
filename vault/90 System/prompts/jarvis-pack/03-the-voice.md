---
type: prompt
source: JARVIS-Prompt-Pack.pdf
use-for: Adding free browser-based voice input/output (Web Speech API) to the notes assistant
---

# Prompt 3 — The Voice

```
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
```

**Checkpoint (from the pack):** you're now talking to your notes — and they're talking back.

## Hank OS adaptation

No placeholders — usable as-is. Chrome/Edge required for the mic. Classroom angle: the same Web Speech pattern (free, no paid services) could power a read-aloud accessibility feature in XPScholar or a demo mode for AI Workbooks content.
