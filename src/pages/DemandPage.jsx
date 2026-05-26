import { useState } from "react";
import { REGIONS, getRisk } from "../data";

const PURPOSES = ["병원·의원", "장보기·마트", "관공서·은행", "학교·학원", "직장 출퇴근", "기타"];
const FREQ = ["매일", "주 3~4회", "주 1~2회", "월 1~2회"];
const ACCESS = ["스마트폰 앱", "카카오톡", "전화 접수", "이장님 통해"];

export default function DemandPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ region: "", purpose: "", destination: "", frequency: "", access: "", phone: "", age: "", comment: "" });
  const [submitted, setSubmitted] = useState(false);
  const [recentList, setRecentList] = useState([
    { name: "강원 정선군 신동읍", purpose: "병원·의원", time: "10분 전", age: "70대" },
    { name: "전남 고흥군 두원면", purpose: "장보기·마트", time: "23분 전", age: "60대" },
    { name: "경북 의성군 단촌면", purpose: "병원·의원", time: "41분 전", age: "80대" },
    { name: "전북 임실군 청웅면", purpose: "관공서·은행", time: "1시간 전", age: "50대" },
  ]);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.region || !form.purpose) return;
    setRecentList(prev => [{ name: form.region, purpose: form.purpose, time: "방금 전", age: form.age || "미입력" }, ...prev]);
    setSubmitted(true);
  };

  const Card = ({ children, style }) => (
    <div style={{ background: "#1E293B", borderRadius: 12, border: "1px solid #334155", padding: 20, ...style }}>{children}</div>
  );

  const Label = ({ children }) => (
    <div style={{ fontSize: 13, fontWeight: 600, color: "#94A3B8", marginBottom: 8 }}>{children}</div>
  );

  const ChipGroup = ({ options, value, onChange }) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map(o => (
        <button key={o} onClick={() => onChange(o)} style={{ padding: "7px 14px", borderRadius: 20, border: `1.5px solid ${value === o ? "#3B82F6" : "#334155"}`, background: value === o ? "#172554" : "transparent", color: value === o ? "#60A5FA" : "#64748B", fontSize: 13, fontWeight: value === o ? 600 : 400, cursor: "pointer", transition: "all .15s" }}>{o}</button>
      ))}
    </div>
  );

  if (submitted) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", padding: 40 }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ fontSize: 60, marginBottom: 20 }}>✅</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#F1F5F9", marginBottom: 10 }}>수요 등록 완료!</div>
          <div style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.7, marginBottom: 24 }}>
            <strong style={{ color: "#60A5FA" }}>{form.region}</strong> 지역의 DRT 도입 수요가 등록되었습니다.<br />
            지자체 담당자에게 자동으로 전달됩니다.
          </div>
          <div style={{ background: "#1E293B", borderRadius: 12, border: "1px solid #334155", padding: 16, marginBottom: 24, textAlign: "left" }}>
            {[{ label: "지역", value: form.region }, { label: "이동 목적", value: form.purpose }, { label: "이용 빈도", value: form.frequency }, { label: "선호 접수 방법", value: form.access }].map(i => i.value && (
              <div key={i.label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #334155" }}>
                <span style={{ fontSize: 12, color: "#64748B" }}>{i.label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#E2E8F0" }}>{i.value}</span>
              </div>
            ))}
          </div>
          <button onClick={() => { setSubmitted(false); setStep(1); setForm({ region: "", purpose: "", destination: "", frequency: "", access: "", phone: "", age: "", comment: "" }); }} style={{ padding: "12px 32px", borderRadius: 10, background: "#1D4ED8", border: "none", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>추가 등록하기</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* 좌측 안내 + 최근 등록 */}
      <div style={{ width: 300, borderRight: "1px solid #1E293B", display: "flex", flexDirection: "column", padding: 20, gap: 16, overflowY: "auto", flexShrink: 0 }}>
        <div style={{ background: "linear-gradient(135deg, #172554, #1E3A5F)", borderRadius: 12, padding: 18, border: "1px solid #1D4ED844" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#F1F5F9", marginBottom: 8 }}>📝 수요 등록이란?</div>
          <div style={{ fontSize: 12, color: "#93C5FD", lineHeight: 1.8 }}>
            우리 동네 버스가 없거나 줄어들고 있다면, 지금 바로 DRT 도입 수요를 등록해주세요.<br /><br />
            주민 여러분의 등록 데이터가 지자체의 DRT 도입 결정 근거가 됩니다.
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "#475569", fontWeight: 600, letterSpacing: "0.5px", marginBottom: 10 }}>실시간 등록 현황</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
            {[{ label: "오늘 등록", value: "47명", color: "#60A5FA" }, { label: "이번 달", value: "1,284명", color: "#34D399" }].map(s => (
              <div key={s.label} style={{ background: "#1E293B", borderRadius: 8, padding: "10px 12px", border: "1px solid #334155" }}>
                <div style={{ fontSize: 10, color: "#64748B", marginBottom: 3 }}>{s.label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: "#475569", fontWeight: 600, letterSpacing: "0.5px", marginBottom: 8 }}>최근 등록</div>
          {recentList.slice(0, 5).map((item, i) => (
            <div key={i} style={{ padding: "9px 12px", background: "#1E293B", borderRadius: 8, border: "1px solid #334155", marginBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#E2E8F0" }}>{item.name.split(" ").slice(-1)[0]}</span>
                <span style={{ fontSize: 10, color: "#475569" }}>{item.time}</span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <span style={{ fontSize: 11, color: "#94A3B8" }}>{item.purpose}</span>
                <span style={{ fontSize: 11, color: "#475569" }}>·</span>
                <span style={{ fontSize: 11, color: "#475569" }}>{item.age}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 중앙 폼 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
        {/* 스텝 표시 */}
        <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 28 }}>
          {[1, 2, 3].map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: step >= s ? "#1D4ED8" : "#1E293B", border: `2px solid ${step >= s ? "#3B82F6" : "#334155"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: step >= s ? "white" : "#475569" }}>{s}</div>
              {i < 2 && <div style={{ width: 60, height: 2, background: step > s ? "#3B82F6" : "#334155" }} />}
            </div>
          ))}
          <div style={{ marginLeft: 12, fontSize: 13, color: "#64748B" }}>{["지역 및 목적", "이용 정보", "연락처 (선택)"][step - 1]}</div>
        </div>

        {step === 1 && (
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#F1F5F9", marginBottom: 4 }}>어느 지역 버스가 불편하신가요?</div>
            <div style={{ fontSize: 13, color: "#64748B", marginBottom: 24 }}>불편을 겪고 있는 지역과 주요 이동 목적을 선택해주세요</div>
            <Card style={{ marginBottom: 16 }}>
              <Label>지역 선택 *</Label>
              <select value={form.region} onChange={e => update("region", e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, background: "#0F172A", border: "1px solid #334155", color: form.region ? "#F1F5F9" : "#64748B", fontSize: 14 }}>
                <option value="">지역을 선택해주세요</option>
                {REGIONS.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
              </select>
              {form.region && (
                <div style={{ marginTop: 12, padding: "10px 12px", background: "#172554", borderRadius: 8, border: "1px solid #1D4ED844" }}>
                  {(() => {
                    const r = REGIONS.find(x => x.name === form.region);
                    if (!r) return null;
                    const rc = getRisk(r.risk);
                    return <div style={{ fontSize: 12, color: "#93C5FD" }}>이 지역 현재 AI 예측 위험도: <strong style={{ color: rc.color }}>{r.risk}% ({rc.label})</strong> | DRT 수요 등록: <strong style={{ color: "#60A5FA" }}>{r.drtDemand}명</strong></div>;
                  })()}
                </div>
              )}
            </Card>
            <Card style={{ marginBottom: 16 }}>
              <Label>주요 이동 목적 *</Label>
              <ChipGroup options={PURPOSES} value={form.purpose} onChange={v => update("purpose", v)} />
            </Card>
            <Card style={{ marginBottom: 24 }}>
              <Label>주요 목적지 (선택)</Label>
              <input value={form.destination} onChange={e => update("destination", e.target.value)} placeholder="예: 의성군 보건의료원, 의성 홈플러스" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, background: "#0F172A", border: "1px solid #334155", color: "#F1F5F9", fontSize: 14 }} />
            </Card>
            <button onClick={() => form.region && form.purpose && setStep(2)} style={{ padding: "12px 32px", borderRadius: 10, background: form.region && form.purpose ? "#1D4ED8" : "#1E293B", border: "none", color: form.region && form.purpose ? "white" : "#475569", fontSize: 14, fontWeight: 600, cursor: form.region && form.purpose ? "pointer" : "default" }}>다음 단계 →</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#F1F5F9", marginBottom: 4 }}>얼마나 자주 이동이 필요하신가요?</div>
            <div style={{ fontSize: 13, color: "#64748B", marginBottom: 24 }}>이용 빈도와 선호하는 접수 방법을 알려주세요</div>
            <Card style={{ marginBottom: 16 }}>
              <Label>이용 빈도 *</Label>
              <ChipGroup options={FREQ} value={form.frequency} onChange={v => update("frequency", v)} />
            </Card>
            <Card style={{ marginBottom: 16 }}>
              <Label>선호하는 DRT 접수 방법</Label>
              <ChipGroup options={ACCESS} value={form.access} onChange={v => update("access", v)} />
            </Card>
            <Card style={{ marginBottom: 16 }}>
              <Label>연령대 (선택)</Label>
              <ChipGroup options={["10대", "20대", "30대", "40대", "50대", "60대", "70대", "80대 이상"]} value={form.age} onChange={v => update("age", v)} />
            </Card>
            <Card style={{ marginBottom: 24 }}>
              <Label>추가 의견 (선택)</Label>
              <textarea value={form.comment} onChange={e => update("comment", e.target.value)} placeholder="버스 이용에 불편했던 점이나 DRT에 바라는 점을 자유롭게 적어주세요" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, background: "#0F172A", border: "1px solid #334155", color: "#F1F5F9", fontSize: 13, resize: "vertical", minHeight: 80 }} />
            </Card>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep(1)} style={{ padding: "12px 24px", borderRadius: 10, background: "#1E293B", border: "1px solid #334155", color: "#94A3B8", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>← 이전</button>
              <button onClick={() => setStep(3)} style={{ padding: "12px 32px", borderRadius: 10, background: "#1D4ED8", border: "none", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>다음 단계 →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#F1F5F9", marginBottom: 4 }}>등록 내용 확인 및 제출</div>
            <div style={{ fontSize: 13, color: "#64748B", marginBottom: 24 }}>아래 내용을 확인하고 제출해주세요. 연락처는 선택 사항입니다.</div>
            <Card style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8", marginBottom: 12 }}>등록 내용 요약</div>
              {[{ label: "지역", value: form.region }, { label: "이동 목적", value: form.purpose }, { label: "주요 목적지", value: form.destination || "미입력" }, { label: "이용 빈도", value: form.frequency || "미입력" }, { label: "선호 접수", value: form.access || "미입력" }, { label: "연령대", value: form.age || "미입력" }].map(i => (
                <div key={i.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #334155" }}>
                  <span style={{ fontSize: 12, color: "#64748B" }}>{i.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#E2E8F0" }}>{i.value}</span>
                </div>
              ))}
            </Card>
            <Card style={{ marginBottom: 16 }}>
              <Label>연락처 (선택 — 진행 상황 안내 시 활용)</Label>
              <input value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="010-0000-0000" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, background: "#0F172A", border: "1px solid #334155", color: "#F1F5F9", fontSize: 14 }} />
              <div style={{ fontSize: 11, color: "#475569", marginTop: 6 }}>※ 개인정보는 DRT 도입 현황 안내 목적으로만 활용되며 제3자에게 제공되지 않습니다.</div>
            </Card>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep(2)} style={{ padding: "12px 24px", borderRadius: 10, background: "#1E293B", border: "1px solid #334155", color: "#94A3B8", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>← 이전</button>
              <button onClick={handleSubmit} style={{ flex: 1, padding: "12px", borderRadius: 10, background: "#1D4ED8", border: "none", color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>✅ 수요 등록 제출</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
