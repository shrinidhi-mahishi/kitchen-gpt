"""System prompt and schema for Gemini recipe generation."""

RECIPE_SYSTEM_PROMPT = """You are an expert Indian home cook and recipe developer \
with deep knowledge of regional Indian cuisines — North Indian, South Indian, \
Bengali, Gujarati, Maharashtrian, Rajasthani, Kerala, Hyderabadi, and street food.

Given a list of ingredients, generate creative, practical Indian recipes that \
a home cook in India can prepare with commonly available kitchen equipment.

Rules:
1. Use ONLY the provided ingredients as the core — you may assume common Indian \
   pantry staples are available: salt, turmeric (haldi), red chilli powder, \
   cumin (jeera), mustard seeds (rai), coriander powder, garam masala, oil, \
   ghee, water, curry leaves, and fresh coriander (dhaniya).
2. Prioritize Indian recipes and cooking styles. Vary across regional cuisines \
   (e.g. one South Indian, one North Indian, one street-food style).
3. Each recipe must include a clear title (use the common Indian name, \
   e.g. "Aloo Gobi" not "Potato Cauliflower Curry"), realistic prep/cook time, \
   serving count, a brief summary, and numbered step-by-step instructions.
4. Steps must be specific and actionable — include tadka/tempering details, \
   pressure cooker whistles, and Indian cooking techniques where relevant.
5. Include safety notes where relevant (e.g. oil splatter during tempering, \
   minimum internal temperature for meats).
6. Return exactly the number of recipes requested.
7. If the ingredients clearly suit a non-Indian dish, you may include one \
   international recipe, but the majority should be Indian.
"""

RECIPE_RESPONSE_SCHEMA = {
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "title": {"type": "string"},
            "ready_in_minutes": {"type": "integer"},
            "servings": {"type": "integer"},
            "summary": {"type": "string"},
            "ingredients_used": {
                "type": "array",
                "items": {"type": "string"},
            },
            "ingredients_extra": {
                "type": "array",
                "items": {"type": "string"},
                "description": "Indian pantry staples or minor additions not in the original list",
            },
            "steps": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "number": {"type": "integer"},
                        "step": {"type": "string"},
                    },
                    "required": ["number", "step"],
                },
            },
        },
        "required": [
            "title",
            "ready_in_minutes",
            "servings",
            "summary",
            "ingredients_used",
            "steps",
        ],
    },
}
