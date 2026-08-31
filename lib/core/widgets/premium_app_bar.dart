import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../constants/app_constants.dart';

class PremiumAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String? title;
  final List<Widget>? actions;
  final Widget? leading;
  final bool centerTitle;
  final bool showLogo;
  final int notificationCount;
  final VoidCallback? onNotificationTap;
  final VoidCallback? onSearchTap;
  final VoidCallback? onMenuTap;

  const PremiumAppBar({
    super.key,
    this.title,
    this.actions,
    this.leading,
    this.centerTitle = true,
    this.showLogo = true,
    this.notificationCount = 0,
    this.onNotificationTap,
    this.onSearchTap,
    this.onMenuTap,
  });

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight + 10);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            const Color(AppConstants.primaryColorValue),
            const Color(AppConstants.secondaryColorValue),
          ],
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Row(
            children: [
              // Left: Hamburger Menu
              leading ??
                  IconButton(
                    icon: const Icon(Icons.menu, color: Colors.white),
                    onPressed: onMenuTap ??
                        () => Scaffold.of(context).openDrawer(),
                  ),
              const SizedBox(width: 8),

              // Center: Logo (no text)
              if (showLogo)
                Expanded(
                  child: Center(
                    child: Image.asset(
                      'assets/IWKL-FINAL-LOGO_2.png',
                      height: 40,
                      errorBuilder: (context, error, stackTrace) {
                        return const Icon(
                          Icons.sports_kabaddi,
                          size: 40,
                          color: Color(AppConstants.accentColorValue),
                        );
                      },
                    ).animate().fadeIn(duration: 300.ms).scale(),
                  ),
                ),

              const SizedBox(width: 8),

              // Right: Search and Notification
              Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.search, color: Colors.white),
                    onPressed: onSearchTap,
                  ),
                  const SizedBox(width: 4),
                  Stack(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.notifications_outlined, color: Colors.white),
                        onPressed: onNotificationTap,
                      ),
                      if (notificationCount > 0)
                        Positioned(
                          right: 8,
                          top: 8,
                          child: Container(
                            padding: const EdgeInsets.all(4),
                            decoration: const BoxDecoration(
                              color: Color(AppConstants.accentColorValue),
                              shape: BoxShape.circle,
                            ),
                            child: Text(
                              notificationCount > 9 ? '9+' : notificationCount.toString(),
                              style: const TextStyle(
                                color: Colors.black,
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ).animate().scale(duration: 200.ms),
                        ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
