import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeEditor({ code, onChange }) {
  const [editMode, setEditMode] = useState(false);

  if (!code) return null;

  return (
    <div className="animate-fade-up" style={{
      background: 'linear-gradient(135deg, var(--bg2) 0%, rgba(13,27,46,0.8) 100%)',
      borderRadius: 12, marginTop: 16,
      border: '1px solid var(--border)',
      overflow: 'hidden',
      boxShadow: '0 4px 32px rgba(0,0,0,0.3)',
    }}>
      {/* Header bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px',
        background: 'rgba(6,13,26,0.5)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {['#ef4444','#f59e0b','#10b981'].map(c => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.8 }} />
            ))}
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>ladder.st</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{
            padding: '2px 8px', borderRadius: 4, fontSize: 11,
            background: 'rgba(16,185,129,0.15)', color: '#10b981',
            border: '1px solid rgba(16,185,129,0.3)',
          }}>Structured Text</span>
          <button onClick={() => setEditMode(m => !m)} style={{
            padding: '3px 10px', borderRadius: 4, fontSize: 11,
            background: editMode ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${editMode ? 'rgba(59,130,246,0.5)' : 'var(--border)'}`,
            color: editMode ? '#60a5fa' : 'var(--text-muted)',
            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            transition: 'all 0.15s',
          }}>
            {editMode ? '✓ 편집 중' : '✎ 편집'}
          </button>
        </div>
      </div>

      {editMode ? (
        <textarea
          value={code}
          onChange={e => onChange(e.target.value)}
          style={{
            width: '100%', minHeight: 320,
            background: '#1e1e2e', border: 'none',
            color: '#86efac', padding: '16px',
            fontSize: 13, lineHeight: 1.7,
            resize: 'vertical', boxSizing: 'border-box',
            fontFamily: 'JetBrains Mono, monospace',
            outline: 'none',
          }}
        />
      ) : (
        <SyntaxHighlighter
          language="pascal"
          style={vscDarkPlus}
          customStyle={{
            margin: 0, borderRadius: 0, fontSize: 13,
            background: '#0d1117', lineHeight: 1.7, minHeight: 280,
            padding: '16px',
          }}
          showLineNumbers
          lineNumberStyle={{ color: '#334155', userSelect: 'none', minWidth: '2.5em' }}
        >
          {code}
        </SyntaxHighlighter>
      )}
    </div>
  );
}
