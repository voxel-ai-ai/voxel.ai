import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ImagePromptBar from '@/components/image/ImagePromptBar';
import TemplateModal from '@/components/common/TemplateModal';
import { imageTemplates } from '@/components/data/siteData';
import { Download, Heart, RefreshCw, Maximize2, History, Globe } from 'lucide-react';
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
  const [results, setResults] = useState(null); // null = empty, array = done
  const [imageCount, setImageCount] = useState(1);
  const [expandedImage, setExpandedImage] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    setIsGenerating(true);
    setResults(null);
    setTimeout(() => {
      setIsGenerating(false);
      setResults(Array.from({ length: imageCount }, (_, i) => ({ id: i, gradient: RESULT_GRADIENTS[i % 4] })));
      toast.success('Image generated!');
    }, 3000);
  };

  const handleModelChange = (model) => {
    setSelectedModel(model);
  };

  const handleRecreate = (template) => {
    setPrompt(template.prompt);
    setSelectedTemplate(null);
  };

  return (
    <div className="min-h-screen" style={{ background: '#0A0A0A' }}>
      {/* Secondary nav tabs */}
      <div className="flex items-center gap-2 px-6 py-2.5" style={{ borderBottom: '1px solid #1A1A1A' }}>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] transition-colors"
          style={{ color: '#888', border: '1px solid #2A2A2A', background: 'transparent' }}
          onMouseEnter={e => e.currentTarget.style.color = '#ccc'}
          onMouseLeave={e => e.currentTarget.style.color = '#888'}
        >
          <History className="w-3.5 h-3.5" />
          History
        </button>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] transition-colors"
          style={{ color: '#888', border: '1px solid #2A2A2A', background: 'transparent' }}
          onMouseEnter={e => e.currentTarget.style.color = '#ccc'}
          onMouseLeave={e => e.currentTarget.style.color = '#888'}
        >
          <Globe className="w-3.5 h-3.5" />
          Community
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col items-center justify-center" style={{ minHeight: 'calc(100vh - 140px)', paddingBottom: 140 }}>

        {/* === EMPTY STATE === */}
        {!isGenerating && !results && (
          <div className="flex flex-col items-center text-center px-4 animate-fade-in-up">
            {/* 3D Image Icon with sparkles */}
            <div className="relative mb-8" style={{ width: 110, height: 110 }}>
              {/* Sparkles */}
              <span className="absolute animate-glow-pulse" style={{ top: -8, right: -4, fontSize: 18, color: '#E01E1E', animationDelay: '0s' }}>✦</span>
              <span className="absolute animate-glow-pulse" style={{ top: 20, right: -18, fontSize: 11, color: '#ff5555', animationDelay: '0.7s' }}>✦</span>
              <span className="absolute animate-glow-pulse" style={{ bottom: 0, left: -10, fontSize: 14, color: '#8B0000', animationDelay: '1.4s' }}>✦</span>

              {/* Icon */}
              <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="imgGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B0000" />
                    <stop offset="100%" stopColor="#E01E1E" />
                  </linearGradient>
                  <linearGradient id="imgGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#5a0000" />
                    <stop offset="100%" stopColor="#8B0000" />
                  </linearGradient>
                  <linearGradient id="imgGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3a0000" />
                    <stop offset="100%" stopColor="#5a0000" />
                  </linearGradient>
                </defs>
                {/* 3D box front face */}
                <rect x="18" y="30" width="60" height="52" rx="8" fill="url(#imgGrad1)" />
                {/* top face */}
                <path d="M18 30 L38 14 L98 14 L78 30 Z" fill="url(#imgGrad2)" />
                {/* right face */}
                <path d="M78 30 L98 14 L98 66 L78 82 Z" fill="url(#imgGrad3)" />
                {/* Mountain / image icon */}
                <circle cx="38" cy="50" r="7" fill="rgba(255,255,255,0.25)" />
                <path d="M22 74 L36 56 L50 68 L62 54 L76 74 Z" fill="rgba(255,255,255,0.18)" />
              </svg>
            </div>

            {/* Model name - huge */}
            <h1
              className="font-display uppercase text-white mb-3 leading-none"
              style={{ fontSize: 'clamp(52px, 8vw, 96px)', lineHeight: 1 }}
            >
              {selectedModel.name}
            </h1>

            {/* Subtitle */}
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: '#666' }}>
              {MODEL_SUBTITLES[selectedModel.name] || 'Create stunning images in seconds'}
            </p>
          </div>
        )}

        {/* === GENERATING STATE === */}
        {isGenerating && (
          <div className="flex flex-col items-center text-center px-4">
            {/* Pulsing icon */}
            <div className="relative mb-8 animate-pulse" style={{ width: 100, height: 100 }}>
              <svg width="100" height="100" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="imgGrad1b" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B0000" />
                    <stop offset="100%" stopColor="#E01E1E" />
                  </linearGradient>
                  <linearGradient id="imgGrad2b" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#5a0000" />
                    <stop offset="100%" stopColor="#8B0000" />
                  </linearGradient>
                  <linearGradient id="imgGrad3b" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3a0000" />
                    <stop offset="100%" stopColor="#5a0000" />
                  </linearGradient>
                </defs>
                <rect x="18" y="30" width="60" height="52" rx="8" fill="url(#imgGrad1b)" />
                <path d="M18 30 L38 14 L98 14 L78 30 Z" fill="url(#imgGrad2b)" />
                <path d="M78 30 L98 14 L98 66 L78 82 Z" fill="url(#imgGrad3b)" />
                <circle cx="38" cy="50" r="7" fill="rgba(255,255,255,0.25)" />
                <path d="M22 74 L36 56 L50 68 L62 54 L76 74 Z" fill="rgba(255,255,255,0.18)" />
              </svg>
            </div>
            <h1 className="font-display uppercase text-white mb-3 leading-none" style={{ fontSize: 'clamp(52px, 8vw, 96px)', lineHeight: 1 }}>
              {selectedModel.name}
            </h1>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: '#666' }}>
              Generating your image...
            </p>

            {/* Progress bar at bottom of page */}
            <div
              className="fixed bottom-0 left-0 right-0 overflow-hidden"
              style={{ height: 2, zIndex: 60 }}
            >
              <div
                className="h-full"
                style={{
                  background: '#E01E1E',
                  width: '100%',
                  animation: 'progress-sweep 3s linear forwards',
                }}
              />
            </div>
            <style>{`
              @keyframes progress-sweep {
                from { transform: scaleX(0); transform-origin: left; }
                to { transform: scaleX(1); transform-origin: left; }
              }
            `}</style>
          </div>
        )}

        {/* === RESULTS STATE === */}
        {!isGenerating && results && (
          <div className="w-full flex flex-col items-center px-6" style={{ paddingTop: 40 }}>
            {results.length === 1 ? (
              /* Single image */
              <div
                className="relative rounded-2xl overflow-hidden cursor-pointer"
                style={{
                  width: 'min(480px, 80vw)',
                  aspectRatio: '4/5',
                  background: results[0].gradient,
                  animation: 'fadeInScale 0.5s ease forwards',
                }}
                onClick={() => setExpandedImage(results[0])}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 14 }}>Generated Image</span>
                </div>
              </div>
            ) : (
              /* 2×2 grid */
              <div className="grid grid-cols-2 gap-4" style={{ width: 'min(640px, 90vw)' }}>
                {results.map((r) => (
                  <div
                    key={r.id}
                    className="relative rounded-xl overflow-hidden cursor-pointer hover:-translate-y-1 transition-transform"
                    style={{
                      aspectRatio: '4/5',
                      background: r.gradient,
                      animation: `fadeInScale 0.5s ease ${r.id * 0.1}s forwards`,
                      opacity: 0,
                    }}
                    onClick={() => setExpandedImage(r)}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>Image {r.id + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action row */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: Download, label: 'Download' },
                { icon: Heart, label: 'Save' },
                { icon: RefreshCw, label: 'Variations' },
                { icon: Maximize2, label: 'Upscale 4K' },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors"
                  style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', color: '#aaa' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2A2A'; e.currentTarget.style.color = '#aaa'; }}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Prompt Bar */}
      <ImagePromptBar
        prompt={prompt}
        onPromptChange={setPrompt}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
        imageCount={imageCount}
        onCountChange={setImageCount}
      />

      {/* Expanded image lightbox */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.95)' }}
          onClick={() => setExpandedImage(null)}
        >
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              width: 'min(600px, 90vw)',
              aspectRatio: '4/5',
              background: expandedImage.gradient,
            }}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      {/* Template Modal */}
      {selectedTemplate && (
        <TemplateModal
          template={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
          type="image"
          onRecreate={handleRecreate}
        />
      )}

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}