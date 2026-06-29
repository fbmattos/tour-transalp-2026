# Event landscape photos

Add 3–5 high-quality landscape JPEGs here for the dashboard "Moments" banner and About gallery.

## Naming

| File | Role |
|------|------|
| `moment-01.jpg` | Featured photo (shown first; used for link previews) |
| `moment-02.jpg` | Additional landscape |
| `moment-03.jpg` | Additional landscape |
| `moment-04.jpg` | Optional |
| `moment-05.jpg` | Optional |

## Captions and alt text

Edit `manifest.json` in this folder to set each photo's alt text and optional caption:

```json
{
  "moment-01.jpg": {
    "alt": "Alpine landscape along the Tour Transalp route",
    "caption": "Across the Alps"
  },
  "moment-02.jpg": {
    "alt": "Mountain scenery from the Tour Transalp",
    "caption": "On the road"
  }
}
```

Omit `caption` for photos that should not show overlay text. Photos are shown in filename order.

## Tips

- Landscape orientation works best (wide Alps scenery).
- Export at ~1600px wide, JPEG quality ~80 — keeps page load fast.
- Commit with: `git add public/images/event/ && git commit -m "Add event landscape photos"`
