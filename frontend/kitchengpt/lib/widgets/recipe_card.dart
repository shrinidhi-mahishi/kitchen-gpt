import 'package:flutter/material.dart';
import 'package:share_plus/share_plus.dart' show Share;

import '../models/recipe.dart';

class RecipeCard extends StatelessWidget {
  final Recipe recipe;

  const RecipeCard({super.key, required this.recipe});

  void _shareRecipe() {
    final steps = recipe.steps
        .map((s) => '${s.number}. ${s.step}')
        .join('\n');
    final text = '${recipe.title}\n'
        '${recipe.readyInMinutes} min | ${recipe.servings} servings\n\n'
        '${recipe.summary}\n\n'
        'Ingredients: ${recipe.ingredientsUsed.join(", ")}\n\n'
        'Steps:\n$steps\n\n'
        'via KitchenGPT';
    Share.share(text);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Card(
      clipBehavior: Clip.antiAlias,
      elevation: 1,
      margin: const EdgeInsets.only(bottom: 14),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          // Colored header
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(
              color: theme.colorScheme.primaryContainer,
            ),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    recipe.title,
                    style: theme.textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: theme.colorScheme.onPrimaryContainer,
                    ),
                  ),
                ),
                IconButton(
                  icon: Icon(Icons.share_outlined,
                      size: 20, color: theme.colorScheme.onPrimaryContainer),
                  onPressed: _shareRecipe,
                  tooltip: 'Share recipe',
                  constraints: const BoxConstraints(),
                  padding: EdgeInsets.zero,
                ),
              ],
            ),
          ),

          Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Time & servings pills
                Row(
                  children: [
                    _Pill(
                      icon: Icons.timer_outlined,
                      label: '${recipe.readyInMinutes} min',
                      theme: theme,
                    ),
                    const SizedBox(width: 8),
                    _Pill(
                      icon: Icons.people_outline,
                      label: '${recipe.servings} srv',
                      theme: theme,
                    ),
                  ],
                ),
                const SizedBox(height: 10),

                if (recipe.summary.isNotEmpty)
                  Text(recipe.summary, style: theme.textTheme.bodySmall),

                if (recipe.ingredientsUsed.isNotEmpty) ...[
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 6,
                    runSpacing: 4,
                    children: recipe.ingredientsUsed
                        .map((i) => Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color:
                                    theme.colorScheme.surfaceContainerHighest,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(i,
                                  style: theme.textTheme.labelSmall?.copyWith(
                                    fontWeight: FontWeight.w500,
                                  )),
                            ))
                        .toList(),
                  ),
                ],

                // Timeline-style steps
                if (recipe.steps.isNotEmpty) ...[
                  const Divider(height: 24),
                  ExpansionTile(
                    tilePadding: EdgeInsets.zero,
                    childrenPadding: const EdgeInsets.only(bottom: 8),
                    initiallyExpanded: false,
                    title: Text(
                      'Instructions (${recipe.steps.length} steps)',
                      style: theme.textTheme.labelLarge?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    children: recipe.steps.map((s) {
                      final isLast =
                          s.number == recipe.steps.last.number;
                      return IntrinsicHeight(
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Timeline column
                            SizedBox(
                              width: 36,
                              child: Column(
                                children: [
                                  CircleAvatar(
                                    radius: 14,
                                    backgroundColor:
                                        theme.colorScheme.primary,
                                    child: Text(
                                      '${s.number}',
                                      style: TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.bold,
                                        color: theme.colorScheme.onPrimary,
                                      ),
                                    ),
                                  ),
                                  if (!isLast)
                                    Expanded(
                                      child: Container(
                                        width: 2,
                                        color: theme
                                            .colorScheme.outlineVariant,
                                      ),
                                    ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Padding(
                                padding:
                                    const EdgeInsets.only(bottom: 16, top: 2),
                                child: Text(s.step,
                                    style: theme.textTheme.bodyMedium),
                              ),
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Pill extends StatelessWidget {
  final IconData icon;
  final String label;
  final ThemeData theme;

  const _Pill({
    required this.icon,
    required this.label,
    required this.theme,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: theme.colorScheme.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: theme.colorScheme.onSurfaceVariant),
          const SizedBox(width: 4),
          Text(label, style: theme.textTheme.labelSmall?.copyWith(
            fontWeight: FontWeight.w500,
          )),
        ],
      ),
    );
  }
}
