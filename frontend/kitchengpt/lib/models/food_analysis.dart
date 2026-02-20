/// Mirrors the backend FoodAnalysisResponse model.
class FoodAnalysis {
  final String dishName;
  final List<String> detectedIngredients;
  final int caloriesEstimate;
  final double confidence;
  final String? cuisineType;

  FoodAnalysis({
    required this.dishName,
    required this.detectedIngredients,
    required this.caloriesEstimate,
    required this.confidence,
    this.cuisineType,
  });

  factory FoodAnalysis.fromJson(Map<String, dynamic> json) {
    return FoodAnalysis(
      dishName: json['dish_name'] as String,
      detectedIngredients:
          List<String>.from(json['detected_ingredients'] as List),
      caloriesEstimate: json['calories_estimate'] as int,
      confidence: (json['confidence'] as num).toDouble(),
      cuisineType: json['cuisine_type'] as String?,
    );
  }
}
