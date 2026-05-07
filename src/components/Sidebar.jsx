import { motion } from 'framer-motion';
import {
  LayoutDashboard, Clock, CheckSquare, Timer, Target,
  BookOpen, TrendingUp, BarChart2, Menu, X, Music, VolumeX,
  Zap, Trophy
} from 'lucide-react';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { id: 'landing', label: 'Home', icon: Zap },
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ]
  },
  {
    label: 'Study',
    items: [
      { id: 'timetable', label: 'Timetable', icon: Clock },
      { id: 'tasks', label: 'Daily Tasks', icon: CheckSquare },
      { id: 'pomodoro', label: 'Focus Timer', icon: Timer },
    ]
  },
  {
    label: 'Performance',
    items: [
      { id: 'mocks', label: 'Mock Tests', icon: Target },
      { id: 'mistakes', label: 'Mistake Book', icon: BookOpen },
      { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    ]
  },
  {
    label: 'Lifestyle',
    items: [
      { id: 'habits', label: 'Habit Tracker', icon: TrendingUp },
    ]
  }
];

export default function Sidebar({ active, setActive, musicOn, toggleMusic, mobileOpen, setMobileOpen }) {
  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 md:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
              onClick={() => { setActive('landing'); setMobileOpen(false); }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: 'linear-gradient(135deg, #3B82F6, #22D3EE)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: 16, color: '#000',
                boxShadow: '0 0 20px rgba(59,130,246,0.4)',
                fontFamily: 'Space Grotesk, sans-serif',
              }}>M</div>
              <div>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 17, lineHeight: 1 }}>
                  Mission <span className="grad-orange">160</span>
                </div>
                <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>SSC CGL War Room</div>
              </div>
            </div>
            <button onClick={() => setMobileOpen(false)} className="btn btn-ghost md:hidden" style={{ padding: 6 }}>
              <X size={16} />
            </button>
          </div>

          {/* Target chip */}
          <div style={{
            marginTop: 16, padding: '10px 14px',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(34,211,238,0.05))',
            border: '1px solid rgba(59,130,246,0.2)', borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: 10, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Target</div>
              <div className="grad-blue" style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 20, lineHeight: 1.2 }}>160<span style={{ fontSize: 13, color: '#334155', fontWeight: 500 }}>/200</span></div>
            </div>
            <Trophy size={20} style={{ color: '#F97316' }} />
          </div>
        </div>

        {/* Nav groups */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
          {navGroups.map(group => (
            <div key={group.label} style={{ marginBottom: 8 }}>
              <div className="section-label">{group.label}</div>
              {group.items.map(item => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.96 }}
                    className={`nav-item w-full text-left ${active === item.id ? 'active' : ''}`}
                    onClick={() => { setActive(item.id); setMobileOpen(false); }}
                  >
                    <Icon size={16} strokeWidth={active === item.id ? 2.5 : 2} />
                    <span>{item.label}</span>
                  </motion.button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '12px 10px 20px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <motion.button
            whileHover={{ x: 3 }}
            className={`nav-item w-full ${musicOn ? 'active' : ''}`}
            onClick={toggleMusic}
          >
            {musicOn ? <Music size={15} /> : <VolumeX size={15} />}
            <span style={{ flex: 1 }}>{musicOn ? 'Ambient: On' : 'Ambient: Off'}</span>
            {musicOn && <div className="pulse-dot" style={{ width: 6, height: 6 }} />}
          </motion.button>
          <div style={{ textAlign: 'center', marginTop: 14, fontSize: 11, color: '#1E293B', fontStyle: 'italic' }}>
            "Discipline creates confidence."
          </div>
        </div>
      </aside>

      {/* Mobile hamburger */}
      <button
        className="btn btn-ghost fixed z-50 md:hidden"
        style={{
          top: 16, left: 16,
          padding: 10, borderRadius: 12,
          background: 'rgba(6,8,16,0.9)',
          display: mobileOpen ? 'none' : 'flex',
        }}
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={18} />
      </button>
    </>
  );
}
