import { useState } from "react";
import { REGIONS, getRisk, MONTHS } from "../data";

const TREND_DATA = [320, 298, 271, 253, 241, 228, 214, 201, 189, 178, 165, 154];

export default function DashboardPage({ onSendToSimulator }) {
  const [sortBy, setSortBy] = useState("risk");
  const [selectedMonth, setSelectedMonth] = useState(11);
  const [viewMode, setViewMode] = useState("list");

  const sorted = [...REGIONS].sort((a, b) => {
    if (sortBy === "risk") return b.risk - a.risk;
    if (sortBy === "demand") return b.drtDemand - a.drtDemand;
    if (sortBy === "trend") return a.trend - b.trend;
    return 0;
  });

  const totalDemand = REGIONS.reduce((s, r) => s + r.drtDemand, 0);
  const dangerRegions = REGIONS.filter(r => r.risk >= 75);
  const avgRisk = Math.round(REGIONS.reduce((s, r) => s + r.risk, 0) / REGIONS.length);
  const maxH = Math.max(...TREND_DATA);

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* 좌측 요약 */}
      <div style={{ width: 260, borderRight: "1px solid #1E293B", padding: 20, display: "flex", flexDirection: "column", gap: 14, overflowY: "auto", flexShrink: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#F1F5F9" }}>📊 전체 현황</div>
        {[
          { label: "모니터링 지역", value: REGIONS.length + "개", color: "#E2E8F0", sub: "전국 읍면동" },
          { label: "즉시 대응 필요", value: dangerRegions.length + "개", color: "#EF4444", sub: "위험 단계" },
          { label: "총 DRT 수요", value: totalDemand + "명", color: "#60A5FA", sub: "주민 등록" },
          { label: "평균 위험도", value: avgRisk + "%", color: "#F97316", sub: "AI 예측" },
        ].map(s => (
          <div key={s.label} style={{ background: "#1E293B", borderRadius: 10, padding: "12px 14px", border: "1px solid #334155" }}>
            <div style={{ fontSize: 10, color: "#64748B", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 10, color: "#475569", marginTop: 3 }}>{s.sub}</div>
          </div>
        ))}

        {/* 월별 이용객 추이 미니차트 */}
        <div style={{ background: "#1E293B", borderRadius: 10, padding: "12px 14px", border: "1px solid #334155" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", marginBottom: 12 }}>월별 전체 이용객 추이</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 60 }}>
            {TREND_DATA.map((v, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <div onClick={() => setSelectedMonth(i)} style={{ width: "100%", background: i === selectedMonth ? "#3B82F6" : "#334155", borderRadius: "2px 2px 0 0", height: `${(v / maxH) * 52}px`, cursor: "pointer", transition: "all .2s" }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            <span style={{ fontSize: 9, color: "#475569" }}>1월</span>
            <span style={{ fontSize: 9, color: "#3B82F6", fontWeight: 600 }}>{MONTHS[selectedMonth]}: {TREND_DATA[selectedMonth]}명</span>
            <span style={{ fontSize: 9, color: "#475569" }}>12월</span>
          </div>
        </div>

        {/* 위험 지역 빠른 목록 */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", marginBottom: 8 }}>🔴 즉시 대응 필요</div>
          {dangerRegions.map(r => (
            <div key={r.id} onClick={() => onSendToSimulator(r)} style={{ padding: "8px 10px", background: "#450A0A", borderRadius: 8, border: "1px solid #EF444430", marginBottom: 5, cursor: "pointer" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#FCA5A5", marginBottom: 2 }}>{r.name.split(" ").slice(-1)[0]}</div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 10, color: "#F87171" }}>위험도 {r.risk}%</span>
                <span style={{ fontSize: 10, color: "#FCA5A5" }}>→ 시뮬레이터</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 우측 메인 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* 상단 툴바 */}
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #1E293B", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9" }}>지역별 교통 공백 현황</div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 6 }}>
              <span style={{ fontSize: 12, color: "#64748B" }}>정렬:</span>
              {[{ k: "risk", label: "위험도" }, { k: "demand", label: "수요" }, { k: "trend", label: "감소율" }].map(s => (
                <button key={s.k} onClick={() => setSortBy(s.k)} style={{ padding: "5px 12px", borderRadius: 6, border: `1px solid ${sortBy === s.k ? "#3B82F6" : "#334155"}`, background: sortBy === s.k ? "#172554" : "transparent", color: sortBy === s.k ? "#60A5FA" : "#64748B", fontSize: 12, fontWeight: sortBy === s.k ? 600 : 400, cursor: "pointer" }}>{s.label}</button>
              ))}
            </div>
            <div style={{ width: 1, height: 20, background: "#334155" }} />
            <div style={{ display: "flex", gap: 4 }}>
              {[{ k: "list", icon: "☰" }, { k: "card", icon: "⊞" }].map(v => (
                <button key={v.k} onClick={() => setViewMode(v.k)} style={{ width: 30, height: 30, borderRadius: 6, border: `1px solid ${viewMode === v.k ? "#3B82F6" : "#334155"}`, background: viewMode === v.k ? "#172554" : "transparent", color: viewMode === v.k ? "#60A5FA" : "#64748B", fontSize: 14, cursor: "pointer" }}>{v.icon}</button>
              ))}
            </div>
          </div>
        </div>

        {/* 테이블 또는 카드 */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          {viewMode === "list" ? (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #334155" }}>
                  {["지역명", "위험도", "인구", "노선 수", "월 이용객", "이용객 감소", "DRT 수요", "민원 건수", "액션"].map(h => (
                    <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#64748B", letterSpacing: "0.3px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((r, i) => {
                  const rc = getRisk(r.risk);
                  return (
                    <tr key={r.id} style={{ borderBottom: "1px solid #1E293B", transition: "background .15s" }} onMouseEnter={e => e.currentTarget.style.background = "#1E293B"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "10px 12px" }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0" }}>{r.name.split(" ").slice(-1)[0]}</div>
                        <div style={{ fontSize: 10, color: "#475569" }}>{r.name.split(" ").slice(0, 2).join(" ")}</div>
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ width: 50, height: 5, background: "#334155", borderRadius: 3, overflow: "hidden" }}>
                            <div style={{ width: `${r.risk}%`, height: "100%", background: rc.color }} />
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 700, color: rc.color }}>{r.risk}%</span>
                        </div>
                        <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 10, background: rc.bg, color: rc.color, marginTop: 3, display: "inline-block" }}>{rc.label}</span>
                      </td>
                      <td style={{ padding: "10px 12px", fontSize: 13, color: "#CBD5E1" }}>{r.population.toLocaleString()}</td>
                      <td style={{ padding: "10px 12px", fontSize: 13, color: "#CBD5E1" }}>{r.routes}개</td>
                      <td style={{ padding: "10px 12px", fontSize: 13, color: "#CBD5E1" }}>{r.passengers}명</td>
                      <td style={{ padding: "10px 12px", fontSize: 13, color: "#F87171", fontWeight: 600 }}>{r.trend}%</td>
                      <td style={{ padding: "10px 12px", fontSize: 13, color: "#60A5FA", fontWeight: 600 }}>{r.drtDemand}명</td>
                      <td style={{ padding: "10px 12px", fontSize: 13, color: "#CBD5E1" }}>{r.complaints}건</td>
                      <td style={{ padding: "10px 12px" }}>
                        <button onClick={() => onSendToSimulator(r)} style={{ padding: "6px 12px", borderRadius: 6, background: "#1D4ED8", border: "none", color: "white", fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>시뮬레이터 →</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
              {sorted.map(r => {
                const rc = getRisk(r.risk);
                return (
                  <div key={r.id} style={{ background: "#1E293B", borderRadius: 12, border: `1px solid ${rc.border}`, padding: 16, transition: "all .2s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div>
                        <div style={{ fontSize: 10, color: "#64748B" }}>{r.name.split(" ").slice(0, 2).join(" ")}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9" }}>{r.name.split(" ").slice(-1)[0]}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 22, fontWeight: 900, color: rc.color }}>{r.risk}%</div>
                        <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 8, background: rc.bg, color: rc.color }}>{rc.label}</span>
                      </div>
                    </div>
                    <div style={{ height: 4, background: "#334155", borderRadius: 2, overflow: "hidden", marginBottom: 10 }}>
                      <div style={{ width: `${r.risk}%`, height: "100%", background: rc.color }} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 12 }}>
                      {[{ label: "이용객 감소", value: r.trend + "%", c: "#F87171" }, { label: "DRT 수요", value: r.drtDemand + "명", c: "#60A5FA" }].map(m => (
                        <div key={m.label} style={{ background: "#0F172A", borderRadius: 6, padding: "6px 8px" }}>
                          <div style={{ fontSize: 9, color: "#475569" }}>{m.label}</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: m.c }}>{m.value}</div>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => onSendToSimulator(r)} style={{ width: "100%", padding: "8px", borderRadius: 8, background: "#1D4ED8", border: "none", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>🚌 DRT 시뮬레이터로 보내기</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
