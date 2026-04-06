import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'screens/home_screen.dart';
import 'screens/onboarding_screen.dart';

class KitchenGPTApp extends StatelessWidget {
  const KitchenGPTApp({super.key});

  static const _scheme = ColorScheme.dark(
    brightness: Brightness.dark,
    primary: Color(0xFF00E5FF),
    onPrimary: Colors.black,
    primaryContainer: Color(0xFF004D5A),
    onPrimaryContainer: Color(0xFF80F0FF),
    secondary: Color(0xFFBB86FC),
    onSecondary: Colors.black,
    secondaryContainer: Color(0xFF3D1F6E),
    onSecondaryContainer: Color(0xFFE2CFFF),
    tertiary: Color(0xFF03DAC6),
    onTertiary: Colors.black,
    tertiaryContainer: Color(0xFF004D40),
    onTertiaryContainer: Color(0xFF80EDE4),
    error: Color(0xFFCF6679),
    surface: Color(0xFF000000),
    onSurface: Color(0xFFE6E6E6),
    onSurfaceVariant: Color(0xFF9E9E9E),
    outline: Color(0xFF444444),
    outlineVariant: Color(0xFF2A2A2A),
    surfaceContainerHighest: Color(0xFF1A1A1A),
  );

  Future<bool> _isOnboardingComplete() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool('onboarding_complete') ?? false;
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'KitchenGPT',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: _scheme,
        useMaterial3: true,
        scaffoldBackgroundColor: Colors.black,
        navigationBarTheme: const NavigationBarThemeData(
          backgroundColor: Color(0xFF050505),
          indicatorColor: Color(0xFF004D5A),
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.black,
          surfaceTintColor: Colors.transparent,
          elevation: 0,
        ),
        cardTheme: CardThemeData(
          color: const Color(0xFF111111),
          surfaceTintColor: Colors.transparent,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
        ),
        filledButtonTheme: FilledButtonThemeData(
          style: FilledButton.styleFrom(
            backgroundColor: const Color(0xFF00E5FF),
            foregroundColor: Colors.black,
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          fillColor: const Color(0xFF111111),
          filled: true,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Color(0xFF333333)),
          ),
        ),
        dividerColor: const Color(0xFF222222),
        chipTheme: ChipThemeData(
          backgroundColor: const Color(0xFF1A1A1A),
          side: BorderSide.none,
          labelStyle: const TextStyle(color: Color(0xFFCCCCCC)),
        ),
      ),
      themeMode: ThemeMode.dark,
      home: FutureBuilder<bool>(
        future: _isOnboardingComplete(),
        builder: (context, snapshot) {
          if (!snapshot.hasData) {
            return const Scaffold(
              backgroundColor: Colors.black,
              body: Center(
                child: CircularProgressIndicator(color: Color(0xFF00E5FF)),
              ),
            );
          }
          if (snapshot.data == true) {
            return const HomeScreen();
          }
          return const OnboardingScreen();
        },
      ),
    );
  }
}
