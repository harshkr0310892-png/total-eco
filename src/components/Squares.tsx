import React, { useRef, useEffect } from 'react';

type CanvasStrokeStyle = string | CanvasGradient | CanvasPattern;

interface GridOffset {
  x: number;
  y: number;
}

type ThemeType = 
  | 'royal' | 'gold' | 'emerald' | 'midnight' | 'rose' | 'custom'
  | 'light-royal' | 'light-gold' | 'light-emerald' | 'light-sky' | 'light-rose' 
  | 'light-neutral' | 'light-lavender' | 'light-peach' | 'light-mint'
  | 'royal-gold' | 'light-royal-gold' | 'champagne' | 'bronze' | 'amber';

interface SquaresProps {
  direction?: 'diagonal' | 'up' | 'right' | 'down' | 'left';
  speed?: number;
  borderColor?: CanvasStrokeStyle;
  squareSize?: number;
  hoverFillColor?: CanvasStrokeStyle;
  theme?: ThemeType;
  gradientFrom?: string;
  gradientTo?: string;
  glowEffect?: boolean;
  glowColor?: string;
  glowIntensity?: number;
  borderWidth?: number;
  borderOpacity?: number;
  backgroundColor?: string;
  hoverGlow?: boolean;
  hoverScale?: boolean;
}

// Predefined themes - Dark, Light, and Gold Royal
const themes = {
  // ========== DARK THEMES ==========
  royal: {
    backgroundColor: '#0a0015',
    borderColor: 'rgba(139, 92, 246, 0.15)',
    hoverFillColor: 'rgba(139, 92, 246, 0.2)',
    gradientFrom: 'rgba(139, 92, 246, 0.1)',
    gradientTo: '#0a0015',
    glowColor: 'rgba(139, 92, 246, 0.5)',
    isLight: false,
  },
  gold: {
    backgroundColor: '#0f0a00',
    borderColor: 'rgba(234, 179, 8, 0.15)',
    hoverFillColor: 'rgba(234, 179, 8, 0.2)',
    gradientFrom: 'rgba(234, 179, 8, 0.1)',
    gradientTo: '#0f0a00',
    glowColor: 'rgba(234, 179, 8, 0.5)',
    isLight: false,
  },
  emerald: {
    backgroundColor: '#00100a',
    borderColor: 'rgba(16, 185, 129, 0.15)',
    hoverFillColor: 'rgba(16, 185, 129, 0.2)',
    gradientFrom: 'rgba(16, 185, 129, 0.1)',
    gradientTo: '#00100a',
    glowColor: 'rgba(16, 185, 129, 0.5)',
    isLight: false,
  },
  midnight: {
    backgroundColor: '#020617',
    borderColor: 'rgba(59, 130, 246, 0.15)',
    hoverFillColor: 'rgba(59, 130, 246, 0.2)',
    gradientFrom: 'rgba(59, 130, 246, 0.1)',
    gradientTo: '#020617',
    glowColor: 'rgba(59, 130, 246, 0.5)',
    isLight: false,
  },
  rose: {
    backgroundColor: '#10000a',
    borderColor: 'rgba(244, 63, 94, 0.15)',
    hoverFillColor: 'rgba(244, 63, 94, 0.2)',
    gradientFrom: 'rgba(244, 63, 94, 0.1)',
    gradientTo: '#10000a',
    glowColor: 'rgba(244, 63, 94, 0.5)',
    isLight: false,
  },
  custom: {
    backgroundColor: '#000000',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    hoverFillColor: 'rgba(255, 255, 255, 0.1)',
    gradientFrom: 'rgba(255, 255, 255, 0.05)',
    gradientTo: '#000000',
    glowColor: 'rgba(255, 255, 255, 0.3)',
    isLight: false,
  },

  // ========== GOLD ROYAL THEMES (DARK) ==========
  'royal-gold': {
    backgroundColor: '#0d0a05',
    borderColor: 'rgba(212, 175, 55, 0.35)',
    hoverFillColor: 'rgba(212, 175, 55, 0.25)',
    gradientFrom: 'rgba(212, 175, 55, 0.15)',
    gradientTo: '#0d0a05',
    glowColor: 'rgba(255, 215, 0, 0.6)',
    isLight: false,
  },
  'bronze': {
    backgroundColor: '#0a0705',
    borderColor: 'rgba(205, 127, 50, 0.35)',
    hoverFillColor: 'rgba(205, 127, 50, 0.2)',
    gradientFrom: 'rgba(205, 127, 50, 0.12)',
    gradientTo: '#0a0705',
    glowColor: 'rgba(205, 127, 50, 0.5)',
    isLight: false,
  },
  'amber': {
    backgroundColor: '#0c0800',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    hoverFillColor: 'rgba(245, 158, 11, 0.2)',
    gradientFrom: 'rgba(245, 158, 11, 0.1)',
    gradientTo: '#0c0800',
    glowColor: 'rgba(245, 158, 11, 0.55)',
    isLight: false,
  },

  // ========== LIGHT THEMES ==========
  'light-royal': {
    backgroundColor: '#faf8ff',
    borderColor: 'rgba(139, 92, 246, 0.25)',
    hoverFillColor: 'rgba(139, 92, 246, 0.15)',
    gradientFrom: 'rgba(139, 92, 246, 0.08)',
    gradientTo: '#faf8ff',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    isLight: true,
  },
  'light-lavender': {
    backgroundColor: '#f8f7ff',
    borderColor: 'rgba(124, 58, 237, 0.2)',
    hoverFillColor: 'rgba(167, 139, 250, 0.2)',
    gradientFrom: 'rgba(167, 139, 250, 0.1)',
    gradientTo: '#f8f7ff',
    glowColor: 'rgba(139, 92, 246, 0.35)',
    isLight: true,
  },
  'light-gold': {
    backgroundColor: '#fffef5',
    borderColor: 'rgba(202, 138, 4, 0.25)',
    hoverFillColor: 'rgba(234, 179, 8, 0.15)',
    gradientFrom: 'rgba(234, 179, 8, 0.08)',
    gradientTo: '#fffef5',
    glowColor: 'rgba(234, 179, 8, 0.4)',
    isLight: true,
  },
  'light-peach': {
    backgroundColor: '#fff8f5',
    borderColor: 'rgba(249, 115, 22, 0.2)',
    hoverFillColor: 'rgba(251, 146, 60, 0.15)',
    gradientFrom: 'rgba(251, 146, 60, 0.08)',
    gradientTo: '#fff8f5',
    glowColor: 'rgba(249, 115, 22, 0.35)',
    isLight: true,
  },
  'light-emerald': {
    backgroundColor: '#f5fffa',
    borderColor: 'rgba(16, 185, 129, 0.25)',
    hoverFillColor: 'rgba(16, 185, 129, 0.12)',
    gradientFrom: 'rgba(16, 185, 129, 0.08)',
    gradientTo: '#f5fffa',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    isLight: true,
  },
  'light-mint': {
    backgroundColor: '#f0fdf9',
    borderColor: 'rgba(20, 184, 166, 0.22)',
    hoverFillColor: 'rgba(45, 212, 191, 0.15)',
    gradientFrom: 'rgba(45, 212, 191, 0.08)',
    gradientTo: '#f0fdf9',
    glowColor: 'rgba(20, 184, 166, 0.35)',
    isLight: true,
  },
  'light-sky': {
    backgroundColor: '#f5faff',
    borderColor: 'rgba(59, 130, 246, 0.25)',
    hoverFillColor: 'rgba(59, 130, 246, 0.12)',
    gradientFrom: 'rgba(59, 130, 246, 0.08)',
    gradientTo: '#f5faff',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    isLight: true,
  },
  'light-rose': {
    backgroundColor: '#fff5f7',
    borderColor: 'rgba(244, 63, 94, 0.2)',
    hoverFillColor: 'rgba(251, 113, 133, 0.15)',
    gradientFrom: 'rgba(251, 113, 133, 0.08)',
    gradientTo: '#fff5f7',
    glowColor: 'rgba(244, 63, 94, 0.35)',
    isLight: true,
  },
  'light-neutral': {
    backgroundColor: '#fafafa',
    borderColor: 'rgba(115, 115, 115, 0.15)',
    hoverFillColor: 'rgba(163, 163, 163, 0.12)',
    gradientFrom: 'rgba(163, 163, 163, 0.06)',
    gradientTo: '#fafafa',
    glowColor: 'rgba(115, 115, 115, 0.25)',
    isLight: true,
  },

  // ========== LIGHT GOLD ROYAL THEMES ==========
  'light-royal-gold': {
    backgroundColor: '#fffdf7',
    borderColor: 'rgba(180, 145, 45, 0.45)',
    hoverFillColor: 'rgba(212, 175, 55, 0.2)',
    gradientFrom: 'rgba(212, 175, 55, 0.12)',
    gradientTo: '#fffdf7',
    glowColor: 'rgba(212, 175, 55, 0.5)',
    isLight: true,
  },
  'champagne': {
    backgroundColor: '#fffef8',
    borderColor: 'rgba(210, 180, 100, 0.4)',
    hoverFillColor: 'rgba(247, 223, 152, 0.3)',
    gradientFrom: 'rgba(247, 223, 152, 0.15)',
    gradientTo: '#fffef8',
    glowColor: 'rgba(212, 175, 55, 0.45)',
    isLight: true,
  },
};

const Squares: React.FC<SquaresProps> = ({
  direction = 'diagonal',
  speed = 0.5,
  borderColor,
  squareSize = 50,
  hoverFillColor,
  theme = 'light-royal-gold', // Default to light royal gold
  gradientFrom,
  gradientTo,
  glowEffect = true,
  glowColor,
  glowIntensity = 25,
  borderWidth = 1,
  borderOpacity = 1,
  backgroundColor,
  hoverGlow = true,
  hoverScale = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const numSquaresX = useRef<number>(0);
  const numSquaresY = useRef<number>(0);
  const gridOffset = useRef<GridOffset>({ x: 0, y: 0 });
  const hoveredSquareRef = useRef<GridOffset | null>(null);
  const mousePosition = useRef<{ x: number; y: number } | null>(null);

  // Get theme colors
  const currentTheme = themes[theme];
  const isLightTheme = currentTheme.isLight;
  const finalBorderColor = borderColor || currentTheme.borderColor;
  const finalHoverFillColor = hoverFillColor || currentTheme.hoverFillColor;
  const finalGradientFrom = gradientFrom || currentTheme.gradientFrom;
  const finalGradientTo = gradientTo || currentTheme.gradientTo;
  const finalGlowColor = glowColor || currentTheme.glowColor;
  const finalBackgroundColor = backgroundColor || currentTheme.backgroundColor;

  // Check if it's a gold theme for special effects
  const isGoldTheme = theme.includes('gold') || theme === 'champagne' || theme === 'bronze' || theme === 'amber';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx?.scale(dpr, dpr);
      numSquaresX.current = Math.ceil(canvas.offsetWidth / squareSize) + 1;
      numSquaresY.current = Math.ceil(canvas.offsetHeight / squareSize) + 1;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const drawGrid = () => {
      if (!ctx) return;

      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      // Clear and fill background
      ctx.fillStyle = finalBackgroundColor;
      ctx.fillRect(0, 0, width, height);

      // Add subtle pattern overlay for light themes
      if (isLightTheme) {
        const patternGradient = ctx.createLinearGradient(0, 0, width, height);
        patternGradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
        patternGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
        patternGradient.addColorStop(1, 'rgba(255, 255, 255, 0.3)');
        ctx.fillStyle = patternGradient;
        ctx.fillRect(0, 0, width, height);
      }

      // Add gold shimmer effect for gold themes
      if (isGoldTheme) {
        const shimmerGradient = ctx.createLinearGradient(0, 0, width, height);
        if (isLightTheme) {
          shimmerGradient.addColorStop(0, 'rgba(255, 223, 120, 0.08)');
          shimmerGradient.addColorStop(0.3, 'rgba(255, 255, 255, 0)');
          shimmerGradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.05)');
          shimmerGradient.addColorStop(0.7, 'rgba(255, 255, 255, 0)');
          shimmerGradient.addColorStop(1, 'rgba(255, 223, 120, 0.08)');
        } else {
          shimmerGradient.addColorStop(0, 'rgba(255, 215, 0, 0.03)');
          shimmerGradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.01)');
          shimmerGradient.addColorStop(1, 'rgba(255, 215, 0, 0.03)');
        }
        ctx.fillStyle = shimmerGradient;
        ctx.fillRect(0, 0, width, height);
      }

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      // Draw glow effect at mouse position
      if (glowEffect && mousePosition.current) {
        const glowGradient = ctx.createRadialGradient(
          mousePosition.current.x,
          mousePosition.current.y,
          0,
          mousePosition.current.x,
          mousePosition.current.y,
          glowIntensity * 5
        );
        glowGradient.addColorStop(0, finalGlowColor);
        glowGradient.addColorStop(0.5, isLightTheme 
          ? finalGlowColor.replace(/[\d.]+\)$/, '0.15)') 
          : finalGlowColor.replace(/[\d.]+\)$/, '0.2)')
        );
        glowGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGradient;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw grid
      ctx.lineWidth = isGoldTheme ? borderWidth * 1.2 : borderWidth;

      for (let x = startX; x < width + squareSize; x += squareSize) {
        for (let y = startY; y < height + squareSize; y += squareSize) {
          const squareX = x - (gridOffset.current.x % squareSize);
          const squareY = y - (gridOffset.current.y % squareSize);

          const gridX = Math.floor((x - startX) / squareSize);
          const gridY = Math.floor((y - startY) / squareSize);

          const isHovered =
            hoveredSquareRef.current &&
            gridX === hoveredSquareRef.current.x &&
            gridY === hoveredSquareRef.current.y;

          if (isHovered) {
            ctx.save();
            
            if (hoverGlow) {
              ctx.shadowColor = finalGlowColor;
              ctx.shadowBlur = isLightTheme ? 15 : 20;
              if (isGoldTheme) {
                ctx.shadowBlur = 25;
              }
            }
            
            ctx.fillStyle = finalHoverFillColor;
            
            if (hoverScale) {
              const scale = 0.92;
              const offset = (squareSize * (1 - scale)) / 2;
              ctx.fillRect(
                squareX + offset,
                squareY + offset,
                squareSize * scale,
                squareSize * scale
              );
            } else {
              ctx.fillRect(squareX, squareY, squareSize, squareSize);
            }
            
            ctx.restore();
          }

          // Draw border with gradient effect based on distance from center
          const centerX = width / 2;
          const centerY = height / 2;
          const distanceFromCenter = Math.sqrt(
            Math.pow(squareX + squareSize / 2 - centerX, 2) +
            Math.pow(squareY + squareSize / 2 - centerY, 2)
          );
          const maxDistance = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
          
          // For gold themes, keep higher opacity for visibility
          let opacity: number;
          if (isGoldTheme) {
            opacity = Math.max(0.25, (1 - distanceFromCenter / maxDistance) * 0.9) * borderOpacity;
          } else if (isLightTheme) {
            opacity = Math.max(0.15, (1 - distanceFromCenter / maxDistance) * 0.8) * borderOpacity;
          } else {
            opacity = Math.max(0.05, 1 - distanceFromCenter / maxDistance) * borderOpacity;
          }

          // Create gradient border for gold themes
          if (isGoldTheme && typeof finalBorderColor === 'string') {
            // Create a gradient stroke for gold effect
            const gradient = ctx.createLinearGradient(
              squareX, squareY, 
              squareX + squareSize, squareY + squareSize
            );
            
            if (isLightTheme) {
              gradient.addColorStop(0, `rgba(180, 145, 45, ${opacity})`);
              gradient.addColorStop(0.5, `rgba(212, 175, 55, ${opacity * 1.2})`);
              gradient.addColorStop(1, `rgba(160, 125, 35, ${opacity})`);
            } else {
              gradient.addColorStop(0, `rgba(180, 145, 45, ${opacity})`);
              gradient.addColorStop(0.5, `rgba(255, 215, 0, ${opacity * 0.8})`);
              gradient.addColorStop(1, `rgba(180, 145, 45, ${opacity})`);
            }
            ctx.strokeStyle = gradient;
          } else if (typeof finalBorderColor === 'string') {
            const color = finalBorderColor.replace(/[\d.]+\)$/, `${opacity})`);
            ctx.strokeStyle = color;
          } else {
            ctx.strokeStyle = finalBorderColor;
          }

          // Draw rounded rectangle for premium feel
          const radius = isLightTheme ? 3 : 2;
          ctx.beginPath();
          ctx.moveTo(squareX + radius, squareY);
          ctx.lineTo(squareX + squareSize - radius, squareY);
          ctx.quadraticCurveTo(squareX + squareSize, squareY, squareX + squareSize, squareY + radius);
          ctx.lineTo(squareX + squareSize, squareY + squareSize - radius);
          ctx.quadraticCurveTo(squareX + squareSize, squareY + squareSize, squareX + squareSize - radius, squareY + squareSize);
          ctx.lineTo(squareX + radius, squareY + squareSize);
          ctx.quadraticCurveTo(squareX, squareY + squareSize, squareX, squareY + squareSize - radius);
          ctx.lineTo(squareX, squareY + radius);
          ctx.quadraticCurveTo(squareX, squareY, squareX + radius, squareY);
          ctx.closePath();
          ctx.stroke();

          // Add corner accents for gold themes
          if (isGoldTheme && isHovered) {
            ctx.save();
            ctx.fillStyle = isLightTheme 
              ? 'rgba(212, 175, 55, 0.6)' 
              : 'rgba(255, 215, 0, 0.4)';
            const cornerSize = 4;
            
            // Top-left corner
            ctx.fillRect(squareX, squareY, cornerSize, cornerSize);
            // Top-right corner
            ctx.fillRect(squareX + squareSize - cornerSize, squareY, cornerSize, cornerSize);
            // Bottom-left corner
            ctx.fillRect(squareX, squareY + squareSize - cornerSize, cornerSize, cornerSize);
            // Bottom-right corner
            ctx.fillRect(squareX + squareSize - cornerSize, squareY + squareSize - cornerSize, cornerSize, cornerSize);
            
            ctx.restore();
          }
        }
      }

      // Draw vignette overlay
      const vignetteGradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.sqrt(width ** 2 + height ** 2) / 2
      );
      
      if (isLightTheme) {
        vignetteGradient.addColorStop(0, 'transparent');
        vignetteGradient.addColorStop(0.6, 'transparent');
        vignetteGradient.addColorStop(0.85, 'rgba(255, 255, 255, 0.3)');
        vignetteGradient.addColorStop(1, 'rgba(255, 255, 255, 0.7)');
      } else {
        vignetteGradient.addColorStop(0, 'transparent');
        vignetteGradient.addColorStop(0.5, 'transparent');
        vignetteGradient.addColorStop(1, finalBackgroundColor);
      }

      ctx.fillStyle = vignetteGradient;
      ctx.fillRect(0, 0, width, height);

      // Add subtle gradient for depth
      if (isLightTheme) {
        const cornerGradient = ctx.createRadialGradient(
          0, 0, 0,
          0, 0, Math.sqrt(width ** 2 + height ** 2) * 0.5
        );
        cornerGradient.addColorStop(0, finalGradientFrom);
        cornerGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = cornerGradient;
        ctx.fillRect(0, 0, width, height);

        const cornerGradient2 = ctx.createRadialGradient(
          width, height, 0,
          width, height, Math.sqrt(width ** 2 + height ** 2) * 0.5
        );
        cornerGradient2.addColorStop(0, finalGradientFrom);
        cornerGradient2.addColorStop(1, 'transparent');
        ctx.fillStyle = cornerGradient2;
        ctx.fillRect(0, 0, width, height);
      } else {
        const topGradient = ctx.createLinearGradient(0, 0, 0, height * 0.3);
        topGradient.addColorStop(0, finalGradientFrom);
        topGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = topGradient;
        ctx.fillRect(0, 0, width, height * 0.3);
      }

      // Add gold shimmer line effect for gold themes
      if (isGoldTheme && isLightTheme) {
        const shimmerLine = ctx.createLinearGradient(0, 0, width, 0);
        shimmerLine.addColorStop(0, 'transparent');
        shimmerLine.addColorStop(0.4, 'transparent');
        shimmerLine.addColorStop(0.5, 'rgba(255, 223, 120, 0.1)');
        shimmerLine.addColorStop(0.6, 'transparent');
        shimmerLine.addColorStop(1, 'transparent');
        ctx.fillStyle = shimmerLine;
        ctx.fillRect(0, 0, width, height);
      }
    };

    const updateAnimation = () => {
      const effectiveSpeed = Math.max(speed, 0.1);
      switch (direction) {
        case 'right':
          gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
          break;
        case 'left':
          gridOffset.current.x = (gridOffset.current.x + effectiveSpeed + squareSize) % squareSize;
          break;
        case 'up':
          gridOffset.current.y = (gridOffset.current.y + effectiveSpeed + squareSize) % squareSize;
          break;
        case 'down':
          gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
          break;
        case 'diagonal':
          gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
          gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
          break;
        default:
          break;
      }

      drawGrid();
      requestRef.current = requestAnimationFrame(updateAnimation);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      mousePosition.current = { x: mouseX, y: mouseY };

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      const hoveredSquareX = Math.floor((mouseX + gridOffset.current.x - startX) / squareSize);
      const hoveredSquareY = Math.floor((mouseY + gridOffset.current.y - startY) / squareSize);

      if (
        !hoveredSquareRef.current ||
        hoveredSquareRef.current.x !== hoveredSquareX ||
        hoveredSquareRef.current.y !== hoveredSquareY
      ) {
        hoveredSquareRef.current = { x: hoveredSquareX, y: hoveredSquareY };
      }
    };

    const handleMouseLeave = () => {
      hoveredSquareRef.current = null;
      mousePosition.current = null;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    requestRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [
    direction,
    speed,
    finalBorderColor,
    finalHoverFillColor,
    squareSize,
    finalGradientFrom,
    finalGradientTo,
    glowEffect,
    finalGlowColor,
    glowIntensity,
    borderWidth,
    borderOpacity,
    finalBackgroundColor,
    hoverGlow,
    hoverScale,
    isLightTheme,
    isGoldTheme,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full border-none block"
      style={{ background: finalBackgroundColor }}
    />
  );
};

export default Squares;