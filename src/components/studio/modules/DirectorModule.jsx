import React, { useState } from 'react';
import { Zap, Video } from 'lucide-react';

const CAMERA_ANGLES = ['Wide', 'Medium', 'Close-Up', 'Extreme Close-Up', "Bird's Eye", 'Low Angle', 'Dutch Angle'];
const LIGHTING = ['Natural', 'Cinematic', 'Golden Hour', 'Night', 'Studio', 'Dramatic', 'Neon'];
const CAMERA_MOTIONS = ['Static', 'Pan Left', 'Pan Right', 'Zoom In', 'Zoom Out', 'Dolly', 'Handheld'];

const Pill = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: '5px 13px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
      background: active ? 'rgba(229,57,53,0.18)' : 'rgba(255,255,255,0.05)',
      border: `1px solid ${active ? 'rgba(229,57,53,0.55)' : 'rgba(255,255,255,0.08)'}`,
      color: active ? '#E53935' : 'rgba(255,255,255,0.65)',
      transition: 'all 0.15s', fontFamily: '"DM Sans", sans-serif', whiteSpace: 'nowrap',
      fontWeight: active ? 600 : 400,
    }}
  >{label}</button>
);

const SectionLabel = ({ children }) => (
  <div style={{
    color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 700,
    letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8,
  }}>{children}</div>
);

export default function DirectorModule({ characters, locations, activeScene, onGenerateScene, isGenerating, generationProgress }) {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [sceneAction, setSceneAction] = useState('');
  const [cameraAngle, setCameraAngle] = useState('Wide');
  const [lighting, setLighting] = useState('Cinematic');
  const [motion, setMotion] = useState('Static');

  const handleGenerate = () => {
    if (onGenerateScene) {
      onGenerateScene({
        character_id: selectedCharacter,
        location_id: selectedLocation,
        scene_action: sceneAction,
        camera_angle: cameraAngle,
        lighting,
        motion,
      });
    }
  };

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

      {/* LEFT COLUMN */}
      <div style={{ width: 200, borderRight: '1px solid rgba(255,255,255,0.06)', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto', flexShrink: 0 }} className="hide-scrollbar">

        {/* Character */}
        <div>
          <SectionLabel>Character</SectionLabel>
          {(!characters || characters.length === 0) ? (
            <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, fontStyle: 'italic', padding: '10px 0' }}>No characters yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {characters.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCharacter(c.id === selectedCharacter ? null : c.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 8,
                    background: selectedCharacter === c.id ? 'rgba(229,57,53,0.12)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${selectedCharacter === c.id ? 'rgba(229,57,53,0.4)' : 'rgba(255,255,255,0.07)'}`,
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                  }}
                >
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

        {/* Location */}
        <div>
          <SectionLabel>Location</SectionLabel>
          {(!locations || locations.length === 0) ? (
            <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, fontStyle: 'italic', padding: '10px 0' }}>No locations yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {locations.map(l => (
                <button
                  key={l.id}
                  onClick={() => setSelectedLocation(l.id === selectedLocation ? null : l.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 8,
                    background: selectedLocation === l.id ? 'rgba(229,57,53,0.12)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${selectedLocation === l.id ? 'rgba(229,57,53,0.4)' : 'rgba(255,255,255,0.07)'}`,
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                  }}
                >
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
        {/* 16:9 Canvas */}
        <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: 14, overflow: 'hidden', minHeight: 0 }}>
          <div style={{
            flex: 1, background: '#0d0d0d', borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden', minHeight: 0,
          }}>
            {isGenerating && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#1a1a1a', zIndex: 10 }}>
                <div style={{ height: '100%', width: `${generationProgress}%`, background: '#E53935', boxShadow: '0 0 10px rgba(229,57,53,0.6)', transition: 'width 0.4s ease' }} />
              </div>
            )}
            {isGenerating ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, border: '3px solid rgba(255,255,255,0.08)', borderTopColor: '#E53935', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Generating scene...</div>
                <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>{Math.floor(generationProgress)}%</div>
              </div>
            ) : activeScene?.generated_output_url ? (
              <img src={activeScene.generated_output_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '0 40px', textAlign: 'center' }}>
                <Video size={40} style={{ color: 'rgba(255,255,255,0.1)' }} />
                <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 14, lineHeight: 1.5 }}>
                  Select a character and location or write a scene action to generate
                </div>
              </div>
            )}
          </div>

          {/* Scene action input */}
          <textarea
            value={sceneAction}
            onChange={e => setSceneAction(e.target.value)}
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
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            style={{
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
            {isGenerating ? 'Generating...' : 'Generate Scene →'}
          </button>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ width: 220, borderLeft: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Output</div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 20, textAlign: 'center' }}>
          <Video size={32} style={{ color: 'rgba(255,255,255,0.1)' }} />
          <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13, lineHeight: 1.5 }}>
            Generation output will appear here
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}