import 'package:flutter/material.dart';

class PremiumIcon extends StatefulWidget {
  final IconData icon;
  final double size;
  final Color color;
  final bool animated;
  final bool outlined;

  const PremiumIcon({
    super.key,
    required this.icon,
    this.size = 24,
    this.color = Colors.white,
    this.animated = true,
    this.outlined = true,
  });

  @override
  State<PremiumIcon> createState() => _PremiumIconState();
}

class _PremiumIconState extends State<PremiumIcon> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _rotationAnimation;

  @override
  void initState() {
    super.initState();
    if (widget.animated) {
      _controller = AnimationController(
        duration: const Duration(milliseconds: 300),
        vsync: this,
      );
      _scaleAnimation = Tween<double>(begin: 1.0, end: 1.1).animate(
        CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
      );
      _rotationAnimation = Tween<double>(begin: 0, end: 0.1).animate(
        CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
      );
    }
  }

  @override
  void dispose() {
    if (widget.animated) {
      _controller.dispose();
    }
    super.dispose();
  }

  void _animate() {
    if (widget.animated) {
      _controller.forward().then((_) {
        _controller.reverse();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => _animate(),
      child: widget.animated
          ? AnimatedBuilder(
              animation: _controller,
              builder: (context, child) {
                return Transform.scale(
                  scale: _scaleAnimation.value,
                  child: Transform.rotate(
                    angle: _rotationAnimation.value,
                    child: Icon(
                      widget.icon,
                      size: widget.size,
                      color: widget.color,
                    ),
                  ),
                );
              },
            )
          : Icon(
              widget.icon,
              size: widget.size,
              color: widget.color,
            ),
    );
  }
}
