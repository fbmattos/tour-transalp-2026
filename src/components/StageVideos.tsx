import React, { useEffect, useState } from "react";
import type { StageWithGpx } from "../hooks/useGpxStages";

interface StageVideoEntry {
  src: string;
  title?: string;
  poster?: string;
}

type StageVideoManifest = Record<string, Array<string | StageVideoEntry>>;

interface Props {
  stage: StageWithGpx;
}

const normalizeVideo = (entry: string | StageVideoEntry): StageVideoEntry => {
  if (typeof entry === "string") {
    return { src: entry };
  }

  return entry;
};

const videoUrl = (stageId: string, src: string) => {
  if (
    src.startsWith("/") ||
    src.startsWith("http://") ||
    src.startsWith("https://")
  ) {
    return src;
  }

  return `/videos/${stageId}/${src}`;
};

export const StageVideos: React.FC<Props> = ({ stage }) => {
  const [videos, setVideos] = useState<StageVideoEntry[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    let isMounted = true;

    const loadVideos = async () => {
      if (typeof fetch !== "function") {
        setStatus("ready");
        setVideos([]);
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

        setVideos((manifest[stage.id] ?? []).map(normalizeVideo));
        setStatus("ready");
      } catch {
        if (!isMounted) return;
        setVideos([]);
        setStatus("error");
      }
    };

    loadVideos();

    return () => {
      isMounted = false;
    };
  }, [stage.id]);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300/80">
          Stage Videos
        </p>
        <h3 className="mt-1 text-lg font-black text-white">
          Instagram story clips
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-white/55">
          Add vertical 9:16 clips to{" "}
          <code className="rounded bg-white/10 px-1 py-0.5 text-white/75">
            public/videos/{stage.id}
          </code>{" "}
          and list the filenames in{" "}
          <code className="rounded bg-white/10 px-1 py-0.5 text-white/75">
            public/videos/manifest.json
          </code>
          . H.264/AAC MP4 is the safest browser format if HEVC story exports do
          not play everywhere.
        </p>
      </div>

      {status === "loading" && (
        <p className="text-sm text-white/45">Loading videos…</p>
      )}

      {status === "error" && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3">
          <p className="text-sm text-white/70">
            Could not load the video manifest.
          </p>
        </div>
      )}

      {status === "ready" && videos.length === 0 && (
        <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-4 text-center">
          <p className="text-sm font-semibold text-white/75">
            No videos added for Stage {stage.stageNumber} yet.
          </p>
          <p className="mt-1 text-xs text-white/45">
            Drop about six story clips into this stage folder, then add them to
            the manifest.
          </p>
        </div>
      )}

      {videos.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {videos.map((video, index) => (
            <figure
              key={`${video.src}-${index}`}
              className="overflow-hidden rounded-xl border border-white/10 bg-black/30"
            >
              <video
                className="aspect-[9/16] w-full bg-black object-cover"
                controls
                playsInline
                preload="metadata"
                poster={video.poster}
              >
                <source src={videoUrl(stage.id, video.src)} />
                Your browser does not support this video format.
              </video>
              <figcaption className="px-3 py-2 text-xs text-white/55">
                {video.title ?? `Stage ${stage.stageNumber} clip ${index + 1}`}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
};
