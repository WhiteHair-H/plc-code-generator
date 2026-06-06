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
      setSaveMsg('DB에 저장되었습니다');
    } catch {
      const item = localSave(code, ladderData);
      setCodeId(item.id);
      setSaveMsg('로컬에 저장되었습니다');
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
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
      {/* Page title */}
      <div className="animate-fade-up" style={{ marginBottom: 24 }}>
        <h2 style={{ color: '#e2e8f0', margin: '0 0 4px', fontSize: 22, fontWeight: 700 }}>
          코드 생성기
        </h2>
        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: 13 }}>
          자연어로 PLC 래더 다이어그램 코드를 자동 생성합니다
        </p>
      </div>

      <CodeInput onGenerate={handleGenerate} loading={genLoading} />

      {error && (
        <div className="animate-fade-up" style={{
          marginTop: 12, padding: '10px 16px', borderRadius: 8,
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
          color: '#fca5a5', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8,
        }}>
          ⚠ {error}
        </div>
      )}

      <LadderDiagram data={ladderData} />
      <CodeEditor code={code} onChange={setCode} />

      {code && (
        <div className="animate-fade-up" style={{
          display: 'flex', gap: 10, marginTop: 14,
          alignItems: 'center', flexWrap: 'wrap',
          padding: '14px 18px',
          background: 'var(--bg2)',
          borderRadius: 10, border: '1px solid var(--border)',
        }}>
          <button
            onClick={handleSave}
            disabled={saveLoading || !!codeId}
            className="btn-glow"
            style={{
              padding: '9px 20px', fontSize: 13,
              background: codeId
                ? 'rgba(16,185,129,0.15)'
                : saveLoading ? 'rgba(255,255,255,0.05)'
                : 'linear-gradient(135deg, #059669, #10b981)',
              color: codeId ? '#86efac' : saveLoading ? 'rgba(255,255,255,0.3)' : '#fff',
              border: `1px solid ${codeId ? 'rgba(16,185,129,0.3)' : 'transparent'}`,
              boxShadow: !codeId && !saveLoading ? '0 0 16px rgba(16,185,129,0.3)' : 'none',
              cursor: saveLoading || codeId ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            {saveLoading ? <><span className="spinner" style={{ width: 14, height: 14 }} /> 저장 중...</>
              : codeId ? '✓ 저장됨'
              : '💾 저장'}
          </button>

          <button
            onClick={handleAnalyze}
            disabled={anaLoading}
            className="btn-glow"
            style={{
              padding: '9px 20px', fontSize: 13,
              background: anaLoading ? 'rgba(245,158,11,0.08)' : 'linear-gradient(135deg, #b45309, #f59e0b)',
              color: anaLoading ? 'rgba(255,255,255,0.3)' : '#fff',
              boxShadow: !anaLoading ? '0 0 16px rgba(245,158,11,0.3)' : 'none',
              cursor: anaLoading ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            {anaLoading ? <><span className="spinner" style={{ width: 14, height: 14 }} /> 분석 중...</>
              : '🔍 코드 검증 & 버그 찾기'}
          </button>

          {saveMsg && (
            <span style={{
              fontSize: 12, color: '#86efac',
              padding: '4px 10px', borderRadius: 4,
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.2)',
            }}>✅ {saveMsg}</span>
          )}
        </div>
      )}

      <ResultPreview analysis={analysis} loading={anaLoading} />
      <CodeShare codeId={codeId} />
    </div>
  );
}
