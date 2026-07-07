---
type: reference
---

# Auto-start — Hank OS always running

The dashboard server now starts automatically, hidden (no terminal window), every time you log into this PC. So Hank OS is always on: open `http://localhost:5173` on the PC anytime, and your phone can reach it whenever the PC is on — no manual `npm run dev`.

## How it's set up
- Launcher: `dashboard/hankos-autostart.vbs` (in the repo) runs `npm run dev` hidden.
- A copy named `HankOS.vbs` sits in the Windows Startup folder, which runs it at login.
- Open that folder anytime: Win+R → type `shell:startup` → Enter.

## Turn it OFF
Delete `HankOS.vbs` from the Startup folder (`shell:startup`). That's the only change — nothing else is affected. To turn it back on, copy `dashboard/hankos-autostart.vbs` back there as `HankOS.vbs`.

## Notes
- Runs in **dev mode** on ports 5173 (app) + 5175 (API) — matches every address in [[mobile-setup]] and the Connections panel. New features go live on refresh after a `git pull`; no rebuild needed.
- To start it right now without logging out: Win+R → `shell:startup` → double-click `HankOS.vbs`.
- If a port's already in use (you started it manually), the launcher just no-ops — harmless.
- This is the always-on convenience path. The separate production/HTTPS path for a true phone PWA is [[pwa-go-live]].

Related: [[mobile-setup]] · [[pwa-go-live]]
