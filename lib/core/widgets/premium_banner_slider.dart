import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';
import '../constants/app_constants.dart';

class PremiumBannerSlider extends StatefulWidget {
  final List<BannerItem> banners;
  final Function(BannerItem)? onBannerTap;

  const PremiumBannerSlider({
    super.key,
    required this.banners,
    this.onBannerTap,
  });

  @override
  State<PremiumBannerSlider> createState() => _PremiumBannerSliderState();
}

class _PremiumBannerSliderState extends State<PremiumBannerSlider> {
  final CarouselSliderController _carouselController = CarouselSliderController();
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    if (widget.banners.isEmpty) {
      return const SizedBox.shrink();
    }

    return Column(
      children: [
        // Banner Slider
        CarouselSlider.builder(
          carouselController: _carouselController,
          options: CarouselOptions(
            height: 220,
            viewportFraction: 0.92,
            enlargeCenterPage: true,
            autoPlay: true,
            autoPlayInterval: const Duration(seconds: 5),
            autoPlayAnimationDuration: const Duration(milliseconds: 800),
            autoPlayCurve: Curves.easeInOutCubic,
            enlargeFactor: 0.15,
            onPageChanged: (index, reason) {
              setState(() {
                _currentIndex = index;
              });
            },
          ),
          itemCount: widget.banners.length,
          itemBuilder: (context, index, realIndex) {
            final banner = widget.banners[index];
            return _buildBannerItem(context, banner, index);
          },
        ),
        const SizedBox(height: 16),
        
        // Page Indicator
        SmoothPageIndicator(
          controller: _carouselController,
          count: widget.banners.length,
          effect: WormEffect(
            dotWidth: 8,
            dotHeight: 8,
            activeDotColor: const Color(AppConstants.accentColorValue),
            dotColor: Colors.white.withOpacity(0.3),
            spacing: 8,
          ),
        ),
      ],
    );
  }

  Widget _buildBannerItem(BuildContext context, BannerItem banner, int index) {
    return GestureDetector(
      onTap: () => widget.onBannerTap?.call(banner),
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 8),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: const Color(AppConstants.primaryColorValue).withOpacity(0.4),
              blurRadius: 30,
              spreadRadius: 5,
              offset: const Offset(0, 10),
            ),
            BoxShadow(
              color: Colors.black.withOpacity(0.3),
              blurRadius: 20,
              offset: const Offset(0, 5),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(20),
          child: Stack(
            children: [
              // Banner Image with Parallax Effect
              banner.imageUrl != null
                  ? CachedNetworkImage(
                      imageUrl: banner.imageUrl!,
                      fit: BoxFit.cover,
                      width: double.infinity,
                      height: double.infinity,
                      placeholder: (context, url) => Container(
                        gradient: LinearGradient(
                          colors: [
                            const Color(AppConstants.primaryColorValue),
                            const Color(AppConstants.secondaryColorValue),
                          ],
                        ),
                        child: const Center(
                          child: CircularProgressIndicator(
                            color: Color(AppConstants.accentColorValue),
                          ),
                        ),
                      ),
                      errorWidget: (context, url, error) => Container(
                        gradient: LinearGradient(
                          colors: [
                            const Color(AppConstants.primaryColorValue),
                            const Color(AppConstants.secondaryColorValue),
                          ],
                        ),
                        child: const Icon(
                          Icons.image,
                          size: 60,
                          color: Colors.white54,
                        ),
                      ),
                    )
                  : Container(
                      gradient: LinearGradient(
                        colors: [
                          const Color(AppConstants.primaryColorValue),
                          const Color(AppConstants.secondaryColorValue),
                        ],
                      ),
                      child: const Icon(
                        Icons.image,
                        size: 60,
                        color: Colors.white54,
                      ),
                    ),
              
              // Gradient Overlay
              Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.transparent,
                      Colors.black.withOpacity(0.3),
                      Colors.black.withOpacity(0.7),
                    ],
                  ),
                ),
              ),
              
              // Content
              Positioned(
                bottom: 20,
                left: 20,
                right: 20,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (banner.title != null)
                      Text(
                        banner.title!,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          shadows: [
                            Shadow(
                              color: Colors.black,
                              blurRadius: 10,
                              offset: Offset(0, 2),
                            ),
                          ],
                        ),
                      ),
                    if (banner.subtitle != null)
                      Padding(
                        padding: const EdgeInsets.only(top: 8),
                        child: Text(
                          banner.subtitle!,
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.9),
                            fontSize: 14,
                            shadows: [
                              Shadow(
                                color: Colors.black,
                                blurRadius: 8,
                                offset: Offset(0, 1),
                              ),
                            ],
                          ),
                        ),
                      ),
                  ],
                ),
              ),
              
              // Season Badge
              Positioned(
                top: 16,
                right: 16,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        const Color(AppConstants.accentColorValue),
                        const Color(AppConstants.accentColorValue).withOpacity(0.7),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(AppConstants.accentColorValue).withOpacity(0.5),
                        blurRadius: 10,
                        spreadRadius: 2,
                      ),
                    ],
                  ),
                  child: Text(
                    AppConstants.seasonName,
                    style: const TextStyle(
                      color: Colors.black,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ).animate().fadeIn(duration: 400.ms).scale(),
    );
  }
}

class BannerItem {
  final String? imageUrl;
  final String? title;
  final String? subtitle;
  final String? link;

  BannerItem({
    this.imageUrl,
    this.title,
    this.subtitle,
    this.link,
  });

  factory BannerItem.fromJson(Map<String, dynamic> json) {
    return BannerItem(
      imageUrl: json['imageUrl'] as String?,
      title: json['title'] as String?,
      subtitle: json['subtitle'] as String?,
      link: json['link'] as String?,
    );
  }
}
