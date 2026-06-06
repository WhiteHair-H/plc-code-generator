import { useState, useRef, useEffect } from 'react';

const RUNG_H = 100;
const RAIL_W = 20;
const PAD_X = 60;
const PAD_TOP = 50;
const WIRE_Y = 50;
const ELEM_WIDTHS = { NO: 56, NC: 56, COIL: 62, TON: 90, CTU: 90 };

function getWidth(type) { return ELEM_WIDTHS[type] || 56; }

// 시뮬레이션: 런의 통전 여부 계산
function evaluateRung(elements, inputs) {
  let conducting = true;
  for (const el of elements) {
    const val = inputs[el.label] || false;
    if (el.type === 'NO' && !val) { conducting = false; break; }
    if (el.type === 'NC' && val)  { conducting = false; break; }
  }
  return conducting;
}

function ContactNO({ x, y, label, desc, active, onClick }) {
  const c = active ? '#22c55e' : '#60a5fa';
  const bg = active ? 'rgba(34,197,94,0.15)' : 'transparent';
  return (
    <g onClick={onClick} style={{ cursor:'pointer' }}>
      <rect x={x-4} y={y-28} width={54} height={56} fill={bg} rx={4}/>
      <line x1={x} y1={y} x2={x+20} y2={y} stroke={c} strokeWidth={2.5}/>
      <line x1={x+20} y1={y-14} x2={x+20} y2={y+14} stroke={c} strokeWidth={3}/>
      <line x1={x+26} y1={y-14} x2={x+26} y2={y+14} stroke={c} strokeWidth={3}/>
      <line x1={x+26} y1={y} x2={x+46} y2={y} stroke={c} strokeWidth={2.5}/>
      <text x={x+23} y={y-20} textAnchor="middle" fontSize={13} fill={active?'#86efac':'#93c5fd'} fontWeight="bold">{label}</text>
      <text x={x+23} y={y+30} textAnchor="middle" fontSize={11} fill="#64748b">{desc}</text>
      {active && <text x={x+23} y={y+4} textAnchor="middle" fontSize={9} fill="#22c55e">ON</text>}
    </g>
  );
}

function ContactNC({ x, y, label, desc, active, onClick }) {
  // NC: 기본값 true(닫힘), 클릭하면 false(열림)
  const conducting = !active; // active=true면 강제 열림
  const c = conducting ? '#fbbf24' : '#ef4444';
  const bg = active ? 'rgba(239,68,68,0.1)' : 'transparent';
  return (
    <g onClick={onClick} style={{ cursor:'pointer' }}>
      <rect x={x-4} y={y-28} width={54} height={56} fill={bg} rx={4}/>
      <line x1={x} y1={y} x2={x+20} y2={y} stroke={c} strokeWidth={2.5}/>
      <line x1={x+20} y1={y-14} x2={x+20} y2={y+14} stroke={c} strokeWidth={3}/>
      <line x1={x+26} y1={y-14} x2={x+26} y2={y+14} stroke={c} strokeWidth={3}/>
      <line x1={x+20} y1={y+12} x2={x+26} y2={y-12} stroke={c} strokeWidth={2}/>
      <line x1={x+26} y1={y} x2={x+46} y2={y} stroke={c} strokeWidth={2.5}/>
      <text x={x+23} y={y-20} textAnchor="middle" fontSize={13} fill={c} fontWeight="bold">{label}</text>
      <text x={x+23} y={y+30} textAnchor="middle" fontSize={11} fill="#64748b">{desc}</text>
      {active && <text x={x+23} y={y+4} textAnchor="middle" fontSize={9} fill="#ef4444">열림</text>}
    </g>
  );
}

function Coil({ x, y, label, desc, energized }) {
  const c = energized ? '#22c55e' : '#f87171';
  return (
    <g>
      <line x1={x} y1={y} x2={x+12} y2={y} stroke={c} strokeWidth={2.5}/>
      <ellipse cx={x+26} cy={y} rx={14} ry={14} fill={energized?'rgba(34,197,94,0.2)':'none'} stroke={c} strokeWidth={3}/>
      {energized && <ellipse cx={x+26} cy={y} rx={8} ry={8} fill="#22c55e" opacity={0.6}/>}
      <line x1={x+40} y1={y} x2={x+52} y2={y} stroke={c} strokeWidth={2.5}/>
      <text x={x+26} y={y-22} textAnchor="middle" fontSize={13} fill={c} fontWeight="bold">{label}</text>
      <text x={x+26} y={y+32} textAnchor="middle" fontSize={11} fill="#64748b">{desc}</text>
      <text x={x+26} y={y+5} textAnchor="middle" fontSize={10} fill={c} fontWeight="bold">
        {energized ? 'ON' : 'OFF'}
      </text>
    </g>
  );
}

function TimerBox({ x, y, label, desc, energized }) {
  const c = energized ? '#22c55e' : '#a78bfa';
  return (
    <g>
      <line x1={x} y1={y} x2={x+10} y2={y} stroke={c} strokeWidth={2.5}/>
      <rect x={x+10} y={y-18} width={60} height={36} rx={4} fill="#1e1b4b" stroke={c} strokeWidth={2.5}/>
      <text x={x+40} y={y-4} textAnchor="middle" fontSize={12} fill={c} fontWeight="bold">TON</text>
      <text x={x+40} y={y+11} textAnchor="middle" fontSize={11} fill="#c4b5fd">{label}</text>
      <line x1={x+70} y1={y} x2={x+80} y2={y} stroke={c} strokeWidth={2.5}/>
      <text x={x+40} y={y+34} textAnchor="middle" fontSize={11} fill="#64748b">{desc}</text>
    </g>
  );
}

function Rung({ rung, index, totalWidth, inputs, onToggle, coilStates }) {
  const wy = PAD_TOP + index * RUNG_H + WIRE_Y;
  const elems = (rung.elements || []).filter(e => ELEM_WIDTHS[e.type]);
  const conducting = evaluateRung(rung.elements || [], inputs);

  // 코일 레이블 수집
  const coils = elems.filter(e => e.type === 'COIL').map(e => e.label);

  let cx = PAD_X + RAIL_W + 16;
  const positioned = elems.map(el => {
    const pos = cx;
    cx += getWidth(el.type) + 20;
    return { el, x: pos };
  });

  const wireColor = conducting ? '#22c55e' : '#1e3a5f';

  return (
    <g>
      <text x={8} y={wy+4} fontSize={12} fill="#475569" fontWeight="bold">R{rung.rung}</text>
      {rung.comment && (
        <text x={PAD_X + RAIL_W + 10} y={PAD_TOP + index * RUNG_H + 18}
          fontSize={12} fill="#475569" fontStyle="italic">// {rung.comment}</text>
      )}
      {/* 통전 와이어 */}
      <line x1={PAD_X + RAIL_W} y1={wy} x2={totalWidth - PAD_X - RAIL_W} y2={wy}
        stroke={wireColor} strokeWidth={conducting ? 3 : 2}
        strokeDasharray={conducting ? 'none' : '6,3'}/>

      {positioned.map(({ el, x }) => {
        const active = inputs[el.label] || false;
        const energized = conducting && coils.includes(el.label);
        const toggle = () => onToggle(el.label);
        const p = { x, y: wy, label: el.label||'', desc: el.desc||'' };
        switch (el.type) {
          case 'NO':   return <ContactNO  key={x} {...p} active={active} onClick={toggle}/>;
          case 'NC':   return <ContactNC  key={x} {...p} active={active} onClick={toggle}/>;
          case 'COIL': return <Coil       key={x} {...p} energized={conducting}/>;
          case 'TON':
          case 'CTU':  return <TimerBox   key={x} {...p} energized={conducting}/>;
          default:     return null;
        }
      })}
    </g>
  );
}

function calcMinWidth(rungs) {
  let max = 0;
  for (const rung of rungs) {
    const elems = (rung.elements || []).filter(e => ELEM_WIDTHS[e.type]);
    const w = elems.reduce((s, e) => s + getWidth(e.type) + 20, 0);
    max = Math.max(max, w);
  }
  return Math.max(700, PAD_X * 2 + RAIL_W * 2 + max + 60);
}

export default function LadderDiagram({ data }) {
  const [zoom, setZoom] = useState(1);
  const [inputs, setInputs] = useState({});
  const [simMode, setSimMode] = useState(false);
  const containerRef = useRef();

  if (!data || data.length === 0) return null;

  const svgW = calcMinWidth(data);
  const svgH = PAD_TOP + data.length * RUNG_H + 40;

  const toggleInput = (label) => {
    if (!simMode) return;
    setInputs(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const resetSim = () => setInputs({});

  return (
    <div style={{ background:'#0f172a', borderRadius:8, padding:20, marginTop:16 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12, flexWrap:'wrap', gap:8 }}>
        <h3 style={{ color:'#60a5fa', margin:0 }}>📊 래더 다이어그램</h3>
        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
          {/* 시뮬레이션 토글 */}
          <button onClick={() => { setSimMode(m => !m); resetSim(); }}
            style={{ padding:'5px 14px', background: simMode ? '#166534' : '#1e293b',
              border:`1px solid ${simMode ? '#22c55e' : '#334155'}`,
              color: simMode ? '#86efac' : '#94a3b8',
              borderRadius:4, cursor:'pointer', fontSize:13, fontWeight:'bold' }}>
            {simMode ? '▶ 시뮬레이션 ON' : '▶ 시뮬레이션'}
          </button>
          {simMode && (
            <button onClick={resetSim}
              style={{ padding:'5px 10px', background:'#1e293b', border:'1px solid #334155',
                color:'#94a3b8', borderRadius:4, cursor:'pointer', fontSize:12 }}>초기화</button>
          )}
          {/* 줌 */}
          <button onClick={() => setZoom(z => Math.max(0.4, z-0.1))}
            style={{ padding:'4px 12px', background:'#1e293b', border:'1px solid #334155', color:'#e2e8f0', borderRadius:4, cursor:'pointer', fontSize:16 }}>－</button>
          <span style={{ color:'#94a3b8', fontSize:13, minWidth:44, textAlign:'center' }}>{Math.round(zoom*100)}%</span>
          <button onClick={() => setZoom(z => Math.min(2, z+0.1))}
            style={{ padding:'4px 12px', background:'#1e293b', border:'1px solid #334155', color:'#e2e8f0', borderRadius:4, cursor:'pointer', fontSize:16 }}>＋</button>
          <button onClick={() => setZoom(1)}
            style={{ padding:'4px 10px', background:'#1e293b', border:'1px solid #334155', color:'#94a3b8', borderRadius:4, cursor:'pointer', fontSize:12 }}>초기화</button>
        </div>
      </div>

      {simMode && (
        <div style={{ background:'#0d2137', border:'1px solid #1e3a5f', borderRadius:6,
          padding:'8px 14px', marginBottom:12, fontSize:12, color:'#60a5fa' }}>
          💡 접점(NO/NC)을 클릭하면 ON/OFF 전환 — 코일 상태가 실시간으로 변경됩니다
        </div>
      )}

      {/* 범례 */}
      <div style={{ display:'flex', gap:16, marginBottom:12, flexWrap:'wrap' }}>
        {[['#60a5fa','─┤ ├─ NO 접점'],['#fbbf24','─┤/├─ NC 접점'],
          ['#f87171','─( )─ 출력 코일'],['#a78bfa','[TON] 타이머'],
          ['#22c55e','■ 통전 상태']].map(([c,t])=>(
          <span key={t} style={{ color:c, fontSize:12 }}>■ {t}</span>
        ))}
      </div>

      <div ref={containerRef} style={{ overflowX:'auto', overflowY:'auto',
        maxHeight:600, border:'1px solid #1e293b', borderRadius:6 }}>
        <svg width={svgW*zoom} height={svgH*zoom} viewBox={`0 0 ${svgW} ${svgH}`} style={{ display:'block' }}>
          {/* 좌측 파워레일 L+ */}
          <rect x={PAD_X} y={PAD_TOP-10} width={RAIL_W} height={svgH-PAD_TOP} fill="#1d4ed8" rx={4}/>
          <text x={PAD_X+RAIL_W/2} y={PAD_TOP-16} textAnchor="middle" fontSize={13} fill="#93c5fd" fontWeight="bold">L+</text>
          {/* 우측 파워레일 N */}
          <rect x={svgW-PAD_X-RAIL_W} y={PAD_TOP-10} width={RAIL_W} height={svgH-PAD_TOP} fill="#991b1b" rx={4}/>
          <text x={svgW-PAD_X-RAIL_W/2} y={PAD_TOP-16} textAnchor="middle" fontSize={13} fill="#fca5a5" fontWeight="bold">N</text>

          {data.map((rung, i) => (
            <Rung key={i} rung={rung} index={i} totalWidth={svgW}
              inputs={inputs} onToggle={toggleInput} coilStates={{}}/>
          ))}
        </svg>
      </div>
    </div>
  );
}
