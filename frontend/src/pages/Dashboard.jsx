import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import { localList, localDelete } from '../store/localStore';

function StatBadge({ label, value, color }) {
  return (
    <div style={{
      background: `rgba(${color},0.1)`, border: `1px solid rgba(${color},0.25)`,
      borderRadius: 8, padding: '10px 18px', textAlign: 'center', minWidth: 90,
    }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: `rgb(${color})`, fontFamily: 'JetBrains Mono, monospace' }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
    </div>
  );
}

function CodeCard({ item, onDelete, onClick }) {
  const [hovered, setHovered] = useState(false);
  const date = new Date(item.created_at);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(13,27,46,0.9) 100%)'
          : 'linear-gradient(135deg, var(--bg2) 0%, rgba(13,27,46,0.8) 100%)',
        borderRadius: 10, padding: '16px 20px', cursor: 'pointer',
        border: `1px solid ${hovered ? 'rgba(59,130,246,0.5)' : 'var(--border)'}`,
        boxShadow: hovered ? '0 0 24px rgba(59,130,246,0.15), 0 4px 16px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.2)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 0.2s ease',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', flexShrink: 0,
            boxShadow: hovered ? '0 0 8px #3b82f6' : 'none', transition: 'box-shadow 0.2s',
          }} />
          <p style={{
            color: '#e2e8f0', margin: 0, fontSize: 14, fontWeight: 500,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{item.description || item.code?.slice(0, 60) || '코드'}</p>
        </div>
        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: 12, paddingLeft: 14 }}>
          {isNaN(date) ? '날짜 없음' : date.toLocaleString('ko-KR')}
        </p>
      </div>
      <button
        onClick={onDelete}
        style={{
          background: hovered ? 'rgba(239,68,68,0.15)' : 'transparent',
          border: `1px solid ${hovered ? 'rgba(239,68,68,0.3)' : 'transparent'}`,
          color: hovered ? '#fca5a5' : 'var(--text-muted)',
          padding: '5px 12px', borderRadius: 6, cursor: 'pointer',
          fontSize: 12, marginLeft: 16, flexShrink: 0,
          transition: 'all 0.15s', fontFamily: 'Inter, sans-serif',
        }}
      >삭제</button>
    </div>
  );
}

export default function Dashboard() {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('db');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/codes')
      .then(r => { setCodes(r.data); setSource('db'); })
      .catch(() => { setCodes(localList()); setSource('local'); })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (source === 'db') await axios.delete(`/api/codes/${id}`).catch(() => {});
    else localDelete(id);
    setCodes(c => c.filter(x => x.id !== id));
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div className="animate-fade-up" style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2 style={{ color: '#e2e8f0', margin: '0 0 4px', fontSize: 22, fontWeight: 700 }}>
              저장된 코드
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 7, height: 7, borderRadius: '50%',
                background: source === 'local' ? '#f59e0b' : '#10b981',
                boxShadow: `0 0 6px ${source === 'local' ? '#f59e0b' : '#10b981'}`,
              }} />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {source === 'local' ? '로컬 저장소' : 'DynamoDB 연결됨'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <StatBadge label="총 코드" value={codes.length} color="59,130,246" />
            <button
              onClick={() => navigate('/generate')}
              className="btn-glow"
              style={{
                padding: '10px 20px', fontSize: 14,
                background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                color: '#fff', boxShadow: '0 0 20px rgba(59,130,246,0.35)',
              }}
            >+ 새 코드 생성</button>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
          <span className="spinner" /> <span style={{ marginLeft: 10 }}>불러오는 중...</span>
        </div>
      )}

      {/* Empty state */}
      {!loading && codes.length === 0 && (
        <div className="animate-fade-up" style={{
          textAlign: 'center', padding: '60px 24px',
          background: 'var(--bg2)', borderRadius: 12,
          border: '1px dashed var(--border)',
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⚙</div>
          <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>아직 생성된 코드가 없습니다</p>
          <button onClick={() => navigate('/generate')} className="btn-glow" style={{
            padding: '11px 28px', fontSize: 14,
            background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
            color: '#fff', boxShadow: '0 0 20px rgba(59,130,246,0.3)',
          }}>첫 코드 생성하기</button>
        </div>
      )}

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {codes.map((item, i) => (
          <div key={item.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <CodeCard
              item={item}
              onDelete={e => handleDelete(item.id, e)}
              onClick={() => navigate(`/share/${item.id}`)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
