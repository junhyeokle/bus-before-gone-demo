import { useState, useEffect } from "react";
import { REGIONS, getRisk } from "../data";

const DRT_COST_PER_CAR = 4200;
const COVERAGE_PER_CAR = 80;
const DEMAND_SATISFACTION = 0.85;

export default function SimulatorPage({ initialRegion }) {
  const [region, setRegion] = useState(initialRegion || null);
  const [cars, setCars] = useState(1);
  const [hours, setHours] = useState(12);
  const [simulated, setSimulated] = useState(false);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    if (initialRegion) { setRegion(initialRegion); setSimulated(false); setShowReport(false); }
  }, [initialRegion]);

  const covered = region ? Math.min(Math.round(cars * COVERAGE_PER_CAR * (hours / 12)), region.population) : 0;
  const satisfied = region ? Math.min(Math.round(region.drtDemand * DEMAND_SATISFACTION * cars), region.drtDemand) : 0;
  const annualCost = cars * DRT_COST_PER_CAR * 10;
  const costPerPerson = covered > 0 ? Math.round(annualCost * 10000 / covered / 12) : 0;
  const coverageRate = region ? Math.round(covered / region.population * 100) : 0;
  const demandRate = region ? Math.round(satisfied / region.drtDemand * 100) : 0;

  const getPriority = () => {
    if (!region) return null;
    if (region.risk >= 75 && region.drtDemand >= 80) return { label: "최우선 투입 권고", color: "#EF4444", bg: "#450A0A", desc: "위험도 높고 수요도 충분하여 즉시 DRT 투입이 권장됩니다." };
    if (region.risk >= 75) return { label: "우선 투입 권고", color: "#F97316", bg: "#431407", desc: "위험도가 높아 우선적으로 DRT 도입을 검토해야 합니다." };
    if (region.risk >= 50) return { label: "단기 계획 수립", color: "#EAB308", bg: "#422006", desc: "중기적으로 DRT 도입 계획을 수립하는 것이 권장됩니다." };
    return { label: "장기 모니터링", color: "#22C55E", bg: "#052E16", desc: "현재는 비교적 안전하지만 지속적인 모니터링이 필요합니다." };
  };

  const priority = getPriority();

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* 좌측 설정 패널 */}
      <div style={{ width: 320, borderRight: "1px solid #1E293B", padding: 20, overflowY: "auto", flexShrink: 0, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9" }}>⚙️ DRT 투입 조건 설정</div>

        {/* 지역 선택 */}
        <div style={{ background: "#1E293B", borderRadius: 12, border: "1px solid #334155", padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8", marginBottom: 10 }}>분석 대상 지역</div>
          <select value={region?.id || ""} onChange={e => { const r = REGIONS.find(x => x.id === parseInt(e.target.value)); setRegion(r || null); setSimulated(false); setShowReport(false); }} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, background: "#0F172A", border: "1px solid #334155", color: region ? "#F1F5F9" : "#64748B", fontSize: 14, marginBottom: 10 }}>
            <option value="">지역을 선택해주세요</option>
            {REGIONS.map(r => <option key={r.id} value={r.id}>{r.name} ({getRisk(r.risk).label} {r.risk}%)</option>)}
          </select>
          {region && priority && (
            <div style={{ padding: "10px 12px", background: priority.bg, borderRadius: 8, border: `1px solid ${priority.color}30` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: priority.color, marginBottom: 3 }}>{priority.label}</div>
              <div style={{ fontSize: 11, color: priority.color, opacity: 0.8 }}>{priority.desc}</div>
            </div>
          )}
        </div>

        {/* 차량 대수 슬라이더 */}
        <div style={{ background: "#1E293B", borderRadius: 12, border: "1px solid #334155", padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8" }}>투입 차량 대수</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#60A5FA" }}>{cars}대</div>
          </div>
          <input type="range" min={1} max={5} value={cars} onChange={e => { setCars(parseInt(e.target.value)); setSimulated(false); }} style={{ width: "100%", accentColor: "#3B82F6", marginBottom: 8 }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 10, color: "#475569" }}>1대 (최소)</span>
            <span style={{ fontSize: 10, color: "#475569" }}>5대 (최대)</span>
          </div>
          <div style={{ marginTop: 10, padding: "8px 10px", background: "#0F172A", borderRadius: 6 }}>
            <div style={{ fontSize: 11, color: "#64748B" }}>예상 연간 운영비</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#F1F5F9" }}>{(annualCost).toFixed(0)}만원 <span style={{ fontSize: 11, color: "#64748B" }}>/ 년</span></div>
          </div>
        </div>

        {/* 운행 시간 슬라이더 */}
        <div style={{ background: "#1E293B", borderRadius: 12, border: "1px solid #334155", padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8" }}>일일 운행 시간</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#34D399" }}>{hours}시간</div>
          </div>
          <input type="range" min={6} max={18} step={2} value={hours} onChange={e => { setHours(parseInt(e.target.value)); setSimulated(false); }} style={{ width: "100%", accentColor: "#10B981", marginBottom: 8 }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 10, color: "#475569" }}>6시간</span>
            <span style={{ fontSize: 10, color: "#475569" }}>18시간</span>
          </div>
          <div style={{ marginTop: 10, padding: "8px 10px", background: "#0F172A", borderRadius: 6 }}>
            <div style={{ fontSize: 11, color: "#64748B" }}>운행 시간대</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#F1F5F9" }}>오전 6시 ~ 오후 {6 + hours - 12 >= 12 ? (6 + hours - 12) + "시" : `오후 ${6 + hours}시`}</div>
          </div>
        </div>

        {/* 시뮬레이션 버튼 */}
        <button onClick={() => region && setSimulated(true)} style={{ width: "100%", padding: "13px", borderRadius: 10, background: region ? "linear-gradient(135deg, #1D4ED8, #1E40AF)" : "#1E293B", border: "none", color: region ? "white" : "#475569", fontSize: 14, fontWeight: 700, cursor: region ? "pointer" : "default", transition: "all .2s" }}>
          {simulated ? "🔄 다시 시뮬레이션" : "▶ 시뮬레이션 실행"}
        </button>
      </div>

      {/* 우측 결과 패널 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
        {!region ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>🚌</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#475569", marginBottom: 8 }}>지역을 선택하고 시뮬레이션을 실행해주세요</div>
            <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.7 }}>교통 공백 지도 또는 지자체 대시보드에서<br />'DRT 시뮬레이터로 보내기' 버튼을 클릭하거나<br />왼쪽에서 직접 지역을 선택할 수 있습니다</div>
          </div>
        ) : !simulated ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#F1F5F9", marginBottom: 8 }}>{region.name.split(" ").slice(-1)[0]} 준비 완료</div>
            <div style={{ fontSize: 13, color: "#64748B", marginBottom: 24 }}>왼쪽에서 차량 대수와 운행 시간을 설정하고<br />시뮬레이션을 실행해주세요</div>
            {priority && (
              <div style={{ padding: "14px 20px", background: priority.bg, borderRadius: 12, border: `1px solid ${priority.color}30`, maxWidth: 400 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: priority.color, marginBottom: 6 }}>{priority.label}</div>
                <div style={{ fontSize: 12, color: priority.color, opacity: 0.8 }}>{priority.desc}</div>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* 결과 헤더 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 10, color: "#64748B", marginBottom: 4 }}>{region.name}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#F1F5F9" }}>DRT 투입 시뮬레이션 결과</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setShowReport(!showReport)} style={{ padding: "8px 16px", borderRadius: 8, background: "#1E293B", border: "1px solid #334155", color: "#CBD5E1", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>📋 {showReport ? "결과 보기" : "리포트 보기"}</button>
              </div>
            </div>

            {!showReport ? (
              <>
                {/* 핵심 지표 4개 */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
                  {[
                    { label: "커버 가능 인구", value: covered.toLocaleString() + "명", sub: `전체의 ${coverageRate}%`, color: "#60A5FA", icon: "👥" },
                    { label: "수요 충족률", value: demandRate + "%", sub: `${satisfied}명 / ${region.drtDemand}명`, color: "#34D399", icon: "✅" },
                    { label: "연간 운영비", value: annualCost + "만원", sub: `월 ${Math.round(annualCost / 12)}만원`, color: "#F97316", icon: "💰" },
                    { label: "1인당 월 비용", value: costPerPerson.toLocaleString() + "원", sub: "커버 인구 기준", color: "#A78BFA", icon: "📊" },
                  ].map(s => (
                    <div key={s.label} style={{ background: "#1E293B", borderRadius: 12, padding: "16px 14px", border: "1px solid #334155", textAlign: "center" }}>
                      <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
                      <div style={{ fontSize: 10, color: "#64748B", marginBottom: 4 }}>{s.label}</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                      <div style={{ fontSize: 10, color: "#475569", marginTop: 4 }}>{s.sub}</div>
                    </div>
                  ))}
                </div>

                {/* 커버리지 및 수요 게이지 */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
                  {[
                    { label: "인구 커버리지", value: coverageRate, color: "#3B82F6", desc: `${covered.toLocaleString()}명 / ${region.population.toLocaleString()}명` },
                    { label: "DRT 수요 충족률", value: demandRate, color: "#10B981", desc: `${satisfied}명 / ${region.drtDemand}명` },
                  ].map(g => (
                    <div key={g.label} style={{ background: "#1E293B", borderRadius: 12, border: "1px solid #334155", padding: 18 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#94A3B8" }}>{g.label}</span>
                        <span style={{ fontSize: 20, fontWeight: 800, color: g.color }}>{g.value}%</span>
                      </div>
                      <div style={{ height: 10, background: "#334155", borderRadius: 5, overflow: "hidden", marginBottom: 8 }}>
                        <div style={{ width: `${g.value}%`, height: "100%", background: g.color, borderRadius: 5, transition: "width 0.8s ease" }} />
                      </div>
                      <div style={{ fontSize: 11, color: "#64748B" }}>{g.desc}</div>
                    </div>
                  ))}
                </div>

                {/* 차량 수별 비교표 */}
                <div style={{ background: "#1E293B", borderRadius: 12, border: "1px solid #334155", overflow: "hidden", marginBottom: 20 }}>
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid #334155", fontSize: 13, fontWeight: 600, color: "#94A3B8" }}>차량 대수별 효과 비교</div>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#0F172A" }}>
                        {["차량", "커버 인구", "수요 충족", "연간 비용", "1인당 비용"].map(h => (
                          <th key={h} style={{ padding: "8px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#64748B" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5].map(c => {
                        const cov = Math.min(Math.round(c * COVERAGE_PER_CAR * (hours / 12)), region.population);
                        const sat = Math.min(Math.round(region.drtDemand * DEMAND_SATISFACTION * c), region.drtDemand);
                        const cost = c * DRT_COST_PER_CAR * 10;
                        const cpp = cov > 0 ? Math.round(cost * 10000 / cov / 12) : 0;
                        const isSelected = c === cars;
                        return (
                          <tr key={c} onClick={() => { setCars(c); }} style={{ background: isSelected ? "#172554" : "transparent", cursor: "pointer", borderBottom: "1px solid #1E293B", transition: "background .15s" }}>
                            <td style={{ padding: "10px 14px" }}><span style={{ fontSize: 13, fontWeight: isSelected ? 700 : 400, color: isSelected ? "#60A5FA" : "#CBD5E1" }}>{c}대 {isSelected ? "← 현재" : ""}</span></td>
                            <td style={{ padding: "10px 14px", fontSize: 13, color: "#CBD5E1" }}>{cov.toLocaleString()}명 ({Math.round(cov / region.population * 100)}%)</td>
                            <td style={{ padding: "10px 14px", fontSize: 13, color: "#34D399" }}>{Math.round(sat / region.drtDemand * 100)}%</td>
                            <td style={{ padding: "10px 14px", fontSize: 13, color: "#F97316" }}>{cost}만원</td>
                            <td style={{ padding: "10px 14px", fontSize: 13, color: "#A78BFA" }}>{cpp.toLocaleString()}원</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* AI 권고 */}
                <div style={{ background: priority ? priority.bg : "#1E293B", borderRadius: 12, border: `1px solid ${priority ? priority.color + "40" : "#334155"}`, padding: 18 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: priority?.color || "#F1F5F9", marginBottom: 8 }}>🤖 AI 투입 권고</div>
                  <div style={{ fontSize: 13, color: priority?.color || "#CBD5E1", opacity: 0.9, lineHeight: 1.7 }}>
                    {region.name} 지역의 AI 예측 위험도는 <strong>{region.risk}%</strong>이며, 주민 수요는 <strong>{region.drtDemand}명</strong>입니다.<br />
                    현재 설정({cars}대, {hours}시간)으로 전체 주민의 <strong>{coverageRate}%</strong>를 커버하며, 수요의 <strong>{demandRate}%</strong>를 충족할 수 있습니다.<br />
                    연간 <strong>{annualCost}만원</strong>의 예산으로 1인당 월 <strong>{costPerPerson.toLocaleString()}원</strong>의 비용이 발생합니다.
                  </div>
                </div>
              </>
            ) : (
              /* 리포트 뷰 */
              <div style={{ background: "#1E293B", borderRadius: 12, border: "1px solid #334155", padding: 28, maxWidth: 700 }}>
                <div style={{ textAlign: "center", marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid #334155" }}>
                  <div style={{ fontSize: 11, color: "#64748B", marginBottom: 4 }}>DRT 도입 검토 보고서</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#F1F5F9", marginBottom: 4 }}>{region.name} DRT 투입 타당성 분석</div>
                  <div style={{ fontSize: 11, color: "#475569" }}>생성일: {new Date().toLocaleDateString("ko-KR")} | AI 예측 모델: LSTM</div>
                </div>
                {[
                  { title: "1. 현황 요약", content: `${region.name}은 현재 AI 예측 위험도 ${region.risk}%(${getRisk(region.risk).label} 단계)로, 버스 노선 ${region.routes}개가 운영 중입니다. 월 이용객은 ${region.passengers}명으로 전년 대비 ${Math.abs(region.trend)}% 감소하였으며, 주민 ${region.drtDemand}명이 DRT 도입을 요청한 상태입니다.` },
                  { title: "2. 시뮬레이션 결과", content: `차량 ${cars}대, 일 ${hours}시간 운행 시 커버 가능 인구는 ${covered.toLocaleString()}명(전체의 ${coverageRate}%)이며, 수요 충족률은 ${demandRate}%입니다. 연간 운영비는 ${annualCost}만원으로, 커버 인구 1인당 월 ${costPerPerson.toLocaleString()}원의 비용이 산출됩니다.` },
                  { title: "3. 종합 의견", content: priority ? priority.desc + ` 차량 ${cars}대 투입을 권고합니다.` : "" },
                ].map(s => (
                  <div key={s.title} style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#60A5FA", marginBottom: 6 }}>{s.title}</div>
                    <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.8 }}>{s.content}</div>
                  </div>
                ))}
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #334155", display: "flex", justifyContent: "flex-end" }}>
                  <button onClick={() => window.print()} style={{ padding: "8px 20px", borderRadius: 8, background: "#1D4ED8", border: "none", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>🖨️ 인쇄 / PDF 저장</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
