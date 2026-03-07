import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, Plus, RotateCcw, ChevronLeft, Film } from 'lucide-react';

const CAMERA_MOTIONS = ['Static', 'Slow Zoom In', 'Slow Zoom Out', 'Pan Left', 'Pan Right', 'Dolly Forward', 'Dolly Back', 'Handheld', 'Orbit Left', 'Orbit Right', 'Tilt Up', 'Tilt Down'];
const INTENSITIES = ['Subtle', 'Moderate', 'Strong'];
const DURATIONS = ['3s', '5s', '8s', '10s'];
const VIDEO_MODELS = [
  { id: 'nano-pro', name: 'Nano Banana Pro', credits: 400, badge: 'BEST' },
  { id: 'seedream', name: 'Seedream 4.5', credits: 250 },
  { id: 'wan', name: 'Wan 2.2 Video', credits: 200 },
  { id: 'nova', name: 'Nova V2', credits: 180 },
];
const STATUS_CYCLE = ['Analyzing image...', 'Calculating motion...', 'Rendering frames...', 'Finalizing clip...'];

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

export default function AnimateTab({ storyboardFrames, initialFrameId, onFrameAnimated, onBackToStoryboard, videoClips }) {
  const [selectedFrameId, setSelectedFrameId] = useState(initialFrameId || storyboardFrames[0]?.id || null);
  const [cameraMotion, setCameraMotion] = useState('Slow Zoom In');
  const [intensity, setIntensity] = useState('Moderate');
  const [duration, setDuration] = useState('5s');
  const [motionDesc, setMotionDesc] = useState('');
  const [selectedModel, setSelectedModel] = useState(VIDEO_MODELS[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [outputUrl, setOutputUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const progressRef = useRef(null);
  const statusRef = useRef(null);
  const videoRef = useRef(null);

  const selectedFrame = storyboardFrames.find(f => f.id === selectedFrameId);

  useEffect(() => {
    if (initialFrameId) setSelectedFrameId(initialFrameId);
  }, [initialFrameId]);

  // Load existing video if frame is already animated
  useEffect(() => {
    if (selectedFrame?.video_url) {
      setOutputUrl(selectedFrame.video_url);
    } else {
      setOutputUrl(null);
    }
  }, [selectedFrameId]);

  const startSimulation = () => {
    let p = 0, si = 0;
    setStatusText(STATUS_CYCLE[0]);
    progressRef.current = setInterval(() => {
      p += Math.random() * 3 + 1;
      if (p >= 97) p = 97;
      setProgress(p);
    }, 300);
    statusRef.current = setInterval(() => {
      si = (si + 1) % STATUS_CYCLE.length;
      setStatusText(STATUS_CYCLE[si]);
    }, 2000);
  };

  const stopSimulation = () => {
    clearInterval(progressRef.current);
    clearInterval(statusRef.current);
  };

  useEffect(() => () => stopSimulation(), []);

  const handleAnimate = async () => {
    if (!selectedFrame) return;
    setIsAnimating(true);
    setOutputUrl(null);
    setProgress(0);
    startSimulation();
    // Simulate video generation — uses the storyboard image as placeholder output
    await new Promise(r => setTimeout(r, 7000));
    stopSimulation();
    setProgress(100);
    setStatusText('Done!');
    setOutputUrl(selectedFrame.image_url); // placeholder for real video
    setIsAnimating(false);
  };

  const handleAddToTimeline = () => {
    if (!outputUrl || !selectedFrame) return;
    onFrameAnimated(selectedFrame.id, outputUrl, parseInt(duration));
    setOutputUrl(null);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) { videoRef.current.pause(); setIsPlaying(false); }
      else { videoRef.current.play(); setIsPlaying(true); }
    }
  };

  const sceneIndex = storyboardFrames.findIndex(f => f.id === selectedFrameId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>

        {/* LEFT PANEL — Storyboard frames */}
        <div style={{ width: 180, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <button onClick={onBackToStoryboard} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: 0, fontFamily: '"DM Sans", sans-serif', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
            >
              <ChevronLeft size={13} /> Back to Storyboard
            </button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }} className="hide-scrollbar">
            {storyboardFrames.length === 0 ? (
              <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, textAlign: 'center', padding: '20px 8px' }}>No storyboard frames yet</div>
            ) : (
              storyboardFrames.map((frame, i) => (
                <button key={frame.id} onClick={() => setSelectedFrameId(frame.id)} style={{
                  width: '100%', marginBottom: 8, background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
                }}>
                  <div style={{
                    borderRadius: 8, overflow: 'hidden',
                    border: `2px solid ${selectedFrameId === frame.id ? '#E53935' : 'rgba(255,255,255,0.07)'}`,
                    transition: 'border-color 0.15s',
                  }}>
                    <img src={frame.image_url} alt={`Scene ${i + 1}`} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }} />
                    <div style={{ padding: '5px 8px', background: '#111', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 600 }}>Scene {i + 1}</span>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                        background: frame.animated ? 'rgba(76,175,80,0.15)' : 'rgba(255,255,255,0.06)',
                        color: frame.animated ? '#4CAF50' : 'rgba(255,255,255,0.3)',
                        border: `1px solid ${frame.animated ? 'rgba(76,175,80,0.3)' : 'rgba(255,255,255,0.08)'}`,
                      }}>
                        {frame.animated ? 'Animated ✓' : 'Not Animated'}
                      </span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* CENTER PANEL — Animation canvas + controls */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }} className="hide-scrollbar">
            {selectedFrame ? (
              <>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 600 }}>
                  Scene {sceneIndex + 1} — Ready to Animate
                </div>
                {/* Image preview */}
                <div style={{ aspectRatio: '16/9', borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', position: 'relative', flexShrink: 0 }}>
                  <img src={selectedFrame.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* Controls */}
                <div>
                  <SectionLabel>Camera Motion</SectionLabel>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {CAMERA_MOTIONS.map(m => <Pill key={m} label={m} active={cameraMotion === m} onClick={() => setCameraMotion(m)} />)}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <SectionLabel>Motion Intensity</SectionLabel>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {INTENSITIES.map(i => <Pill key={i} label={i} active={intensity === i} onClick={() => setIntensity(i)} />)}
                    </div>
                  </div>
                  <div>
                    <SectionLabel>Duration</SectionLabel>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {DURATIONS.map(d => <Pill key={d} label={d} active={duration === d} onClick={() => setDuration(d)} />)}
                    </div>
                  </div>
                </div>
                <div>
                  <SectionLabel>Motion Description</SectionLabel>
                  <textarea value={motionDesc} onChange={e => setMotionDesc(e.target.value)}
                    placeholder="Describe how the camera moves and what the subject does..."
                    rows={2}
                    style={{
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                      borderRadius: 8, color: '#fff', fontSize: 13, padding: '9px 12px',
                      outline: 'none', width: '100%', fontFamily: '"DM Sans", sans-serif', resize: 'none', lineHeight: 1.5,
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(229,57,53,0.45)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'}
                  />
                </div>
                <div>
                  <SectionLabel>Video Model</SectionLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {VIDEO_MODELS.map(m => (
                      <button key={m.id} onClick={() => setSelectedModel(m)} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '8px 12px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                        background: selectedModel.id === m.id ? 'rgba(229,57,53,0.12)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${selectedModel.id === m.id ? 'rgba(229,57,53,0.4)' : 'rgba(255,255,255,0.07)'}`,
                        transition: 'all 0.15s',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <div style={{ width: 7, height: 7, borderRadius: '50%', background: selectedModel.id === m.id ? '#E53935' : 'rgba(255,255,255,0.2)' }} />
                          <span style={{ color: selectedModel.id === m.id ? '#fff' : 'rgba(255,255,255,0.6)', fontSize: 12, fontFamily: '"DM Sans", sans-serif', fontWeight: selectedModel.id === m.id ? 600 : 400 }}>{m.name}</span>
                          {m.badge && <span style={{ background: 'rgba(229,57,53,0.2)', border: '1px solid rgba(229,57,53,0.4)', borderRadius: 4, padding: '1px 5px', fontSize: 9, color: '#E53935', fontWeight: 700 }}>{m.badge}</span>}
                        </div>
                        <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>✦ {m.credits}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Animate button */}
                <button onClick={handleAnimate} disabled={isAnimating} style={{
                  width: '100%', padding: '14px', background: isAnimating ? 'rgba(229,57,53,0.4)' : '#E53935',
                  border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 700,
                  cursor: isAnimating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 8, fontFamily: '"DM Sans", sans-serif',
                  boxShadow: isAnimating ? 'none' : '0 0 24px rgba(229,57,53,0.25)',
                  transition: 'all 0.18s', flexShrink: 0,
                }}
                  onMouseEnter={e => { if (!isAnimating) e.currentTarget.style.background = '#ff2222'; }}
                  onMouseLeave={e => { if (!isAnimating) e.currentTarget.style.background = '#E53935'; }}
                >
                  <Film size={16} />
                  {isAnimating ? `${statusText} ${Math.floor(progress)}%` : `🎬 Animate Scene → ✦ ~${selectedModel.credits} credits`}
                </button>

                {isAnimating && (
                  <div style={{ height: 3, background: '#1a1a1a', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: '#E53935', boxShadow: '0 0 8px rgba(229,57,53,0.5)', transition: 'width 0.3s ease' }} />
                  </div>
                )}
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 14 }}>
                <Film size={40} style={{ opacity: 0.15 }} />
                Select a storyboard frame from the left panel to animate it
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL — Output */}
        <div style={{ width: 230, borderLeft: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Output</div>
          </div>
          {outputUrl ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 12, gap: 10, overflowY: 'auto' }} className="hide-scrollbar">
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                <img src={outputUrl} alt="Output" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
                  <button onClick={togglePlay} style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                </div>
              </div>
              <button onClick={handleAnimate} disabled={isAnimating} style={ghostBtn}>
                <RotateCcw size={13} /> Reanimate
              </button>
              <button onClick={() => { const a = document.createElement('a'); a.href = outputUrl; a.download = 'clip.mp4'; a.click(); }} style={ghostBtn}>
                <Download size={13} /> Download Clip
              </button>
              <button onClick={handleAddToTimeline} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                background: '#E53935', border: 'none', borderRadius: 8, color: '#fff',
                fontSize: 13, fontWeight: 700, padding: '10px', cursor: 'pointer',
                fontFamily: '"DM Sans", sans-serif', transition: 'background 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#ff2222'}
                onMouseLeave={e => e.currentTarget.style.background = '#E53935'}
              >
                <Plus size={13} /> Add to Timeline
              </button>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 20, textAlign: 'center' }}>
              <Film size={32} style={{ color: 'rgba(255,255,255,0.1)' }} />
              <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13, lineHeight: 1.5 }}>Animated clip will appear here</div>
            </div>
          )}
        </div>
      </div>

      {/* VIDEO TIMELINE STRIP */}
      <div style={{
        height: 130, background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{ height: 32, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Timeline — {videoClips.length} clip{videoClips.length !== 1 ? 's' : ''}
          </span>
          <div style={{ flex: 1 }} />
          <button style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(229,57,53,0.12)', border: '1px solid rgba(229,57,53,0.25)', borderRadius: 6, padding: '4px 10px', color: '#E53935', fontSize: 12, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
            <Play size={11} /> Preview All
          </button>
        </div>
        <div style={{ flex: 1, overflowX: 'auto', display: 'flex', alignItems: 'center', padding: '8px 12px', gap: 6 }} className="hide-scrollbar">
          {videoClips.length === 0 ? (
            <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, fontStyle: 'italic', padding: '0 12px' }}>No clips yet. Animate scenes and add them to the timeline.</div>
          ) : (
            videoClips.map((clip, i) => (
              <div key={clip.id || i} style={{ flexShrink: 0, width: 110, height: 82, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', background: '#131313', position: 'relative' }}>
                {clip.url && <img src={clip.url} alt="" style={{ width: '100%', height: 58, objectFit: 'cover' }} />}
                <div style={{ padding: '3px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: 600 }}>Clip {i + 1}</span>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9 }}>{clip.duration || 5}s</span>
                </div>
                <div style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(0,0,0,0.6)', borderRadius: 4, padding: '1px 4px', display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Film size={8} style={{ color: '#E53935' }} />
                </div>
              </div>
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