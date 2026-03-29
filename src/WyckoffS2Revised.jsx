import { useState } from "react";

// ─── Translations ────────────────────────────────────────────────────────────
const VI_STRINGS = {
  subtitleText: null, // rendered inline with JSX
  insightTitle: "⚡ INSIGHT CHÍNH — Tại sao mapping này chính xác hơn",
  tabCalc: "Tính toán",
  tabTargets: "Mục tiêu",
  eventsHeader: "Revised Event Mapping",
  coreParamsTitle: "Tham số cốt lõi (Revised)",
  calcMethodsTitle: "3 phương pháp tính target",
  targetsHeader: "Mục tiêu giá — So sánh 3 phân tích",
  tableNotesHeader: "Ghi chú",
  verdictTitle: "⚡ KẾT LUẬN CUỐI — Schematic #2 Revised",
  disclaimer: "⚠️ Phân tích mô hình Wyckoff, không phải lời khuyên đầu tư. Thị trường có thể diễn biến khác.",
  pctSuffix: "từ UTAD",
  coreParamSubs: { utadAboveBC: "trên BC", trapLabel: "Trap rất lớn" },
};

const EN_STRINGS = {
  subtitleText: null,
  insightTitle: "⚡ KEY INSIGHT — Why this mapping is more accurate",
  tabCalc: "Calculations",
  tabTargets: "Targets",
  eventsHeader: "Revised Event Mapping",
  coreParamsTitle: "Core Parameters (Revised)",
  calcMethodsTitle: "3 Target Calculation Methods",
  targetsHeader: "Price Targets — Comparison of 3 Analyses",
  tableNotesHeader: "Notes",
  verdictTitle: "⚡ FINAL VERDICT — Schematic #2 Revised",
  disclaimer: "⚠️ This is a Wyckoff model analysis, not investment advice. Markets may develop differently.",
  pctSuffix: "from UTAD",
  coreParamSubs: { utadAboveBC: "above BC", trapLabel: "Very large trap" },
};
// ─────────────────────────────────────────────────────────────────────────────

const PHASES = [
  { label: "Markup", color: "#22c55e", flex: 12 },
  { label: "Phase A", color: "#f59e0b", flex: 14 },
  { label: "Phase B", color: "#f97316", flex: 16 },
  { label: "Phase C", color: "#e11d48", flex: 10 },
  { label: "Phase D", color: "#dc2626", flex: 18 },
  { label: "Phase E", color: "#7f1d1d", flex: 30 },
];

// Corrected price data with proper timeline
// Y scale: 0 = $140K, 95 = $10K (inverted, higher price = lower Y)
// X scale: 0-100 representing timeline
const priceToY = (price) => 95 - ((price - 10000) / (140000 - 10000)) * 95;


const EVENTS = [
  { label: "Start", price: 16000, date: "11/2022", x: 2 },
  { label: "PSY", price: 73700, date: "03/2024", x: 14 },
  { label: "BC", price: 109000, date: "01/2025", x: 26, important: true },
  { label: "AR", price: 74000, date: "04/2025", x: 33, important: true },
  { label: "ST", price: 111000, date: "05/2025", x: 38 },
  { label: "UT", price: 124000, date: "08/2025", x: 44 },
  { label: "UTAD", price: 126000, date: "10/2025", x: 49, highlight: true },
  { label: "SOW₁", price: 84000, date: "11/2025", x: 56 },
  { label: "LPSY₁", price: 100000, date: "12/2025", x: 62 },
  { label: "SOW₂", price: 77000, date: "01/2026", x: 67 },
  { label: "SOW₃", price: 60000, date: "02/2026", x: 72 },
  { label: "LPSY₂", price: 73000, date: "03/2026", x: 76 },
].map(e => ({ ...e, y: priceToY(e.price) }));

const PRICE_LINE = [
  { x: 2, y: priceToY(16000) },
  { x: 6, y: priceToY(30000) },
  { x: 10, y: priceToY(52000) },
  { x: 14, y: priceToY(73700) },
  { x: 17, y: priceToY(60000) },
  { x: 20, y: priceToY(72000) },
  { x: 23, y: priceToY(95000) },
  { x: 26, y: priceToY(109000) },
  { x: 28, y: priceToY(98000) },
  { x: 30, y: priceToY(85000) },
  { x: 33, y: priceToY(74000) },
  { x: 35, y: priceToY(85000) },
  { x: 38, y: priceToY(111000) },
  { x: 40, y: priceToY(105000) },
  { x: 42, y: priceToY(115000) },
  { x: 44, y: priceToY(124000) },
  { x: 46, y: priceToY(118000) },
  { x: 49, y: priceToY(126000) },
  { x: 51, y: priceToY(113000) },
  { x: 53, y: priceToY(105000) },
  { x: 56, y: priceToY(84000) },
  { x: 58, y: priceToY(92000) },
  { x: 60, y: priceToY(88000) },
  { x: 62, y: priceToY(100000) },
  { x: 64, y: priceToY(90000) },
  { x: 67, y: priceToY(77000) },
  { x: 69, y: priceToY(70000) },
  { x: 72, y: priceToY(60000) },
  { x: 74, y: priceToY(65000) },
  { x: 76, y: priceToY(73000) },
  { x: 78, y: priceToY(66000) },
];

const MARKDOWN = [
  { x: 78, y: priceToY(66000) },
  { x: 81, y: priceToY(62000) },
  { x: 83, y: priceToY(58000) },
  { x: 85, y: priceToY(52000) },
  { x: 87, y: priceToY(48000) },
  { x: 89, y: priceToY(42000) },
  { x: 91, y: priceToY(38000) },
  { x: 93, y: priceToY(35000) },
  { x: 96, y: priceToY(30000) },
  { x: 98, y: priceToY(28000) },
];

function toPath(pts) {
  if (!pts.length) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
    const cpx2 = prev.x + (curr.x - prev.x) * 0.6;
    d += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  return d;
}

function toLine(pts) {
  return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
}

const TARGETS_NEW = [
  {
    price: "$39,000", pct: "−69%", y: priceToY(39000), color: "#f59e0b", conf: 3,
    label: "Target 1 — Wyckoff Count",
    method: "AR ($74K) − Range ($35K) = $39K",
    detail: {
      vi: "Range = BC ($109K) − AR ($74K) = $35K. Projection = AR − Range",
      en: "Range = BC ($109K) − AR ($74K) = $35K. Projection = AR − Range",
    },
    s1_compare: "$42K",
    delta: "−$3K",
  },
  {
    price: "$28,000", pct: "−78%", y: priceToY(28000), color: "#ef4444", conf: 4, primary: true,
    label: "Target 2 — Log Fib + UTAD Premium",
    method: "Log Fib 61.8% ($16K→$126K) ≈ $29.6K, UTAD cascade → $28K",
    detail: {
      vi: "UTAD $17K trên BC tạo massive trapped longs. Cascade kéo giá dưới Fib level",
      en: "UTAD $17K above BC creates massive trapped longs. Cascade drives price below Fib level",
    },
    s1_compare: "$30K",
    delta: "−$2K",
  },
  {
    price: "$21,000", pct: "−83%", y: priceToY(21000), color: "#991b1b", conf: 2,
    label: "Target 3 — AR − 1.5× Range + OG dump",
    method: "AR ($74K) − 1.5×$35K = $21.5K ≈ $21K",
    detail: {
      vi: "1.5× range projection nếu OG dump toàn bộ + macro crisis kéo dài",
      en: "1.5× range projection if OGs dump everything + prolonged macro crisis",
    },
    s1_compare: "$20K",
    delta: "~Same",
  },
];

const EVENTS_DATA = [
  { ph: "—", ev: "Accumulation + Markup", val: "$16K → $73.7K", dt: "11/2022 – 03/2024", desc: { vi: "Smart money tích lũy ở $16-20K. Rally 16 tháng, 4.6×", en: "Smart money accumulated at $16-20K. 16-month rally, 4.6×" }, col: "#22c55e" },
  { ph: "A", ev: "PSY — Preliminary Supply", val: "$73,700", dt: "03/2024", desc: { vi: "Supply đầu tiên: đỉnh trước halving 04/2024, profit-taking từ cycle trước", en: "First supply: pre-halving peak 04/2024, profit-taking from previous cycle" }, col: "#f59e0b" },
  { ph: "A", ev: "BC — Buying Climax ⭐", val: "$109,000", dt: "01/2025", desc: { vi: "Trump inauguration + BTC Reserve narrative + MicroStrategy mua $1.1B. Volume kỷ lục. ĐÂY LÀ ĐỈNH THẬT CỦA DEMAND", en: "Trump inauguration + BTC Reserve narrative + MicroStrategy bought $1.1B. Record volume. THIS IS THE TRUE PEAK OF DEMAND" }, col: "#f59e0b", key: true },
  { ph: "A", ev: "AR — Automatic Reaction ⭐", val: "$74,000", dt: "04/2025", desc: { vi: "Tariff crash \"Liberation Day\". Giảm 32% trong 3 tháng. Xác lập đáy trading range", en: "Tariff crash \"Liberation Day\". 32% decline in 3 months. Established bottom of trading range" }, col: "#f59e0b", key: true },
  { ph: "B", ev: "ST — Secondary Test of BC", val: "$111,000", dt: "05/2025", desc: { vi: "Test lại vùng BC $109K với volume THẤP HƠN — dấu hiệu cổ điển Phase B", en: "Retested BC $109K with LOWER volume — classic Phase B signal" }, col: "#f97316" },
  { ph: "B", ev: "Phase B Distribution", val: "$105K–$124K", dt: "05–08/2025", desc: { vi: "OG phân phối chậm trong trading range. Giá sideway/nhích lên nhưng OG liên tục bán", en: "OGs slowly distributing within trading range. Price drifts sideways/up while OGs continuously sell" }, col: "#f97316" },
  { ph: "C", ev: "UT — Upthrust", val: "$124,000", dt: "08/2025", desc: { vi: "Phá trên BC $109K lần 1. Trap #1: breakout traders FOMO vào", en: "First break above BC $109K. Trap #1: breakout traders FOMOed in" }, col: "#e11d48", hl: true },
  { ph: "C", ev: "UTAD — Bull Trap ⚠️", val: "$126,000", dt: "10/2025", desc: { vi: "CÚ TRAP CUỐI: +$17K trên BC. 100% tariff China → crash ngay sau → OG bán hết hàng ở đỉnh", en: "FINAL TRAP: +$17K above BC. 100% China tariff → immediate crash → OGs sold everything at the top" }, col: "#e11d48", hl: true },
  { ph: "D", ev: "SOW₁ — Phá dưới AR", val: "$84,000", dt: "11/2025", desc: { vi: "Phá dưới AR $74K...không, nhưng phá mạnh dưới BC. Distribution xác nhận", en: "Broke below AR $74K...not quite, but sharply below BC. Distribution confirmed" }, col: "#dc2626" },
  { ph: "D", ev: "LPSY₁", val: "$100,000", dt: "12/2025", desc: { vi: "Rally yếu, không lấy lại $109K. Cơ hội bán cuối cho institutional", en: "Weak rally, failed to reclaim $109K. Last selling opportunity for institutions" }, col: "#dc2626" },
  { ph: "D", ev: "SOW₂ — Phá dưới AR!", val: "$77,000→$72,800", dt: "01–02/2026", desc: { vi: "PHÁ DƯỚI AR $74K lần đầu. Đây là xác nhận cuối cùng — Phase D→E", en: "FIRST BREAK BELOW AR $74K. This is the final confirmation — Phase D→E" }, col: "#dc2626", key: true },
  { ph: "D", ev: "SOW₃ — Cascade", val: "$60,000", dt: "02/2026", desc: { vi: "UTAD-trapped longs ($120K+) capitulate. Miner bán ra do margin giảm", en: "UTAD-trapped longs ($120K+) capitulate. Miners sell as margins shrink" }, col: "#7f1d1d" },
  { ph: "E", ev: "LPSY₂ — Dead Cat Bounce", val: "$73,000", dt: "03/2026", desc: { vi: "Bounce yếu, test lại AR cũ $74K từ dưới lên — thất bại", en: "Weak bounce, retested old AR $74K from below — failed" }, col: "#7f1d1d" },
  { ph: "E", ev: "📍 HIỆN TẠI", val: "$66,000", dt: "28/03/2026", desc: { vi: "Bắt đầu Phase E Markdown. AR cũ $74K giờ là resistance", en: "Phase E Markdown begins. Old AR $74K is now resistance" }, col: "#3b82f6", current: true },
];

const TABLE_ROWS = [
  ["Conservative", "$42K", "$38K", "$39K", { vi: "Range projection chuẩn hơn", en: "More accurate range projection" }],
  ["Base Case", "$30K", "$28K", "$28K", { vi: "Log Fib 61.8% — primary target", en: "Log Fib 61.8% — primary target" }],
  ["Extreme", "$20K", "$20K", "$21K", { vi: "1.5× range + full OG exit", en: "1.5× range + full OG exit" }],
  ["BC", "$126K", "$111K", "$109K", { vi: "Revised: đỉnh 01/2025", en: "Revised: peak 01/2025" }],
  ["AR", "$84K", "$90K", "$74K", { vi: "Revised: đáy tariff 04/2025", en: "Revised: tariff bottom 04/2025" }],
  ["Range", "$42K", "$21K", "$35K", { vi: "BC − AR", en: "BC − AR" }],
  ["UTAD", "N/A", "$126K", "$126K", { vi: "Cùng UTAD, khác BC", en: "Same UTAD, different BC" }],
  ["UTAD/BC gap", "—", "+$15K", "+$17K", { vi: "Trap lớn hơn = bearish hơn", en: "Larger trap = more bearish" }],
];

const CALC_METHODS = [
  {
    title: "① Wyckoff Count (1× Range Projection)",
    color: "#f59e0b",
    steps: [
      { vi: "Range = BC − AR = $109K − $74K = $35,000", en: "Range = BC − AR = $109K − $74K = $35,000" },
      { vi: "Target = AR − Range = $74K − $35K = $39,000", en: "Target = AR − Range = $74K − $35K = $39,000" },
      { vi: "Kiểm tra: $39K = −69% từ UTAD $126K ✓", en: "Check: $39K = −69% from UTAD $126K ✓" },
      { vi: "So với Schematic #1 ($42K): Thấp hơn $3K vì AR chính xác hơn", en: "vs Schematic #1 ($42K): $3K lower due to more precise AR" },
    ],
    result: "$39,000",
  },
  {
    title: "② Log Fibonacci 61.8% + UTAD Premium",
    color: "#ef4444",
    steps: [
      { vi: "Markup: $16K → $126K = 7.875× (log scale)", en: "Markup: $16K → $126K = 7.875× (log scale)" },
      { vi: "Log Fib 61.8%: $126K ÷ (7.875^0.618) = $29,600", en: "Log Fib 61.8%: $126K ÷ (7.875^0.618) = $29,600" },
      { vi: "UTAD premium: $17K trap → cascade -5% thêm", en: "UTAD premium: $17K trap → additional -5% cascade" },
      { vi: "$29,600 × 0.95 ≈ $28,000", en: "$29,600 × 0.95 ≈ $28,000" },
      { vi: "Kiểm tra: $28K = −78% từ UTAD ✓ (phù hợp cycle 2021→2022: −77%)", en: "Check: $28K = −78% from UTAD ✓ (matches 2021→2022 cycle: −77%)" },
    ],
    result: "$28,000",
  },
  {
    title: "③ 1.5× Range + OG Full Distribution",
    color: "#991b1b",
    steps: [
      { vi: "AR − 1.5× Range = $74K − ($35K × 1.5) = $74K − $52.5K = $21,500", en: "AR − 1.5× Range = $74K − ($35K × 1.5) = $74K − $52.5K = $21,500" },
      { vi: "≈ $21,000 (−83% từ UTAD)", en: "≈ $21,000 (−83% from UTAD)" },
      { vi: "Trùng với: 2024 pre-ETF approval zone ($40-42K → breakdown target)", en: "Aligns with: 2024 pre-ETF approval zone ($40-42K → breakdown target)" },
      { vi: "Chỉ xảy ra nếu: OG dump hết + Iran conflict kéo dài + no rate cut", en: "Only if: OGs dump everything + prolonged Iran conflict + no rate cut" },
    ],
    result: "$21,000",
  },
];

export default function WyckoffS2Corrected({ theme, lang }) {
  const [tab, setTab] = useState("chart");
  const [hoverPhase, setHoverPhase] = useState(null);

  const t = lang === "en" ? EN_STRINGS : VI_STRINGS;

  const bcY = priceToY(109000);
  const arY = priceToY(74000);
  const utadY = priceToY(126000);

  return (
    <div style={{
      minHeight: "100vh",
      background: theme.bg,
      color: theme.text,
      fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
      padding: "16px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;600;700&family=Instrument+Serif&display=swap');
        * { box-sizing: border-box; }
        @keyframes pulse { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }
        @keyframes glow-pulse { 0%,100% { box-shadow: 0 0 4px #e11d4833; } 50% { box-shadow: 0 0 12px #e11d4866; } }
        .hover-row:hover { background: ${theme.hoverBg} !important; }
      `}</style>

      <div style={{ maxWidth: 920, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 20, borderBottom: `1px solid ${theme.border}`, paddingBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 8, letterSpacing: 5, color: theme.textFaint }}>WYCKOFF DISTRIBUTION</span>
            <span style={{ fontSize: 8, background: "#e11d48", color: "#fff", padding: "2px 7px", borderRadius: 3, fontWeight: 700 }}>
              SCHEMATIC #2 — REVISED
            </span>
          </div>
          <h1 style={{
            fontSize: 22, fontWeight: 700, margin: 0,
            fontFamily: "'Instrument Serif', serif", color: theme.textHeading,
          }}>
            BC = $109K <span style={{ color: "#e11d48" }}>→ AR = $74K</span> <span style={{ color: "#f59e0b" }}>→ UTAD = $126K</span>
          </h1>
          <div style={{ fontSize: 10, color: theme.textFaint, marginTop: 6, lineHeight: 1.5 }}>
            {lang === "en" ? (
              <>
                Correction: Peak $109K (01/2025) is <span style={{ color: "#f59e0b" }}>BC</span> ·
                Bottom $74K (04/2025) is <span style={{ color: "#22c55e" }}>AR</span> ·
                Range = <span style={{ color: theme.textHeading }}>$35,000</span> ·
                UTAD exceeded BC by $17K
              </>
            ) : (
              <>
                Correction: Đỉnh $109K (01/2025) là <span style={{ color: "#f59e0b" }}>BC</span> ·
                Đáy $74K (04/2025) là <span style={{ color: "#22c55e" }}>AR</span> ·
                Range = <span style={{ color: theme.textHeading }}>$35,000</span> ·
                UTAD vượt BC $17K
              </>
            )}
          </div>
        </div>

        {/* Key Insight Box */}
        <div style={{
          background: "#e11d4808", border: "1px solid #e11d4822",
          borderRadius: 6, padding: 12, marginBottom: 16,
          animation: "glow-pulse 3s infinite",
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#e11d48", marginBottom: 4 }}>
            {t.insightTitle}
          </div>
          <div style={{ fontSize: 10, color: theme.textMid, lineHeight: 1.7 }}>
            {lang === "en" ? (
              <>
                $109K (01/2025) has all the hallmarks of a <strong style={{ color: "#f59e0b" }}>Buying Climax</strong>: extreme volume around Trump inauguration,
                retail FOMO into Bitcoin Reserve narrative. The drop to $74K (04/2025 tariff crash) is a natural
                <strong style={{ color: "#22c55e" }}> Automatic Reaction</strong> — 32% decline in 3 months.
                The entire $74K→$126K phase (04–10/2025) is <strong style={{ color: "#e11d48" }}>Phase B+C</strong> —
                OGs distributing while price climbs to create the UTAD trap, not a new bull run.
              </>
            ) : (
              <>
                $109K (01/2025) có tất cả đặc điểm của <strong style={{ color: "#f59e0b" }}>Buying Climax</strong>: volume cực cao quanh inauguration Trump,
                FOMO retail vào Bitcoin Reserve narrative. Cú rơi về $74K (04/2025 tariff crash) là
                <strong style={{ color: "#22c55e" }}> Automatic Reaction</strong> tự nhiên — giảm 32% trong 3 tháng.
                Toàn bộ giai đoạn $74K→$126K (04–10/2025) là <strong style={{ color: "#e11d48" }}>Phase B+C</strong> —
                OG phân phối trong khi giá leo lên tạo UTAD trap, không phải bull run mới.
              </>
            )}
          </div>
        </div>

        {/* Phase Strip */}
        <div style={{ display: "flex", height: 22, borderRadius: 3, overflow: "hidden", marginBottom: 14, border: `1px solid ${theme.border}` }}>
          {PHASES.map((p, i) => (
            <div key={i}
              onMouseEnter={() => setHoverPhase(i)}
              onMouseLeave={() => setHoverPhase(null)}
              style={{
                flex: p.flex,
                background: hoverPhase === i ? p.color + "33" : p.color + "11",
                borderRight: i < 5 ? `1px solid ${theme.border}` : "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 7.5, fontWeight: 600, color: p.color, cursor: "pointer",
                transition: "all 0.15s", letterSpacing: 0.3,
              }}
            >
              {p.flex > 13 ? p.label : p.label.replace("Phase ", "")}
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: 14 }}>
          {["chart", "events", "calc", "targets"].map(tabKey => (
            <button key={tabKey} onClick={() => setTab(tabKey)} style={{
              background: tab === tabKey ? theme.border : "transparent",
              color: tab === tabKey ? theme.textHeading : theme.textFaint,
              border: `1px solid ${theme.border}`, padding: "5px 14px",
              fontSize: 9, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              borderRadius: tabKey === "chart" ? "4px 0 0 4px" : tabKey === "targets" ? "0 4px 4px 0" : 0,
              textTransform: "uppercase", letterSpacing: 1,
            }}>
              {tabKey === "calc" ? t.tabCalc : tabKey === "targets" ? t.tabTargets : tabKey === "events" ? "Events" : "Chart"}
            </button>
          ))}
        </div>

        {/* ===== CHART ===== */}
        {tab === "chart" && (
          <div style={{
            background: theme.bgCard, border: `1px solid ${theme.border}`,
            borderRadius: 8, padding: "18px 12px 8px", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0, opacity: 0.3,
              backgroundImage: `linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }} />

            <svg viewBox="-5 -4 112 106" style={{ width: "100%", display: "block" }}>
              <defs>
                <linearGradient id="utadZone" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e11d48" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#e11d48" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="mdZone" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#991b1b" stopOpacity="0.06" />
                  <stop offset="100%" stopColor="#991b1b" stopOpacity="0.02" />
                </linearGradient>
                <marker id="arr2" markerWidth="5" markerHeight="4" refX="5" refY="2" orient="auto">
                  <polygon points="0 0, 5 2, 0 4" fill="#ef4444" />
                </marker>
                <filter id="gl">
                  <feGaussianBlur stdDeviation="1" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Price grid */}
              {[126000, 109000, 100000, 74000, 60000, 39000, 28000, 21000, 16000].map((p, i) => (
                <g key={i}>
                  <line x1={0} y1={priceToY(p)} x2={100} y2={priceToY(p)} style={{ stroke: theme.gridLine }} strokeWidth={0.3} />
                  <text x={-2} y={priceToY(p) + 0.8} style={{ fill: theme.gridLabel }} fontSize={1.6} textAnchor="end" fontFamily="monospace">
                    ${p >= 1000 ? `${p / 1000}K` : p}
                  </text>
                </g>
              ))}

              {/* BC Resistance line */}
              <line x1={26} y1={bcY} x2={76} y2={bcY} stroke="#f59e0b" strokeWidth={0.3} strokeDasharray="1.5,1" opacity={0.4} />
              <text x={25} y={bcY - 1.2} fill="#f59e0b" fontSize={1.8} textAnchor="end" opacity={0.6}>BC $109K</text>

              {/* AR Support line */}
              <line x1={33} y1={arY} x2={76} y2={arY} stroke="#22c55e" strokeWidth={0.3} strokeDasharray="1.5,1" opacity={0.4} />
              <text x={32} y={arY + 3} fill="#22c55e" fontSize={1.8} textAnchor="end" opacity={0.6}>AR $74K</text>

              {/* Trading Range box */}
              <rect x={26} y={bcY} width={30} height={arY - bcY} fill="none" stroke="#f97316" strokeWidth={0.2} strokeDasharray="1,1" opacity={0.3} />
              <text x={41} y={bcY + (arY - bcY) / 2 + 0.5} fill="#f97316" fontSize={2} textAnchor="middle" opacity={0.35} fontWeight="600">
                RANGE $35K
              </text>

              {/* UTAD Zone above BC */}
              <rect x={42} y={utadY - 1} width={10} height={bcY - utadY + 2} fill="url(#utadZone)" rx={1} />
              <line x1={42} y1={utadY} x2={52} y2={utadY} stroke="#e11d48" strokeWidth={0.35} strokeDasharray="1,0.5" opacity={0.7} />
              <text x={47} y={utadY - 2.5} fill="#e11d48" fontSize={2.2} textAnchor="middle" fontWeight="700" filter="url(#gl)">
                UTAD $126K
              </text>
              <text x={47} y={utadY - 0.5} fill="#e11d48" fontSize={1.4} textAnchor="middle" opacity={0.6}>
                +$17K {t.coreParamSubs.utadAboveBC}
              </text>

              {/* Markdown zone */}
              <rect x={76} y={priceToY(66000)} width={24} height={priceToY(20000) - priceToY(66000)} fill="url(#mdZone)" />

              {/* Main price curve */}
              <path d={toPath(PRICE_LINE)} fill="none" style={{ stroke: theme.priceLine }} strokeWidth={0.65} />

              {/* Markdown projection */}
              <path d={toLine(MARKDOWN)} fill="none" stroke="#ef4444" strokeWidth={0.5} strokeDasharray="2,1" opacity={0.55} />

              {/* Target lines */}
              {TARGETS_NEW.map((tgt, i) => (
                <g key={i}>
                  <line x1={80} y1={tgt.y} x2={99} y2={tgt.y} stroke={tgt.color} strokeWidth={0.3} strokeDasharray="1.5,1" opacity={0.5} />
                  <rect x={87} y={tgt.y - 2} width={11} height={4} rx={0.8} style={{ fill: theme.bg }} stroke={tgt.color} strokeWidth={0.25} />
                  <text x={92.5} y={tgt.y + 0.6} fill={tgt.color} fontSize={2} textAnchor="middle" fontWeight="700">{tgt.price}</text>
                  <text x={86} y={tgt.y + 0.5} fill={tgt.color} fontSize={1.3} textAnchor="end" opacity={0.5}>{tgt.pct}</text>
                </g>
              ))}

              {/* Event dots */}
              {EVENTS.map((e, i) => (
                <g key={i}>
                  {e.highlight ? (
                    <>
                      <circle cx={e.x} cy={e.y} r={2.2} fill="none" stroke="#e11d48" strokeWidth={0.25} style={{ animation: "pulse 1.5s infinite" }} />
                      <circle cx={e.x} cy={e.y} r={1} fill="#e11d48" opacity={0.8} filter="url(#gl)" />
                    </>
                  ) : e.important ? (
                    <>
                      <circle cx={e.x} cy={e.y} r={1.5} fill="none" stroke="#f59e0b" strokeWidth={0.3} />
                      <circle cx={e.x} cy={e.y} r={0.6} fill="#f59e0b" />
                    </>
                  ) : (
                    <>
                      <circle cx={e.x} cy={e.y} r={1} style={{ fill: theme.bg }} stroke={theme.textSoft} strokeWidth={0.2} />
                      <circle cx={e.x} cy={e.y} r={0.35} style={{ fill: theme.textSoft }} />
                    </>
                  )}
                  <text x={e.x} y={e.y - (e.highlight ? 3.5 : 2.5)}
                    fill={e.highlight ? "#e11d48" : e.important ? "#f59e0b" : theme.textSoft}
                    fontSize={e.highlight || e.important ? 2.2 : 1.9}
                    textAnchor="middle" fontWeight="700">
                    {e.label}
                  </text>
                  <text x={e.x} y={e.y - (e.highlight ? 1.2 : 0.5)} style={{ fill: theme.textDim }} fontSize={1.5} textAnchor="middle">
                    ${e.price / 1000}K
                  </text>
                </g>
              ))}

              {/* Current position */}
              <g>
                <circle cx={78} cy={priceToY(66000)} r={1.8} fill="none" stroke="#3b82f6" strokeWidth={0.25} style={{ animation: "pulse 2s infinite" }} />
                <circle cx={78} cy={priceToY(66000)} r={0.6} fill="#3b82f6" />
                <text x={78} y={priceToY(66000) + 4} fill="#3b82f6" fontSize={1.8} textAnchor="middle" fontWeight="700">NOW $66K</text>
              </g>

              {/* Markdown arrow */}
              <path d="M 80 55 Q 90 65 96 75" fill="none" stroke="#ef4444" strokeWidth={0.45} markerEnd="url(#arr2)" opacity={0.4} />
            </svg>
          </div>
        )}

        {/* ===== EVENTS ===== */}
        {tab === "events" && (
          <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#e11d48", marginBottom: 14, letterSpacing: 2, textTransform: "uppercase" }}>
              {t.eventsHeader}
            </div>
            <div style={{ display: "grid", gap: 5 }}>
              {EVENTS_DATA.map((item, i) => (
                <div key={i} className="hover-row" style={{
                  display: "grid", gridTemplateColumns: "36px 1fr", gap: 8,
                  padding: "7px 10px", borderRadius: 4,
                  borderLeft: `2px solid ${item.col}`,
                  background: item.current ? "#3b82f60a" : item.hl ? "#e11d4806" : item.key ? "#f59e0b06" : "transparent",
                }}>
                  <div style={{ fontSize: 8, color: theme.textVeryFaint, fontWeight: 600, paddingTop: 1 }}>
                    {item.ph === "—" ? "↗" : `Ph.${item.ph}`}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: item.hl ? "#e11d48" : item.current ? "#3b82f6" : item.key ? "#f59e0b" : theme.textStrong }}>
                      {item.ev}
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                      <span style={{ fontSize: 10, color: "#f59e0b" }}>{item.val}</span>
                      <span style={{ fontSize: 10, color: theme.textVeryFaint }}>{item.dt}</span>
                    </div>
                    <div style={{ fontSize: 10, color: theme.textDim, marginTop: 2, lineHeight: 1.5 }}>{item.desc[lang] || item.desc.vi}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== CALCULATIONS ===== */}
        {tab === "calc" && (
          <div style={{ display: "grid", gap: 14 }}>
            {/* Core Parameters */}
            <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#8b5cf6", marginBottom: 12, letterSpacing: 2, textTransform: "uppercase" }}>
                {t.coreParamsTitle}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { label: "BC (Buying Climax)", value: "$109,000", sub: "01/2025", color: "#f59e0b" },
                  { label: "AR (Automatic Reaction)", value: "$74,000", sub: "04/2025", color: "#22c55e" },
                  { label: "UTAD (Bull Trap)", value: "$126,000", sub: "10/2025", color: "#e11d48" },
                  { label: "Trading Range", value: "$35,000", sub: "BC − AR", color: "#f97316" },
                  { label: "UTAD overshoot", value: "+$17,000", sub: t.coreParamSubs.utadAboveBC, color: "#e11d48" },
                  { label: "UTAD / BC ratio", value: "115.6%", sub: t.coreParamSubs.trapLabel, color: "#e11d48" },
                ].map((p, i) => (
                  <div key={i} style={{ padding: 10, background: theme.bgSubtle, borderRadius: 5, borderLeft: `2px solid ${p.color}` }}>
                    <div style={{ fontSize: 9, color: theme.textFaint, marginBottom: 3 }}>{p.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: p.color, fontFamily: "'Instrument Serif', serif" }}>{p.value}</div>
                    <div style={{ fontSize: 9, color: theme.textVeryFaint }}>{p.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculation Methods */}
            <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#f59e0b", marginBottom: 14, letterSpacing: 2, textTransform: "uppercase" }}>
                {t.calcMethodsTitle}
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                {CALC_METHODS.map((calc, i) => (
                  <div key={i} style={{ padding: 12, background: theme.bgSubtle, borderRadius: 6, borderLeft: `2px solid ${calc.color}` }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: calc.color, marginBottom: 8 }}>{calc.title}</div>
                    <div style={{ fontSize: 10, color: theme.textDim, lineHeight: 1.8 }}>
                      {calc.steps.map((s, j) => <div key={j} style={{ paddingLeft: 8, borderLeft: `1px solid ${calc.color}22` }}>→ {s[lang] || s.vi}</div>)}
                    </div>
                    <div style={{ marginTop: 8, fontSize: 14, fontWeight: 700, color: calc.color, fontFamily: "'Instrument Serif', serif" }}>
                      = {calc.result}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== TARGETS ===== */}
        {tab === "targets" && (
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#ef4444", marginBottom: 14, letterSpacing: 2, textTransform: "uppercase" }}>
                {t.targetsHeader}
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                      {["Level", "#1 (BC=$126K)", "#2 old (BC=$111K)", "#2 revised (BC=$109K)", t.tableNotesHeader].map((h, i) => (
                        <th key={i} style={{
                          padding: "6px 8px", textAlign: "left", fontSize: 8,
                          color: i === 3 ? "#e11d48" : theme.textFaint, fontWeight: 600,
                          background: i === 3 ? "#e11d4808" : "transparent",
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TABLE_ROWS.map((row, i) => (
                      <tr key={i} className="hover-row" style={{ borderBottom: `1px solid ${theme.bgSubtle}` }}>
                        {row.map((cell, j) => (
                          <td key={j} style={{
                            padding: "5px 8px",
                            color: j === 0 ? theme.textSoft : j === 3 ? "#e11d48" : j === 1 ? theme.textMuted : j === 2 ? theme.textOldData : theme.textFaint,
                            fontWeight: j < 4 && j > 0 ? 600 : 400,
                            fontSize: j === 4 ? 9 : 10,
                            background: j === 3 ? "#e11d4805" : "transparent",
                          }}>{j === 4 ? (cell[lang] || cell.vi) : cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Final Target Cards */}
            <div style={{ display: "grid", gap: 10 }}>
              {TARGETS_NEW.map((tgt, i) => (
                <div key={i} style={{
                  padding: 14, borderRadius: 6,
                  background: tgt.primary ? `${tgt.color}08` : theme.bgCard,
                  border: `1px solid ${tgt.primary ? tgt.color + "33" : theme.border}`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontSize: 20, fontWeight: 700, color: tgt.color, fontFamily: "'Instrument Serif', serif" }}>{tgt.price}</span>
                      <span style={{ fontSize: 10, color: theme.textFaint, marginLeft: 8 }}>{tgt.pct} {t.pctSuffix}</span>
                    </div>
                    <div style={{ display: "flex", gap: 2 }}>
                      {[1,2,3,4].map(n => (
                        <div key={n} style={{ width: 7, height: 7, borderRadius: "50%", background: n <= tgt.conf ? tgt.color : theme.border }} />
                      ))}
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: theme.textSoft, fontWeight: 600, marginTop: 6 }}>{tgt.label}</div>
                  <div style={{ fontSize: 10, color: theme.textDim, marginTop: 4 }}>{tgt.method}</div>
                  <div style={{ fontSize: 9, color: theme.textFaint, marginTop: 4 }}>{tgt.detail[lang] || tgt.detail.vi}</div>
                  <div style={{ fontSize: 9, color: theme.textVeryFaint, marginTop: 6, display: "flex", gap: 12 }}>
                    <span>S#1: {tgt.s1_compare}</span>
                    <span>Δ: {tgt.delta}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Verdict */}
            <div style={{
              background: theme.verdictBg,
              border: `1px solid ${theme.verdictBorder}`, borderRadius: 8, padding: 16,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#e11d48", marginBottom: 8 }}>
                {t.verdictTitle}
              </div>
              <div style={{ fontSize: 11, color: theme.textMid, lineHeight: 1.8 }}>
                {lang === "en" ? (
                  <>
                    With BC=$109K and AR=$74K, the actual trading range is <span style={{ color: "#f97316", fontWeight: 700 }}>$35K</span> —
                    narrower than previous analysis, but the UTAD overshoot <span style={{ color: "#e11d48", fontWeight: 700 }}>+$17K (+15.6%)</span> above BC
                    shows OGs needed massive liquidity to exit.
                    <br /><br />
                    The entire $74K→$126K rally (04–10/2025) was not a new bull run — it was a{" "}
                    <span style={{ color: "#e11d48", fontWeight: 700 }}>Phase B + C distribution</span> lasting 6 months.
                    <br /><br />
                    Base case:{" "}
                    <span style={{ color: "#ef4444", fontWeight: 700, fontSize: 15 }}>$28,000</span>{" "}
                    (−78%) · Conservative: <span style={{ color: "#f59e0b", fontWeight: 700 }}>$39,000</span>{" "}
                    (−69%) · Extreme: <span style={{ color: "#991b1b", fontWeight: 700 }}>$21,000</span> (−83%)
                  </>
                ) : (
                  <>
                    Với BC=$109K và AR=$74K, trading range thực sự là <span style={{ color: "#f97316", fontWeight: 700 }}>$35K</span> —
                    hẹp hơn phân tích cũ nhưng UTAD overshoot <span style={{ color: "#e11d48", fontWeight: 700 }}>+$17K (+15.6%)</span> trên BC
                    cho thấy OG cần rất nhiều thanh khoản để exit.
                    <br /><br />
                    Toàn bộ rally $74K→$126K (04–10/2025) không phải bull run mới — đó là{" "}
                    <span style={{ color: "#e11d48", fontWeight: 700 }}>Phase B + C distribution</span> kéo dài 6 tháng.
                    <br /><br />
                    Base case:{" "}
                    <span style={{ color: "#ef4444", fontWeight: 700, fontSize: 15 }}>$28,000</span>{" "}
                    (−78%) · Conservative: <span style={{ color: "#f59e0b", fontWeight: 700 }}>$39,000</span>{" "}
                    (−69%) · Extreme: <span style={{ color: "#991b1b", fontWeight: 700 }}>$21,000</span> (−83%)
                  </>
                )}
              </div>
              <div style={{ fontSize: 9, color: theme.textVeryFaint, marginTop: 12, fontStyle: "italic" }}>
                {t.disclaimer}
              </div>
            </div>
          </div>
        )}

        <div style={{ fontSize: 8, color: theme.textGhost, textAlign: "center", padding: "14px 0" }}>
          Wyckoff Distribution Schematic #2 — Revised · BTC/USD · March 28, 2026
        </div>
      </div>
    </div>
  );
}
