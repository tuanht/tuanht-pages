import { useState } from "react";

// ─── Translations ────────────────────────────────────────────────────────────
const VI_STRINGS = {
  headerSubtitle: "Reconciled: Wyckoff structure giữ nguyên nhưng timeline nén ~50% theo cycle compression data (KillaxBT)",
  insightTitle: "⚡ INSIGHT — Cycle Compression thay đổi gì?",
  tabCompare: "So sánh",
  tabStrategy: "Chiến lược",
  compareTitle: "Wyckoff thuần vs Wyckoff + Cycle Compression",
  tableReasonHeader: "Lý do",
  compressionTitle: "Tại sao Accumulation bị nén?",
  halvingTitle: "Halving 2028 — vai trò thay đổi",
  halvingOldLabel: "WYCKOFF THUẦN",
  halvingOldContent: ["Halving = Phase D→E catalyst", "ATH break sau halving (Q1 2029)", "Halving khởi động markup"],
  halvingNewContent: ["Halving = Mid-cycle accelerator", "ATH break trước halving (Jul 2027)", "Halving đẩy giá từ $130-150K → $200K+"],
  halvingNote: "Đây chính xác là pattern của chu kỳ 2020: BTC break ATH $20K vào 12/2020, trước halving effect kick in. Halving đã xảy ra 05/2020 nhưng real markup chỉ bắt đầu Q4/2020 và tiếp tục tới 11/2021.",
  timelineTitle: "Reconciled Timeline — Chi tiết từng giai đoạn",
  strategyTitle: "Entry Zones — Revised with Cycle Compression",
  verdictTitle: "⚡ KẾT LUẬN — Timeline Reconciled",
  verdictIntro: "Kết hợp Wyckoff structure + Cycle Compression data:",
  verdictDisclaimer: "⚠️ Phân tích kết hợp Wyckoff + cycle compression. Timeline có thể thay đổi ±3 tháng tùy macro.",
  verdictNotes: {
    accum: "(6 tháng, nén 50%)",
    earlier: "(sớm hơn 6 tháng so với Wyckoff thuần)",
    days: "(662 ngày từ Oct 2025 top)",
  },
};

const EN_STRINGS = {
  headerSubtitle: "Reconciled: Wyckoff structure intact but timeline compressed ~50% per cycle compression data (KillaxBT)",
  insightTitle: "⚡ INSIGHT — What does Cycle Compression change?",
  tabCompare: "Compare",
  tabStrategy: "Strategy",
  compareTitle: "Pure Wyckoff vs Wyckoff + Cycle Compression",
  tableReasonHeader: "Reason",
  compressionTitle: "Why is Accumulation compressed?",
  halvingTitle: "Halving 2028 — Role Changes",
  halvingOldLabel: "PURE WYCKOFF",
  halvingOldContent: ["Halving = Phase D→E catalyst", "ATH break after halving (Q1 2029)", "Halving initiates markup"],
  halvingNewContent: ["Halving = Mid-cycle accelerator", "ATH break before halving (Jul 2027)", "Halving pushes price from $130-150K → $200K+"],
  halvingNote: "This is exactly the 2020 cycle pattern: BTC broke ATH $20K in 12/2020, before halving effects kicked in. The halving occurred 05/2020 but real markup only started Q4/2020 and continued through 11/2021.",
  timelineTitle: "Reconciled Timeline — Detailed Phases",
  strategyTitle: "Entry Zones — Revised with Cycle Compression",
  verdictTitle: "⚡ VERDICT — Reconciled Timeline",
  verdictIntro: "Combining Wyckoff structure + Cycle Compression data:",
  verdictDisclaimer: "⚠️ Analysis combining Wyckoff + cycle compression. Timeline may shift ±3 months depending on macro.",
  verdictNotes: {
    accum: "(6 months, 50% compressed)",
    earlier: "(6 months earlier than pure Wyckoff)",
    days: "(662 days from Oct 2025 top)",
  },
};
// ─────────────────────────────────────────────────────────────────────────────

const pY = (price) => Math.max(2, Math.min(96, 96 - ((price - 15000) / (300000 - 15000)) * 94));

const PHASES_RECONCILED = [
  { label: "Markdown", color: "#991b1b", flex: 10, range: "03–08/2026" },
  { label: "Phase A", color: "#f59e0b", flex: 10, range: "Q3–Q4 2026" },
  { label: "Phase B", color: "#f97316", flex: 12, range: "Q4 2026–Q1 2027" },
  { label: "C (Spring)", color: "#22c55e", flex: 6, range: "Q1 2027" },
  { label: "Phase D", color: "#3b82f6", flex: 12, range: "Q1–Q2 2027" },
  { label: "Phase E", color: "#8b5cf6", flex: 50, range: "Q3 2027 → 2029" },
];

// Reconciled price path
const PRICE_MAIN = [
  // Markdown
  { x: 2, y: pY(66000) }, { x: 4, y: pY(55000) }, { x: 6, y: pY(45000) },
  { x: 8, y: pY(38000) }, { x: 10, y: pY(32000) },
  // SC
  { x: 12, y: pY(28000) },
  // AR
  { x: 14, y: pY(38000) },
  // ST
  { x: 17, y: pY(30000) },
  // Phase B (compressed)
  { x: 19, y: pY(35000) }, { x: 21, y: pY(32000) }, { x: 23, y: pY(37000) },
  { x: 25, y: pY(34000) },
  // Spring
  { x: 27, y: pY(24000) },
  // Recovery
  { x: 29, y: pY(32000) }, { x: 30, y: pY(35000) },
  // SOS
  { x: 33, y: pY(45000) }, { x: 35, y: pY(55000) },
  // LPS
  { x: 37, y: pY(48000) },
  // Markup begins
  { x: 40, y: pY(65000) }, { x: 42, y: pY(75000) },
  { x: 44, y: pY(90000) }, { x: 46, y: pY(85000) },
  { x: 48, y: pY(110000) },
];

const ATH_BREAK = [
  { x: 48, y: pY(110000) },
  { x: 50, y: pY(126000) }, // ATH break ~Jul 2027
  { x: 52, y: pY(135000) },
  { x: 54, y: pY(120000) }, // pullback
  { x: 56, y: pY(140000) },
];

const POST_ATH = [
  { x: 56, y: pY(140000) },
  // Halving zone
  { x: 60, y: pY(130000) }, { x: 63, y: pY(155000) },
  { x: 66, y: pY(145000) }, { x: 68, y: pY(170000) },
  // Post halving markup
  { x: 72, y: pY(190000) }, { x: 74, y: pY(175000) },
  { x: 78, y: pY(210000) }, { x: 82, y: pY(240000) },
  { x: 86, y: pY(220000) },
  // Potential top
  { x: 90, y: pY(260000) },
  { x: 94, y: pY(250000) },
];

function toPath(pts) {
  if (!pts.length) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]; const curr = pts[i];
    d += ` C ${prev.x + (curr.x - prev.x) * 0.4} ${prev.y}, ${prev.x + (curr.x - prev.x) * 0.6} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  return d;
}

const OLD_TIMELINE = [
  { event: "SC (Selling Climax)", old: "Q4 2026", revised: "Q3 2026", delta: "−1Q", reason: { vi: "Cycle compression: markdown nhanh hơn", en: "Cycle compression: faster markdown" } },
  { event: "Phase B (Range)", old: "Q1–Q3 2027 (6-9mo)", revised: "Q4 2026–Q1 2027 (3-4mo)", delta: "−50%", reason: { vi: "Accumulation bị nén — phù hợp C3→C4 compression −40%", en: "Accumulation compressed — matches C3→C4 compression −40%" } },
  { event: "Spring", old: "Q3 2027", revised: "Q1 2027", delta: "−6mo", reason: { vi: "Must happen trước Jul 2027 ATH break", en: "Must happen before Jul 2027 ATH break" } },
  { event: "SOS (breakout)", old: "Q4 2027", revised: "Q2 2027", delta: "−6mo", reason: { vi: "Cần thời gian markup 2-3 tháng tới ATH", en: "Needs 2-3 months of markup to reach ATH" } },
  { event: "Break ATH $126K", old: "Q1 2029", revised: "Jul 2027", delta: "−18mo!", reason: { vi: "KillaxBT cycle compression: 662 ngày từ ATH 10/2025", en: "KillaxBT cycle compression: 662 days from ATH 10/2025" } },
  { event: "Halving 2028", old: "Q1 2028", revised: "Q1 2028 (giữ nguyên)", delta: "0", reason: { vi: "Event cố định — nhưng vai trò thay đổi", en: "Fixed event — but role changes" } },
  { event: "Cycle Top", old: "Q4 2029", revised: "Q4 2029 – Q1 2030", delta: "~0", reason: { vi: "Top vẫn xa sau ATH break, nhưng markup dài hơn", en: "Top still distant after ATH break, but longer markup" } },
];

const COMPRESSION_REASONS = [
  {
    title: { vi: "① ETF Infrastructure đã sẵn sàng", en: "① ETF Infrastructure is Ready" },
    desc: {
      vi: "Khác 2018–2020, infrastructure ETF, custody, derivatives đã mature. Smart money không cần 12 tháng để xây position — họ có thể accumulate qua ETF trong 3-4 tháng.",
      en: "Unlike 2018–2020, ETF, custody, and derivatives infrastructure is now mature. Smart money doesn't need 12 months to build positions — they can accumulate via ETFs in 3-4 months.",
    },
  },
  {
    title: { vi: "② OG đã biết script", en: "② OGs Know the Script" },
    desc: {
      vi: "Composite man chu kỳ này không phải lần đầu. Họ biết accumulation tại đáy cycle luôn profitable → hành động nhanh hơn, giảm thời gian Phase B.",
      en: "The composite man in this cycle is not a first-timer. They know accumulation at cycle bottoms is always profitable → act faster, reducing Phase B duration.",
    },
  },
  {
    title: { vi: "③ Halving timeline ép buộc", en: "③ Halving Timeline Forces Compression" },
    desc: {
      vi: "Halving 03/2028 là deadline tự nhiên. Nếu ATH break Jul 2027, markup bắt đầu trước halving — halving trở thành mid-cycle catalyst thay vì Phase D trigger.",
      en: "Halving 03/2028 is a natural deadline. If ATH breaks Jul 2027, markup starts before halving — halving becomes a mid-cycle catalyst instead of a Phase D trigger.",
    },
  },
  {
    title: { vi: "④ Market memory ngắn hơn", en: "④ Shorter Market Memory" },
    desc: {
      vi: "Retail quay lại nhanh hơn mỗi cycle. 2015: retail mất 2 năm quay lại. 2019: 1.5 năm. 2023: 6 tháng. Dự kiến 2026-2027: 3-4 tháng sau bottom.",
      en: "Retail returns faster each cycle. 2015: took 2 years. 2019: 1.5 years. 2023: 6 months. Expected 2026-2027: 3-4 months after bottom.",
    },
  },
];

const TIMELINE_DATA = [
  { time: "03–08/2026", phase: "Markdown", price: "$66K → $28K", desc: { vi: "Phase E distribution hoàn tất. Markdown nhanh (~5 tháng thay vì 8) do leverage cao hơn chu kỳ trước. Miner capitulate, ETF outflow, 'crypto is dead' lần 4", en: "Phase E distribution complete. Fast markdown (~5 months instead of 8) due to higher leverage than previous cycle. Miner capitulation, ETF outflows, 'crypto is dead' for the 4th time" }, col: "#991b1b", months: "5 mo" },
  { time: "08–09/2026", phase: "Phase A — SC + AR", price: "$28K → $38K", desc: { vi: "Selling Climax tại $28K (Log Fib 61.8%). Bounce tự động lên $38K. Volume spike rồi giảm — dấu hiệu supply cạn", en: "Selling Climax at $28K (Log Fib 61.8%). Automatic bounce to $38K. Volume spikes then drops — sign of exhausted supply" }, col: "#f59e0b", months: "2 mo" },
  { time: "10/2026–01/2027", phase: "Phase B — Range", price: "$28K–$40K", desc: { vi: "NÉN từ 9 tháng còn 4 tháng. Smart money accumulate qua ETF (nhanh hơn OTC). Range hẹp, volume thấp. Boring — đây là lúc retail bỏ đi", en: "COMPRESSED from 9 months to 4. Smart money accumulates via ETFs (faster than OTC). Narrow range, low volume. Boring — this is when retail leaves" }, col: "#f97316", months: "4 mo" },
  { time: "01–02/2027", phase: "Phase C — SPRING", price: "$24,000", desc: { vi: "Phá dưới SC $28K. Quét stop-loss. Có thể trigger bởi macro event (rate decision, geopolitics). Recovery trong 2-3 tuần. ENTRY TỐI ƯU", en: "Break below SC $28K. Stop-loss sweep. May be triggered by macro event (rate decision, geopolitics). Recovery in 2-3 weeks. OPTIMAL ENTRY" }, col: "#22c55e", months: "1 mo", hl: true },
  { time: "02–04/2027", phase: "Phase D — SOS", price: "$35K → $55K", desc: { vi: "Phá trên AR $38K, volume tăng mạnh. ETF inflow restart. 'Maybe crypto isn't dead' narrative. Smart money đã full position", en: "Break above AR $38K, strong volume surge. ETF inflows restart. 'Maybe crypto isn't dead' narrative. Smart money fully positioned" }, col: "#3b82f6", months: "3 mo" },
  { time: "04–07/2027", phase: "Phase E — Markup", price: "$55K → $126K+", desc: { vi: "Markup tăng tốc. Phá $100K, rồi $126K ATH cũ. Trùng với KillaxBT target Jul 2027. Retail FOMO bắt đầu", en: "Markup accelerates. Breaks $100K, then old ATH $126K. Aligns with KillaxBT target Jul 2027. Retail FOMO begins" }, col: "#8b5cf6", months: "3 mo" },
  { time: "07/2027–03/2028", phase: "Post-ATH Rally", price: "$126K → $155K", desc: { vi: "Giai đoạn 'price discovery' lần 1. Pullback, consolidation, rồi tiếp tục lên. Halving 03/2028 = catalyst tiếp theo", en: "First 'price discovery' phase. Pullback, consolidation, then continues higher. Halving 03/2028 = next catalyst" }, col: "#8b5cf6", months: "8 mo" },
  { time: "03/2028–Q4/2029", phase: "Post-Halving Euphoria", price: "$155K → $220-260K", desc: { vi: "Supply shock halving + đã phá ATH = combo mạnh nhất. Parabolic phase cuối. Target đỉnh dựa trên diminishing returns 8-11× từ Spring", en: "Halving supply shock + post-ATH = strongest combo. Final parabolic phase. Top target based on diminishing returns 8-11× from Spring" }, col: "#a855f7", months: "18 mo" },
  { time: "Q4/2029–Q1/2030", phase: "New Distribution?", price: "$220K+ → ?", desc: { vi: "Cycle top. Composite man bắt đầu phân phối lại. Lặp lại Wyckoff Distribution Schematic — có thể #1 hoặc #2", en: "Cycle top. Composite man begins redistributing. Repeats Wyckoff Distribution Schematic — possibly #1 or #2" }, col: "#ef4444", months: "—" },
];

const STRATEGY_DATA = [
  {
    zone: "$26K–$30K", label: "SC Zone", timing: "08–10/2026", quality: { vi: "Tốt", en: "Good" },
    color: "#f59e0b", rr: "1:6 → 1:8",
    desc: { vi: "Vùng Selling Climax. An toàn nhưng Spring có thể thấp hơn. DCA zone tốt.", en: "Selling Climax zone. Safe but Spring may go lower. Good DCA zone." },
  },
  {
    zone: "$22K–$25K", label: "Spring Zone ⭐", timing: "01–02/2027", quality: { vi: "Tối ưu", en: "Optimal" },
    color: "#22c55e", rr: "1:8 → 1:10",
    desc: { vi: "Entry tốt nhất. Phá dưới SC, quét stop. Với timeline nén, Spring sẽ xảy ra sớm hơn → cần sẵn sàng từ cuối 2026.", en: "Best entry. Break below SC, sweeps stops. With compressed timeline, Spring will occur sooner → need to be ready from late 2026." },
  },
  {
    zone: "$45K–$55K", label: "SOS Breakout", timing: "03–04/2027", quality: { vi: "Confirm", en: "Confirm" },
    color: "#3b82f6", rr: "1:3 → 1:4",
    desc: { vi: "Phá trên range. Ít risk nhất nhưng đã miss 50%+ upside từ Spring. Vẫn có R:R tốt nếu target $220K.", en: "Break above range. Lowest risk but missed 50%+ upside from Spring. Still good R:R if targeting $220K." },
  },
  {
    zone: "$100K–$126K", label: "ATH Breakout", timing: "06–07/2027", quality: { vi: "Momentum", en: "Momentum" },
    color: "#8b5cf6", rr: "1:1.5 → 1:2",
    desc: { vi: "Trade momentum khi phá ATH. R:R thấp hơn nhưng confirmation cao nhất. Cho người không dám mua đáy.", en: "Momentum trade on ATH break. Lower R:R but highest confirmation. For those who can't buy the bottom." },
  },
];

const SCENARIOS = [
  { label: "🐻 Bear", ath: "Feb 2028", days: "849d", comp: "0%", spring: "Q2 2027", top: "$180K", note: { vi: "Giống C3→C4, accumulation dài hơn", en: "Similar to C3→C4, longer accumulation" }, color: "#ef4444" },
  { label: "◆ Base", ath: "Jul 2027", days: "662d", comp: "−22%", spring: "Q1 2027", top: "$220K", note: { vi: "Avg compression, most probable", en: "Avg compression, most probable" }, color: "#f59e0b", primary: true },
  { label: "🟢 Bull", ath: "Apr 2027", days: "551d", comp: "−35%", spring: "Q4 2026", top: "$260K+", note: { vi: "Continued acceleration, ETF tailwinds", en: "Continued acceleration, ETF tailwinds" }, color: "#22c55e" },
];

export default function ReconciledAnalysis({ theme, lang }) {
  const [tab, setTab] = useState("compare");
  const [hoverPhase, setHoverPhase] = useState(null);

  const t = lang === "en" ? EN_STRINGS : VI_STRINGS;

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
        @keyframes glow-green { 0%,100% { box-shadow: 0 0 4px #22c55e22; } 50% { box-shadow: 0 0 14px #22c55e44; } }
        .hr:hover { background: ${theme.hoverBg} !important; }
      `}</style>

      <div style={{ maxWidth: 920, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 18, borderBottom: `1px solid ${theme.borderFaint}`, paddingBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
            <span style={{ fontSize: 8, letterSpacing: 4, color: theme.textFaint }}>WYCKOFF</span>
            <span style={{ fontSize: 7, padding: "2px 6px", borderRadius: 3, fontWeight: 700, background: "#22c55e", color: "#000" }}>ACCUMULATION</span>
            <span style={{ fontSize: 8, color: theme.textVeryFaint }}>×</span>
            <span style={{ fontSize: 7, padding: "2px 6px", borderRadius: 3, fontWeight: 700, background: "#f59e0b", color: "#000" }}>CYCLE COMPRESSION</span>
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, fontFamily: "'Instrument Serif', serif", color: theme.textHeading }}>
            ATH Break <span style={{ color: "#f59e0b" }}>~Jul 2027</span> · Spring <span style={{ color: "#22c55e" }}>Q1 2027</span> · Top <span style={{ color: "#8b5cf6" }}>2029–2030</span>
          </h1>
          <div style={{ fontSize: 10, color: theme.textFaint, marginTop: 6 }}>
            {t.headerSubtitle}
          </div>
        </div>

        {/* Key Insight */}
        <div style={{
          background: "#f59e0b08", border: "1px solid #f59e0b22",
          borderRadius: 6, padding: 12, marginBottom: 16,
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#f59e0b", marginBottom: 6 }}>
            {t.insightTitle}
          </div>
          <div style={{ fontSize: 10, color: theme.textMid, lineHeight: 1.8 }}>
            {lang === "en" ? (
              <>
                KillaxBT measured intervals between <strong style={{ color: "#f59e0b" }}>ATH breaks</strong>: 1,478d → 1,424d → 849d → <strong style={{ color: "#f59e0b" }}>662d</strong> (−22% avg).
                If correct, BTC will break $126K by <strong style={{ color: "#f59e0b" }}>~Jul 2027</strong> — 18 months earlier than pure Wyckoff analysis.
                <br />
                This forces the entire <strong style={{ color: "#22c55e" }}>accumulation to compress by 50%</strong>: from 12 months to ~6 months.
                Wyckoff structure remains valid, just <em>faster pace</em>.
              </>
            ) : (
              <>
                KillaxBT đo khoảng cách giữa các lần <strong style={{ color: "#f59e0b" }}>phá ATH</strong>: 1,478d → 1,424d → 849d → <strong style={{ color: "#f59e0b" }}>662d</strong> (−22% avg).
                Nếu đúng, BTC sẽ break $126K vào <strong style={{ color: "#f59e0b" }}>~Jul 2027</strong> — sớm hơn 18 tháng so với phân tích Wyckoff thuần.
                <br />
                Điều này buộc toàn bộ <strong style={{ color: "#22c55e" }}>accumulation phải nén lại 50%</strong>: từ 12 tháng còn ~6 tháng.
                Wyckoff structure vẫn đúng, chỉ là <em>tốc độ nhanh hơn</em>.
              </>
            )}
          </div>
        </div>

        {/* Phase Strip */}
        <div style={{ display: "flex", height: 24, borderRadius: 3, overflow: "hidden", marginBottom: 10, border: `1px solid ${theme.borderFaint}` }}>
          {PHASES_RECONCILED.map((p, i) => (
            <div key={i}
              onMouseEnter={() => setHoverPhase(i)}
              onMouseLeave={() => setHoverPhase(null)}
              style={{
                flex: p.flex, background: hoverPhase === i ? p.color + "33" : p.color + "11",
                borderRight: i < 5 ? `1px solid ${theme.borderFaint}` : "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: p.flex > 10 ? 7.5 : 6.5, fontWeight: 600, color: p.color,
                cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {p.flex > 10 ? p.label : p.label.replace("Phase ", "").replace(" (Spring)", "")}
            </div>
          ))}
        </div>
        {hoverPhase !== null && (
          <div style={{ fontSize: 9, color: PHASES_RECONCILED[hoverPhase].color, marginBottom: 10, padding: "3px 8px", background: theme.bgSubtle, borderRadius: 4 }}>
            {PHASES_RECONCILED[hoverPhase].label} · {PHASES_RECONCILED[hoverPhase].range}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: 14 }}>
          {[
            { key: "compare", label: t.tabCompare },
            { key: "chart", label: "Chart" },
            { key: "timeline", label: "Timeline" },
            { key: "strategy", label: t.tabStrategy },
          ].map(tabItem => (
            <button key={tabItem.key} onClick={() => setTab(tabItem.key)} style={{
              background: tab === tabItem.key ? theme.borderFaint : "transparent",
              color: tab === tabItem.key ? theme.textHeading : theme.textFaint,
              border: `1px solid ${theme.borderFaint}`, padding: "5px 12px",
              fontSize: 9, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              borderRadius: tabItem.key === "compare" ? "4px 0 0 4px" : tabItem.key === "strategy" ? "0 4px 4px 0" : 0,
              letterSpacing: 0.5,
            }}>{tabItem.label}</button>
          ))}
        </div>

        {/* ===== SO SÁNH / COMPARE ===== */}
        {tab === "compare" && (
          <div style={{ display: "grid", gap: 14 }}>
            {/* Before vs After */}
            <div style={{ background: theme.bgCard, border: `1px solid ${theme.borderFaint}`, borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#f59e0b", marginBottom: 14, letterSpacing: 2, textTransform: "uppercase" }}>
                {t.compareTitle}
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                      {["Event", lang === "en" ? "Pure Wyckoff" : "Wyckoff thuần", "Reconciled", "Δ", t.tableReasonHeader].map((h, i) => (
                        <th key={i} style={{
                          padding: "5px 6px", textAlign: "left", fontSize: 8,
                          color: i === 2 ? "#22c55e" : theme.textFaint, fontWeight: 600,
                          background: i === 2 ? "#22c55e06" : "transparent",
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {OLD_TIMELINE.map((row, i) => (
                      <tr key={i} className="hr" style={{ borderBottom: `1px solid ${theme.bgSubtle}` }}>
                        <td style={{ padding: "5px 6px", color: theme.textMid, fontWeight: 600 }}>{row.event}</td>
                        <td style={{ padding: "5px 6px", color: theme.textMuted }}>{row.old}</td>
                        <td style={{ padding: "5px 6px", color: "#22c55e", fontWeight: 600, background: "#22c55e06" }}>{row.revised}</td>
                        <td style={{ padding: "5px 6px", color: row.delta.includes("−") ? "#ef4444" : theme.textDim, fontWeight: 700, fontSize: 9 }}>{row.delta}</td>
                        <td style={{ padding: "5px 6px", color: theme.textFaint, fontSize: 9 }}>{row.reason[lang] || row.reason.vi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Why compression works */}
            <div style={{ background: theme.bgCard, border: `1px solid ${theme.borderFaint}`, borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#8b5cf6", marginBottom: 12, letterSpacing: 2, textTransform: "uppercase" }}>
                {t.compressionTitle}
              </div>
              <div style={{ display: "grid", gap: 8 }}>
                {COMPRESSION_REASONS.map((item, i) => (
                  <div key={i} className="hr" style={{ padding: "8px 10px", background: theme.bgSubtle, borderRadius: 5, borderLeft: "2px solid #8b5cf6" }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: theme.textStrong }}>{item.title[lang] || item.title.vi}</div>
                    <div style={{ fontSize: 10, color: theme.textDim, marginTop: 3, lineHeight: 1.5 }}>{item.desc[lang] || item.desc.vi}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Halving role change */}
            <div style={{ background: theme.bgCard, border: `1px solid ${theme.borderFaint}`, borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#3b82f6", marginBottom: 12, letterSpacing: 2, textTransform: "uppercase" }}>
                {t.halvingTitle}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ padding: 10, background: theme.bgSubtle, borderRadius: 5, borderTop: `2px solid ${theme.textMuted}` }}>
                  <div style={{ fontSize: 9, color: theme.textDim, marginBottom: 4 }}>{t.halvingOldLabel}</div>
                  <div style={{ fontSize: 11, color: theme.textSoft, lineHeight: 1.6 }}>
                    {t.halvingOldContent[0]}
                    <br />{t.halvingOldContent[1]}
                    <br />{t.halvingOldContent[2]}
                  </div>
                </div>
                <div style={{ padding: 10, background: "#3b82f608", borderRadius: 5, borderTop: "2px solid #3b82f6" }}>
                  <div style={{ fontSize: 9, color: "#3b82f6", marginBottom: 4 }}>RECONCILED</div>
                  <div style={{ fontSize: 11, color: theme.textStrong, lineHeight: 1.6 }}>
                    {t.halvingNewContent[0]}
                    <br />{t.halvingNewContent[1]}
                    <br />{t.halvingNewContent[2]}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 10, color: theme.textDim, marginTop: 10, lineHeight: 1.6 }}>
                {t.halvingNote}
              </div>
            </div>
          </div>
        )}

        {/* ===== CHART ===== */}
        {tab === "chart" && (
          <div style={{ background: theme.bgCard, border: `1px solid ${theme.borderFaint}`, borderRadius: 8, padding: "18px 12px 8px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, opacity: 0.25, backgroundImage: `linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />

            <svg viewBox="-5 -4 112 106" style={{ width: "100%", display: "block" }}>
              <defs>
                <linearGradient id="markupG" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.06" />
                </linearGradient>
                <linearGradient id="springG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0.1" />
                </linearGradient>
                <filter id="gl3">
                  <feGaussianBlur stdDeviation="1" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Price grid */}
              {[260000, 200000, 150000, 126000, 100000, 66000, 42000, 28000, 24000].map((p, i) => (
                <g key={i}>
                  <line x1={0} y1={pY(p)} x2={100} y2={pY(p)} style={{ stroke: p === 126000 ? "#f59e0b15" : theme.gridLineFaint }} strokeWidth={p === 126000 ? 0.4 : 0.25} />
                  <text x={-2} y={pY(p) + 0.8} style={{ fill: p === 126000 ? "#f59e0b33" : theme.gridLabelFaint }} fontSize={1.6} textAnchor="end">${p >= 1000 ? `${p / 1000}K` : p}</text>
                </g>
              ))}

              {/* ATH line */}
              <line x1={0} y1={pY(126000)} x2={100} y2={pY(126000)} stroke="#f59e0b" strokeWidth={0.25} strokeDasharray="2,2" opacity={0.25} />

              {/* ATH break vertical */}
              <line x1={50} y1={0} x2={50} y2={98} stroke="#f59e0b" strokeWidth={0.3} strokeDasharray="1.5,1" opacity={0.25} />
              <text x={50} y={-1.5} fill="#f59e0b" fontSize={2.2} textAnchor="middle" fontWeight="700">ATH BREAK ~JUL 2027</text>
              <text x={50} y={1} fill="#f59e0b" fontSize={1.5} textAnchor="middle" opacity={0.5}>662 days from Oct 2025</text>

              {/* Halving vertical */}
              <line x1={63} y1={0} x2={63} y2={98} stroke="#8b5cf6" strokeWidth={0.25} strokeDasharray="1.5,1" opacity={0.2} />
              <text x={63} y={-1.5} fill="#8b5cf6" fontSize={1.8} textAnchor="middle" fontWeight="600">HALVING 03/2028</text>

              {/* Spring zone */}
              <rect x={25} y={pY(32000)} width={6} height={pY(24000) - pY(32000)} fill="url(#springG)" rx={1} />

              {/* Accumulation range */}
              <rect x={12} y={pY(42000)} width={24} height={pY(28000) - pY(42000)} fill="#f59e0b" opacity={0.02} stroke="#f59e0b" strokeWidth={0.15} strokeDasharray="1,1" />

              {/* Markup zone */}
              <rect x={48} y={pY(260000)} width={50} height={pY(126000) - pY(260000)} fill="url(#markupG)" />

              {/* Main price */}
              <path d={toPath(PRICE_MAIN)} fill="none" style={{ stroke: theme.priceLine }} strokeWidth={0.6} />

              {/* ATH break section */}
              <path d={toPath(ATH_BREAK)} fill="none" stroke="#f59e0b" strokeWidth={0.55} />

              {/* Post ATH */}
              <path d={toPath(POST_ATH)} fill="none" stroke="#8b5cf6" strokeWidth={0.5} strokeDasharray="2,1" opacity={0.6} />

              {/* Key events */}
              {[
                { x: 2, y: pY(66000), label: "NOW", sub: "$66K", color: "#3b82f6" },
                { x: 12, y: pY(28000), label: "SC", sub: "$28K", color: "#f59e0b" },
                { x: 14, y: pY(38000), label: "AR", sub: "$38K", color: "#f59e0b" },
                { x: 17, y: pY(30000), label: "ST", sub: "$30K", color: "#f59e0b" },
                { x: 27, y: pY(24000), label: "SPRING", sub: "$24K", color: "#22c55e", big: true },
                { x: 35, y: pY(55000), label: "SOS", sub: "$55K", color: "#3b82f6" },
                { x: 50, y: pY(126000), label: "ATH!", sub: "$126K+", color: "#f59e0b", big: true },
                { x: 63, y: pY(155000), label: "Halving", sub: "$155K?", color: "#8b5cf6" },
                { x: 90, y: pY(260000), label: "TOP?", sub: "$220-260K", color: "#8b5cf6", big: true },
              ].map((e, i) => (
                <g key={i}>
                  {e.big ? (
                    <>
                      <circle cx={e.x} cy={e.y} r={2} fill="none" stroke={e.color} strokeWidth={0.25} style={{ animation: "pulse 2s infinite" }} />
                      <circle cx={e.x} cy={e.y} r={0.8} fill={e.color} filter="url(#gl3)" />
                    </>
                  ) : (
                    <>
                      <circle cx={e.x} cy={e.y} r={1} fill="none" stroke={e.color} strokeWidth={0.2} />
                      <circle cx={e.x} cy={e.y} r={0.4} fill={e.color} />
                    </>
                  )}
                  <text x={e.x} y={e.y - (e.big ? 3.5 : 2.5)} fill={e.color} fontSize={e.big ? 2.2 : 1.8} textAnchor="middle" fontWeight="700">{e.label}</text>
                  <text x={e.x} y={e.y - (e.big ? 1.2 : 0.5)} style={{ fill: theme.textFaint }} fontSize={1.4} textAnchor="middle">{e.sub}</text>
                </g>
              ))}

              {/* Time labels */}
              {[
                { x: 2, label: "03/26" }, { x: 12, label: "Q3/26" },
                { x: 27, label: "Q1/27" }, { x: 50, label: "07/27" },
                { x: 63, label: "03/28" }, { x: 80, label: "2029" },
                { x: 93, label: "2030" },
              ].map((tl, i) => (
                <text key={i} x={tl.x} y={99} style={{ fill: theme.gridLabel }} fontSize={1.6} textAnchor="middle">{tl.label}</text>
              ))}
            </svg>
          </div>
        )}

        {/* ===== TIMELINE ===== */}
        {tab === "timeline" && (
          <div style={{ background: theme.bgCard, border: `1px solid ${theme.borderFaint}`, borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#22c55e", marginBottom: 14, letterSpacing: 2, textTransform: "uppercase" }}>
              {t.timelineTitle}
            </div>
            <div style={{ display: "grid", gap: 5 }}>
              {TIMELINE_DATA.map((item, i) => (
                <div key={i} className="hr" style={{
                  display: "grid", gridTemplateColumns: "80px 1fr", gap: 8,
                  padding: "8px 10px", borderRadius: 4,
                  borderLeft: `2px solid ${item.col}`,
                  background: item.hl ? "#22c55e08" : "transparent",
                }}>
                  <div>
                    <div style={{ fontSize: 9, color: item.col, fontWeight: 700 }}>{item.time}</div>
                    <div style={{ fontSize: 8, color: theme.textVeryFaint, marginTop: 2 }}>{item.months}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: item.hl ? "#22c55e" : theme.textStrong }}>{item.phase}</div>
                    <div style={{ fontSize: 10, color: "#f59e0b", marginTop: 2 }}>{item.price}</div>
                    <div style={{ fontSize: 10, color: theme.textDim, marginTop: 2, lineHeight: 1.5 }}>{item.desc[lang] || item.desc.vi}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== STRATEGY ===== */}
        {tab === "strategy" && (
          <div style={{ display: "grid", gap: 14 }}>
            {/* Entry Zones revised */}
            <div style={{ background: theme.bgCard, border: `1px solid ${theme.borderFaint}`, borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#22c55e", marginBottom: 14, letterSpacing: 2, textTransform: "uppercase" }}>
                {t.strategyTitle}
              </div>
              <div style={{ display: "grid", gap: 10 }}>
                {STRATEGY_DATA.map((z, i) => (
                  <div key={i} style={{
                    padding: 12, borderRadius: 6,
                    background: (z.quality.en === "Optimal") ? "#22c55e08" : theme.bgSubtle,
                    border: `1px solid ${(z.quality.en === "Optimal") ? "#22c55e22" : theme.borderFaint}`,
                    animation: (z.quality.en === "Optimal") ? "glow-green 3s infinite" : "none",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: z.color, fontFamily: "'Instrument Serif', serif" }}>{z.zone}</span>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <span style={{ fontSize: 9, color: theme.textSoft }}>R:R {z.rr}</span>
                        <span style={{ fontSize: 7, color: "#000", background: z.color, padding: "2px 5px", borderRadius: 3, fontWeight: 700 }}>{z.quality[lang] || z.quality.vi}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 10, color: theme.textSoft, marginTop: 4 }}>{z.label} · {z.timing}</div>
                    <div style={{ fontSize: 10, color: theme.textDim, marginTop: 4, lineHeight: 1.5 }}>{z.desc[lang] || z.desc.vi}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* KillaxBT Scenarios */}
            <div style={{ background: theme.bgCard, border: `1px solid ${theme.borderFaint}`, borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#f59e0b", marginBottom: 12, letterSpacing: 2, textTransform: "uppercase" }}>
                3 Scenarios từ Cycle Compression
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {SCENARIOS.map((s, i) => (
                  <div key={i} style={{
                    padding: 10, borderRadius: 6,
                    background: s.primary ? "#f59e0b08" : theme.bgSubtle,
                    border: `1px solid ${s.primary ? "#f59e0b22" : theme.borderFaint}`,
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: s.color, marginBottom: 6 }}>{s.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: theme.textHeading, fontFamily: "'Instrument Serif', serif" }}>{s.ath}</div>
                    <div style={{ fontSize: 9, color: theme.textDim, marginTop: 4, lineHeight: 1.6 }}>
                      ATH break: {s.days} ({s.comp})
                      <br />Spring: {s.spring}
                      <br />Cycle top: {s.top}
                    </div>
                    <div style={{ fontSize: 8, color: theme.textVeryFaint, marginTop: 4 }}>{s.note[lang] || s.note.vi}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Final Verdict */}
            <div style={{
              background: theme.verdictBgR,
              border: `1px solid ${theme.verdictBorderR}`, borderRadius: 8, padding: 16,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", marginBottom: 8 }}>
                {t.verdictTitle}
              </div>
              <div style={{ fontSize: 11, color: theme.textMid, lineHeight: 1.9 }}>
                {t.verdictIntro}
                <br /><br />
                <span style={{ color: "#991b1b" }}>Markdown:</span> $66K → $28K · <span style={{ color: theme.textDim }}>03–08/2026</span>
                <br />
                <span style={{ color: "#f59e0b" }}>Accumulation:</span> $28K–$40K · <span style={{ color: theme.textDim }}>08/2026 – 02/2027</span> {t.verdictNotes.accum}
                <br />
                <span style={{ color: "#22c55e", fontWeight: 700 }}>Spring: $24K</span> · <span style={{ color: theme.textDim }}>Q1 2027</span> {t.verdictNotes.earlier}
                <br />
                <span style={{ color: "#f59e0b", fontWeight: 700 }}>ATH Break: $126K+</span> · <span style={{ color: theme.textDim }}>~Jul 2027</span> {t.verdictNotes.days}
                <br />
                <span style={{ color: "#8b5cf6" }}>Halving:</span> 03/2028 · mid-cycle accelerator
                <br />
                <span style={{ color: "#8b5cf6", fontWeight: 700, fontSize: 14 }}>Cycle Top: $220K–$260K</span> · <span style={{ color: theme.textDim }}>Q4 2029 – Q1 2030</span>
              </div>
              <div style={{ fontSize: 9, color: theme.textVeryFaint, marginTop: 12, fontStyle: "italic" }}>
                {t.verdictDisclaimer}
              </div>
            </div>
          </div>
        )}

        <div style={{ fontSize: 8, color: theme.textGhost, textAlign: "center", padding: "14px 0" }}>
          Wyckoff Accumulation × Cycle Compression · Reconciled Analysis · March 28, 2026
        </div>
      </div>
    </div>
  );
}
