import React, { useState } from 'react';
import VideoLeftPanel from '@/components/video/VideoLeftPanel';
import VideoRightArea from '@/components/video/VideoRightArea';
import VideoModelModal from '@/components/video/VideoModelModal';
import VideoDetailModal from '@/components/video/VideoDetailModal';
import { toast } from 'sonner';

const DEFAULT_MODEL = { id: 'kling-2-6', name: 'Kling 2.6', brand: 'Kling', color: '#1B7FE4' };

export default function Video() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [count, setCount] = useState(1);
  const [videos, setVideos] = useState([]);
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [duration, setDuration] = useState('5s');
  const [resolution, setResolution] = useState('1080p');
  const [ratio, setRatio] = useState('16:9');
  const [showModelModal, setShowModelModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setVideos(prev => [...prev, { id: Date.now(), prompt, model: model.name, duration, resolution }]);
      toast.success('Video generated!');
    }, 3000);
  };

  return (
    <div style={{ position: 'relative', background: '#0A0A0A', minHeight: 'calc(100vh - 60px)' }}>
      <VideoLeftPanel
        prompt={prompt}
        onPromptChange={setPrompt}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        count={count}
        onCountChange={setCount}
        model={model}
        onModelClick={() => setShowModelModal(true)}
        duration={duration}
        onDurationChange={setDuration}
        resolution={resolution}
        onResolutionChange={setResolution}
      />
      <VideoRightArea
        videos={videos}
        isGenerating={isGenerating}
        durationMs={3000}
        onRecreate={(t) => setPrompt(t.prompt)}
        onVideoClick={(v) => setSelectedVideo(v)}
      />
      {showModelModal && (
        <VideoModelModal
          selectedId={model.id}
          onSelect={(m) => setModel(m)}
          onClose={() => setShowModelModal(false)}
        />
      )}
      {selectedVideo && (
        <VideoDetailModal
          video={selectedVideo}
          videos={videos}
          onClose={() => setSelectedVideo(null)}
          onNavigate={setSelectedVideo}
        />
      )}
    </div>
  );
}