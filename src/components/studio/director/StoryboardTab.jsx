import React, { useState } from 'react';
import { Zap, Video, RefreshCw, Edit2, CheckCircle, Trash2, Plus, Film } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const CAMERA_ANGLES = ['Wide', 'Medium', 'Close-Up', 'Extreme Close-Up', "Bird's Eye", 'Low Angle', 'Dutch Angle'];
const LIGHTING = ['Natural', 'Cinematic', 'Golden Hour', 'Night', 'Studio', 'Dramatic', 'Neon'];
const CAMERA_MOTIONS = ['Static', 'Pan Left', 'Pan Right', 'Zoom In', 'Zoom Out', 'Dolly', 'Handheld'];

const Pill = ({ label, active, onClick }) => (
  <button onClick={onClick} style={{
    padding: '5px 13px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
    background: active ? 'rgba(229,57,53,0.18)' : 'rgba(255,255,255,0.05)',
    border: `1px solid ${active ? 'rgba(229,57,53,0.55)' : 'rgba(255,255,255,0.08)'}`,
    color: active ? '#E53935' : 'rgba(255,255,255,0.65)',
    transition: 'all 0.15s', fontFamily: '"DM Sans", sans-serif', whiteSpace: 'nowrap',
    fontWeight: active ? 600 : 400,
  }}>{label}</button>
);

const SectionLabel = ({ children }) => (
  <div style={{
    color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 700,
    letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8,
  }}>{children}</div>
);

export default function StoryboardTab({ characters, locations, storyboardFrames, onFramesChange, onAnimateFrame }) {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [sceneAction, setSceneAction] = useState('');
  const [cameraAngle, setCameraAngle] = useState('Wide');
  const [lighting, setLighting] = useState('Cinematic');
  const [motion, setMotion] = useState('Static');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputUrl, setOutputUrl] = useState(null);
  const [hoveredFrame, setHoveredFrame] = useState(null);

  const buildPrompt = () => {
    const char = characters?.find(c => c.id === selectedCharacter);
    const loc = locations?.find(l => l.id === selectedLocation);
    return [
      char ? char.description : '',
      loc ? loc.description : '',
      `${cameraAngle} shot`,
      `${lighting} lighting`,
      motion !== 'Static' ? motion : '',
      sceneAction,
      'cinematic, 4K, film quality, professional cinematography, still frame',
    ].filter(Boolean).join(', ');
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(0);
    setOutputUrl(null);
    const interval = setInterval(() => setProgress(p => Math.min(p + 7, 90)), 400);
    const prompt = buildPrompt();
    const result = await base44.integrations.Core.GenerateImage({ prompt });
    clearInterval(interval);
    setProgress(100);
    setOutputUrl(result.url);
    setIsGenerating(false);
  };

  const handleAddToStoryboard = () => {
    if (!outputUrl) return;
    const newFrame = {
      id: Date.now().toString(),
      image_url: outputUrl,
      scene_action: sceneAction,
      camera_angle: cameraAngle,
      lighting,
      motion,
      animated: false,
      video_url: null,
    };
    onFramesChange([...storyboardFrames, newFrame]);
    setOutputUrl(null);
    setSceneAction('');
  };

  const handleDeleteFrame = (id) => {
    onFramesChange(storyboardFrames.filter(f => f.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>

        {/* LEFT COLUMN */}
        <div style={{ width: 200, borderRight: '1px solid rgba(255,255,255,0.06)', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto', flexShrink: 0 }} className="hide-scrollbar">
          <div>
            <SectionLabel>Character</SectionLabel>
            {(!characters || characters.length === 0) ? (
              <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, fontStyle: 'italic', padding: '10px 0' }}>No characters yet</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {characters.map(c => (
                  <button key={c.id} onClick={() => setSelectedCharacter(c.id === selectedCharacter ? null : c.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 8,
                    background: selectedCharacter === c.id ? 'rgba(229,57,53,0.12)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${selectedCharacter === c.id ? 'rgba(229,57,53,0.4)' : 'rgba(255,255,255,0.07)'}`,
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                  }}>
                    {c.image_url
                      ? <img src={c.image_url} alt={c.name} style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
                      : <div style={{ width: 28, height: 28, borderRadius: 6, background: '#2a0000', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>👤</div>
                    }
                    <span style={{ color: selectedCharacter === c.id ? '#fff' : 'rgba(255,255,255,0.6)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <SectionLabel>Location</SectionLabel>
            {(!locations || locations.length === 0) ? (
              <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, fontStyle: 'italic', padding: '10px 0' }}>No locations yet</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {locations.map(l => (
                  <button key={l.id} onClick={() => setSelectedLocation(l.id === selectedLocation ? null : l.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 8,
                    background: selectedLocation === l.id ? 'rgba(229,57,53,0.12)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${selectedLocation === l.id ? 'rgba(229,57,53,0.4)' : 'rgba(255,255,255,0.07)'}`,
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                  }}>
                    {l.image_url
                      ? <img src={l.image_url} alt={l.name} style={{ width: 28, height: 20, borderRadius: 4, objectFit: 'cover', flexShrink: 0 }} />
                      : <div style={{ width: 28, height: 20, borderRadius: 4, background: '#0a1a0a', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>📍</div>
                    }
                    <span style={{ color: selectedLocation === l.id ? '#fff' : 'rgba(255,255,255,0.6)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CENTER COLUMN */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', minHeight: 0 }} className="hide-scrollbar">

            {/* Canvas */}
            <div style={{
              aspectRatio: '16/9', background: '#0d0d0d', borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.07)', position: 'relative', overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {isGenerating && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#1a1a1a', zIndex: 10 }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: '#E53935', boxShadow: '0 0 10px rgba(229,57,53,0.6)', transition: 'width 0.4s ease' }} />
                </div>
              )}
              {isGenerating ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, border: '3px solid rgba(255,255,255,0.08)', borderTopColor: '#E53935', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Generating scene...</div>
                  <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>{Math.floor(progress)}%</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '0 40px', textAlign: 'center' }}>
                  <Video size={40} style={{ color: 'rgba(255,255,255,0.1)' }} />
                  <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 14, lineHeight: 1.5 }}>
                    Select a character and location or write a scene action to generate
                  </div>
                </div>
              )}
            </div>

            {/* Scene action */}
            <textarea value={sceneAction} onChange={e => setSceneAction(e.target.value)}
              placeholder="What happens in this scene? Describe the action, mood, and story beat..."
              rows={3}
              style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 10, color: '#fff', fontSize: 13, padding: '12px 14px',
                outline: 'none', fontFamily: '"DM Sans", sans-serif', resize: 'none', lineHeight: 1.6,
                transition: 'border-color 0.2s', flexShrink: 0,
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(229,57,53,0.45)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'}
            />

            {/* Pills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
              <div>
                <SectionLabel>Camera Angle</SectionLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {CAMERA_ANGLES.map(a => <Pill key={a} label={a} active={cameraAngle === a} onClick={() => setCameraAngle(a)} />)}
                </div>
              </div>
              <div>
                <SectionLabel>Lighting</SectionLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {LIGHTING.map(l => <Pill key={l} label={l} active={lighting === l} onClick={() => setLighting(l)} />)}
                </div>
              </div>
              <div>
                <SectionLabel>Camera Motion</SectionLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {CAMERA_MOTIONS.map(m => <Pill key={m} label={m} active={motion === m} onClick={() => setMotion(m)} />)}
                </div>
              </div>
            </div>

            {/* Generate button */}
            <button onClick={handleGenerate} disabled={isGenerating} style={{
              width: '100%', padding: '14px', background: isGenerating ? 'rgba(229,57,53,0.4)' : '#E53935',
              border: 'none', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: isGenerating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8, fontFamily: '"DM Sans", sans-serif',
              boxShadow: isGenerating ? 'none' : '0 0 24px rgba(229,57,53,0.3)',
              transition: 'all 0.18s', flexShrink: 0,
            }}
              onMouseEnter={e => { if (!isGenerating) e.currentTarget.style.background = '#ff2222'; }}
              onMouseLeave={e => { if (!isGenerating) e.currentTarget.style.background = '#E53935'; }}
            >
              <Zap size={16} />
              {isGenerating ? 'Generating...' : '⚡ Generate Scene →'}
            </button>
          </div>
        </div>

        {/* RIGHT PANEL — OUTPUT */}
        <div style={{ width: 230, borderLeft: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Output</div>
          </div>
          {outputUrl ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 12, gap: 10, overflowY: 'auto' }} className="hide-scrollbar">
              <img src={outputUrl} alt="Generated" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }} />
              <button onClick={handleGenerate} disabled={isGenerating} style={ghostBtn}>
                <RefreshCw size={13} /> Regenerate
              </button>
              <button onClick={() => setOutputUrl(null)} style={ghostBtn}>
                <Edit2 size={13} /> Adjust
              </button>
              <button onClick={handleAddToStoryboard} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                background: '#E53935', border: 'none', borderRadius: 8, color: '#fff',
                fontSize: 13, fontWeight: 700, padding: '10px', cursor: 'pointer',
                fontFamily: '"DM Sans", sans-serif', transition: 'background 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#ff2222'}
                onMouseLeave={e => e.currentTarget.style.background = '#E53935'}
              >
                <CheckCircle size={13} /> Add to Storyboard
              </button>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 20, textAlign: 'center' }}>
              <Video size={32} style={{ color: 'rgba(255,255,255,0.1)' }} />
              <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13, lineHeight: 1.5 }}>Generation output will appear here</div>
            </div>
          )}
        </div>
      </div>

      {/* STORYBOARD STRIP */}
      <div style={{
        height: 130, background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{ height: 32, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Storyboard — {storyboardFrames.length} scene{storyboardFrames.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div style={{ flex: 1, overflowX: 'auto', display: 'flex', alignItems: 'center', padding: '8px 12px', gap: 6 }} className="hide-scrollbar">
          {storyboardFrames.length === 0 ? (
            <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, fontStyle: 'italic', padding: '0 12px' }}>
              No scenes yet. Generate your first scene above ↑
            </div>
          ) : (
            storyboardFrames.map((frame, i) => (
              <React.Fragment key={frame.id}>
                <div
                  onMouseEnter={() => setHoveredFrame(frame.id)}
                  onMouseLeave={() => setHoveredFrame(null)}
                  style={{ position: 'relative', flexShrink: 0, width: 110, height: 82, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', background: '#131313', cursor: 'pointer' }}
                >
                  <img src={frame.image_url} alt={`Scene ${i + 1}`} style={{ width: '100%', height: 58, objectFit: 'cover' }} />
                  <div style={{ padding: '3px 6px' }}>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: 600 }}>Scene {i + 1}</div>
                    <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{frame.camera_angle} · {frame.lighting}</div>
                  </div>
                  {hoveredFrame === frame.id && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <button onClick={() => onAnimateFrame(frame)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#E53935', border: 'none', borderRadius: 6, color: '#fff', fontSize: 11, fontWeight: 700, padding: '5px 8px', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                        <Film size={11} /> Animate
                      </button>
                      <button onClick={() => handleDeleteFrame(frame.id)} style={{ width: 26, height: 26, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,100,100,0.8)' }}>
                        <Trash2 size={11} />
                      </button>
                    </div>
                  )}
                  {frame.animated && (
                    <div style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(76,175,80,0.9)', borderRadius: 4, padding: '1px 5px', fontSize: 9, color: '#fff', fontWeight: 700 }}>✓</div>
                  )}
                </div>
                {/* + between frames */}
                <button onClick={() => {}} style={{ flexShrink: 0, width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.25)' }}>
                  <Plus size={10} />
                </button>
              </React.Fragment>
            ))
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const ghostBtn = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8, color: 'rgba(255,255,255,0.7)', fontSize: 13,
  padding: '9px', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif',
  transition: 'all 0.15s',
};