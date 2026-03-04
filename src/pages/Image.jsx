import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ModelSelector from '@/components/common/ModelSelector';
import GenerationCanvas from '@/components/common/GenerationCanvas';
import PromptBar from '@/components/common/PromptBar';
import TemplateModal from '@/components/common/TemplateModal';
import { imageModels, imageTemplates } from '@/components/data/siteData';
import { toast } from 'sonner';

const categories = ['All', 'Portrait', 'Cinematic', 'Product Ad', 'Fashion', 'Architecture', 'Art'];

export default function Image() {
  const navigate = useNavigate();
  const [selectedModel, setSelectedModel] = useState(imageModels[0]);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredTemplates = activeCategory === 'All' 
    ? imageTemplates 
    : imageTemplates.filter(t => t.category === activeCategory);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    setIsGenerating(true);
    setResult(null);
    
    // Simulate generation
    setTimeout(() => {
      setIsGenerating(false);
      setResult({ id: 1, prompt });
      toast.success('Image generated successfully!');
    }, 3000);
  };

  const handleRecreate = (template) => {
    setPrompt(template.prompt);
    setSelectedModel(imageModels.find(m => m.name === template.model) || imageModels[0]);
    setSelectedTemplate(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl sm:text-5xl tracking-wider text-white mb-2">
            IMAGE GENERATION
          </h1>
          <p className="text-foreground-secondary">
            Create stunning AI-powered images with our advanced models
          </p>
        </div>

        {/* Model Selector */}
        <div className="mb-6">
          <ModelSelector 
            models={imageModels} 
            selectedModel={selectedModel} 
            onSelect={setSelectedModel} 
          />
        </div>

        {/* Generation Canvas */}
        <GenerationCanvas 
          type="image"
          isGenerating={isGenerating}
          result={result}
          className="mb-6"
        />

        {/* Prompt Bar */}
        <PromptBar
          prompt={prompt}
          onPromptChange={setPrompt}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          model={selectedModel}
          type="image"
          className="mb-16"
        />

        {/* Templates Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl tracking-wider text-white mb-2">
              Browse Image Templates
            </h2>
            <p className="text-foreground-muted">
              Click to See Prompt & Recreate
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-white'
                    : 'bg-background-secondary text-foreground-secondary border border-border hover:border-primary/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                <div className="aspect-[4/5]" />
                
                {/* Tags */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs font-semibold bg-primary text-white rounded-full">
                    {template.model}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-black/60 text-white rounded-full backdrop-blur-sm">
                    {template.category}
                  </span>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white font-semibold text-lg">{template.title}</h3>
                  <p className="text-foreground-secondary text-sm mt-1 line-clamp-2">
                    Click to view prompt
                  </p>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Template Modal */}
      {selectedTemplate && (
        <TemplateModal
          template={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
          type="image"
          onRecreate={handleRecreate}
        />
      )}
    </div>
  );
}