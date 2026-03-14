import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../models/youtube_video.dart';

class YouTubeVideoCard extends StatelessWidget {
  final YouTubeVideo video;

  const YouTubeVideoCard({super.key, required this.video});

  Future<void> _openVideo() async {
    final uri = Uri.parse(video.videoUrl);
    await launchUrl(uri, mode: LaunchMode.externalApplication);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return GestureDetector(
      onTap: _openVideo,
      child: Card(
        clipBehavior: Clip.antiAlias,
        elevation: 2,
        child: SizedBox(
          width: 260,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              // Thumbnail with play overlay
              Stack(
                alignment: Alignment.center,
                children: [
                  if (video.thumbnailUrl.isNotEmpty)
                    Image.network(
                      video.thumbnailUrl,
                      height: 146,
                      width: 260,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => Container(
                        height: 146,
                        width: 260,
                        color: Colors.grey.shade300,
                        child: const Icon(Icons.play_circle_outline, size: 48),
                      ),
                    )
                  else
                    Container(
                      height: 146,
                      width: 260,
                      color: Colors.grey.shade300,
                      child: const Icon(Icons.play_circle_outline, size: 48),
                    ),
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.black54,
                      borderRadius: BorderRadius.circular(24),
                    ),
                    padding: const EdgeInsets.all(8),
                    child: const Icon(Icons.play_arrow,
                        color: Colors.white, size: 28),
                  ),
                ],
              ),

              Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      video.title,
                      style: theme.textTheme.bodyMedium
                          ?.copyWith(fontWeight: FontWeight.w600),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    if (video.channel.isNotEmpty) ...[
                      const SizedBox(height: 4),
                      Text(
                        video.channel,
                        style: theme.textTheme.bodySmall
                            ?.copyWith(color: theme.colorScheme.outline),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
