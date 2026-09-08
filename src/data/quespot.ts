export type ScreenKey =
  | "landing"
  | "login"
  | "signup"
  | "terms"
  | "home"
  | "photo"
  | "record";

export const figmaAssets = {
  mascot: "https://www.figma.com/api/mcp/asset/07ecc734-e0cf-4c20-bbcf-eece4e51e9a4",
  heroMascot: "https://www.figma.com/api/mcp/asset/21ad27f9-a249-4b25-ba66-e341aace6a45",
  goodPhoto: "https://www.figma.com/api/mcp/asset/d925bfb1-a3da-4cb2-a5fe-d20f74f4fa8d",
  badPhoto: "https://www.figma.com/api/mcp/asset/afc72025-62d3-4190-9aa5-5287b515074f",
  backIcon: "https://www.figma.com/api/mcp/asset/38be7f3e-715e-452c-a29a-268a35c4640e",
  photoBackIcon: "https://www.figma.com/api/mcp/asset/ab8fb7a9-7d80-42b7-9b18-2b6f11b00655",
  hintIcon: "https://www.figma.com/api/mcp/asset/c836e42e-ad0a-4c96-b72c-f802f0c18b8a",
  checkIcon: "https://www.figma.com/api/mcp/asset/1c30f067-249f-46a9-8e3f-d8e1163a2803",
  closeIcon: "https://www.figma.com/api/mcp/asset/fffdd0ae-2465-4ca3-9ba9-dc5867732f04",
  cameraIcon: "https://www.figma.com/api/mcp/asset/f6864cf3-399f-40d8-9242-7954026927a5",
};

export const courseCards = [
  "전주 한옥마을 미션 탐방",
  "강릉 바다와 커피 향기",
  "제주 오름 탐험 코스",
  "부산 바다 산책 코스",
];

export type HomeCategory = {
  id: string;
  label: string;
  tone: "violet" | "green" | "amber" | "brown" | "blue" | "pink" | "cyan" | "rose" | "purple";
};

export const homeCategories: HomeCategory[] = [
  { id: "history", label: "역사·문화", tone: "violet" },
  { id: "culture", label: "문화시설·전시·체험", tone: "pink" },
  { id: "nature", label: "자연·힐링", tone: "green" },
  { id: "food", label: "음식", tone: "amber" },
  { id: "night", label: "야경·전망", tone: "blue" },
  { id: "etc", label: "기타", tone: "cyan" },
];

export type MissionCard = {
  id: string;
  title: string;
  category: string;
  distance: string;
  points: number;
  tone: "cream" | "lavender" | "mint" | "peach" | "blue";
  visual: string;
  place: string;
  address: string;
  duration: string;
  difficulty: "쉬움" | "보통" | "도전";
  description: string;
  guide: string;
  steps: string[];
};

export const recommendedMissions: MissionCard[] = [
  {
    id: "tea-house",
    title: "인사동 전통찻집 방문",
    category: "음식",
    distance: "2.5km",
    points: 120,
    tone: "cream",
    visual: "☕",
    place: "인사동 전통찻집",
    address: "서울 종로구 인사동길 37",
    duration: "약 25분",
    difficulty: "쉬움",
    description: "전통찻집에 방문해 공간의 분위기와 차 문화를 직접 경험하고 인증 사진과 짧은 감상 기록을 남기는 미션이에요.",
    guide: "간판 또는 전통찻집 내부가 보이도록 사진을 촬영하면 인증 성공률이 높아요.",
    steps: ["장소 근처 도착", "전통찻집 간판 또는 내부 촬영", "한 단어 감상 기록 작성"],
  },
  {
    id: "namsan-night",
    title: "남산타워 야경 포착",
    category: "야경",
    distance: "4.8km",
    points: 300,
    tone: "lavender",
    visual: "🗼",
    place: "남산서울타워",
    address: "서울 용산구 남산공원길 105",
    duration: "약 40분",
    difficulty: "보통",
    description: "해가 진 뒤 남산타워 주변에서 서울 야경을 포착하고 나만의 야경 포인트를 기록하는 미션이에요.",
    guide: "타워 실루엣과 도시 불빛이 함께 보이도록 촬영해보세요.",
    steps: ["야경 촬영 위치 찾기", "타워 또는 전망 인증 사진 촬영", "가장 인상 깊은 색감 기록"],
  },
  {
    id: "hanok-photo",
    title: "북촌 한옥 골목 사진 인증",
    category: "포토",
    distance: "2.1km",
    points: 180,
    tone: "mint",
    visual: "🏘️",
    place: "북촌 한옥마을",
    address: "서울 종로구 계동길 37",
    duration: "약 30분",
    difficulty: "쉬움",
    description: "북촌 한옥 골목을 천천히 걸으며 한옥의 지붕선과 골목 풍경을 사진으로 남기는 포토 미션이에요.",
    guide: "주민 생활 공간을 배려해 조용히 이동하고, 안내 표지판을 지켜주세요.",
    steps: ["북촌 골목 진입", "한옥 풍경 촬영", "마음에 든 골목 이름 기록"],
  },
  {
    id: "stream-walk",
    title: "청계천 물길 따라 걷기",
    category: "힐링",
    distance: "3.0km",
    points: 150,
    tone: "blue",
    visual: "🌊",
    place: "청계천",
    address: "서울 종로구 청계천로",
    duration: "약 35분",
    difficulty: "쉬움",
    description: "청계천 물길을 따라 걸으며 도심 속 휴식 포인트를 발견하는 산책형 미션이에요.",
    guide: "다리, 물길, 산책로가 함께 보이는 사진을 남겨보세요.",
    steps: ["청계천 산책 시작", "좋아하는 휴식 포인트 촬영", "산책 감상 한 줄 기록"],
  },
  {
    id: "market-snack",
    title: "광장시장 대표 간식 찾기",
    category: "음식",
    distance: "3.4km",
    points: 220,
    tone: "peach",
    visual: "🥟",
    place: "광장시장",
    address: "서울 종로구 창경궁로 88",
    duration: "약 45분",
    difficulty: "보통",
    description: "광장시장에서 대표 먹거리를 찾아보고 시장의 활기찬 분위기를 인증하는 음식 탐방 미션이에요.",
    guide: "음식 사진만 찍기보다 시장 분위기가 함께 담기면 더 좋아요.",
    steps: ["대표 간식 찾기", "시장 분위기 사진 촬영", "맛을 한 단어로 기록"],
  },
  {
    id: "museum-stamp",
    title: "소규모 전시관 스탬프 수집",
    category: "예술",
    distance: "5.1km",
    points: 260,
    tone: "lavender",
    visual: "🎨",
    place: "소규모 전시관",
    address: "서울 종로구 삼청로 일대",
    duration: "약 50분",
    difficulty: "도전",
    description: "동네 전시 공간을 방문하고 스탬프처럼 기록을 모으는 예술 체험 미션이에요.",
    guide: "작품 촬영 가능 여부를 먼저 확인하고, 전시관 외관이나 티켓을 인증해도 좋아요.",
    steps: ["전시 공간 찾기", "방문 인증 사진 촬영", "가장 기억나는 작품 기록"],
  },
];

export const getMissionById = (id: string) =>
  recommendedMissions.find((mission) => mission.id === id) ?? recommendedMissions[0];

export type NearbySpot = {
  id: string;
  name: string;
  distance: string;
  status: "완료" | "미션";
  missionCount?: number;
  rating: number;
  badge?: number;
  done?: boolean;
  missionId?: string;
};

export const nearbySpots: NearbySpot[] = [
  { id: "gyeongbokgung", name: "경복궁", distance: "1.2km", status: "완료", rating: 4.8, done: true },
  { id: "bukchon", name: "북촌 한옥", distance: "2.1km", status: "완료", rating: 4.6, done: true },
  { id: "insadong", name: "인사동", distance: "2.5km", status: "미션", missionCount: 5, rating: 4.5, badge: 5, missionId: "tea-house" },
  { id: "cheonggye", name: "청계천", distance: "3.0km", status: "미션", missionCount: 2, rating: 4.4, badge: 2, missionId: "stream-walk" },
  { id: "gwangjang", name: "광장시장", distance: "3.4km", status: "미션", missionCount: 4, rating: 4.3, badge: 4, missionId: "market-snack" },
  { id: "namsan", name: "남산공원", distance: "4.8km", status: "미션", missionCount: 3, rating: 4.7, badge: 3, missionId: "namsan-night" },
];

export const previewScreens: Array<{ key: ScreenKey; label: string }> = [
  { key: "landing", label: "웹 랜딩" },
  { key: "login", label: "로그인" },
  { key: "signup", label: "회원가입" },
  { key: "terms", label: "약관동의" },
  { key: "home", label: "홈" },
  { key: "photo", label: "사진 인증" },
  { key: "record", label: "감상 기록" },
];
