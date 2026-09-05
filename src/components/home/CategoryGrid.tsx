import {
  Building2,
  Camera,
  Compass,
  Leaf,
  Palette,
  ShoppingBag,
  Sunrise,
  Utensils,
  Waves,
  type LucideIcon,
} from "lucide-react";
import SectionHeader from "@/components/common/SectionHeader";

export const categoryToneClasses: Record<string, string> = {
  violet: "bg-[#eee1ff] text-[#8b5cf6]",
  green: "bg-[#e1faef] text-green-600",
  amber: "bg-[#fff1c9] text-amber-600",
  blue: "bg-[#dcecff] text-[#2577ff]",
  pink: "bg-[#ffe1f0] text-pink-500",
  cyan: "bg-[#cff9fb] text-cyan-600",
  rose: "bg-[#ffdede] text-red-500",
  purple: "bg-[#f0e3ff] text-purple-600",
};

export const categoryIcons: Record<string, LucideIcon> = {
  history: Building2,
  nature: Leaf,
  food: Utensils,
  night: Sunrise,
  photo: Camera,
  activity: Waves,
  shopping: ShoppingBag,
  art: Palette,
};

type Category = {
  id: string;
  label: string;
  tone: string;
};

type CategoryGridProps = {
  categories: Category[];
};

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="grid gap-[14px]">
      <SectionHeader title="카테고리" />

      <div className="grid grid-cols-4 gap-2.5 max-[380px]:gap-2">
        {categories.map((category) => {
          const Icon = categoryIcons[category.id] ?? Compass;
          const toneClass =
            categoryToneClasses[category.tone] ?? categoryToneClasses.blue;

          return (
            <button
              className="grid min-h-24 justify-items-center gap-2.5 rounded-[15px] border border-[#dce8f5] bg-white px-1.5 pb-3 pt-3.5 text-[#1c1c3a] shadow-[0_2px_6px_rgba(8,37,95,0.11)] transition active:scale-[0.98]"
              key={category.id}
              type="button"
            >
              <span
                className={`grid h-[50px] w-[50px] place-items-center rounded-[17px] ${toneClass}`}
              >
                <Icon size={26} strokeWidth={2.3} />
              </span>

              <strong className="text-center text-[11px] leading-tight text-[#59677a] max-[380px]:text-[10px]">
                {category.label}
              </strong>
            </button>
          );
        })}
      </div>
    </section>
  );
}
