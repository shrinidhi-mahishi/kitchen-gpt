import 'package:flutter/material.dart';

import '../models/recipe.dart';

class RecipeCard extends StatelessWidget {
  final Recipe recipe;

  const RecipeCard({super.key, required this.recipe});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Card(
      clipBehavior: Clip.antiAlias,
      elevation: 2,
      child: SizedBox(
        width: 280,
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              // Title
              Text(
                recipe.title,
                style: theme.textTheme.titleSmall
                    ?.copyWith(fontWeight: FontWeight.w600),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 8),

              // Meta row
              Row(
                children: [
                  _chip(Icons.timer_outlined, '${recipe.readyInMinutes} min',
                      theme),
                  const SizedBox(width: 10),
                  _chip(Icons.people_outline, '${recipe.servings} srv', theme),
                ],
              ),
              const SizedBox(height: 10),

              // Summary
              if (recipe.summary.isNotEmpty)
                Text(
                  recipe.summary,
                  style: theme.textTheme.bodySmall,
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis,
                ),

              // Ingredients used
              if (recipe.ingredientsUsed.isNotEmpty) ...[
                const SizedBox(height: 10),
                Wrap(
                  spacing: 4,
                  runSpacing: 4,
                  children: recipe.ingredientsUsed
                      .map((i) => Chip(
                            label: Text(i, style: const TextStyle(fontSize: 11)),
                            visualDensity: VisualDensity.compact,
                            padding: EdgeInsets.zero,
                          ))
                      .toList(),
                ),
              ],

              // Expandable instructions
              if (recipe.steps.isNotEmpty) ...[
                const SizedBox(height: 6),
                ExpansionTile(
                  tilePadding: EdgeInsets.zero,
                  title: Text('Instructions (${recipe.steps.length} steps)',
                      style: theme.textTheme.labelMedium),
                  children: recipe.steps
                      .map(
                        (s) => Padding(
                          padding: const EdgeInsets.symmetric(
                              vertical: 4, horizontal: 4),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              CircleAvatar(
                                radius: 12,
                                child: Text('${s.number}',
                                    style: const TextStyle(fontSize: 11)),
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(s.step,
                                    style: theme.textTheme.bodySmall),
                              ),
                            ],
                          ),
                        ),
                      )
                      .toList(),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _chip(IconData icon, String label, ThemeData theme) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 14, color: theme.colorScheme.outline),
        const SizedBox(width: 2),
        Text(label, style: theme.textTheme.labelSmall),
      ],
    );
  }
}
