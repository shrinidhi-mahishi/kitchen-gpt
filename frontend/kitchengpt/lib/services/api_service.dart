import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';

import '../config/constants.dart';
import '../models/food_analysis.dart';
import '../models/recipe.dart';
import '../models/restaurant.dart';
import '../models/youtube_video.dart';

/// Combined response from the /analyze-dish endpoint.
class DishAnalysisResult {
  final FoodAnalysis analysis;
  final List<Recipe> recipes;
  final List<YouTubeVideo> youtubeVideos;

  DishAnalysisResult({
    required this.analysis,
    required this.recipes,
    required this.youtubeVideos,
  });

  factory DishAnalysisResult.fromJson(Map<String, dynamic> json) {
    return DishAnalysisResult(
      analysis:
          FoodAnalysis.fromJson(json['analysis'] as Map<String, dynamic>),
      recipes: (json['recipes'] as List?)
              ?.map((r) => Recipe.fromJson(r as Map<String, dynamic>))
              .toList() ??
          [],
      youtubeVideos: (json['youtube_videos'] as List?)
              ?.map((v) => YouTubeVideo.fromJson(v as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }
}

/// Response from the /recipes-by-ingredients endpoint.
class RecipeSearchResult {
  final List<Recipe> recipes;
  final List<YouTubeVideo> youtubeVideos;

  RecipeSearchResult({required this.recipes, required this.youtubeVideos});

  factory RecipeSearchResult.fromJson(Map<String, dynamic> json) {
    return RecipeSearchResult(
      recipes: (json['recipes'] as List?)
              ?.map((r) => Recipe.fromJson(r as Map<String, dynamic>))
              .toList() ??
          [],
      youtubeVideos: (json['youtube_videos'] as List?)
              ?.map((v) => YouTubeVideo.fromJson(v as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }
}

/// Service class for communicating with the KitchenGPT FastAPI backend.
class ApiService {
  final String _baseUrl = AppConstants.apiBaseUrl;

  Map<String, String> get _jsonHeaders => {'Content-Type': 'application/json'};

  /// Multimodal workflow: upload an image file for dish analysis + recipes + YouTube.
  Future<DishAnalysisResult> analyzeDish({
    required String imagePath,
  }) async {
    final request = http.MultipartRequest(
      'POST',
      Uri.parse('$_baseUrl/analyze-dish'),
    );
    final ext = imagePath.split('.').last.toLowerCase();
    final mimeType = switch (ext) {
      'png' => 'image/png',
      'webp' => 'image/webp',
      'heic' || 'heif' => 'image/heic',
      _ => 'image/jpeg',
    };
    request.files.add(await http.MultipartFile.fromPath(
      'image',
      imagePath,
      contentType: MediaType.parse(mimeType),
    ));

    final streamed = await request.send();
    final responseBody = await streamed.stream.bytesToString();

    if (streamed.statusCode != 200) {
      throw ApiException(streamed.statusCode, responseBody);
    }

    return DishAnalysisResult.fromJson(
        jsonDecode(responseBody) as Map<String, dynamic>);
  }

  /// Text-based workflow: send ingredients for recipe generation + YouTube.
  Future<RecipeSearchResult> recipesByIngredients({
    required List<String> ingredients,
  }) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/recipes-by-ingredients'),
      headers: _jsonHeaders,
      body: jsonEncode({
        'ingredients': ingredients,
      }),
    );

    if (response.statusCode != 200) {
      throw ApiException(response.statusCode, response.body);
    }

    return RecipeSearchResult.fromJson(
        jsonDecode(response.body) as Map<String, dynamic>);
  }

  /// Find nearby restaurants serving a specific dish.
  /// Location is optional — the server auto-detects from IP if omitted.
  Future<List<Restaurant>> nearbyRestaurants({
    required String dishName,
    double? latitude,
    double? longitude,
    int radiusMeters = 5000,
  }) async {
    final body = <String, dynamic>{
      'dish_name': dishName,
      'radius_meters': radiusMeters,
    };
    if (latitude != null) body['latitude'] = latitude;
    if (longitude != null) body['longitude'] = longitude;

    final response = await http.post(
      Uri.parse('$_baseUrl/nearby-restaurants'),
      headers: _jsonHeaders,
      body: jsonEncode(body),
    );

    if (response.statusCode != 200) {
      throw ApiException(response.statusCode, response.body);
    }

    final list = jsonDecode(response.body) as List;
    return list
        .map((r) => Restaurant.fromJson(r as Map<String, dynamic>))
        .toList();
  }
}

class ApiException implements Exception {
  final int statusCode;
  final String body;
  ApiException(this.statusCode, this.body);

  @override
  String toString() => 'ApiException($statusCode): $body';
}
