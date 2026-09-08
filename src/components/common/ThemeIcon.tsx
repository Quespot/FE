import { Compass, Route, type LucideIcon } from "lucide-react";
import { categoryIcons, categoryToneClasses } from "@/components/home/CategoryGrid";

export type ThemeKey =
  | "history"
  | "culture"
  | "food"
  | "cafe"
  | "nature"
  | "night"
  | "photo"
  | "activity"
  | "shopping"
  | "art"
  | "etc"
  | "course";

type ThemeConfig = {
  icon: LucideIcon;
  label: string;
  tone: string;
};

const fallbackTheme: ThemeConfig = {
  icon: Compass,
  label: "기타",
  tone: categoryToneClasses.blue,
};

// 최초 여행 스타일 설정에서 사용하는 아이콘과 색상을 그대로 공유한다.
export const themeConfig: Record<ThemeKey, ThemeConfig> = {
  history: { icon: categoryIcons.history, label: "역사", tone: categoryToneClasses.violet },
  culture: { icon: categoryIcons.culture, label: "문화", tone: categoryToneClasses.pink },
  food: { icon: categoryIcons.food, label: "음식", tone: categoryToneClasses.amber },
  cafe: { icon: categoryIcons.cafe, label: "카페", tone: categoryToneClasses.brown },
  nature: { icon: categoryIcons.nature, label: "자연", tone: categoryToneClasses.green },
  night: { icon: categoryIcons.night, label: "야경", tone: categoryToneClasses.blue },
  photo: { icon: categoryIcons.photo, label: "포토", tone: categoryToneClasses.pink },
  activity: { icon: categoryIcons.activity, label: "액티비티", tone: categoryToneClasses.cyan },
  shopping: { icon: categoryIcons.shopping, label: "쇼핑", tone: categoryToneClasses.rose },
  art: { icon: categoryIcons.art, label: "예술", tone: categoryToneClasses.purple },
  etc: { icon: categoryIcons.etc, label: "기타", tone: categoryToneClasses.cyan },
  course: { icon: Route, label: "코스", tone: categoryToneClasses.blue },
};

export function getThemeConfig(theme: string): ThemeConfig {
  return themeConfig[theme as ThemeKey] ?? fallbackTheme;
}

export default function ThemeIcon({ theme, size = 22, className = "" }: { theme: string; size?: number; className?: string }) {
  const { icon: Icon, tone } = getThemeConfig(theme);
  return <span className={`grid shrink-0 place-items-center ${tone} ${className}`} aria-hidden="true"><Icon size={size} strokeWidth={2.25} /></span>;
}
