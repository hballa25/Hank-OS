---
type: prompt
source: Second Brain - Principles and Starter Prompts.pdf
use-for: Building a cheap deterministic retrieval path where the model is called exactly once
---

# Starter Prompt 3 — Deterministic code before the model

```
build the retrieval path as plain deterministic code, not model calls. it should: strip my question
to keywords, score every candidate source from the index WITHOUT opening files, open only the single
best file, pull only the section that answers, and follow one pointer if that section points
elsewhere. the model only gets involved at the very end, with the evidence already attached. also
give me one simple command that stores a new memory - writes the file and updates the index in one
step, no model needed.
```

## Hank OS adaptation

The "one simple command that stores a new memory" should write to `vault/00 Inbox/` and append to the catalogue — that's the Hank OS capture rule in code. Bonus for this vault: a code-only retrieval path means questions touching `type: student` notes can be answered locally without any cloud model call, satisfying the student-data rule by construction.
