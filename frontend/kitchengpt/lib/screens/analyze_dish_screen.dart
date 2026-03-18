import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

import '../models/food_analysis.dart';
import '../models/recipe.dart';
import '../models/youtube_video.dart';
import '../services/api_service.dart';
import '../services/camera_service.dart';
import '../widgets/recipe_card.dart';
import '../widgets/youtube_card.dart';

class AnalyzeDishScreen extends StatefulWidget {
  const AnalyzeDishScreen({super.key});

  @override
  State<AnalyzeDishScreen> createState() => _AnalyzeDishScreenState();
}

class _AnalyzeDishScreenState extends State<AnalyzeDishScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabCtrl;
  final _ingredientsCtrl = TextEditingController();
  final _cameraService = CameraService();
  final _apiService = ApiService();

  bool _loading = false;
  String? _error;

  FoodAnalysis? _analysis;
  List<Recipe> _recipes = [];
  List<YouTubeVideo> _youtubeVideos = [];

  @override
  void initState() {
    super.initState();
    _tabCtrl = TabController(length: 2, vsync: this);
    _tabCtrl.addListener(_onTabChanged);
  }

  void _onTabChanged() {
    if (_tabCtrl.indexIsChanging) return;
    setState(() {
      _analysis = null;
      _recipes = [];
      _youtubeVideos = [];
      _error = null;
    });
  }

  Future<void> _onCapturePhoto() async {
    final path = await _cameraService.capturePhoto();
    if (path != null) await _analyzeImage(path);
  }

  Future<void> _onPickGallery() async {
    final path = await _cameraService.pickFromGallery();
    if (path != null) await _analyzeImage(path);
  }

  Future<void> _analyzeImage(String imagePath) async {
    setState(() {
      _loading = true;
      _error = null;
      _youtubeVideos = [];
    });

    try {
      final result = await _apiService.analyzeDish(imagePath: imagePath);
      setState(() {
        _analysis = result.analysis;
        _recipes = result.recipes;
        _youtubeVideos = result.youtubeVideos;
      });
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      setState(() => _loading = false);
    }
  }

  Future<void> _onSearchIngredients() async {
    final raw = _ingredientsCtrl.text.trim();
    if (raw.isEmpty) return;

    final ingredients =
        raw.split(',').map((s) => s.trim()).where((s) => s.isNotEmpty).toList();
    if (ingredients.isEmpty) return;

    setState(() {
      _loading = true;
      _error = null;
      _analysis = null;
      _youtubeVideos = [];
    });

    try {
      final result =
          await _apiService.recipesByIngredients(ingredients: ingredients);
      setState(() {
        _recipes = result.recipes;
        _youtubeVideos = result.youtubeVideos;
      });
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  void dispose() {
    _tabCtrl.removeListener(_onTabChanged);
    _tabCtrl.dispose();
    _ingredientsCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      children: [
        TabBar(
          controller: _tabCtrl,
          tabs: const [
            Tab(icon: Icon(Icons.camera_alt), text: 'Camera'),
            Tab(icon: Icon(Icons.edit_note), text: 'Ingredients'),
          ],
        ),

        SizedBox(
          height: 140,
          child: TabBarView(
            controller: _tabCtrl,
            children: [
              Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    FilledButton.icon(
                      onPressed: _loading ? null : _onCapturePhoto,
                      icon: const Icon(Icons.camera_alt),
                      label: const Text('Take Photo'),
                      style: FilledButton.styleFrom(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 20, vertical: 14),
                      ),
                    ),
                    const SizedBox(width: 16),
                    OutlinedButton.icon(
                      onPressed: _loading ? null : _onPickGallery,
                      icon: const Icon(Icons.photo_library),
                      label: const Text('Gallery'),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 20, vertical: 14),
                      ),
                    ),
                  ],
                ),
              ),

              Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _ingredientsCtrl,
                        decoration: InputDecoration(
                          hintText: 'e.g. paneer, tomato, onion',
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          prefixIcon: const Icon(Icons.search),
                          filled: true,
                        ),
                        onSubmitted: (_) => _onSearchIngredients(),
                      ),
                    ),
                    const SizedBox(width: 8),
                    FilledButton(
                      onPressed: _loading ? null : _onSearchIngredients,
                      style: FilledButton.styleFrom(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 20, vertical: 16),
                      ),
                      child: const Text('Search'),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),

        // Loading shimmer
        if (_loading)
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Shimmer.fromColors(
                baseColor: theme.colorScheme.surfaceContainerHighest,
                highlightColor: theme.colorScheme.surface,
                child: Column(
                  children: [
                    Container(
                      height: 120,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Container(
                      height: 180,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Container(
                      height: 180,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

        if (_error != null)
          Padding(
            padding: const EdgeInsets.all(16),
            child: Card(
              color: theme.colorScheme.errorContainer,
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Row(
                  children: [
                    Icon(Icons.error_outline,
                        color: theme.colorScheme.onErrorContainer),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(_error!,
                          style: TextStyle(
                              color: theme.colorScheme.onErrorContainer)),
                    ),
                  ],
                ),
              ),
            ),
          ),

        if (!_loading)
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (_analysis != null) _buildAnalysisCard(theme),

                  if (_recipes.isNotEmpty) ...[
                    const SizedBox(height: 20),
                    Text('Matching Recipes',
                        style: theme.textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w600,
                        )),
                    const SizedBox(height: 8),
                    ..._recipes.map((r) => RecipeCard(recipe: r)),
                  ],

                  if (_youtubeVideos.isNotEmpty) ...[
                    const SizedBox(height: 20),
                    Text('Watch on YouTube',
                        style: theme.textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w600,
                        )),
                    const SizedBox(height: 8),
                    SizedBox(
                      height: 240,
                      child: ListView.separated(
                        scrollDirection: Axis.horizontal,
                        itemCount: _youtubeVideos.length,
                        separatorBuilder: (_, __) => const SizedBox(width: 12),
                        itemBuilder: (_, i) =>
                            YouTubeVideoCard(video: _youtubeVideos[i]),
                      ),
                    ),
                  ],

                  if (_recipes.isEmpty &&
                      _analysis == null &&
                      _youtubeVideos.isEmpty &&
                      _error == null)
                    Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const SizedBox(height: 40),
                          Icon(Icons.restaurant_menu,
                              size: 64,
                              color: theme.colorScheme.outlineVariant),
                          const SizedBox(height: 12),
                          Text(
                            'Take a photo or search ingredients\nto get started',
                            style: theme.textTheme.bodyLarge?.copyWith(
                              color: theme.colorScheme.onSurfaceVariant,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    ),
                ],
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildAnalysisCard(ThemeData theme) {
    final a = _analysis!;
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(a.dishName,
                      style: theme.textTheme.headlineSmall
                          ?.copyWith(fontWeight: FontWeight.bold)),
                ),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.primaryContainer,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.verified,
                          size: 16, color: theme.colorScheme.primary),
                      const SizedBox(width: 4),
                      Text(
                        '${(a.confidence * 100).toStringAsFixed(0)}%',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: theme.colorScheme.primary,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            if (a.cuisineType != null && a.cuisineType!.isNotEmpty) ...[
              const SizedBox(height: 6),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: theme.colorScheme.tertiaryContainer,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(a.cuisineType!,
                    style: theme.textTheme.labelMedium?.copyWith(
                      color: theme.colorScheme.onTertiaryContainer,
                      fontWeight: FontWeight.w600,
                    )),
              ),
            ],
            const SizedBox(height: 10),
            Row(
              children: [
                Icon(Icons.local_fire_department,
                    size: 18, color: Colors.orange.shade700),
                const SizedBox(width: 4),
                Text('~${a.caloriesEstimate} kcal',
                    style: theme.textTheme.bodyMedium?.copyWith(
                      fontWeight: FontWeight.w500,
                    )),
              ],
            ),
            const Divider(height: 20),
            Wrap(
              spacing: 6,
              runSpacing: 4,
              children: a.detectedIngredients
                  .map((i) => Chip(
                        label: Text(i, style: const TextStyle(fontSize: 12)),
                        visualDensity: VisualDensity.compact,
                        side: BorderSide.none,
                        backgroundColor:
                            theme.colorScheme.surfaceContainerHighest,
                      ))
                  .toList(),
            ),
          ],
        ),
      ),
    );
  }
}
