import React, { useState } from 'react';
import { ChevronDown, Star, Filter, Grid, Search, SlidersHorizontal, MessageSquare, Video, Music } from 'lucide-react';
import { videoTemplates, transitions } from '@/components/data/siteData';
import TransitionCard from '@/components/common/TransitionCard';
import TemplateModal from '@/components/common/TemplateModal';

const font = '"DM Sans", sans-serif';

const videoCategories = ['All', 'Action', 'Cinematic', 'Product Ad', 'Nature', 'Character'];
const transitionCategories = ['All', 'Cinematic', 'Elemental', 'Motion', 'Glitch', 'Smooth', '3D'];

export default function VideoRightArea({ videos = [], onRecreate }) {
  const [activeTab, setActiveTab] = useState('creations');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [activeVideoCategory, setActiveVideoCategory] = useState('All');
  const [activeTransitionCategory, setActiveTransitionCategory] = useState('All');

  const filteredTemplates = activeVideoCategory === 'All' ? videoTemplates : videoTemplates.filter(t => t.category === activeVideoCategory);
  const filteredTransitions = activeTransitionCategory === 'All' ? transitions : transitions.filter(t => t.category === activeTransitionCategory);

  return (
    <div style={{ marginLeft:450, height:'calc(100vh - 60px)', overflowY:'auto', background:'#0A0A0A', display:'flex', flexDirection:'column' }}>
      {/* Tabs row */}
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'14px 20px', borderBottom:'1px solid #1E1E1E', position:'sticky', top:0, background:'#0A0A0A', zIndex:5 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, flex:1 }}>
          {[{ id:'creations', label:'Creations', icon:'🎬', arrow:true }, { id:'collections', label:'Collections', icon:'📁' }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              display:'flex', alignItems:'center', gap:6, padding:'7px 16px', borderRadius:999,
              fontSize:13, fontFamily:font, cursor:'pointer', transition:'all 0.18s', border:'none',
              background: activeTab===tab.id ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: activeTab===tab.id ? '#fff' : 'rgba(255,255,255,0.45)',
              fontWeight: activeTab===tab.id ? 600 : 400,
              outline: activeTab===tab.id ? '1px solid rgba(255,255,255,0.15)' : 'none',
            }}>
              <span>{tab.icon}</span>{tab.label}
              {tab.arrow && <ChevronDown className="w-3 h-3" />}
            </button>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:4 }}>
          {[SlidersHorizontal, MessageSquare, Video, Music].map((Icon, i) => (
            <button key={i} style={{ width:30, height:30, background:'transparent', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:6 }}
              onMouseEnter={e => e.currentTarget.style.color='rgba(255,255,255,0.7)'}
              onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.3)'}
            ><Icon className="w-4 h-4" /></button>
          ))}
          <button style={{ padding:'5px 12px', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:999, fontSize:12, color:'#fff', fontWeight:600, fontFamily:font, cursor:'pointer' }}>All</button>
          {[Star, Filter, Grid, Search].map((Icon, i) => (
            <button key={i} style={{ width:30, height:30, background:'transparent', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:6 }}
              onMouseEnter={e => e.currentTarget.style.color='rgba(255,255,255,0.7)'}
              onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.3)'}
            ><Icon className="w-4 h-4" /></button>
          ))}
        </div>
      </div>

      {/* Creations area */}
      {videos.length === 0 ? (
        <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:14, minHeight:300 }}>
          <div style={{ fontSize:80, opacity:0.55 }}>📁</div>
          <p style={{ fontSize:14, color:'rgba(255,255,255,0.3)', fontFamily:font }}>No items to display</p>
        </div>
      ) : (
        <div style={{ padding:20, display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:12 }}>
          {videos.map((v, i) => (
            <div key={i} style={{ background:'#161616', borderRadius:12, border:'1px solid #1E1E1E', aspectRatio:'16/9', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ color:'rgba(255,255,255,0.3)', fontSize:32 }}>▶</span>
            </div>
          ))}
        </div>
      )}

      {/* Video Templates */}
      <div style={{ padding:'32px 20px 0' }}>
        <h2 style={{ fontSize:20, fontWeight:700, color:'#fff', fontFamily:font, marginBottom:6 }}>Video Templates</h2>
        <p style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontFamily:font, marginBottom:16 }}>Click to view prompt and recreate</p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:16 }}>
          {videoCategories.map(cat => (
            <button key={cat} onClick={() => setActiveVideoCategory(cat)} style={{
              padding:'6px 14px', borderRadius:999, fontSize:12, fontFamily:font, cursor:'pointer', border:'none', transition:'all 0.18s',
              background: activeVideoCategory===cat ? '#E01E1E' : '#1A1A1A',
              color: activeVideoCategory===cat ? '#fff' : 'rgba(255,255,255,0.55)',
              outline: activeVideoCategory!==cat ? '1px solid #2A2A2A' : 'none',
            }}>{cat}</button>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px,1fr))', gap:12, marginBottom:32 }}>
          {filteredTemplates.map((template, index) => {
            const gradients = [
              'linear-gradient(135deg,#1a0000,#8B0000,#1a1a1a)',
              'linear-gradient(135deg,#0a0a1a,#1a0a2a,#2a0a0a)',
              'linear-gradient(135deg,#0d0d0d,#2a0000,#111)',
              'linear-gradient(135deg,#1a1a0a,#3a1a00,#0a0a0a)',
            ];
            return (
              <div key={template.id} onClick={() => setSelectedTemplate(template)} className="group" style={{ position:'relative', borderRadius:12, overflow:'hidden', cursor:'pointer', border:'1px solid #2A2A2A', background: gradients[index%4], transition:'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(224,30,30,0.5)'; e.currentTarget.style.transform='translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='#2A2A2A'; e.currentTarget.style.transform='none'; }}
              >
                <div style={{ aspectRatio:'16/9', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <div style={{ width:40, height:40, borderRadius:'50%', background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <div style={{ width:0, height:0, borderLeft:'10px solid #fff', borderTop:'7px solid transparent', borderBottom:'7px solid transparent', marginLeft:3 }} />
                  </div>
                </div>
                <div style={{ position:'absolute', top:8, left:8 }}>
                  <span style={{ padding:'2px 8px', background:'#E01E1E', color:'#fff', fontSize:10, fontWeight:700, borderRadius:4, fontFamily:font }}>{template.model}</span>
                </div>
                <div style={{ padding:'10px 12px', background:'rgba(0,0,0,0.6)' }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'#fff', fontFamily:font }}>{template.title}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontFamily:font }}>{template.category}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Transitions */}
      <div style={{ padding:'0 20px 40px' }}>
        <h2 style={{ fontSize:20, fontWeight:700, color:'#fff', fontFamily:font, marginBottom:6 }}>Video Transitions</h2>
        <p style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontFamily:font, marginBottom:16 }}>Add cinematic transitions to your videos</p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:16 }}>
          {transitionCategories.map(cat => (
            <button key={cat} onClick={() => setActiveTransitionCategory(cat)} style={{
              padding:'6px 14px', borderRadius:999, fontSize:12, fontFamily:font, cursor:'pointer', border:'none', transition:'all 0.18s',
              background: activeTransitionCategory===cat ? '#E01E1E' : '#1A1A1A',
              color: activeTransitionCategory===cat ? '#fff' : 'rgba(255,255,255,0.55)',
              outline: activeTransitionCategory!==cat ? '1px solid #2A2A2A' : 'none',
            }}>{cat}</button>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px,1fr))', gap:12 }}>
          {filteredTransitions.map(transition => (
            <TransitionCard key={transition.id} transition={transition} />
          ))}
        </div>
      </div>

      {selectedTemplate && (
        <TemplateModal template={selectedTemplate} onClose={() => setSelectedTemplate(null)} type="video" onRecreate={t => { onRecreate && onRecreate(t); setSelectedTemplate(null); }} />
      )}
    </div>
  );
}