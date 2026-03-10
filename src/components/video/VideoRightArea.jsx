import React, { useState } from 'react';
import { ChevronDown, Star, Filter, Grid, Search, SlidersHorizontal, MessageSquare, Video, Music } from 'lucide-react';

export default function VideoRightArea({ videos = [] }) {
  const [activeTab, setActiveTab] = useState('creations'); // 'creations' | 'collections'

  return (
    <div style={{
      flex:1, height:'calc(100vh - 60px)', overflowY:'auto',
      background:'#0A0A0A', display:'flex', flexDirection:'column',
    }}>
      {/* Tabs row */}
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'14px 20px', borderBottom:'1px solid #1E1E1E', flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, flex:1, flexWrap:'wrap' }}>
          {[
            { id:'creations', label:'Creations', icon:'🎬', arrow:true },
            { id:'collections', label:'Collections', icon:'📁' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                display:'flex', alignItems:'center', gap:6, padding:'7px 16px',
                borderRadius:999, fontSize:13, fontFamily:'"DM Sans",sans-serif',
                cursor:'pointer', transition:'all 0.18s',
                background: activeTab===tab.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: activeTab===tab.id ? '#fff' : 'rgba(255,255,255,0.45)',
                fontWeight: activeTab===tab.id ? 600 : 400,
                border: activeTab===tab.id ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent',
              }}
              onMouseEnter={e => { if (activeTab!==tab.id) e.currentTarget.style.color='#fff'; }}
              onMouseLeave={e => { if (activeTab!==tab.id) e.currentTarget.style.color='rgba(255,255,255,0.45)'; }}
            >
              <span>{tab.icon}</span>
              {tab.label}
              {tab.arrow && <ChevronDown className="w-3 h-3" />}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          {[SlidersHorizontal, MessageSquare, Video, Music].map((Icon, i) => (
            <button key={i} style={{ width:30, height:30, background:'transparent', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.35)', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:7, transition:'all 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color='rgba(255,255,255,0.7)'}
              onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.35)'}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
          <button style={{ padding:'5px 12px', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:999, fontSize:12, color:'#fff', fontWeight:600, fontFamily:'"DM Sans",sans-serif', cursor:'pointer' }}>
            All
          </button>
          {[Star, Filter, Grid, Search].map((Icon, i) => (
            <button key={i} style={{ width:30, height:30, background:'transparent', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.35)', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:7, transition:'all 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color='rgba(255,255,255,0.7)'}
              onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.35)'}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {videos.length === 0 ? (
        <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:14 }}>
          <div style={{ fontSize:80, opacity:0.4 }}>🎬</div>
          <p style={{ fontSize:14, color:'rgba(255,255,255,0.35)', fontFamily:'"DM Sans",sans-serif' }}>No items to display</p>
        </div>
      ) : (
        <div style={{ padding:20, display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:12 }}>
          {videos.map((v, i) => (
            <div key={i} style={{ background:'#161616', borderRadius:12, overflow:'hidden', border:'1px solid #1E1E1E', aspectRatio:'16/9', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <div style={{ color:'rgba(255,255,255,0.3)', fontSize:32 }}>▶</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}