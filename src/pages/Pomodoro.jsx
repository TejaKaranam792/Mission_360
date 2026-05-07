// Premium Pomodoro Timer
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';

const MODES = { '25/5':{work:25,brk:5}, '50/10':{work:50,brk:10}, 'Custom':null };

const TIPS = ['📵 Phone face down', '🎧 Noise-cancelling on', '📋 Task written down', '💧 Water on desk', '🌙 Lights dimmed'];

function Ring({ pct, size, strokeW, color, children }) {
  const r = (size - strokeW) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ position:'relative', display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
      <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={strokeW} />
        <motion.circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={strokeW} strokeLinecap="round"
          strokeDasharray={circ}
          animate={{ strokeDashoffset: circ*(1-pct) }}
          transition={{ duration:0.6, ease:'linear' }}
          style={{ filter:`drop-shadow(0 0 10px ${color})` }}
        />
      </svg>
      <div style={{ position:'absolute', textAlign:'center' }}>{children}</div>
    </div>
  );
}

export default function Pomodoro() {
  const [mode, setMode] = useState('25/5');
  const [cWork, setCWork] = useState(30);
  const [cBrk, setCBrk] = useState(5);
  const [phase, setPhase] = useState('work');
  const [running, setRunning] = useState(false);
  const [secs, setSecs] = useState(25*60);
  const [sessions, setSessions] = useState(0);
  const [fs, setFs] = useState(false);
  const iv = useRef(null);

  const getWork = () => mode==='Custom' ? cWork : MODES[mode].work;
  const getBrk = () => mode==='Custom' ? cBrk : MODES[mode].brk;

  const alarm = useCallback(() => {
    try {
      const ctx = new (window.AudioContext||window.webkitAudioContext)();
      [[880,0],[1100,0.2],[880,0.4],[1320,0.6]].forEach(([f,t]) => {
        const o=ctx.createOscillator(), g=ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value=f; o.type='sine';
        g.gain.setValueAtTime(0.25, ctx.currentTime+t);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+t+0.15);
        o.start(ctx.currentTime+t); o.stop(ctx.currentTime+t+0.15);
      });
    } catch {}
  }, []);

  const reset = useCallback(() => {
    clearInterval(iv.current); setRunning(false);
    setPhase('work'); setSecs(getWork()*60);
  }, [mode, cWork]);

  useEffect(() => { reset(); }, [mode, cWork, cBrk]);

  useEffect(() => {
    if (running) {
      iv.current = setInterval(() => {
        setSecs(s => {
          if (s <= 1) {
            clearInterval(iv.current); alarm();
            setPhase(p => {
              const next = p==='work'?'break':'work';
              const mins = next==='work' ? getWork() : getBrk();
              setSecs(mins*60);
              if (next==='work') setSessions(n=>n+1);
              return next;
            });
            setRunning(false); return 0;
          }
          return s-1;
        });
      }, 1000);
    } else clearInterval(iv.current);
    return () => clearInterval(iv.current);
  }, [running]);

  const total = phase==='work' ? getWork()*60 : getBrk()*60;
  const pct = secs/total;
  const m = Math.floor(secs/60), s2 = secs%60;
  const timeStr = `${String(m).padStart(2,'0')}:${String(s2).padStart(2,'0')}`;
  const color = phase==='work' ? '#3B82F6' : '#10B981';
  const label = phase==='work' ? '🧠 Focus' : '☕ Break';

  const timerCore = (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:32 }}>
      <Ring pct={pct} size={fs?280:220} strokeW={fs?12:10} color={color}>
        <div>
          <div style={{ fontFamily:'Space Grotesk', fontWeight:800, fontSize:fs?52:40, color, fontVariantNumeric:'tabular-nums', lineHeight:1 }}>{timeStr}</div>
          <div style={{ fontSize:14, color:'#64748B', marginTop:6, letterSpacing:'0.06em' }}>{label}</div>
          <div style={{ fontSize:12, color:'#334155', marginTop:4 }}>{Math.round((1-pct)*100)}% done</div>
        </div>
      </Ring>

      {/* Controls */}
      <div style={{ display:'flex', alignItems:'center', gap:16 }}>
        <motion.button whileHover={{ scale:1.08 }} whileTap={{ scale:0.92 }}
          className="btn btn-ghost" style={{ padding:14, borderRadius:'50%' }} onClick={reset}>
          <RotateCcw size={20} />
        </motion.button>
        <motion.button whileHover={{ scale:1.08 }} whileTap={{ scale:0.92 }}
          style={{
            width:70, height:70, borderRadius:'50%', border:'none', cursor:'pointer',
            background: running
              ? 'linear-gradient(135deg,rgba(239,68,68,0.2),rgba(239,68,68,0.1))'
              : 'linear-gradient(135deg,#3B82F6,#22D3EE)',
            color: running ? '#F87171' : '#000',
            boxShadow: running ? '0 0 30px rgba(239,68,68,0.3)' : `0 0 30px ${color}60`,
            display:'flex', alignItems:'center', justifyContent:'center',
            transition:'all 0.3s',
          }}
          onClick={() => setRunning(r=>!r)}>
          {running ? <Pause size={28} /> : <Play size={28} strokeWidth={2.5} style={{ marginLeft:3 }} />}
        </motion.button>
        <motion.button whileHover={{ scale:1.08 }} whileTap={{ scale:0.92 }}
          className="btn btn-ghost" style={{ padding:14, borderRadius:'50%' }} onClick={() => setFs(f=>!f)}>
          {fs ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </motion.button>
      </div>

      {/* Session dots */}
      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
        {Array.from({ length: Math.max(4, sessions+1) }).map((_,i) => (
          <motion.div key={i} animate={{ scale: i===sessions && running ? [1,1.3,1] : 1 }} transition={{ repeat: Infinity, duration:2 }}
            style={{ width:10, height:10, borderRadius:'50%', background: i<sessions ? '#3B82F6' : 'rgba(255,255,255,0.07)',
              boxShadow: i<sessions ? '0 0 8px #3B82F680' : 'none', transition:'all 0.3s' }} />
        ))}
        <span style={{ fontSize:12, color:'#334155', marginLeft:4 }}>{sessions} sessions today</span>
      </div>
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {fs && (
          <motion.div className="pomodoro-fs" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:12, color:'#1E293B', textTransform:'uppercase', letterSpacing:'0.2em', marginBottom:40 }}>
                Mission 160 · Focus Mode
              </div>
              {timerCore}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!fs && (
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}>
          <div style={{ marginBottom:24 }}>
            <h1 style={{ fontFamily:'Space Grotesk', fontWeight:800, fontSize:28 }}>
              Focus <span className="grad-blue">Timer</span>
            </h1>
            <p style={{ fontSize:13, color:'#475569', marginTop:4 }}>Deep work sessions that build champions</p>
          </div>

          {/* Mode selector */}
          <div style={{ display:'flex', gap:8, marginBottom:20 }}>
            {Object.keys(MODES).map(m => (
              <motion.button key={m} whileTap={{ scale:0.95 }}
                className={`btn flex-1 ${mode===m ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setMode(m)}>
                {m}
              </motion.button>
            ))}
          </div>

          {/* Custom inputs */}
          {mode==='Custom' && (
            <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
              className="card" style={{ padding:'16px 20px', marginBottom:20, display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div><label style={{ fontSize:12, color:'#475569', display:'block', marginBottom:6 }}>Work (min)</label>
                <input type="number" min="1" max="120" value={cWork} onChange={e=>setCWork(+e.target.value)} /></div>
              <div><label style={{ fontSize:12, color:'#475569', display:'block', marginBottom:6 }}>Break (min)</label>
                <input type="number" min="1" max="60" value={cBrk} onChange={e=>setCBrk(+e.target.value)} /></div>
            </motion.div>
          )}

          {/* Timer */}
          <div className="card" style={{ padding:'40px 24px', display:'flex', justifyContent:'center', marginBottom:16 }}>
            {timerCore}
          </div>

          {/* Phase info */}
          <div className="card" style={{ padding:'14px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:color, boxShadow:`0 0 8px ${color}` }} />
              <span style={{ fontSize:13, color:'#94A3B8', fontWeight:500 }}>
                {phase==='work' ? `${getWork()} min focus` : `${getBrk()} min break`}
              </span>
            </div>
            <span style={{ fontSize:12, color:'#334155' }}>Phase: {phase==='work'?'Work':'Break'}</span>
          </div>

          {/* Tips */}
          <div className="card" style={{ padding:'16px 20px' }}>
            <div style={{ fontSize:11, color:'#334155', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:12 }}>Focus Tips</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))', gap:8 }}>
              {TIPS.map(tip => (
                <div key={tip} style={{ fontSize:13, color:'#475569', padding:'8px 12px', background:'rgba(255,255,255,0.03)', borderRadius:8, border:'1px solid rgba(255,255,255,0.05)' }}>{tip}</div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
