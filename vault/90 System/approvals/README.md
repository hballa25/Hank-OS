---
type: reference
---

# Approvals & results feed

The queue [[The Forge]] writes to and the dashboard's Automations / Approval-inbox tab reads from. One file per pending item: `YYYY-MM-DD-HHMM <job> <slug>.md`.

Item frontmatter:
```yaml
type: approval
job:            # workbook | app-copilot | lesson | trader | chef
status: pending | approved | rejected | done
gate: review | money      # 'money' = needs the one-button human confirm; 'review' = FYI, already finalized
draft: "[[Note the Forge produced]]"
cost:                      # populated when gate: money — what would be spent
```

Body: a short human summary + a preview link. When `gate: money`, nothing is spent until Hank approves in the dashboard. When `gate: review`, the output is already finalized (auto, post quality-gate) and this is just a notification that rolls into the morning [[The Briefing]].

Related: [[automation-spine]] · [[The Forge]] · [[The Briefing]]
