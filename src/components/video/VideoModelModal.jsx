import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

const VIDEO_MODELS = [
  { id: 'kling-3-omni', name: 'Kling 3.0 Omni', brand: 'Kling', color: '#1B7FE4', desc: 'Enhanced multimodal references', tags: ['Reference', 'Multi-shots', 'Audio', '720-1080p', '3-15s'], badge: 'NEW', featured: true, featuredImg: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80&fit=crop', featuredDesc: 'Enhanced multimodal references' },
  { id: 'kling-3', name: 'Kling 3.0', brand: 'Kling', color: '#1B7FE4', desc: 'Enhanced audio, consistency & multi-shots', tags: ['Start/End', 'Multi-shots', 'Audio', '720-1080p', '3-15s'], badge: 'NEW', featured: true, featuredImg: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80&fit=crop', featuredDesc: 'Enhanced audio, consistency & multi-shots' },
  { id: 'seedance-1-5', name: 'Seedance 1.5 Pro', brand: 'Seedance', color: '#F97316', desc: 'Cinematic videos with audio & multi-shots', tags: ['Start/End', 'Multi-shots', 'Audio', '480-1080p', '4-12s'], featured: true, featuredImg: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80&fit=crop', featuredDesc: 'Cinematic videos with audio & multi-shots' },
  { id: 'kling-2-6', name: 'Kling 2.6', brand: 'Kling', color: '#1B7FE4', desc: 'Cinematic videos with audio & voice', tags: ['Start/End', 'Audio', '720-1080p', '5-10s'] },
  { id: 'wan-2-6', name: 'Wan 2.6', brand: 'Wan', color: '#8B5CF6', desc: 'Cinematic videos with audio & multi-shots', tags: ['Start Frame', 'Multi-shots', 'Audio', '720-1080p', '5-15s'] },
  { id: 'veo-3-1', name: 'Veo 3.1', brand: 'Google', color: '#10A37F', desc: 'High fidelity videos with audio & 4K', tags: ['Reference', 'Start/End', 'Audio', '4K', '4-8s'] },
  { id: 'sora-2', name: 'Sora 2', brand: 'Sora', color: '#333', desc: 'Story-telling videos with audio', tags: ['Start Frame', 'Audio', '720-1080p', '4-12s'] },
  { id: 'grok-imagine', name: 'Grok Imagine', brand: 'Grok', color: '#F97316', desc: 'Fast generation of cinematic videos', tags: ['Start Frame', 'Audio', '480-720p', '1-15s'], badge: 'NEW' },
  { id: 'kling-2-5', name: 'Kling 2.5', brand: 'Kling', color: '#1B7FE4', desc: 'Great creativity with exceptional value', tags: ['Start/End', '720-1080p', '5-10s'] },
  { id: 'kling-o1', name: 'Kling O1', brand: 'Kling', color: '#1B7FE4', desc: 'Enhanced multimodal references', tags: ['Reference', 'Start/End', '3-10s'] },
  { id: 'hailuo-2-3', name: 'Hailuo 2.3', brand: 'Hailuo', color: '#7C3AED', desc: 'Great for cinematic & acting scenes', tags: ['Start Frame', '768-1080p', '6-10s'] },
  { id: 'kling-2-1', name: 'Kling 2.1', brand: 'Kling', color: '#1B7FE4', desc: 'Natural motion & great prompt adherence', tags: ['Start/End', '720-1080p', '5-10s'] },
  { id: 'seedance-1', name: 'Seedance 1', brand: 'Seedance', color: '#F97316', desc: 'Narrative videos with multi-shots', tags: ['Start/End', 'Multi-shots', '480-1080p', '5-10s'] },
  { id: 'ltx-2', name: 'LTX 2', brand: 'LTX', color: '#1B7FE4', desc: 'Fast cinematic 4K videos up to 20s', tags: ['Start Frame', 'Audio', '4K', '6-10s'] },
  { id: 'ltx-2-audio', name: 'LTX 2 Audio-to-Video', brand: 'LTX', color: '#1B7FE4', desc: 'Generate video from audio (2-20s)', tags: ['Start Frame', 'Audio', '2-20s'] },
  { id: 'vidu-q3', name: 'Vidu Q3', brand: 'Vidu', color: '#92400E', desc: 'Great for storyboards and adding references', tags: ['Start Frame', 'Audio', '540-1080p', '1-16s'] },
  { id: 'pixverse-5', name: 'PixVerse 5', brand: 'PixVerse', color: '#7C3AED', desc: 'Great for short videos', tags: ['Start/End', 'Multi-shots', 'Audio', '360-1080p', '5-10s'] },
  { id: 'wan-2-2', name: 'Wan 2.2', brand: 'Wan', color: '#8B5CF6', desc: 'Consistent aesthetic', tags: ['Start Frame', '480-720p', '5-10s'] },
  { id: 'vidu-q2', name: 'Vidu Q2', brand: 'Vidu', color: '#92400E', desc: 'Great for anime scenes and storyboards', tags: ['Reference', 'Start/End', '720-1080p', '5-8s'] },
];

const brandColors = {
  Kling: '#1B7FE4', Seedance: '#F97316', Google: '#10A37F',
  Wan: '#8B5CF6', Sora: '#555', Grok: '#F97316',
  Hailuo: '#7C3AED', LTX: '#1B7FE4', Vidu: '#92400E', PixVerse: '#7C3AED',
};

function BrandDot({ brand, color }) {
  return (
    <div style={{
      width: 38, height: 38, borderRadius: '50%',
      background: color || brandColors[brand] || '#555',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0,
    }}>
      {brand.charAt(0)}
    </div>
  );
}

export default function VideoModelModal({ selectedId, onSelect, onClose }) {
  const [search, setSearch] = useState('');

  const featured = VIDEO_MODELS.filter(m => m.featured);
  const filtered = VIDEO_MODELS.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{
      position: 'absolute', top: 0, right: 0,
      width: 'calc(100% - 450px)',
      height: '100%',
      background: 'rgba(10,10,10,0.98)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      zIndex: 100,
      display: 'flex', flexDirection: 'column',
      overflowY: 'auto',
      animation: 'slideInRight 0.25s ease',
    }}>
      <style>{`
        @keyframes slideInRight {
          from { opacity:0; transform: translateX(20px); }
          to   { opacity:1; transform: translateX(0); }
        }
      `}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 24px 16px 24px', borderBottom:'1px solid #1E1E1E', position:'sticky', top:0, background:'rgba(10,10,10,0.98)', zIndex:10 }}>
        <span style={{ fontSize:18, fontWeight:700, color:'#fff', fontFamily:'"DM Sans",sans-serif' }}>Model</span>
        <button onClick={onClose} style={{ width:30, height:30, background:'#1E1E1E', border:'none', borderRadius:8, color:'rgba(255,255,255,0.6)', fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Featured row */}
      <div style={{ padding:'16px 24px', display:'flex', gap:12, overflowX:'auto' }} className="hide-scrollbar">
        {featured.map(m => (
          <div key={m.id} onClick={() => { onSelect(m); onClose(); }}
            style={{ minWidth:300, height:130, borderRadius:14, overflow:'hidden', position:'relative', cursor:'pointer', flexShrink:0, border: selectedId===m.id ? '2px solid #E01E1E' : '2px solid transparent' }}>
            <img src={m.featuredImg} alt={m.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(to top, rgba(0,0,0,0.88), transparent)', padding:'12px 14px' }}>
              <div style={{ fontSize:16, fontWeight:700, color:'#fff', fontFamily:'"DM Sans",sans-serif', display:'flex', alignItems:'center', gap:8 }}>
                {m.name}
                {m.badge && <span style={{ padding:'1px 6px', borderRadius:5, background:'rgba(224,30,30,0.2)', border:'1px solid rgba(224,30,30,0.4)', color:'#FF5555', fontSize:10, fontWeight:700 }}>{m.badge}</span>}
              </div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.6)', fontFamily:'"DM Sans",sans-serif', marginTop:2 }}>{m.featuredDesc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 24px', borderBottom:'1px solid #1E1E1E', flexWrap:'wrap' }}>
        <span style={{ padding:'6px 16px', borderRadius:999, background:'#fff', color:'#000', fontWeight:600, fontSize:13, fontFamily:'"DM Sans",sans-serif' }}>All models</span>
        {['All providers', 'All features'].map(f => (
          <span key={f} style={{ padding:'6px 14px', borderRadius:999, border:'1px solid #2A2A2A', color:'rgba(255,255,255,0.6)', fontSize:13, fontFamily:'"DM Sans",sans-serif', cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
            {f} <span style={{ fontSize:10 }}>▾</span>
          </span>
        ))}
        <div style={{ flex:1, minWidth:140, background:'#161616', border:'1px solid #2A2A2A', borderRadius:8, padding:'6px 12px', display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ color:'rgba(255,255,255,0.3)', fontSize:14 }}>⌕</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search models..."
            style={{ background:'transparent', border:'none', outline:'none', color:'#fff', fontSize:13, fontFamily:'"DM Sans",sans-serif', width:'100%' }} />
        </div>
      </div>

      {/* Model list */}
      <div style={{ padding:'8px 24px 32px 24px' }}>
        {filtered.map(m => {
          const isSel = selectedId === m.id;
          return (
            <div key={m.id} onClick={() => { onSelect(m); onClose(); }}
              style={{
                display:'flex', alignItems:'center', gap:14, padding:'12px 14px',
                borderRadius:12, cursor:'pointer', transition:'all 0.18s',
                marginBottom:4,
                background: isSel ? 'rgba(224,30,30,0.06)' : 'transparent',
                border: isSel ? '1px solid #2A2A2A' : '1px solid transparent',
                borderLeft: isSel ? '3px solid #E01E1E' : '3px solid transparent',
              }}
              onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = 'transparent'; }}
            >
              <BrandDot brand={m.brand} color={m.color} />
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:14, fontWeight:600, color:'#fff', fontFamily:'"DM Sans",sans-serif' }}>
                  {m.name}
                  {m.badge && <span style={{ padding:'2px 6px', borderRadius:5, background:'rgba(224,30,30,0.15)', border:'1px solid rgba(224,30,30,0.35)', color:'#FF5555', fontSize:10, fontWeight:700 }}>{m.badge}</span>}
                </div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontFamily:'"DM Sans",sans-serif', marginTop:2 }}>{m.desc}</div>
              </div>
              <div style={{ display:'flex', gap:5, flexWrap:'wrap', justifyContent:'flex-end', maxWidth:260 }}>
                {m.tags.map(tag => (
                  <span key={tag} style={{ padding:'3px 8px', borderRadius:6, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.09)', fontSize:11, color:'rgba(255,255,255,0.5)', whiteSpace:'nowrap' }}>{tag}</span>
                ))}
              </div>
              {isSel && <Check className="w-4 h-4 flex-shrink-0" style={{ color:'#E01E1E' }} />}
            </div>
          );
        })}
        <p style={{ textAlign:'center', color:'rgba(255,255,255,0.25)', fontSize:13, fontFamily:'"DM Sans",sans-serif', marginTop:16 }}>More models are coming soon...</p>
      </div>
    </div>
  );
}