# Channel Points Auto Claimer for Twitch

A lightweight Chrome/Edge extension (Manifest V3) that automatically claims the channel points bonus chest on Twitch.

Not affiliated with or endorsed by Twitch.

## Features

- Clicks the "Claim Bonus" chest shortly after it appears (0.5–2s random delay)
- Works in background tabs and across Twitch's in-page navigation
- Popup with on/off toggle, total claims, last claim time, and per-channel counts
- Toolbar badge showing the claim count
- No data collection — everything is stored locally in your browser; only permission is `storage`

## Install (unpacked)

1. Clone or download this repo.
2. Open `chrome://extensions` (Chrome) or `edge://extensions` (Edge).
3. Enable **Developer mode**.
4. Click **Load unpacked** and select this folder.
5. Refresh any open Twitch tabs.

## Troubleshooting

If it stops claiming, Twitch may have changed its markup. Inspect the chest button and update the `SELECTORS` list at the top of `content.js`.

Keep the stream tab from being put to sleep (add twitch.tv to Edge's sleeping tabs / Chrome's Memory Saver exceptions).
