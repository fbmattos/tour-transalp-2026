import React, { useEffect, useMemo, useState } from "react";
import type { StageWithGpx } from "../hooks/useGpxStages";

type StageVideoManifest = Record<string, string | null | undefined>;

interface Props {
  stage: StageWithGpx;
}

const youtubeIdPatterns = [
  /youtube\.com\/shorts\/([^?&/]+)/i,
  /youtube\.com\/watch\?v=([^?&/]+)/i,
  /youtu\.be\/([^?&/]+)/i,
  /youtube\.com\/embed\/([^?&/]+)/i,
];

const getYouTubeVideoId = (url: string) => {
  for (const pattern of youtubeIdPatterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
};

const getYouTubeEmbedUrl = (url: string) => {
  const videoId = getYouTubeVideoId(url);

  if (!videoId) {
    return null;
  }

  return `https://www.youtube.com/embed/${videoId}`;
};

export const StageVideos: React.FC<Props> = ({ stage }) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    let isMounted = true;

    const loadVideo = async () => {
      if (typeof fetch !== "function") {
        setStatus("ready");
        setVideoUrl(null);
        return;
      }

      try {
        const response = await fetch("/videos/manifest.json", {
          cache: "no-cache",
        });
        if (!response.ok) {
          throw new Error(`Video manifest request failed: ${response.status}`);
        }

        const manifest = (await response.json()) as StageVideoManifest;
        if (!isMounted) return;

        setVideoUrl(manifest[stage.id] ?? null);
        setStatus("ready");
      } catch {
        if (!isMounted) return;
        setVideoUrl(null);
        setStatus("error");
      }
    };

    loadVideo();

    return () => {
      isMounted = false;
    };
  }, [stage.id]);

  const embedUrl = useMemo(
    () => (videoUrl ? getYouTubeEmbedUrl(videoUrl) : null),
    [videoUrl],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300/80">
          Stage Video
        </p>
        <h3 className="mt-1 text-lg font-black text-white">
          Instagram story short
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-white/55">
          Add one YouTube Short URL per stage in{" "}
          <code className="rounded bg-white/10 px-1 py-0.5 text-white/75">
            public/videos/manifest.json
          </code>
          . The player is sized for vertical 9:16 story footage.
        </p>
      </div>

      {status === "loading" && (
        <p className="text-sm text-white/45">Loading video…</p>
      )}

      {status === "error" && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3">
          <p className="text-sm text-white/70">
            Could not load the video manifest.
          </p>
        </div>
      )}

      {status === "ready" && !videoUrl && (
        <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-4 text-center">
          <p className="text-sm font-semibold text-white/75">
            No video added for Stage {stage.stageNumber} yet.
          </p>
          <p className="mt-1 text-xs text-white/45">
            Add this stage&apos;s YouTube Short URL to the video manifest.
          </p>
        </div>
      )}

      {status === "ready" && videoUrl && !embedUrl && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3">
          <p className="text-sm text-white/70">
            This stage&apos;s video URL is not a supported YouTube link.
          </p>
        </div>
      )}

      {embedUrl && (
        <figure className="mx-auto w-full max-w-xs overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl shadow-black/30">
          <div className="aspect-[9/16] w-full bg-black">
            <iframe
              className="h-full w-full"
              src={embedUrl}
              title={`Stage ${stage.stageNumber} YouTube Short`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <figcaption className="px-3 py-2 text-xs text-white/55">
            Stage {stage.stageNumber} video
          </figcaption>
        </figure>
      )}
    </div>
  );
};
