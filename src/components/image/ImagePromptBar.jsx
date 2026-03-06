import React, { useState, useRef, useEffect } from 'react';
import { Plus, Zap, ChevronRight, Minus, AtSign, Sparkles } from 'lucide-react';
import ModelDropdown from './ModelDropdown';

const ASPECT_RATIOS = ['1:1', '16:9', '9:16', '4:3', '3:4', '21:9'];
const QUALITIES = ['Draft', '1K', '2K', '4K'];

export default function ImagePromptBar({ prompt, onPromptChange, onGenerate, isGenerating, selectedModel, onModelChange, imageCount, onCountChange }) {
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showAspectDropdown, setShowAspectDropdown] = useState(false);
  const [showQualityDropdown, setShowQualityDropdown] = useState(false);

  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [quality, setQuality] = useState('2K');
  const modelBtnRef = useRef(null);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onGenerate();
    }
  };

  const Chip = ({ children, onClick, active }) => (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] transition-all whitespace-nowrap relative"
      style={{
        background: active ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)',
        border: `1px solid ${active ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.1)'}`,
        color: 'rgba(255,255,255,0.85)',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.13)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = active ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)'; }}
    >
      {children}
    </button>
  );

  const Dropdown = ({ options, selected, onSelect, onClose }) => {
    const ref = useRef(null);
    React.useEffect(() => {
      const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
      document.addEventListener('mousedown', fn);
      return () => document.removeEventListener('mousedown', fn);
    }, [onClose]);
    return (
      <div
        ref={ref}
        className="absolute z-50"
        style={{
          bottom: 'calc(100% + 8px)',
          left: 0,
          background: 'rgba(22,22,26,0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 12,
          boxShadow: '0 -8px 30px rgba(0,0,0,0.7)',
          minWidth: 120,
          overflow: 'hidden',
        }}
      >
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => { onSelect(opt); onClose(); }}
            className="w-full text-left px-4 py-2.5 text-sm transition-colors"
            style={{
              background: selected === opt ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: selected === opt ? '#fff' : 'rgba(255,255,255,0.6)',
            }}
            onMouseEnter={e => { if (selected !== opt) e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
            onMouseLeave={e => { if (selected !== opt) e.currentTarget.style.background = 'transparent'; }}
          >
            {opt}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(780px, 90vw)',
        background: 'rgba(18,18,22,0.75)',
        backdropFilter: 'blur(32px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(32px) saturate(1.6)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 20,
        padding: '14px 16px 12px 16px',
        boxShadow: '0 8px 48px rgba(0,0,0,0.65), 0 1px 0 rgba(255,255,255,0.05) inset',
        zIndex: 50,
      }}
    >
      {/* Top Row */}
      <div className="flex items-center gap-3 mb-3">
        {/* + Button */}
        <button
          className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 transition-all"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.13)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
        >
          <Plus className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.6)' }} />
        </button>

        {/* Prompt Input */}
        <input
          type="text"
          value={prompt}
          onChange={e => onPromptChange(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Describe the scene you imagine..."
          className="flex-1 bg-transparent outline-none text-white text-[15px] video-prompt-input"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        />

        {/* Generate Button */}
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 font-bold text-white transition-all flex-shrink-0"
          style={{
            background: isGenerating ? '#8B0000' : '#E01E1E',
            borderRadius: 10,
            padding: '10px 20px',
            fontSize: 14,
            opacity: isGenerating ? 0.8 : 1,
          }}
        >
          {isGenerating ? (
            <span className="animate-pulse">Generating...</span>
          ) : (
            <>Generate <span style={{ color: '#ffaaaa' }}>✦</span> 2</>
          )}
        </button>
      </div>

      {/* Bottom Chips Row */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Model Chip */}
        <div className="relative" ref={modelBtnRef}>
          <Chip onClick={() => { setShowModelDropdown(v => !v); setShowAspectDropdown(false); setShowQualityDropdown(false); }} active={showModelDropdown}>
            <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: '#E01E1E' }} />
            <span>{selectedModel.name}</span>
            <ChevronRight className="w-3 h-3" style={{ color: '#666' }} />
          </Chip>
          {showModelDropdown && (
            <ModelDropdown
              selectedModelId={selectedModel.id}
              onSelect={m => { onModelChange(m); setShowModelDropdown(false); }}
              onClose={() => setShowModelDropdown(false)}
            />
          )}
        </div>

        {/* Aspect Ratio */}
        <div className="relative">
          <Chip onClick={() => { setShowAspectDropdown(v => !v); setShowModelDropdown(false); setShowQualityDropdown(false); }} active={showAspectDropdown}>
            <span className="text-[11px]">□</span>
            {aspectRatio}
          </Chip>
          {showAspectDropdown && (
            <Dropdown
              options={ASPECT_RATIOS}
              selected={aspectRatio}
              onSelect={setAspectRatio}
              onClose={() => setShowAspectDropdown(false)}
            />
          )}
        </div>

        {/* Quality */}
        <div className="relative">
          <Chip onClick={() => { setShowQualityDropdown(v => !v); setShowModelDropdown(false); setShowAspectDropdown(false); }} active={showQualityDropdown}>
            <span style={{ color: '#E01E1E' }}>♡</span>
            {quality}
          </Chip>
          {showQualityDropdown && (
            <Dropdown
              options={QUALITIES}
              selected={quality}
              onSelect={setQuality}
              onClose={() => setShowQualityDropdown(false)}
            />
          )}
        </div>

        {/* Image Count */}
        <div
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[13px]"
          style={{ background: '#111', border: '1px solid #333', color: '#ccc' }}
        >
          <button
            onClick={() => onCountChange(Math.max(1, imageCount - 1))}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-6 text-center">{imageCount}/4</span>
          <button
            onClick={() => onCountChange(Math.min(4, imageCount + 1))}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* @ chip */}
        <Chip onClick={() => {}}>
          <AtSign className="w-3.5 h-3.5" />
        </Chip>

        {/* Enhance chip */}
        <Chip onClick={() => {}}>
          <Sparkles className="w-3.5 h-3.5" style={{ color: '#E01E1E' }} />
          Enhance
        </Chip>
      </div>
    </div>
  );
}