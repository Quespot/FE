import { Heart, Loader2, MapPin } from "lucide-react";
import { categoryToneClasses } from "@/components/home/CategoryGrid";

const missionToneClasses: Record<string, string> = {
  cream: "bg-[linear-gradient(145deg,#fff6cc_0%,#fffef6_100%)]",
  lavender: "bg-[linear-gradient(145deg,#f1e8ff_0%,#fffaff_100%)]",
  mint: "bg-[linear-gradient(145deg,#ddfaee_0%,#fafffd_100%)]",
  peach: "bg-[linear-gradient(145deg,#ffe6d7_0%,#fff9f5_100%)]",
  blue: "bg-[linear-gradient(145deg,#dff1ff_0%,#f7fcff_100%)]",
};

const missionCategoryToneClasses: Record<string, string> = {
  역사: categoryToneClasses.violet,
  문화: categoryToneClasses.pink,
  자연: categoryToneClasses.green,
  음식: categoryToneClasses.amber,
  야경: categoryToneClasses.blue,
  기타: categoryToneClasses.cyan,
};

export type RecommendedMissionCardItem = {
  id: string | number;
  title: string;
  category: string;
  distance: string;
  points: number;
  visual: string;
  tone: string;
  imageUrl?: string | null;
  liked?: boolean;
};

type MissionCardProps = {
  mission: RecommendedMissionCardItem;
  onClick: () => void;
  onLikeClick?: () => void;
  isLikePending?: boolean;
};

export default function MissionCard({
  mission,
  onClick,
  onLikeClick,
  isLikePending = false,
}: MissionCardProps) {
  const toneClass = missionToneClasses[mission.tone] ?? missionToneClasses.blue;
  const categoryToneClass =
    missionCategoryToneClasses[mission.category] ?? categoryToneClasses.blue;

  return (
    <article
      className="cursor-pointer overflow-hidden rounded-2xl border border-[#dce8f5] bg-white shadow-[0_2px_8px_rgba(8,37,95,0.09)] transition active:scale-[0.98]"
      onClick={onClick}
    >
      <div className={`relative grid min-h-[122px] place-items-center ${toneClass}`}>
        <button
          type="button"
          disabled={isLikePending || !onLikeClick}
          onClick={(event) => {
            event.stopPropagation();
            onLikeClick?.();
          }}
          className={`absolute right-[10px] top-[10px] z-10 grid h-7 w-7 place-items-center rounded-full bg-white/90 ${
            mission.liked ? "text-[#ff6b8a]" : "text-[#b8c3d2]"
          } disabled:cursor-wait disabled:opacity-70`}
          aria-label={mission.liked ? "미션 좋아요 해제" : "미션 좋아요"}
          aria-pressed={Boolean(mission.liked)}
        >
          {isLikePending ? (
            <Loader2 className="animate-spin" size={14} />
          ) : (
            <Heart
              size={15}
              strokeWidth={2.3}
              fill={mission.liked ? "currentColor" : "none"}
            />
          )}
        </button>

        {mission.imageUrl ? (
          <img
            src={mission.imageUrl}
            alt={mission.title}
            className="h-[122px] w-full object-cover"
          />
        ) : (
          <span className="text-[44px] drop-shadow-[0_10px_12px_rgba(8,37,95,0.12)]">
            {mission.visual}
          </span>
        )}
      </div>

      <div className="px-3 pb-[14px] pt-3">
        <span
          className={`inline-flex rounded-full px-[9px] py-[5px] text-[11px] font-black ${categoryToneClass}`}
        >
          {mission.category}
        </span>

        <strong className="mt-[9px] block text-[14px] font-black leading-[1.35] text-[#1c1c3a]">
          {mission.title}
        </strong>

        <footer className="mt-3 flex items-center justify-between text-[12px] text-[#99a6b8]">
          <span className="inline-flex items-center gap-1">
            <MapPin size={12} strokeWidth={2.4} />
            {mission.distance}
          </span>

          <b className="text-[#5bb5f8]">+{mission.points}P</b>
        </footer>
      </div>
    </article>
  );
}
