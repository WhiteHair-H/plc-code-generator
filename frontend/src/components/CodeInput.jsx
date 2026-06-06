import { useState } from 'react';

const examples = [
  '모터 시작 버튼(I0.0)을 누르면 모터(Q0.0)가 동작하고, 정지 버튼(I0.1)을 누르면 멈춘다',
  '센서(I0.0)가 감지되면 5초 후 컨베이어(Q0.0)가 시작된다',
  '온도가 80도 이상(I0.0)이면 냉각팬(Q0.0)을 켜고, 60도 이하가 되면 끈다',
];

export default function CodeInput({ onGenerate, loading }) {
  const [desc, setDesc] = useState('');

  return (
    <div style={{ background:'#1e293b', borderRadius:8, padding:20 }}>
      <h3 style={{ color:'#60a5fa', marginTop:0 }}>제어 요구사항 입력</h3>
      <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:12 }}>
        {examples.map((ex, i) => (
          <button key={i} onClick={() => setDesc(ex)}
            style={{ background:'#334155', border:'none', color:'#94a3b8',
              padding:'4px 10px', borderRadius:4, cursor:'pointer', fontSize:12 }}>
            예시 {i+1}
          </button>
        ))}
      </div>
      <textarea
        value={desc}
        onChange={e => setDesc(e.target.value)}
        placeholder="제어 요구사항을 자연어로 입력하세요..."
        style={{ width:'100%', minHeight:100, background:'#0f172a', border:'1px solid #334155',
          color:'#e2e8f0', borderRadius:6, padding:10, fontSize:14,
          resize:'vertical', boxSizing:'border-box', fontFamily:'inherit' }}
      />
      <button onClick={() => onGenerate(desc)} disabled={loading || !desc.trim()}
        style={{ marginTop:12, padding:'10px 24px', background: loading ? '#334155' : '#3b82f6',
          border:'none', color:'#fff', borderRadius:6, cursor: loading ? 'default' : 'pointer',
          fontSize:14, fontWeight:'bold' }}>
        {loading ? '생성 중...' : '⚡ PLC 코드 생성'}
      </button>
    </div>
  );
}
