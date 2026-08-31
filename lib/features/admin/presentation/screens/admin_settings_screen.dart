import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../data/models/admin_settings_model.dart';

class AdminSettingsScreen extends StatefulWidget {
  const AdminSettingsScreen({super.key});

  @override
  State<AdminSettingsScreen> createState() => _AdminSettingsScreenState();
}

class _AdminSettingsScreenState extends State<AdminSettingsScreen> {
  final _formKey = GlobalKey<FormState>();
  final _appNameController = TextEditingController(text: 'IWKL');
  final _appVersionController = TextEditingController(text: '1.0.0');
  final _supportEmailController = TextEditingController(text: 'support@iwkl.org');
  final _supportPhoneController = TextEditingController(text: '+91-9876543210');
  final _privacyPolicyController = TextEditingController();
  final _termsController = TextEditingController();
  final _maintenanceMessageController = TextEditingController();
  final _maxPlayersController = TextEditingController(text: '15');
  bool _maintenanceMode = false;
  bool _allowRegistration = true;

  @override
  void dispose() {
    _appNameController.dispose();
    _appVersionController.dispose();
    _supportEmailController.dispose();
    _supportPhoneController.dispose();
    _privacyPolicyController.dispose();
    _termsController.dispose();
    _maintenanceMessageController.dispose();
    _maxPlayersController.dispose();
    super.dispose();
  }

  void _saveSettings() {
    if (_formKey.currentState!.validate()) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Settings saved successfully'), backgroundColor: Color(0xFF4CAF50)));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF13051E),
      appBar: AppBar(backgroundColor: const Color(0xFF13051E), elevation: 0, title: const Text('Settings', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)), leading: IconButton(icon: const Icon(Icons.arrow_back, color: Colors.white), onPressed: () => Navigator.pop(context)), actions: [TextButton(onPressed: _saveSettings, child: const Text('Save', style: TextStyle(color: Color(0xFF9333EA), fontWeight: FontWeight.bold)))]),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            _buildSection('App Settings'),
            const SizedBox(height: 16),
            _buildField(_appNameController, 'App Name *', validator: (v) => v?.isEmpty ?? true ? 'Required' : null),
            const SizedBox(height: 16),
            _buildField(_appVersionController, 'App Version *', validator: (v) => v?.isEmpty ?? true ? 'Required' : null),
            const SizedBox(height: 16),
            _buildField(_maxPlayersController, 'Max Players Per Team *', keyboardType: TextInputType.number, validator: (v) => v?.isEmpty ?? true ? 'Required' : null),
            const SizedBox(height: 24),
            _buildSection('Support'),
            const SizedBox(height: 16),
            _buildField(_supportEmailController, 'Support Email *', keyboardType: TextInputType.emailAddress, validator: (v) => v?.isEmpty ?? true ? 'Required' : null),
            const SizedBox(height: 16),
            _buildField(_supportPhoneController, 'Support Phone *', keyboardType: TextInputType.phone, validator: (v) => v?.isEmpty ?? true ? 'Required' : null),
            const SizedBox(height: 24),
            _buildSection('Legal'),
            const SizedBox(height: 16),
            _buildField(_privacyPolicyController, 'Privacy Policy', maxLines: 5),
            const SizedBox(height: 16),
            _buildField(_termsController, 'Terms of Service', maxLines: 5),
            const SizedBox(height: 24),
            _buildSection('Maintenance'),
            const SizedBox(height: 16),
            SwitchListTile(title: const Text('Maintenance Mode', style: TextStyle(color: Colors.white)), subtitle: Text('App will be under maintenance', style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 12)), value: _maintenanceMode, onChanged: (v) => setState(() => _maintenanceMode = v)),
            const SizedBox(height: 8),
            _buildField(_maintenanceMessageController, 'Maintenance Message', maxLines: 2),
            const SizedBox(height: 16),
            SwitchListTile(title: const Text('Allow Registration', style: TextStyle(color: Colors.white)), subtitle: Text('Allow new player registrations', style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 12)), value: _allowRegistration, onChanged: (v) => setState(() => _allowRegistration = v)),
            const SizedBox(height: 32),
            SizedBox(width: double.infinity, height: 50, child: ElevatedButton(onPressed: _saveSettings, style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF9333EA), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))), child: const Text('Save Settings', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)))),
          ]),
        ),
      ),
    );
  }

  Widget _buildSection(String title) {
    return Text(title, style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold));
  }

  Widget _buildField(TextEditingController controller, String label, {int maxLines = 1, TextInputType? keyboardType, String? Function(String?)? validator}) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: const TextStyle(color: Colors.white70, fontSize: 14, fontWeight: FontWeight.w500)),
      const SizedBox(height: 8),
      TextFormField(controller: controller, style: const TextStyle(color: Colors.white), maxLines: maxLines, keyboardType: keyboardType, validator: validator, decoration: InputDecoration(filled: true, fillColor: Colors.white.withOpacity(0.05), border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: const Color(0xFF9333EA).withOpacity(0.3))), enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: const Color(0xFF9333EA).withOpacity(0.3))), focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFF9333EA))), errorBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Colors.red)), contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12))),
    ]);
  }
}
