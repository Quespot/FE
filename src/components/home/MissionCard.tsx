import { Heart, MapPin } from "lucide-react";

const missionToneClasses: Record<string, string> = {
  cream: "bg-[linear-gradient(145deg,#fff6cc_0%,#fffef6_100%)]",
  lavender: "bg-[linear-gradient(145deg,#f1e8ff_0%,#fffaff_100%)]",
  mint: "bg-[linear-gradient(145deg,#ddfaee_0%,#fafffd_100%)]",
  peach: "bg-[linear-gradient(145deg,#ffe6d7_0%,#fff9f5_100%)]",
  blue: "bg-[linear-gradient(145deg,#dff1ff_0%,#f7fcff_100%)]",
};

type Mission = {
  id: string | number;
  title: string;
  category: string;
  distance: string;
  points: number;
  visual: string;
  tone: string;
};

type MissionCardProps = {
  mission: Mission;
  onClick: () => void;
};

export default function MissionCard({ mission, onClick }: MissionCardProps) {
  const toneClass = missionToneClasses[mission.tone] ?? missionToneClasses.blue;

  return (
    <article
      className="cursor-pointer overflow-hidden rounded-2xl border border-[#dce8f5] bg-white shadow-[0_2px_8px_rgba(8,37,95,0.09)] transition active:scale-[0.98]"
      onClick={onClick}
    >
      <div className={`relative grid min-h-[122px] place-items-center ${toneClass}`}>
        <button
          className="absolute right-[10px] top-[10px] grid h-7 w-7 place-items-center rounded-full bg-white/85 text-[#b8c3d2]"
          onClick={(event) => event.stopPropagation()}
          type="button"
          aria-label={`${mission.title} 찜하기`}
        >
          <Heart size={15} strokeWidth={2.3} />
        </button>

        <span className="text-[44px] drop-shadow-[0_10px_12px_rgba(8,37,95,0.12)]">
          {mission.visual}
        </span>
      </div>

      <div className="px-3 pb-[14px] pt-3">
        <span className="inline-flex rounded-full bg-[#fff0c9] px-[9px] py-[5px] text-[11px] font-black text-[#f59e0b]">
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