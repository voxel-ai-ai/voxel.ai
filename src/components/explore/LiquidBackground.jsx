import React, { useRef, useEffect } from 'react';

export default function LiquidBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Blob definitions — layered liquid masses
    const blobs = [
      { x: 0.5, y: 0.45, tx: 0.5, ty: 0.45, r: 0.38, color: 'rgba(139,0,0,0.55)',    speed: 0.045 },
      { x: 0.5, y: 0.5,  tx: 0.5, ty: 0.5,  r: 0.28, color: 'rgba(180,10,10,0.45)',  speed: 0.06  },
      { x: 0.5, y: 0.42, tx: 0.5, ty: 0.42, r: 0.18, color: 'rgba(220,30,30,0.38)',  speed: 0.08  },
      // ambient drifting blobs
      { x: 0.3, y: 0.6,  tx: 0.3, ty: 0.6,  r: 0.22, color: 'rgba(100,0,0,0.3)',     speed: 0.025, ambient: true },
      { x: 0.7, y: 0.35, tx: 0.7, ty: 0.35, r: 0.20, color: 'rgba(120,5,5,0.28)',    speed: 0.03,  ambient: true },
    ];

    // Mouse target (normalized 0–1)
    let mouse = { x: 0.5, y: 0.45 };
    let frame = 0;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) / rect.width;
      mouse.y = (e.clientY - rect.top)  / rect.height;
    };
    window.addEventListener('mousemove', onMove);

    const drawBlob = (blob) => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = blob.x * w;
      const cy = blob.y * h;
      const r  = blob.r * Math.max(w, h);

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0,   blob.color);
      grad.addColorStop(0.5, blob.color.replace(/[\d.]+\)$/, '0.12)'));
      grad.addColorStop(1,   'rgba(0,0,0,0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r * 0.72, Math.sin(frame * 0.008) * 0.3, 0, Math.PI * 2);
      ctx.fill();
    };

    let raf;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!prefersReducedMotion) {
        // Update blob targets — first 3 follow mouse at different speeds/offsets
        blobs[0].tx = mouse.x;
        blobs[0].ty = mouse.y;
        blobs[1].tx = mouse.x + Math.sin(frame * 0.012) * 0.06;
        blobs[1].ty = mouse.y + Math.cos(frame * 0.010) * 0.04;
        blobs[2].tx = mouse.x + Math.cos(frame * 0.018) * 0.04;
        blobs[2].ty = mouse.y + Math.sin(frame * 0.015) * 0.03;

        // Ambient blobs drift slowly
        blobs[3].tx = 0.3 + Math.sin(frame * 0.007) * 0.15;
        blobs[3].ty = 0.6 + Math.cos(frame * 0.005) * 0.1;
        blobs[4].tx = 0.7 + Math.cos(frame * 0.009) * 0.12;
        blobs[4].ty = 0.35 + Math.sin(frame * 0.006) * 0.1;
      }

      // Smooth lerp all blobs toward their targets
      blobs.forEach(b => {
        b.x += (b.tx - b.x) * b.speed;
        b.y += (b.ty - b.y) * b.speed;
      });

      // Draw back-to-front with blur simulation via multiple passes
      ctx.save();
      ctx.filter = 'blur(80px)';
      blobs.forEach(drawBlob);
      ctx.restore();

      // Sharper inner glow pass
      ctx.save();
      ctx.filter = 'blur(30px)';
      ctx.globalAlpha = 0.6;
      drawBlob(blobs[2]);
      ctx.restore();

      // Vignette — darken edges
      const vw = canvas.width;
      const vh = canvas.height;
      const vg = ctx.createRadialGradient(vw / 2, vh / 2, vh * 0.25, vw / 2, vh / 2, vh * 0.9);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(0,0,0,0.82)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, vw, vh);

      raf = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        background: '#0a0a0a',
      }}
    />
  );
}