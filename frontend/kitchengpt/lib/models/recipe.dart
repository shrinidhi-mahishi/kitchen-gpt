/// Mirrors the backend RecipeDetail model (Gemini-generated).
class InstructionStep {
  final int number;
  final String step;

  InstructionStep({required this.number, required this.step});

  factory InstructionStep.fromJson(Map<String, dynamic> json) {
    return InstructionStep(
      number: json['number'] as int,
      step: json['step'] as String,
    );
  }
}

class Recipe {
  final String title;
  final int readyInMinutes;
  final int servings;
  final String summary;
  final List<String> ingredientsUsed;
  final List<String> ingredientsExtra;
  final List<InstructionStep> steps;

  Recipe({
    required this.title,
    required this.readyInMinutes,
    required this.servings,
    required this.summary,
    required this.ingredientsUsed,
    required this.ingredientsExtra,
    required this.steps,
  });

  factory Recipe.fromJson(Map<String, dynamic> json) {
    return Recipe(
      title: json['title'] as String,
      readyInMinutes: json['ready_in_minutes'] as int? ?? 0,
      servings: json['servings'] as int? ?? 0,
      summary: json['summary'] as String? ?? '',
      ingredientsUsed: List<String>.from(json['ingredients_used'] as List? ?? []),
      ingredientsExtra:
          List<String>.from(json['ingredients_extra'] as List? ?? []),
      steps: (json['steps'] as List?)
              ?.map((s) => InstructionStep.fromJson(s as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }
}
