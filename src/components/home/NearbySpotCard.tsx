import { ChevronRight, ClipboardCheck, MapPin, Star } from "lucide-react";

type NearbySpot = {
  id: string | number;
  name: string;
  distance: string;
  done?: boolean;
  status?: string;
  missionCount?: number;
  rating?: number;
  badge?: number;
};

type NearbySpotCardProps = {
  spot: NearbySpot;
  onClick: () => void;
};

export default function NearbySpotCard({ spot, onClick }: NearbySpotCardProps) {
  const isDone = Boolean(spot.done);

  return (
    <article className="grid grid-cols-[56px_minmax(0,1fr)_auto_34px] items-center gap-2.5 rounded-[18px] border border-[#dce8f5] bg-white px-3 py-2.5 shadow-[0_2px_8px_rgba(8,37,95,0.09)]">
      <span
        className={`relative grid h-[50px] w-[50px] place-items-center rounded-[17px] ${
          isDone
            ? "bg-[#e7fff4] text-[#14d98b]"
            : "bg-[#e9f5ff] text-[#5bb5f8]"
        }`}
      >
        <MapPin size={22} strokeWidth={2.4} />

        {isDone ? (
          <ClipboardCheck
            className="absolute right-[-2px] top-[-7px] rounded-full border-2 border-white bg-[#16d889] text-white"
            size={15}
            strokeWidth={2.5}
          />
        ) : null}

        {spot.badge ? (
          <b className="absolute -right-0.5 -top-[7px] grid h-[22px] w-[22px] place-items-center rounded-full border-2 border-white bg-[#5bb5f8] text-[10px] font-black text-white">
            {spot.badge}
          </b>
        ) : null}
      </span>

      <div className="min-w-0">
        <strong className="block overflow-hidden text-ellipsis whitespace-nowrap text-[16px] font-black text-[#1c1c3a]">
          {spot.name}
        </strong>

        <p className="m-0 mt-[7px] flex items-center gap-[9px] text-[12px] text-[#9aa6b8]">
          {spot.distance}

          <i className="h-2.5 w-px bg-[#d9e2ee]" />

          {isDone || spot.status === "완료" ? (
            <em className="not-italic font-black text-[#16c77a]">완료</em>
          ) : (
            `미션 ${spot.missionCount ?? 0}개`
          )}
        </p>
      </div>

      {spot.rating !== undefined ? (
        <span className="inline-flex items-center gap-[3px] text-[12px] font-extrabold text-[#697789]">
          <Star size={12} fill="#f5b01a" strokeWidth={0} />
          {spot.rating}
        </span>
      ) : (
        <span />
      )}

      <button
        className="grid h-[34px] w-[34px] place-items-center rounded-full bg-[#eaf5ff] text-[#5bb5f8] transition active:scale-[0.96]"
        onClick={onClick}
        type="button"
        aria-label={`${spot.name} 열기`}
      >
        <ChevronRight size={17} strokeWidth={2.6} />
      </button>
    </article>
  );
}