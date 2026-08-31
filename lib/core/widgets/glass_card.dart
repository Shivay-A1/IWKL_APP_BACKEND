import 'package:flutter/material.dart';
import 'dart:ui';

class GlassCard extends StatefulWidget {
  final Widget child;
  final double? width;
  final double? height;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final BorderRadius? borderRadius;
  final Gradient? gradient;
  final double blur;
  final double opacity;
  final List<BoxShadow>? boxShadow;
  final Border? border;
  final VoidCallback? onTap;
  final bool premiumStyle;
  final bool enableHover;

  const GlassCard({
    super.key,
    required this.child,
    this.width,
    this.height,
    this.padding,
    this.margin,
    this.borderRadius,
    this.gradient,
    this.blur = 15,
    this.opacity = 0.12,
    this.boxShadow,
    this.border,
    this.onTap,
    this.premiumStyle = false,
    this.enableHover = true,
  });

  @override
  State<GlassCard> createState() => _GlassCardState();
}

class _GlassCardState extends State<GlassCard> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    final effectiveBorderRadius = widget.borderRadius ?? BorderRadius.circular(widget.premiumStyle ? 24 : 20);
    
    return MouseRegion(
      onEnter: (_) {
        if (widget.enableHover) {
          setState(() => _isHovered = true);
        }
      },
      onExit: (_) {
        if (widget.enableHover) {
          setState(() => _isHovered = false);
        }
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        curve: Curves.easeInOut,
        width: widget.width,
        height: widget.height,
        margin: widget.margin,
        decoration: BoxDecoration(
          gradient: widget.gradient ??
              LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Colors.white.withOpacity(widget.opacity),
                  Colors.white.withOpacity(widget.opacity * 0.6),
                  Colors.white.withOpacity(widget.opacity * 0.3),
                ],
                stops: const [0.0, 0.5, 1.0],
              ),
          borderRadius: effectiveBorderRadius,
          border: widget.border ??
              Border.all(
                color: _isHovered 
                    ? const Color(0xFF9333EA).withOpacity(0.6)
                    : Colors.white.withOpacity(0.15),
                width: _isHovered ? 2 : 1.5,
              ),
          boxShadow: widget.boxShadow ??
              [
                if (widget.premiumStyle)
                  BoxShadow(
                    color: const Color(0xFF4C085D).withOpacity(_isHovered ? 0.5 : 0.3),
                    blurRadius: _isHovered ? 50 : 35,
                    spreadRadius: _isHovered ? 10 : 5,
                    offset: const Offset(0, 15),
                  ),
                BoxShadow(
                  color: Colors.black.withOpacity(_isHovered ? 0.4 : 0.25),
                  blurRadius: _isHovered ? 30 : 25,
                  offset: const Offset(0, 10),
                ),
                BoxShadow(
                  color: const Color(0xFF9333EA).withOpacity(_isHovered ? 0.2 : 0.1),
                  blurRadius: _isHovered ? 20 : 15,
                  spreadRadius: _isHovered ? 5 : 2,
                ),
              ],
        ),
        child: ClipRRect(
          borderRadius: effectiveBorderRadius,
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: widget.blur, sigmaY: widget.blur),
            child: Container(
              padding: widget.padding,
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  onTap: widget.onTap,
                  borderRadius: effectiveBorderRadius,
                  splashColor: const Color(0xFF9333EA).withOpacity(0.2),
                  hoverColor: const Color(0xFF9333EA).withOpacity(0.1),
                  child: widget.child,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class GlassContainer extends StatelessWidget {
  final Widget child;
  final double? width;
  final double? height;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final BorderRadius? borderRadius;
  final Gradient? gradient;
  final double blur;
  final double opacity;
  final List<BoxShadow>? boxShadow;
  final Border? border;

  const GlassContainer({
    super.key,
    required this.child,
    this.width,
    this.height,
    this.padding,
    this.margin,
    this.borderRadius,
    this.gradient,
    this.blur = 10,
    this.opacity = 0.15,
    this.boxShadow,
    this.border,
  });

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: borderRadius ?? BorderRadius.circular(16),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: blur, sigmaY: blur),
        child: Container(
          width: width,
          height: height,
          margin: margin,
          padding: padding,
          decoration: BoxDecoration(
            gradient: gradient ??
                LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Colors.white.withOpacity(opacity),
                    Colors.white.withOpacity(opacity * 0.5),
                  ],
                ),
            borderRadius: borderRadius ?? BorderRadius.circular(16),
            border: border ??
                Border.all(
                  color: Colors.white.withOpacity(0.2),
                  width: 1,
                ),
            boxShadow: boxShadow ??
                const [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 20,
                    offset: Offset(0, 10),
                  ),
                ],
          ),
          child: child,
        ),
      ),
    );
  }
}

class PremiumCard extends StatelessWidget {
  final Widget child;
  final double? width;
  final double? height;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final BorderRadius? borderRadius;
  final Color? glowColor;
  final double glowIntensity;
  final VoidCallback? onTap;

  const PremiumCard({
    super.key,
    required this.child,
    this.width,
    this.height,
    this.padding,
    this.margin,
    this.borderRadius,
    this.glowColor,
    this.glowIntensity = 0.3,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final effectiveGlowColor = glowColor ?? const Color(0xFFF8B400);

    return Container(
      width: width,
      height: height,
      margin: margin,
      decoration: BoxDecoration(
        borderRadius: borderRadius ?? BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: effectiveGlowColor.withOpacity(glowIntensity),
            blurRadius: 20,
            spreadRadius: 2,
          ),
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            blurRadius: 10,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: GlassCard(
        borderRadius: borderRadius,
        border: Border.all(
          color: effectiveGlowColor.withOpacity(0.5),
          width: 1,
        ),
        onTap: onTap,
        child: child,
      ),
    );
  }
}
