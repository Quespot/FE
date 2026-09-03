export type RewardTab = "badges" | "stamps" | "history";

export type RewardTabItem = {
  id: RewardTab;
  label: string;
  emoji: string;
};

export type BadgeItem = {
  id: number;
  name: string;
  emoji: string;
  acquired: boolean;
  highlighted?: boolean;
};

export type StampItem = {
  id: number;
  name: string;
  region: string;
  emoji: string;
  acquired: boolean;
};

export type HistoryIconKey = "target" | "map" | "ticket" | "award";

export type HistoryItem = {
  id: number;
  title: string;
  description: string;
  point: number;
  type: "earn" | "use";
  date: string;
  iconKey: HistoryIconKey;
};

export const rewardTabs: RewardTabItem[] = [
  {
    id: "badges",
    label: "배지",
    emoji: "🏅",
  },
  {
    id: "stamps",
    label: "스탬프",
    emoji: "✉️",
  },
  {
    id: "history",
    label: "내역",
    emoji: "📋",
  },
];

export const rewardBadges: BadgeItem[] = [
  {
    id: 1,
    name: "첫 미션",
    emoji: "🎯",
    acquired: true,
  },
  {
    id: 2,
    name: "탐험가",
    emoji: "🗺️",
    acquired: true,
  },
  {
    id: 3,
    name: "사진작가",
    emoji: "📸",
    acquired: false,
  },
  {
    id: 4,
    name: "서울 마스터",
    emoji: "🏙️",
    acquired: false,
  },
  {
    id: 5,
    name: "부산 탐험",
    emoji: "🌊",
    acquired: false,
    highlighted: true,
  },
  {
    id: 6,
    name: "퀘스트 왕",
    emoji: "👑",
    acquired: false,
  },
];

export const rewardStamps: StampItem[] = [
  {
    id: 1,
    name: "경복궁",
    region: "서울 종로구",
    emoji: "🏯",
    acquired: true,
  },
  {
    id: 2,
    name: "북촌",
    region: "서울 종로구",
    emoji: "🏡",
    acquired: true,
  },
  {
    id: 3,
    name: "인사동",
    region: "서울 종로구",
    emoji: "☕",
    acquired: false,
  },
  {
    id: 4,
    name: "명동",
    region: "서울 중구",
    emoji: "🛍️",
    acquired: false,
  },
  {
    id: 5,
    name: "성수동",
    region: "서울 성동구",
    emoji: "🎨",
    acquired: false,
  },
  {
    id: 6,
    name: "이태원",
    region: "서울 용산구",
    emoji: "🌃",
    acquired: false,
  },
];

export const rewardHistoryItems: HistoryItem[] = [
  {
    id: 1,
    title: "경복궁 정문 인증샷",
    description: "미션 완료 보상",
    point: 150,
    type: "earn",
    date: "2026.09.03",
    iconKey: "target",
  },
  {
    id: 2,
    title: "북촌 한옥 골목 탐험",
    description: "미션 완료 보상",
    point: 200,
    type: "earn",
    date: "2026.09.02",
    iconKey: "map",
  },
  {
    id: 3,
    title: "로컬 제휴 쿠폰 사용",
    description: "인사동 전통찻집 할인",
    point: 200,
    type: "use",
    date: "2026.09.01",
    iconKey: "ticket",
  },
  {
    id: 4,
    title: "첫 미션 배지 획득",
    description: "첫 번째 미션 완료",
    point: 0,
    type: "earn",
    date: "2026.08.31",
    iconKey: "award",
  },
];