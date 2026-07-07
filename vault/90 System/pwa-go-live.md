---
type: reference
---

# Phone PWA — go-live workflow (ready when you decide)

This turns Hank OS into a **real installable phone app** (fullscreen, offline shell, its own icon) instead of a home-screen bookmark. Nothing here changes your day-to-day dev setup — run it only when you want the phone upgrade. Prereqs already in place: manifest, icons, and a service worker (it only activates in a production build, which is what step 1 makes).

Why this is needed: a true PWA install requires a **secure context** (HTTPS). `localhost` counts (so desktop Chrome can already "Install"), but your phone hitting `http://192.168.1.191:5173` is plain HTTP, so Chrome won't offer a real install. Tailscale gives you HTTPS with a valid cert for free — that's the missing piece.

## Steps
1. **Build + run production** (serves the built app with the service worker active, on port 5175):
   ```
   cd "C:\Users\hball\Hank OS\dashboard"
   npm run prod
   ```
   Leave it running. (Re-run after pulling new features — see "How updates work" below.)

2. **Expose it over HTTPS with Tailscale** (Tailscale installed + signed in on the PC, per [[mobile-setup]]):
   ```
   tailscale serve 5175
   ```
   This publishes `https://<your-pc>.<tailnet>.ts.net` → localhost:5175 with a real certificate. Check it with `tailscale serve status`. (To stop: `tailscale serve --https=443 off`.)

3. **On the phone** (Tailscale app on + signed into the same account): open that `https://…ts.net` URL in Chrome → menu → **Install app / Add to Home Screen**. Now it installs as a true app — fullscreen, offline shell, real icon, works anywhere.

## How updates work (why we're on this path while still building)
- The installed app is a **thin shell** over the code on the PC — it is never re-installed. New features I add = you `git pull`, then `npm run prod` again to rebuild. The app icon picks up the new build on next open. No app-store, no reinstall.
- Desktop is even simpler: run the dev server and Chrome "Install" against `http://localhost:5173` — updates are live on refresh, no rebuild needed.
- This is exactly why we're NOT packaging a frozen Electron `.exe` yet: it would need a rebuild+reinstall every feature. Revisit Electron once the feature set settles.

Related: [[mobile-setup]] · [[connections]]
