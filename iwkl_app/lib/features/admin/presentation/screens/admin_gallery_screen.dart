import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../data/models/admin_gallery_model.dart';

class AdminGalleryScreen extends StatefulWidget {
  const AdminGalleryScreen({super.key});

  @override
  State<AdminGalleryScreen> createState() => _AdminGalleryScreenState();
}

class _AdminGalleryScreenState extends State<AdminGalleryScreen> {
  final List<AdminGalleryModel> _gallery = [];
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadGallery();
  }

  void _loadGallery() {
    setState(() {
      _gallery.addAll([
        AdminGalleryModel(
          id: '1',
          image: 'gallery/gallery_1.png',
          title: 'IWKL Gallery 1',
          category: 'Match',
          tags: ['match', 'gallery'],
          featured: true,
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        ),
        AdminGalleryModel(
          id: '2',
          image: 'gallery/gallery_2.png',
          title: 'IWKL Gallery 2',
          category: 'Match',
          tags: ['match', 'gallery'],
          featured: true,
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        ),
        AdminGalleryModel(
          id: '3',
          image: 'gallery/gallery_3.jpg',
          title: 'IWKL Gallery 3',
          category: 'Match',
          tags: ['match', 'gallery'],
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
      appBar: AppBar(backgroundColor: const Color(0xFF13051E), elevation: 0, title: const Text('Gallery Management', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)), leading: IconButton(icon: const Icon(Icons.arrow_back, color: Colors.white), onPressed: () => Navigator.pop(context)), actions: [IconButton(icon: const Icon(Icons.add, color: Colors.white), onPressed: () => _showGalleryForm())]),
      body: Column(
        children: [
          Padding(padding: const EdgeInsets.all(16), child: Container(decoration: BoxDecoration(gradient: LinearGradient(colors: [Colors.white.withOpacity(0.05), Colors.white.withOpacity(0.02)]), borderRadius: BorderRadius.circular(12), border: Border.all(color: const Color(0xFF9333EA).withOpacity(0.3))), child: TextField(controller: _searchController, style: const TextStyle(color: Colors.white), decoration: const InputDecoration(hintText: 'Search...', hintStyle: TextStyle(color: Colors.white54), prefixIcon: Icon(Icons.search, color: Color(0xFF9333EA)), border: InputBorder.none, contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12)), onChanged: (v) => setState(() {})))),
          Expanded(child: GridView.builder(padding: const EdgeInsets.all(16), gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2, mainAxisSpacing: 16, crossAxisSpacing: 16, childAspectRatio: 1), itemCount: _gallery.length, itemBuilder: (context, index) {
            final item = _gallery[index];
            return Container(decoration: BoxDecoration(gradient: LinearGradient(colors: [Colors.white.withOpacity(0.05), Colors.white.withOpacity(0.02)]), borderRadius: BorderRadius.circular(16), border: Border.all(color: const Color(0xFF9333EA).withOpacity(0.3))), child: Column(children: [
              Expanded(child: Container(decoration: BoxDecoration(color: const Color(0xFF4C085D).withOpacity(0.5), borderRadius: const BorderRadius.only(topLeft: Radius.circular(16), topRight: Radius.circular(16))), child: const Icon(Icons.photo_library, size: 40, color: Colors.white54))),
              Padding(padding: const EdgeInsets.all(12), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(item.title, style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold), maxLines: 1, overflow: TextOverflow.ellipsis),
                const SizedBox(height: 4),
                Text(item.category, style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 12)),
                const SizedBox(height: 8),
                Row(
                  children: [
                    if (item.featured) const Icon(Icons.star, size: 14, color: Colors.amber),
                    const Spacer(),
                    IconButton(
                      icon: const Icon(Icons.more_vert, color: Colors.white70),
                      onPressed: () => _showGalleryMenu(item),
                    ),
                  ],
                ),
              ])),
            ]));
          })),
        ],
      ),
    );
  }

  void _showGalleryMenu(AdminGalleryModel item) {
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
              _showGalleryForm(item: item);
            },
          ),
          ListTile(
            leading: Icon(item.featured ? Icons.star_border : Icons.star, color: Colors.amber),
            title: Text(item.featured ? 'Unfeature' : 'Feature', style: const TextStyle(color: Colors.white)),
            onTap: () {
              Navigator.pop(context);
              setState(() {
                final i = _gallery.indexWhere((g) => g.id == item.id);
                if (i != -1) _gallery[i] = item.copyWith(featured: !item.featured, updatedAt: DateTime.now());
              });
            },
          ),
          ListTile(
            leading: const Icon(Icons.delete, color: Colors.red),
            title: const Text('Delete', style: TextStyle(color: Colors.white)),
            onTap: () {
              Navigator.pop(context);
              setState(() => _gallery.removeWhere((g) => g.id == item.id));
            },
          ),
        ]),
      ),
    );
  }

  void _showGalleryForm({AdminGalleryModel? item}) {
    Navigator.push(context, MaterialPageRoute(builder: (context) => GalleryFormScreen(item: item))).then((_) => _loadGallery());
  }
}

class GalleryFormScreen extends StatefulWidget {
  final AdminGalleryModel? item;
  const GalleryFormScreen({super.key, this.item});

  @override
  State<GalleryFormScreen> createState() => _GalleryFormScreenState();
}

class _GalleryFormScreenState extends State<GalleryFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _categoryController = TextEditingController();
  final _tagsController = TextEditingController();
  bool _featured = false;

  @override
  void initState() {
    super.initState();
    if (widget.item != null) {
      _titleController.text = widget.item!.title;
      _categoryController.text = widget.item!.category;
      _tagsController.text = widget.item!.tags.join(', ');
      _featured = widget.item!.featured;
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _categoryController.dispose();
    _tagsController.dispose();
    super.dispose();
  }

  void _save() {
    if (_formKey.currentState!.validate()) {
      final gallery = AdminGalleryModel(
        id: widget.item?.id ?? DateTime.now().millisecondsSinceEpoch.toString(),
        image: '',
        title: _titleController.text,
        category: _categoryController.text,
        tags: _tagsController.text.split(',').map((e) => e.trim()).toList(),
        featured: _featured,
        createdAt: widget.item?.createdAt ?? DateTime.now(),
        updatedAt: DateTime.now(),
      );
      Navigator.pop(context, gallery);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF13051E),
      appBar: AppBar(backgroundColor: const Color(0xFF13051E), elevation: 0, title: Text(widget.item == null ? 'Add Image' : 'Edit Image', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)), leading: IconButton(icon: const Icon(Icons.arrow_back, color: Colors.white), onPressed: () => Navigator.pop(context)), actions: [TextButton(onPressed: _save, child: const Text('Save', style: TextStyle(color: Color(0xFF9333EA), fontWeight: FontWeight.bold)))]),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            _buildField(_titleController, 'Title *', validator: (v) => v?.isEmpty ?? true ? 'Required' : null),
            const SizedBox(height: 16),
            _buildField(_categoryController, 'Category *', validator: (v) => v?.isEmpty ?? true ? 'Required' : null),
            const SizedBox(height: 16),
            _buildField(_tagsController, 'Tags (comma separated)'),
            const SizedBox(height: 16),
            SwitchListTile(title: const Text('Featured', style: TextStyle(color: Colors.white)), value: _featured, onChanged: (v) => setState(() => _featured = v)),
            const SizedBox(height: 32),
            SizedBox(width: double.infinity, height: 50, child: ElevatedButton(onPressed: _save, style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF9333EA), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))), child: const Text('Save', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)))),
          ]),
        ),
      ),
    );
  }

  Widget _buildField(TextEditingController controller, String label, {String? Function(String?)? validator}) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: const TextStyle(color: Colors.white70, fontSize: 14, fontWeight: FontWeight.w500)),
      const SizedBox(height: 8),
      TextFormField(controller: controller, style: const TextStyle(color: Colors.white), validator: validator, decoration: InputDecoration(filled: true, fillColor: Colors.white.withOpacity(0.05), border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: const Color(0xFF9333EA).withOpacity(0.3))), contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12))),
    ]);
  }
}
