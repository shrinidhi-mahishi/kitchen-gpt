import 'dart:math';

import 'package:flutter/material.dart';

class DiscoverScreen extends StatelessWidget {
  final VoidCallback onScanDish;
  final VoidCallback onByIngredients;

  const DiscoverScreen({
    super.key,
    required this.onScanDish,
    required this.onByIngredients,
  });

  static const _tips = [
    'Add a pinch of sugar to balance acidity in tomato-based gravies.',
    'Soak basmati rice for 20 min before cooking for fluffy, separated grains.',
    'Crush kasuri methi between your palms before adding for maximum aroma.',
    'Always heat the pan before adding oil to prevent food from sticking.',
    'Add a bay leaf to your dal while cooking for a subtle earthy flavour.',
    'Use yogurt-based marinades to tenderize chicken in under 30 minutes.',
    'Toast whole spices in dry pan before grinding for deeper flavour.',
    'Add ginger-garlic paste after onions turn golden, not before.',
    'Rest roti dough for 15-20 min for softer, pliable rotis.',
    'Temper mustard seeds on medium heat — high heat burns them.',
    'Sour curd makes the best marinade for tandoori-style dishes.',
    'A splash of cream or butter at the end enriches any curry.',
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final tipIndex = Random().nextInt(_tips.length);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'What would you\nlike to cook?',
            style: theme.textTheme.headlineMedium?.copyWith(
              fontWeight: FontWeight.bold,
              height: 1.3,
            ),
          ),
          const SizedBox(height: 24),

          Row(
            children: [
              Expanded(
                child: _QuickActionCard(
                  icon: Icons.camera_alt_rounded,
                  title: 'Scan a Dish',
                  subtitle: 'Identify from photo',
                  color: const Color(0xFFFF6D00),
                  onTap: onScanDish,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _QuickActionCard(
                  icon: Icons.search_rounded,
                  title: 'By Ingredients',
                  subtitle: 'Search with what you have',
                  color: const Color(0xFFD50000),
                  onTap: onByIngredients,
                ),
              ),
            ],
          ),
          const SizedBox(height: 32),

          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: theme.colorScheme.primaryContainer.withValues(alpha: 0.5),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              children: [
                Icon(
                  Icons.lightbulb_rounded,
                  color: theme.colorScheme.primary,
                  size: 32,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Cooking Tip',
                        style: theme.textTheme.labelLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: theme.colorScheme.primary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _tips[tipIndex],
                        style: theme.textTheme.bodyMedium,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),

          Text(
            'How KitchenGPT Works',
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 12),
          const _StepRow(number: '1', text: 'Snap a photo or enter ingredients'),
          const _StepRow(number: '2', text: 'AI identifies dish & generates recipes'),
          const _StepRow(number: '3', text: 'Watch videos & find nearby restaurants'),
          const SizedBox(height: 20),
        ],
      ),
    );
  }
}

class _QuickActionCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final Color color;
  final VoidCallback onTap;

  const _QuickActionCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          color: color.withValues(alpha: 0.08),
          border: Border.all(color: color.withValues(alpha: 0.25)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 28),
            ),
            const SizedBox(height: 14),
            Text(
              title,
              style: theme.textTheme.titleSmall?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              subtitle,
              style: theme.textTheme.bodySmall?.copyWith(
                color: theme.colorScheme.onSurfaceVariant,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _StepRow extends StatelessWidget {
  final String number;
  final String text;

  const _StepRow({required this.number, required this.text});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          CircleAvatar(
            radius: 16,
            backgroundColor: theme.colorScheme.primary,
            child: Text(
              number,
              style: TextStyle(
                color: theme.colorScheme.onPrimary,
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(child: Text(text, style: theme.textTheme.bodyMedium)),
        ],
      ),
    );
  }
}
