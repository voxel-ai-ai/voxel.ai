import React, { useState } from 'react';
import { Plus, Zap, RefreshCw, Download, ChevronDown } from 'lucide-react';

const CAMERA_ANGLES = ['Wide', 'Medium', 'Close-Up', 'Extreme Close-Up', "Bird's Eye", 'Low Angle', 'Dutch Angle'];
const LIGHTING = ['Natural', 'Cinematic', 'Golden Hour', 'Night', 'Studio', 'Dramatic', 'Neon'];
const MOTION = ['Static', 'Pan Left', 'Pan Right', 'Zoom In', 'Zoom Out', 'Dolly', 'Handheld'];

const Chip = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: '5px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
      background: active ? 'rgba(229,57,53,0.2)' : 'rgba(255,255,255,0.05)',
      border: `1px solid ${active ? 'rgba(229,57,53,0.5)' : 'rgba(255,255,255,0.08)'}`,
      color: active ? '#E53935' : 'rgba(255,255,255,0.6)',
      transition: 'all 0.15s', fontFamily: '"DM Sans", sans-serif', whiteSpace: 'nowrap',
    }}
  >{label}</button>
);

export default function DirectorModule({ characters, locations, activeScene, onGenerateScene, isGenerating, generationProgress }) {
  const [selectedChar, setSelectedChar] = useState(activeScene?.character_id || null);
  const [selectedLoc, setSelectedLoc] = useState(activeScene?.location_id || null);
  const [cameraAngle, setCameraAngle] = useState(activeScene?.camera_angle || 'Wide');
  const [lighting, setLighting] = useState(activeScene?.lighting || 'Cinematic');
  const [motion, setMotion] = useState(activeScene?.motion || 'Static');
  const [sceneAction, setSceneAction] = useState(activeScene?.scene_action || '');
  const [generationHistory, setGenerationHistory] = useState([]);

  const charObj = characters?.find(c => c.id === selectedChar);
  const locObj = locations?.find(l => l.id === selectedLoc);

  const handleGenerate = () => {
    if (!sceneAction.trim()) return;
    onGenerateScene({
      character_id: selectedChar,
      location_id: selectedLoc,
      camera_angle: cameraAngle,
      lighting,
      motion,
      scene_action: sceneAction,
    });
  };

  return (
    <div style={{ display: 'flex', height: '100%', gap: 0 }}>
      {/* Left: selectors */}
      <div style={{ width: 200, borderRight: '1px solid rgba(255,255,255,0.06)', padding: '16px 12px', overflowY: 'auto', flexShrink: 0 }} className="hide-scrollbar">
        {/* Characters */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Character</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(characters || []).map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedChar(c.id === selectedChar ? null : c.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                  background: 'rgba(255,255,255,0.03)', border: `1px solid ${c.id === selectedChar ? 'rgba(229,57,53,0.5)' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: 8, padding: '6px 8px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                }}
              >
                {c.image_url ? (
                  <img src={c.image_url} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#2a0000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>👤</div>
                )}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ color: '#fff', fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                  {c.id === selectedChar && <div style={{ color: '#4CAF50', fontSize: 10, fontWeight: 600 }}>● Active</div>}
                </div>
              </button>
            ))}
            {(!characters || characters.length === 0) && (
              <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, textAlign: 'center', padding: '12px 0' }}>No characters yet</div>
            )}
          </div>
        </div>

        {/* Locations */}
        <div>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Location</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(locations || []).map(l => (
              <button
                key={l.id}
                onClick={() => setSelectedLoc(l.id === selectedLoc ? null : l.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                  background: 'rgba(255,255,255,0.03)', border: `1px solid ${l.id === selectedLoc ? 'rgba(229,57,53,0.5)' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: 8, padding: '6px 8px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                }}
              >
                {l.image_url ? (
                  <img src={l.image_url} alt="" style={{ width: 28, height: 20, borderRadius: 4, objectFit: 'cover', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 28, height: 20, borderRadius: 4, background: '#1a1a00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, flexShrink: 0 }}>🌍</div>
                )}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ color: '#fff', fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.name}</div>
                  {l.id === selectedLoc && <div style={{ color: '#4CAF50', fontSize: 10, fontWeight: 600 }}>● Active</div>}
                </div>
              </button>
            ))}
            {(!locations || locations.length === 0) && (
              <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, textAlign: 'center', padding: '12px 0' }}>No locations yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Center: shot composer */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', overflow: 'hidden' }}>
        {/* Canvas */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
          <div style={{ flex: 1, background: '#111', borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden', position: 'relative', minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Generation progress bar */}
            {isGenerating && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#1a1a1a', zIndex: 10 }}>
                <div style={{ height: '100%', background: '#E53935', width: `${generationProgress}%`, transition: 'width 0.3s ease', boxShadow: '0 0 12px rgba(229,57,53,0.6)' }} />
              </div>
            )}
            {activeScene?.generated_output_url ? (
              <img src={activeScene.generated_output_url} alt="Generated scene" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : charObj || locObj ? (
              <div style={{ textAlign: 'center', padding: 24 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🎬</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 6 }}>Scene Ready to Generate</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
                  {charObj ? `Character: ${charObj.name}` : 'No character'} · {locObj ? `Location: ${locObj.name}` : 'No location'}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 24 }}>
                <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.3 }}>🎥</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, marginBottom: 4 }}>Select a character and location</div>
                <div style={{ color: 'rgba(255,255,255,0.15)', fontSize: 12 }}>or write a scene action to generate</div>
              </div>
            )}
            {isGenerating && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#E53935', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>Generating scene...</div>
              </div>
            )}
          </div>

          {/* Scene action */}
          <textarea
            value={sceneAction}
            onChange={e => setSceneAction(e.target.value)}
            placeholder="What happens in this scene? Describe the action, mood, and story beat..."
            rows={2}
            style={{
              background: '#131313', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8,
              color: '#fff', fontSize: 14, fontFamily: '"DM Sans", sans-serif', padding: '10px 12px',
              resize: 'none', outline: 'none', lineHeight: 1.6, flexShrink: 0,
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(229,57,53,0.4)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
          />

          {/* Shot controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 600, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Camera Angle</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {CAMERA_ANGLES.map(a => <Chip key={a} label={a} active={cameraAngle === a} onClick={() => setCameraAngle(a)} />)}
              </div>
            </div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 600, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Lighting</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {LIGHTING.map(l => <Chip key={l} label={l} active={lighting === l} onClick={() => setLighting(l)} />)}
              </div>
            </div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 600, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Camera Motion</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {MOTION.map(m => <Chip key={m} label={m} active={motion === m} onClick={() => setMotion(m)} />)}
              </div>
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !sceneAction.trim()}
            style={{
              width: '100%', height: 48, background: isGenerating || !sceneAction.trim() ? 'rgba(229,57,53,0.3)' : '#E53935',
              border: 'none', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: isGenerating || !sceneAction.trim() ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: '"DM Sans", sans-serif', transition: 'all 0.18s', flexShrink: 0,
              boxShadow: isGenerating || !sceneAction.trim() ? 'none' : '0 0 24px rgba(229,57,53,0.3)',
            }}
            onMouseEnter={e => { if (!isGenerating && sceneAction.trim()) e.currentTarget.style.background = '#ff2222'; }}
            onMouseLeave={e => { if (!isGenerating && sceneAction.trim()) e.currentTarget.style.background = '#E53935'; }}
          >
            <Zap size={18} />
            {isGenerating ? 'Generating...' : 'Generate Scene →'}
          </button>
        </div>
      </div>

      {/* Right: generation output */}
      <div style={{ width: 220, borderLeft: '1px solid rgba(255,255,255,0.06)', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Output</div>
        {activeScene?.generated_output_url ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <img src={activeScene.generated_output_url} alt="" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }} />
            <button style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#fff', fontSize: 12, padding: '7px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontFamily: '"DM Sans", sans-serif' }}>
              <RefreshCw size={12} /> Regenerate
            </button>
            <button style={{ width: '100%', background: 'rgba(229,57,53,0.12)', border: '1px solid rgba(229,57,53,0.3)', borderRadius: 6, color: '#E53935', fontSize: 12, padding: '7px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontFamily: '"DM Sans", sans-serif' }}>
              + Add to Timeline
            </button>
            <button style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, color: 'rgba(255,255,255,0.6)', fontSize: 12, padding: '7px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontFamily: '"DM Sans", sans-serif' }}>
              <Download size={12} /> Download
            </button>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 32, opacity: 0.15 }}>🎬</div>
            <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, textAlign: 'center' }}>Generation output will appear here</div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}