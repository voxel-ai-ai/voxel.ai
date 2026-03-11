import React, { useState } from 'react';
import ImagePromptBar from '@/components/image/ImagePromptBar';
import ImageRightArea from '@/components/image/ImageRightArea';
import TemplateModal from '@/components/common/TemplateModal';
import { History, Globe } from 'lucide-react';
import { toast } from 'sonner';

const MODEL_SUBTITLES = {
  'Nano Banana Pro':   'Create stunning, high-aesthetic images in seconds',
  'Nano Banana 2':     'Pro-level quality at Flash speed',
  'Soul 2.0':          'Fashion-forward portraits with cultural fluency',
  'Seedream 5.0 Lite': 'Intelligent visual reasoning — unlimited access',
  'Seedream 4.5':      'Next-gen 4K photorealistic detail',
  'GPT Image 1.5':     'True-color precision rendering by OpenAI',
  'Flux Kontext':      'Stylistic diversity for any aesthetic',
  'Flux 2':            'Strong prompt adherence at high speed',
  'Wan 2.2 Image':     'Artistic and illustrated visual creation',
  'Skin Enhancer':     'Natural realistic skin texture enhancement',
  'Face Swap':         'Seamless instant face replacement',
  'Relight':           'Change the light, change the mood',
};

const RESULT_GRADIENTS = [
  'linear-gradient(135deg, #1a0000 0%, #8B0000 50%, #1a1a1a 100%)',
  'linear-gradient(135deg, #0a0a1a 0%, #1a0a2a 50%, #2a0a0a 100%)',
  'linear-gradient(135deg, #0d0d0d 0%, #2a0000 60%, #111 100%)',
  'linear-gradient(135deg, #1a1a0a 0%, #3a1a00 50%, #0a0a0a 100%)',
];

export default function Image() {
  const [selectedModel, setSelectedModel] = useState({ id: 'nano-pro', name: 'Nano Banana Pro' });
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState([]);
  const [imageCount, setImageCount] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      const newImages = Array.from({ length: imageCount }, (_, i) => ({
        id: Date.now() + i,
        gradient: RESULT_GRADIENTS[i % 4],
        prompt,
      }));
      setImages(prev => [...newImages, ...prev]);
      toast.success('Image generated!');
    }, 3000);
  };

  const handleRecreate = (template) => {
    setPrompt(template.prompt);
    setSelectedTemplate(null);
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)', background: '#0A0A0A' }}>

      {/* ── Left / Main area ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

        {/* Secondary nav tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderBottom: '1px solid #1A1A1A' }}>
          <button
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999, fontSize: 13, color: '#888', border: '1px solid #2A2A2A', background: 'transparent', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#ccc'}
            onMouseLeave={e => e.currentTarget.style.color = '#888'}
          >
            <History style={{ width: 14, height: 14 }} />
            History
          </button>
          <button
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999, fontSize: 13, color: '#888', border: '1px solid #2A2A2A', background: 'transparent', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#ccc'}
            onMouseLeave={e => e.currentTarget.style.color = '#888'}
          >
            <Globe style={{ width: 14, height: 14 }} />
            Community
          </button>
        </div>

        {/* Center content — empty / generating state */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: 160, paddingTop: 20 }}>

          {/* Empty state */}
          {!isGenerating && images.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 16px', animation: 'fadeInUp 0.5s ease forwards' }}>
              <div style={{ position: 'relative', width: 110, height: 110, marginBottom: 32 }}>
                <span style={{ position: 'absolute', top: -8, right: -4, fontSize: 18, color: '#E01E1E', animation: 'glowPulse 2s ease-in-out infinite', animationDelay: '0s' }}>✦</span>
                <span style={{ position: 'absolute', top: 20, right: -18, fontSize: 11, color: '#ff5555', animation: 'glowPulse 2s ease-in-out infinite', animationDelay: '0.7s' }}>✦</span>
                <span style={{ position: 'absolute', bottom: 0, left: -10, fontSize: 14, color: '#8B0000', animation: 'glowPulse 2s ease-in-out infinite', animationDelay: '1.4s' }}>✦</span>
                <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
                  <defs>
                    <linearGradient id="ig1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#8B0000"/><stop offset="100%" stopColor="#E01E1E"/></linearGradient>
                    <linearGradient id="ig2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#5a0000"/><stop offset="100%" stopColor="#8B0000"/></linearGradient>
                    <linearGradient id="ig3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3a0000"/><stop offset="100%" stopColor="#5a0000"/></linearGradient>
                  </defs>
                  <rect x="18" y="30" width="60" height="52" rx="8" fill="url(#ig1)"/>
                  <path d="M18 30 L38 14 L98 14 L78 30 Z" fill="url(#ig2)"/>
                  <path d="M78 30 L98 14 L98 66 L78 82 Z" fill="url(#ig3)"/>
                  <circle cx="38" cy="50" r="7" fill="rgba(255,255,255,0.25)"/>
                  <path d="M22 74 L36 56 L50 68 L62 54 L76 74 Z" fill="rgba(255,255,255,0.18)"/>
                </svg>
              </div>
              <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(48px, 7vw, 88px)', color: '#fff', lineHeight: 1, margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                {selectedModel.name}
              </h1>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: '#666', margin: 0 }}>
                {MODEL_SUBTITLES[selectedModel.name] || 'Create stunning images in seconds'}
              </p>
            </div>
          )}

          {/* Generating state */}
          {isGenerating && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 16px' }}>
              <div style={{ position: 'relative', width: 100, height: 100, marginBottom: 32, animation: 'pulse 1.5s ease-in-out infinite' }}>
                <svg width="100" height="100" viewBox="0 0 110 110" fill="none">
                  <defs>
                    <linearGradient id="ig1b" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#8B0000"/><stop offset="100%" stopColor="#E01E1E"/></linearGradient>
                    <linearGradient id="ig2b" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#5a0000"/><stop offset="100%" stopColor="#8B0000"/></linearGradient>
                    <linearGradient id="ig3b" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3a0000"/><stop offset="100%" stopColor="#5a0000"/></linearGradient>
                  </defs>
                  <rect x="18" y="30" width="60" height="52" rx="8" fill="url(#ig1b)"/>
                  <path d="M18 30 L38 14 L98 14 L78 30 Z" fill="url(#ig2b)"/>
                  <path d="M78 30 L98 14 L98 66 L78 82 Z" fill="url(#ig3b)"/>
                  <circle cx="38" cy="50" r="7" fill="rgba(255,255,255,0.25)"/>
                  <path d="M22 74 L36 56 L50 68 L62 54 L76 74 Z" fill="rgba(255,255,255,0.18)"/>
                </svg>
              </div>
              <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(48px, 7vw, 88px)', color: '#fff', lineHeight: 1, margin: '0 0 12px 0', textTransform: 'uppercase' }}>
                {selectedModel.name}
              </h1>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: '#666', margin: 0 }}>
                Generating your image...
              </p>
            </div>
          )}

          {/* After first generation — show model name smaller */}
          {!isGenerating && images.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 16px' }}>
              <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(32px, 4vw, 56px)', color: 'rgba(255,255,255,0.15)', lineHeight: 1, margin: 0, textTransform: 'uppercase' }}>
                {selectedModel.name}
              </h2>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#444', marginTop: 8 }}>
                {MODEL_SUBTITLES[selectedModel.name] || 'Create stunning images in seconds'}
              </p>
            </div>
          )}
        </div>

        {/* Prompt bar */}
        <ImagePromptBar
          prompt={prompt}
          onPromptChange={setPrompt}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          imageCount={imageCount}
          onCountChange={setImageCount}
        />
      </div>

      {/* ── Right panel ── */}
      <ImageRightArea
        images={images}
        isGenerating={isGenerating}
        durationMs={3000}
      />

      {selectedTemplate && (
        <TemplateModal
          template={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
          type="image"
          onRecreate={handleRecreate}
        />
      )}

      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes glowPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
      `}</style>
    </div>
  );
}