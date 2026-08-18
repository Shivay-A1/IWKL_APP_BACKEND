import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../data/models/admin_video_model.dart';

class AdminVideosScreen extends StatefulWidget {
  const AdminVideosScreen({super.key});

  @override
  State<AdminVideosScreen> createState() => _AdminVideosScreenState();
}

class _AdminVideosScreenState extends State<AdminVideosScreen> {
  final List<AdminVideoModel> _videos = [];
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadVideos();
  }

  void _loadVideos() {
    setState(() {
      _videos.addAll([
        AdminVideoModel(
          id: '1',
          thumbnail: 'https://img.youtube.com/vi/E8YS-cPPdZY/hqdefault.jpg',
          videoUrl: 'https://youtube.com/shorts/E8YS-cPPdZY?si=JgGJfcXqrXCRqWK9',
          title: 'IWKL Highlight 1',
          description: 'Match highlight video',
          category: 'Highlights',
          duration: '00:30',
          featured: true,
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        ),
        AdminVideoModel(
          id: '2',
          thumbnail: 'https://img.youtube.com/vi/YZjFff0rfqE/hqdefault.jpg',
          videoUrl: 'https://youtube.com/shorts/YZjFff0rfqE?si=9YAFEtAKNtyH_IQP',
          title: 'IWKL Highlight 2',
          description: 'Match highlight video',
          category: 'Highlights',
          duration: '00:30',
          featured: true,
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        ),
        AdminVideoModel(
          id: '3',
          thumbnail: 'https://img.youtube.com/vi/KMIeFlYcPg0/hqdefault.jpg',
          videoUrl: 'https://youtube.com/shorts/KMIeFlYcPg0?si=n45a687cXbkcnQb6',
          title: 'IWKL Highlight 3',
          description: 'Match highlight video',
          category: 'Highlights',
          duration: '00:30',
          featured: true,
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        ),
      ]);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF13051E),
      appBar: AppBar(backgroundColor: const Color(0xFF13051E), elevation: 0, title: const Text('Videos Management', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)), leading: IconButton(icon: const Icon(Icons.arrow_back, color: Colors.white), onPressed: () => Navigator.pop(context)), actions: [IconButton(icon: const Icon(Icons.add, color: Colors.white), onPressed: () => _showVideoForm())]),
      body: Column(
        children: [
          Padding(padding: const EdgeInsets.all(16), child: Container(decoration: BoxDecoration(gradient: LinearGradient(colors: [Colors.white.withOpacity(0.05), Colors.white.withOpacity(0.02)]), borderRadius: BorderRadius.circular(12), border: Border.all(color: const Color(0xFF9333EA).withOpacity(0.3))), child: TextField(controller: _searchController, style: const TextStyle(color: Colors.white), decoration: const InputDecoration(hintText: 'Search...', hintStyle: TextStyle(color: Colors.white54), prefixIcon: Icon(Icons.search, color: Color(0xFF9333EA)), border: InputBorder.none, contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12)), onChanged: (v) => setState(() {})))),
          Expanded(child: ListView.builder(padding: const EdgeInsets.symmetric(horizontal: 16), itemCount: _videos.length, itemBuilder: (context, index) {
            final video = _videos[index];
            return Container(margin: const EdgeInsets.only(bottom: 12), padding: const EdgeInsets.all(16), decoration: BoxDecoration(gradient: LinearGradient(colors: [Colors.white.withOpacity(0.05), Colors.white.withOpacity(0.02)]), borderRadius: BorderRadius.circular(16), border: Border.all(color: const Color(0xFF9333EA).withOpacity(0.3))), child: Row(children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: video.thumbnail.isNotEmpty
                    ? Image.network(
                        video.thumbnail,
                        width: 100,
                        height: 60,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          return Container(width: 100, height: 60, decoration: BoxDecoration(color: const Color(0xFF4C085D).withOpacity(0.5), borderRadius: BorderRadius.circular(8)), child: const Icon(Icons.play_circle, size: 30, color: Colors.white54));
                        },
                      )
                    : Container(width: 100, height: 60, decoration: BoxDecoration(color: const Color(0xFF4C085D).withOpacity(0.5), borderRadius: BorderRadius.circular(8)), child: const Icon(Icons.play_circle, size: 30, color: Colors.white54)),
              ),
              const SizedBox(width: 16),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(video.title, style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text(video.category, style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 12)),
                const SizedBox(height: 4),
                Text('${video.duration} • ${video.featured ? 'Featured' : ''}', style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 11)),
              ])),
              IconButton(icon: const Icon(Icons.more_vert, color: Colors.white70), onPressed: () => _showVideoMenu(video)),
            ]));
          })),
        ],
      ),
    );
  }

  void _showVideoMenu(AdminVideoModel video) {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF1E1E2E),
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (context) => Container(
        padding: const EdgeInsets.all(20),
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          ListTile(
            leading: const Icon(Icons.edit, color: Color(0xFF9333EA)),
            title: const Text('Edit', style: TextStyle(color: Colors.white)),
            onTap: () {
              Navigator.pop(context);
              _showVideoForm(video: video);
            },
          ),
          ListTile(
            leading: Icon(video.featured ? Icons.star_border : Icons.star, color: Colors.amber),
            title: Text(video.featured ? 'Unfeature' : 'Feature', style: const TextStyle(color: Colors.white)),
            onTap: () {
              Navigator.pop(context);
              setState(() {
                final i = _videos.indexWhere((v) => v.id == video.id);
                if (i != -1) _videos[i] = video.copyWith(featured: !video.featured, updatedAt: DateTime.now());
              });
            },
          ),
          ListTile(
            leading: const Icon(Icons.delete, color: Colors.red),
            title: const Text('Delete', style: TextStyle(color: Colors.white)),
            onTap: () {
              Navigator.pop(context);
              setState(() => _videos.removeWhere((v) => v.id == video.id));
            },
          ),
        ]),
      ),
    );
  }

  void _showVideoForm({AdminVideoModel? video}) {
    Navigator.push(context, MaterialPageRoute(builder: (context) => VideoFormScreen(video: video))).then((_) => _loadVideos());
  }
}

class VideoFormScreen extends StatefulWidget {
  final AdminVideoModel? video;
  const VideoFormScreen({super.key, this.video});

  @override
  State<VideoFormScreen> createState() => _VideoFormScreenState();
}

class _VideoFormScreenState extends State<VideoFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _categoryController = TextEditingController();
  final _durationController = TextEditingController(text: '00:00');
  final _videoUrlController = TextEditingController();
  bool _featured = false;

  @override
  void initState() {
    super.initState();
    if (widget.video != null) {
      _titleController.text = widget.video!.title;
      _descriptionController.text = widget.video!.description;
      _categoryController.text = widget.video!.category;
      _durationController.text = widget.video!.duration;
      _videoUrlController.text = widget.video!.videoUrl;
      _featured = widget.video!.featured;
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _categoryController.dispose();
    _durationController.dispose();
    _videoUrlController.dispose();
    super.dispose();
  }

  void _save() {
    if (_formKey.currentState!.validate()) {
      final video = AdminVideoModel(
        id: widget.video?.id ?? DateTime.now().millisecondsSinceEpoch.toString(),
        thumbnail: '',
        videoUrl: _videoUrlController.text,
        title: _titleController.text,
        description: _descriptionController.text,
        category: _categoryController.text,
        duration: _durationController.text,
        featured: _featured,
        createdAt: widget.video?.createdAt ?? DateTime.now(),
        updatedAt: DateTime.now(),
      );
      Navigator.pop(context, video);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF13051E),
      appBar: AppBar(backgroundColor: const Color(0xFF13051E), elevation: 0, title: Text(widget.video == null ? 'Add Video' : 'Edit Video', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)), leading: IconButton(icon: const Icon(Icons.arrow_back, color: Colors.white), onPressed: () => Navigator.pop(context)), actions: [TextButton(onPressed: _save, child: const Text('Save', style: TextStyle(color: Color(0xFF9333EA), fontWeight: FontWeight.bold)))]),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            _buildField(_titleController, 'Title *', validator: (v) => v?.isEmpty ?? true ? 'Required' : null),
            const SizedBox(height: 16),
            _buildField(_descriptionController, 'Description *', maxLines: 3, validator: (v) => v?.isEmpty ?? true ? 'Required' : null),
            const SizedBox(height: 16),
            _buildField(_categoryController, 'Category *', validator: (v) => v?.isEmpty ?? true ? 'Required' : null),
            const SizedBox(height: 16),
            _buildField(_durationController, 'Duration (MM:SS) *', validator: (v) => v?.isEmpty ?? true ? 'Required' : null),
            const SizedBox(height: 16),
            _buildField(_videoUrlController, 'Video URL *', validator: (v) => v?.isEmpty ?? true ? 'Required' : null),
            const SizedBox(height: 16),
            SwitchListTile(title: const Text('Featured', style: TextStyle(color: Colors.white)), value: _featured, onChanged: (v) => setState(() => _featured = v)),
            const SizedBox(height: 32),
            SizedBox(width: double.infinity, height: 50, child: ElevatedButton(onPressed: _save, style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF9333EA), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))), child: const Text('Save', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)))),
          ]),
        ),
      ),
    );
  }

  Widget _buildField(TextEditingController controller, String label, {int maxLines = 1, String? Function(String?)? validator}) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: const TextStyle(color: Colors.white70, fontSize: 14, fontWeight: FontWeight.w500)),
      const SizedBox(height: 8),
      TextFormField(controller: controller, style: const TextStyle(color: Colors.white), maxLines: maxLines, validator: validator, decoration: InputDecoration(filled: true, fillColor: Colors.white.withOpacity(0.05), border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: const Color(0xFF9333EA).withOpacity(0.3))), contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12))),
    ]);
  }
}
