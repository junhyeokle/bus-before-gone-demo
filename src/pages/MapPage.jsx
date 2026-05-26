import { useState, useEffect, useRef } from "react";
import { REGIONS, getRisk } from "../data";

export default function MapPage({ onSendToSimulator }) {
  const mapRef = useRef(null);
  const leafletRef = useRef(null);
  const markersRef = useRef([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("전체");
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (leafletRef.current) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
      const L = window.L;
      const map = L.map(mapRef.current, { center: [36.5, 127.8], zoom: 7, zoomControl: false, attributionControl: false });
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", { subdomains: "abcd", maxZoom: 19 }).addTo(map);
      L.control.zoom({ position: "topright" }).addTo(map);
      L.control.attribution({ prefix: "© OpenStreetMap © CARTO", position: "bottomright" }).addTo(map);
      leafletRef.current = { L, map };
      REGIONS.forEach(r => {
        const rc = getRisk(r.risk);
        const size = r.risk >= 75 ? 28 : r.risk >= 50 ? 24 : 20;
        const pulse = r.risk >= 75 ? `<div style="width:${size+18}px;height:${size+18}px;border-radius:50%;border:2px solid ${rc.color};position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);animation:pulseMap 2s ease-in-out infinite;opacity:0.5;pointer-events:none;"></div>` : "";
        const icon = L.divIcon({
          className: "",
          html: `<div style="position:relative;width:${size}px;height:${size}px;cursor:pointer;">${pulse}<div style="width:${size}px;height:${size}px;border-radius:50%;background:${rc.color};border:2.5px solid white;box-shadow:0 0 12px ${rc.color}88;display:flex;align-items:center;justify-content:center;font-size:${Math.round(size*0.38)}px;font-weight:800;color:white;">${r.risk}</div></div>`,
          iconSize: [size + 20, size + 20], iconAnchor: [(size + 20) / 2, (size + 20) / 2],
        });
        const marker = L.marker([r.lat, r.lng], { icon }).addTo(map);
        marker.on("click", () => setSelected(prev => prev?.id === r.id ? null : r));
        marker.regionId = r.id;
        markersRef.current.push(marker);
      });
      setMapReady(true);
    };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!leafletRef.current || !mapReady) return;
    const { L } = leafletRef.current;
    markersRef.current.forEach(marker => {
      const r = REGIONS.find(x => x.id === marker.regionId);
      if (!r) return;
      const rc = getRisk(r.risk);
      const base = r.risk >= 75 ? 28 : r.risk >= 50 ? 24 : 20;
      const size = selected?.id === r.id ? base + 8 : base;
      const pulse = r.risk >= 75 ? `<div style="width:${size+18}px;height:${size+18}px;border-radius:50%;border:2px solid ${rc.color};position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);animation:pulseMap 2s ease-in-out infinite;opacity:0.5;pointer-events:none;"></div>` : "";
      const shadow = selected?.id === r.id ? `0 0 20px ${rc.color}CC` : `0 0 12px ${rc.color}88`;
      const icon = L.divIcon({
        className: "",
        html: `<div style="position:relative;width:${size}px;height:${size}px;cursor:pointer;">${pulse}<div style="width:${size}px;height:${size}px;border-radius:50%;background:${rc.color};border:${selected?.id === r.id ? "3px" : "2.5px"} solid white;box-shadow:${shadow};display:flex;align-items:center;justify-content:center;font-size:${Math.round(size*0.38)}px;font-weight:800;color:white;">${r.risk}</div></div>`,
        iconSize: [size + 20, size + 20], iconAnchor: [(size + 20) / 2, (size + 20) / 2],
      });
      marker.setIcon(icon);
    });
  }, [selected, mapReady]);

  const filtered = REGIONS.filter(r => filter === "전체" || getRisk(r.risk).label === filter).sort((a, b) => b.risk - a.risk);
  const counts = { 위험: REGIONS.filter(r => r.risk >= 75).length, 주의: REGIONS.filter(r => r.risk >= 50 && r.risk < 75).length, 양호: REGIONS.filter(r => r.risk < 50).length };

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      <style>{`@keyframes pulseMap{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.5}50%{transform:translate(-50%,-50%) scale(1.4);opacity:.15}}`}</style>

      {/* 좌측 패널 */}
      <div style={{ width: 280, borderRight: "1px solid #1E293B", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "14px", borderBottom: "1px solid #1E293B" }}>
          <div style={{ fontSize: 10, color: "#475569", fontWeight: 600, letterSpacing: "0.8px", marginBottom: 10, textTransform: "uppercase" }}>12개월 내 위험 현황</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
            {[{ label: "위험", count: counts.위험, color: "#EF4444", bg: "#450A0A" }, { label: "주의", count: counts.주의, color: "#F97316", bg: "#431407" }, { label: "양호", count: counts.양호, color: "#22C55E", bg: "#052E16" }].map(s => (
              <div key={s.label} style={{ background: s.bg, borderRadius: 8, padding: "8px 6px", textAlign: "center", border: `1px solid ${s.color}30` }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.count}</div>
                <div style={{ fontSize: 11, color: s.color, opacity: 0.75 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: "10px 14px", borderBottom: "1px solid #1E293B", display: "flex", gap: 5, flexWrap: "wrap" }}>
          {[{ label: "전체", color: "#3B82F6" }, { label: "위험", color: "#EF4444" }, { label: "주의", color: "#F97316" }, { label: "양호", color: "#22C55E" }].map(f => (
            <button key={f.label} onClick={() => setFilter(f.label)} style={{ padding: "5px 13px", borderRadius: 16, border: `1.5px solid ${filter === f.label ? f.color : "#334155"}`, background: filter === f.label ? f.color + "15" : "transparent", color: filter === f.label ? f.color : "#64748B", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{f.label}</button>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {filtered.map(r => {
            const rc = getRisk(r.risk);
            return (
              <div key={r.id} onClick={() => { setSelected(prev => prev?.id === r.id ? null : r); leafletRef.current?.map.flyTo([r.lat, r.lng], 10, { duration: 0.8 }); }}
                style={{ padding: "10px 14px", cursor: "pointer", borderLeft: `3px solid ${selected?.id === r.id ? "#3B82F6" : "transparent"}`, background: selected?.id === r.id ? "#172554" : "transparent", transition: "all .15s", borderBottom: "1px solid #1E293B10" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0", flex: 1, paddingRight: 8, lineHeight: 1.3 }}>{r.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: rc.color }} />
                    <span style={{ fontSize: 11, color: rc.color, fontWeight: 700 }}>{rc.label}</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1, height: 5, background: "#334155", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${r.risk}%`, height: "100%", background: rc.color, borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: rc.color, minWidth: 30, textAlign: "right" }}>{r.risk}%</span>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: "#475569" }}>노선 {r.routes}개</span>
                  <span style={{ fontSize: 11, color: "#F87171" }}>↓{Math.abs(r.trend)}%</span>
                  <span style={{ fontSize: 11, color: "#60A5FA" }}>수요 {r.drtDemand}명</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 지도 */}
      <div style={{ flex: 1, position: "relative" }}>
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
        <div style={{ position: "absolute", bottom: 24, left: 16, background: "rgba(15,23,42,0.92)", borderRadius: 10, padding: "12px 14px", border: "1px solid #334155", zIndex: 1000 }}>
          <div style={{ fontSize: 10, color: "#64748B", fontWeight: 600, marginBottom: 8 }}>12개월 내 폐선 위험도</div>
          {[{ color: "#EF4444", label: "위험 (75% 이상)" }, { color: "#F97316", label: "주의 (50~74%)" }, { color: "#22C55E", label: "양호 (50% 미만)" }].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: l.color, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "#CBD5E1" }}>{l.label}</span>
            </div>
          ))}
          <div style={{ marginTop: 6, paddingTop: 6, borderTop: "1px solid #334155", fontSize: 10, color: "#475569" }}>마커 숫자 = AI 예측 위험도(%)</div>
        </div>
        <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(15,23,42,0.88)", borderRadius: 8, padding: "6px 12px", border: "1px solid #1D4ED866", zIndex: 1000, display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3B82F6", boxShadow: "0 0 5px #3B82F6" }} />
          <span style={{ fontSize: 11, color: "#93C5FD", fontWeight: 600 }}>AI 예측 모델: LSTM</span>
          <span style={{ fontSize: 10, color: "#475569" }}>| 교통카드 빅데이터 기반</span>
        </div>
      </div>

      {/* 우측 상세 패널 */}
      <div style={{ width: 290, borderLeft: "1px solid #1E293B", display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto" }}>
        {selected ? (
          <div style={{ padding: 16 }}>
            {(() => {
              const rc = getRisk(selected.risk);
              return (
                <>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div>
                        <div style={{ fontSize: 10, color: "#64748B", marginBottom: 3 }}>{selected.name.split(" ").slice(0, 2).join(" ")}</div>
                        <div style={{ fontSize: 17, fontWeight: 800, color: "#F1F5F9" }}>{selected.name.split(" ").slice(2).join(" ")}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 30, fontWeight: 900, color: rc.color, lineHeight: 1 }}>{selected.risk}%</div>
                        <div style={{ fontSize: 10, color: rc.color, opacity: 0.8, marginTop: 2 }}>12개월 내 위험도</div>
                      </div>
                    </div>
                    <div style={{ height: 5, background: "#334155", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${selected.risk}%`, height: "100%", background: rc.color, borderRadius: 3 }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                      <span style={{ fontSize: 10, color: "#475569" }}>안전</span>
                      <span style={{ fontSize: 10, color: rc.color, fontWeight: 600 }}>{rc.label} 단계</span>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginBottom: 12 }}>
                    {[{ label: "인구", value: selected.population.toLocaleString() + "명", c: "#E2E8F0" }, { label: "버스 노선", value: selected.routes + "개", c: "#E2E8F0" }, { label: "월 이용객", value: selected.passengers + "명", c: "#E2E8F0" }, { label: "이용객 감소", value: selected.trend + "%", c: "#F87171" }].map(m => (
                      <div key={m.label} style={{ background: "#1E293B", borderRadius: 8, padding: "10px 12px", border: "1px solid #334155" }}>
                        <div style={{ fontSize: 10, color: "#64748B", marginBottom: 3 }}>{m.label}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: m.c }}>{m.value}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: "#1E293B", borderRadius: 10, border: "1px solid #334155", marginBottom: 10, overflow: "hidden" }}>
                    <div style={{ padding: "10px 13px", borderBottom: "1px solid #334155", fontSize: 11, fontWeight: 600, color: "#94A3B8" }}>주민 이동 목적</div>
                    <div style={{ padding: 13 }}>
                      {selected.purpose.map(([label, pct], i) => {
                        const colors = ["#3B82F6", "#10B981", "#94A3B8"];
                        return (
                          <div key={label} style={{ marginBottom: i < 2 ? 8 : 0 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                              <span style={{ fontSize: 12, color: "#CBD5E1" }}>{label}</span>
                              <span style={{ fontSize: 12, fontWeight: 700, color: colors[i] }}>{pct}%</span>
                            </div>
                            <div style={{ height: 5, background: "#334155", borderRadius: 3, overflow: "hidden" }}>
                              <div style={{ width: `${pct}%`, height: "100%", background: colors[i], borderRadius: 3 }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div style={{ background: "#1E293B", borderRadius: 10, border: "1px solid #334155", marginBottom: 12, overflow: "hidden" }}>
                    <div style={{ padding: "10px 13px", borderBottom: "1px solid #334155", fontSize: 11, fontWeight: 600, color: "#94A3B8" }}>DRT 도입 수요</div>
                    <div style={{ padding: 13 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginBottom: 6 }}>
                        <span style={{ fontSize: 32, fontWeight: 900, color: "#60A5FA", lineHeight: 1 }}>{selected.drtDemand}</span>
                        <span style={{ fontSize: 13, color: "#64748B" }}>명 등록</span>
                      </div>
                      <div style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.7, marginBottom: 8 }}>
                        주민 {selected.drtDemand}명이 DRT 도입을 요청했습니다. 월 이용객의 <span style={{ color: "#60A5FA", fontWeight: 600 }}>{Math.round(selected.drtDemand / selected.passengers * 100)}%</span>에 해당합니다.
                      </div>
                      <div style={{ height: 5, background: "#334155", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${Math.min(selected.drtDemand / selected.passengers * 100, 100)}%`, height: "100%", background: "#3B82F6", borderRadius: 3 }} />
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    <button onClick={() => onSendToSimulator(selected)} style={{ width: "100%", padding: 10, borderRadius: 9, background: "#1D4ED8", border: "none", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>🚌 DRT 시뮬레이터로 보내기</button>
                    <button onClick={() => { leafletRef.current?.map.flyTo([selected.lat, selected.lng], 12, { duration: 0.8 }); }} style={{ width: "100%", padding: 10, borderRadius: 9, background: "#1E293B", border: "1px solid #334155", color: "#CBD5E1", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>🗺️ 지도에서 확대 보기</button>
                  </div>
                </>
              );
            })()}
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>📍</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#475569", marginBottom: 6 }}>지역을 선택해주세요</div>
            <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.7, marginBottom: 20 }}>지도 마커 또는 왼쪽 목록에서 지역을 클릭하면 상세 정보를 확인할 수 있습니다</div>
            <div style={{ background: "#1E293B", borderRadius: 10, border: "1px solid #334155", width: "100%", padding: 13 }}>
              <div style={{ fontSize: 10, color: "#475569", fontWeight: 600, marginBottom: 10 }}>전국 현황 요약</div>
              {[{ label: "모니터링 지역", value: REGIONS.length + "개 읍면동", color: "#E2E8F0" }, { label: "총 DRT 수요", value: REGIONS.reduce((s, r) => s + r.drtDemand, 0) + "명", color: "#60A5FA" }, { label: "즉시 대응 필요", value: REGIONS.filter(r => r.risk >= 75).length + "개 지역", color: "#EF4444" }, { label: "평균 이용객 감소", value: Math.round(REGIONS.reduce((s, r) => s + r.trend, 0) / REGIONS.length) + "%", color: "#F97316" }].map(s => (
                <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: "1px solid #334155" }}>
                  <span style={{ fontSize: 12, color: "#64748B" }}>{s.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
