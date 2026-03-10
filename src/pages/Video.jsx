import React, { useState } from 'react';
import VideoLeftPanel from '@/components/video/VideoLeftPanel';
import VideoRightArea from '@/components/video/VideoRightArea';
import { toast } from 'sonner';

export default function Video() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [count, setCount] = useState(1);
  const [videos, setVideos] = useState([]);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setVideos(prev => [...prev, { id: Date.now(), prompt }]);
      toast.success('Video generated!');
    }, 3000);
  };

  return (
    <div style={{
      display: 'flex',
      height: 'calc(100vh - 60px)',
      background: '#0A0A0A',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <VideoLeftPanel
        prompt={prompt}
        onPromptChange={setPrompt}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        count={count}
        onCountChange={setCount}
      />
      <VideoRightArea videos={videos} />
    </div>
  );
}