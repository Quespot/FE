import { MapPin } from "lucide-react";
import SectionHeader from "@/components/common/SectionHeader";
import NearbySpotCard from "@/components/home/NearbySpotCard";

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

type NearbySpotSectionProps = {
  spots: NearbySpot[];
  onMapClick: () => void;
  onSpotClick: (spot: NearbySpot) => void;
};

export default function NearbySpotSection({
  spots,
  onMapClick,
  onSpotClick,
}: NearbySpotSectionProps) {
  return (
    <section className="grid gap-[14px]">
      <SectionHeader
        title="내 주변 스팟"
        icon={<MapPin size={15} fill="#ef4444" strokeWidth={2.2} />}
        actionLabel="지도보기"
        onActionClick={onMapClick}
      />

      <div className="grid gap-3">
        {spots.map((spot) => (
          <NearbySpotCard
            key={spot.id}
            spot={spot}
            onClick={() => onSpotClick(spot)}
          />
        ))}
      </div>
    </section>
  );
}