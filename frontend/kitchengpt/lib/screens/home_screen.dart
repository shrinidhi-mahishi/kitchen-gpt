import 'package:flutter/material.dart';

import 'analyze_dish_screen.dart';
import 'discover_screen.dart';
import 'nearby_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => HomeScreenState();
}

class HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  final _cookKey = GlobalKey<AnalyzeDishScreenState>();

  void _goToCookCamera() {
    setState(() => _currentIndex = 1);
    _cookKey.currentState?.selectTab(0);
  }

  void _goToCookIngredients() {
    setState(() => _currentIndex = 1);
    _cookKey.currentState?.selectTab(1);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    final pages = [
      DiscoverScreen(
        onScanDish: _goToCookCamera,
        onByIngredients: _goToCookIngredients,
      ),
      AnalyzeDishScreen(key: _cookKey),
      const NearbyScreen(),
    ];

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Icon(Icons.restaurant_menu, color: theme.colorScheme.primary),
            const SizedBox(width: 8),
            const Text(
              'KitchenGPT',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ],
        ),
        surfaceTintColor: Colors.transparent,
      ),
      body: IndexedStack(
        index: _currentIndex,
        children: pages,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (i) => setState(() => _currentIndex = i),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.explore_outlined),
            selectedIcon: Icon(Icons.explore),
            label: 'Discover',
          ),
          NavigationDestination(
            icon: Icon(Icons.camera_alt_outlined),
            selectedIcon: Icon(Icons.camera_alt),
            label: 'Cook',
          ),
          NavigationDestination(
            icon: Icon(Icons.location_on_outlined),
            selectedIcon: Icon(Icons.location_on),
            label: 'Nearby',
          ),
        ],
      ),
    );
  }
}
