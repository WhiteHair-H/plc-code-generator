import ReactMarkdown from 'react-markdown';

const mdStyles = {
  color: '#e2e8f0', fontSize: 14, lineHeight: 1.8,
};

export default function ResultPreview({ analysis, loading }) {
  if (!analysis && !loading) return null;
  return (
    <div style={{ background:'#1e293b', borderRadius:8, padding:20, marginTop:16 }}>
      <h3 style={{ color:'#f59e0b', marginTop:0 }}>🔍 AI 분석 결과</h3>
      {loading
        ? <p style={{ color:'#94a3b8' }}>분석 중...</p>
        : (
          <div style={mdStyles}>
            <ReactMarkdown
              components={{
                h1: ({children}) => <h1 style={{color:'#60a5fa', fontSize:18}}>{children}</h1>,
                h2: ({children}) => <h2 style={{color:'#60a5fa', fontSize:16}}>{children}</h2>,
                h3: ({children}) => <h3 style={{color:'#93c5fd', fontSize:14}}>{children}</h3>,
                strong: ({children}) => <strong style={{color:'#fcd34d'}}>{children}</strong>,
                code: ({children}) => <code style={{background:'#0f172a', color:'#86efac', padding:'2px 6px', borderRadius:3, fontSize:13}}>{children}</code>,
                li: ({children}) => <li style={{marginBottom:4}}>{children}</li>,
                p: ({children}) => <p style={{marginBottom:8}}>{children}</p>,
              }}
            >
              {analysis}
            </ReactMarkdown>
          </div>
        )
      }
    </div>
  );
}
