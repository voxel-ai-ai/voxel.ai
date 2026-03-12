import React, { useState, useRef, useEffect } from 'react';
import { X, Heart, Download, Share2, Bookmark, Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Wand2, Copy, MoreHorizontal, ChevronLeft, ChevronRight, Clock, Zap } from 'lucide-react';

const font = '"DM Sans", sans-serif';

function VideoPlayer({ gradient }) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState(false);
  const intervalRef = useRef(null);

  // Simulate playback progress
  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) { setPlaying(false); return 0; }
          return p + 0.5;
        });
      }, 80);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing]);

  const fmt = (pct) => {
    const secs = Math.round((pct / 100) * 8);
    return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
  };

  return (
    <div
      style={{ width: '100%', aspectRatio: '16/9', background: gradient || '#1a1a1a', position: 'relative', borderRadius: 0, overflow: 'hidden', cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setPlaying(v => !v)}
    >
      {/* Fake video frame */}
      <div style={{ position: 'absolute', inset: 0, background: gradient, opacity: 0.9 }} />

      {/* Film grain overlay */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', opacity: 0.04, pointerEvents: 'none' }} />

      {/* Play/Pause button center */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: hovered || !playing ? 1 : 0, transition: 'opacity 0.25s',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255,255,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.18s, background 0.18s',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.background = 'rgba(224,30,30,0.6)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'rgba(0,0,0,0.55)'; }}
        >
          {playing
            ? <Pause style={{ width: 24, height: 24, color: '#fff' }} />
            : <Play style={{ width: 24, height: 24, color: '#fff', marginLeft: 3 }} />
          }
        </div>
      </div>

      {/* Bottom controls */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
        padding: '40px 16px 14px',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.25s',
      }} onClick={e => e.stopPropagation()}>
        {/* Progress */}
        <div
          style={{ height: 3, background: 'rgba(255,255,255,0.2)', borderRadius: 999, marginBottom: 10, cursor: 'pointer', position: 'relative' }}
          onClick={e => {
            const rect = e.currentTarget.getBoundingClientRect();
            setProgress(((e.clientX - rect.left) / rect.width) * 100);
          }}
        >
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #CC0000, #FF3333)', borderRadius: 999, transition: 'width 0.1s linear', position: 'relative' }}>
            <div style={{ position: 'absolute', right: -5, top: '50%', transform: 'translateY(-50%)', width: 12, height: 12, borderRadius: '50%', background: '#FF3333', boxShadow: '0 0 8px rgba(224,30,30,0.8)' }} />
          </div>
        </div>
        {/* Controls row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => setPlaying(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex', padding: 0 }}>
            {playing ? <Pause style={{ width: 18, height: 18 }} /> : <Play style={{ width: 18, height: 18, marginLeft: 1 }} />}
          </button>
          <button onClick={() => { setProgress(0); setPlaying(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', display: 'flex', padding: 0 }}>
            <RotateCcw style={{ width: 15, height: 15 }} />
          </button>
          <button onClick={() => setMuted(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', display: 'flex', padding: 0 }}>
            {muted ? <VolumeX style={{ width: 16, height: 16 }} /> : <Volume2 style={{ width: 16, height: 16 }} />}
          </button>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontFamily: font, flex: 1 }}>{fmt(progress)} / 0:08</span>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', display: 'flex', padding: 0 }}>
            <Maximize style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VideoDetailModal({ video, videos = [], onClose, onNavigate }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!video) return null;

  const currentIndex = videos.findIndex(v => v.id === video.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < videos.length - 1;

  const handleCopy = () => {
    navigator.clipboard.writeText(video.prompt || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNav = (dir) => {
    const next = videos[currentIndex + dir];
    if (next && onNavigate) onNavigate(next);
  };

  const metaTags = [
    { icon: Clock, label: 'Duration', value: video.duration || '8s' },
    { icon: Zap, label: 'Model', value: video.model || 'Wan 2.2' },
  ];

  const GRADIENTS = [
    'linear-gradient(135deg, #0a0a1a 0%, #1a0a2a 50%, #2a0a0a 100%)',
    'linear-gradient(135deg, #1a0000 0%, #8B0000 50%, #1a1a1a 100%)',
    'linear-gradient(135deg, #0d0d0d 0%, #2a0000 60%, #111 100%)',
    'linear-gradient(135deg, #1a1a0a 0%, #3a1a00 50%, #0a0a0a 100%)',
  ];
  const grad = video.gradient || GRADIENTS[currentIndex % GRADIENTS.length];

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <style>{`
        @keyframes vidModalIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
        .vid-detail-panel { animation: vidModalIn 0.22s cubic-bezier(0.4,0,0.2,1) forwards; }
        .vd-action-btn:hover { background: rgba(255,255,255,0.1) !important; }
      `}</style>

      <div
        className="vid-detail-panel"
        onClick={e => e.stopPropagation()}
        style={{
          display: 'flex', flexDirection: 'column',
          width: 'min(1000px, 96vw)',
          background: '#0E0E0E', borderRadius: 20, overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.9)',
          maxHeight: '94vh',
        }}
      >
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #E01E1E, #8B0000)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: font }}>V</div>
            <div>
              <p style={{ margin: 0, fontSize: 13, color: '#fff', fontWeight: 600, fontFamily: font }}>You</p>
              <p style={{ margin: 0, fontSize: 11, color: '#555', fontFamily: font }}>Generated just now</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Nav buttons */}
            {hasPrev && (
              <button onClick={() => handleNav(-1)}
                style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontSize: 12, fontFamily: font, transition: 'all 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
              >
                <ChevronLeft style={{ width: 14, height: 14 }} /> Prev
              </button>
            )}
            {hasNext && (
              <button onClick={() => handleNav(1)}
                style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontSize: 12, fontFamily: font, transition: 'all 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
              >
                Next <ChevronRight style={{ width: 14, height: 14 }} />
              </button>
            )}
            <button className="vd-action-btn" onClick={onClose}
              style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
            >
              <X style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>

        {/* Main body */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
          {/* Video */}
          <div style={{ flex: 1, background: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <VideoPlayer gradient={grad} />

            {/* Thumbnail strip */}
            {videos.length > 1 && (
              <div style={{ display: 'flex', gap: 8, padding: '12px 16px', overflowX: 'auto', background: '#0A0A0A', borderTop: '1px solid rgba(255,255,255,0.05)' }} className="hide-scrollbar">
                {videos.map((v, i) => (
                  <div
                    key={v.id || i}
                    onClick={() => onNavigate && onNavigate(v)}
                    style={{ width: 80, height: 48, borderRadius: 8, cursor: 'pointer', flexShrink: 0, background: v.gradient || GRADIENTS[i % GRADIENTS.length], border: `2px solid ${v.id === video.id ? '#E01E1E' : 'rgba(255,255,255,0.1)'}`, position: 'relative', overflow: 'hidden', transition: 'border-color 0.15s' }}
                  >
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Play style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.6)', marginLeft: 1 }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info sidebar */}
          <div style={{ width: 280, flexShrink: 0, background: '#0C0C0C', borderLeft: '1px solid rgba(255,255,255,0.07)', overflowY: 'auto' }} className="hide-scrollbar">
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Action row */}
              <div style={{ display: 'flex', gap: 6 }}>
                {[
                  { icon: Heart, label: 'Like', active: liked, color: '#E01E1E', onClick: () => setLiked(v => !v) },
                  { icon: Bookmark, label: 'Save', active: saved, color: '#E01E1E', onClick: () => setSaved(v => !v) },
                  { icon: Download, label: 'Export', active: false, color: null, onClick: () => {} },
                  { icon: Share2, label: 'Share', active: false, color: null, onClick: () => {} },
                ].map(({ icon: Icon, label, active, color, onClick }) => (
                  <button key={label} onClick={onClick}
                    style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '9px 4px', borderRadius: 12, background: active ? `${color}18` : 'rgba(255,255,255,0.05)', border: `1px solid ${active ? `${color}44` : 'rgba(255,255,255,0.07)'}`, cursor: 'pointer', transition: 'all 0.18s' }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? `${color}18` : 'rgba(255,255,255,0.05)'; }}
                  >
                    <Icon style={{ width: 14, height: 14, color: active ? color : 'rgba(255,255,255,0.5)', fill: active && label === 'Like' ? color : 'none' }} />
                    <span style={{ fontSize: 9, color: active ? color : 'rgba(255,255,255,0.35)', fontFamily: font }}>{label}</span>
                  </button>
                ))}
              </div>

              {/* Prompt */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', fontFamily: font, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Prompt</span>
                  <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: copied ? '#4CAF50' : 'rgba(255,255,255,0.35)', fontFamily: font, background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}>
                    <Copy style={{ width: 11, height: 11 }} /> {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: font, lineHeight: 1.6, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '10px 12px', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {video.prompt || 'No prompt provided'}
                </p>
              </div>

              {/* Meta */}
              <div>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', fontFamily: font, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Details</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {metaTags.map(({ icon: Icon, label, value }) => (
                    <div key={label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '8px 10px', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <p style={{ margin: 0, fontSize: 9, color: 'rgba(255,255,255,0.28)', fontFamily: font, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Icon style={{ width: 9, height: 9 }} />{label}
                      </p>
                      <p style={{ margin: '3px 0 0 0', fontSize: 12, color: '#fff', fontFamily: font, fontWeight: 600 }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', fontFamily: font, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Actions</span>
                {[
                  { icon: Wand2, label: 'Extend Video', desc: 'Add more seconds' },
                  { icon: RotateCcw, label: 'Regenerate', desc: 'New result, same prompt' },
                ].map(({ icon: Icon, label, desc }) => (
                  <button key={label}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.18s', width: '100%' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
                  >
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(224,30,30,0.12)', border: '1px solid rgba(224,30,30,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon style={{ width: 12, height: 12, color: '#FF4444' }} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 12, color: '#fff', fontFamily: font, fontWeight: 500 }}>{label}</p>
                      <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: font }}>{desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}