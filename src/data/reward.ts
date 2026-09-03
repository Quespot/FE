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
};

export type StampRegion = {
  id: string;
  name: string;
  emoji: string;
  acquired: boolean;
};

export type StampItem = {
  id: number;
  regionId: string;
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
  },
  {
    id: 6,
    name: "퀘스트 왕",
    emoji: "👑",
    acquired: false,
  },
];

export const rewardStampRegions: StampRegion[] = [
  {
    id: "seoul",
    name: "서울",
    emoji: "✉️",
    acquired: true,
  },
  {
    id: "busan",
    name: "부산",
    emoji: "✉️",
    acquired: true,
  },
  {
    id: "jeju",
    name: "제주",
    emoji: "?",
    acquired: false,
  },
  {
    id: "gyeongju",
    name: "경주",
    emoji: "?",
    acquired: false,
  },
  {
    id: "yeosu",
    name: "여수",
    emoji: "?",
    acquired: false,
  },
  {
    id: "gangneung",
    name: "강릉",
    emoji: "?",
    acquired: false,
  },
  {
    id: "jeonju",
    name: "전주",
    emoji: "?",
    acquired: false,
  },
  {
    id: "incheon",
    name: "인천",
    emoji: "?",
    acquired: false,
  },
];

export const rewardStamps: StampItem[] = [
  {
    id: 1,
    regionId: "seoul",
    name: "경복궁",
    region: "서울 종로구",
    emoji: "🏯",
    acquired: true,
  },
  {
    id: 2,
    regionId: "seoul",
    name: "북촌",
    region: "서울 종로구",
    emoji: "🏡",
    acquired: true,
  },
  {
    id: 3,
    regionId: "seoul",
    name: "인사동",
    region: "서울 종로구",
    emoji: "☕",
    acquired: false,
  },
  {
    id: 4,
    regionId: "seoul",
    name: "명동",
    region: "서울 중구",
    emoji: "🛍️",
    acquired: false,
  },
  {
    id: 5,
    regionId: "seoul",
    name: "성수동",
    region: "서울 성동구",
    emoji: "🎨",
    acquired: false,
  },
  {
    id: 6,
    regionId: "busan",
    name: "해운대",
    region: "부산 해운대구",
    emoji: "🌊",
    acquired: true,
  },
  {
    id: 7,
    regionId: "busan",
    name: "감천문화마을",
    region: "부산 사하구",
    emoji: "🏘️",
    acquired: false,
  },
  {
    id: 8,
    regionId: "busan",
    name: "광안리",
    region: "부산 수영구",
    emoji: "🌉",
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
export type CouponTab = "available" | "used";

export type CouponItem = {
  id: number;
  title: string;
  benefit: string;
  expireDate: string;
  emoji: string;
  status: CouponTab;
  usable: boolean;
};

export const rewardCoupons: CouponItem[] = [
  {
    id: 1,
    title: "전통 찻집 다향",
    benefit: "아메리카노 1+1",
    expireDate: "07.31 만료",
    emoji: "☕",
    status: "available",
    usable: true,
  },
  {
    id: 2,
    title: "인사동 한정식",
    benefit: "10% 할인",
    expireDate: "07.25 만료",
    emoji: "🍜",
    status: "available",
    usable: true,
  },
  {
    id: 3,
    title: "인사동 기념품샵",
    benefit: "5,000원 할인",
    expireDate: "08.10 만료",
    emoji: "🛍️",
    status: "available",
    usable: false,
  },
  {
    id: 4,
    title: "인사아트센터",
    benefit: "입장료 무료",
    expireDate: "07.20 만료",
    emoji: "🏛️",
    status: "used",
    usable: false,
  },
];