import { useState } from 'react';
import { useTheme } from './useTheme';
import WyckoffS2Revised from './WyckoffS2Revised';
import WyckoffReconciled from './WyckoffReconciled';

const tabs = [
  { id: 'wyckoff-s2', label: 'Wyckoff S2 Revised' },
  { id: 'reconciled', label: 'Wyckoff Reconciled' },
];

function App() {
  const [active, setActive] = useState('wyckoff-s2');
  const [lang, setLang] = useState('vi');
  const theme = useTheme();

  return (
    <div style={{ fontFamily: 'sans-serif', background: theme.bg, minHeight: '100vh' }}>
      <div style={{ display: 'flex', gap: 8, padding: '12px 16px', borderBottom: `1px solid ${theme.border}`, alignItems: 'center' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            style={{
              padding: '6px 16px',
              background: active === tab.id ? '#3b82f6' : theme.bgSubtle,
              color: active === tab.id ? '#fff' : theme.text,
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            {tab.label}
          </button>
        ))}
        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={() => setLang(l => l === 'vi' ? 'en' : 'vi')}
            style={{
              padding: '6px 14px',
              background: theme.bgSubtle,
              color: theme.text,
              border: `1px solid ${theme.border}`,
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {lang === 'vi' ? 'EN' : 'VI'}
          </button>
        </div>
      </div>
      {active === 'wyckoff-s2' && <WyckoffS2Revised theme={theme} lang={lang} />}
      {active === 'reconciled' && <WyckoffReconciled theme={theme} lang={lang} />}
    </div>
  );
}

export default App;
