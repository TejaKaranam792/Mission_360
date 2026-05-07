// Premium Task Checklist — achievement card style
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { playCheckSound } from '../sounds';

const TASK_COLORS = ['#3B82F6','#8B5CF6','#10B981','#F59E0B','#F97316','#22D3EE','#EC4899','#3B82F6','#8B5CF6'];

export default function Tasks({ data, toggleTask }) {
  const prevDone = useRef(false);

  useEffect(() => {
    const allDone = data.tasks.every(t => t.done);
    if (allDone && !prevDone.current) {
      const colors = ['#3B82F6','#22D3EE','#F97316','#8B5CF6','#10B981','#F59E0B'];
      const end = Date.now() + 3500;
      (function frame() {
        confetti({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0 }, colors });
        confetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1 }, colors });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
    }
    prevDone.current = data.tasks.every(t => t.done);
  }, [data.tasks]);

  const done = data.tasks.filter(t => t.done).length;
  const pct = Math.round((done / data.tasks.length) * 100);
  const allDone = done === data.tasks.length;

  return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:'Space Grotesk', fontWeight:800, fontSize:28 }}>
          Daily <span className="grad-orange">Checklist</span>
        </h1>
        <p style={{ fontSize:13, color:'#475569', marginTop:4 }}>Complete all 9 targets to claim today's victory</p>
      </div>

      {/* Progress header card */}
      <div className="card" style={{ padding:'20px 24px', marginBottom:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
          <div>
            <span style={{ fontSize:13, color:'#64748B' }}>{done} of {data.tasks.length} completed</span>
          </div>
          <motion.div className="grad-blue" style={{ fontFamily:'Space Grotesk', fontWeight:800, fontSize:28, lineHeight:1 }}
            key={pct} initial={{ scale:1.3 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:400 }}>
            {pct}%
          </motion.div>
        </div>
        <div className="pbar" style={{ height:8, marginBottom:12 }}>
          <motion.div className={`pbar-fill ${allDone?'green':''}`} animate={{ width:`${pct}%` }} transition={{ duration:0.8 }} style={{ height:'100%' }} />
        </div>
        {/* Dots */}
        <div style={{ display:'flex', gap:6 }}>
          {data.tasks.map((t,i) => (
            <motion.div key={t.id} title={t.label}
              animate={{ scale: t.done ? [1,1.4,1] : 1 }}
              transition={{ duration:0.3 }}
              style={{
                flex:1, height:4, borderRadius:99,
                background: t.done ? TASK_COLORS[i] : 'rgba(255,255,255,0.06)',
                boxShadow: t.done ? `0 0 6px ${TASK_COLORS[i]}60` : 'none',
                transition:'all 0.4s',
              }}
            />
          ))}
        </div>
      </div>

      {/* All done banner */}
      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.9, opacity:0 }}
            style={{
              padding:'24px', marginBottom:20, borderRadius:20, textAlign:'center',
              background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(34,211,238,0.05))',
              border:'1px solid rgba(16,185,129,0.25)',
              boxShadow:'0 0 40px rgba(16,185,129,0.1)',
            }}
          >
            <div style={{ fontSize:48, marginBottom:8 }}>🏆</div>
            <div style={{ fontFamily:'Space Grotesk', fontWeight:800, fontSize:22, color:'#34D399', marginBottom:6 }}>
              Today you defeated your old self.
            </div>
            <div style={{ fontSize:13, color:'#475569' }}>All tasks complete. You are a disciplined warrior.</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:12 }}>
        {data.tasks.map((task, i) => {
          const color = TASK_COLORS[i];
          return (
            <motion.div key={task.id}
              initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} transition={{ delay: i*0.05 }}
              whileHover={{ y:-3, scale:1.01 }}
              whileTap={{ scale:0.97 }}
              onClick={() => {
                // Play sound only when checking (not unchecking)
                if (!task.done) playCheckSound();
                toggleTask(task.id);
              }}
              style={{
                padding:'16px 18px',
                borderRadius:16,
                border:`1px solid ${task.done ? color+'35' : 'rgba(255,255,255,0.06)'}`,
                background: task.done
                  ? `linear-gradient(135deg, ${color}0d, transparent)`
                  : 'rgba(255,255,255,0.03)',
                cursor:'pointer',
                display:'flex', alignItems:'center', gap:14,
                boxShadow: task.done ? `0 0 20px ${color}12` : 'none',
                transition:'all 0.3s',
                backdropFilter:'blur(20px)',
              }}
            >
              {/* Checkbox */}
              <div style={{
                width:26, height:26, borderRadius:8, flexShrink:0,
                display:'flex', alignItems:'center', justifyContent:'center',
                background: task.done ? `linear-gradient(135deg, ${color}, ${color}cc)` : 'rgba(255,255,255,0.05)',
                border: `1.5px solid ${task.done ? color : 'rgba(255,255,255,0.12)'}`,
                boxShadow: task.done ? `0 0 12px ${color}50` : 'none',
                transition:'all 0.3s',
              }}>
                <AnimatePresence>
                  {task.done && (
                    <motion.svg key="check" initial={{ scale:0, rotate:-45 }} animate={{ scale:1, rotate:0 }} exit={{ scale:0 }} width="13" height="11" viewBox="0 0 13 11" fill="none">
                      <path d="M1.5 5.5L5 9L11.5 1.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </motion.svg>
                  )}
                </AnimatePresence>
              </div>

              {/* Icon */}
              <span style={{ fontSize:22, flexShrink:0 }}>{task.icon}</span>

              {/* Label */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{
                  fontWeight:600, fontSize:14,
                  color: task.done ? '#334155' : '#CBD5E1',
                  textDecoration: task.done ? 'line-through' : 'none',
                  transition:'all 0.3s',
                }}>
                  {task.label}
                </div>
              </div>

              {/* Done badge */}
              <AnimatePresence>
                {task.done && (
                  <motion.div key="badge" initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0 }}
                    style={{ fontSize:10, fontWeight:700, color, background:`${color}15`, border:`1px solid ${color}30`, borderRadius:99, padding:'3px 8px', flexShrink:0 }}>
                    ✓
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
