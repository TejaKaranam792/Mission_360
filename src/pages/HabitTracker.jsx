// Premium Habit Tracker
import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';
import { playCheckSound } from '../sounds';

const HABIT_COLORS = ['#3B82F6','#22D3EE','#8B5CF6','#F97316','#10B981','#F59E0B'];

export default function HabitTracker({ data, toggleHabit }) {
  const done = data.habits.filter(h => h.done).length;
  const pct = Math.round((done / data.habits.length) * 100);

  return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:'Space Grotesk', fontWeight:800, fontSize:28 }}>
          Habit <span className="grad-blue">Tracker</span>
        </h1>
        <p style={{ fontSize:13, color:'#475569', marginTop:4 }}>Small habits. Massive results. Every single day.</p>
      </div>

      {/* Progress */}
      <div className="card" style={{ padding:'18px 22px', marginBottom:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <span style={{ fontSize:13, color:'#64748B' }}>Today's habits — {done}/{data.habits.length}</span>
          <span className="grad-orange" style={{ fontFamily:'Space Grotesk', fontWeight:800, fontSize:20 }}>{pct}%</span>
        </div>
        <div className="pbar" style={{ height:8 }}>
          <motion.div className={`pbar-fill ${pct===100?'green':'orange'}`} animate={{ width:`${pct}%` }} transition={{ duration:0.8 }} style={{ height:'100%' }} />
        </div>
      </div>

      {/* Habits grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px,1fr))', gap:14 }}>
        {data.habits.map((h, i) => {
          const color = HABIT_COLORS[i % HABIT_COLORS.length];
          return (
            <motion.div key={h.id}
              initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} transition={{ delay:i*0.06 }}
              whileHover={{ y:-3, scale:1.01 }} whileTap={{ scale:0.97 }}
              onClick={() => {
                if (!h.done) playCheckSound();
                toggleHabit(h.id);
              }}
              style={{
                padding:'18px 20px', borderRadius:18, cursor:'pointer',
                background: h.done
                  ? `linear-gradient(135deg, ${color}12, transparent)`
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${h.done ? color+'30' : 'rgba(255,255,255,0.06)'}`,
                boxShadow: h.done ? `0 0 25px ${color}12` : 'none',
                transition:'all 0.3s',
                backdropFilter:'blur(20px)',
              }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:h.streak>0?12:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ fontSize:26 }}>{h.icon}</span>
                  <div>
                    <div style={{ fontWeight:600, fontSize:14, color: h.done ? color : '#CBD5E1', transition:'color 0.3s' }}>
                      {h.label}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:3 }}>
                      <Flame size={11} className={h.streak>0 ? 'fire-anim' : ''} style={{ color: h.streak>0 ? '#F97316' : '#1E293B' }} />
                      <span style={{ fontSize:11, color: h.streak>0 ? '#F97316' : '#334155' }}>{h.streak} day streak</span>
                    </div>
                  </div>
                </div>
                {/* Toggle */}
                <div style={{
                  width:30, height:30, borderRadius:'50%', flexShrink:0,
                  background: h.done ? `${color}20` : 'rgba(255,255,255,0.05)',
                  border: `2px solid ${h.done ? color : 'rgba(255,255,255,0.1)'}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  boxShadow: h.done ? `0 0 12px ${color}50` : 'none',
                  transition:'all 0.3s',
                }}>
                  <AnimatePresence>
                    {h.done&&(
                      <motion.svg key="ck" initial={{ scale:0, rotate:-45 }} animate={{ scale:1, rotate:0 }} exit={{ scale:0 }} width="13" height="11" viewBox="0 0 13 11" fill="none">
                        <path d="M1.5 5.5L5 9L11.5 1.5" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Streak dots */}
              {h.streak > 0 && (
                <div style={{ display:'flex', gap:3, marginTop:8, flexWrap:'wrap' }}>
                  {Array.from({ length: Math.min(h.streak, 14) }).map((_,j) => (
                    <motion.div key={j} initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:j*0.03 }}
                      style={{ width:6, height:6, borderRadius:'50%', background:`${color}${Math.round(40+j/14*215).toString(16)}`, flexShrink:0 }} />
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Motivational card */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.6 }}
        style={{
          marginTop:24, padding:'20px 24px', borderRadius:18,
          background:'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(239,68,68,0.04))',
          border:'1px solid rgba(249,115,22,0.18)',
          display:'flex', alignItems:'center', gap:16,
        }}>
        <span style={{ fontSize:32 }} className="fire-anim">🔥</span>
        <div>
          <div style={{ fontFamily:'Space Grotesk', fontWeight:700, fontSize:17, color:'#FB923C', marginBottom:4 }}>
            Consistency is your superpower
          </div>
          <div style={{ fontSize:13, color:'#64748B', lineHeight:1.6 }}>
            It takes 21 days to build a habit. Every tick brings you closer to 160. 
            Show up. Every. Single. Day.
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
