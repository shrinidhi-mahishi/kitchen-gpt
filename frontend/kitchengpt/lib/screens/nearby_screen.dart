import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';

import '../models/restaurant.dart';
import '../services/api_service.dart';
import '../widgets/restaurant_card.dart';

class NearbyScreen extends StatefulWidget {
  const NearbyScreen({super.key});

  @override
  State<NearbyScreen> createState() => _NearbyScreenState();
}

class _NearbyScreenState extends State<NearbyScreen> {
  final _apiService = ApiService();
  final _searchCtrl = TextEditingController();

  bool _loading = false;
  String? _error;
  List<Restaurant> _restaurants = [];
  double? _lat;
  double? _lng;

  Future<void> _ensureLocation() async {
    if (_lat != null && _lng != null) return;
    try {
      final permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied ||
          permission == LocationPermission.deniedForever) return;
      final pos = await Geolocator.getCurrentPosition(
          locationSettings:
              const LocationSettings(accuracy: LocationAccuracy.medium));
      _lat = pos.latitude;
      _lng = pos.longitude;
    } catch (_) {}
  }

  Future<void> _searchRestaurants() async {
    final query = _searchCtrl.text.trim();
    if (query.isEmpty) return;

    setState(() {
      _loading = true;
      _error = null;
    });

    await _ensureLocation();

    try {
      final results = await _apiService.nearbyRestaurants(
        dishName: query,
        latitude: _lat,
        longitude: _lng,
      );
      setState(() => _restaurants = results);
    } catch (e) {
      setState(() => _error = 'Search failed: $e');
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _searchCtrl,
                  decoration: InputDecoration(
                    hintText: 'e.g. Biryani, Dosa, Paneer...',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    prefixIcon: const Icon(Icons.search),
                    filled: true,
                  ),
                  onSubmitted: (_) => _searchRestaurants(),
                ),
              ),
              const SizedBox(width: 8),
              FilledButton(
                onPressed: _loading ? null : _searchRestaurants,
                style: FilledButton.styleFrom(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 20, vertical: 16),
                ),
                child: const Text('Find'),
              ),
            ],
          ),
        ),

        if (_loading)
          const Expanded(
            child: Center(child: CircularProgressIndicator()),
          ),

        if (_error != null)
          Padding(
            padding: const EdgeInsets.all(16),
            child: Card(
              color: theme.colorScheme.errorContainer,
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Text(_error!,
                    style:
                        TextStyle(color: theme.colorScheme.onErrorContainer)),
              ),
            ),
          ),

        if (!_loading && _restaurants.isEmpty && _error == null)
          Expanded(
            child: Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.location_on_outlined,
                      size: 64,
                      color: theme.colorScheme.outlineVariant),
                  const SizedBox(height: 12),
                  Text(
                    'Search for a dish to find\nnearby restaurants',
                    style: theme.textTheme.bodyLarge?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          ),

        if (!_loading && _restaurants.isNotEmpty)
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _restaurants.length + 1,
              itemBuilder: (context, i) {
                if (i == 0) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Text(
                      '${_restaurants.length} restaurants found',
                      style: theme.textTheme.titleSmall?.copyWith(
                        color: theme.colorScheme.onSurfaceVariant,
                      ),
                    ),
                  );
                }
                return RestaurantCard(restaurant: _restaurants[i - 1]);
              },
            ),
          ),
      ],
    );
  }
}
