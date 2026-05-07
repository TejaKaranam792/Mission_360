// Premium Analytics Hub
import { motion } from 'framer-motion';
import { format, eachDayOfInterval, subDays } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, CartesianGrid, LineChart, Line } from 'recharts';

const ChartTip = ({ active, payload, label }) => {
  if (!active||!payload?.length) return null;
  return (
    <div style={{ background:'#0D1321', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:'10px 14px' }}>
      <div style={{ fontSize:11, color:'#64748B', marginBottom:4 }}>{label}</div>
      {payload.map(p=><div key={p.name} style={{ color:p.color, fontWeight:700, fontSize:13 }}>{p.name}: {p.value}</div>)}
    </div>
  );
};

export default function Analytics({ data }) {
  const totalHrs = data.weeklyData.reduce((a,d)=>a+d.hours,0);
  const avgHrs = (totalHrs/7).toFixed(1);
  const best = data.mockTests.length ? Math.max(...data.mockTests.map(m=>m.score)) : 0;
  const avg = data.mockTests.length ? Math.round(data.mockTests.reduce((a,m)=>a+m.score,0)/data.mockTests.length) : 0;

  const mistakeCounts = ['Quant','English','Reasoning','GA'].map(s=>({ subject:s, mistakes:data.mistakes.filter(m=>m.category===s).length }));
  const weakest = [...mistakeCounts].sort((a,b)=>b.mistakes-a.mistakes)[0];

  const weakSection = { Quant:0, Reasoning:0, English:0, GA:0 };
  data.mockTests.forEach(m=>m.weakSections?.forEach(s=>{ if(weakSection[s]!==undefined) weakSection[s]++; }));
  const radar = Object.entries(weakSection).map(([subject,v])=>({ subject, strength: Math.max(1, 10-v*2) }));

  const heatDays = eachDayOfInterval({ start:subDays(new Date(),48), end:new Date() });

  const mockSorted = [...data.mockTests].sort((a,b)=>new Date(a.date)-new Date(b.date)).slice(-10);

  return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:'Space Grotesk', fontWeight:800, fontSize:28 }}>Analytics <span className="grad-blue">Hub</span></h1>
        <p style={{ fontSize:13, color:'#475569', marginTop:4 }}>Understand your patterns. Close every gap.</p>
      </div>

      {/* Summary row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:14, marginBottom:24 }}>
        {[
          { label:'Weekly Hours', value:`${totalHrs}h`, color:'#3B82F6' },
          { label:'Daily Avg', value:`${avgHrs}h`, color:'#22D3EE' },
          { label:'Best Mock', value:`${best||'—'}/200`, color:'#10B981' },
          { label:'Mock Average', value:`${avg||'—'}`, color:'#F97316' },
          { label:'Streak', value:`${data.streak}d`, color:'#8B5CF6' },
        ].map((s,i)=>(
          <motion.div key={s.label} className="card" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
            whileHover={{ y:-3 }} style={{ padding:'16px 20px', textAlign:'center' }}>
            <div style={{ fontFamily:'Space Grotesk', fontWeight:800, fontSize:24, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:11, color:'#475569', marginTop:4 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:18, marginBottom:20 }}>
        {/* Weekly hours */}
        <div className="card" style={{ padding:'20px 24px' }}>
          <h2 style={{ fontFamily:'Space Grotesk', fontWeight:700, fontSize:15, color:'#E2E8F0', marginBottom:14 }}>Study Hours — This Week</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data.weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="day" tick={{ fill:'#475569', fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#475569', fontSize:11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="hours" name="Hours" fill="#3B82F6" radius={[6,6,0,0]} style={{ filter:'drop-shadow(0 0 4px rgba(59,130,246,0.3))' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar */}
        <div className="card" style={{ padding:'20px 24px' }}>
          <h2 style={{ fontFamily:'Space Grotesk', fontWeight:700, fontSize:15, color:'#E2E8F0', marginBottom:14 }}>Subject Strength Radar</h2>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={radar} outerRadius="70%">
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill:'#64748B', fontSize:11 }} />
              <Radar dataKey="strength" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.18} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mock trend */}
      {mockSorted.length > 0 && (
        <div className="card" style={{ padding:'20px 24px', marginBottom:20 }}>
          <h2 style={{ fontFamily:'Space Grotesk', fontWeight:700, fontSize:15, color:'#E2E8F0', marginBottom:14 }}>Mock Score Trend</h2>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={mockSorted.map(m=>({ date:m.date, score:m.score }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="date" tick={{ fill:'#475569', fontSize:10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0,200]} tick={{ fill:'#475569', fontSize:11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Line type="monotone" dataKey="score" name="Score" stroke="#22D3EE" strokeWidth={2.5} dot={{ fill:'#22D3EE', r:4, strokeWidth:0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Heatmap */}
      <div className="card" style={{ padding:'20px 24px', marginBottom:20 }}>
        <h2 style={{ fontFamily:'Space Grotesk', fontWeight:700, fontSize:15, color:'#E2E8F0', marginBottom:14 }}>Activity Heatmap — Last 7 Weeks</h2>
        <div style={{ overflowX:'auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4, minWidth:320 }}>
            {['M','T','W','T','F','S','S'].map((d,i)=>(
              <div key={i} style={{ textAlign:'center', fontSize:9, color:'#334155', marginBottom:2 }}>{d}</div>
            ))}
            {heatDays.map((d,i)=>{
              const k = format(d,'yyyy-MM-dd');
              const val = data.heatmap?.[k]||0;
              const op = Math.min(val/9,1);
              return (
                <motion.div key={i} className="hm-cell" title={`${k}: ${val} tasks`}
                  initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.003 }}
                  style={{
                    background: val>0 ? `rgba(59,130,246,${0.15+op*0.85})` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${val>0?'rgba(59,130,246,0.2)':'rgba(255,255,255,0.04)'}`,
                    boxShadow: val>0 ? `0 0 6px rgba(59,130,246,${op*0.4})` : 'none',
                  }}
                />
              );
            })}
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:10, justifyContent:'flex-end' }}>
          <span style={{ fontSize:11, color:'#334155' }}>Less</span>
          {[0.1,0.3,0.5,0.7,1].map(op=>(
            <div key={op} style={{ width:12, height:12, borderRadius:3, background:`rgba(59,130,246,${op})` }} />
          ))}
          <span style={{ fontSize:11, color:'#334155' }}>More</span>
        </div>
      </div>

      {/* Insights */}
      <div className="card" style={{ padding:'20px 24px' }}>
        <h2 style={{ fontFamily:'Space Grotesk', fontWeight:700, fontSize:15, color:'#E2E8F0', marginBottom:14 }}>🧠 Smart Insights</h2>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {weakest?.mistakes>0&&(
            <div style={{ padding:'14px 16px', borderRadius:12, background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.12)' }}>
              <div style={{ fontSize:13, fontWeight:600, color:'#F87171', marginBottom:4 }}>⚠ Focus on {weakest.subject}</div>
              <div style={{ fontSize:12, color:'#64748B' }}>{weakest.mistakes} recorded mistakes. Dedicate extra time this week.</div>
            </div>
          )}
          {data.streak>=5&&(
            <div style={{ padding:'14px 16px', borderRadius:12, background:'rgba(16,185,129,0.06)', border:'1px solid rgba(16,185,129,0.12)' }}>
              <div style={{ fontSize:13, fontWeight:600, color:'#34D399', marginBottom:4 }}>🔥 {data.streak}-day streak! You're locked in.</div>
              <div style={{ fontSize:12, color:'#64748B' }}>Consistency is your biggest weapon. Don't break the chain.</div>
            </div>
          )}
          {best>=160&&(
            <div style={{ padding:'14px 16px', borderRadius:12, background:'rgba(59,130,246,0.06)', border:'1px solid rgba(59,130,246,0.12)' }}>
              <div style={{ fontSize:13, fontWeight:600, color:'#60A5FA', marginBottom:4 }}>🎯 You've crossed 160 in mock tests!</div>
              <div style={{ fontSize:12, color:'#64748B' }}>You're in the zone. Focus on accuracy and consistency now.</div>
            </div>
          )}
          <div style={{ padding:'14px 16px', borderRadius:12, background:'rgba(139,92,246,0.06)', border:'1px solid rgba(139,92,246,0.12)' }}>
            <div style={{ fontSize:13, fontWeight:600, color:'#A78BFA', marginBottom:4 }}>💡 Target Breakdown</div>
            <div style={{ fontSize:12, color:'#64748B' }}>Quant 45+ · Reasoning 40+ · English 40+ · GA 35+ = 160</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
