export default function CodeEditor({ code, onChange }) {
  if (!code) return null;
  return (
    <div style={{ background:'#1e293b', borderRadius:8, padding:20, marginTop:16 }}>
      <h3 style={{ color:'#60a5fa', marginTop:0 }}>생성된 래더 코드</h3>
      <textarea
        value={code}
        onChange={e => onChange(e.target.value)}
        style={{ width:'100%', minHeight:300, background:'#0f172a', border:'1px solid #334155',
          color:'#86efac', borderRadius:6, padding:12, fontSize:13,
          resize:'vertical', boxSizing:'border-box', fontFamily:'monospace', lineHeight:1.6 }}
      />
    </div>
  );
}
