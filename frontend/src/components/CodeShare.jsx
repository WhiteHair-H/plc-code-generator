import { useState } from 'react';

export default function CodeShare({ codeId }) {
  const [copied, setCopied] = useState(false);
  if (!codeId) return null;

  const url = `${window.location.origin}/share/${codeId}`;
  const copy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-up" style={{
      background: 'linear-gradient(135deg, var(--bg2), rgba(26,39,68,0.5))',
      borderRadius: 12, padding: '14px 18px', marginTop: 16,
      border: '1px solid rgba(6,182,212,0.25)',
      boxShadow: '0 0 16px rgba(6,182,212,0.06)',
      display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
    }}>
      <span style={{ fontSize: 14 }}>🔗</span>
      <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>공유 링크</span>
      <code style={{
        color: '#67e8f9', fontSize: 12, flex: 1, wordBreak: 'break-all',
        fontFamily: 'JetBrains Mono, monospace',
      }}>{url}</code>
      <button onClick={copy} className="btn-glow" style={{
        padding: '6px 16px', fontSize: 12, fontWeight: 600,
        background: copied ? 'linear-gradient(135deg, #059669, #10b981)' : 'rgba(6,182,212,0.15)',
        color: copied ? '#fff' : '#67e8f9',
        border: `1px solid ${copied ? 'transparent' : 'rgba(6,182,212,0.3)'}`,
        boxShadow: copied ? '0 0 16px rgba(16,185,129,0.3)' : 'none',
        transition: 'all 0.2s',
      }}>
        {copied ? '✓ 복사됨' : '복사'}
      </button>
    </div>
  );
}
