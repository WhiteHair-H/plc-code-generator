import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api';
import CodeInput from '../components/CodeInput';
import CodeEditor from '../components/CodeEditor';
import ResultPreview from '../components/ResultPreview';
import CodeShare from '../components/CodeShare';
import LadderDiagram from '../components/LadderDiagram';
import { localSave, localGet } from '../store/localStore';

export default function Generator() {
  const { id } = useParams();
  const [code, setCode] = useState('');
  const [ladderData, setLadderData] = useState([]);
  const [codeId, setCodeId] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [genLoading, setGenLoading] = useState(false);
  const [anaLoading, setAnaLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    // DB 먼저, 실패 시 로컬스토리지
    axios.get(`/api/codes/${id}`)
      .then(r => { setCode(r.data.code); setLadderData(r.data.ladder_data || []); setCodeId(id); })
      .catch(() => {
        const local = localGet(id);
        if (local) { setCode(local.code); setLadderData(local.ladder_data || []); setCodeId(id); }
        else setError('코드를 불러올 수 없습니다.');
      });
  }, [id]);

  const handleGenerate = async (desc) => {
    setGenLoading(true); setError(''); setAnalysis(''); setLadderData([]); setSaveMsg(''); setCodeId(null);
    try {
      const r = await axios.post('/api/generate', { description: desc, save: false });
      setCode(r.data.code);
      setLadderData(r.data.ladder_data || []);
    } catch {
      setError('코드 생성 실패. 다시 시도해주세요.');
    }
    setGenLoading(false);
  };

  const handleSave = async () => {
    if (!code) return;
    setSaveLoading(true); setSaveMsg('');
    try {
      const res = await axios.post('/api/codes/save', { code, ladder_data: ladderData });
      setCodeId(res.data.id);
      setSaveMsg('✅ DB에 저장되었습니다');
    } catch {
      // DB 실패 → 로컬스토리지
      const item = localSave(code, ladderData);
      setCodeId(item.id);
      setSaveMsg('✅ 로컬에 저장되었습니다');
    }
    setSaveLoading(false);
    setTimeout(() => setSaveMsg(''), 3000);
  };

  const handleAnalyze = async () => {
    if (!code) return;
    setAnaLoading(true); setError('');
    try {
      const r = await axios.post('/api/analyze', { code });
      setAnalysis(r.data.analysis);
    } catch {
      setError('분석 실패. 다시 시도해주세요.');
    }
    setAnaLoading(false);
  };

  return (
    <div style={{ maxWidth:900, margin:'0 auto', padding:24 }}>
      <CodeInput onGenerate={handleGenerate} loading={genLoading} />
      {error && <p style={{ color:'#f87171', marginTop:12 }}>{error}</p>}
      <LadderDiagram data={ladderData} />
      <CodeEditor code={code} onChange={setCode} />
      {code && (
        <div style={{ display:'flex', gap:10, marginTop:12, alignItems:'center', flexWrap:'wrap' }}>
          <button onClick={handleSave} disabled={saveLoading || !!codeId}
            style={{ padding:'8px 20px',
              background: codeId ? '#14532d' : saveLoading ? '#334155' : '#16a34a',
              border:'none', color:'#fff', borderRadius:6,
              cursor:(saveLoading||codeId)?'default':'pointer', fontSize:13 }}>
            {saveLoading ? '저장 중...' : codeId ? '✅ 저장됨' : '💾 저장'}
          </button>
          <button onClick={handleAnalyze} disabled={anaLoading}
            style={{ padding:'8px 20px', background: anaLoading ? '#334155' : '#d97706',
              border:'none', color:'#fff', borderRadius:6, cursor:'pointer', fontSize:13 }}>
            {anaLoading ? '분석 중...' : '🔍 코드 검증 & 버그 찾기'}
          </button>
          {saveMsg && <span style={{ fontSize:13, color:'#86efac' }}>{saveMsg}</span>}
        </div>
      )}
      <ResultPreview analysis={analysis} loading={anaLoading} />
      <CodeShare codeId={codeId} />
    </div>
  );
}

