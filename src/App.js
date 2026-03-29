import { useState } from 'react';
import WyckoffS2Revised from './WyckoffS2Revised';
import WyckoffReconciled from './WyckoffReconciled';

const tabs = [
  { id: 'wyckoff-s2', label: 'Wyckoff S2 Revised', component: <WyckoffS2Revised /> },
  { id: 'reconciled', label: 'Wyckoff Reconciled', component: <WyckoffReconciled /> },
];

function App() {
  const [active, setActive] = useState('wyckoff-s2');

  return (
    <div style={{ fontFamily: 'sans-serif', background: '#0d0d14', minHeight: '100vh' }}>
      <div style={{ display: 'flex', gap: 8, padding: '12px 16px', borderBottom: '1px solid #222' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            style={{
              padding: '6px 16px',
              background: active === tab.id ? '#3b82f6' : '#1e1e2e',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.find((t) => t.id === active)?.component}
    </div>
  );
}

export default App;
