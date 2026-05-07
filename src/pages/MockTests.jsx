// Premium Mock Tests page
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Trophy, Target, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';

const SUBS = ['Quant','Reasoning','English','GA'];
const defForm = { date: new Date().toISOString().split('T')[0], score:'', accuracy:'', wrong:'', timeTaken:'', weakSections:[], notes:'' };

const ChartTip = ({ active, payload, label }) => {
  if (!active||!payload?.length) return null;
  return (
    <div style={{ background:'#0D1321', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:'10px 14px' }}>
      <div style={{ fontSize:11, color:'#64748B', marginBottom:4 }}>{label}</div>
      {payload.map(p=><div key={p.name} style={{ color:p.color, fontWeight:700, fontSize:13 }}>{p.name}: {p.value}</div>)}
    </div>
  );
};

function ScoreTag({ score }) {
  if (score>=160) return <span className="badge badge-green">🎯 Target Hit</span>;
  if (score>=130) return <span className="badge badge-orange">📈 Improving</span>;
  return <span className="badge badge-red">📉 Needs Work</span>;
}

export default function MockTests({ data, addMockTest, deleteMockTest }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defForm);

  const sorted = [...data.mockTests].sort((a,b)=>new Date(a.date)-new Date(b.date));
  const chartData = sorted.map(m=>({ name:m.date, Score:m.score, Accuracy:m.accuracy }));
  const best = data.mockTests.length ? Math.max(...data.mockTests.map(m=>m.score)) : 0;
  const avg = data.mockTests.length ? Math.round(data.mockTests.reduce((a,m)=>a+m.score,0)/data.mockTests.length) : 0;

  const handleSubmit = e => {
    e.preventDefault();
    addMockTest({...form, score:+form.score, accuracy:+form.accuracy, wrong:+form.wrong});
    setForm(defForm); setShowForm(false);
  };

  return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontFamily:'Space Grotesk', fontWeight:800, fontSize:28 }}>Mock Test <span className="grad-orange">Tracker</span></h1>
          <p style={{ fontSize:13, color:'#475569', marginTop:4 }}>Every test is a lesson. Chart your rise.</p>
        </div>
        <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }} className="btn btn-primary" onClick={()=>setShowForm(true)}>
          <Plus size={15} /> Add Test
        </motion.button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:20 }}>
        {[
          { label:'Best Score', value:best||'—', sub:'/200', color:'#10B981', icon:Trophy },
          { label:'Average', value:avg||'—', sub:'/200', color:'#3B82F6', icon:Target },
          { label:'Tests Done', value:data.mockTests.length, sub:'total', color:'#F97316', icon:TrendingUp },
        ].map(s=>(
          <motion.div key={s.label} className="card" whileHover={{ y:-3 }} style={{ padding:'16px 20px', textAlign:'center' }}>
            <s.icon size={18} style={{ color:s.color, margin:'0 auto 8px' }} />
            <div style={{ fontFamily:'Space Grotesk', fontWeight:800, fontSize:26, color:s.color }}>
              {s.value}<span style={{ fontSize:14, color:'#1E293B', fontWeight:400 }}>{s.sub}</span>
            </div>
            <div style={{ fontSize:11, color:'#475569', marginTop:4 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="card" style={{ padding:'20px 24px', marginBottom:20 }}>
          <h2 style={{ fontFamily:'Space Grotesk', fontWeight:700, fontSize:16, color:'#E2E8F0', marginBottom:16 }}>Score Progression</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="name" tick={{ fill:'#475569', fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0,200]} tick={{ fill:'#475569', fontSize:11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <ReferenceLine y={160} stroke="#F97316" strokeDasharray="5 4" strokeWidth={1.5}
                label={{ value:'160 Target', fill:'#F97316', fontSize:11, position:'right' }} />
              <Line type="monotone" dataKey="Score" stroke="#3B82F6" strokeWidth={2.5} dot={{ fill:'#3B82F6', r:4, strokeWidth:0 }} />
              <Line type="monotone" dataKey="Accuracy" stroke="#22D3EE" strokeWidth={1.5} strokeDasharray="4 3" dot={{ fill:'#22D3EE', r:3, strokeWidth:0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Tests list */}
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        <AnimatePresence>
          {data.mockTests.map((m,i)=>(
            <motion.div key={m.id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, x:20 }} transition={{ delay:i*0.04 }}
              className="card" style={{ padding:'18px 22px' }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:16 }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10, flexWrap:'wrap' }}>
                    <span style={{ fontSize:12, color:'#475569' }}>{m.date}</span>
                    <ScoreTag score={m.score} />
                    {m.weakSections?.map(s=>(
                      <span key={s} className="badge badge-red" style={{ fontSize:10 }}>⚠ {s}</span>
                    ))}
                  </div>
                  <div style={{ display:'flex', alignItems:'baseline', gap:16, flexWrap:'wrap', marginBottom:10 }}>
                    <div className="grad-blue" style={{ fontFamily:'Space Grotesk', fontWeight:800, fontSize:36, lineHeight:1 }}>
                      {m.score}<span style={{ fontSize:16, color:'#1E293B', fontWeight:400 }}>/200</span>
                    </div>
                    <div style={{ fontSize:13, color:'#64748B', display:'flex', gap:16 }}>
                      <span>Accuracy: <strong style={{ color:'#CBD5E1' }}>{m.accuracy}%</strong></span>
                      <span>Wrong: <strong style={{ color:'#F87171' }}>{m.wrong}</strong></span>
                      {m.timeTaken&&<span>Time: <strong style={{ color:'#CBD5E1' }}>{m.timeTaken}</strong></span>}
                    </div>
                  </div>
                  <div className="pbar">
                    <motion.div animate={{ width:`${(m.score/200)*100}%` }} transition={{ duration:1 }}
                      style={{ height:'100%', borderRadius:99,
                        background: m.score>=160 ? 'linear-gradient(90deg,#10B981,#34D399)' : m.score>=130 ? 'linear-gradient(90deg,#F97316,#FB923C)' : 'linear-gradient(90deg,#EF4444,#F87171)' }} />
                  </div>
                  {m.notes&&<div style={{ fontSize:12, color:'#334155', marginTop:10, fontStyle:'italic' }}>"{m.notes}"</div>}
                </div>
                <motion.button whileTap={{ scale:0.9 }} className="btn btn-danger" style={{ padding:'8px 10px', flexShrink:0 }} onClick={()=>deleteMockTest(m.id)}>
                  <Trash2 size={14} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {data.mockTests.length===0&&(
          <div className="card" style={{ padding:60, textAlign:'center' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>📊</div>
            <div style={{ fontWeight:600, color:'#475569' }}>No mock tests recorded yet</div>
            <div style={{ fontSize:13, color:'#334155', marginTop:6 }}>Add your first test to start tracking your rise</div>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showForm&&(
          <div className="modal-overlay" onClick={()=>setShowForm(false)}>
            <motion.div className="modal-box" initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.9, opacity:0 }} onClick={e=>e.stopPropagation()}>
              <h2 style={{ fontFamily:'Space Grotesk', fontWeight:800, fontSize:22, marginBottom:24 }}>Add Mock Test</h2>
              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <div><label style={{ fontSize:12, color:'#475569', display:'block', marginBottom:6 }}>Date</label>
                    <input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} required /></div>
                  <div><label style={{ fontSize:12, color:'#475569', display:'block', marginBottom:6 }}>Score (/200)</label>
                    <input type="number" min="0" max="200" value={form.score} onChange={e=>setForm(f=>({...f,score:e.target.value}))} placeholder="145" required /></div>
                  <div><label style={{ fontSize:12, color:'#475569', display:'block', marginBottom:6 }}>Accuracy %</label>
                    <input type="number" min="0" max="100" value={form.accuracy} onChange={e=>setForm(f=>({...f,accuracy:e.target.value}))} placeholder="85" /></div>
                  <div><label style={{ fontSize:12, color:'#475569', display:'block', marginBottom:6 }}>Wrong Qs</label>
                    <input type="number" min="0" value={form.wrong} onChange={e=>setForm(f=>({...f,wrong:e.target.value}))} placeholder="15" /></div>
                  <div style={{ gridColumn:'1/-1' }}><label style={{ fontSize:12, color:'#475569', display:'block', marginBottom:6 }}>Time Taken</label>
                    <input type="text" value={form.timeTaken} onChange={e=>setForm(f=>({...f,timeTaken:e.target.value}))} placeholder="55 min" /></div>
                </div>
                <div>
                  <label style={{ fontSize:12, color:'#475569', display:'block', marginBottom:8 }}>Weak Sections</label>
                  <div style={{ display:'flex', gap:8 }}>
                    {SUBS.map(s=>(
                      <button key={s} type="button" onClick={()=>setForm(f=>({...f,weakSections:f.weakSections.includes(s)?f.weakSections.filter(x=>x!==s):[...f.weakSections,s]}))}
                        style={{ flex:1, padding:'8px', borderRadius:10, border:`1px solid ${form.weakSections.includes(s)?'rgba(239,68,68,0.3)':'rgba(255,255,255,0.08)'}`, background:form.weakSections.includes(s)?'rgba(239,68,68,0.1)':'transparent', color:form.weakSections.includes(s)?'#F87171':'#64748B', fontSize:13, fontWeight:500, cursor:'pointer', transition:'all 0.2s' }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div><label style={{ fontSize:12, color:'#475569', display:'block', marginBottom:6 }}>Notes</label>
                  <textarea rows={2} value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="What did you learn from this test?" /></div>
                <div style={{ display:'flex', gap:10, paddingTop:4 }}>
                  <button type="button" className="btn btn-ghost" style={{ flex:1 }} onClick={()=>setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ flex:1 }}>Save Test</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
