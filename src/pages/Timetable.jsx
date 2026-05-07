// Premium Timetable
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Check, Clock } from 'lucide-react';
import { playCheckSound } from '../sounds';

const COLORS = ['#3B82F6','#22D3EE','#8B5CF6','#F97316','#10B981','#EC4899','#F59E0B','#EF4444'];
const SUBJECTS = { 'Quant':'#3B82F6','Reasoning':'#8B5CF6','English':'#10B981','GA':'#F59E0B','Mock Test':'#F97316','Mock Analysis':'#EF4444','Revision':'#22D3EE' };

const toMin = t => { const [h,m] = t.split(':').map(Number); return h*60+m; };
const getActive = (tt) => {
  const now = new Date();
  const cur = now.getHours()*60+now.getMinutes();
  return tt.find(b => toMin(b.start) <= cur && toMin(b.end) > cur);
};

function LiveTimer({ block }) {
  const [left, setLeft] = useState(0);
  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const cur = now.getHours()*60+now.getMinutes()+now.getSeconds()/60;
      setLeft(Math.max(0, toMin(block.end) - cur));
    };
    calc(); const iv = setInterval(calc, 1000); return () => clearInterval(iv);
  }, [block]);
  const h = Math.floor(left/60), m = Math.floor(left%60), s = Math.floor((left*60)%60);
  const pct = left / (toMin(block.end) - toMin(block.start));
  const color = block.color || SUBJECTS[block.subject] || '#3B82F6';
  return (
    <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
      className="card" style={{
        padding: '20px 24px', marginBottom: 20,
        border: `1px solid ${color}30`,
        background: `linear-gradient(135deg, ${color}08, transparent)`,
        boxShadow: `0 0 30px ${color}15`,
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div className="pulse-dot" style={{ background: color }} />
        <span style={{ fontSize: 11, color, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Active Session</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 24, color, marginBottom: 4 }}>{block.subject}</div>
          <div style={{ fontSize: 13, color: '#475569' }}>{block.start} – {block.end}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 36, lineHeight: 1, color, fontVariantNumeric: 'tabular-nums' }}>
            {String(h).padStart(2,'0')}:{String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}
          </div>
          <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>remaining</div>
        </div>
      </div>
      <div className="pbar" style={{ marginTop: 16, height: 4 }}>
        <div className="pbar-fill" style={{
          width: `${(1-pct)*100}%`, height: '100%',
          background: `linear-gradient(90deg, ${color}, ${color}99)`,
          transition: 'width 1s linear',
        }} />
      </div>
    </motion.div>
  );
}

const defForm = { start:'06:00', end:'07:00', subject:'Quant', color:'#3B82F6' };

export default function Timetable({ data, toggleTimetableBlock, updateTimetable }) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(defForm);
  const active = getActive(data.timetable);
  const done = data.timetable.filter(b => b.completed).length;
  const pct = Math.round((done / data.timetable.length) * 100);

  const openAdd = () => { setForm(defForm); setEditId(null); setShowForm(true); };
  const openEdit = b => { setForm({ start:b.start, end:b.end, subject:b.subject, color:b.color||'#3B82F6' }); setEditId(b.id); setShowForm(true); };
  const handleSubmit = e => {
    e.preventDefault();
    editId ? updateTimetable(data.timetable.map(b => b.id===editId ? {...b,...form} : b))
           : updateTimetable([...data.timetable, {...form, id:Date.now(), completed:false}]);
    setShowForm(false);
  };
  const del = id => updateTimetable(data.timetable.filter(b => b.id!==id));

  return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontFamily:'Space Grotesk', fontWeight:800, fontSize:28 }}>
            Daily <span className="grad-blue">Timetable</span>
          </h1>
          <p style={{ fontSize:13, color:'#475569', marginTop:4 }}>Your structured battle plan — {done}/{data.timetable.length} sessions complete</p>
        </div>
        <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }} className="btn btn-primary" onClick={openAdd}>
          <Plus size={15} /> Add Block
        </motion.button>
      </div>

      {/* Progress */}
      <div className="card" style={{ padding:'16px 20px', marginBottom:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
          <span style={{ fontSize:13, color:'#64748B' }}>{done} of {data.timetable.length} sessions</span>
          <span className="grad-blue" style={{ fontWeight:700, fontFamily:'Space Grotesk', fontSize:16 }}>{pct}%</span>
        </div>
        <div className="pbar">
          <motion.div className="pbar-fill" animate={{ width:`${pct}%` }} transition={{ duration:0.8 }} style={{ height:'100%' }} />
        </div>
      </div>

      {/* Active timer */}
      {active && !active.completed && <LiveTimer block={active} />}

      {/* Blocks */}
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        <AnimatePresence>
          {data.timetable.map((b, i) => {
            const color = b.color || SUBJECTS[b.subject] || '#3B82F6';
            const isActive = active?.id === b.id;
            return (
              <motion.div key={b.id}
                initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:16 }}
                transition={{ delay: i*0.04 }}
                whileHover={{ x:2 }}
                className="card"
                style={{
                  padding:'14px 18px', display:'flex', alignItems:'center', gap:14,
                  borderColor: isActive && !b.completed ? `${color}35` : undefined,
                  boxShadow: isActive && !b.completed ? `0 0 24px ${color}12` : undefined,
                  background: b.completed ? 'rgba(16,185,129,0.04)' : undefined,
                  opacity: b.completed ? 0.65 : 1,
                }}
              >
                {/* Color stripe */}
                <div style={{ width:3, height:36, borderRadius:99, background:color, flexShrink:0, boxShadow:`0 0 8px ${color}60` }} />

                {/* Time */}
                <div style={{ fontSize:12, color:'#475569', fontVariantNumeric:'tabular-nums', flexShrink:0, width:88 }}>
                  {b.start} – {b.end}
                </div>

                {/* Subject */}
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:15, color: b.completed ? '#334155' : color }}>
                    {b.subject}
                  </div>
                  {isActive && !b.completed && (
                    <div style={{ fontSize:11, color, marginTop:2 }}>● Live now</div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                  <motion.button whileTap={{ scale:0.9 }} className="btn btn-ghost" style={{ padding:'6px 8px' }} onClick={() => openEdit(b)}>
                    <Edit2 size={13} />
                  </motion.button>
                  <motion.button whileTap={{ scale:0.9 }} className="btn btn-danger" style={{ padding:'6px 8px' }} onClick={() => del(b.id)}>
                    <Trash2 size={13} />
                  </motion.button>
                  <motion.button whileTap={{ scale:0.9 }}
                    className="btn" style={{
                      padding:'6px 10px',
                      background: b.completed ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${b.completed ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'}`,
                      color: b.completed ? '#10B981' : '#475569',
                    }}
                    onClick={() => {
                      if (!b.completed) playCheckSound();
                      toggleTimetableBlock(b.id);
                    }}
                  >
                    <Check size={13} />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <motion.div className="modal-box" initial={{ scale:0.9, opacity:0, y:20 }} animate={{ scale:1, opacity:1, y:0 }} exit={{ scale:0.9, opacity:0 }} onClick={e => e.stopPropagation()}>
              <h2 style={{ fontFamily:'Space Grotesk', fontWeight:800, fontSize:22, marginBottom:24 }}>
                {editId ? 'Edit' : 'Add'} Time Block
              </h2>
              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <div><label style={{ fontSize:12, color:'#475569', display:'block', marginBottom:6 }}>Start</label>
                    <input type="time" value={form.start} onChange={e => setForm(f=>({...f,start:e.target.value}))} required /></div>
                  <div><label style={{ fontSize:12, color:'#475569', display:'block', marginBottom:6 }}>End</label>
                    <input type="time" value={form.end} onChange={e => setForm(f=>({...f,end:e.target.value}))} required /></div>
                </div>
                <div><label style={{ fontSize:12, color:'#475569', display:'block', marginBottom:6 }}>Subject</label>
                  <input type="text" value={form.subject} onChange={e => setForm(f=>({...f,subject:e.target.value}))} placeholder="e.g. Quant, Reasoning..." required /></div>
                <div><label style={{ fontSize:12, color:'#475569', display:'block', marginBottom:8 }}>Color</label>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    {COLORS.map(c => (
                      <button key={c} type="button" onClick={() => setForm(f=>({...f,color:c}))}
                        style={{ width:28, height:28, borderRadius:8, background:c, border:'none', cursor:'pointer',
                          outline: form.color===c ? '2px solid white' : 'none', outlineOffset:2,
                          boxShadow: form.color===c ? `0 0 12px ${c}` : 'none', transition:'all 0.2s' }}
                      />
                    ))}
                  </div>
                </div>
                <div style={{ display:'flex', gap:10, paddingTop:8 }}>
                  <button type="button" className="btn btn-ghost" style={{ flex:1 }} onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ flex:1 }}>{editId ? 'Save Changes' : 'Add Block'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
