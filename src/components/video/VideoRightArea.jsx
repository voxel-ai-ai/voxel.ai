import React, { useState } from 'react';
import { ChevronDown, Star, Filter, Grid, Search, SlidersHorizontal, MessageSquare, Video, Music } from 'lucide-react';

const font = '"DM Sans", sans-serif';

export default function VideoRightArea({ videos = [] }) {
  const [activeTab, setActiveTab] = useState('creations');

  return (
    <div style={{ marginLeft:450, height:'calc(100vh - 60px)', overflowY:'auto', background:'#0D0D0D', borderLeft:'1px solid #1E1E1E', display:'flex', flexDirection:'column' }}>
      {/* Tabs row */}
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'14px 20px', borderBottom:'1px solid #1E1E1E', position:'sticky', top:0, background:'#0D0D0D', zIndex:5 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, flex:1 }}>
          {[{ id:'creations', label:'Creations', icon:'🎬', arrow:true }, { id:'collections', label:'Collections', icon:'📁' }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              display:'flex', alignItems:'center', gap:6, padding:'7px 16px', borderRadius:999,
              fontSize:13, fontFamily:font, cursor:'pointer', transition:'all 0.18s',
              background: activeTab===tab.id ? 'rgba(255,255,255,0.08)' : 'transparent',
              border: activeTab===tab.id ? '1px solid rgba(255,255,255,0.12)' : '1px solid transparent',
              color: activeTab===tab.id ? '#fff' : 'rgba(255,255,255,0.4)',
              fontWeight: activeTab===tab.id ? 600 : 400,
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
        <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12, minHeight:500, background:'transparent' }}>
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
            <rect x="6" y="18" width="60" height="42" rx="5" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.09)" strokeWidth="1.5"/>
            <rect x="6" y="18" width="60" height="10" rx="3" fill="rgba(255,255,255,0.08)"/>
            <line x1="14" y1="18" x2="10" y2="10" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeLinecap="round"/>
            <line x1="26" y1="18" x2="22" y2="10" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeLinecap="round"/>
            <line x1="38" y1="18" x2="34" y2="10" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeLinecap="round"/>
            <line x1="50" y1="18" x2="46" y2="10" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeLinecap="round"/>
            <line x1="62" y1="18" x2="58" y2="10" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="36" cy="43" r="10" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
            <polygon points="33,38 33,48 43,43" fill="rgba(255,255,255,0.15)"/>
          </svg>
          <p style={{ fontSize:14, color:'rgba(255,255,255,0.25)', fontFamily:font }}>No items to display</p>
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