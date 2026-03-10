import React, { useState } from 'react';
import { ChevronDown, Star, Filter, Grid, Search, SlidersHorizontal, MessageSquare, Video, Music } from 'lucide-react';

const font = '"DM Sans", sans-serif';

export default function VideoRightArea({ videos = [] }) {
  const [activeTab, setActiveTab] = useState('creations');

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
        <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:14, minHeight:400, background:'transparent' }}>
          <svg width="90" height="90" viewBox="0 0 90 90" fill="none" style={{ opacity:0.45, filter:'grayscale(1) brightness(0.55)' }}>
            <rect x="8" y="22" width="74" height="52" rx="6" fill="#444"/>
            <rect x="8" y="22" width="74" height="12" rx="3" fill="#555"/>
            {[0,1,2,3,4,5].map(i => (
              <rect key={i} x={16 + i*12} y="20" width="6" height="16" rx="2" fill="#333" transform={`rotate(-8 ${19+i*12} 28)`}/>
            ))}
            <circle cx="45" cy="52" r="13" fill="#333"/>
            <polygon points="41,46 41,58 54,52" fill="#555"/>
          </svg>
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
    </div>
  );
}