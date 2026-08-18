import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import '../../../../core/theme/app_design_system.dart';
import '../../../../core/widgets/premium_widgets.dart';
import '../../../../core/theme/theme_provider.dart';

class PremiumSearchScreen extends StatefulWidget {
  const PremiumSearchScreen({super.key});

  @override
  State<PremiumSearchScreen> createState() => _PremiumSearchScreenState();
}

class _PremiumSearchScreenState extends State<PremiumSearchScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _selectedCategory = 'All';
  final List<String> _categories = [
    'All',
    'Players',
    'Teams',
    'Matches',
    'News',
    'Videos',
    'Gallery',
  ];

  final List<String> _recentSearches = [
    'Gujarat Gems',
    'Live Match',
    'Points Table',
    'Player Registration',
  ];

  final List<String> _suggestions = [
    'Delhi Warriors',
    'Punjab Wings',
    'Mumbai Strikers',
    'Kashmiri Queens',
    'Live Score',
    'Schedule',
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final isDarkMode = themeProvider.isDarkMode;
    
    return Scaffold(
      backgroundColor: isDarkMode ? AppDesignSystem.primaryBackground : Colors.grey[100],
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: isDarkMode ? Colors.white : Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
        title: Container(
          height: 50,
          decoration: AppDesignSystem.glassCardDecoration,
          child: TextField(
            controller: _searchController,
            style: AppDesignSystem.readableBody,
            decoration: InputDecoration(
              hintText: 'Search...',
              hintStyle: AppDesignSystem.softGreyCaption,
              border: InputBorder.none,
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              suffixIcon: IconButton(
                icon: const Icon(Icons.search, color: AppDesignSystem.primaryPurple),
                onPressed: () {
                  // Perform search
                },
              ),
            ),
            onChanged: (value) {
              setState(() {});
            },
          ),
        ),
      ),
      body: Column(
        children: [
          // Category Filter
          _buildCategoryFilter(),
          const SizedBox(height: AppDesignSystem.lgSpacing),
          // Search Content
          Expanded(
            child: _searchController.text.isEmpty
                ? _buildSuggestions()
                : _buildSearchResults(),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryFilter() {
    return SizedBox(
      height: 50,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: AppDesignSystem.lgSpacing),
        itemCount: _categories.length,
        itemBuilder: (context, index) {
          final category = _categories[index];
          final isSelected = _selectedCategory == category;
          return Padding(
            padding: const EdgeInsets.only(right: AppDesignSystem.smSpacing),
            child: GestureDetector(
              onTap: () => setState(() => _selectedCategory = category),
              child: AnimatedContainer(
                duration: AppDesignSystem.fastAnimation,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  gradient: isSelected ? AppDesignSystem.primaryGradient : null,
                  color: isSelected ? null : AppDesignSystem.cardBackground,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: isSelected
                        ? Colors.transparent
                        : AppDesignSystem.primaryPurple.withOpacity(0.3),
                    width: 1,
                  ),
                ),
                child: Text(
                  category,
                  style: TextStyle(
                    color: isSelected ? Colors.white : AppDesignSystem.secondaryText,
                    fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                    fontSize: 14,
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildSuggestions() {
    return ListView(
      padding: const EdgeInsets.all(AppDesignSystem.lgSpacing),
      children: [
        // Recent Searches
        if (_recentSearches.isNotEmpty) ...[
          Row(
            children: [
              const Text(
                'Recent Searches',
                style: AppDesignSystem.mediumSectionTitle,
              ),
              const Spacer(),
              TextButton(
                onPressed: () {
                  setState(() => _recentSearches.clear());
                },
                child: const Text(
                  'Clear',
                  style: TextStyle(color: AppDesignSystem.gold, fontSize: 12),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppDesignSystem.mdSpacing),
          Wrap(
            spacing: AppDesignSystem.smSpacing,
            runSpacing: AppDesignSystem.smSpacing,
            children: _recentSearches.map((search) {
              return GestureDetector(
                onTap: () {
                  _searchController.text = search;
                  setState(() {});
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 8,
                  ),
                  decoration: AppDesignSystem.glassCardDecoration,
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        Icons.history,
                        size: 14,
                        color: AppDesignSystem.mutedText,
                      ),
                      const SizedBox(width: 6),
                      Text(
                        search,
                        style: AppDesignSystem.softGreyCaption,
                      ),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: AppDesignSystem.xlSpacing),
        ],

        // Suggestions
        const Text(
          'Popular Searches',
          style: AppDesignSystem.mediumSectionTitle,
        ),
        const SizedBox(height: AppDesignSystem.mdSpacing),
        ..._suggestions.map((suggestion) {
          return _buildSuggestionItem(suggestion);
        }),
      ],
    );
  }

  Widget _buildSuggestionItem(String suggestion) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppDesignSystem.smSpacing),
      child: GestureDetector(
        onTap: () {
          _searchController.text = suggestion;
          setState(() {});
        },
        child: Row(
          children: [
            Icon(
              Icons.search,
              size: 20,
              color: AppDesignSystem.mutedText,
            ),
            const SizedBox(width: AppDesignSystem.mdSpacing),
            Expanded(
              child: Text(
                suggestion,
                style: AppDesignSystem.readableBody,
              ),
            ),
            Icon(
              Icons.arrow_forward_ios,
              size: 14,
              color: AppDesignSystem.mutedText,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSearchResults() {
    // Mock search results
    return ListView(
      padding: const EdgeInsets.all(AppDesignSystem.lgSpacing),
      children: [
        Text(
          'Results for "${_searchController.text}"',
          style: AppDesignSystem.mediumSectionTitle,
        ),
        const SizedBox(height: AppDesignSystem.lgSpacing),
        // Mock results
        _buildResultCard(
          type: 'Team',
          title: 'Delhi Warriors',
          subtitle: 'Team • Founded 2024',
          icon: Icons.groups,
        ),
        _buildResultCard(
          type: 'Player',
          title: 'Priya Sharma',
          subtitle: 'Player • All-Rounder',
          icon: Icons.person,
        ),
        _buildResultCard(
          type: 'Match',
          title: 'Delhi vs Punjab',
          subtitle: 'Match • Scheduled for tomorrow',
          icon: Icons.sports_kabaddi,
        ),
      ],
    );
  }

  Widget _buildResultCard({
    required String type,
    required String title,
    required String subtitle,
    required IconData icon,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppDesignSystem.mdSpacing),
      child: PremiumCard(
        padding: const EdgeInsets.all(AppDesignSystem.mdSpacing),
        child: Row(
          children: [
            Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                gradient: AppDesignSystem.primaryGradient,
                borderRadius: BorderRadius.circular(AppDesignSystem.mdRadius),
              ),
              child: Icon(icon, color: Colors.white, size: 24),
            ),
            const SizedBox(width: AppDesignSystem.mdSpacing),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: AppDesignSystem.readableBody,
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: AppDesignSystem.softGreyCaption,
                  ),
                ],
              ),
            ),
            Icon(
              Icons.arrow_forward_ios,
              color: AppDesignSystem.mutedText,
              size: 16,
            ),
          ],
        ),
      ),
    );
  }
}
