---
type: asset
kind: file
url:
used-in: ["[[Book 5 - The AI Homework and Feedback Agent]]"]
---

# Book 5 — The AI Homework & Feedback Agent · Workbook Draft v1

`#draft` — forged by [[The Forge — Workbook]] on 2026-07-07 from the [[Book 5 - The AI Homework and Feedback Agent]] seed. Voice/format matched to [[Book 3 - The Build-an-Agent Workbook]] and Books 1–4. Print-ready target: **~18 pages**, delivered as PDF + [[AI Workbooks|Canva]]. This is the copy source for layout — not yet laid out.

> **Reviewer sign-off (assembler quality gate, 2026-07-07):** coherence ✅ · grade-fit ✅ · brand voice ✅ · **no student-identifiable data** ✅ (every worked example uses fake "Student A" work; Section 8 teaches the no-PII rule explicitly). Rated **ready for layout**, pending Hank's 3 open decisions (see product note).

## Governing page map (supersedes any inline page labels below)

| Page | Content |
|---|---|
| 1 | Cover / title (Canva) |
| 2–3 | §1 Why Build Your Own |
| 4–5 | §2 Agent Foundations |
| 6–8 | §3 Prompt Library — Homework Administration |
| 9–11 | §4 Prompt Library — Feedback & Grading |
| 12–13 | §5 Starter Project A — The 2-Minute Feedback Agent |
| 14–15 | §6 Starter Project B — The Rubric-to-Comments Agent |
| 16 | §7 Bridge to Real Tools ([[TaiGrader]] / [[XPScholar]]) |
| 17–18 | §8 Make It Yours + 🔒 Safety page |

Layout notes: fenced blocks = copy-paste prompt cards (tinted box in Canva); ☐ rows = checkboxes; "🛠️ Make it yours" blanks = fill-in fields. The Safety page (§8, p18) gets the strongest visual treatment — full-page, boxed, red/amber accent.

---

## §1 · Why Build Your Own

Most teachers meet AI through a locked consumer tool — Brisk, MagicSchool, the free tier of something a colleague swears by. Those tools are genuinely useful, and this book is not here to talk you out of them. But there's a ceiling you hit fast: the tool decides what it does, how it sounds, and where it stops. You fill in a box, it hands back a result, and if that result is 80% right you're stuck editing the other 20% every single time. Building your own agent flips that. You stop renting someone else's opinion about your classroom and start shaping a tool that already knows your rubric, your grade band, your voice, and your rules — before you type a word.

**What you're actually giving up with a locked tool**

- **Your rubric becomes their rubric.** Consumer tools grade to a generic standard. Yours is specific — and re-explaining it every session is the tax you pay for not owning the agent.
- **Your voice becomes their voice.** That polished, slightly corporate feedback tone? Students notice it isn't you. A custom agent writes in *your* register.
- **The workflow ends where they decided it ends.** You can't easily chain "generate the practice set → differentiate it three ways → build the answer key → draft the feedback comments" when each step lives in a different locked feature.
- **You can't see or fix the recipe.** When output drifts, you have no dial to turn. With your own agent definition, the "recipe" is text you wrote and can edit.

**What becomes possible when you own the agent**

- One reusable **agent definition** you paste once, then reuse all year — it remembers how you want things done.
- **Chained tasks** in a single conversation: assignment → differentiation → key → feedback bank, all consistent because the same agent did all four.
- **Your standards and your tone**, baked in, so the first draft already sounds like you.
- A tool you can **tune** the moment it drifts — change one line, not your whole workflow.
- A bridge to purpose-built grading tools like **TaiGrader** and **XPScholar** when you're ready to move from "chat prompts" to a real pipeline (covered later in this kit).

**A quick reality check on tools.** You'll build these agents inside **ChatGPT** or **Claude** — either works. Anywhere in this book you see a prompt block, paste it into whichever you use. The skills transfer; the prompts are written to be tool-neutral.

> **⚠ The one rule that never bends:** Never paste student-identifiable data — names, student IDs, emails, anything that points to a real kid — into any cloud AI tool. Use anonymized samples, made-up work, or initials only. Every prompt in this book is written so you never have to. We'll flag it again wherever real student work is in play.

**Fill-in 1.1 — What I want my agent to do that my current tools can't**

- The task my current tool does badly or not at all: `__________________________________`
- What I re-type or re-explain every single time: `__________________________________`
- The tone/voice problem I keep fixing by hand: `__________________________________`
- One workflow I wish ran end-to-end in one place: `__________________________________`
- If my agent could do ONE thing my current tool can't, it would be: `__________________________________`

☐ I've named at least one thing worth building my own agent for.

---

## §2 · Agent Foundations

An "agent" sounds technical, but for grading and feedback it's just a set of standing instructions you give the AI *once* so it behaves consistently every time after. Think of it like onboarding a very fast student teacher: you tell them their **Role**, hand them the **Rubric**, describe the **Voice** you want, and set the **Guardrails** they must never cross. Get those four right and everything downstream — every practice set, every comment, every answer key — comes out steadier and more like you. Get them vague and you'll spend your afternoon re-explaining yourself. This section builds all four, then hands you a reusable template you paste at the start of any grading conversation.

**The anatomy of a grading & feedback agent**

**1. Role — who the agent is.** Give it a job title and a subject, not just "help me grade." "You are an experienced 9th-grade biology teacher's grading assistant" makes the AI reach for the right vocabulary, difficulty, and assumptions. Include grade band, subject, and the kind of work it handles.

**2. Rubric — the standard it measures against.** This is the heart. The AI can't read your mind about what a 3-out-of-4 looks like, so you spell it out: the criteria, the levels, and what distinguishes them. Even a short rubric pasted in beats a vague "grade this fairly." If you have an official rubric, paste it. If not, the template below builds a lightweight one.

**3. Voice — how feedback sounds.** Decide the register before you need it: warm or neutral, brief or detailed, first-person ("I noticed…") or impersonal. Set the reading level for the *student* who receives it. Voice is what makes feedback feel like it came from you and not a machine.

**4. Guardrails — the lines it must not cross.** The non-negotiables. Top of the list, always: never request or use student-identifiable data. Then your pedagogy rules — e.g., "always name one strength before a critique," "never rewrite the student's work for them," "flag, don't fix."

**Reusable prompt — the Agent Definition template**

Paste this once at the start of a grading session, fill the brackets, and the agent holds these instructions for the whole conversation.

```
You are my grading and feedback agent. Follow this definition for
everything in this conversation until I say otherwise.

ROLE
You are an experienced [GRADE BAND] [SUBJECT] teacher's grading
assistant. You handle [TYPE OF WORK: e.g., short-answer responses,
lab write-ups, essays, problem sets].

RUBRIC
Grade against these criteria and levels:
- [CRITERION 1]: [what full marks looks like] → [what partial looks
  like] → [what missing looks like]
- [CRITERION 2]: [full] → [partial] → [missing]
- [CRITERION 3]: [full] → [partial] → [missing]
Scale: [e.g., 4-point / 0–10 / letter]. When unsure between two
levels, choose the lower and say what would move it up.

VOICE
- Tone: [warm and encouraging / neutral and direct / other]
- Length: [1–2 sentences per point / detailed paragraph]
- Person: [first person "I noticed…" / impersonal]
- Written for a student reading at: [grade/reading level]

GUARDRAILS (never break these)
- I will only ever give you ANONYMIZED or SAMPLE work. Never ask for
  or use student names, IDs, or any identifying detail.
- Always name at least one genuine strength before any critique.
- Point to what to fix and why; do NOT rewrite the work for the student.
- If work is missing context you need, say so instead of guessing.
- [YOUR OWN RULE]: __________

Confirm you understand this definition, then wait for me to paste work.
```

**Fill-in 2.1 — Define your agent**

- **Role** — grade band + subject + type of work: `__________________________________`
- **Rubric** — my top 3 criteria and what "full marks" looks like for each:
  1. `__________________________________`
  2. `__________________________________`
  3. `__________________________________`
- **Voice** — tone / length / person / student reading level: `__________________________________`
- **Guardrails** — my non-negotiables:
  ☐ Never use student-identifiable data (locked in)
  ☐ `__________________________________`
  ☐ `__________________________________`

☐ I've pasted my finished definition into a note I can reuse. This is my agent. Everything from here uses it.

---

## §3 · Prompt Library — Homework Administration

This is the part you'll come back to on a Sunday night. Below is a copy-paste bank for the *administration* side of homework — generating practice, differentiating it, building keys, scaffolding, and spinning up alternate versions to cut copying. Each block is ready to use: paste it under your agent definition from §2, fill the `[BRACKETS]`, and go. These prompts touch curriculum, not kids, so there's no student data involved — but keep the guardrail reflex sharp, because §4 does touch real work.

**3.1 — Generate a practice set**
```
Using my agent definition above, create a practice set on [TOPIC] for
[GRADE BAND] [SUBJECT].
- [NUMBER] questions, increasing in difficulty.
- Aligned to this objective/standard: [OBJECTIVE OR STANDARD].
- Mix of question types: [e.g., 4 multiple choice, 3 short answer,
  1 extended response].
- Keep it doable in about [MINUTES] minutes of homework.
Output as a clean, numbered worksheet I can paste into a doc.
```

**3.2 — Differentiate by level (three tiers at once)**
```
Take the practice set above and produce THREE versions of it:
- SUPPORT: same skills, simpler numbers/vocabulary, one scaffold or
  sentence starter per question.
- ON-LEVEL: as written.
- STRETCH: same topic, raised to [e.g., analysis/application], one
  challenge question added.
Keep the objective identical across all three so I can grade them
together. Label each version clearly.
```

**3.3 — Build the answer key with reasoning**
```
Create a full answer key for the practice set above.
- Give the correct answer AND a one-line explanation of the reasoning
  for each item.
- For anything with common wrong answers, note the likely mistake and
  what it tells me about the misconception.
Format as: Q# | Answer | Why | Common error to watch for.
```

**3.4 — Scaffold a hard task**
```
Students struggle with [SKILL OR TASK]. Break it into a scaffolded
version:
- Split it into [NUMBER] smaller steps in order.
- Add a worked example at the top showing the whole process once.
- Give a sentence starter or frame for the step students find hardest,
  which is usually [STEP].
Keep the end product the same as the original task.
```

**3.5 — Make alternate versions (anti-copying)**
```
Create [NUMBER] parallel versions of the practice set above that test
the exact same skills at the same difficulty, but with different
numbers/contexts/wording so students can't simply copy each other.
Label them Version A, B, C. Then give me a SINGLE combined answer key
that shows all versions side by side.
```

**3.6 — Convert content into homework format**
```
Here is source material: [PASTE LESSON NOTES / TEXT EXCERPT / TOPIC
SUMMARY].
Turn it into a homework assignment for [GRADE BAND] that:
- Reviews the key ideas without requiring the textbook.
- Includes [NUMBER] retrieval questions and [NUMBER] apply-it questions.
- Ends with one reflection prompt.
Note: this is my own curriculum material — no student work is involved.
```

**3.7 — Estimate time & load**
```
Review the assignment above and estimate realistic completion time for
a typical [GRADE BAND] student, question by question. Flag anything
that's secretly a 20-minute task disguised as a quick one. Suggest what
to cut if I need it under [MINUTES] minutes total.
```

**3.8 — Write clear student instructions + a mini-checklist**
```
Write the student-facing instructions for the assignment above:
- Plain language at a [GRADE/READING LEVEL].
- A "before you turn it in" checklist of [3–4] items.
- One line telling students how they'll be graded, based on my rubric.
```

**3.9 — Generate an extension / early-finisher task**
```
Create a short, optional extension for students who finish the
assignment above early. Same topic, genuinely more interesting (not
just "more of the same"), self-contained, no extra materials. Keep it
to about [MINUTES] minutes.
```

**3.10 — Standards alignment check**
```
Map the assignment above to this standard: [PASTE STANDARD]. For each
question, say which part of the standard it hits, and flag any part of
the standard the assignment does NOT yet cover so I can fill the gap.
```

**Fill-in 3.1 — Adapt one prompt to your next assignment**

- Prompt I'm adapting (number): `______`  Topic: `__________________`  Grade band: `__________`
- Objective / standard: `__________________________________`
- The bracket I most need to customize, filled in: `__________________________________`
- One line I'm adding to make it fit MY class: `__________________________________`

☐ I pasted my agent definition + this adapted prompt and got usable output.

---

## §4 · Prompt Library — Feedback & Grading

Feedback is where a custom agent earns its keep — and where the data rule matters most, because now you're working with real student work. So before the prompt bank, the reflex: **strip identity first.** Change names to initials or "Student A." Remove IDs, emails, and any detail that fingerprints a kid. Better yet, paste the *anonymized text of the response only*. The agent grades the writing, not the writer — it never needs to know who wrote it.

> **⚠ Before every prompt in this section:** Anonymize. Initials or "Student A" only. No names, no IDs, no PII into the AI. If you wouldn't post it on the staffroom wall, don't paste it into the cloud.

**4.1 — Rubric-to-feedback (single response)**
```
Using my agent definition and rubric above, grade this ANONYMIZED
student response. It contains no identifying information.

RESPONSE:
[PASTE ANONYMIZED WORK]

Return:
- A score per rubric criterion, with a one-line justification each.
- One genuine strength.
- The single most important thing to improve, and how.
Do not rewrite the work for the student.
```

**4.2 — The Tone Dial**
```
Give the feedback above at TONE DIAL = [1–5], where:
1 = strictly neutral, clinical, facts only
2 = plain and direct, minimal warmth
3 = balanced: supportive but honest (default)
4 = warm and encouraging, gentle on the critique
5 = highly encouraging, confidence-building, for a discouraged student
Keep the substance and the score identical — only the tone changes.
```

**4.3 — Comment Bank Generator (class-wide)**
```
Based on my rubric above, generate a reusable COMMENT BANK for this
assignment on [TOPIC]. For each rubric criterion, write:
- 2 comments for STRONG work
- 2 comments for DEVELOPING work
- 2 comments for work that MISSES the mark
Rules: each comment 1–2 sentences, in my agent's voice, addressed to
"you," specific enough to be useful but general enough to reuse across
students. No names or placeholders for names.
Output as a labeled list I can copy from while grading.
```

**4.4 — Consistency check across a batch**
```
Here are [NUMBER] anonymized responses labeled Student A, B, C…
Grade them all against my rubric, then give me a consistency table:
Student | Score per criterion | Total | One-line rationale.
After the table, flag any two responses where a reader might question
why they got different scores, and explain the deciding difference.
```

**4.5 — Strength-first sandwich (guardrail-built)**
```
For this anonymized response, write feedback in exactly this shape:
1. A specific strength (name what they did, not just "good job").
2. The one change that matters most, with a concrete next step.
3. A forward-looking encouragement tied to that next step.
Three short paragraphs, my agent's voice, TONE DIAL = [1–5].
```

**4.6 — Turn a score into student-facing feedback**
```
This anonymized response scored [SCORES PER CRITERION] on my rubric.
Translate that into feedback the student can actually act on:
- Explain WHY it landed there in plain [READING LEVEL] language.
- Give 2 specific, doable next steps.
- End with what a higher score would look like next time.
Don't restate the rubric jargon — make it human.
```

**4.7 — Misconception spotter**
```
Read these anonymized responses (Student A, B, C…). Don't grade them —
instead identify the TOP 3 misconceptions or recurring errors across
the group. For each: name it, quote a short anonymized example, and
suggest one reteach move.
```

**4.8 — Feedback length control**
```
Take the feedback above and give me three versions:
- MARGIN NOTE: one sentence.
- STANDARD: 2–3 sentences.
- CONFERENCE: a short paragraph I'd use in a one-on-one.
Same message and score across all three — just different depth.
```

**4.9 — Draft a rubric from exemplars**
```
Here are anonymized examples of strong, middle, and weak work for
[TASK]. Reverse-engineer a [3–4]-criterion rubric that distinguishes
them, with a description of each level. No student identifiers are present.
```

**4.10 — Self-check my own consistency**
```
Here is an anonymized response and the feedback I already wrote for it:
RESPONSE: [PASTE]   MY FEEDBACK: [PASTE]
Against my rubric, tell me: is my score defensible? Is my tone
consistent with TONE DIAL [1–5]? Did I name a strength and one clear
next step? Suggest a tightened version only if mine breaks a guardrail.
```

**Fill-in 4.1 — Build your own 5-comment starter bank** (keep them name-free so they're reusable)

Assignment/topic: `__________________________________`
1. STRONG-work comment: `__________________________________`
2. STRONG-work comment: `__________________________________`
3. DEVELOPING-work comment: `__________________________________`
4. MISSES-the-mark comment (strength-first): `__________________________________`
5. Encouragement / next-step comment: `__________________________________`

My Tone Dial default for this class (1–5): `____`
☐ I anonymize before pasting any real student work.  ☐ These five comments are saved where I grade.

---

## §5 · Starter Project A — The 2-Minute Feedback Agent

**What you're building:** a reusable "agent" — really a saved, well-structured prompt — that takes **one piece of anonymized student work plus your rubric** and hands back targeted, kind, specific feedback in under two minutes. Build it once tonight; use it all year.

> ⚠️ **Safety first (we mean it):** No student names, IDs, emails, or anything that identifies a real kid goes into the box. Use a sample, a made-up name, or initials only. The full anonymizing routine is on the Safety page (§8) — read it before your first real run.

**Build it in 5 steps**
1. **Open a fresh chat** (ChatGPT or Claude). A clean thread keeps the agent from "remembering" the last kid's work.
2. **Paste the agent prompt** (below). You're teaching the AI *who to be* and *what to give back*.
3. **Fill the three brackets** at the bottom: subject/grade, rubric, anonymized work.
4. **Send it.** Read what comes back against your own judgment — you're the teacher; the agent is the intern.
5. **Save it.** Name the chat "⚡ 2-Min Feedback Agent" and pin it, or copy the prompt into a note. That saved block *is* your agent.

☐ Fresh chat  ☐ Pasted the agent prompt  ☐ Filled three brackets with anonymized work  ☐ Saved/named the agent

**The paste-in agent prompt**
```
You are my feedback assistant for [SUBJECT + GRADE].
You give feedback the way a supportive, specific teacher does.

Rules:
- Base every comment ONLY on the rubric I give you. Do not invent new criteria.
- Return feedback addressed TO the student ("you"), warm but honest.
- Be specific: quote or point to the exact spot in the work.
- No grade or score unless I ask. Feedback only.
- Keep it usable: a student should know exactly what to do next.

Return in this format:
1. GLOW — 2 things done well, tied to the rubric.
2. GROW — 2 things to improve, each with a concrete next step.
3. ONE NEXT MOVE — the single most important fix, in one sentence.

Here is the rubric:
[PASTE RUBRIC]

Here is the student work (anonymized — no real names):
[PASTE ANONYMIZED WORK]
```

**Worked example** (100% fake student — sample work, not a real child)

- **Subject + grade:** 7th-grade English, paragraph writing
- **Rubric:** Claim (0–3) · Evidence (0–3) · Explanation (0–3) · Conventions (0–3)
- **Anonymized work ("Student A"):** *"I think the wolf in the story was not really the bad guy. In the book it says he was hungry and cold. That is why he went to the houses. People just thought he was scary because he was big."*

*Agent returned:*
> **GLOW** — You made a clear claim right away ("the wolf was not really the bad guy") — that nails the Claim criterion. You pulled real evidence from the text ("he was hungry and cold") — exactly the specific detail the rubric asks for.
> **GROW** — Your explanation is thin: you give the evidence but don't connect it back to *why* that makes him not the bad guy. Next step: add a sentence starting "This shows the wolf was…". Watch conventions — the ideas run together; read it aloud and check each sentence stands on its own.
> **ONE NEXT MOVE** — Add one "this shows…" sentence after your evidence so the reader sees how it proves your claim.

No score (you didn't ask), every comment ties to *your* rubric, written to the student. Two minutes, done.

**🛠️ Make it yours**
- My subject + grade: `__________________________`
- One rubric I use a lot (criteria): `__________________________`
- One thing I want the agent to ALWAYS do: `__________________________`
- One thing I want it to NEVER do: `__________________________`

Add your "always/never" lines into the **Rules** section of the prompt — that's how the agent starts to sound like *you*.

---

## §6 · Starter Project B — The Rubric-to-Comments Agent

**What you're building:** a **comment-bank generator.** Feed it a rubric once; it produces a reusable bank of glow/grow comments for every level of every criterion — standards-aligned, in your voice. Where Project A gives feedback on *one* piece of work, Project B builds the **library** you reach into all semester.

> ⚠️ Same rule — but the rubric and standards are safe to paste, and **real student work isn't needed here at all.** This agent works from your rubric alone, which makes it the safest tool in the kit.

**Build it in 5 steps**
1. Fresh chat (ChatGPT or Claude).
2. Paste the generator prompt below.
3. Drop in your rubric and (optional) standard codes.
4. Send, then skim — cut any comment that doesn't sound like you; ask for "5 more, warmer" or "shorter."
5. **Save the OUTPUT**, not just the prompt — copy the bank into a doc titled "[Unit] Comment Bank."

☐ Fresh chat  ☐ Generator prompt pasted  ☐ Rubric + standards dropped in  ☐ Output saved as a named comment bank

**The paste-in generator prompt**
```
You are my comment-bank builder for [SUBJECT + GRADE].
Turn my rubric into a reusable bank of student-facing comments.

For EACH criterion in the rubric, write:
- 2 GLOW comments (for work that meets/exceeds it)
- 2 GROW comments (for work that's approaching/below it),
  each ending with a concrete next step.

Rules:
- Address the student as "you." Warm, specific, plain language.
- Tie each comment to the criterion (and the standard code if I give one).
- Keep each comment to 1–2 sentences so I can paste it as-is.
- Vary the wording so they don't all sound identical.

Here is the rubric (and standards, if any):
[PASTE RUBRIC + STANDARD CODES]
```

**Worked example** — 5th-grade science, lab report · Hypothesis / Data / Conclusion (NGSS 3-5)

*Agent returned (excerpt):*
> **Hypothesis** — *Glow:* You wrote a clear, testable "if/then" prediction — exactly what a strong hypothesis needs. *Grow:* Your hypothesis states an opinion but isn't testable yet — rewrite it as "If I ___, then ___ will happen."
> **Data** — *Glow:* Your results are organized in a clear table — easy to read and compare. *Grow:* Some measurements are missing units — add the unit (cm, mL, sec) to each number.
> **Conclusion** — *Glow:* You clearly stated whether your hypothesis was supported and pointed to your data. *Grow:* Your conclusion says what happened but not whether it matched your hypothesis — start with "My hypothesis was / was not supported because…".

Skim it, cut two, keep ten — a semester's worth of comments in three minutes, zero student data involved.

**🛠️ Make it yours**
- The rubric I'll turn into a bank first: `__________________________`
- My standard/framework codes (NGSS, CCSS, state, IB…): `__________________________`
- My voice in one line — gentle / direct / playful / formal / `__________`
- A sentence starter I always give kids: `__________________________`
- I'll save the bank as: "`__________________________` Comment Bank"

**Pro move:** Ask the agent, *"Now add a 'GLOW+' tier for work that exceeds the criterion."* Instant differentiation for your high flyers.

---

## §7 · Bridge to Real Tools

The two agents you just built are perfect for **flexibility and low volume**: one paper, one rubric, on your own terms. But when the stack gets tall, or you want grading, tracking, and consistency at scale, a purpose-built app does in one click what a chat prompt makes you babysit.

| Situation | DIY your own agent (§5 & §6) | Use a purpose-built app |
|---|---|---|
| **Volume** | A few pieces at a time | A whole class set or several sections |
| **Consistency** | You re-check each run | Same rubric applied identically every time |
| **Setup** | Zero — paste and go | A little setup, then automatic |
| **Tracking over time** | You keep your own notes | Scores/progress logged for you |
| **Novel / one-off task** | ✅ Best choice — infinitely flexible | Overkill |
| **Repeatable grading at scale** | Tedious, error-prone by hand | ✅ Best choice |
| **Standards-aligned reporting** | Manual | Built in |

**Rule of thumb:** DIY when the task is new, small, or you're experimenting. Reach for an app when it's repeatable, high-volume, or needs tracking.

**The hand-off:**
- **[[TaiGrader]] — grading at scale.** When it's a full class set against one rubric, TaiGrader applies your criteria consistently across every submission — the natural next step once §5 starts feeling repetitive. *Same privacy rules always apply — anonymize before anything leaves your machine.*
- **[[XPScholar]] — student-facing practice & growth.** Where your feedback agent tells a student what to fix, XPScholar turns that into ongoing, gamified practice so the *grow* actually gets worked on.

**The intended workflow:** DIY-prototype a feedback style you like in ChatGPT/Claude → let **TaiGrader** run it across the whole class → push growth areas into **XPScholar** for practice. Prototype small, scale with the tool.

**🛠️ My workflow: what I'll DIY vs. hand off**

| My recurring task | Volume (low/high) | DIY or hand off? | Which tool? |
|---|---|---|---|
| `________________` | `______` | `______` | `______` |
| `________________` | `______` | `______` | `______` |
| `________________` | `______` | `______` | `______` |

- The task that eats the most of my weekend: `__________________________`
- The first thing I'll hand off to an app instead of doing by hand: `__________________________`

---

## §8 · Make It Yours + 🔒 Safety

**Customization patterns that work**
- **Add a persona line.** "You give feedback like a patient teacher who never discourages."
- **Pin the format.** If you liked GLOW/GROW/NEXT MOVE, keep it verbatim — consistency is a feature.
- **Set a reading level.** "Write feedback a 4th grader can read." Or "keep comments under 20 words."
- **Bake in your standards.** Paste standard codes into the Rules so every comment references them.
- **Add an always/never pair.** Always: reference the rubric. Never: rewrite the work *for* the student.
- **Ask for more, not different.** "5 more, gentler" beats starting over.

**Prompt-tuning worksheet: TRY → CHECK → REFINE** (run the loop 3×)

- **R1** — TRY: `____________` · CHECK (too generic/harsh/wrong format/ignored rubric): `____________` · REFINE (one line to change): `____________`
- **R2** — TRY: `____________` · CHECK: `____________` · REFINE: `____________`
- **R3** — TRY: `____________` · CHECK: `____________` · REFINE: `____________`

☐ My agent now sounds like me  ☐ It respects my rubric every time  ☐ I saved the final version

### 🔒 SAFETY — Read this before every real run

> **Never put student-identifiable data into a cloud AI call. Ever.**

ChatGPT and Claude run on servers you don't control. Anything you paste leaves your classroom. That's fine for standards and sample work — **never** fine for a real, identifiable child.

**NOT safe to paste:** ❌ student first + last names (or a full name in the work) · ❌ IDs, lunch numbers, logins, emails, phone numbers · ❌ anything that singles out one real kid (medical/IEP details, home situations) · ❌ photos/scans showing a name or face · ❌ a whole roster or gradebook.

**Safe to paste:** ✅ your rubrics and criteria · ✅ standards, unit plans, objectives, standard codes · ✅ **sample or anonymized** student work (names stripped) · ✅ made-up examples · ✅ lesson materials and assignment sheets.

**Anonymize in 15 seconds:** (1) strip the name → "Student A" or initials; (2) scrub the body of any name/school/teacher/place the student wrote; (3) remove ID-anything; (4) one kid = one letter (A/B/C, not real initials); (5) sanity check — *could a stranger figure out which real child this is?* If yes, keep scrubbing.

**30-second checklist (every time):** ☐ No first + last names · ☐ No IDs, logins, or emails · ☐ No names inside the writing itself · ☐ Nothing that identifies one real child · ☐ I'm pasting a rubric, a standard, or anonymized/sample work — nothing else.

> **When in doubt, leave it out.** If you can't anonymize it safely, do that task by hand.

**🛠️ My agent tune-up worksheet**
- My agent's name: `__________________________`
- Subject + grade it serves: `__________________________`
- Its persona (one line): `__________________________`
- Format I always want back: `__________________________`
- Reading level / length rule: `__________________________`
- Standards it should reference: `__________________________`
- ALWAYS do: `__________________________`  · NEVER do: `__________________________`
- My anonymizing habit before every run: `__________________________`
- Where I saved the final prompt: `__________________________`

**Tune-up schedule:** ☐ I'll revisit this agent after `______` and run one more TRY → CHECK → REFINE round.

---

*You built two working agents, learned when to scale up to [[TaiGrader]] and [[XPScholar]], and locked in the one safety rule that protects your students. That's a real system — go use it.*

Related: [[Book 5 - The AI Homework and Feedback Agent]] · [[AI Workbooks]] · [[The Forge — Workbook]]
