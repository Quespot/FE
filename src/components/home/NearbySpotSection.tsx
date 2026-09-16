import SectionHeader from "@/components/common/SectionHeader";
import NearbySpotCard from "@/components/home/NearbySpotCard";

type NearbySpot = {
  id: string | number;
  name: string;
  distance: string;
  done?: boolean;
  status?: string;
  missionCount?: number;
  completedMissionCount?: number;
  rating?: number;
  badge?: number;
};

type NearbySpotSectionProps = {
  spots: NearbySpot[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  onMapClick: () => void;
  onSpotClick: (spot: NearbySpot) => void;
};

export default function NearbySpotSection({
  spots,
  isLoading = false,
  isError = false,
  errorMessage = "주변 스팟을 불러오지 못했어요.",
  onRetry,
  onMapClick,
  onSpotClick,
}: NearbySpotSectionProps) {
  return (
    <section className="grid gap-[14px]">
      <SectionHeader
        title="내 주변 스팟"
        actionLabel="지도보기"
        onActionClick={onMapClick}
      />

      {isLoading ? (
        <div className="grid gap-3" aria-label="주변 스팟 불러오는 중">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-[72px] animate-pulse rounded-[18px] bg-[#e5eef8]" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-[18px] bg-white px-4 py-6 text-center text-[13px] font-bold text-[#8d9bae]">
          {errorMessage}
          {onRetry ? (
            <button type="button" className="ml-2 text-[#5bb5f8]" onClick={onRetry}>다시 시도</button>
          ) : null}
        </div>
      ) : spots.length === 0 ? (
        <div className="rounded-[18px] bg-white px-4 py-6 text-center text-[13px] font-bold text-[#8d9bae]">
          주변에 조회된 스팟이 없어요.
        </div>
      ) : (
        <div className="grid gap-3">
          {spots.map((spot) => (
            <NearbySpotCard
              key={spot.id}
              spot={spot}
              onClick={() => onSpotClick(spot)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
