import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';
import '../../../../core/theme/app_design_system.dart';

class PremiumHeroBanner extends StatefulWidget {
  final List<String> images;
  final List<String> titles;
  final List<VoidCallback>? onTapCallbacks;

  const PremiumHeroBanner({
    super.key,
    required this.images,
    required this.titles,
    this.onTapCallbacks,
  });

  @override
  State<PremiumHeroBanner> createState() => _PremiumHeroBannerState();
}

class _PremiumHeroBannerState extends State<PremiumHeroBanner> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  @override
  void initState() {
    super.initState();
    _autoScroll();
  }

  void _autoScroll() {
    Future.delayed(const Duration(seconds: 4), () {
      if (mounted && _pageController.hasClients) {
        if (_currentPage < widget.images.length - 1) {
          _currentPage++;
        } else {
          _currentPage = 0;
        }
        _pageController.animateToPage(
          _currentPage,
          duration: const Duration(milliseconds: 500),
          curve: Curves.easeInOut,
        );
        _autoScroll();
      }
    });
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SizedBox(
          height: 200,
          child: PageView.builder(
            controller: _pageController,
            onPageChanged: (index) {
              setState(() => _currentPage = index);
            },
            itemCount: widget.images.length,
            itemBuilder: (context, index) {
              return GestureDetector(
                onTap: widget.onTapCallbacks != null && index < widget.onTapCallbacks!.length
                    ? widget.onTapCallbacks![index]
                    : null,
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 16),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(AppDesignSystem.xlRadius),
                    gradient: AppDesignSystem.cardGradient,
                    boxShadow: AppDesignSystem.premiumShadow,
                  ),
                  child: Stack(
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(AppDesignSystem.xlRadius),
                        child: Image.network(
                          widget.images[index],
                          fit: BoxFit.cover,
                          width: double.infinity,
                          height: double.infinity,
                          errorBuilder: (context, error, stackTrace) {
                            return Container(
                              decoration: BoxDecoration(
                                gradient: AppDesignSystem.primaryGradient,
                                borderRadius: BorderRadius.circular(AppDesignSystem.xlRadius),
                              ),
                              child: const Icon(
                                Icons.sports_kabaddi,
                                size: 80,
                                color: Colors.white30,
                              ),
                            );
                          },
                        ),
                      ),
                      Container(
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(AppDesignSystem.xlRadius),
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              Colors.transparent,
                              Colors.transparent,
                              Colors.black.withOpacity(0.7),
                            ],
                          ),
                        ),
                      ),
                      Positioned(
                        bottom: 20,
                        left: 20,
                        right: 20,
                        child: Text(
                          widget.titles[index],
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ).animate().fadeIn(duration: AppDesignSystem.normalAnimation).slideX(
          begin: 0.2,
          end: 0,
          curve: AppDesignSystem.smoothCurve,
        ),
        const SizedBox(height: 16),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: SmoothPageIndicator(
            controller: _pageController,
            count: widget.images.length,
            effect: WormEffect(
              dotWidth: 8,
              dotHeight: 8,
              spacing: 8,
              activeDotColor: AppDesignSystem.gold,
              dotColor: AppDesignSystem.mutedText.withOpacity(0.3),
            ),
          ),
        ),
      ],
    );
  }
}
