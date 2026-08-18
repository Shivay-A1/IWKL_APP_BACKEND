import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../core/theme/app_design_system.dart';
import '../../../../core/widgets/premium_widgets.dart';

class PremiumOTTScreen extends StatelessWidget {
  const PremiumOTTScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppDesignSystem.primaryBackground,
      body: CustomScrollView(
        slivers: [
          // Hero Banner
          SliverAppBar(
            expandedHeight: 280,
            pinned: true,
            backgroundColor: Colors.transparent,
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                children: [
                  // Hero Image
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          AppDesignSystem.primaryBackground,
                          Colors.black,
                        ],
                      ),
                    ),
                  ),
                  // Gradient Overlay
                  Positioned.fill(
                    child: Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            Colors.transparent,
                            Colors.transparent,
                            AppDesignSystem.primaryBackground,
                          ],
                        ),
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
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            gradient: AppDesignSystem.goldGradient,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Text(
                            'LIVE NOW',
                            style: TextStyle(
                              color: Colors.black,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),
                        const Text(
                          'IWKL Season 2026',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Watch all matches live and on-demand',
                          style: TextStyle(
                            color: AppDesignSystem.secondaryText,
                            fontSize: 14,
                          ),
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            ElevatedButton.icon(
                              onPressed: () {},
                              icon: const Icon(Icons.play_arrow, size: 18),
                              label: const Text('Watch Now'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppDesignSystem.primaryPurple,
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(20),
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            OutlinedButton.icon(
                              onPressed: () {},
                              icon: const Icon(Icons.info_outline, size: 18),
                              label: const Text('Info'),
                              style: OutlinedButton.styleFrom(
                                foregroundColor: Colors.white,
                                side: const BorderSide(color: Colors.white),
                                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(20),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Continue Watching
          SliverToBoxAdapter(
            child: _buildSection('Continue Watching'),
          ),
          SliverToBoxAdapter(
            child: _buildHorizontalVideoList(),
          ),

          // Live Matches
          SliverToBoxAdapter(
            child: _buildSection('Live Matches'),
          ),
          SliverToBoxAdapter(
            child: _buildHorizontalVideoList(),
          ),

          // Highlights
          SliverToBoxAdapter(
            child: _buildSection('Highlights'),
          ),
          SliverToBoxAdapter(
            child: _buildHorizontalVideoList(),
          ),

          // Exclusive Content
          SliverToBoxAdapter(
            child: _buildSection('Exclusive'),
          ),
          SliverToBoxAdapter(
            child: _buildHorizontalVideoList(),
          ),

          // Replay
          SliverToBoxAdapter(
            child: _buildSection('Replay'),
          ),
          SliverToBoxAdapter(
            child: _buildHorizontalVideoList(),
          ),
        ],
      ),
    );
  }

  Widget _buildSection(String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: AppDesignSystem.lgSpacing,
        vertical: AppDesignSystem.lgSpacing,
      ),
      child: Row(
        children: [
          Text(
            title,
            style: AppDesignSystem.mediumSectionTitle,
          ),
          const Spacer(),
          TextButton(
            onPressed: () {},
            child: const Text(
              'See All',
              style: TextStyle(
                color: AppDesignSystem.gold,
                fontSize: 14,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHorizontalVideoList() {
    return SizedBox(
      height: 180,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: AppDesignSystem.lgSpacing),
        itemCount: 6,
        itemBuilder: (context, index) {
          return _buildVideoCard(index);
        },
      ),
    );
  }

  Widget _buildVideoCard(int index) {
    return Container(
      width: 280,
      margin: const EdgeInsets.only(right: AppDesignSystem.mdSpacing),
      child: PremiumCard(
        onTap: () {
          // Play video
        },
        padding: EdgeInsets.zero,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Thumbnail
            Expanded(
              child: Stack(
                children: [
                  ClipRRect(
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(AppDesignSystem.xlRadius),
                      topRight: Radius.circular(AppDesignSystem.xlRadius),
                    ),
                    child: Container(
                      decoration: BoxDecoration(
                        gradient: AppDesignSystem.cardGradient,
                      ),
                      child: const Center(
                        child: Icon(
                          Icons.play_circle,
                          size: 50,
                          color: AppDesignSystem.mutedText,
                        ),
                      ),
                    ),
                  ),
                  // Duration Badge
                  Positioned(
                    top: 8,
                    right: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.7),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: const Text(
                        '1:30:45',
                        style: TextStyle(color: Colors.white, fontSize: 10),
                      ),
                    ),
                  ),
                  // Live Badge
                  if (index == 0)
                    Positioned(
                      top: 8,
                      left: 8,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [Colors.red, Colors.redAccent],
                          ),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: const Text(
                          'LIVE',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  // Play Button Overlay
                  const Center(
                    child: Icon(
                      Icons.play_circle_outline,
                      size: 60,
                      color: Colors.white70,
                    ),
                  ),
                ],
              ),
            ),
            // Info
            Padding(
              padding: const EdgeInsets.all(AppDesignSystem.mdSpacing),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Match ${index + 1}: Delhi vs Punjab',
                    style: AppDesignSystem.readableBody,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'IWKL Season 2026 • 2 days ago',
                    style: AppDesignSystem.softGreyCaption,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    ).animate().fadeIn(duration: AppDesignSystem.fastAnimation).scale(
      begin: const Offset(0.95, 0.95),
      end: const Offset(1, 1),
      curve: AppDesignSystem.smoothCurve,
      delay: Duration(milliseconds: index * 50),
    );
  }
}
