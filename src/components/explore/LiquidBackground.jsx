import React, { useRef, useEffect } from 'react';

export default function LiquidBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Trail points for liquid drip effect
    const TRAIL_LEN = 28;
    const trail = Array.from({ length: TRAIL_LEN }, () => ({ x: 0.5, y: 0.45 }));

    // Blobs: first 3 follow mouse, rest ambient
    const blobs = [
      { x: 0.5, y: 0.45, tx: 0.5, ty: 0.45, r: 0.42, color: 'rgba(220,0,0,0.90)',   speed: 0.09  },
      { x: 0.5, y: 0.5,  tx: 0.5, ty: 0.5,  r: 0.26, color: 'rgba(255,40,40,0.82)', speed: 0.13  },
      { x: 0.5, y: 0.42, tx: 0.5, ty: 0.42, r: 0.14, color: 'rgba(255,80,80,0.92)', speed: 0.18  },
      // ambient
      { x: 0.25, y: 0.65, tx: 0.25, ty: 0.65, r: 0.20, color: 'rgba(160,0,0,0.55)', speed: 0.022, ambient: true },
      { x: 0.75, y: 0.30, tx: 0.75, ty: 0.30, r: 0.18, color: 'rgba(180,10,10,0.50)', speed: 0.027, ambient: true },
    ];

    let mouse = { x: 0.5, y: 0.45 };
    let frame = 0;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      // seed trail to center
      const cx = canvas.width * 0.5;
      const cy = canvas.height * 0.45;
      trail.forEach(p => { p.x = cx; p.y = cy; });
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
      grad.addColorStop(0.45, blob.color.replace(/[\d.]+\)$/, '0.18)'));
      grad.addColorStop(1,   'rgba(0,0,0,0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r * 0.7, Math.sin(frame * 0.008) * 0.35, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawTrail = () => {
      const w = canvas.width;
      const h = canvas.height;

      for (let i = 0; i < trail.length; i++) {
        const t = 1 - i / trail.length;
        const p = trail[i];
        const r = (0.04 + t * 0.09) * Math.min(w, h);
        const alpha = t * 0.55;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        grad.addColorStop(0, `rgba(255,30,30,${alpha})`);
        grad.addColorStop(0.5, `rgba(180,0,0,${alpha * 0.4})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    let raf;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!prefersReducedMotion) {
        // Update blob targets
        blobs[0].tx = mouse.x;
        blobs[0].ty = mouse.y;
        blobs[1].tx = mouse.x + Math.sin(frame * 0.012) * 0.05;
        blobs[1].ty = mouse.y + Math.cos(frame * 0.010) * 0.04;
        blobs[2].tx = mouse.x + Math.cos(frame * 0.018) * 0.03;
        blobs[2].ty = mouse.y + Math.sin(frame * 0.015) * 0.03;

        blobs[3].tx = 0.25 + Math.sin(frame * 0.007) * 0.14;
        blobs[3].ty = 0.65 + Math.cos(frame * 0.005) * 0.1;
        blobs[4].tx = 0.75 + Math.cos(frame * 0.009) * 0.12;
        blobs[4].ty = 0.30 + Math.sin(frame * 0.006) * 0.1;

        // Shift trail
        const mx = mouse.x * canvas.width;
        const my = mouse.y * canvas.height;
        trail.unshift({ x: mx, y: my });
        trail.pop();
      }

      blobs.forEach(b => {
        b.x += (b.tx - b.x) * b.speed;
        b.y += (b.ty - b.y) * b.speed;
      });

      // Ambient pass — blurred, large
      ctx.save();
      ctx.filter = 'blur(90px)';
      blobs.forEach(drawBlob);
      ctx.restore();

      // Sharp inner glow
      ctx.save();
      ctx.filter = 'blur(28px)';
      ctx.globalAlpha = 0.75;
      drawBlob(blobs[2]);
      ctx.restore();

      // Liquid trail
      ctx.save();
      ctx.filter = 'blur(18px)';
      ctx.globalCompositeOperation = 'screen';
      drawTrail();
      ctx.restore();

      // Extra sharp hot-spot at cursor
      ctx.save();
      ctx.filter = 'blur(8px)';
      ctx.globalAlpha = 0.9;
      const hw = canvas.width;
      const hh = canvas.height;
      const hx = mouse.x * hw;
      const hy = mouse.y * hh;
      const hr = 0.05 * Math.min(hw, hh);
      const hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, hr);
      hg.addColorStop(0, 'rgba(255,80,80,0.9)');
      hg.addColorStop(0.5, 'rgba(200,20,20,0.4)');
      hg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = hg;
      ctx.beginPath();
      ctx.arc(hx, hy, hr, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Vignette
      const vw = canvas.width;
      const vh = canvas.height;
      const vg = ctx.createRadialGradient(vw / 2, vh / 2, vh * 0.2, vw / 2, vh / 2, vh * 0.95);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(17,17,17,0.88)');
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
        background: '#111111',
      }}
    />
  );
}