import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../domain/entities/story.dart';

class StoryBar extends StatelessWidget {
  final List<Story> stories;

  const StoryBar({super.key, required this.stories});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 110,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: stories.length,
        itemBuilder: (context, index) {
          final story = stories[index];
          final isSeen = story.isSeen ?? false;
          return Padding(
            padding: const EdgeInsets.only(right: 12),
            child: GestureDetector(
              onTap: () {
                _openStoryViewer(context, stories, index);
              },
              child: Column(
                children: [
                  Container(
                    width: 70,
                    height: 70,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: LinearGradient(
                        colors: isSeen
                            ? [
                                Colors.grey.withOpacity(0.3),
                                Colors.grey.withOpacity(0.1),
                              ]
                            : [
                                const Color(0xFFF4B400),
                                const Color(0xFFFFD700),
                                const Color(0xFFB000FF),
                              ],
                      ),
                      border: Border.all(
                        color: isSeen ? Colors.grey : const Color(0xFFF4B400),
                        width: 3,
                      ),
                      boxShadow: isSeen
                          ? null
                          : [
                              BoxShadow(
                                color: const Color(0xFFF4B400).withOpacity(0.4),
                                blurRadius: 15,
                                spreadRadius: 2,
                              ),
                            ],
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(3),
                      child: ClipOval(
                        child: story.thumbnail != null
                            ? Image.network(
                                story.thumbnail!,
                                fit: BoxFit.cover,
                                errorBuilder: (context, error, stackTrace) {
                                  return Container(
                                    decoration: BoxDecoration(
                                      gradient: LinearGradient(
                                        colors: [
                                          const Color(0xFF4C085D),
                                          const Color(0xFF6F1AB6),
                                        ],
                                      ),
                                    ),
                                    child: const Icon(Icons.image, color: Colors.white54),
                                  );
                                },
                              )
                            : Container(
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    colors: [
                                      const Color(0xFF4C085D),
                                      const Color(0xFF6F1AB6),
                                    ],
                                  ),
                                ),
                                child: const Icon(Icons.image, color: Colors.white54),
                              ),
                      ),
                    ),
                  ).animate().scale(duration: 300.ms, delay: (index * 50).ms),
                  const SizedBox(height: 6),
                  SizedBox(
                    width: 70,
                    child: Text(
                      story.title ?? 'Story',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: isSeen ? FontWeight.normal : FontWeight.bold,
                        color: isSeen ? Colors.white54 : Colors.white,
                      ),
                      textAlign: TextAlign.center,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  void _openStoryViewer(BuildContext context, List<Story> stories, int initialIndex) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => StoryViewer(
          stories: stories,
          initialIndex: initialIndex,
        ),
      ),
    );
  }
}

class StoryViewer extends StatefulWidget {
  final List<Story> stories;
  final int initialIndex;

  const StoryViewer({
    super.key,
    required this.stories,
    required this.initialIndex,
  });

  @override
  State<StoryViewer> createState() => _StoryViewerState();
}

class _StoryViewerState extends State<StoryViewer> {
  late PageController _pageController;
  late int _currentIndex;
  bool _isPaused = false;

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
    _pageController = PageController(initialPage: widget.initialIndex);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: GestureDetector(
        onTap: () {
          setState(() {
            _isPaused = !_isPaused;
          });
        },
        child: Stack(
          children: [
            // Story Content
            PageView.builder(
              controller: _pageController,
              onPageChanged: (index) {
                setState(() {
                  _currentIndex = index;
                });
              },
              itemCount: widget.stories.length,
              itemBuilder: (context, index) {
                final story = widget.stories[index];
                return _buildStoryContent(story);
              },
            ),
            // Progress Indicators
            Positioned(
              top: MediaQuery.of(context).padding.top + 16,
              left: 16,
              right: 16,
              child: Row(
                children: List.generate(
                  widget.stories.length,
                  (index) => Expanded(
                    child: Container(
                      margin: const EdgeInsets.symmetric(horizontal: 2),
                      height: 3,
                      decoration: BoxDecoration(
                        color: index < _currentIndex
                            ? Colors.white
                            : index == _currentIndex
                                ? Colors.white
                                : Colors.white.withOpacity(0.3),
                        borderRadius: BorderRadius.circular(2),
                      ),
                      child: index == _currentIndex && !_isPaused
                          ? LinearProgressIndicator(
                              backgroundColor: Colors.transparent,
                              valueColor: const AlwaysStoppedAnimation<Color>(Colors.white),
                            )
                          : null,
                    ),
                  ),
                ),
              ),
            ),
            // Header
            Positioned(
              top: MediaQuery.of(context).padding.top + 30,
              left: 16,
              right: 16,
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 20,
                    backgroundColor: Colors.white.withOpacity(0.2),
                    child: const Icon(Icons.person, color: Colors.white),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          widget.stories[_currentIndex].title ?? 'Story',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          '2 hours ago',
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.7),
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: Colors.white),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
            ),
            // Pause Indicator
            if (_isPaused)
              const Center(
                child: Icon(
                  Icons.pause_circle_outline,
                  size: 60,
                  color: Colors.white,
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildStoryContent(Story story) {
    return Container(
      color: Colors.black,
      child: story.thumbnail != null
          ? Image.network(
              story.thumbnail!,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) {
                return Container(
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Color(0xFF4C085D),
                        Color(0xFF6F1AB6),
                      ],
                    ),
                  ),
                  child: const Center(
                    child: Icon(Icons.image, size: 100, color: Colors.white54),
                  ),
                );
              },
            )
          : Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    Color(0xFF4C085D),
                    Color(0xFF6F1AB6),
                  ],
                ),
              ),
              child: const Center(
                child: Icon(Icons.image, size: 100, color: Colors.white54),
              ),
            ),
    );
  }
}
