import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../home/presentation/bloc/home_bloc.dart';
import '../../../home/presentation/bloc/home_state.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
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

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF13051E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF13051E),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: Container(
          height: 45,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                const Color(0xFF4C085D).withOpacity(0.3),
                const Color(0xFF9333EA).withOpacity(0.3),
              ],
            ),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: const Color(0xFF9333EA).withOpacity(0.3),
              width: 1,
            ),
          ),
          child: TextField(
            controller: _searchController,
            style: const TextStyle(color: Colors.white),
            decoration: InputDecoration(
              hintText: 'Search...',
              hintStyle: TextStyle(color: Colors.white.withOpacity(0.5)),
              border: InputBorder.none,
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              suffixIcon: IconButton(
                icon: const Icon(Icons.search, color: Color(0xFF9333EA)),
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
          const SizedBox(height: 16),
          // Search Results
          Expanded(
            child: _buildSearchResults(),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryFilter() {
    return Container(
      height: 50,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: _categories.length,
        itemBuilder: (context, index) {
          final category = _categories[index];
          final isSelected = _selectedCategory == category;
          return Padding(
            padding: const EdgeInsets.only(right: 12),
            child: FilterChip(
              label: Text(category),
              selected: isSelected,
              onSelected: (selected) {
                setState(() {
                  _selectedCategory = category;
                });
              },
              selectedColor: const Color(0xFF9333EA),
              backgroundColor: const Color(0xFF4C085D).withOpacity(0.3),
              labelStyle: TextStyle(
                color: isSelected ? Colors.white : Colors.white70,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
                side: BorderSide(
                  color: isSelected ? const Color(0xFF9333EA) : Colors.transparent,
                  width: 1,
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildSearchResults() {
    final query = _searchController.text.toLowerCase();
    
    if (query.isEmpty) {
      return _buildEmptyState();
    }

    return BlocBuilder<HomeBloc, HomeState>(
      builder: (context, state) {
        if (state is HomeLoading) {
          return const Center(
            child: CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF9333EA)),
            ),
          );
        }

        if (state is HomeLoaded) {
          final results = _filterResults(state, query);
          
          if (results.isEmpty) {
            return _buildNoResults();
          }

          return ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: results.length,
            itemBuilder: (context, index) {
              return _buildResultItem(results[index])
                  .animate()
                  .fadeIn(duration: 300.ms, delay: (index * 50).ms)
                  .slideX(begin: -0.1);
            },
          );
        }

        return _buildEmptyState();
      },
    );
  }

  List<SearchResult> _filterResults(HomeLoaded state, String query) {
    final results = <SearchResult>[];

    if (_selectedCategory == 'All' || _selectedCategory == 'Teams') {
      for (final team in state.teams) {
        if (team['name']?.toString().toLowerCase().contains(query) ?? false) {
          results.add(SearchResult(
            type: 'Team',
            title: team['name']?.toString() ?? 'Team',
            subtitle: 'Team',
            icon: Icons.groups,
            onTap: () {
              Navigator.pushNamed(context, '/team-profile', arguments: team['id']);
            },
          ));
        }
      }
    }

    if (_selectedCategory == 'All' || _selectedCategory == 'Players') {
      for (final player in state.players) {
        if (player['name']?.toString().toLowerCase().contains(query) ?? false) {
          results.add(SearchResult(
            type: 'Player',
            title: player['name']?.toString() ?? 'Player',
            subtitle: player['teamName']?.toString() ?? 'Unknown Team',
            icon: Icons.person,
            onTap: () {
              Navigator.pushNamed(context, '/player-profile', arguments: player['id']);
            },
          ));
        }
      }
    }

    if (_selectedCategory == 'All' || _selectedCategory == 'Matches') {
      for (final match in state.upcomingMatches) {
        if (match.team1.toLowerCase().contains(query) ||
            match.team2.toLowerCase().contains(query)) {
          results.add(SearchResult(
            type: 'Match',
            title: '${match.team1} vs ${match.team2}',
            subtitle: match.date,
            icon: Icons.sports_cricket,
            onTap: () {
              Navigator.pushNamed(context, '/match-details', arguments: match.id);
            },
          ));
        }
      }
    }

    if (_selectedCategory == 'All' || _selectedCategory == 'News') {
      for (final news in state.news) {
        if (news.title.toLowerCase().contains(query)) {
          results.add(SearchResult(
            type: 'News',
            title: news.title,
            subtitle: news.date,
            icon: Icons.article,
            onTap: () {
              Navigator.pushNamed(context, '/news-detail', arguments: news.id);
            },
          ));
        }
      }
    }

    if (_selectedCategory == 'All' || _selectedCategory == 'Videos') {
      for (final video in state.videos) {
        if (video.title.toLowerCase().contains(query)) {
          results.add(SearchResult(
            type: 'Video',
            title: video.title,
            subtitle: video.durationString,
            icon: Icons.play_circle,
            onTap: () {
              Navigator.pushNamed(context, '/video-player', arguments: video.id);
            },
          ));
        }
      }
    }

    if (_selectedCategory == 'All' || _selectedCategory == 'Gallery') {
      for (final image in state.gallery) {
        if (image['caption']?.toString().toLowerCase().contains(query) ?? false) {
          results.add(SearchResult(
            type: 'Gallery',
            title: image['caption']?.toString() ?? 'Image',
            subtitle: image['date']?.toString() ?? 'Gallery',
            icon: Icons.photo_library,
            onTap: () {
              Navigator.pushNamed(context, '/gallery-view', arguments: image['id']);
            },
          ));
        }
      }
    }

    return results;
  }

  Widget _buildResultItem(SearchResult result) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            const Color(0xFF4C085D).withOpacity(0.3),
            const Color(0xFF9333EA).withOpacity(0.2),
          ],
        ),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: const Color(0xFF9333EA).withOpacity(0.3),
          width: 1,
        ),
      ),
      child: ListTile(
        leading: Container(
          width: 45,
          height: 45,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                const Color(0xFF4C085D),
                const Color(0xFF9333EA),
              ],
            ),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(
            result.icon,
            color: Colors.white,
            size: 24,
          ),
        ),
        title: Text(
          result.title,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        subtitle: Text(
          result.subtitle,
          style: TextStyle(
            color: Colors.white.withOpacity(0.6),
            fontSize: 13,
          ),
        ),
        trailing: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: const Color(0xFF9333EA).withOpacity(0.2),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Text(
            result.type,
            style: const TextStyle(
              color: Color(0xFF9333EA),
              fontSize: 11,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        onTap: result.onTap,
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.search,
            size: 80,
            color: Colors.white.withOpacity(0.2),
          ),
          const SizedBox(height: 16),
          Text(
            'Search for anything',
            style: TextStyle(
              color: Colors.white.withOpacity(0.5),
              fontSize: 18,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Players, Teams, Matches, News, Videos, Gallery',
            style: TextStyle(
              color: Colors.white.withOpacity(0.3),
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNoResults() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.search_off,
            size: 80,
            color: Colors.white.withOpacity(0.2),
          ),
          const SizedBox(height: 16),
          Text(
            'No results found',
            style: TextStyle(
              color: Colors.white.withOpacity(0.5),
              fontSize: 18,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Try a different search term',
            style: TextStyle(
              color: Colors.white.withOpacity(0.3),
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }
}

class SearchResult {
  final String type;
  final String title;
  final String subtitle;
  final IconData icon;
  final VoidCallback onTap;

  SearchResult({
    required this.type,
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.onTap,
  });
}
