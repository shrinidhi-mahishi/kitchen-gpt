/// Mirrors the backend RestaurantResult model.
class Restaurant {
  final String name;
  final String address;
  final double latitude;
  final double longitude;
  final double? rating;
  final String googleMapsUri;

  Restaurant({
    required this.name,
    required this.address,
    required this.latitude,
    required this.longitude,
    this.rating,
    required this.googleMapsUri,
  });

  factory Restaurant.fromJson(Map<String, dynamic> json) {
    return Restaurant(
      name: json['name'] as String,
      address: json['address'] as String,
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
      rating: (json['rating'] as num?)?.toDouble(),
      googleMapsUri: json['google_maps_uri'] as String? ?? '',
    );
  }
}
