import React, { useRef, useEffect } from 'react';

export default function LiquidBackground() {
  const canvasRef = useRef(null);
  const offscreenRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Offscreen canvas for metaball merge trick
    const off = document.createElement('canvas');
    offscreenRef.current = off;
    const offCtx = off.getContext('2d');

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Metaball blobs
    const blobs = [
      { x: 0.5, y: 0.45, vx: 0, vy: 0, r: 0.22, speed: 0.07 },
      { x: 0.48, y: 0.50, vx: 0, vy: 0, r: 0.17, speed: 0.11 },
      { x: 0.52, y: 0.42, vx: 0, vy: 0, r: 0.13, speed: 0.16 },
      { x: 0.38, y: 0.55, vx: 0, vy: 0, r: 0.14, speed: 0.04, ambient: true },
      { x: 0.62, y: 0.38, vx: 0, vy: 0, r: 0.12, speed: 0.05, ambient: true },
      { x: 0.45, y: 0.60, vx: 0, vy: 0, r: 0.10, speed: 0.06, ambient: true },
    ];

    const TRAIL_LEN = 22;
    const trail = Array.from({ length: TRAIL_LEN }, () => ({ x: 0.5, y: 0.45 }));

    let mouse = { x: 0.5, y: 0.45 };
    let frame = 0;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      off.width     = canvas.width;
      off.height    = canvas.height;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) / rect.width;
      mouse.y = (e.clientY - rect.top)  / rect.height;
    };
    window.addEventListener('mousemove', onMove);

    // Draw metaball blob on offscreen (pure solid fill for contrast trick)
    const drawMetaBlob = (ctx2, bx, by, br) => {
      const w = off.width;
      const h = off.height;
      const cx = bx * w;
      const cy = by * h;
      const r  = br * Math.max(w, h);
      const g = ctx2.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0,   'rgba(200,0,0,1)');
      g.addColorStop(0.5, 'rgba(160,0,0,0.6)');
      g.addColorStop(1,   'rgba(0,0,0,0)');
      ctx2.fillStyle = g;
      ctx2.beginPath();
      ctx2.arc(cx, cy, r, 0, Math.PI * 2);
      ctx2.fill();
    };

    // 3D specular highlight on a blob
    const drawSpecular = (cx, cy, r) => {
      // top-left highlight for 3D lit look
      const hx = cx - r * 0.28;
      const hy = cy - r * 0.28;
      const hr = r * 0.45;
      const spec = ctx.createRadialGradient(hx, hy, 0, hx, hy, hr);
      spec.addColorStop(0,   'rgba(255,180,160,0.55)');
      spec.addColorStop(0.4, 'rgba(255,80,60,0.2)');
      spec.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = spec;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // tiny bright hotspot
      const sg = ctx.createRadialGradient(hx, hy, 0, hx, hy, r * 0.18);
      sg.addColorStop(0, 'rgba(255,230,220,0.8)');
      sg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = sg;
      ctx.beginPath();
      ctx.arc(hx, hy, r * 0.18, 0, Math.PI * 2);
      ctx.fill();
    };

    let raf;
    const render = () => {
      frame++;
      const W = canvas.width;
      const H = canvas.height;

      if (!prefersReducedMotion) {
        // Blob targets
        blobs[0].tx = mouse.x;
        blobs[0].ty = mouse.y;
        blobs[1].tx = mouse.x + Math.sin(frame * 0.014) * 0.06;
        blobs[1].ty = mouse.y + Math.cos(frame * 0.011) * 0.05;
        blobs[2].tx = mouse.x + Math.cos(frame * 0.019) * 0.04;
        blobs[2].ty = mouse.y + Math.sin(frame * 0.016) * 0.04;
        blobs[3].tx = 0.38 + Math.sin(frame * 0.007) * 0.18;
        blobs[3].ty = 0.55 + Math.cos(frame * 0.005) * 0.12;
        blobs[4].tx = 0.62 + Math.cos(frame * 0.009) * 0.15;
        blobs[4].ty = 0.38 + Math.sin(frame * 0.006) * 0.12;
        blobs[5].tx = 0.45 + Math.sin(frame * 0.011) * 0.12;
        blobs[5].ty = 0.60 + Math.cos(frame * 0.008) * 0.10;

        // Shift trail
        trail.unshift({ x: mouse.x * W, y: mouse.y * H });
        trail.pop();
      }

      blobs.forEach(b => {
        b.x += ((b.tx || 0.5) - b.x) * b.speed;
        b.y += ((b.ty || 0.45) - b.y) * b.speed;
      });

      // ── OFFSCREEN: metaball blur+contrast pass ──
      offCtx.clearRect(0, 0, W, H);
      offCtx.save();
      offCtx.filter = 'blur(38px) contrast(14)';
      blobs.forEach(b => drawMetaBlob(offCtx, b.x, b.y, b.r));
      // trail blobs
      trail.forEach((p, i) => {
        const t = 1 - i / TRAIL_LEN;
        const r = (0.025 + t * 0.055);
        drawMetaBlob(offCtx, p.x / W, p.y / H, r);
      });
      offCtx.restore();

      // ── MAIN CANVAS ──
      ctx.clearRect(0, 0, W, H);

      // Dark base
      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, W, H);

      // Composite metaball layer — colorize deep red
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(off, 0, 0);
      ctx.restore();

      // Color wash over metaballs — deep crimson with glow
      ctx.save();
      ctx.globalCompositeOperation = 'multiply';
      const colorWash = ctx.createRadialGradient(
        mouse.x * W, mouse.y * H, 0,
        mouse.x * W, mouse.y * H, 0.6 * Math.max(W, H)
      );
      colorWash.addColorStop(0,   'rgba(255,30,10,1)');
      colorWash.addColorStop(0.3, 'rgba(180,0,0,1)');
      colorWash.addColorStop(0.7, 'rgba(90,0,0,1)');
      colorWash.addColorStop(1,   'rgba(20,0,0,1)');
      ctx.fillStyle = colorWash;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      // 3D specular highlights per blob
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      blobs.slice(0, 3).forEach(b => {
        const cx = b.x * W;
        const cy = b.y * H;
        const r  = b.r * Math.max(W, H) * 0.55;
        drawSpecular(cx, cy, r);
      });
      ctx.restore();

      // Edge rim glow on liquid surface
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      blobs.slice(0, 3).forEach(b => {
        const cx = b.x * W;
        const cy = b.y * H;
        const r  = b.r * Math.max(W, H) * 0.6;
        const rim = ctx.createRadialGradient(cx, cy, r * 0.7, cx, cy, r);
        rim.addColorStop(0,   'rgba(0,0,0,0)');
        rim.addColorStop(0.8, 'rgba(255,40,10,0.12)');
        rim.addColorStop(1,   'rgba(255,100,50,0.25)');
        ctx.fillStyle = rim;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // Cursor hot spot
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const mx = mouse.x * W;
      const my = mouse.y * H;
      const hs = 0.04 * Math.min(W, H);
      const hg = ctx.createRadialGradient(mx - hs * 0.3, my - hs * 0.3, 0, mx, my, hs * 1.4);
      hg.addColorStop(0,   'rgba(255,220,200,0.95)');
      hg.addColorStop(0.25,'rgba(255,80,40,0.7)');
      hg.addColorStop(0.6, 'rgba(200,10,10,0.3)');
      hg.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = hg;
      ctx.beginPath();
      ctx.arc(mx, my, hs * 1.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Vignette
      const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.15, W / 2, H / 2, H * 1.0);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(0,0,0,0.92)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);

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
        background: '#080808',
      }}
    />
  );
}