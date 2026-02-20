import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../models/restaurant.dart';

class RestaurantCard extends StatelessWidget {
  final Restaurant restaurant;

  const RestaurantCard({super.key, required this.restaurant});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Card(
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: theme.colorScheme.primaryContainer,
          child:
              Icon(Icons.store, color: theme.colorScheme.onPrimaryContainer),
        ),
        title: Text(restaurant.name,
            style:
                theme.textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w600)),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(restaurant.address,
                maxLines: 2, overflow: TextOverflow.ellipsis),
            if (restaurant.rating != null)
              Row(
                children: [
                  Icon(Icons.star, size: 14, color: Colors.amber.shade700),
                  const SizedBox(width: 2),
                  Text(restaurant.rating!.toStringAsFixed(1),
                      style: theme.textTheme.labelSmall),
                ],
              ),
          ],
        ),
        trailing: restaurant.googleMapsUri.isNotEmpty
            ? IconButton(
                icon: const Icon(Icons.directions),
                tooltip: 'Open in Maps',
                onPressed: () =>
                    launchUrl(Uri.parse(restaurant.googleMapsUri)),
              )
            : null,
        isThreeLine: true,
      ),
    );
  }
}
