# Prompts Library — Index

Prompt content migrated from two PDFs on 2026-07-06. Each file carries `type: prompt` frontmatter with `source` and `use-for`, the original prompt text verbatim, and a short "Hank OS adaptation" note.

## jarvis-pack/ — Build Your Own JARVIS (Zubair Trabzada, AI Workshop)

Six-prompt sequence that builds a talking 3D second brain with Claude Code. Run in order, test each before the next.

- [[01-the-galaxy]] — Build a cinematic 3D knowledge galaxy viewer from a folder of markdown notes.
- [[02-the-brain]] — Add a /chat endpoint that answers questions from your own notes via the Anthropic API (key stays server-side).
- [[03-the-voice]] — Free browser voice in both directions: spoken answers + mic input via the Web Speech API.
- [[04-fly-to-source]] — Camera flies to and highlights the source note(s) behind every answer.
- [[05-the-personality]] — Dry British-butler persona, one-witty-line answers, boot greeting with real note count.
- [[06-total-recall]] — "Remember that…" voice capture writes a real markdown note and births a new node live in the graph.

## second-brain/ — Build Your Own Second Brain (Jay E, RoboNuggets)

Five principles + starter prompts for having Claude Code build a memory system fitted to *your* workspace (it interviews you first).

- [[principles]] — All five core principles in one note: research first, steal from proven projects, deterministic code before the model, keep a small index of everything, make it prove itself — plus the /GOAL trick.
- [[01-research-before-you-build]] — Research current second-brain practice, scan the workspace, plan, then ask 3+ questions before building.
- [[02-stand-on-proven-shoulders]] — Study Karpathy's LLM wiki, qmd, gbrain, and Graphify; steal ideas, don't copy wholesale.
- [[03-deterministic-retrieval]] — Retrieval as plain code (keywords → index scoring → one file → one section), model called exactly once at the end; plus a no-model save-memory command.
- [[04-small-index-of-everything]] — One-line-per-memory catalogue that auto-updates on save, with a "check index first" routing rule in CLAUDE.md.
- [[05-make-it-prove-itself]] — Fair benchmark of the brain vs a default session on tokens (/context), wall time, and correctness.
- [[goal-prompts]] — Three sample /goal prompts with hard pass-fail lines and self-verification for interactive/performance work.
