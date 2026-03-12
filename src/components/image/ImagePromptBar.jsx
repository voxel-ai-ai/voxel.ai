import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, ChevronDown, Minus, Plus, Pencil, Type, X, Check } from 'lucide-react';
import PageSwitcher from '@/components/common/PageSwitcher';

// ─── Image Models ────────────────────────────────────────────────────────────
const IMAGE_MODELS = [
  { id: 'nano-pro',        name: 'Nano Banana Pro',   brand: 'VOXEL',            credits: 150,  badge: null,        desc: 'Best 4K image model for stunning high-aesthetic visuals',                   tags: ['4K', 'Fast', 'Portrait'] },
  { id: 'nano-2',          name: 'Nano Banana 2',     brand: 'VOXEL',            credits: 100,  badge: 'NEW',       desc: 'Pro-level quality at Flash speed with subject consistency',                  tags: ['4K', 'Ultra Fast'] },
  { id: 'soul-2',          name: 'Soul 2.0',          brand: 'VOXEL',            credits: 120,  badge: null,        desc: 'Fashion-forward portraits with built-in cultural fluency',                   tags: ['4K', 'Fashion', 'Portrait'] },
  { id: 'seedream-5-lite', name: 'Seedream 5.0 Lite', brand: 'ByteDance',        credits: 50,   badge: 'UNLIMITED', desc: 'Intelligent visual reasoning for logically accurate images',                 tags: ['2K', 'Fast', 'Unlimited'] },
  { id: 'seedream-4',      name: 'Seedream 4.5',      brand: 'ByteDance',        credits: 80,   badge: null,        desc: 'Next-gen 4K image model for detailed photorealistic images',                 tags: ['4K', 'Photorealistic'] },
  { id: 'gpt-image',       name: 'GPT Image 1.5',     brand: 'OpenAI',           credits: 200,  badge: 'PREMIUM',   desc: 'True-color precision rendering with intelligent composition',                tags: ['4K', 'Precise'] },
  { id: 'flux-kontext',    name: 'Flux Kontext',       brand: 'Black Forest Labs', credits: 90,  badge: null,        desc: 'Stylistic diversity and aesthetic variations for any genre',                 tags: ['2K', 'Stylized'] },
  { id: 'flux-2',          name: 'Flux 2',             brand: 'Black Forest Labs', credits: 60,  badge: null,        desc: 'Fast high-quality generation with strong prompt adherence',                  tags: ['2K', 'Fast'] },
  { id: 'wan-22',          name: 'Wan 2.2 Image',      brand: 'Alibaba',          credits: 70,   badge: null,        desc: 'Stylized and illustrated visual creation with artistic depth',               tags: ['2K', 'Artistic'] },
  { id: 'skin-enhancer',   name: 'Skin Enhancer',      brand: 'VOXEL',            credits: 40,   badge: null,        desc: 'Adds natural realistic skin textures to any portrait',                       tags: ['Enhancement', 'Portrait'] },
  { id: 'face-swap',       name: 'Face Swap',          brand: 'VOXEL',            credits: 30,   badge: null,        desc: 'Instant seamless AI face replacement in any image',                          tags: ['Swap', 'Fast'] },
  { id: 'relight',         name: 'Relight',            brand: 'VOXEL',            credits: 35,   badge: null,        desc: 'Change lighting conditions in any generated or real image',                  tags: ['Edit', 'Lighting'] },
];

const ASPECT_RATIOS = [
  { value: '1:1',  label: '1:1',  w: 18, h: 18 },
  { value: '3:4',  label: '3:4',  w: 14, h: 18 },
  { value: '4:3',  label: '4:3',  w: 18, h: 14 },
  { value: '9:16', label: '9:16', w: 11, h: 18 },
  { value: '16:9', label: '16:9', w: 18, h: 10 },
  { value: '2:3',  label: '2:3',  w: 13, h: 18 },
  { value: '3:2',  label: '3:2',  w: 18, h: 13 },
  { value: '5:4',  label: '5:4',  w: 17, h: 14 },
  { value: '4:5',  label: '4:5',  w: 14, h: 17 },
  { value: '21:9', label: '21:9', w: 18, h: 8  },
];
const QUALITIES = ['Draft', '1K', '2K', '4K'];
const STYLES = [
  { name: 'Cinematic',    img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=120&q=80&fit=crop', desc: 'Film-grade color grading and dramatic lighting' },
  { name: 'Realistic',    img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&q=80&fit=crop', desc: 'True-to-life photorealistic rendering' },
  { name: 'Anime',        img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=120&q=80&fit=crop', desc: 'Japanese animation aesthetic and bold outlines' },
  { name: '3D',           img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=120&q=80&fit=crop', desc: 'Rendered 3D visuals with depth and texture' },
  { name: '2D',           img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&q=80&fit=crop', desc: 'Flat 2D art with clean shapes and colors' },
  { name: 'Illustration', img: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=120&q=80&fit=crop', desc: 'Hand-crafted illustrative artistic style' },
  { name: 'Pixar',        img: 'https://images.unsplash.com/photo-1560942485-b2a11cc13456?w=120&q=80&fit=crop', desc: 'Warm expressive CGI with Pixar-like charm' },
  { name: 'Cartoon',      img: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=120&q=80&fit=crop', desc: 'Bold outlines and vibrant cartoon colors' },
];

const brandColors = {
  VOXEL: '#E01E1E',
  ByteDance: '#F59E0B',
  OpenAI: '#10A37F',
  'Black Forest Labs': '#8B5CF6',
  Alibaba: '#F97316',
};

const Badge = ({ type }) => {
  const styles = {
    NEW:       { background: 'rgba(100,220,100,0.15)', border: '1px solid rgba(100,220,100,0.3)', color: '#88EE88' },
    UNLIMITED: { background: 'rgba(100,160,255,0.15)', border: '1px solid rgba(100,160,255,0.3)', color: '#88BBFF' },
    PREMIUM:   { background: 'rgba(255,200,50,0.15)',  border: '1px solid rgba(255,200,50,0.3)',  color: '#FFCC44' },
  };
  if (!styles[type]) return null;
  return (
    <span style={{ ...styles[type], padding: '2px 7px', borderRadius: 5, fontSize: 11, marginLeft: 6 }}>
      {type}
    </span>
  );
};

const BrandDot = ({ brand }) => (
  <span
    style={{
      width: 18, height: 18, borderRadius: '50%',
      background: brandColors[brand] || '#666',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 9, fontWeight: 700, color: '#fff', flexShrink: 0,
    }}
  >
    {brand.charAt(0)}
  </span>
);

// ─── Model Modal ─────────────────────────────────────────────────────────────
function ModelModal({ selectedId, onSelect, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        bottom: 'calc(28px + 140px + 8px)',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(880px, 92vw)',
        maxHeight: '65vh',
        overflowY: 'auto',
        background: 'rgba(20,20,24,0.97)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 22,
        padding: 20,
        boxShadow: '0 -12px 60px rgba(0,0,0,0.7)',
        zIndex: 200,
        animation: 'imgModelSlideUp 0.28s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <style>{`
        @keyframes imgModelSlideUp {
          from { opacity:0; transform:translateX(-50%) translateY(16px); }
          to   { opacity:1; transform:translateX(-50%) translateY(0); }
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <span style={{ color: '#fff', fontSize: 17, fontWeight: 700 }}>Models</span>
        <div className="flex items-center gap-3">
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>✦ 40,000 credits remaining</span>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
            <X className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.5)' }} />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {IMAGE_MODELS.map((m) => {
          const isSelected = selectedId === m.id;
          return (
            <button
              key={m.id}
              onClick={() => { onSelect(m); onClose(); }}
              className="text-left transition-all duration-200"
              style={{
                background: isSelected ? 'rgba(224,30,30,0.05)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isSelected ? 'rgba(224,30,30,0.55)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 14,
                padding: 15,
                cursor: 'pointer',
              }}
              onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)'; }}}
              onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <BrandDot brand={m.brand} />
                  <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{m.name}</span>
                  {m.badge && <Badge type={m.badge} />}
                </div>
                <span style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, padding: '2px 8px', fontSize: 12, color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  ✦ {m.credits}
                </span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, marginBottom: 8, lineHeight: 1.5 }}>{m.desc}</p>
              <div className="flex flex-wrap gap-1">
                {m.tags.map(tag => (
                  <span key={tag} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 6, padding: '3px 8px', fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>
                    {tag}
                  </span>
                ))}
              </div>
              {isSelected && (
                <div className="flex justify-end mt-2">
                  <Check className="w-3.5 h-3.5" style={{ color: '#E01E1E' }} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Aspect Icon ─────────────────────────────────────────────────────────────
function AspectIcon({ w, h, active }) {
  return (
    <div style={{
      width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <div style={{
        width: w, height: h,
        border: `1.5px solid ${active ? '#fff' : 'rgba(255,255,255,0.4)'}`,
        borderRadius: 2,
      }} />
    </div>
  );
}

// ─── Aspect Ratio Dropdown ────────────────────────────────────────────────────
function AspectDropdown({ selected, onSelect, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [onClose]);
  return (
    <div ref={ref} style={{
      position: 'fixed',
      bottom: 'calc(28px + 72px + 12px)',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'min(240px, 92vw)',
      background: 'rgba(22,22,26,0.97)',
      backdropFilter: 'blur(40px) saturate(1.8)',
      WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
      border: '1px solid rgba(255,255,255,0.09)',
      borderRadius: 18,
      boxShadow: '0 -12px 60px rgba(0,0,0,0.8)',
      padding: '12px 0 8px 0',
      zIndex: 200,
      animation: 'imgStyleSlideUp 0.25s cubic-bezier(0.4,0,0.2,1)',
    }}>
      <div style={{ padding: '0 14px 8px 14px', color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}>
        Aspect ratio
      </div>
      {ASPECT_RATIOS.map(opt => {
        const isSelected = selected === opt.value;
        return (
          <button key={opt.value} onClick={() => { onSelect(opt.value); onClose(); }}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '9px 14px', background: isSelected ? 'rgba(255,255,255,0.08)' : 'transparent',
              border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s',
              fontFamily: '"DM Sans", sans-serif',
            }}
            onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = isSelected ? 'rgba(255,255,255,0.08)' : 'transparent'; }}
          >
            <AspectIcon w={opt.w} h={opt.h} active={isSelected} />
            <span style={{ color: isSelected ? '#fff' : 'rgba(255,255,255,0.6)', fontSize: 14 }}>{opt.label}</span>
            {isSelected && <Check className="w-3.5 h-3.5" style={{ color: '#E01E1E', marginLeft: 'auto', flexShrink: 0 }} />}
          </button>
        );
      })}
    </div>
  );
}

// ─── Simple Dropdown ─────────────────────────────────────────────────────────
function SimpleDropdown({ options, selected, onSelect, onClose, label }) {
  const ref = useRef(null);
  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [onClose]);
  return (
    <div ref={ref} style={{
      position: 'fixed',
      bottom: 'calc(28px + 72px + 12px)',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'min(240px, 92vw)',
      background: 'rgba(22,22,26,0.97)',
      backdropFilter: 'blur(40px) saturate(1.8)',
      WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
      border: '1px solid rgba(255,255,255,0.09)',
      borderRadius: 18,
      boxShadow: '0 -12px 60px rgba(0,0,0,0.8)',
      padding: '12px 0 8px 0',
      zIndex: 200,
      animation: 'imgStyleSlideUp 0.25s cubic-bezier(0.4,0,0.2,1)',
    }}>
      {label && (
        <div style={{ padding: '0 14px 8px 14px', color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}>
          {label}
        </div>
      )}
      {options.map(opt => (
        <button key={opt} onClick={() => { onSelect(opt); onClose(); }}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '9px 14px', background: selected === opt ? 'rgba(255,255,255,0.08)' : 'transparent',
            border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s',
            color: selected === opt ? '#fff' : 'rgba(255,255,255,0.6)', fontSize: 14,
            fontFamily: '"DM Sans", sans-serif',
          }}
          onMouseEnter={e => { if (selected !== opt) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
          onMouseLeave={e => { if (selected !== opt) e.currentTarget.style.background = 'transparent'; }}
        >
          {opt}
          {selected === opt && <Check className="w-3.5 h-3.5" style={{ color: '#E01E1E', flexShrink: 0 }} />}
        </button>
      ))}
    </div>
  );
}

// ─── Style Popup ─────────────────────────────────────────────────────────────
function StylePopup({ selected, onSelect, onClose }) {
  const ref = useRef(null);
  const [search, setSearch] = useState('');
  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [onClose]);

  const filtered = STYLES.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div ref={ref} style={{
      position: 'fixed',
      bottom: 'calc(28px + 72px + 12px)',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'min(360px, 92vw)',
      maxHeight: '70vh',
      overflowY: 'auto',
      background: 'rgba(22,22,26,0.97)',
      backdropFilter: 'blur(40px) saturate(1.8)',
      WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
      border: '1px solid rgba(255,255,255,0.09)',
      borderRadius: 18,
      boxShadow: '0 -12px 60px rgba(0,0,0,0.8)',
      padding: '14px 0 8px 0',
      zIndex: 200,
      animation: 'imgStyleSlideUp 0.25s cubic-bezier(0.4,0,0.2,1)',
    }}>
      {/* Search */}
      <div style={{ padding: '0 12px 10px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 12px' }}>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>⌕</span>
          <input
            autoFocus
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search styles..."
            style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 13, fontFamily: '"DM Sans", sans-serif', width: '100%' }}
          />
        </div>
      </div>

      {/* Label */}
      <div style={{ padding: '0 14px 8px 14px', color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>✦</span> STYLES
      </div>

      {/* List */}
      {filtered.map(s => {
        const isSelected = selected === s.name;
        return (
          <button
            key={s.name}
            onClick={() => { onSelect(s.name); onClose(); }}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 14px', background: isSelected ? 'rgba(255,255,255,0.08)' : 'transparent',
              border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s',
            }}
            onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', flexShrink: 0, border: `2px solid ${isSelected ? 'rgba(224,30,30,0.7)' : 'rgba(255,255,255,0.1)'}` }}>
              <img src={s.img} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}>{s.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: '"DM Sans", sans-serif', marginTop: 2 }}>{s.desc}</div>
            </div>
            {isSelected && <Check className="w-3.5 h-3.5" style={{ color: '#E01E1E', flexShrink: 0 }} />}
          </button>
        );
      })}
    </div>
  );
}

// ─── Chip ────────────────────────────────────────────────────────────────────
const chipBase = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  height: 34, padding: '0 14px',
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.11)',
  borderRadius: 999, fontSize: 13,
  fontFamily: '"DM Sans", sans-serif',
  color: 'rgba(255,255,255,0.82)',
  cursor: 'pointer', whiteSpace: 'nowrap',
  transition: 'all 0.18s ease',
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ImagePromptBar({
  prompt, onPromptChange, onGenerate, isGenerating,
  selectedModel, onModelChange, imageCount, onCountChange,
}) {
  const [model, setModel] = useState(IMAGE_MODELS[0]);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [quality, setQuality] = useState('2K');
  const [style, setStyle] = useState(null);
  const [negativeActive, setNegativeActive] = useState(false);
  const [negativePrompt, setNegativePrompt] = useState('');
  const [showModelModal, setShowModelModal] = useState(false);
  const [showAspectDrop, setShowAspectDrop] = useState(false);
  const [showQualityDrop, setShowQualityDrop] = useState(false);
  const [showStylePop, setShowStylePop] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const negRef = useRef(null);
  const styleChipRef = useRef(null);
  const imgInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadedImage(URL.createObjectURL(file));
  };

  const handleSelectModel = (m) => {
    setModel(m);
    if (onModelChange) onModelChange(m);
  };

  const closeAll = () => { setShowModelModal(false); setShowAspectDrop(false); setShowQualityDrop(false); setShowStylePop(false); };

  useEffect(() => {
    if (negativeActive && negRef.current) negRef.current.focus();
  }, [negativeActive]);

  const handleGenerate = () => { if (onGenerate) onGenerate(); };
  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); } };

  // sync selectedModel from parent if provided
  useEffect(() => {
    if (selectedModel && selectedModel.id !== model.id) setModel(selectedModel);
  }, [selectedModel]);

  return (
    <>
      {showModelModal && (
        <ModelModal selectedId={model.id} onSelect={handleSelectModel} onClose={() => setShowModelModal(false)} />
      )}
      {showStylePop && (
        <StylePopup selected={style} onSelect={setStyle} onClose={() => setShowStylePop(false)} />
      )}
      {showAspectDrop && (
        <AspectDropdown selected={aspectRatio} onSelect={setAspectRatio} onClose={() => setShowAspectDrop(false)} />
      )}
      {showQualityDrop && (
        <SimpleDropdown options={QUALITIES} selected={quality} onSelect={setQuality} onClose={() => setShowQualityDrop(false)} label="Quality" />
      )}

      <style>{`
        .img-prompt-textarea::placeholder { color: rgba(255,255,255,0.28); }
        .img-neg-textarea::placeholder { color: rgba(255,255,255,0.25); }
        @keyframes imgStyleSlideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes imgSendPulse {
          0%   { transform: scale(1); }
          40%  { transform: scale(0.88); }
          70%  { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
      `}</style>

      <PageSwitcher />

      {/* ── Fixed Bar ── */}
      <div style={{
        position: 'fixed',
        bottom: 28,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(880px, 92vw)',
        background: 'rgba(18,18,22,0.45)',
        backdropFilter: 'blur(36px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(36px) saturate(1.8)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 22,
        overflow: 'hidden',
        boxShadow: '0 8px 48px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.05) inset, 0 -1px 0 rgba(0,0,0,0.3) inset',
        transition: 'all 0.32s cubic-bezier(0.4,0,0.2,1)',
        zIndex: 100,
      }}>

        {/* ── Content Padding ── */}
        <div style={{ padding: '16px 16px 0 16px', position: 'relative' }}>

          {/* Top-right corner buttons */}
          <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={() => setNegativeActive(false)}
              title="Collapse"
              style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', transition: 'background 0.18s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >
              <span style={{ fontSize: 14 }}>←</span>
            </button>
            <button
              title="Enhance text"
              style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', transition: 'background 0.18s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >
              <Type className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* + Upload button / uploaded image preview */}
          <input ref={imgInputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleImageUpload} />
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
            {uploadedImage ? (
              <div
                style={{ position:'relative', width:40, height:40, borderRadius:8, overflow:'visible', flexShrink:0 }}
                onMouseEnter={e => { const btn = e.currentTarget.querySelector('.img-x-btn'); if (btn) btn.style.opacity='1'; }}
                onMouseLeave={e => { const btn = e.currentTarget.querySelector('.img-x-btn'); if (btn) btn.style.opacity='0'; }}
              >
                <img src={uploadedImage} alt="reference" style={{ width:40, height:40, objectFit:'cover', borderRadius:8, display:'block', border:'1px solid rgba(255,255,255,0.15)' }} />
                <button
                  className="img-x-btn"
                  onClick={() => setUploadedImage(null)}
                  style={{ position:'absolute', top:-6, right:-6, width:18, height:18, borderRadius:'50%', background:'rgba(30,30,30,0.85)', border:'1.5px solid rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#fff', fontSize:10, zIndex:10, opacity:0, transition:'opacity 0.18s, background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(180,0,0,0.9)'}
                  onMouseLeave={e => e.currentTarget.style.background='rgba(30,30,30,0.85)'}
                >✕</button>
              </div>
            ) : (
              <button
                onClick={() => imgInputRef.current && imgInputRef.current.click()}
                style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', transition: 'background 0.18s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.13)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                title="Upload reference image"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Main prompt textarea */}
          <div style={{ position: 'relative', paddingRight: 44 }}>
            <textarea
              value={prompt}
              onChange={e => onPromptChange && onPromptChange(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Describe the image you want to create"
              rows={2}
              className="img-prompt-textarea"
              style={{
                width: '100%', background: 'transparent', border: 'none', outline: 'none',
                color: '#fff', fontSize: 15, fontFamily: '"DM Sans", sans-serif',
                resize: 'none', lineHeight: 1.6, caretColor: 'white',
              }}
            />
            <Pencil className="w-3 h-3" style={{ position: 'absolute', bottom: 4, right: 2, color: 'rgba(255,255,255,0.28)' }} />
          </div>

          {/* ── Negative Prompt Zone ── */}
          {negativeActive && (
            <>
              <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.07)', margin: '10px 0 0 0' }} />
              <div style={{ padding: '12px 0 6px 0' }}>
                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Negative Prompt</p>
                <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 13, marginBottom: 10 }}>
                  List what to exclude from your image (e.g. if you don't want blur, type "blur")
                </p>
                <div style={{ position: 'relative', paddingRight: 20 }}>
                  <textarea
                    ref={negRef}
                    value={negativePrompt}
                    onChange={e => setNegativePrompt(e.target.value)}
                    placeholder="blurry, low quality, watermark, distorted face, extra fingers, bad anatomy..."
                    rows={2}
                    className="img-neg-textarea"
                    style={{
                      width: '100%', background: 'transparent', border: 'none', outline: 'none',
                      color: '#fff', fontSize: 15, fontFamily: '"DM Sans", sans-serif',
                      resize: 'none', lineHeight: 1.6, caretColor: 'white',
                    }}
                  />
                  <Pencil className="w-3 h-3" style={{ position: 'absolute', bottom: 4, right: 2, color: 'rgba(255,255,255,0.28)' }} />
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Chips Row ── */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '10px 14px 14px 14px',
          display: 'flex', alignItems: 'center', gap: 8,
          overflowX: 'auto',
        }}
          className="hide-scrollbar"
        >
          {/* Model chip */}
          <button
            onClick={() => { closeAll(); setShowModelModal(v => !v); }}
            style={{
              ...chipBase,
              background: showModelModal ? 'rgba(255,255,255,0.12)' : chipBase.background,
              border: showModelModal ? '1px solid rgba(255,255,255,0.22)' : chipBase.border,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = showModelModal ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = showModelModal ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.11)'; }}
          >
            <BrandDot brand={model.brand} />
            <span>{model.name}</span>
            <ChevronDown className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.4)' }} />
          </button>

          {/* Aspect Ratio */}
          <button
            onClick={() => { closeAll(); setShowAspectDrop(v => !v); }}
            style={{ ...chipBase, background: showAspectDrop ? 'rgba(255,255,255,0.12)' : chipBase.background }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = showAspectDrop ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)'}
          >
            {(() => { const r = ASPECT_RATIOS.find(a => a.value === aspectRatio); return r ? <AspectIcon w={r.w} h={r.h} active={true} /> : null; })()}
            <span>{aspectRatio}</span>
          </button>

          {/* Quality */}
          <button
            onClick={() => { closeAll(); setShowQualityDrop(v => !v); }}
            style={{ ...chipBase, background: showQualityDrop ? 'rgba(255,255,255,0.12)' : chipBase.background }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = showQualityDrop ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)'}
          >
            <span style={{ color: '#E01E1E', fontSize: 14 }}>♡</span>
            <span>{quality}</span>
          </button>

          {/* Image Count stepper */}
          <div style={{ ...chipBase, padding: '0 8px', gap: 4, cursor: 'default' }}>
            <button
              onClick={() => onCountChange && onCountChange(Math.max(1, imageCount - 1))}
              style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <Minus className="w-3 h-3" />
            </button>
            <span style={{ width: 28, textAlign: 'center', fontSize: 13 }}>{imageCount}/4</span>
            <button
              onClick={() => onCountChange && onCountChange(Math.min(4, imageCount + 1))}
              style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Negative Prompt chip */}
          <button
            onClick={() => setNegativeActive(v => !v)}
            style={{
              ...chipBase,
              background: negativeActive ? 'rgba(255,255,255,0.13)' : chipBase.background,
              border: negativeActive ? '1px solid rgba(255,255,255,0.28)' : chipBase.border,
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = negativeActive ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.07)'}
          >
            Negative Prompt{negativeActive ? ' ●' : ''}
          </button>

          {/* Style chip */}
          <button
            onClick={() => { const next = !showStylePop; closeAll(); setShowStylePop(next); }}
            style={{
              ...chipBase,
              background: showStylePop || style ? 'rgba(255,255,255,0.12)' : chipBase.background,
              border: showStylePop || style ? '1px solid rgba(255,255,255,0.22)' : chipBase.border,
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = showStylePop || style ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)'}
          >
            <span style={{ fontSize: 14 }}>⊕</span>
            <span>{style || 'Style'}</span>
          </button>

          {/* Generate button — styled like video */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            style={{
              height: 42, padding: '0 20px',
              background: isGenerating ? 'rgba(139,0,0,0.5)' : 'linear-gradient(90deg, #CC0000 0%, #FF2222 50%, #E01E1E 100%)',
              border: 'none', borderRadius: 14, color: '#fff', fontSize: 14, fontWeight: 700,
              fontFamily: '"DM Sans", sans-serif',
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              flexShrink: 0,
              boxShadow: isGenerating ? 'none' : '0 2px 20px rgba(224,30,30,0.35)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { if (!isGenerating) { e.currentTarget.style.background = 'linear-gradient(90deg, #DD0000 0%, #FF3333 50%, #FF2020 100%)'; e.currentTarget.style.boxShadow = '0 4px 28px rgba(224,30,30,0.55)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}}
            onMouseLeave={e => { if (!isGenerating) { e.currentTarget.style.background = 'linear-gradient(90deg, #CC0000 0%, #FF2222 50%, #E01E1E 100%)'; e.currentTarget.style.boxShadow = '0 2px 20px rgba(224,30,30,0.35)'; e.currentTarget.style.transform = 'none'; }}}
          >
            {isGenerating ? 'Generating...' : (
              <>
                <span>Generate</span>
                <Sparkles className="w-4 h-4" style={{ opacity: 0.9 }} />
                <span style={{ fontSize: 13, fontWeight: 700, opacity: 0.9 }}>1.5</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}