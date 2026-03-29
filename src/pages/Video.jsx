import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import VideoLeftPanel from '@/components/video/VideoLeftPanel';
const History_ = base44.entities.GenerationHistory;
import VideoRightArea from '@/components/video/VideoRightArea';
import VideoModelModal from '@/components/video/VideoModelModal';
import VideoDetailModal from '@/components/video/VideoDetailModal';
import { toast } from 'sonner';

const DEFAULT_MODEL = { id: 'kling-2-6', name: 'Kling 2.6', brand: 'Kling', color: '#1B7FE4' };
const SEEDANCE_2 = { id: 'seedance-2', name: 'Seedance 2.0', brand: 'Seedance', color: '#0D9488' };

export default function Video() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [count, setCount] = useState(1);
  const [videos, setVideos] = useState([]);
  const [model, setModel] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('model') === 'seedance-2' ? SEEDANCE_2 : DEFAULT_MODEL;
  });
  const [duration, setDuration] = useState('5s');
  const [resolution, setResolution] = useState('1080p');
  const [aspectRatio, setAspectRatio] = useState('Auto');
  const [showModelModal, setShowModelModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const pollingRef = useRef({});

  // Load history on mount
  useEffect(() => {
    History_.filter({ type: 'video' }, '-created_date', 50).then(records => {
      const loaded = records.map(r => ({
        id: r.id,
        prompt: r.prompt,
        model: r.model,
        duration: r.duration,
        aspectRatio: r.ratio,
        result_url: r.result_url,
        status: r.status,
        job_id: r.job_id,
        model_id: r.model_id,
      }));
      setVideos(loaded);
      // Resume polling for any pending videos
      loaded.filter(v => v.status === 'pending').forEach(v => pollVideo(v.id, v.job_id, v.model_id));
    }).catch(() => {});
  }, []);

  const pollVideo = (recordId, jobId, modelId) => {
    const interval = setInterval(async () => {
      try {
        const res = await base44.functions.invoke('checkStatus', { job_id: jobId, model_id: modelId });
        const d = res.data;
        if (d.status === 'completed' && d.result_url) {
          clearInterval(interval);
          delete pollingRef.current[recordId];
          await History_.update(recordId, { status: 'completed', result_url: d.result_url });
          setVideos(prev => prev.map(v => v.id === recordId ? { ...v, status: 'completed', result_url: d.result_url } : v));
          toast.success('Video ready!');
        } else if (d.status === 'failed') {
          clearInterval(interval);
          delete pollingRef.current[recordId];
          await History_.update(recordId, { status: 'failed' });
          setVideos(prev => prev.map(v => v.id === recordId ? { ...v, status: 'failed' } : v));
          toast.error('Video generation failed');
        }
      } catch {}
    }, 5000);
    pollingRef.current[recordId] = interval;
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) { toast.error('Please enter a prompt'); return; }
    setIsGenerating(true);
    try {
      const res = await base44.functions.invoke('generate', {
        type: 'video',
        model: model.name,
        prompt,
        duration: parseInt(duration) || 5,
        ratio: aspectRatio === 'Auto' ? '16:9' : aspectRatio,
      });
      const { job_id, model_id } = res.data;
      const saved = await History_.create({
        type: 'video', model: model.name, prompt,
        job_id, model_id, status: 'pending',
        duration: parseInt(duration) || 5,
        ratio: aspectRatio,
      });
      const newVid = { id: saved.id, prompt, model: model.name, duration, aspectRatio, status: 'pending', job_id, model_id };
      setVideos(prev => [newVid, ...prev]);
      pollVideo(saved.id, job_id, model_id);
      toast.success('Video queued — we\'ll notify you when ready!');
    } catch (err) {
      toast.error(err.message || 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
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
        aspectRatio={aspectRatio}
        onAspectRatioChange={setAspectRatio}
      />
      <VideoRightArea
        videos={videos}
        isGenerating={isGenerating}
        durationMs={3000}
        aspectRatio={aspectRatio}
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