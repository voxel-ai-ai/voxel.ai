import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, ChevronDown, Minus, Plus, Sparkles, Zap, RotateCcw, Video } from 'lucide-react';

const DEFAULT_MODEL = { id: 'kling-2-6', name: 'Kling 2.6', brand: 'Kling', color: '#1B7FE4' };

const CAMERA_MOTIONS = [
  { id: 'zoom-in',   icon: '🔍+', label: 'Zoom In'   },
  { id: 'zoom-out',  icon: '🔍-', label: 'Zoom Out'  },
  { id: 'pan-left',  icon: '←',   label: 'Pan Left'  },
  { id: 'pan-right', icon: '→',   label: 'Pan Right' },
  { id: 'tilt-up',   icon: '↑',   label: 'Tilt Up'   },
  { id: 'tilt-down', icon: '↓',   label: 'Tilt Down' },
  { id: 'orbit',     icon: '🔄',  label: 'Orbit'     },
  { id: 'handheld',  icon: '📷',  label: 'Handheld'  },
  { id: 'static',    icon: '⊙',   label: 'Static'    },
];

const OUTPUT_OPTIONS = ['5s | 720p', '5s | 1080p', '10s | 1080p', '10s | 4K'];

const S = {
  font: '"DM Sans", sans-serif',
};

export default function VideoLeftPanel({ prompt, onPromptChange, onGenerate, isGenerating, count, onCountChange, model, onModelClick }) {
  const [mode, setMode] = useState('frame');
  const [cameraMotion, setCameraMotion] = useState(null);
  const [showCameraDrop, setShowCameraDrop] = useState(false);
  const [audioOn, setAudioOn] = useState(false);
  const [output, setOutput] = useState('5s | 1080p');
  const [showOutputDrop, setShowOutputDrop] = useState(false);
  const [startFrame, setStartFrame] = useState(null);
  const [endFrame, setEndFrame] = useState(null);

  const handleFrameUpload = (type, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === 'start') setStartFrame(url);
    else setEndFrame(url);
  };

  const handleCameraSelect = (m) => {
    const next = cameraMotion === m.id ? null : m.id;
    setCameraMotion(next);
    const stripped = (prompt || '').replace(/\nCamera: [^\n]+/g, '').replace(/^Camera: [^\n]+\n?/g, '').trim();
    onPromptChange && onPromptChange(next ? (stripped ? `${stripped}\nCamera: ${m.label}` : `Camera: ${m.label}`) : stripped);
    setShowCameraDrop(false);
  };

  const selectedMotion = CAMERA_MOTIONS.find(m => m.id === cameraMotion);

  return (
    <div style={{
      width: 450, minWidth: 450, maxWidth: 450,
      height: 'calc(100vh - 60px)',
      background: '#0A0A0A',
      borderRight: '1px solid #1A1A1A',
      overflowY: 'auto',
      position: 'fixed',
      left: 0, top: 60,
      display: 'flex', flexDirection: 'column',
      paddingBottom: 80,
      scrollbarWidth: 'none',
    }}>
      <style>{`
        .vl-ta::placeholder { color: rgba(255,255,255,0.2); font-size: 12px; font-family: "DM Sans",sans-serif; }
        .vl-ta:focus { border-color: rgba(224,30,30,0.4) !important; outline: none; }
        .vl-cam-opt:hover { background: #222 !important; border-color: rgba(224,30,30,0.3) !important; color: #fff !important; }
        .vl-output-opt:hover { background: rgba(255,255,255,0.05); }
      `}</style>

      {/* ① Header */}
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'18px 18px 14px' }}>
        <button style={{ width:30, height:30, background:'transparent', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.5)', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span style={{ color:'#fff', fontSize:16, fontWeight:600, fontFamily:S.font }}>Frame to Video</span>
      </div>

      {/* ② Mode tabs */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, padding:'0 16px' }}>
        {[{ id:'frame', icon:'🎞', label:'Start/End Frame' }, { id:'text', icon:'📝', label:'Text' }].map(tab => (
          <button key={tab.id} onClick={() => setMode(tab.id)} style={{
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            gap:8, padding:'14px 10px', borderRadius:12, cursor:'pointer', border:'none',
            background: mode===tab.id ? 'linear-gradient(135deg, #7A0000 0%, #C01010 40%, #E01E1E 100%)' : '#161616',
            borderWidth:1, borderStyle:'solid',
            borderColor: mode===tab.id ? 'rgba(224,30,30,0.6)' : '#262626',
            color: mode===tab.id ? '#fff' : 'rgba(255,255,255,0.5)',
            fontFamily:S.font, fontSize:14, transition:'all 0.2s',
            boxShadow: mode===tab.id ? 'inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 12px rgba(224,30,30,0.3)' : 'none',
          }}>
            <span style={{ fontSize:22 }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ③ Model row */}
      <div style={{ padding:'14px 16px 0' }}>
        <button onClick={onModelClick} style={{
          width:'100%', display:'flex', alignItems:'center', gap:12,
          padding:'13px 16px', background:'#161616', border:'1px solid #252525',
          borderRadius:12, cursor:'pointer', transition:'all 0.18s', textAlign:'left',
        }}
          onMouseEnter={e => { e.currentTarget.style.background='#1C1C1C'; e.currentTarget.style.borderColor='#333333'; }}
          onMouseLeave={e => { e.currentTarget.style.background='#161616'; e.currentTarget.style.borderColor='#252525'; }}
        >
          <div style={{ width:34, height:34, borderRadius:'50%', background: model?.color || '#1B7FE4', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#fff', flexShrink:0 }}>
            {(model?.brand || 'K').charAt(0)}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.45)', fontFamily:S.font }}>Model</div>
            <div style={{ fontSize:14, fontWeight:600, color:'#fff', fontFamily:S.font }}>{model?.name || 'Kling 2.6'}</div>
          </div>
          <ChevronRight className="w-4 h-4" style={{ color:'rgba(255,255,255,0.3)' }} />
        </button>
      </div>

      {/* ④ Start & End Frame */}
      {mode === 'frame' && (
        <div style={{ padding:'14px 16px 0' }}>
          <div style={{ fontSize:13, fontWeight:600, color:'#fff', fontFamily:S.font, marginBottom:10 }}>Set start &amp; end frame</div>
          {/* Outer container */}
          <div style={{ background:'#141414', border:'1px solid #252525', borderRadius:12, padding:12, display:'flex', alignItems:'center', gap:10 }}>
            {['start', 'end'].map((type, i) => {
              const frameUrl = i === 0 ? startFrame : endFrame;
              return (
                <React.Fragment key={type}>
                  {i === 1 && (
                    <button style={{ width:32, height:32, flexShrink:0, background:'#1E1E1E', border:'1px solid #2A2A2A', borderRadius:8, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.45)', fontSize:15, transition:'all 0.15s' }}
                      onClick={() => { const tmp = startFrame; setStartFrame(endFrame); setEndFrame(tmp); }}
                      onMouseEnter={e => { e.currentTarget.style.background='#2A2A2A'; e.currentTarget.style.color='#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background='#1E1E1E'; e.currentTarget.style.color='rgba(255,255,255,0.45)'; }}
                    >⇄</button>
                  )}
                  <div style={{ flex:1, minHeight:120, position:'relative' }}>
                    <label style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, cursor:'pointer', padding:'16px 10px', transition:'all 0.2s', opacity: i===1 && !frameUrl ? 0.55 : 1, position:'relative', overflow:'hidden', height:'100%', minHeight:120, background:'#0F0F0F', border:'1.5px solid #303030', borderRadius:10 }}
                      onMouseEnter={e => { if (!frameUrl) { e.currentTarget.style.borderColor='rgba(224,30,30,0.5)'; e.currentTarget.style.background='rgba(224,30,30,0.05)'; e.currentTarget.style.opacity='1'; }}}
                      onMouseLeave={e => { if (!frameUrl) { e.currentTarget.style.borderColor='#303030'; e.currentTarget.style.background='#0F0F0F'; e.currentTarget.style.opacity= i===1 ? '0.55' : '1'; }}}
                    >
                      <input type="file" accept="image/*" style={{ display:'none' }} onChange={e => handleFrameUpload(type, e)} />
                      {frameUrl ? (
                        <img src={frameUrl} alt={`${type} frame`} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', borderRadius:10 }} />
                      ) : (
                        <>
                          <div style={{ width:32, height:32, borderRadius:'50%', background:'#E01E1E', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:18, fontWeight:700 }}>+</div>
                          <span style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontFamily:S.font, textAlign:'center', lineHeight:1.4 }}>Add a {type}<br/>frame</span>
                        </>
                      )}
                    </label>
                    {frameUrl && (
                      <button
                        onClick={e => { e.stopPropagation(); if (type === 'start') setStartFrame(null); else setEndFrame(null); }}
                        style={{ position:'absolute', top:6, right:6, width:22, height:22, borderRadius:'50%', background:'rgba(0,0,0,0.6)', border:'1px solid rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#fff', fontSize:12, zIndex:10, transition:'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background='rgba(200,0,0,0.8)'}
                        onMouseLeave={e => e.currentTarget.style.background='rgba(0,0,0,0.6)'}
                      >✕</button>
                    )}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* ⑤ Describe textarea */}
      <div style={{ padding:'16px 16px 0' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
          <span style={{ fontSize:13, fontWeight:600, color:'#fff', fontFamily:S.font }}>Describe your video</span>
          <button style={{ width:28, height:28, background:'#1E1E1E', border:'1px solid #2A2A2A', borderRadius:7, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.5)', transition:'all 0.18s' }}
            onMouseEnter={e => { e.currentTarget.style.background='#2A2A2A'; e.currentTarget.style.color='#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background='#1E1E1E'; e.currentTarget.style.color='rgba(255,255,255,0.5)'; }}
          ><Zap className="w-3.5 h-3.5" /></button>
        </div>
        <div style={{ position:'relative' }}>
          <textarea
            value={prompt}
            onChange={e => onPromptChange && onPromptChange(e.target.value)}
            placeholder="Describe scene transitions, camera movement trajectories, or character actions with text to precisely control the entire video from beginning to end."
            rows={5}
            className="vl-ta"
            style={{ width:'100%', background:'#111111', border:'1px solid #222222', borderRadius:10, padding:'12px 14px', color:'rgba(255,255,255,0.8)', fontSize:13, lineHeight:1.6, fontFamily:S.font, resize:'none', boxSizing:'border-box', transition:'border-color 0.2s' }}
          />
          <RotateCcw className="w-3 h-3" style={{ position:'absolute', bottom:10, left:12, color:'rgba(255,255,255,0.3)', pointerEvents:'none' }} />
        </div>
      </div>

      {/* ⑥ Camera Motion button + dropdown */}
      <div style={{ padding:'14px 16px 0', position:'relative' }}>
        <button
          onClick={() => setShowCameraDrop(v => !v)}
          style={{
            width:'100%', padding:'12px 16px', background:'#161616', border:'1px solid #2A2A2A',
            borderRadius:10, display:'flex', alignItems:'center', justifyContent:'space-between',
            cursor:'pointer', color: selectedMotion ? '#FF4444' : 'rgba(255,255,255,0.7)',
            fontSize:13, fontFamily:S.font, transition:'all 0.18s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background='#1E1E1E'; }}
          onMouseLeave={e => { e.currentTarget.style.background='#161616'; }}
        >
          <span style={{ display:'flex', alignItems:'center', gap:8 }}>
            <Video className="w-4 h-4" />
            {selectedMotion ? `Camera Motion: ${selectedMotion.label}` : 'Camera Motion'}
          </span>
          <ChevronDown className="w-4 h-4" style={{ transform: showCameraDrop ? 'rotate(180deg)' : 'none', transition:'transform 0.2s', color:'rgba(255,255,255,0.4)' }} />
        </button>

        {showCameraDrop && (
          <div style={{ marginTop:4, background:'#161616', border:'1px solid #2A2A2A', borderRadius:10, padding:10, display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:8 }}>
            {CAMERA_MOTIONS.map(m => {
              const isActive = cameraMotion === m.id;
              return (
                <button key={m.id} onClick={() => handleCameraSelect(m)} className="vl-cam-opt"
                  style={{
                    padding:'10px 8px', background: isActive ? 'rgba(224,30,30,0.1)' : '#1A1A1A',
                    border:`1px solid ${isActive ? '#E01E1E' : '#2A2A2A'}`,
                    borderRadius:8, display:'flex', flexDirection:'column', alignItems:'center',
                    gap:5, cursor:'pointer', fontSize:11, color: isActive ? '#FF4444' : 'rgba(255,255,255,0.6)',
                    fontFamily:S.font, transition:'all 0.15s',
                  }}
                >
                  <span style={{ fontSize:18 }}>{m.icon}</span>
                  {m.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ⑦ Audio + Output */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, padding:'14px 16px 0' }}>
        {/* Audio */}
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', background:'#161616', border:'1px solid #222222', borderRadius:10, cursor:'pointer' }}
          onMouseEnter={e => { e.currentTarget.style.background='#1C1C1C'; e.currentTarget.style.borderColor='#2E2E2E'; }}
          onMouseLeave={e => { e.currentTarget.style.background='#161616'; e.currentTarget.style.borderColor='#222222'; }}
        >
          <span style={{ fontSize:16, color:'rgba(255,255,255,0.5)' }}>🎵</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontFamily:S.font }}>Audio</div>
            <div style={{ fontSize:13, fontWeight:600, color:'#fff', fontFamily:S.font }}>{audioOn ? 'On' : 'Off'}</div>
          </div>
          <div onClick={e => { e.stopPropagation(); setAudioOn(v => !v); }}
            style={{ width:36, height:20, background: audioOn ? '#E01E1E' : '#333', borderRadius:999, cursor:'pointer', position:'relative', transition:'background 0.2s', flexShrink:0 }}>
            <div style={{ position:'absolute', width:16, height:16, background:'#fff', borderRadius:'50%', top:2, left: audioOn ? 18 : 2, transition:'left 0.2s' }} />
          </div>
        </div>

        {/* Output */}
        <div style={{ position:'relative' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', background:'#161616', border:'1px solid #222222', borderRadius:10, cursor:'pointer' }}
            onClick={() => setShowOutputDrop(v => !v)}
            onMouseEnter={e => { e.currentTarget.style.background='#1C1C1C'; e.currentTarget.style.borderColor='#2E2E2E'; }}
            onMouseLeave={e => { e.currentTarget.style.background='#161616'; e.currentTarget.style.borderColor='#222222'; }}
          >
            <span style={{ fontSize:16, color:'rgba(255,255,255,0.5)' }}>⚙</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontFamily:S.font }}>Output</div>
              <div style={{ fontSize:13, fontWeight:600, color:'#fff', fontFamily:S.font }}>{output}</div>
            </div>
            <ChevronRight className="w-3.5 h-3.5" style={{ color:'rgba(255,255,255,0.3)' }} />
          </div>
          {showOutputDrop && (
            <div style={{ position:'absolute', bottom:'calc(100% + 4px)', left:0, right:0, background:'#161616', border:'1px solid #2A2A2A', borderRadius:10, overflow:'hidden', zIndex:20 }}>
              {OUTPUT_OPTIONS.map(opt => (
                <div key={opt} className="vl-output-opt" onClick={() => { setOutput(opt); setShowOutputDrop(false); }}
                  style={{ padding:'10px 14px', fontSize:13, fontFamily:S.font, color: output===opt ? '#fff':'rgba(255,255,255,0.6)', background: output===opt ? 'rgba(224,30,30,0.08)':'transparent', cursor:'pointer', transition:'background 0.15s' }}>
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ⑧ Count + Generate (sticky bottom) */}
      <div style={{ position:'sticky', bottom:0, display:'flex', alignItems:'center', gap:10, padding:'14px 16px', background:'linear-gradient(to top, #0A0A0A 70%, transparent)', marginTop:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <button onClick={() => onCountChange && onCountChange(Math.max(1, count - 1))}
            style={{ width:28, height:28, background:'#1A1A1A', border:'1px solid #2A2A2A', borderRadius:7, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', transition:'all 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background='#2A2A2A'}
            onMouseLeave={e => e.currentTarget.style.background='#1A1A1A'}
          ><Minus className="w-3 h-3" /></button>
          <span style={{ fontSize:14, fontWeight:600, color:'#fff', fontFamily:S.font, minWidth:36, textAlign:'center' }}>
            {count}<span style={{ color:'rgba(255,255,255,0.35)' }}>/4</span>
          </span>
          <button onClick={() => onCountChange && onCountChange(Math.min(4, count + 1))}
            style={{ width:28, height:28, background:'#1A1A1A', border:'1px solid #2A2A2A', borderRadius:7, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', transition:'all 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background='#2A2A2A'}
            onMouseLeave={e => e.currentTarget.style.background='#1A1A1A'}
          ><Plus className="w-3 h-3" /></button>
        </div>
        <button onClick={() => onGenerate && onGenerate()} disabled={isGenerating}
          style={{
            flex:1, height:48,
            background: isGenerating ? 'rgba(139,0,0,0.5)' : 'linear-gradient(90deg, #CC0000 0%, #FF2222 50%, #E01E1E 100%)',
            border:'none', borderRadius:14, color:'#fff', fontSize:15, fontWeight:700, fontFamily:S.font,
            cursor: isGenerating ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, transition:'all 0.2s',
            boxShadow: isGenerating ? 'none' : '0 2px 20px rgba(224,30,30,0.35)',
          }}
          onMouseEnter={e => { if (!isGenerating) { e.currentTarget.style.background='linear-gradient(90deg, #DD0000 0%, #FF3333 50%, #FF2020 100%)'; e.currentTarget.style.boxShadow='0 4px 28px rgba(224,30,30,0.55)'; e.currentTarget.style.transform='translateY(-1px)'; }}}
          onMouseLeave={e => { if (!isGenerating) { e.currentTarget.style.background='linear-gradient(90deg, #CC0000 0%, #FF2222 50%, #E01E1E 100%)'; e.currentTarget.style.boxShadow='0 2px 20px rgba(224,30,30,0.35)'; e.currentTarget.style.transform='none'; }}}
        >
          {isGenerating ? 'Generating...' : <><span>Generate</span><Sparkles className="w-4 h-4" style={{ opacity:0.9 }} /><span style={{ fontSize:14, fontWeight:700, opacity:0.9 }}>100</span></>}
        </button>
      </div>
    </div>
  );
}