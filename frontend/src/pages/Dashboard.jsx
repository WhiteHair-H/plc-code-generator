import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import { localList, localDelete } from '../store/localStore';

export default function Dashboard() {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('db'); // 'db' | 'local'
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/codes')
      .then(r => { setCodes(r.data); setSource('db'); })
      .catch(() => { setCodes(localList()); setSource('local'); })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (source === 'db') {
      await axios.delete(`/api/codes/${id}`).catch(() => {});
    } else {
      localDelete(id);
    }
    setCodes(c => c.filter(x => x.id !== id));
  };

  return (
    <div style={{ maxWidth:900, margin:'0 auto', padding:24 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <h2 style={{ color:'#60a5fa', margin:0 }}>저장된 코드 목록
          <span style={{ fontSize:12, color: source==='local'?'#f59e0b':'#22c55e', marginLeft:10 }}>
            {source==='local' ? '● 로컬 저장' : '● DB 연결'}
          </span>
        </h2>
        <button onClick={() => navigate('/generate')}
          style={{ padding:'8px 18px', background:'#3b82f6', border:'none',
            color:'#fff', borderRadius:6, cursor:'pointer', fontSize:14 }}>
          + 새 코드 생성
        </button>
      </div>

      {loading && <p style={{ color:'#94a3b8' }}>불러오는 중...</p>}
      {!loading && codes.length === 0 && (
        <div style={{ textAlign:'center', padding:60, color:'#475569' }}>
          <p style={{ fontSize:48 }}>⚙</p>
          <p>아직 생성된 코드가 없습니다.</p>
          <button onClick={() => navigate('/generate')}
            style={{ padding:'10px 24px', background:'#3b82f6', border:'none',
              color:'#fff', borderRadius:6, cursor:'pointer' }}>
            첫 코드 생성하기
          </button>
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {codes.map(item => (
          <div key={item.id} onClick={() => navigate(`/share/${item.id}`)}
            style={{ background:'#1e293b', borderRadius:8, padding:16, cursor:'pointer',
              border:'1px solid #334155', transition:'border-color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor='#3b82f6'}
            onMouseLeave={e => e.currentTarget.style.borderColor='#334155'}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div style={{ flex:1 }}>
                <p style={{ color:'#e2e8f0', margin:'0 0 6px', fontSize:14 }}>{item.description}</p>
                <p style={{ color:'#475569', margin:0, fontSize:12 }}>
                  {new Date(item.created_at).toLocaleString('ko-KR')}
                </p>
              </div>
              <button onClick={e => handleDelete(item.id, e)}
                style={{ background:'#7f1d1d', border:'none', color:'#fca5a5',
                  padding:'4px 10px', borderRadius:4, cursor:'pointer', fontSize:12, marginLeft:12 }}>
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

