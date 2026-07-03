import React, { useEffect, useMemo, useState } from "react";
import type { StageWithGpx } from "../hooks/useGpxStages";
import { assetBase } from "../data/activeTrip";

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
        const response = await fetch(`${assetBase}/videos/manifest.json`, {
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
        <div className="mx-auto aspect-[9/16] w-full max-w-xs overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl shadow-black/30">
          <iframe
            className="h-full w-full"
            src={embedUrl}
            title={`Stage ${stage.stageNumber} YouTube Short`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
};
