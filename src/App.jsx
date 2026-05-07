import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { format } from 'date-fns';
import { LayoutDashboard, Clock, CheckSquare, Timer, Target, BookOpen, TrendingUp, BarChart2, ArrowRight } from 'lucide-react';

import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Timetable from './pages/Timetable';
import Tasks from './pages/Tasks';
import Pomodoro from './pages/Pomodoro';
import MockTests from './pages/MockTests';
import Mistakes from './pages/Mistakes';
import HabitTracker from './pages/HabitTracker';
import Analytics from './pages/Analytics';

import { useStore } from './useStore';

const QUOTES = [
  "160 is earned, not wished.",
  "Discipline creates confidence.",
  "Consistency beats motivation.",
  "Every hour you study, your rank rises.",
];

const BOTTOM_NAV = [
  { id:'dashboard', label:'Home', icon:LayoutDashboard },
  { id:'timetable', label:'Schedule', icon:Clock },
  { id:'tasks', label:'Tasks', icon:CheckSquare },
  { id:'pomodoro', label:'Focus', icon:Timer },
  { id:'analytics', label:'Stats', icon:BarChart2 },
];

function DailyGoalsModal({ onClose }) {
  const q = QUOTES[new Date().getDate() % QUOTES.length];
  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-box"
        initial={{ scale:0.85, opacity:0, y:30 }}
        animate={{ scale:1, opacity:1, y:0 }}
        exit={{ scale:0.9, opacity:0 }}
        transition={{ type:'spring', stiffness:300, damping:25 }}
        onClick={e=>e.stopPropagation()}
        style={{ textAlign:'center', maxWidth:420 }}
      >
        <div style={{ fontSize:52, marginBottom:16 }}>🎯</div>
        <h2 style={{ fontFamily:'Space Grotesk', fontWeight:800, fontSize:26, marginBottom:10 }}>
          Good Morning, <span className="grad-orange">Warrior!</span>
        </h2>
        <p style={{ fontSize:14, color:'#64748B', marginBottom:24, fontStyle:'italic', lineHeight:1.7 }}>
          "{q}"
        </p>
        <div style={{
          background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)',
          borderRadius:14, padding:'16px 20px', marginBottom:24, textAlign:'left',
          display:'flex', flexDirection:'column', gap:8,
        }}>
          {[
            '✅ Complete all 9 daily tasks',
            '⏱️ Study for 10+ hours today',
            '📝 Attempt at least 1 mock test',
            '🔄 Complete revision session',
            '🌙 Sleep before 11 PM tonight',
          ].map(g=><div key={g} style={{ fontSize:13, color:'#94A3B8' }}>{g}</div>)}
        </div>
        <div style={{
          background:'linear-gradient(135deg,rgba(59,130,246,0.1),rgba(34,211,238,0.05))',
          border:'1px solid rgba(59,130,246,0.2)',
          borderRadius:14, padding:'14px 20px', marginBottom:24,
        }}>
          <div style={{ fontSize:10, color:'#475569', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>Your Mission</div>
          <div className="grad-blue" style={{ fontFamily:'Space Grotesk', fontWeight:800, fontSize:32 }}>
            160<span style={{ color:'#1E293B', fontWeight:400, fontSize:18 }}>/200</span>
          </div>
        </div>
        <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
          className="btn btn-hero" style={{ width:'100%' }} onClick={onClose}>
          Let's Get To Work 💪
        </motion.button>
      </motion.div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState('landing');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showGoals, setShowGoals] = useState(false);
  const rainRef = useRef(null);

  const {
    data, update,
    updateTimetable, toggleTimetableBlock,
    toggleTask, toggleHabit,
    addMockTest, deleteMockTest,
    addMistake, toggleMistakeRevised, deleteMistake,
    toggleMusic,
  } = useStore();

  // Daily goals popup once per day
  useEffect(() => {
    const k = 'mission160_goals_shown';
    const today = format(new Date(), 'yyyy-MM-dd');
    if (localStorage.getItem(k) !== today) {
      setTimeout(() => setShowGoals(true), 1000);
      localStorage.setItem(k, today);
    }
  }, []);

  // Ambient rain sound via Web Audio
  const startRain = () => {
    if (rainRef.current) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const buf = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
      const src = ctx.createBufferSource(); src.buffer=buf; src.loop=true;
      const gain = ctx.createGain(); gain.gain.value=0.04;
      const filt = ctx.createBiquadFilter(); filt.type='lowpass'; filt.frequency.value=900;
      src.connect(filt); filt.connect(gain); gain.connect(ctx.destination);
      src.start(); rainRef.current={ctx,src,gain};
    } catch {}
  };
  const stopRain = () => {
    if (rainRef.current) {
      try { rainRef.current.src.stop(); rainRef.current.ctx.close(); } catch {}
      rainRef.current = null;
    }
  };
  useEffect(() => {
    data.settings?.musicOn ? startRain() : stopRain();
  }, [data.settings?.musicOn]);

  const isLanding = page === 'landing';

  const renderPage = () => {
    switch (page) {
      case 'landing':    return <Landing onEnter={p => setPage(p || 'dashboard')} />;
      case 'dashboard':  return <Dashboard data={data} />;
      case 'timetable':  return <Timetable data={data} toggleTimetableBlock={toggleTimetableBlock} updateTimetable={updateTimetable} />;
      case 'tasks':      return <Tasks data={data} toggleTask={toggleTask} />;
      case 'pomodoro':   return <Pomodoro />;
      case 'mocks':      return <MockTests data={data} addMockTest={addMockTest} deleteMockTest={deleteMockTest} />;
      case 'mistakes':   return <Mistakes data={data} addMistake={addMistake} toggleMistakeRevised={toggleMistakeRevised} deleteMistake={deleteMistake} />;
      case 'habits':     return <HabitTracker data={data} toggleHabit={toggleHabit} />;
      case 'analytics':  return <Analytics data={data} />;
      default:           return <Dashboard data={data} />;
    }
  };

  return (
    <div className="bg-animated" style={{ minHeight:'100vh' }}>
      {/* Sidebar — hidden on landing */}
      {!isLanding && (
        <Sidebar
          active={page} setActive={setPage}
          musicOn={data.settings?.musicOn} toggleMusic={toggleMusic}
          mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}
        />
      )}

      {/* Main */}
      <main className={isLanding ? '' : 'main-content'}>
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity:0, y:14 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-14 }}
            transition={{ duration:0.25, ease:'easeInOut' }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile bottom nav — hidden on landing */}
      {!isLanding && (
        <div className="bottom-nav">
          {BOTTOM_NAV.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.id} className={`bottom-nav-item ${page===item.id?'active':''}`}
                onClick={() => setPage(item.id)}>
                <Icon size={20} strokeWidth={page===item.id?2.5:1.8} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Daily goals popup */}
      <AnimatePresence>
        {showGoals && <DailyGoalsModal onClose={() => setShowGoals(false)} />}
      </AnimatePresence>
    </div>
  );
}
