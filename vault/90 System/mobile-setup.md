---
type: reference
---

# Mobile Setup — Hank OS on your phone

Two ways to reach the dashboard from your phone. Notes you make on either save straight to the vault on the PC and push to GitHub, so they're cloud-backed even when the PC sleeps. Both need the **PC powered on with the dashboard running** (`npm run dev` in `dashboard/`, or the `hank-os-dashboard` launch config).

## Option 1 — At home (2 minutes, works today)
1. Phone on the same home WiFi as the PC.
2. Open Chrome (or Safari) → go to **http://192.168.1.191:5173**
   *(that's the PC's home-WiFi address; if it ever stops working, run `ipconfig` on the PC and use the new "IPv4 Address", or check the Connections tab → Connect your phone, which always shows the live one.)*
3. Browser menu → **Add to Home Screen**. Hank OS gets an app icon — full dashboard, notes, voice, all of it.

## Option 2 — From anywhere (Tailscale, ~10 min, one-time)
Tailscale is a free encrypted tunnel between your own devices. No router setup, nothing exposed to the public internet.

1. **On the PC:** download + install from https://tailscale.com/download → sign in (Google account is fine) → leave it running.
2. **On the phone:** install the **Tailscale** app from the App Store / Play Store → sign in with the **same account**.
3. On the PC, open the Tailscale app and note its address — it looks like **100.x.x.x** (or a name like `hank-pc.tail****.ts.net`).
4. On the phone (Tailscale toggled on), open **http://100.x.x.x:5173** → Add to Home Screen.
5. Now it works from anywhere your phone has internet — school, cellular, coffee shop. The PC just has to be on.
   *(The Connections tab → Connect your phone shows the live Tailscale address once step 1 is done.)*

## Good to know
- **Notes are already cloud-safe.** Every note is a `.md` file that auto-pushes to the private GitHub repo — backed up even when the PC is off. Mobile access is only about reaching the *live app*.
- **PC must be on** for both options. True PC-off access needs deploying to an always-on cloud box (the future n8n box); doing that, the vault features travel but Drive sources / file-convert / Claude-launch stay tied to the PC.
- **Phone can:** create + edit notes (Notes tab / ✚ / 🎤 voice), view the galaxy, ask your brain, see Finance & Health. Voice capture works in Chrome on Android.
- If "Blocked request" ever appears over Tailscale, it's a hostname allowlist thing — use the numeric **100.x.x.x** address instead of the `.ts.net` name (already handled, but the IP always works).

Related: [[connections]] · the Connect-your-phone panel lives in the dashboard's Connections tab.
