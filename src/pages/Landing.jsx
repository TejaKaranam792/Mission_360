// Landing / Hero page — cinematic war-room intro
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { ArrowRight, Zap, Target, TrendingUp, Shield } from 'lucide-react';

const quotes = [
  "160 is earned, not wished.",
  "Discipline creates confidence.",
  "Consistency beats motivation.",
  "Every session counts.",
];

function Particles() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const container = ref.current;
    const count = 18;
    const particles = [];
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      const size = Math.random() * 3 + 1;
      const left = Math.random() * 100;
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 15;
      const colors = ['rgba(59,130,246,0.5)', 'rgba(34,211,238,0.4)', 'rgba(139,92,246,0.35)'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      p.className = 'particle';
      p.style.cssText = `width:${size}px;height:${size}px;left:${left}%;bottom:-20px;background:${color};animation-duration:${duration}s;animation-delay:-${delay}s;`;
      container.appendChild(p);
      particles.push(p);
    }
    return () => particles.forEach(p => p.remove());
  }, []);
  return <div ref={ref} style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }} />;
}

const features = [
  { icon: Target, color: '#3B82F6', label: 'Mock Test Tracker', desc: 'Chart every score. Identify weakness. Close the gap.' },
  { icon: Zap, color: '#22D3EE', label: 'Focus Pomodoro', desc: 'Deep work sessions that build champions.' },
  { icon: TrendingUp, color: '#8B5CF6', label: 'Analytics Hub', desc: 'Bloomberg-grade insights for your preparation.' },
  { icon: Shield, color: '#F97316', label: 'Habit Fortress', desc: 'Build the disciplines that toppers live by.' },
];

export default function Landing({ onEnter }) {
  const quoteIdx = new Date().getDate() % quotes.length;

  return (
    <div className="hero-bg grid-lines" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <Particles />

      {/* Radial glows */}
      <div style={{
        position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '80px 40px 60px' }}>

        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}
        >
          <div className="badge badge-blue" style={{ padding: '8px 18px', fontSize: 12, gap: 8 }}>
            <div className="pulse-dot" style={{ width: 6, height: 6 }} />
            SSC CGL Tier 1 · Target 160/200
          </div>
        </motion.div>

        {/* Hero headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
          style={{ textAlign: 'center' }}
        >
          <h1 style={{
            fontFamily: 'Syne, Space Grotesk, sans-serif',
            fontWeight: 800, fontSize: 'clamp(52px, 8vw, 96px)',
            lineHeight: 1.0, marginBottom: 12,
          }}>
            <span className="grad-hero">Mission</span>{' '}
            <span className="grad-blue">160</span>
          </h1>
          <div style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(16px, 3vw, 22px)',
            color: '#64748B', letterSpacing: '0.12em',
            textTransform: 'uppercase', fontWeight: 500,
            marginBottom: 32,
          }}>
            Discipline &nbsp;·&nbsp; Consistency &nbsp;·&nbsp; Rank
          </div>
          <p style={{ fontSize: 17, color: '#94A3B8', maxWidth: 560, margin: '0 auto 48px', lineHeight: 1.7 }}>
            The only productivity system built exclusively for SSC CGL aspirants. 
            Track. Analyze. Dominate.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 80 }}
        >
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            className="btn btn-hero"
            onClick={() => onEnter('dashboard')}
          >
            Enter War Room <ArrowRight size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="btn btn-hero-outline"
            onClick={() => onEnter('dashboard')}
          >
            Start Today →
          </motion.button>
        </motion.div>

        {/* Dashboard preview card */}
        <motion.div
          initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
          style={{ position: 'relative', marginBottom: 80 }}
        >
          <div style={{
            borderRadius: 24,
            overflow: 'hidden',
            border: '1px solid rgba(59,130,246,0.2)',
            boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(59,130,246,0.1), 0 0 80px rgba(59,130,246,0.1)',
            background: '#0B0F19',
          }}>
            <img
              src="/hero_dashboard.png"
              alt="Mission 160 Dashboard Preview"
              style={{ width: '100%', display: 'block', maxHeight: 420, objectFit: 'cover', objectPosition: 'top' }}
            />
            {/* Gradient overlay at bottom */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,
              background: 'linear-gradient(transparent, #060810)',
            }} />
          </div>

          {/* Floating stat chips */}
          <motion.div
            animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', top: 20, left: -20,
              background: '#0D1321', border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: 14, padding: '12px 16px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(16,185,129,0.15)',
            }}
          >
            <div style={{ fontSize: 10, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Study Streak</div>
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 26, color: '#F97316' }}>
              🔥 14 days
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            style={{
              position: 'absolute', top: 30, right: -20,
              background: '#0D1321', border: '1px solid rgba(59,130,246,0.3)',
              borderRadius: 14, padding: '12px 16px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(59,130,246,0.15)',
            }}
          >
            <div style={{ fontSize: 10, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Latest Mock</div>
            <div className="grad-blue" style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 26 }}>152/200</div>
          </motion.div>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        >
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div className="badge badge-purple" style={{ padding: '6px 16px', marginBottom: 16 }}>Everything you need</div>
            <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 32, marginBottom: 12 }}>
              Your Complete <span className="grad-blue">Command Center</span>
            </h2>
            <p style={{ color: '#64748B', maxWidth: 440, margin: '0 auto' }}>
              Every tool a serious SSC aspirant needs — built into one elite platform.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.label}
                  className="card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  whileHover={{ y: -4 }}
                  style={{ padding: 24 }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: `${f.color}18`, border: `1px solid ${f.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 16,
                  }}>
                    <Icon size={20} style={{ color: f.color }} />
                  </div>
                  <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{f.label}</div>
                  <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6 }}>{f.desc}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Quote + CTA bottom */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          style={{
            textAlign: 'center', marginTop: 80, padding: 48,
            background: 'linear-gradient(135deg, rgba(59,130,246,0.06), rgba(139,92,246,0.04))',
            border: '1px solid rgba(59,130,246,0.15)', borderRadius: 24,
          }}
        >
          <div style={{ fontSize: 28, fontFamily: 'Space Grotesk', fontWeight: 700, color: '#CBD5E1', marginBottom: 12 }}>
            "{quotes[quoteIdx]}"
          </div>
          <div style={{ color: '#475569', marginBottom: 32 }}>Every day you train, you close the gap.</div>
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            className="btn btn-hero"
            onClick={() => onEnter('dashboard')}
          >
            Start Your Mission <ArrowRight size={16} />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
