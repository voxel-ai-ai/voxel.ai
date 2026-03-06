import React, { useState } from 'react';
import GenerationCanvas from '@/components/common/GenerationCanvas';
import VideoPromptBar from '@/components/video/VideoPromptBar';
import TemplateModal from '@/components/common/TemplateModal';
import TransitionCard from '@/components/common/TransitionCard';
import { videoModels, videoTemplates, transitions } from '@/components/data/siteData';
import { toast } from 'sonner';
import { 
  ZoomIn, ZoomOut, MoveHorizontal, MoveVertical, 
  Hand, Circle, Orbit
} from 'lucide-react';

const cameraControls = [
  { name: 'Zoom In', icon: ZoomIn },
  { name: 'Zoom Out', icon: ZoomOut },
  { name: 'Pan Left', icon: MoveHorizontal },
  { name: 'Pan Right', icon: MoveHorizontal },
  { name: 'Tilt Up', icon: MoveVertical },
  { name: 'Tilt Down', icon: MoveVertical },
  { name: 'Orbit', icon: Orbit },
  { name: 'Handheld', icon: Hand },
  { name: 'Static', icon: Circle },
];

const videoCategories = ['All', 'Action', 'Cinematic', 'Product Ad', 'Nature', 'Character'];
const transitionCategories = ['All', 'Cinematic', 'Elemental', 'Motion', 'Glitch', 'Smooth', '3D'];

export default function Video() {
  const [selectedModel, setSelectedModel] = useState(videoModels[0]);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [activeVideoCategory, setActiveVideoCategory] = useState('All');
  const [activeTransitionCategory, setActiveTransitionCategory] = useState('All');

  const filteredTemplates = activeVideoCategory === 'All'
    ? videoTemplates
    : videoTemplates.filter(t => t.category === activeVideoCategory);

  const filteredTransitions = activeTransitionCategory === 'All'
    ? transitions
    : transitions.filter(t => t.category === activeTransitionCategory);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    setIsGenerating(true);
    setResult(null);
    
    setTimeout(() => {
      setIsGenerating(false);
      setResult({ id: 1, prompt });
      toast.success('Video generated successfully!');
    }, 3000);
  };

  const handleRecreate = (template) => {
    setPrompt(template.prompt);
    setSelectedModel(videoModels.find(m => m.name === template.model) || videoModels[0]);
    setSelectedTemplate(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl sm:text-5xl tracking-wider text-white mb-2">
            VIDEO CREATION
          </h1>
          <p className="text-foreground-secondary">
            Create stunning AI-powered videos with cinematic quality
          </p>
        </div>

        {/* Generation Canvas */}
        <GenerationCanvas 
          type="video"
          isGenerating={isGenerating}
          result={result}
          className="mb-6"
        />

        {/* Camera Controls */}
        <div className="bg-background-secondary rounded-xl border border-border p-4 mb-6">
          <h3 className="text-sm font-semibold text-foreground-secondary mb-3">Camera Motion</h3>
          <div className="flex flex-wrap gap-2">
            {cameraControls.map((control) => (
              <button
                key={control.name}
                className="flex items-center gap-2 px-3 py-2 bg-background rounded-lg border border-border text-sm text-foreground-secondary hover:text-white hover:border-primary/50 transition-all"
              >
                <control.icon className="w-4 h-4" />
                {control.name}
              </button>
            ))}
          </div>
        </div>

        {/* Video Prompt Bar */}
        <VideoPromptBar
          prompt={prompt}
          onPromptChange={setPrompt}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        />

        {/* Video Templates Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl tracking-wider text-white mb-2">
              Video Templates
            </h2>
            <p className="text-foreground-muted">
              Click to view prompt and recreate
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {videoCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveVideoCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeVideoCategory === cat
                    ? 'bg-primary text-white'
                    : 'bg-background-secondary text-foreground-secondary border border-border hover:border-primary/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
            {filteredTemplates.map((template, index) => {
              const gradients = [
                'linear-gradient(135deg, #1a0000 0%, #8B0000 50%, #1a1a1a 100%)',
                'linear-gradient(135deg, #0a0a1a 0%, #1a0a2a 50%, #2a0a0a 100%)',
                'linear-gradient(135deg, #0d0d0d 0%, #2a0000 60%, #111 100%)',
                'linear-gradient(135deg, #1a1a0a 0%, #3a1a00 50%, #0a0a0a 100%)',
              ];
              return (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className="group relative rounded-xl overflow-hidden cursor-pointer border border-border hover:border-primary/50 hover:-translate-y-1 transition-all duration-300"
                style={{ background: gradients[index % 4] }}
              >
                <div className="aspect-video flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm">
                    <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1" />
                  </div>
                </div>
                
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs font-semibold bg-primary text-white rounded-full">
                    {template.model}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-black/60 text-white rounded-full backdrop-blur-sm">
                    {template.duration}
                  </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white font-semibold">{template.title}</h3>
                  <p className="text-foreground-secondary text-sm">{template.category}</p>
                </div>
              </div>
              );
            })}
          </div>
        </div>

        {/* Transitions Library */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl tracking-wider text-white mb-2">
              Video Transitions
            </h2>
            <p className="text-foreground-muted">
              Add cinematic transitions to your videos. Click any transition to preview and use it.
            </p>
          </div>

          {/* Transition Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {transitionCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTransitionCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTransitionCategory === cat
                    ? 'bg-primary text-white'
                    : 'bg-background-secondary text-foreground-secondary border border-border hover:border-primary/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Transitions Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredTransitions.map((transition) => (
              <TransitionCard key={transition.id} transition={transition} />
            ))}
          </div>
        </div>
      </div>

      {/* Template Modal */}
      {selectedTemplate && (
        <TemplateModal
          template={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
          type="video"
          onRecreate={handleRecreate}
        />
      )}
    </div>
  );
}