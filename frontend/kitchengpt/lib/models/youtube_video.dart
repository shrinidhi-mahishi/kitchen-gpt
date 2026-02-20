/// Mirrors the backend YouTubeVideo model.
class YouTubeVideo {
  final String videoId;
  final String title;
  final String channel;
  final String thumbnailUrl;
  final String videoUrl;

  YouTubeVideo({
    required this.videoId,
    required this.title,
    required this.channel,
    required this.thumbnailUrl,
    required this.videoUrl,
  });

  factory YouTubeVideo.fromJson(Map<String, dynamic> json) {
    return YouTubeVideo(
      videoId: json['video_id'] as String,
      title: json['title'] as String? ?? '',
      channel: json['channel'] as String? ?? '',
      thumbnailUrl: json['thumbnail_url'] as String? ?? '',
      videoUrl: json['video_url'] as String? ?? '',
    );
  }
}
