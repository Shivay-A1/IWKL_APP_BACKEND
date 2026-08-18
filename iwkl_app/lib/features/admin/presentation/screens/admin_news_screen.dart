import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../data/models/admin_news_model.dart';

class AdminNewsScreen extends StatefulWidget {
  const AdminNewsScreen({super.key});

  @override
  State<AdminNewsScreen> createState() => _AdminNewsScreenState();
}

class _AdminNewsScreenState extends State<AdminNewsScreen> {
  final List<AdminNewsModel> _news = [];
  final TextEditingController _searchController = TextEditingController();
  String _selectedStatus = 'all';

  @override
  void initState() {
    super.initState();
    _loadNews();
  }

  void _loadNews() {
    setState(() {
      _news.addAll([
        AdminNewsModel(
          id: '1',
          title: 'Gujarat Gems Win Thrilling Match',
          shortDescription: 'Gujarat Gems secured a stunning victory',
          content: 'Full news content here...',
          coverImage: '',
          category: 'Match Report',
          featured: true,
          published: true,
          publishedAt: DateTime.now(),
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        ),
      ]);
    });
  }

  List<AdminNewsModel> get _filteredNews {
    var news = _news;
    if (_searchController.text.isNotEmpty) {
      news = news.where((n) => n.title.toLowerCase().contains(_searchController.text.toLowerCase())).toList();
    }
    if (_selectedStatus == 'published') {
      news = news.where((n) => n.published).toList();
    } else if (_selectedStatus == 'draft') {
      news = news.where((n) => !n.published).toList();
    }
    return news;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF13051E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF13051E),
        elevation: 0,
        title: const Text('News Management', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        leading: IconButton(icon: const Icon(Icons.arrow_back, color: Colors.white), onPressed: () => Navigator.pop(context)),
        actions: [IconButton(icon: const Icon(Icons.add, color: Colors.white), onPressed: () => _showNewsForm())],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(gradient: LinearGradient(colors: [Colors.white.withOpacity(0.05), Colors.white.withOpacity(0.02)]), borderRadius: BorderRadius.circular(12), border: Border.all(color: const Color(0xFF9333EA).withOpacity(0.3))),
                    child: TextField(controller: _searchController, style: const TextStyle(color: Colors.white), decoration: const InputDecoration(hintText: 'Search news...', hintStyle: TextStyle(color: Colors.white54), prefixIcon: Icon(Icons.search, color: Color(0xFF9333EA)), border: InputBorder.none, contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12)), onChanged: (v) => setState(() {})),
                  ),
                ),
                const SizedBox(width: 12),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  decoration: BoxDecoration(gradient: LinearGradient(colors: [Colors.white.withOpacity(0.05), Colors.white.withOpacity(0.02)]), borderRadius: BorderRadius.circular(12), border: Border.all(color: const Color(0xFF9333EA).withOpacity(0.3))),
                  child: DropdownButtonHideUnderline(child: DropdownButton<String>(value: _selectedStatus, dropdownColor: const Color(0xFF1E1E2E), style: const TextStyle(color: Colors.white), items: const [DropdownMenuItem(value: 'all', child: Text('All')), DropdownMenuItem(value: 'published', child: Text('Published')), DropdownMenuItem(value: 'draft', child: Text('Draft'))], onChanged: (v) => setState(() => _selectedStatus = v ?? 'all'))),
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _filteredNews.length,
              itemBuilder: (context, index) {
                final item = _filteredNews[index];
                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(gradient: LinearGradient(colors: [Colors.white.withOpacity(0.05), Colors.white.withOpacity(0.02)]), borderRadius: BorderRadius.circular(16), border: Border.all(color: const Color(0xFF9333EA).withOpacity(0.3))),
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Row(children: [
                      Expanded(child: Text(item.title, style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold))),
                      IconButton(icon: const Icon(Icons.more_vert, color: Colors.white70), onPressed: () => _showNewsMenu(item)),
                    ]),
                    const SizedBox(height: 8),
                    Text(item.shortDescription, style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 13), maxLines: 2, overflow: TextOverflow.ellipsis),
                    const SizedBox(height: 8),
                    Row(children: [
                      Icon(Icons.category, size: 14, color: Colors.white54),
                      const SizedBox(width: 4),
                      Text(item.category, style: TextStyle(color: Colors.white54, fontSize: 12)),
                      const SizedBox(width: 16),
                      Icon(Icons.visibility, size: 14, color: Colors.white54),
                      const SizedBox(width: 4),
                      Text(item.published ? 'Published' : 'Draft', style: TextStyle(color: item.published ? Colors.green : Colors.orange, fontSize: 12)),
                      const Spacer(),
                      if (item.featured) const Icon(Icons.star, size: 14, color: Colors.amber),
                    ]),
                  ]),
                ).animate().fadeIn(duration: 300.ms, delay: (index * 50).ms);
              },
            ),
          ),
        ],
      ),
    );
  }

  void _showNewsMenu(AdminNewsModel news) {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF1E1E2E),
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (context) => Container(
        padding: const EdgeInsets.all(20),
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          ListTile(leading: const Icon(Icons.edit, color: Color(0xFF9333EA)), title: const Text('Edit News', style: TextStyle(color: Colors.white)), onTap: () {Navigator.pop(context); _showNewsForm(news: news);}),
          ListTile(leading: Icon(news.published ? Icons.visibility_off : Icons.visibility, color: Color(0xFF9333EA)), title: Text(news.published ? 'Unpublish' : 'Publish', style: const TextStyle(color: Colors.white)), onTap: () {Navigator.pop(context); _togglePublish(news);}),
          ListTile(leading: Icon(news.featured ? Icons.star_border : Icons.star, color: Colors.amber), title: Text(news.featured ? 'Unfeature' : 'Feature', style: const TextStyle(color: Colors.white)), onTap: () {Navigator.pop(context); _toggleFeatured(news);}),
          ListTile(leading: const Icon(Icons.delete, color: Colors.red), title: const Text('Delete', style: TextStyle(color: Colors.white)), onTap: () {Navigator.pop(context); _deleteNews(news);}),
        ]),
      ),
    );
  }

  void _showNewsForm({AdminNewsModel? news}) {
    Navigator.push(context, MaterialPageRoute(builder: (context) => NewsFormScreen(news: news))).then((_) => _loadNews());
  }

  void _togglePublish(AdminNewsModel news) {
    setState(() {
      final index = _news.indexWhere((n) => n.id == news.id);
      if (index != -1) _news[index] = news.copyWith(published: !news.published, publishedAt: !news.published ? DateTime.now() : news.publishedAt, updatedAt: DateTime.now());
    });
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('News ${news.published ? 'unpublished' : 'published'} successfully'), backgroundColor: const Color(0xFF4CAF50)));
  }

  void _toggleFeatured(AdminNewsModel news) {
    setState(() {
      final index = _news.indexWhere((n) => n.id == news.id);
      if (index != -1) _news[index] = news.copyWith(featured: !news.featured, updatedAt: DateTime.now());
    });
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Featured status updated'), backgroundColor: Color(0xFF4CAF50)));
  }

  void _deleteNews(AdminNewsModel news) {
    showDialog(context: context, builder: (context) => AlertDialog(backgroundColor: const Color(0xFF1E1E2E), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)), title: const Text('Delete News', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)), content: const Text('Are you sure?', style: TextStyle(color: Colors.white70)), actions: [TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel', style: TextStyle(color: Color(0xFF9333EA)))), ElevatedButton(onPressed: () {setState(() => _news.removeWhere((n) => n.id == news.id)); Navigator.pop(context); ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('News deleted'), backgroundColor: Color(0xFF4CAF50)));}, style: ElevatedButton.styleFrom(backgroundColor: Colors.red), child: const Text('Delete', style: TextStyle(color: Colors.white)))]));
  }
}

class NewsFormScreen extends StatefulWidget {
  final AdminNewsModel? news;
  const NewsFormScreen({super.key, this.news});

  @override
  State<NewsFormScreen> createState() => _NewsFormScreenState();
}

class _NewsFormScreenState extends State<NewsFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _shortDescController = TextEditingController();
  final _contentController = TextEditingController();
  final _categoryController = TextEditingController();
  bool _featured = false;
  bool _published = false;

  @override
  void initState() {
    super.initState();
    if (widget.news != null) {
      _titleController.text = widget.news!.title;
      _shortDescController.text = widget.news!.shortDescription;
      _contentController.text = widget.news!.content;
      _categoryController.text = widget.news!.category;
      _featured = widget.news!.featured;
      _published = widget.news!.published;
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _shortDescController.dispose();
    _contentController.dispose();
    _categoryController.dispose();
    super.dispose();
  }

  void _save() {
    if (_formKey.currentState!.validate()) {
      final news = AdminNewsModel(
        id: widget.news?.id ?? DateTime.now().millisecondsSinceEpoch.toString(),
        title: _titleController.text,
        shortDescription: _shortDescController.text,
        content: _contentController.text,
        coverImage: '',
        category: _categoryController.text,
        featured: _featured,
        published: _published,
        publishedAt: _published ? DateTime.now() : (widget.news?.publishedAt ?? DateTime.now()),
        createdAt: widget.news?.createdAt ?? DateTime.now(),
        updatedAt: DateTime.now(),
      );
      Navigator.pop(context, news);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(widget.news == null ? 'News created' : 'News updated'), backgroundColor: const Color(0xFF4CAF50)));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF13051E),
      appBar: AppBar(backgroundColor: const Color(0xFF13051E), elevation: 0, title: Text(widget.news == null ? 'Create News' : 'Edit News', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)), leading: IconButton(icon: const Icon(Icons.arrow_back, color: Colors.white), onPressed: () => Navigator.pop(context)), actions: [TextButton(onPressed: _save, child: const Text('Save', style: TextStyle(color: Color(0xFF9333EA), fontWeight: FontWeight.bold)))]),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            _buildField(_titleController, 'Title *', validator: (v) => v?.isEmpty ?? true ? 'Required' : null),
            const SizedBox(height: 16),
            _buildField(_shortDescController, 'Short Description *', validator: (v) => v?.isEmpty ?? true ? 'Required' : null),
            const SizedBox(height: 16),
            _buildField(_contentController, 'Content *', maxLines: 5, validator: (v) => v?.isEmpty ?? true ? 'Required' : null),
            const SizedBox(height: 16),
            _buildField(_categoryController, 'Category *', validator: (v) => v?.isEmpty ?? true ? 'Required' : null),
            const SizedBox(height: 16),
            SwitchListTile(title: const Text('Featured', style: TextStyle(color: Colors.white)), value: _featured, onChanged: (v) => setState(() => _featured = v)),
            SwitchListTile(title: const Text('Published', style: TextStyle(color: Colors.white)), value: _published, onChanged: (v) => setState(() => _published = v)),
            const SizedBox(height: 32),
            SizedBox(width: double.infinity, height: 50, child: ElevatedButton(onPressed: _save, style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF9333EA), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))), child: const Text('Save News', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)))),
          ]),
        ),
      ),
    );
  }

  Widget _buildField(TextEditingController controller, String label, {int maxLines = 1, String? Function(String?)? validator}) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: const TextStyle(color: Colors.white70, fontSize: 14, fontWeight: FontWeight.w500)),
      const SizedBox(height: 8),
      TextFormField(controller: controller, style: const TextStyle(color: Colors.white), maxLines: maxLines, validator: validator, decoration: InputDecoration(filled: true, fillColor: Colors.white.withOpacity(0.05), border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: const Color(0xFF9333EA).withOpacity(0.3))), enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: const Color(0xFF9333EA).withOpacity(0.3))), focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFF9333EA))), errorBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Colors.red)), contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12))),
    ]);
  }
}
