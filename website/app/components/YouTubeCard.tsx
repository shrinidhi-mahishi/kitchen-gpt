import type { YouTubeVideo } from "../lib/api";

export default function YouTubeCard({ video }: { video: YouTubeVideo }) {
  return (
    <a
      href={video.video_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-72 shrink-0 overflow-hidden rounded-2xl border border-[#222] bg-[#111] transition hover:border-[#444]"
    >
      <div className="relative">
        {video.thumbnail_url ? (
          <img
            src={video.thumbnail_url}
            alt={video.title}
            className="h-40 w-full object-cover"
          />
        ) : (
          <div className="flex h-40 w-full items-center justify-center bg-[#1a1a1a] text-4xl">
            ▶
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-red-600 text-lg text-white shadow-lg">
            ▶
          </div>
        </div>
      </div>
      <div className="p-3">
        <p className="line-clamp-2 text-sm font-semibold">{video.title}</p>
        {video.channel && (
          <p className="mt-1 text-xs text-[#9E9E9E]">{video.channel}</p>
        )}
      </div>
    </a>
  );
}
