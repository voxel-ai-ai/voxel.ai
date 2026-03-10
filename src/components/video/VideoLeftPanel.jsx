import React, { useState, useRef } from 'react';
import { ChevronRight, ArrowLeft, Minus, Plus, Sparkles, Zap, RotateCcw } from 'lucide-react';
import VideoModelModal from './VideoModelModal';

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

export default function VideoLeftPanel({ prompt, onPromptChange, onGenerate, isGenerating, count, onCountChange }) {
  const [mode, setMode] = useState('frame'); // 'frame' | 'text'
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [showModelModal, setShowModelModal] = useState(false);
  const [cameraMotion, setCameraMotion] = useState(null);
  const [audioOn, setAudioOn] = useState(false);
  const [output, setOutput] = useState('5s | 1080p');
  const [showOutputDrop, setShowOutputDrop] = useState(false);
  const textareaRef = useRef(null);

  const handleCameraMotion = (motion) => {
    setCameraMotion(motion.id === cameraMotion ? null : motion.id);
    if (motion.id !== cameraMotion) {
      const tag = `Camera: ${motion.label}`;
      const current = prompt || '';
      const stripped = current.replace(/Camera: [^\n.]+/g, '').trim();
      onPromptChange && onPromptChange(stripped ? `${stripped}\n${tag}` : tag);
    } else {
      const stripped = (prompt || '').replace(/Camera: [^\n.]+/g, '').trim();
      onPromptChange && onPromptChange(stripped);
    }
  };

  return (
    <div style={{
      width: 450, minWidth: 450, maxWidth: 450,
      height: 'calc(100vh - 60px)',
      overflowY: 'auto',
      background: '#0A0A0A',
      borderRight: '1px solid #1E1E1E',
      display: 'flex', flexDirection: 'column',
      paddingBottom: 100, position: 'relative',
      scrollbarWidth: 'none', msOverflowStyle: 'none',
    }}
      className="hide-scrollbar"
    >
      <style>{`
        .vid-textarea::placeholder { color: rgba(255,255,255,0.22); font-size: 12px; }
        .vid-textarea:focus { border-color: rgba(224,30,30,0.4) !important; }
        .vid-output-drop { position:absolute; bottom:calc(100% + 6px); right:0; background:#161616; border:1px solid #2A2A2A; border-radius:10px; overflow:hidden; z-index:50; min-width:140px; }
        .vid-output-opt { padding:9px 14px; font-size:13px; color:rgba(255,255,255,0.7); font-family:"DM Sans",sans-serif; cursor:pointer; transition:background 0.15s; }
        .vid-output-opt:hover { background:rgba(255,255,255,0.06); }
        .vid-output-opt.active { color:#fff; background:rgba(224,30,30,0.08); }
      `}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'18px 18px 14px 18px', borderBottom:'1px solid #1E1E1E' }}>
        <button style={{ width:30, height:30, background:'transparent', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.6)', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', transition:'background 0.18s' }}
          onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.07)'}
          onMouseLeave={e => e.currentTarget.style.background='transparent'}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span style={{ fontSize:16, fontWeight:600, color:'#fff', fontFamily:'"DM Sans",sans-serif' }}>Frame to Video</span>
      </div>

      {/* Mode tabs */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, padding:'14px 16px 0 16px' }}>
        {[
          { id:'frame', icon:'🎞', label:'Start/End Frame' },
          { id:'text',  icon:'📝', label:'Text' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setMode(tab.id)} style={{
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            gap:8, padding:'14px 10px', borderRadius:12, cursor:'pointer', transition:'all 0.2s',
            fontFamily:'"DM Sans",sans-serif', fontSize:14, border:'none',
            background: mode===tab.id ? 'linear-gradient(135deg, rgba(139,0,0,0.25), rgba(224,30,30,0.18))' : '#161616',
            borderWidth:1, borderStyle:'solid',
            borderColor: mode===tab.id ? 'rgba(224,30,30,0.5)' : '#2A2A2A',
            color: mode===tab.id ? '#fff' : 'rgba(255,255,255,0.65)',
          }}>
            <span style={{ fontSize:22 }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Model Row */}
      <div style={{ margin:'14px 16px 0 16px' }}>
        <button onClick={() => setShowModelModal(v => !v)} style={{
          width:'100%', display:'flex', alignItems:'center', gap:12,
          padding:'14px 16px', background:'#161616', border:'1px solid #2A2A2A',
          borderRadius:12, cursor:'pointer', transition:'all 0.2s', textAlign:'left',
        }}
          onMouseEnter={e => { e.currentTarget.style.background='#1E1E1E'; e.currentTarget.style.borderColor='#383838'; }}
          onMouseLeave={e => { e.currentTarget.style.background='#161616'; e.currentTarget.style.borderColor='#2A2A2A'; }}
        >
          <div style={{ width:34, height:34, borderRadius:'50%', background: model.color || '#1B7FE4', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:'#fff', flexShrink:0 }}>
            {model.brand.charAt(0)}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.45)', fontFamily:'"DM Sans",sans-serif' }}>Model</div>
            <div style={{ fontSize:14, fontWeight:600, color:'#fff', fontFamily:'"DM Sans",sans-serif' }}>{model.name}</div>
          </div>
          <ChevronRight className="w-4 h-4" style={{ color:'rgba(255,255,255,0.3)' }} />
        </button>
      </div>

      {/* Set Start & End Frame */}
      {mode === 'frame' && (
        <div style={{ padding:'16px 16px 0 16px' }}>
          <div style={{ fontSize:13, fontWeight:600, color:'#fff', fontFamily:'"DM Sans",sans-serif', marginBottom:12 }}>Set start &amp; end frame</div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            {['start', 'end'].map((type, i) => (
              <React.Fragment key={type}>
                {i === 1 && (
                  <button style={{ width:32, height:32, flexShrink:0, background:'#1E1E1E', border:'1px solid #2A2A2A', borderRadius:8, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.5)', fontSize:16, transition:'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background='#2A2A2A'; e.currentTarget.style.color='#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background='#1E1E1E'; e.currentTarget.style.color='rgba(255,255,255,0.5)'; }}
                  >
                    ⇄
                  </button>
                )}
                <div style={{ flex:1, aspectRatio:'4/3', background:'#161616', border:'1px dashed #2A2A2A', borderRadius:10, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6, cursor:'pointer', padding:'16px 10px', transition:'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(224,30,30,0.4)'; e.currentTarget.style.background='rgba(224,30,30,0.04)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='#2A2A2A'; e.currentTarget.style.background='#161616'; }}
                >
                  <span style={{ color:'rgba(255,255,255,0.3)', fontSize:22, position:'relative' }}>
                    🖼<span style={{ fontSize:12, color:'rgba(255,255,255,0.4)', position:'absolute', top:-4, right:-6 }}>+</span>
                  </span>
                  <span style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontFamily:'"DM Sans",sans-serif', textAlign:'center' }}>
                    Add a {type}<br/>frame
                  </span>
                  <span style={{ fontSize:11, color:'rgba(224,30,30,0.8)', fontFamily:'"DM Sans",sans-serif', textDecoration:'underline', cursor:'pointer' }}>History</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Describe section */}
      <div style={{ padding:'16px 16px 0 16px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
          <span style={{ fontSize:13, fontWeight:600, color:'#fff', fontFamily:'"DM Sans",sans-serif' }}>Describe your video</span>
          <button style={{ width:28, height:28, background:'#1E1E1E', border:'1px solid #2A2A2A', borderRadius:7, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.5)', transition:'all 0.18s' }}
            onMouseEnter={e => { e.currentTarget.style.background='#2A2A2A'; e.currentTarget.style.color='#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background='#1E1E1E'; e.currentTarget.style.color='rgba(255,255,255,0.5)'; }}
            title="Enhance prompt"
          >
            <Zap className="w-3.5 h-3.5" />
          </button>
        </div>
        <div style={{ position:'relative' }}>
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={e => onPromptChange && onPromptChange(e.target.value)}
            placeholder="Describe scene transitions, camera movement trajectories, or character actions with text to precisely control the entire video from beginning to end."
            rows={5}
            className="vid-textarea"
            style={{
              width:'100%', background:'#111111', border:'1px solid #2A2A2A',
              borderRadius:10, padding:'12px 14px', color:'rgba(255,255,255,0.85)',
              fontSize:13, lineHeight:1.6, fontFamily:'"DM Sans",sans-serif',
              resize:'none', outline:'none', transition:'border-color 0.2s', boxSizing:'border-box',
            }}
          />
          <RotateCcw className="w-3 h-3" style={{ position:'absolute', bottom:10, left:12, color:'rgba(255,255,255,0.25)' }} />
        </div>
      </div>

      {/* Camera Motion */}
      <div style={{ padding:'16px 16px 0 16px' }}>
        <div style={{ fontSize:13, fontWeight:600, color:'#fff', fontFamily:'"DM Sans",sans-serif', marginBottom:10 }}>Camera Motion</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:8 }}>
          {CAMERA_MOTIONS.map(m => {
            const isActive = cameraMotion === m.id;
            return (
              <button key={m.id} onClick={() => handleCameraMotion(m)} style={{
                display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                gap:5, padding:'10px 6px', background: isActive ? 'rgba(224,30,30,0.1)' : '#161616',
                border:`1px solid ${isActive ? 'rgba(224,30,30,0.5)' : '#2A2A2A'}`,
                borderRadius:10, cursor:'pointer', transition:'all 0.18s',
                fontFamily:'"DM Sans",sans-serif', fontSize:11,
                color: isActive ? '#FF4444' : 'rgba(255,255,255,0.6)',
              }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background='#1E1E1E'; e.currentTarget.style.borderColor='rgba(224,30,30,0.35)'; e.currentTarget.style.color='rgba(255,255,255,0.9)'; }}}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background='#161616'; e.currentTarget.style.borderColor='#2A2A2A'; e.currentTarget.style.color='rgba(255,255,255,0.6)'; }}}
              >
                <span style={{ fontSize:18 }}>{m.icon}</span>
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Audio + Output row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, padding:'16px 16px 0 16px' }}>
        {/* Audio */}
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', background:'#161616', border:'1px solid #2A2A2A', borderRadius:10, cursor:'pointer' }}
          onMouseEnter={e => e.currentTarget.style.background='#1E1E1E'}
          onMouseLeave={e => e.currentTarget.style.background='#161616'}
        >
          <span style={{ fontSize:18, color:'rgba(255,255,255,0.5)' }}>🎵</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontFamily:'"DM Sans",sans-serif' }}>Audio</div>
            <div style={{ fontSize:13, fontWeight:600, color:'#fff', fontFamily:'"DM Sans",sans-serif' }}>{audioOn ? 'On' : 'Off'}</div>
          </div>
          <div onClick={e => { e.stopPropagation(); setAudioOn(v => !v); }}
            style={{ width:36, height:20, background: audioOn ? '#E01E1E' : '#333', borderRadius:999, cursor:'pointer', position:'relative', transition:'background 0.2s', flexShrink:0 }}>
            <div style={{ position:'absolute', width:16, height:16, background:'#fff', borderRadius:'50%', top:2, left: audioOn ? 18 : 2, transition:'left 0.2s' }} />
          </div>
        </div>

        {/* Output */}
        <div style={{ position:'relative' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', background:'#161616', border:'1px solid #2A2A2A', borderRadius:10, cursor:'pointer' }}
            onClick={() => setShowOutputDrop(v => !v)}
            onMouseEnter={e => e.currentTarget.style.background='#1E1E1E'}
            onMouseLeave={e => e.currentTarget.style.background='#161616'}
          >
            <span style={{ fontSize:18, color:'rgba(255,255,255,0.5)' }}>⚙</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontFamily:'"DM Sans",sans-serif' }}>Output</div>
              <div style={{ fontSize:13, fontWeight:600, color:'#fff', fontFamily:'"DM Sans",sans-serif' }}>{output}</div>
            </div>
            <ChevronRight className="w-3.5 h-3.5" style={{ color:'rgba(255,255,255,0.3)' }} />
          </div>
          {showOutputDrop && (
            <div className="vid-output-drop">
              {OUTPUT_OPTIONS.map(opt => (
                <div key={opt} className={`vid-output-opt ${output===opt ? 'active':''}`} onClick={() => { setOutput(opt); setShowOutputDrop(false); }}>{opt}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Generate row — sticky bottom */}
      <div style={{
        position:'sticky', bottom:0, display:'flex', alignItems:'center', gap:10,
        padding:'14px 16px', background:'linear-gradient(to top, #0A0A0A 80%, transparent)',
        marginTop:16,
      }}>
        {/* Count stepper */}
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'0 4px' }}>
          <button onClick={() => onCountChange && onCountChange(Math.max(1, count - 1))}
            style={{ width:28, height:28, background:'#1A1A1A', border:'1px solid #2A2A2A', borderRadius:7, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:16, transition:'all 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background='#2A2A2A'}
            onMouseLeave={e => e.currentTarget.style.background='#1A1A1A'}
          >
            <Minus className="w-3 h-3" />
          </button>
          <span style={{ fontSize:14, fontWeight:600, color:'#fff', fontFamily:'"DM Sans",sans-serif', minWidth:32, textAlign:'center' }}>
            {count}<span style={{ color:'rgba(255,255,255,0.35)' }}>/4</span>
          </span>
          <button onClick={() => onCountChange && onCountChange(Math.min(4, count + 1))}
            style={{ width:28, height:28, background:'#1A1A1A', border:'1px solid #2A2A2A', borderRadius:7, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:16, transition:'all 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background='#2A2A2A'}
            onMouseLeave={e => e.currentTarget.style.background='#1A1A1A'}
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Generate button */}
        <button
          onClick={() => onGenerate && onGenerate()}
          disabled={isGenerating}
          style={{
            flex:1, height:46,
            background: isGenerating ? 'rgba(139,0,0,0.5)' : 'linear-gradient(135deg, #8B0000 0%, #E01E1E 100%)',
            border:'none', borderRadius:12, color:'#fff', fontSize:15, fontWeight:600,
            fontFamily:'"DM Sans",sans-serif', cursor: isGenerating ? 'not-allowed' : 'pointer',
            transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
          }}
          onMouseEnter={e => { if (!isGenerating) { e.currentTarget.style.background='linear-gradient(135deg, #9B0000 0%, #FF2222 100%)'; e.currentTarget.style.boxShadow='0 4px 24px rgba(224,30,30,0.45)'; e.currentTarget.style.transform='translateY(-1px)'; }}}
          onMouseLeave={e => { if (!isGenerating) { e.currentTarget.style.background='linear-gradient(135deg, #8B0000 0%, #E01E1E 100%)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; }}}
        >
          {isGenerating ? 'Generating...' : (
            <>Generate <Sparkles className="w-4 h-4" /> <span style={{ fontSize:13, opacity:0.85 }}>100</span></>
          )}
        </button>
      </div>

      {/* Model Modal */}
      {showModelModal && (
        <VideoModelModal
          selectedId={model.id}
          onSelect={m => setModel(m)}
          onClose={() => setShowModelModal(false)}
        />
      )}
    </div>
  );
}