import { Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Generator from './pages/Generator';

const nav = { display:'flex', gap:16, padding:'12px 24px',
  background:'#1e293b', alignItems:'center' };
const logo = { color:'#60a5fa', fontWeight:'bold', fontSize:18, textDecoration:'none' };
const navLink = { color:'#94a3b8', textDecoration:'none', fontSize:14 };

export default function App() {
  return (
    <div style={{ minHeight:'100vh', background:'#0f172a', color:'#e2e8f0', fontFamily:'monospace' }}>
      <nav style={nav}>
        <Link to="/" style={logo}>⚙ PLC Code Generator</Link>
        <Link to="/" style={navLink}>대시보드</Link>
        <Link to="/generate" style={navLink}>코드 생성</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/generate" element={<Generator />} />
        <Route path="/share/:id" element={<Generator />} />
      </Routes>
    </div>
  );
}
