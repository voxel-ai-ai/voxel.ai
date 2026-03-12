import React, { useState } from 'react';
import { X, Heart, Download, RefreshCw, Maximize2, Copy, Share2, Wand2, ChevronLeft, ChevronRight, Bookmark, MoreHorizontal } from 'lucide-react';

const font = '"DM Sans", sans-serif';

export default function ImageDetailModal({ image, images = [], onClose, onNavigate }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!image) return null;

  const currentIndex = images.findIndex(img => img.id === image.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  const handleCopy = () => {
    navigator.clipboard.writeText(image.prompt || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNav = (dir) => {
    const next = images[currentIndex + dir];
    if (next && onNavigate) onNavigate(next);
  };

  const metaTags = [
    { label: 'Model', value: image.model || 'Nano Banana Pro' },
    { label: 'Aspect', value: image.aspect || '16:9' },
    { label: 'Quality', value: image.quality || '2K' },
    { label: 'Style', value: image.style || 'Cinematic' },
  ];

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <style>{`
        @keyframes modalIn { from{opacity:0;transform:scale(0.96)} to{opacity:1;transform:scale(1)} }
        .img-detail-panel { animation: modalIn 0.22s cubic-bezier(0.4,0,0.2,1) forwards; }
        .action-btn:hover { background: rgba(255,255,255,0.12) !important; }
        .nav-btn:hover { background: rgba(255,255,255,0.15) !important; opacity: 1 !important; }
      `}</style>

      <div
        className="img-detail-panel"
        onClick={e => e.stopPropagation()}
        style={{
          display: 'flex', width: 'min(1100px, 96vw)', height: 'min(700px, 92vh)',
          background: '#111', borderRadius: 20, overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
        }}
      >
        {/* ── LEFT: Image ── */}
        <div style={{ flex: 1, background: image.url ? '#000' : image.gradient, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {image.url ? (
            <img src={image.url} alt={image.prompt} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: image.gradient }} />
          )}

          {/* Nav arrows */}
          {hasPrev && (
            <button className="nav-btn"
              onClick={() => handleNav(-1)}
              style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', transition: 'all 0.15s', opacity: 0.8 }}
            >
              <ChevronLeft style={{ width: 20, height: 20 }} />
            </button>
          )}
          {hasNext && (
            <button className="nav-btn"
              onClick={() => handleNav(1)}
              style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', transition: 'all 0.15s', opacity: 0.8 }}
            >
              <ChevronRight style={{ width: 20, height: 20 }} />
            </button>
          )}

          {/* Bottom quick actions overlay */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px 16px 16px', background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)', display: 'flex', alignItems: 'center', gap: 8 }}>
            {images.length > 1 && images.slice(Math.max(0, currentIndex - 2), currentIndex + 3).map((img, i) => (
              <div
                key={img.id}
                onClick={() => onNavigate && onNavigate(img)}
                style={{ width: 44, height: 32, borderRadius: 8, overflow: 'hidden', cursor: 'pointer', border: `2px solid ${img.id === image.id ? '#E01E1E' : 'rgba(255,255,255,0.2)'}`, flexShrink: 0, transition: 'border-color 0.15s', background: img.gradient }}
              />
            ))}
          </div>
        </div>

        {/* ── RIGHT: Info Panel ── */}
        <div style={{ width: 320, flexShrink: 0, background: '#0E0E0E', borderLeft: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 16px 0 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #E01E1E, #8B0000)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: font }}>V</div>
              <div>
                <p style={{ margin: 0, fontSize: 13, color: '#fff', fontWeight: 600, fontFamily: font }}>You</p>
                <p style={{ margin: 0, fontSize: 11, color: '#555', fontFamily: font }}>Just now</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <button className="action-btn" style={{ width: 30, height: 30, borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}>
                <MoreHorizontal style={{ width: 16, height: 16 }} />
              </button>
              <button className="action-btn" onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}>
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }} className="hide-scrollbar">
            {/* Action row */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
              {[
                { icon: Heart, label: 'Like', active: liked, color: '#E01E1E', onClick: () => setLiked(v => !v) },
                { icon: Bookmark, label: 'Save', active: saved, color: '#E01E1E', onClick: () => setSaved(v => !v) },
                { icon: Download, label: 'Download', active: false, color: null, onClick: () => {} },
                { icon: Share2, label: 'Share', active: false, color: null, onClick: () => {} },
              ].map(({ icon: Icon, label, active, color, onClick }) => (
                <button key={label} onClick={onClick}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '10px 4px', borderRadius: 12, background: active ? `${color}18` : 'rgba(255,255,255,0.05)', border: `1px solid ${active ? `${color}44` : 'rgba(255,255,255,0.08)'}`, cursor: 'pointer', transition: 'all 0.18s' }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                >
                  <Icon style={{ width: 16, height: 16, color: active ? color : 'rgba(255,255,255,0.55)', fill: active && label === 'Like' ? color : 'none' }} />
                  <span style={{ fontSize: 10, color: active ? color : 'rgba(255,255,255,0.4)', fontFamily: font }}>{label}</span>
                </button>
              ))}
            </div>

            {/* Prompt */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', fontFamily: font, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Prompt</span>
                <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: copied ? '#4CAF50' : 'rgba(255,255,255,0.4)', fontFamily: font, background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}>
                  <Copy style={{ width: 12, height: 12 }} /> {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.75)', fontFamily: font, lineHeight: 1.6, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '10px 12px', border: '1px solid rgba(255,255,255,0.07)' }}>
                {image.prompt || 'No prompt provided'}
              </p>
            </div>

            {/* Meta tags */}
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', fontFamily: font, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 10 }}>Settings</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {metaTags.map(({ label, value }) => (
                  <div key={label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '8px 12px', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: font, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</p>
                    <p style={{ margin: '3px 0 0 0', fontSize: 13, color: '#fff', fontFamily: font, fontWeight: 600 }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '4px 0 16px' }} />

            {/* Quick actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', fontFamily: font, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Actions</span>
              {[
                { icon: Wand2, label: 'Generate Variations', desc: 'Create similar images' },
                { icon: Maximize2, label: 'Upscale to 4K', desc: 'Enhance resolution' },
                { icon: RefreshCw, label: 'Regenerate', desc: 'Same prompt, new result' },
              ].map(({ icon: Icon, label, desc }) => (
                <button key={label}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.18s', width: '100%' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(224,30,30,0.12)', border: '1px solid rgba(224,30,30,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon style={{ width: 14, height: 14, color: '#FF4444' }} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, color: '#fff', fontFamily: font, fontWeight: 500 }}>{label}</p>
                    <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: font }}>{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}