export const REGIONS = [
  { id: 1, name: "강원 정선군 신동읍", lat: 37.21, lng: 128.65, risk: 92, population: 2840, routes: 1, trend: -38, passengers: 124, purpose: [["병원", 62], ["장보기", 28], ["기타", 10]], drtDemand: 87, complaints: 23 },
  { id: 2, name: "전남 고흥군 두원면", lat: 34.61, lng: 127.28, risk: 88, population: 1920, routes: 1, trend: -41, passengers: 89, purpose: [["병원", 71], ["장보기", 19], ["기타", 10]], drtDemand: 63, complaints: 18 },
  { id: 3, name: "경북 의성군 단촌면", lat: 36.48, lng: 128.69, risk: 85, population: 3120, routes: 2, trend: -29, passengers: 201, purpose: [["병원", 54], ["장보기", 35], ["기타", 11]], drtDemand: 112, complaints: 31 },
  { id: 4, name: "전북 임실군 청웅면", lat: 35.57, lng: 127.19, risk: 79, population: 1650, routes: 1, trend: -33, passengers: 76, purpose: [["병원", 68], ["장보기", 22], ["기타", 10]], drtDemand: 54, complaints: 14 },
  { id: 5, name: "충남 청양군 화성면", lat: 36.45, lng: 126.79, risk: 74, population: 2340, routes: 2, trend: -22, passengers: 183, purpose: [["병원", 49], ["장보기", 38], ["기타", 13]], drtDemand: 78, complaints: 19 },
  { id: 6, name: "강원 영월군 수주면", lat: 37.18, lng: 128.39, risk: 71, population: 1890, routes: 1, trend: -27, passengers: 145, purpose: [["병원", 57], ["장보기", 31], ["기타", 12]], drtDemand: 69, complaints: 16 },
  { id: 7, name: "경남 합천군 가야면", lat: 35.77, lng: 128.09, risk: 67, population: 2780, routes: 2, trend: -18, passengers: 234, purpose: [["병원", 44], ["장보기", 41], ["기타", 15]], drtDemand: 95, complaints: 22 },
  { id: 8, name: "전남 장흥군 유치면", lat: 34.78, lng: 127.09, risk: 61, population: 1430, routes: 1, trend: -24, passengers: 98, purpose: [["병원", 60], ["장보기", 29], ["기타", 11]], drtDemand: 47, complaints: 11 },
  { id: 9, name: "충북 괴산군 청천면", lat: 36.78, lng: 127.89, risk: 54, population: 3450, routes: 3, trend: -14, passengers: 312, purpose: [["병원", 41], ["장보기", 44], ["기타", 15]], drtDemand: 88, complaints: 17 },
  { id: 10, name: "경북 봉화군 소천면", lat: 36.99, lng: 128.89, risk: 48, population: 2100, routes: 2, trend: -11, passengers: 189, purpose: [["병원", 52], ["장보기", 33], ["기타", 15]], drtDemand: 61, complaints: 12 },
  { id: 11, name: "전남 신안군 압해읍", lat: 34.89, lng: 126.39, risk: 41, population: 4200, routes: 3, trend: -8, passengers: 421, purpose: [["병원", 38], ["장보기", 46], ["기타", 16]], drtDemand: 102, complaints: 9 },
  { id: 12, name: "강원 인제군 기린면", lat: 38.01, lng: 128.29, risk: 35, population: 2890, routes: 2, trend: -6, passengers: 267, purpose: [["병원", 45], ["장보기", 39], ["기타", 16]], drtDemand: 74, complaints: 8 },
];

export const getRisk = (r) => {
  if (r >= 75) return { color: "#EF4444", bg: "#450A0A", light: "#FEE2E2", label: "위험", border: "#EF444466" };
  if (r >= 50) return { color: "#F97316", bg: "#431407", light: "#FFEDD5", label: "주의", border: "#F9731666" };
  return { color: "#22C55E", bg: "#052E16", light: "#DCFCE7", label: "양호", border: "#22C55E66" };
};

export const MONTHS = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
