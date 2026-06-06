import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

function TypingText({ text }) {
  const [displayed, setDisplayed] = useState('');
  const idx = useRef(0);

  useEffect(() => {
    setDisplayed('');
    idx.current = 0;
    if (!text) return;
    const id = setInterval(() => {
      idx.current++;
      setDisplayed(text.slice(0, idx.current));
      if (idx.current >= text.length) clearInterval(id);
    }, 8);
    return () => clearInterval(id);
  }, [text]);

  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => <h1 style={{ color: '#60a5fa', fontSize: 17, marginBottom: 8 }}>{children}</h1>,
        h2: ({ children }) => <h2 style={{ color: '#60a5fa', fontSize: 15, marginBottom: 6 }}>{children}</h2>,
        h3: ({ children }) => <h3 style={{ color: '#93c5fd', fontSize: 13, marginBottom: 4 }}>{children}</h3>,
        strong: ({ children }) => <strong style={{ color: '#fcd34d' }}>{children}</strong>,
        code: ({ children }) => (
          <code style={{
            background: 'rgba(6,13,26,0.8)', color: '#86efac',
            padding: '2px 6px', borderRadius: 4, fontSize: 12,
            fontFamily: 'JetBrains Mono, monospace',
          }}>{children}</code>
        ),
        li: ({ children }) => <li style={{ marginBottom: 4, paddingLeft: 4 }}>{children}</li>,
        p: ({ children }) => <p style={{ marginBottom: 10 }}>{children}</p>,
        ul: ({ children }) => <ul style={{ paddingLeft: 20, marginBottom: 8 }}>{children}</ul>,
      }}
    >{displayed}</ReactMarkdown>
  );
}

export default function ResultPreview({ analysis, loading }) {
  if (!analysis && !loading) return null;

  return (
    <div className="animate-fade-up" style={{
      background: 'linear-gradient(135deg, rgba(13,27,46,0.9) 0%, rgba(26,39,68,0.5) 100%)',
      borderRadius: 12, padding: 24, marginTop: 16,
      border: '1px solid rgba(245,158,11,0.25)',
      boxShadow: '0 0 24px rgba(245,158,11,0.08), 0 4px 32px rgba(0,0,0,0.3)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'rgba(245,158,11,0.15)',
          border: '1px solid rgba(245,158,11,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
        }}>🔍</div>
        <h3 style={{ color: '#f59e0b', margin: 0, fontSize: 15, fontWeight: 600 }}>AI 분석 결과</h3>
        {loading && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="spinner" style={{ borderTopColor: '#f59e0b' }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>분석 중...</span>
          </div>
        )}
      </div>

      {!loading && (
        <div style={{ color: '#e2e8f0', fontSize: 14, lineHeight: 1.8 }}>
          <TypingText text={analysis} />
        </div>
      )}
    </div>
  );
}
