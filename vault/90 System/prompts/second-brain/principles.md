---
type: prompt
source: Second Brain - Principles and Starter Prompts.pdf
use-for: Core design principles for a Claude Code second-brain / memory system
---

# Second Brain — Core Principles (RoboNuggets · Agentic Lessons, by Jay E)

**The one thing to hold onto:** Every workspace is different. The author's exact system would fit you badly — what transfers are the **principles**. Give these to the model, let it study *your* workspace, and let it build *your* version. The starter prompts deliberately ask the model to interview you before building — answering its questions is where your workspace's shape gets in.

## 1. Research before you build
Don't start from your own guesses — or the author's. Pull what's actually working for people *right now* (Reddit, X, YouTube, Hacker News), then read your workspace, and only then plan. "Current best practice" + "how my files actually look" is what makes the plan fit.
→ Starter prompt: [[01-research-before-you-build]]

## 2. Stand on proven shoulders
Study four open-source memory projects before building — not to copy, but to steal the right ideas:
- **Karpathy's LLM wiki** — the foundation: plain markdown the agent writes itself, one small index read first. gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
- **qmd** (Tobi Lütke) — search by meaning, not just keywords. github.com/tobi/qmd
- **gbrain** (Garry Tan) — answers cite their sources; the brain cleans itself. github.com/garrytan/gbrain
- **Graphify** (YC-funded) — your notes already form a graph; use the links. github.com/safishamsi/graphify

→ Starter prompt: [[02-stand-on-proven-shoulders]]

## 3. Deterministic code before the model
Most of a memory lookup needs **zero intelligence** — so it should be plain code, not model calls. The ladder for every question:
1. Strip the question down to its keywords — filler words get discarded.
2. Score every possible source **without opening any of them** — using the index and file names alone.
3. Open only the top-scoring file — not three, not "just in case". One.
4. Read only the section that answers — not the whole document.
5. If that section just points somewhere else, follow the pointer once.
6. **Only then** does the model see anything — question plus evidence, answered in one go.

All of that runs in milliseconds because it's code, not model turns. The model is invoked exactly once, at the end.
→ Starter prompt: [[03-deterministic-retrieval]]

## 4. Keep a small index of everything
Scoring only works because the workspace keeps **indexes and reference maps** — one small catalogue file where every memory has a one-line entry, plus a map of which big doc owns which topic. That lets code judge "where would this answer live?" without reading anything.

If you build one habit, build this one: every new fact gets a file *and* a line in the catalogue, every time. An index that's always true is what keeps retrieval cheap forever.
→ Starter prompt: [[04-small-index-of-everything]]

## 5. Make it prove itself
Don't take the system's word for it — make the model test its own build: same questions through a fresh default session vs the second brain, compared with `/context` (token counts) and a clock. If the brain isn't clearly cheaper, keep optimising until it is.

Honest caveat from the tests: for facts already in your always-loaded index, default Claude is instantly fast — that's the index doing its job. The brain wins on the deep stuff: facts buried inside files, multi-file questions, and saving new memories.
→ Starter prompt: [[05-make-it-prove-itself]]

## Bonus: the /GOAL trick
Give the model a `/goal` with a hard pass-fail line and permission to keep working until it's met — it will test its own build, catch its own lag, and iterate without babysitting. Best for interactive parts (anything you click, drag or reload).
→ Sample prompts: [[goal-prompts]]

## Hank OS adaptation

Hank OS already implements Principle 4's spirit (`schema.md` + typed frontmatter + wikilinks) — the missing piece is a one-line-per-note catalogue file for cheap deterministic retrieval. Principle 3 matters doubly here: keeping retrieval in plain code (not model calls) also keeps student data off the cloud by default. Principle 5's test-it-yourself discipline applies directly to TaiGrader/XPScholar features too.
