import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

import '../models/restaurant.dart';

/// Embedded Google Map showing restaurant markers.
class RestaurantMapView extends StatelessWidget {
  final List<Restaurant> restaurants;
  final double userLatitude;
  final double userLongitude;

  const RestaurantMapView({
    super.key,
    required this.restaurants,
    required this.userLatitude,
    required this.userLongitude,
  });

  @override
  Widget build(BuildContext context) {
    final markers = <Marker>{
      Marker(
        markerId: const MarkerId('user'),
        position: LatLng(userLatitude, userLongitude),
        icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueAzure),
        infoWindow: const InfoWindow(title: 'You'),
      ),
      ...restaurants.map(
        (r) => Marker(
          markerId: MarkerId('restaurant_${r.name}'),
          position: LatLng(r.latitude, r.longitude),
          infoWindow: InfoWindow(
            title: r.name,
            snippet: r.rating != null ? 'Rating: ${r.rating}' : null,
          ),
        ),
      ),
    };

    return ClipRRect(
      borderRadius: BorderRadius.circular(16),
      child: SizedBox(
        height: 280,
        child: GoogleMap(
          initialCameraPosition: CameraPosition(
            target: LatLng(userLatitude, userLongitude),
            zoom: 13,
          ),
          markers: markers,
          myLocationEnabled: false,
          zoomControlsEnabled: true,
          mapToolbarEnabled: false,
        ),
      ),
    );
  }
}
