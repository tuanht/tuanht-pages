import { useState } from "react";

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
  { event: "SC (Selling Climax)", old: "Q4 2026", revised: "Q3 2026", delta: "−1Q", reason: "Cycle compression: markdown nhanh hơn" },
  { event: "Phase B (Range)", old: "Q1–Q3 2027 (6-9mo)", revised: "Q4 2026–Q1 2027 (3-4mo)", delta: "−50%", reason: "Accumulation bị nén — phù hợp C3→C4 compression −40%" },
  { event: "Spring", old: "Q3 2027", revised: "Q1 2027", delta: "−6mo", reason: "Must happen trước Jul 2027 ATH break" },
  { event: "SOS (breakout)", old: "Q4 2027", revised: "Q2 2027", delta: "−6mo", reason: "Cần thời gian markup 2-3 tháng tới ATH" },
  { event: "Break ATH $126K", old: "Q1 2029", revised: "Jul 2027", delta: "−18mo!", reason: "KillaxBT cycle compression: 662 ngày từ ATH 10/2025" },
  { event: "Halving 2028", old: "Q1 2028", revised: "Q1 2028 (giữ nguyên)", delta: "0", reason: "Event cố định — nhưng vai trò thay đổi" },
  { event: "Cycle Top", old: "Q4 2029", revised: "Q4 2029 – Q1 2030", delta: "~0", reason: "Top vẫn xa sau ATH break, nhưng markup dài hơn" },
];

export default function ReconciledAnalysis() {
  const [tab, setTab] = useState("compare");
  const [hoverPhase, setHoverPhase] = useState(null);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060608",
      color: "#d4d0c8",
      fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
      padding: "16px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;600;700&family=Instrument+Serif&display=swap');
        * { box-sizing: border-box; }
        @keyframes pulse { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }
        @keyframes glow-green { 0%,100% { box-shadow: 0 0 4px #22c55e22; } 50% { box-shadow: 0 0 14px #22c55e44; } }
        .hr:hover { background: rgba(255,255,255,0.025) !important; }
      `}</style>

      <div style={{ maxWidth: 920, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 18, borderBottom: "1px solid #12121a", paddingBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
            <span style={{ fontSize: 8, letterSpacing: 4, color: "#444" }}>WYCKOFF</span>
            <span style={{ fontSize: 7, padding: "2px 6px", borderRadius: 3, fontWeight: 700, background: "#22c55e", color: "#000" }}>ACCUMULATION</span>
            <span style={{ fontSize: 8, color: "#333" }}>×</span>
            <span style={{ fontSize: 7, padding: "2px 6px", borderRadius: 3, fontWeight: 700, background: "#f59e0b", color: "#000" }}>CYCLE COMPRESSION</span>
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, fontFamily: "'Instrument Serif', serif", color: "#fff" }}>
            ATH Break <span style={{ color: "#f59e0b" }}>~Jul 2027</span> · Spring <span style={{ color: "#22c55e" }}>Q1 2027</span> · Top <span style={{ color: "#8b5cf6" }}>2029–2030</span>
          </h1>
          <div style={{ fontSize: 10, color: "#444", marginTop: 6 }}>
            Reconciled: Wyckoff structure giữ nguyên nhưng timeline nén ~50% theo cycle compression data (KillaxBT)
          </div>
        </div>

        {/* Key Insight */}
        <div style={{
          background: "#f59e0b08", border: "1px solid #f59e0b22",
          borderRadius: 6, padding: 12, marginBottom: 16,
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#f59e0b", marginBottom: 6 }}>
            ⚡ INSIGHT — Cycle Compression thay đổi gì?
          </div>
          <div style={{ fontSize: 10, color: "#999", lineHeight: 1.8 }}>
            KillaxBT đo khoảng cách giữa các lần <strong style={{ color: "#f59e0b" }}>phá ATH</strong>: 1,478d → 1,424d → 849d → <strong style={{ color: "#f59e0b" }}>662d</strong> (−22% avg).
            Nếu đúng, BTC sẽ break $126K vào <strong style={{ color: "#f59e0b" }}>~Jul 2027</strong> — sớm hơn 18 tháng so với phân tích Wyckoff thuần.
            <br />
            Điều này buộc toàn bộ <strong style={{ color: "#22c55e" }}>accumulation phải nén lại 50%</strong>: từ 12 tháng còn ~6 tháng.
            Wyckoff structure vẫn đúng, chỉ là <em>tốc độ nhanh hơn</em>.
          </div>
        </div>

        {/* Phase Strip */}
        <div style={{ display: "flex", height: 24, borderRadius: 3, overflow: "hidden", marginBottom: 10, border: "1px solid #12121a" }}>
          {PHASES_RECONCILED.map((p, i) => (
            <div key={i}
              onMouseEnter={() => setHoverPhase(i)}
              onMouseLeave={() => setHoverPhase(null)}
              style={{
                flex: p.flex, background: hoverPhase === i ? p.color + "33" : p.color + "11",
                borderRight: i < 5 ? "1px solid #12121a" : "none",
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
          <div style={{ fontSize: 9, color: PHASES_RECONCILED[hoverPhase].color, marginBottom: 10, padding: "3px 8px", background: "#0d0d14", borderRadius: 4 }}>
            {PHASES_RECONCILED[hoverPhase].label} · {PHASES_RECONCILED[hoverPhase].range}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: 14 }}>
          {[
            { key: "compare", label: "So sánh" },
            { key: "chart", label: "Chart" },
            { key: "timeline", label: "Timeline" },
            { key: "strategy", label: "Chiến lược" },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              background: tab === t.key ? "#12121a" : "transparent",
              color: tab === t.key ? "#fff" : "#444",
              border: "1px solid #12121a", padding: "5px 12px",
              fontSize: 9, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              borderRadius: t.key === "compare" ? "4px 0 0 4px" : t.key === "strategy" ? "0 4px 4px 0" : 0,
              letterSpacing: 0.5,
            }}>{t.label}</button>
          ))}
        </div>

        {/* ===== SO SÁNH ===== */}
        {tab === "compare" && (
          <div style={{ display: "grid", gap: 14 }}>
            {/* Before vs After */}
            <div style={{ background: "#090910", border: "1px solid #12121a", borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#f59e0b", marginBottom: 14, letterSpacing: 2, textTransform: "uppercase" }}>
                Wyckoff thuần vs Wyckoff + Cycle Compression
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #1a1a25" }}>
                      {["Event", "Wyckoff thuần", "Reconciled", "Δ", "Lý do"].map((h, i) => (
                        <th key={i} style={{
                          padding: "5px 6px", textAlign: "left", fontSize: 8,
                          color: i === 2 ? "#22c55e" : "#444", fontWeight: 600,
                          background: i === 2 ? "#22c55e06" : "transparent",
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {OLD_TIMELINE.map((row, i) => (
                      <tr key={i} className="hr" style={{ borderBottom: "1px solid #0d0d12" }}>
                        <td style={{ padding: "5px 6px", color: "#aaa", fontWeight: 600 }}>{row.event}</td>
                        <td style={{ padding: "5px 6px", color: "#666" }}>{row.old}</td>
                        <td style={{ padding: "5px 6px", color: "#22c55e", fontWeight: 600, background: "#22c55e06" }}>{row.revised}</td>
                        <td style={{ padding: "5px 6px", color: row.delta.includes("−") ? "#ef4444" : "#555", fontWeight: 700, fontSize: 9 }}>{row.delta}</td>
                        <td style={{ padding: "5px 6px", color: "#444", fontSize: 9 }}>{row.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Why compression works */}
            <div style={{ background: "#090910", border: "1px solid #12121a", borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#8b5cf6", marginBottom: 12, letterSpacing: 2, textTransform: "uppercase" }}>
                Tại sao Accumulation bị nén?
              </div>
              <div style={{ display: "grid", gap: 8 }}>
                {[
                  { title: "① ETF Infrastructure đã sẵn sàng", desc: "Khác 2018–2020, infrastructure ETF, custody, derivatives đã mature. Smart money không cần 12 tháng để xây position — họ có thể accumulate qua ETF trong 3-4 tháng." },
                  { title: "② OG đã biết script", desc: "Composite man chu kỳ này không phải lần đầu. Họ biết accumulation tại đáy cycle luôn profitable → hành động nhanh hơn, giảm thời gian Phase B." },
                  { title: "③ Halving timeline ép buộc", desc: "Halving 03/2028 là deadline tự nhiên. Nếu ATH break Jul 2027, markup bắt đầu trước halving — halving trở thành mid-cycle catalyst thay vì Phase D trigger." },
                  { title: "④ Market memory ngắn hơn", desc: "Retail quay lại nhanh hơn mỗi cycle. 2015: retail mất 2 năm quay lại. 2019: 1.5 năm. 2023: 6 tháng. Dự kiến 2026-2027: 3-4 tháng sau bottom." },
                ].map((item, i) => (
                  <div key={i} className="hr" style={{ padding: "8px 10px", background: "#0d0d14", borderRadius: 5, borderLeft: "2px solid #8b5cf6" }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#ddd" }}>{item.title}</div>
                    <div style={{ fontSize: 10, color: "#555", marginTop: 3, lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Halving role change */}
            <div style={{ background: "#090910", border: "1px solid #12121a", borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#3b82f6", marginBottom: 12, letterSpacing: 2, textTransform: "uppercase" }}>
                Halving 2028 — vai trò thay đổi
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ padding: 10, background: "#0d0d14", borderRadius: 5, borderTop: "2px solid #666" }}>
                  <div style={{ fontSize: 9, color: "#555", marginBottom: 4 }}>WYCKOFF THUẦN</div>
                  <div style={{ fontSize: 11, color: "#888", lineHeight: 1.6 }}>
                    Halving = Phase D→E catalyst
                    <br />ATH break <em>sau</em> halving (Q1 2029)
                    <br />Halving khởi động markup
                  </div>
                </div>
                <div style={{ padding: 10, background: "#3b82f608", borderRadius: 5, borderTop: "2px solid #3b82f6" }}>
                  <div style={{ fontSize: 9, color: "#3b82f6", marginBottom: 4 }}>RECONCILED</div>
                  <div style={{ fontSize: 11, color: "#ccc", lineHeight: 1.6 }}>
                    Halving = <strong>Mid-cycle accelerator</strong>
                    <br />ATH break <em>trước</em> halving (Jul 2027)
                    <br />Halving đẩy giá từ $130-150K → $200K+
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 10, color: "#555", marginTop: 10, lineHeight: 1.6 }}>
                Đây chính xác là pattern của chu kỳ 2020: BTC break ATH $20K vào 12/2020, <em>trước</em> halving effect kick in. 
                Halving đã xảy ra 05/2020 nhưng real markup chỉ bắt đầu Q4/2020 và tiếp tục tới 11/2021.
              </div>
            </div>
          </div>
        )}

        {/* ===== CHART ===== */}
        {tab === "chart" && (
          <div style={{ background: "#090910", border: "1px solid #12121a", borderRadius: 8, padding: "18px 12px 8px", position: "relative", overflow: "hidden" }}>
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
                  <line x1={0} y1={pY(p)} x2={100} y2={pY(p)} stroke={p === 126000 ? "#f59e0b15" : "#0c0c14"} strokeWidth={p === 126000 ? 0.4 : 0.25} />
                  <text x={-2} y={pY(p) + 0.8} fill={p === 126000 ? "#f59e0b33" : "#1a1a22"} fontSize={2} textAnchor="end">${p >= 1000 ? `${p / 1000}K` : p}</text>
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
              <path d={toPath(PRICE_MAIN)} fill="none" stroke="#d4d0c8" strokeWidth={0.6} />

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
                  <text x={e.x} y={e.y - (e.big ? 1.2 : 0.5)} fill="#444" fontSize={1.4} textAnchor="middle">{e.sub}</text>
                </g>
              ))}

              {/* Time labels */}
              {[
                { x: 2, label: "03/26" }, { x: 12, label: "Q3/26" },
                { x: 27, label: "Q1/27" }, { x: 50, label: "07/27" },
                { x: 63, label: "03/28" }, { x: 80, label: "2029" },
                { x: 93, label: "2030" },
              ].map((t, i) => (
                <text key={i} x={t.x} y={99} fill="#222" fontSize={1.6} textAnchor="middle">{t.label}</text>
              ))}
            </svg>
          </div>
        )}

        {/* ===== TIMELINE ===== */}
        {tab === "timeline" && (
          <div style={{ background: "#090910", border: "1px solid #12121a", borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#22c55e", marginBottom: 14, letterSpacing: 2, textTransform: "uppercase" }}>
              Reconciled Timeline — Chi tiết từng giai đoạn
            </div>
            <div style={{ display: "grid", gap: 5 }}>
              {[
                { time: "03–08/2026", phase: "Markdown", price: "$66K → $28K", desc: "Phase E distribution hoàn tất. Markdown nhanh (~5 tháng thay vì 8) do leverage cao hơn chu kỳ trước. Miner capitulate, ETF outflow, 'crypto is dead' lần 4", col: "#991b1b", months: "5 mo" },
                { time: "08–09/2026", phase: "Phase A — SC + AR", price: "$28K → $38K", desc: "Selling Climax tại $28K (Log Fib 61.8%). Bounce tự động lên $38K. Volume spike rồi giảm — dấu hiệu supply cạn", col: "#f59e0b", months: "2 mo" },
                { time: "10/2026–01/2027", phase: "Phase B — Range", price: "$28K–$40K", desc: "NÉN từ 9 tháng còn 4 tháng. Smart money accumulate qua ETF (nhanh hơn OTC). Range hẹp, volume thấp. Boring — đây là lúc retail bỏ đi", col: "#f97316", months: "4 mo" },
                { time: "01–02/2027", phase: "Phase C — SPRING", price: "$24,000", desc: "Phá dưới SC $28K. Quét stop-loss. Có thể trigger bởi macro event (rate decision, geopolitics). Recovery trong 2-3 tuần. ENTRY TỐI ƯU", col: "#22c55e", months: "1 mo", hl: true },
                { time: "02–04/2027", phase: "Phase D — SOS", price: "$35K → $55K", desc: "Phá trên AR $38K, volume tăng mạnh. ETF inflow restart. 'Maybe crypto isn't dead' narrative. Smart money đã full position", col: "#3b82f6", months: "3 mo" },
                { time: "04–07/2027", phase: "Phase E — Markup", price: "$55K → $126K+", desc: "Markup tăng tốc. Phá $100K, rồi $126K ATH cũ. Trùng với KillaxBT target Jul 2027. Retail FOMO bắt đầu", col: "#8b5cf6", months: "3 mo" },
                { time: "07/2027–03/2028", phase: "Post-ATH Rally", price: "$126K → $155K", desc: "Giai đoạn 'price discovery' lần 1. Pullback, consolidation, rồi tiếp tục lên. Halving 03/2028 = catalyst tiếp theo", col: "#8b5cf6", months: "8 mo" },
                { time: "03/2028–Q4/2029", phase: "Post-Halving Euphoria", price: "$155K → $220-260K", desc: "Supply shock halving + đã phá ATH = combo mạnh nhất. Parabolic phase cuối. Target đỉnh dựa trên diminishing returns 8-11× từ Spring", col: "#a855f7", months: "18 mo" },
                { time: "Q4/2029–Q1/2030", phase: "New Distribution?", price: "$220K+ → ?", desc: "Cycle top. Composite man bắt đầu phân phối lại. Lặp lại Wyckoff Distribution Schematic — có thể #1 hoặc #2", col: "#ef4444", months: "—" },
              ].map((item, i) => (
                <div key={i} className="hr" style={{
                  display: "grid", gridTemplateColumns: "80px 1fr", gap: 8,
                  padding: "8px 10px", borderRadius: 4,
                  borderLeft: `2px solid ${item.col}`,
                  background: item.hl ? "#22c55e08" : "transparent",
                }}>
                  <div>
                    <div style={{ fontSize: 9, color: item.col, fontWeight: 700 }}>{item.time}</div>
                    <div style={{ fontSize: 8, color: "#333", marginTop: 2 }}>{item.months}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: item.hl ? "#22c55e" : "#ccc" }}>{item.phase}</div>
                    <div style={{ fontSize: 10, color: "#f59e0b", marginTop: 2 }}>{item.price}</div>
                    <div style={{ fontSize: 10, color: "#555", marginTop: 2, lineHeight: 1.5 }}>{item.desc}</div>
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
            <div style={{ background: "#090910", border: "1px solid #12121a", borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#22c55e", marginBottom: 14, letterSpacing: 2, textTransform: "uppercase" }}>
                Entry Zones — Revised with Cycle Compression
              </div>
              <div style={{ display: "grid", gap: 10 }}>
                {[
                  {
                    zone: "$26K–$30K", label: "SC Zone", timing: "08–10/2026", quality: "Tốt",
                    color: "#f59e0b", rr: "1:6 → 1:8",
                    desc: "Vùng Selling Climax. An toàn nhưng Spring có thể thấp hơn. DCA zone tốt.",
                  },
                  {
                    zone: "$22K–$25K", label: "Spring Zone ⭐", timing: "01–02/2027", quality: "Tối ưu",
                    color: "#22c55e", rr: "1:8 → 1:10",
                    desc: "Entry tốt nhất. Phá dưới SC, quét stop. Với timeline nén, Spring sẽ xảy ra sớm hơn → cần sẵn sàng từ cuối 2026.",
                  },
                  {
                    zone: "$45K–$55K", label: "SOS Breakout", timing: "03–04/2027", quality: "Confirm",
                    color: "#3b82f6", rr: "1:3 → 1:4",
                    desc: "Phá trên range. Ít risk nhất nhưng đã miss 50%+ upside từ Spring. Vẫn có R:R tốt nếu target $220K.",
                  },
                  {
                    zone: "$100K–$126K", label: "ATH Breakout", timing: "06–07/2027", quality: "Momentum",
                    color: "#8b5cf6", rr: "1:1.5 → 1:2",
                    desc: "Trade momentum khi phá ATH. R:R thấp hơn nhưng confirmation cao nhất. Cho người không dám mua đáy.",
                  },
                ].map((z, i) => (
                  <div key={i} style={{
                    padding: 12, borderRadius: 6,
                    background: z.quality === "Tối ưu" ? "#22c55e08" : "#0d0d14",
                    border: `1px solid ${z.quality === "Tối ưu" ? "#22c55e22" : "#12121a"}`,
                    animation: z.quality === "Tối ưu" ? "glow-green 3s infinite" : "none",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: z.color, fontFamily: "'Instrument Serif', serif" }}>{z.zone}</span>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <span style={{ fontSize: 9, color: "#888" }}>R:R {z.rr}</span>
                        <span style={{ fontSize: 7, color: "#000", background: z.color, padding: "2px 5px", borderRadius: 3, fontWeight: 700 }}>{z.quality}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 10, color: "#888", marginTop: 4 }}>{z.label} · {z.timing}</div>
                    <div style={{ fontSize: 10, color: "#555", marginTop: 4, lineHeight: 1.5 }}>{z.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* KillaxBT Scenarios */}
            <div style={{ background: "#090910", border: "1px solid #12121a", borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#f59e0b", marginBottom: 12, letterSpacing: 2, textTransform: "uppercase" }}>
                3 Scenarios từ Cycle Compression
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[
                  { label: "🐻 Bear", ath: "Feb 2028", days: "849d", comp: "0%", spring: "Q2 2027", top: "$180K", note: "Giống C3→C4, accumulation dài hơn", color: "#ef4444" },
                  { label: "◆ Base", ath: "Jul 2027", days: "662d", comp: "−22%", spring: "Q1 2027", top: "$220K", note: "Avg compression, most probable", color: "#f59e0b", primary: true },
                  { label: "🟢 Bull", ath: "Apr 2027", days: "551d", comp: "−35%", spring: "Q4 2026", top: "$260K+", note: "Continued acceleration, ETF tailwinds", color: "#22c55e" },
                ].map((s, i) => (
                  <div key={i} style={{
                    padding: 10, borderRadius: 6,
                    background: s.primary ? "#f59e0b08" : "#0d0d14",
                    border: `1px solid ${s.primary ? "#f59e0b22" : "#12121a"}`,
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: s.color, marginBottom: 6 }}>{s.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: "'Instrument Serif', serif" }}>{s.ath}</div>
                    <div style={{ fontSize: 9, color: "#555", marginTop: 4, lineHeight: 1.6 }}>
                      ATH break: {s.days} ({s.comp})
                      <br />Spring: {s.spring}
                      <br />Cycle top: {s.top}
                    </div>
                    <div style={{ fontSize: 8, color: "#333", marginTop: 4 }}>{s.note}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Final Verdict */}
            <div style={{
              background: "linear-gradient(135deg, #040812, #060608)",
              border: "1px solid #0a1a2a", borderRadius: 8, padding: 16,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", marginBottom: 8 }}>
                ⚡ KẾT LUẬN — Timeline Reconciled
              </div>
              <div style={{ fontSize: 11, color: "#aaa", lineHeight: 1.9 }}>
                Kết hợp Wyckoff structure + Cycle Compression data:
                <br /><br />
                <span style={{ color: "#991b1b" }}>Markdown:</span> $66K → $28K · <span style={{ color: "#555" }}>03–08/2026</span>
                <br />
                <span style={{ color: "#f59e0b" }}>Accumulation:</span> $28K–$40K · <span style={{ color: "#555" }}>08/2026 – 02/2027</span> (6 tháng, nén 50%)
                <br />
                <span style={{ color: "#22c55e", fontWeight: 700 }}>Spring: $24K</span> · <span style={{ color: "#555" }}>Q1 2027</span> (sớm hơn 6 tháng so với Wyckoff thuần)
                <br />
                <span style={{ color: "#f59e0b", fontWeight: 700 }}>ATH Break: $126K+</span> · <span style={{ color: "#555" }}>~Jul 2027</span> (662 ngày từ Oct 2025 top)
                <br />
                <span style={{ color: "#8b5cf6" }}>Halving:</span> 03/2028 · mid-cycle accelerator
                <br />
                <span style={{ color: "#8b5cf6", fontWeight: 700, fontSize: 14 }}>Cycle Top: $220K–$260K</span> · <span style={{ color: "#555" }}>Q4 2029 – Q1 2030</span>
              </div>
              <div style={{ fontSize: 9, color: "#332", marginTop: 12, fontStyle: "italic" }}>
                ⚠️ Phân tích kết hợp Wyckoff + cycle compression. Timeline có thể thay đổi ±3 tháng tùy macro.
              </div>
            </div>
          </div>
        )}

        <div style={{ fontSize: 8, color: "#12121a", textAlign: "center", padding: "14px 0" }}>
          Wyckoff Accumulation × Cycle Compression · Reconciled Analysis · March 28, 2026
        </div>
      </div>
    </div>
  );
}
