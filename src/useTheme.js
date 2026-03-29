import { useState, useEffect } from "react";

const dark = {
  bg: "#060609",
  bgCard: "#0a0a10",
  bgSubtle: "#0d0d14",
  border: "#151520",
  borderFaint: "#12121a",
  text: "#d4d0c8",
  textHeading: "#ffffff",
  textStrong: "#cccccc",
  textMid: "#999999",
  textSoft: "#888888",
  textMuted: "#666666",
  textDim: "#555555",
  textFaint: "#444444",
  textVeryFaint: "#333333",
  textGhost: "#1a1a25",
  gridLine: "#111118",
  gridLabel: "#2a2a35",
  gridLineFaint: "#0c0c14",
  gridLabelFaint: "#1a1a22",
  priceLine: "#d4d0c8",
  hoverBg: "rgba(255,255,255,0.025)",
  textOldData: "#886622",
  verdictBg: "linear-gradient(135deg, #120408, #060609)",
  verdictBorder: "#2a0a12",
  verdictBgR: "linear-gradient(135deg, #040812, #060608)",
  verdictBorderR: "#0a1a2a",
};

const light = {
  bg: "#f5f5fa",
  bgCard: "#eaeaf2",
  bgSubtle: "#e2e2ee",
  border: "#c8c8dc",
  borderFaint: "#d0d0e6",
  text: "#1a1a2e",
  textHeading: "#080818",
  textStrong: "#2a2a40",
  textMid: "#5a5a70",
  textSoft: "#666678",
  textMuted: "#777788",
  textDim: "#888898",
  textFaint: "#9090a0",
  textVeryFaint: "#9898a8",
  textGhost: "#e0e0f0",
  gridLine: "#d0d0e0",
  gridLabel: "#8888a0",
  gridLineFaint: "#d4d4e8",
  gridLabelFaint: "#9090a8",
  priceLine: "#1a1a2e",
  hoverBg: "rgba(0,0,0,0.025)",
  textOldData: "#8a6020",
  verdictBg: "#fdf0f2",
  verdictBorder: "#f0c0cc",
  verdictBgR: "#f0f4fc",
  verdictBorderR: "#b8c8ee",
};

export function useTheme() {
  const [isDark, setIsDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setIsDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isDark ? dark : light;
}
