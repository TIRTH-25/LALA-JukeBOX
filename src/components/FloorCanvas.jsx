import { useEffect, useRef } from "react";

function FloorCanvas({ isPlaying, activeCategory }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let animationFrame;
    let rotation = 0;

    // =========================================
    // CATEGORY THEMES
    // =========================================

    const themes = {
      Garba: {
        background: "#3b0915",
        primary: "#d7aa35",
        secondary: "#9e2b25",
        dancer: "#eadfc8",
        dancerAccent: "#d7aa35",
        lamp: "#d7aa35",
        glow: "rgba(215,170,53,0.35)",
        outerDot: "#d7aa35",
      },

      DJ: {
        background: "#09070d",
        primary: "#a83cff",
        secondary: "#32104f",
        dancer: "#b9a8c7",
        dancerAccent: "#a83cff",
        lamp: "#a83cff",
        glow: "rgba(168,60,255,0.35)",
        outerDot: "#a83cff",
      },

      Soundcheck: {
        background: "#000000",
        primary: "#E10600",
        secondary: "#151515",
        dancer: "#F5F5F5",
        dancerAccent: "#E10600",
        lamp: "#FFFFFF",
        glow: "rgba(225, 6, 0, 0.28)",
        outerDot: "#E10600",
      },
    };

    const theme = themes[activeCategory] || themes.Garba;

    // =========================================
    // RESIZE
    // =========================================

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;

      const width = window.innerWidth;

      const height = window.innerHeight;

      canvas.style.width = `${width}px`;

      canvas.style.height = `${height}px`;

      canvas.width = Math.round(width * dpr);

      canvas.height = Math.round(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // =========================================
    // DRAW
    // =========================================

    const draw = () => {
      const width = window.innerWidth;

      const height = window.innerHeight;

      const isMobile = width < 640;

      ctx.clearRect(0, 0, width, height);

      // =======================================
      // BACKGROUND
      // =======================================

      ctx.fillStyle = theme.background;

      ctx.fillRect(0, 0, width, height);

      // =======================================
      // CENTER
      // =======================================

      const centerX = width / 2;

      /*
       * MOBILE
       * ---------------------------------------
       * Row 1 = Header + Clock
       * Row 2 = Categories
       * Row 3 = Dancer Circle
       * Row 4 = Player Dock
       * Row 5 = Footer
       *
       * The circle is intentionally positioned
       * in the upper-middle area so the player
       * does not completely cover it.
       */

      const centerY = isMobile ? height * 0.42 : height * 0.43;

      // =======================================
      // RESPONSIVE RADIUS
      // =======================================

      const radius = isMobile
        ? Math.min(width, height) * 0.27
        : Math.min(width, height) * 0.22;

      // =======================================
      // OUTER CIRCLE
      // =======================================

      ctx.beginPath();

      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);

      ctx.strokeStyle = theme.primary;

      ctx.lineWidth = 1;

      ctx.globalAlpha = 0.75;

      ctx.stroke();

      ctx.globalAlpha = 1;

      // =======================================
      // OUTER DOTS
      // =======================================

      const dotCount = isMobile ? 64 : 72;

      const dotDistance = isMobile ? 11 : 14;

      const dotRadius = isMobile ? 2.3 : 3;

      for (let i = 0; i < dotCount; i++) {
        const angle = (Math.PI * 2 * i) / dotCount;

        const x = centerX + Math.cos(angle) * (radius + dotDistance);

        const y = centerY + Math.sin(angle) * (radius + dotDistance);

        ctx.beginPath();

        ctx.arc(x, y, dotRadius, 0, Math.PI * 2);

        if (i % 3 === 0) {
          ctx.fillStyle = theme.primary;
        } else if (i % 3 === 1) {
          ctx.fillStyle = theme.secondary;
        } else {
          ctx.fillStyle = theme.dancer;
        }

        ctx.globalAlpha = 0.9;

        ctx.fill();

        ctx.globalAlpha = 1;
      }

      // =======================================
      // INNER CIRCLE
      // =======================================

      ctx.beginPath();

      ctx.arc(centerX, centerY, radius * 0.72, 0, Math.PI * 2);

      ctx.strokeStyle = theme.secondary;

      ctx.lineWidth = 1;

      ctx.globalAlpha = 0.8;

      ctx.stroke();

      ctx.globalAlpha = 1;

      // =======================================
      // DANCERS
      // =======================================

      const dancerCount = isMobile ? 20 : 24;

      for (let i = 0; i < dancerCount; i++) {
        const angle = (Math.PI * 2 * i) / dancerCount + rotation;

        const x = centerX + Math.cos(angle) * radius * 0.72;

        const y = centerY + Math.sin(angle) * radius * 0.72;

        drawDancer(ctx, x, y, angle, theme, isMobile);
      }

      // =======================================
      // CENTER LAMP
      // =======================================

      drawLamp(ctx, centerX, centerY, theme, isMobile);

      // =======================================
      // ANIMATION
      // =======================================

      if (isPlaying) {
        rotation += isMobile ? 0.0012 : 0.0015;
      }

      animationFrame = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);

      cancelAnimationFrame(animationFrame);
    };
  }, [isPlaying, activeCategory]);

  return (
    <canvas
      ref={canvasRef}
      id="floor"
      aria-label="Garba dancers around a lamp"
      className="
        fixed
        inset-0
        z-0
        h-full
        w-full
      "
    />
  );
}

// =============================================
// DANCER
// =============================================

function drawDancer(ctx, x, y, angle, theme, isMobile) {
  ctx.save();

  ctx.translate(x, y);

  ctx.rotate(angle + Math.PI / 2);

  // =========================================
  // SCALE
  // =========================================

  const scale = isMobile ? 0.78 : 1;

  ctx.scale(scale, scale);

  // =========================================
  // HEAD
  // =========================================

  ctx.beginPath();

  ctx.arc(0, -17, 5, 0, Math.PI * 2);

  ctx.fillStyle = theme.dancer;

  ctx.fill();

  // =========================================
  // DRESS
  // =========================================

  ctx.beginPath();

  ctx.moveTo(0, -11);

  ctx.lineTo(-11, 13);

  ctx.lineTo(11, 13);

  ctx.closePath();

  ctx.fillStyle = theme.secondary;

  ctx.fill();

  // =========================================
  // DRESS ACCENT
  // =========================================

  ctx.beginPath();

  ctx.moveTo(-8, 7);

  ctx.lineTo(8, 7);

  ctx.strokeStyle = theme.dancerAccent;

  ctx.lineWidth = 2;

  ctx.stroke();

  // =========================================
  // ARMS
  // =========================================

  ctx.beginPath();

  // Left arm
  ctx.moveTo(-3, -5);

  ctx.lineTo(-17, -12);

  // Right arm
  ctx.moveTo(3, -5);

  ctx.lineTo(17, -12);

  ctx.strokeStyle = theme.dancer;

  ctx.lineWidth = 2;

  ctx.stroke();

  ctx.restore();
}

// =============================================
// LAMP
// =============================================

function drawLamp(ctx, x, y, theme, isMobile) {
  // =========================================
  // RESPONSIVE SCALE
  // =========================================

  const scale = isMobile ? 0.82 : 1;

  ctx.save();

  ctx.translate(x, y);

  ctx.scale(scale, scale);

  // =========================================
  // GLOW
  // =========================================

  const gradient = ctx.createRadialGradient(0, -15, 2, 0, -15, 55);

  gradient.addColorStop(0, theme.glow);

  gradient.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = gradient;

  ctx.beginPath();

  ctx.arc(0, -15, 55, 0, Math.PI * 2);

  ctx.fill();

  // =========================================
  // LAMP BOWL
  // =========================================

  ctx.beginPath();

  ctx.ellipse(0, 8, 22, 15, 0, 0, Math.PI * 2);

  ctx.fillStyle = theme.secondary;

  ctx.fill();

  // =========================================
  // LAMP DOTS
  // =========================================

  for (let i = 0; i < 7; i++) {
    const angle = (Math.PI * 2 * i) / 7;

    const dotX = Math.cos(angle) * 13;

    const dotY = 8 + Math.sin(angle) * 8;

    ctx.beginPath();

    ctx.arc(dotX, dotY, 2, 0, Math.PI * 2);

    ctx.fillStyle = theme.primary;

    ctx.fill();
  }

  // =========================================
  // FLAME
  // =========================================

  ctx.beginPath();

  ctx.moveTo(0, -25);

  ctx.quadraticCurveTo(-10, -8, 0, 2);

  ctx.quadraticCurveTo(10, -8, 0, -25);

  ctx.fillStyle = theme.lamp;

  ctx.fill();

  ctx.restore();
}

export default FloorCanvas;
