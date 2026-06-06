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
    <div style={{ background:'#1e293b', borderRadius:8, padding:16, marginTop:16,
      display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
      <span style={{ color:'#94a3b8', fontSize:13 }}>🔗 공유 링크:</span>
      <code style={{ color:'#60a5fa', fontSize:12, flex:1, wordBreak:'break-all' }}>{url}</code>
      <button onClick={copy}
        style={{ padding:'6px 14px', background: copied ? '#16a34a' : '#334155',
          border:'none', color:'#fff', borderRadius:4, cursor:'pointer', fontSize:13 }}>
        {copied ? '복사됨!' : '복사'}
      </button>
    </div>
  );
}
