import type { YouTubeVideo } from "../lib/api";

export default function YouTubeCard({ video }: { video: YouTubeVideo }) {
  return (
    <a
      href={video.video_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-72 shrink-0 rounded-2xl bg-[#111] border border-[#222] overflow-hidden hover:border-[#333] transition"
    >
      <div className="relative">
        {video.thumbnail_url ? (
          <img
            src={video.thumbnail_url}
            alt={video.title}
            className="w-full h-40 object-cover"
          />
        ) : (
          <div className="w-full h-40 bg-[#1a1a1a] flex items-center justify-center">
            <span className="text-4xl">▶️</span>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-10 bg-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">▶</span>
          </div>
        </div>
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold line-clamp-2">{video.title}</p>
        {video.channel && (
          <p className="text-xs text-[#9E9E9E] mt-1">{video.channel}</p>
        )}
      </div>
    </a>
  );
}
