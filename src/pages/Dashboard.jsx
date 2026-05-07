// Premium Dashboard
import { motion } from 'framer-motion';
import { format, getDay } from 'date-fns';
import { Flame, Clock, Target, Trophy, TrendingUp, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const QUOTES = [
  "160 is earned, not wished.",
  "Discipline creates confidence.",
  "Consistency beats motivation.",
  "Every hour you study, your rank rises.",
  "Toppers don't wait for inspiration — they execute.",
  "Your future self is watching. Make them proud.",
  "One more question solved. One rank climbed.",
];

const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0D1321', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '10px 14px' }}>
      <div style={{ fontSize: 11, color: '#64748B', marginBottom: 4 }}>{label}</div>
      {payload.map(p => <div key={p.name} style={{ color: p.color, fontWeight: 700, fontSize: 13 }}>{p.name}: {p.value}</div>)}
    </div>
  );
};

function AnimatedRing({ value, max, size = 100, strokeWidth = 8, color = '#3B82F6', label, sub }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  const offset = circ * (1 - pct);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div style={{ textAlign: 'center', marginTop: -size/2 - 8, position: 'relative', top: -(size/2 + 4) }}>
        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 20, lineHeight: 1, color }}>{label}</div>
        <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{sub}</div>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, sub, color, delay = 0, gradient }) {
  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      whileHover={{ y: -3 }}
      style={{ padding: '20px 24px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{label}</div>
          <div className={gradient} style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 30, lineHeight: 1 }}>{value}</div>
          {sub && <div style={{ fontSize: 12, color: '#475569', marginTop: 6 }}>{sub}</div>}
        </div>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}15`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} style={{ color }} />
        </div>
      </div>
    </motion.div>
  );
}

export default function Dashboard({ data }) {
  const today = new Date();
  const quote = QUOTES[today.getDate() % QUOTES.length];
  const completedTasks = data.tasks.filter(t => t.done).length;
  const totalTasks = data.tasks.length;
  const pct = Math.round((completedTasks / totalTasks) * 100);
  const completedBlocks = data.timetable.filter(b => b.completed).length;
  const totalBlocks = data.timetable.length;
  const bestMock = data.mockTests.length ? Math.max(...data.mockTests.map(m => m.score)) : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="space-y-6">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontSize: 12, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
            {format(today, 'EEEE, MMMM d yyyy')}
          </div>
          <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 'clamp(24px,4vw,36px)', lineHeight: 1.1, marginBottom: 8 }}>
            Welcome back, <span className="grad-orange">Warrior</span> 🎯
          </h1>
          <p style={{ fontSize: 14, color: '#475569', fontStyle: 'italic' }}>" {quote} "</p>
        </div>
        <div className="card card-glow-blue" style={{ padding: '14px 24px', textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Mission Target</div>
          <div className="grad-blue" style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 32, lineHeight: 1 }}>
            160<span style={{ fontSize: 16, color: '#1E293B', fontWeight: 400 }}>/200</span>
          </div>
        </div>
      </motion.div>

      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        <MetricCard icon={Clock} label="Hours Today" value={`${data.totalHoursToday}h`} sub="Target: 10h" color="#3B82F6" gradient="grad-blue" delay={0.1} />
        <MetricCard icon={Flame} label="Streak" value={data.streak} sub="days in a row" color="#F97316" gradient="grad-orange" delay={0.15} />
        <MetricCard icon={Trophy} label="Tasks Done" value={`${completedTasks}/${totalTasks}`} sub={`${pct}% complete`} color="#10B981" gradient="grad-cyan" delay={0.2} />
        <MetricCard icon={TrendingUp} label="Sessions" value={`${completedBlocks}/${totalBlocks}`} sub="time blocks" color="#8B5CF6" gradient="grad-purple" delay={0.25} />
      </div>

      {/* Progress + rings row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16 }}>
        {/* Completion bar */}
        <motion.div className="card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontWeight: 600, color: '#CBD5E1' }}>Today's Progress</span>
            <motion.span className="grad-blue" style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 22 }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
              {pct}%
            </motion.span>
          </div>
          <div className="pbar" style={{ height: 10, marginBottom: 12 }}>
            <motion.div
              className={`pbar-fill ${pct === 100 ? 'green' : ''}`}
              initial={{ width: 0 }} animate={{ width: `${pct}%` }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
              style={{ height: '100%' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {data.tasks.map((t, i) => (
              <motion.div key={t.id} title={t.label}
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.04 }}
                style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: t.done ? '#3B82F6' : 'rgba(255,255,255,0.06)',
                  boxShadow: t.done ? '0 0 6px rgba(59,130,246,0.5)' : 'none',
                  transition: 'all 0.3s',
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Rings */}
        <motion.div className="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
          style={{ padding: '20px 24px', display: 'flex', gap: 20, alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <svg width={90} height={90} style={{ transform: 'rotate(-90deg)', display: 'block' }}>
              <circle cx={45} cy={45} r={36} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={8} />
              <motion.circle cx={45} cy={45} r={36} fill="none" stroke="#3B82F6" strokeWidth={8} strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 36}
                initial={{ strokeDashoffset: 2 * Math.PI * 36 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 36 * (1 - pct / 100) }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                style={{ filter: 'drop-shadow(0 0 6px #3B82F6)' }}
              />
            </svg>
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 14, color: '#3B82F6', marginTop: -50 }}>Tasks</div>
            <div style={{ fontSize: 10, color: '#475569', marginTop: 38 }}>{pct}%</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <svg width={90} height={90} style={{ transform: 'rotate(-90deg)', display: 'block' }}>
              <circle cx={45} cy={45} r={36} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={8} />
              <motion.circle cx={45} cy={45} r={36} fill="none" stroke="#F97316" strokeWidth={8} strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 36}
                initial={{ strokeDashoffset: 2 * Math.PI * 36 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 36 * (1 - data.totalHoursToday / 10) }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.6 }}
                style={{ filter: 'drop-shadow(0 0 6px #F97316)' }}
              />
            </svg>
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 14, color: '#F97316', marginTop: -50 }}>Hours</div>
            <div style={{ fontSize: 10, color: '#475569', marginTop: 38 }}>{data.totalHoursToday}/10</div>
          </div>
        </motion.div>
      </div>

      {/* Weekly chart */}
      <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 16, color: '#E2E8F0' }}>Weekly Progress</h2>
            <p style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>Study hours per day</p>
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748B' }}>
              <span style={{ width: 20, height: 2, background: '#3B82F6', borderRadius: 99, display: 'inline-block' }} />Hours
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748B' }}>
              <span style={{ width: 20, height: 2, background: '#F97316', borderRadius: 99, display: 'inline-block' }} />Tasks
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data.weeklyData}>
            <defs>
              <linearGradient id="gBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gOrange" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F97316" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#F97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTip />} />
            <Area type="monotone" dataKey="hours" name="Hours" stroke="#3B82F6" strokeWidth={2.5} fill="url(#gBlue)" dot={{ fill: '#3B82F6', r: 3 }} />
            <Area type="monotone" dataKey="tasks" name="Tasks" stroke="#F97316" strokeWidth={2} fill="url(#gOrange)" dot={{ fill: '#F97316', r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {/* Mock score */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Target size={15} style={{ color: '#3B82F6' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8' }}>Latest Mock Score</span>
          </div>
          {data.mockTests.length > 0 ? (
            <>
              <div className="grad-blue" style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 40, lineHeight: 1, marginBottom: 6 }}>
                {data.mockTests[0].score}<span style={{ fontSize: 18, fontWeight: 400, color: '#1E293B' }}>/200</span>
              </div>
              <div style={{ fontSize: 12, color: '#475569', marginBottom: 12 }}>{data.mockTests[0].date}</div>
              <div className="pbar">
                <motion.div
                  className="pbar-fill"
                  animate={{ width: `${(data.mockTests[0].score / 200) * 100}%` }}
                  transition={{ duration: 1, delay: 0.6 }}
                  style={{
                    height: '100%',
                    background: data.mockTests[0].score >= 160
                      ? 'linear-gradient(90deg,#10B981,#34D399)'
                      : data.mockTests[0].score >= 130
                        ? 'linear-gradient(90deg,#F97316,#FB923C)'
                        : 'linear-gradient(90deg,#EF4444,#F87171)'
                  }}
                />
              </div>
              <div style={{ fontSize: 12, color: '#475569', marginTop: 8 }}>
                Best: <span style={{ color: '#10B981', fontWeight: 600 }}>{bestMock}/200</span>
              </div>
            </>
          ) : (
            <div>
              <div style={{ fontSize: 13, color: '#334155', marginBottom: 16 }}>No mock tests yet.</div>
              <div style={{ fontSize: 12, color: '#1E293B' }}>Add your first test in Mock Tests →</div>
            </div>
          )}
        </motion.div>

        {/* Streak calendar */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Flame size={15} style={{ color: '#F97316' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8' }}>Activity — Last 7 Days</span>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            {Array.from({ length: 7 }).map((_, i) => {
              const d = new Date();
              d.setDate(d.getDate() - (6 - i));
              const key = format(d, 'yyyy-MM-dd');
              const val = data.heatmap?.[key] || 0;
              const intensity = Math.min(val / 9, 1);
              const isToday = i === 6;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.6 + i * 0.06, duration: 0.4 }}
                    style={{
                      width: '100%', height: Math.max(8, intensity * 50 + 8),
                      borderRadius: 6,
                      background: val > 0
                        ? `rgba(59,130,246,${0.2 + intensity * 0.8})`
                        : 'rgba(255,255,255,0.04)',
                      border: isToday ? '1px solid rgba(59,130,246,0.4)' : 'none',
                      boxShadow: val > 0 ? `0 0 8px rgba(59,130,246,${intensity * 0.4})` : 'none',
                      transformOrigin: 'bottom',
                    }}
                  />
                  <span style={{ fontSize: 9, color: '#334155' }}>{format(d, 'EEE')}</span>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="fire-anim" style={{ fontSize: 20 }}>🔥</span>
            <div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 18, color: '#F97316' }}>{data.streak} day streak</div>
              <div style={{ fontSize: 11, color: '#334155' }}>Keep it going!</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
