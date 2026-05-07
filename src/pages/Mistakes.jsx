// Premium Mistakes Notebook
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { playCheckSound } from '../sounds';

const CATS = ['Quant','English','Reasoning','GA'];
const CAT_STYLE = {
  Quant:   { color:'#3B82F6', bg:'rgba(59,130,246,0.1)',  border:'rgba(59,130,246,0.2)'  },
  English: { color:'#10B981', bg:'rgba(16,185,129,0.1)',  border:'rgba(16,185,129,0.2)'  },
  Reasoning:{ color:'#8B5CF6', bg:'rgba(139,92,246,0.1)', border:'rgba(139,92,246,0.2)'  },
  GA:      { color:'#F59E0B', bg:'rgba(245,158,11,0.1)',  border:'rgba(245,158,11,0.2)'  },
};
const defForm = { category:'Quant', question:'', whyWrong:'', correctMethod:'' };

export default function Mistakes({ data, addMistake, toggleMistakeRevised, deleteMistake }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defForm);
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);

  const counts = CATS.reduce((a,c)=>({...a,[c]:data.mistakes.filter(m=>m.category===c).length}),{});
  const filtered = filter==='All' ? data.mistakes : data.mistakes.filter(m=>m.category===filter);

  const handleSubmit = e => {
    e.preventDefault();
    addMistake(form); setForm(defForm); setShowForm(false);
  };

  return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontFamily:'Space Grotesk', fontWeight:800, fontSize:28 }}>Mistake <span className="grad-orange">Notebook</span></h1>
          <p style={{ fontSize:13, color:'#475569', marginTop:4 }}>Turn every error into a lesson</p>
        </div>
        <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }} className="btn btn-primary" onClick={()=>setShowForm(true)}>
          <Plus size={15} /> Add Mistake
        </motion.button>
      </div>

      {/* Category stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        {CATS.map(c=>{
          const st = CAT_STYLE[c];
          return (
            <motion.button key={c} whileHover={{ y:-2 }} whileTap={{ scale:0.96 }}
              onClick={()=>setFilter(filter===c?'All':c)}
              style={{
                padding:'14px 12px', borderRadius:14, cursor:'pointer', textAlign:'center',
                background: filter===c ? st.bg : 'rgba(255,255,255,0.03)',
                border: `1px solid ${filter===c ? st.border : 'rgba(255,255,255,0.06)'}`,
                transition:'all 0.2s',
              }}>
              <div style={{ fontFamily:'Space Grotesk', fontWeight:800, fontSize:24, color:st.color }}>{counts[c]}</div>
              <div style={{ fontSize:11, color:'#475569', marginTop:2 }}>{c}</div>
            </motion.button>
          );
        })}
      </div>

      {/* Filter pills */}
      <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
        {['All',...CATS].map(c=>{
          const st = c==='All' ? null : CAT_STYLE[c];
          const isActive = filter===c;
          return (
            <button key={c} onClick={()=>setFilter(c)}
              style={{
                padding:'5px 14px', borderRadius:99, fontSize:12, fontWeight:600,
                background: isActive ? (st?st.bg:'rgba(59,130,246,0.15)') : 'rgba(255,255,255,0.04)',
                color: isActive ? (st?st.color:'#60A5FA') : '#475569',
                border: `1px solid ${isActive?(st?st.border:'rgba(59,130,246,0.3)'):'rgba(255,255,255,0.06)'}`,
                cursor:'pointer', transition:'all 0.2s',
              }}>
              {c}
            </button>
          );
        })}
      </div>

      {/* Mistake list */}
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        <AnimatePresence>
          {filtered.map((m,i)=>{
            const st = CAT_STYLE[m.category];
            const isOpen = expanded===m.id;
            return (
              <motion.div key={m.id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, x:20 }} transition={{ delay:i*0.04 }}
                className="card" style={{ overflow:'hidden', opacity:m.revised?0.6:1 }}>
                <div style={{ padding:'14px 18px', cursor:'pointer', display:'flex', gap:14, alignItems:'flex-start' }}
                  onClick={()=>setExpanded(isOpen?null:m.id)}>
                  {/* Left stripe */}
                  <div style={{ width:3, borderRadius:99, background:st.color, alignSelf:'stretch', boxShadow:`0 0 8px ${st.color}60`, flexShrink:0 }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6, flexWrap:'wrap' }}>
                      <span style={{ fontSize:11, fontWeight:700, color:st.color, background:st.bg, border:`1px solid ${st.border}`, padding:'2px 8px', borderRadius:99 }}>{m.category}</span>
                      {m.revised&&<span className="badge badge-green" style={{ fontSize:10 }}>✓ Revised</span>}
                    </div>
                    <div style={{ fontSize:14, color:'#CBD5E1', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace: isOpen?'normal':'nowrap' }}>
                      {m.question}
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                    <motion.button whileTap={{ scale:0.9 }}
                      style={{ width:32, height:32, borderRadius:8, border:`1px solid ${m.revised?'rgba(16,185,129,0.3)':'rgba(255,255,255,0.08)'}`, background:m.revised?'rgba(16,185,129,0.1)':'rgba(255,255,255,0.04)', color:m.revised?'#10B981':'#475569', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}
                      onClick={e=>{e.stopPropagation(); if(!m.revised) playCheckSound(); toggleMistakeRevised(m.id);}}>
                      <CheckCircle2 size={14} />
                    </motion.button>
                    <motion.button whileTap={{ scale:0.9 }}
                      style={{ width:32, height:32, borderRadius:8, border:'1px solid rgba(239,68,68,0.2)', background:'rgba(239,68,68,0.08)', color:'#F87171', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}
                      onClick={e=>{e.stopPropagation();deleteMistake(m.id);}}>
                      <Trash2 size={14} />
                    </motion.button>
                    <div style={{ width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', color:'#475569' }}>
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                </div>
                <AnimatePresence>
                  {isOpen&&(
                    <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
                      style={{ overflow:'hidden' }}>
                      <div style={{ padding:'0 18px 18px 35px', display:'flex', flexDirection:'column', gap:12 }}>
                        {m.question&&(
                          <div style={{ padding:'12px 16px', background:'rgba(255,255,255,0.03)', borderRadius:10, border:'1px solid rgba(255,255,255,0.06)' }}>
                            <div style={{ fontSize:11, color:'#475569', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.08em' }}>Question</div>
                            <div style={{ fontSize:13, color:'#CBD5E1', lineHeight:1.6 }}>{m.question}</div>
                          </div>
                        )}
                        {m.whyWrong&&(
                          <div style={{ padding:'12px 16px', background:'rgba(239,68,68,0.05)', borderRadius:10, border:'1px solid rgba(239,68,68,0.12)' }}>
                            <div style={{ fontSize:11, color:'#F87171', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.08em' }}>Why I got it wrong</div>
                            <div style={{ fontSize:13, color:'#94A3B8', lineHeight:1.6 }}>{m.whyWrong}</div>
                          </div>
                        )}
                        {m.correctMethod&&(
                          <div style={{ padding:'12px 16px', background:'rgba(16,185,129,0.05)', borderRadius:10, border:'1px solid rgba(16,185,129,0.12)' }}>
                            <div style={{ fontSize:11, color:'#34D399', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.08em' }}>Correct Method</div>
                            <div style={{ fontSize:13, color:'#94A3B8', lineHeight:1.6 }}>{m.correctMethod}</div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {filtered.length===0&&(
          <div className="card" style={{ padding:60, textAlign:'center' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>📖</div>
            <div style={{ fontWeight:600, color:'#475569' }}>No mistakes yet</div>
            <div style={{ fontSize:13, color:'#334155', marginTop:6 }}>Start logging errors to close your knowledge gaps</div>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showForm&&(
          <div className="modal-overlay" onClick={()=>setShowForm(false)}>
            <motion.div className="modal-box" initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.9, opacity:0 }} onClick={e=>e.stopPropagation()}>
              <h2 style={{ fontFamily:'Space Grotesk', fontWeight:800, fontSize:22, marginBottom:24 }}>Add Mistake</h2>
              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <div>
                  <label style={{ fontSize:12, color:'#475569', display:'block', marginBottom:8 }}>Category</label>
                  <div style={{ display:'flex', gap:8 }}>
                    {CATS.map(c=>{
                      const st=CAT_STYLE[c]; const sel=form.category===c;
                      return <button key={c} type="button" onClick={()=>setForm(f=>({...f,category:c}))}
                        style={{ flex:1, padding:'9px 8px', borderRadius:10, border:`1px solid ${sel?st.border:'rgba(255,255,255,0.08)'}`, background:sel?st.bg:'transparent', color:sel?st.color:'#64748B', fontSize:13, fontWeight:600, cursor:'pointer', transition:'all 0.2s' }}>
                        {c}
                      </button>;
                    })}
                  </div>
                </div>
                <div><label style={{ fontSize:12, color:'#475569', display:'block', marginBottom:6 }}>Question / Topic</label>
                  <textarea rows={2} value={form.question} onChange={e=>setForm(f=>({...f,question:e.target.value}))} placeholder="What was the question or topic?" required /></div>
                <div><label style={{ fontSize:12, color:'#475569', display:'block', marginBottom:6 }}>Why I got it wrong</label>
                  <textarea rows={2} value={form.whyWrong} onChange={e=>setForm(f=>({...f,whyWrong:e.target.value}))} placeholder="Concept gap, silly mistake, time pressure..." /></div>
                <div><label style={{ fontSize:12, color:'#475569', display:'block', marginBottom:6 }}>Correct Method</label>
                  <textarea rows={3} value={form.correctMethod} onChange={e=>setForm(f=>({...f,correctMethod:e.target.value}))} placeholder="Step-by-step correct approach..." /></div>
                <div style={{ display:'flex', gap:10, paddingTop:4 }}>
                  <button type="button" className="btn btn-ghost" style={{ flex:1 }} onClick={()=>setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ flex:1 }}>Add Mistake</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
