import { useState } from "react";
import MapPage from "./pages/MapPage";
import DemandPage from "./pages/DemandPage";
import DashboardPage from "./pages/DashboardPage";
import SimulatorPage from "./pages/SimulatorPage";
import "./App.css";

const NAV = [
  { id: "map", label: "교통 공백 지도", icon: "🗺️" },
  { id: "demand", label: "주민 수요 등록", icon: "📝" },
  { id: "dashboard", label: "지자체 대시보드", icon: "📊" },
  { id: "simulator", label: "DRT 시뮬레이터", icon: "🚌" },
];

export default function App() {
  const [page, setPage] = useState("map");
  const [sharedRegion, setSharedRegion] = useState(null);

  const handleSendToSimulator = (region) => {
    setSharedRegion(region);
    setPage("simulator");
  };

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="header-left">
          <div className="app-logo">🚌</div>
          <div>
            <div className="app-title">버스가 사라지기 전에</div>
            <div className="app-subtitle">지방 대중교통 공백 AI 조기경보 플랫폼</div>
          </div>
        </div>
        <nav className="app-nav">
          {NAV.map((n) => (
            <button
              key={n.id}
              className={"nav-btn" + (page === n.id ? " active" : "")}
              onClick={() => setPage(n.id)}
            >
              <span className="nav-icon">{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>
        <div className="header-right">
          <div className="live-dot" />
          <span className="live-text">실시간 업데이트</span>
          <span className="sample-badge">샘플 데이터</span>
        </div>
      </header>
      <main className="app-main">
        {page === "map" && <MapPage onSendToSimulator={handleSendToSimulator} />}
        {page === "demand" && <DemandPage />}
        {page === "dashboard" && <DashboardPage onSendToSimulator={handleSendToSimulator} />}
        {page === "simulator" && <SimulatorPage initialRegion={sharedRegion} />}
      </main>
    </div>
  );
}
