# Stage videos

Recommended tab name: **Videos**.

Place short, vertical Instagram Story exports in the stage folder that matches the route day:

```text
public/videos/
  manifest.json
  stage-1/
    01-start.mp4
    02-climb.mp4
  stage-2/
    01-start.mp4
  ...
  stage-7/
```

After adding files, list them in `manifest.json` so the static Vite app can discover them. Browsers cannot reliably enumerate a deployed `public` directory.

Instagram Story downloads may be HEVC/H.265. For best browser support, prefer H.264/AAC `.mp4` files when possible. If a HEVC file does not play in Chrome/Firefox, convert it before adding it here.
