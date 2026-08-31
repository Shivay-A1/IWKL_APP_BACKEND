import 'package:flutter/material.dart';

class DrawerItem {
  final IconData icon;
  final String title;
  final VoidCallback? onTap;
  final Widget? trailing;

  DrawerItem({
    required this.icon,
    required this.title,
    this.onTap,
    this.trailing,
  });
}
