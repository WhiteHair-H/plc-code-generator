import { useState } from 'react';

const examples = [
  '모터 시작 버튼(I0.0)을 누르면 모터(Q0.0)가 동작하고, 정지 버튼(I0.1)을 누르면 멈춘다',
  '센서(I0.0)가 감지되면 5초 후 컨베이어(Q0.0)가 시작된다',
  '온도가 80도 이상(I0.0)이면 냉각팬(Q0.0)을 켜고, 60도 이하가 되면 끈다',
];

export default function CodeInput({ onGenerate, loading }) {
  const [desc, setDesc] = useState('');
  const [focused, setFocused] = useState(false);

  return (
    <div className="animate-fade-up" style={{
      background: 'linear-gradient(135deg, var(--bg2) 0%, rgba(13,27,46,0.8) 100%)',
      borderRadius: 12,
      padding: 24,
      border: `1px solid ${focused ? 'rgba(59,130,246,0.5)' : 'var(--border)'}`,
      boxShadow: focused ? '0 0 0 1px rgba(59,130,246,0.2), 0 4px 32px rgba(0,0,0,0.4)' : '0 4px 32px rgba(0,0,0,0.3)',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'rgba(59,130,246,0.15)',
          border: '1px solid rgba(59,130,246,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
        }}>💬</div>
        <div>
          <h3 style={{ color: '#e2e8f0', margin: 0, fontSize: 15, fontWeight: 600 }}>제어 요구사항 입력</h3>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: 12 }}>자연어로 PLC 로직을 설명하세요</p>
        </div>
      </div>

      {/* Example chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        {examples.map((ex, i) => (
          <button key={i} onClick={() => setDesc(ex)} style={{
            background: 'rgba(59,130,246,0.08)',
            border: '1px solid rgba(59,130,246,0.2)',
            color: '#93c5fd',
            padding: '4px 12px', borderRadius: 20,
            cursor: 'pointer', fontSize: 12, fontFamily: 'Inter, sans-serif',
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.18)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.08)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.2)'; }}
          >예시 {i + 1}</button>
        ))}
      </div>

      {/* Textarea */}
      <textarea
        value={desc}
        onChange={e => setDesc(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="예: 모터 시작 버튼(I0.0)을 누르면 모터(Q0.0)가 동작하고..."
        style={{
          width: '100%', minHeight: 110,
          background: 'rgba(6,13,26,0.6)',
          border: `1px solid ${focused ? 'rgba(59,130,246,0.4)' : 'var(--border)'}`,
          color: '#e2e8f0', borderRadius: 8, padding: '12px 14px',
          fontSize: 14, resize: 'vertical', boxSizing: 'border-box',
          fontFamily: 'Inter, sans-serif', lineHeight: 1.7,
          outline: 'none', transition: 'border-color 0.2s',
        }}
      />

      {/* Generate button */}
      <button
        className="btn-glow"
        onClick={() => onGenerate(desc)}
        disabled={loading || !desc.trim()}
        style={{
          marginTop: 14, padding: '11px 28px',
          background: loading || !desc.trim()
            ? 'rgba(59,130,246,0.15)'
            : 'linear-gradient(135deg, #2563eb, #3b82f6)',
          color: loading || !desc.trim() ? 'rgba(255,255,255,0.4)' : '#fff',
          fontSize: 14, fontWeight: 600,
          boxShadow: !loading && desc.trim() ? '0 0 20px rgba(59,130,246,0.4), 0 4px 12px rgba(0,0,0,0.3)' : 'none',
          cursor: loading || !desc.trim() ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', gap: 8,
        }}
      >
        {loading ? (
          <><span className="spinner" /> 생성 중...</>
        ) : (
          <>⚡ PLC 코드 생성</>
        )}
      </button>
    </div>
  );
}
