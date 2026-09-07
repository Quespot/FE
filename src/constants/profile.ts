import type { HomeCategory } from "@/data/quespot";

export const profileTravelCategories: HomeCategory[] = [
  { id: "history", label: "역사·문화", tone: "violet" },
  { id: "nature", label: "자연·힐링", tone: "green" },
  { id: "food", label: "음식", tone: "amber" },
  { id: "cafe", label: "카페", tone: "brown" },
  { id: "night", label: "야경·뷰", tone: "blue" },
  { id: "activity", label: "액티비티", tone: "cyan" },
  { id: "shopping", label: "쇼핑", tone: "rose" },
  { id: "art", label: "예술·체험", tone: "purple" },
];

export const travelStyleByCategoryId = {
  history: "HISTORY_CULTURE",
  nature: "NATURE_HEALING",
  food: "FOOD",
  cafe: "CAFE",
  night: "NIGHT_VIEW",
  activity: "ACTIVITY",
  shopping: "SHOPPING",
  art: "ART_EXPERIENCE",
} as const;

export type TravelStyle = (typeof travelStyleByCategoryId)[keyof typeof travelStyleByCategoryId];

export const categoryIdsToTravelStyles = (ids: string[]) =>
  ids.flatMap((id) => id in travelStyleByCategoryId ? [travelStyleByCategoryId[id as keyof typeof travelStyleByCategoryId]] : []);

export const travelStylesToCategoryIds = (styles: TravelStyle[]) =>
  styles.flatMap((style) => {
    const entry = Object.entries(travelStyleByCategoryId).find(([, value]) => value === style);
    return entry ? [entry[0]] : [];
  });

export const genderToApi = { 여성: "FEMALE", 남성: "MALE" } as const;
export const genderFromApi: Record<string, string> = { FEMALE: "여성", MALE: "남성" };

export const companionToApi = {
  혼자: "SOLO",
  친구와: "FRIENDS",
  연인과: "PARTNER",
  가족과: "FAMILY",
  반려동물과: "PET",
} as const;
export const companionFromApi: Record<string, string> = Object.fromEntries(Object.entries(companionToApi).map(([key, value]) => [value, key]));

export const regionToApi = {
  서울특별시: "SEOUL",
  전남광주통합특별시: "JEONNAM_GWANGJU",
  부산광역시: "BUSAN",
  대구광역시: "DAEGU",
  인천광역시: "INCHEON",
  대전광역시: "DAEJEON",
  울산광역시: "ULSAN",
  세종특별자치시: "SEJONG",
  경기도: "GYEONGGI",
  충청북도: "CHUNGBUK",
  충청남도: "CHUNGNAM",
  경상북도: "GYEONGBUK",
  경상남도: "GYEONGNAM",
  강원특별자치도: "GANGWON",
  전북특별자치도: "JEONBUK",
  제주특별자치도: "JEJU",
} as const;
export const regionFromApi: Record<string, string> = Object.fromEntries(Object.entries(regionToApi).map(([key, value]) => [value, key]));
