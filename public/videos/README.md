# Stage video manifest

Recommended tab name: **Video**.

Each stage supports one vertical 9:16 YouTube Short. Add or update the stage's URL in `manifest.json`:

```json
{
  "stage-1": "https://youtube.com/shorts/example-id",
  "stage-2": null
}
```

Use `null` for stages that do not have a video yet. The app converts supported YouTube Short, watch, share, and embed URLs into an embeddable player inside the stage tab.
