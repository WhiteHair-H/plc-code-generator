import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Generator from './pages/Generator';

export default function App() {
  const loc = useLocation();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      {/* Background grid */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }} />

      {/* Ambient glow top */}
      <div style={{
        position: 'fixed', top: -120, left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 240,
        background: 'radial-gradient(ellipse, rgba(59,130,246,0.18) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(6,13,26,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 32px',
        display: 'flex', alignItems: 'center', gap: 8, height: 56,
        boxShadow: '0 1px 0 rgba(59,130,246,0.15)',
      }}>
        <Link to="/" style={{ textDecoration: 'none', marginRight: 12 }}>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 700, fontSize: 16,
            background: 'linear-gradient(135deg, #60a5fa, #8b5cf6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            letterSpacing: '0.02em',
          }}>⚙ PLC Generator</span>
        </Link>

        {[{ to: '/', label: '대시보드' }, { to: '/generate', label: '코드 생성' }].map(({ to, label }) => {
          const active = loc.pathname === to;
          return (
            <Link key={to} to={to} style={{
              padding: '6px 14px', borderRadius: 6,
              fontSize: 14, fontWeight: 500, textDecoration: 'none',
              color: active ? '#fff' : 'var(--text-muted)',
              background: active ? 'rgba(59,130,246,0.2)' : 'transparent',
              border: `1px solid ${active ? 'rgba(59,130,246,0.5)' : 'transparent'}`,
              boxShadow: active ? '0 0 12px rgba(59,130,246,0.3)' : 'none',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.background = 'rgba(59,130,246,0.08)'; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; } }}
            >
              {label}
            </Link>
          );
        })}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>시스템 온라인</span>
        </div>
      </nav>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/generate" element={<Generator />} />
          <Route path="/share/:id" element={<Generator />} />
        </Routes>
      </div>
    </div>
  );
}
