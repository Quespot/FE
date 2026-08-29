import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  ChevronRight,
  LocateFixed,
  MapPin,
  Navigation,
  Plus,
  Search,
  Utensils,
  Minus,
} from "lucide-react";
import {
  APIProvider,
  AdvancedMarker,
  Map,
  Pin,
  useMap,
} from "@vis.gl/react-google-maps";

import HomeHeader from "@/components/home/HomeHeader";
import { PATH } from "@/routes/paths";
import QuestySvg from "@/assets/icons/Questy.svg";

type SpotStatus = "completed" | "available" | "current";

type MapSpot = {
  id: number;
  name: string;
  shortName: string;
  emoji: string;
  lat: number;
  lng: number;
  status: SpotStatus;
  missionCount?: number;
};

const SEOUL_JONGNO_CENTER = {
  lat: 37.5759,
  lng: 126.9768,
};

const MAP_SPOTS: MapSpot[] = [
  {
    id: 1,
    name: "경복궁",
    shortName: "경복궁",
    emoji: "🏯",
    lat: 37.579617,
    lng: 126.977041,
    status: "completed",
  },
  {
    id: 2,
    name: "북촌",
    shortName: "북촌",
    emoji: "🏡",
    lat: 37.582604,
    lng: 126.984874,
    status: "completed",
  },
  {
    id: 3,
    name: "인사동",
    shortName: "인사동",
    emoji: "☕",
    lat: 37.574331,
    lng: 126.985944,
    status: "available",
    missionCount: 2,
  },
  {
    id: 4,
    name: "명동",
    shortName: "명동",
    emoji: "🛍️",
    lat: 37.563692,
    lng: 126.98221,
    status: "available",
    missionCount: 4,
  },
  {
    id: 5,
    name: "성수동",
    shortName: "성수동",
    emoji: "🎨",
    lat: 37.544581,
    lng: 127.055961,
    status: "available",
    missionCount: 3,
  },
];

const CURRENT_LOCATION = {
  lat: 37.5752,
  lng: 126.9812,
};

export default function MapPage() {
  const navigate = useNavigate();
  const [selectedSpotId, setSelectedSpotId] = useState<number>(1);

  const selectedSpot = useMemo(() => {
    return MAP_SPOTS.find((spot) => spot.id === selectedSpotId) ?? MAP_SPOTS[0];
  }, [selectedSpotId]);

  const completedCount = MAP_SPOTS.filter(
    (spot) => spot.status === "completed",
  ).length;

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

  return (
    <section className="flex min-h-full flex-1 flex-col overflow-y-auto bg-[#F4F8FF] pb-[24px]">
      <HomeHeader
        mascotSrc={QuestySvg}
        notificationCount={3}
        onBellClick={() => {
          // TODO: 알림함 연결
        }}
      />

      <section className="bg-white px-[16px] pb-[12px] pt-[24px]">
        <div className="flex items-center justify-between">
          <h1 className="m-0 text-[24px] font-black leading-[32px] text-[#1C1C3A]">
            미션 지도
          </h1>

          <span className="inline-flex h-[32px] items-center gap-[7px] rounded-full bg-[#E8FBF3] px-[14px] text-[12px] font-black text-[#008A3D]">
            <i className="h-[8px] w-[8px] rounded-full bg-[#00C950]" />
            서울 종로구
          </span>
        </div>

        <label className="mt-[20px] flex h-[48px] w-full items-center gap-[8px] rounded-[16px] bg-[#EAF5FF] px-[20px] text-[#A2A9B2]">
          <Search size={18} strokeWidth={2.2} />
          <input
            type="text"
            placeholder="지역 · 장소 검색"
            className="h-full min-w-0 flex-1 bg-transparent text-[14px] font-medium leading-[20px] text-[#1C1C3A] outline-none placeholder:text-[#A2A9B2]"
          />
        </label>
      </section>

      <section className="relative h-[480px] w-full overflow-hidden bg-[#EDF4EC]">
        {apiKey ? (
          <APIProvider apiKey={apiKey} language="ko" region="KR">
            <Map
              defaultCenter={SEOUL_JONGNO_CENTER}
              defaultZoom={14}
              mapId="quespot-map"
              disableDefaultUI
              gestureHandling="greedy"
              className="h-full w-full"
            >
              {MAP_SPOTS.map((spot) => (
                <MissionMapMarker
                  key={spot.id}
                  spot={spot}
                  isSelected={selectedSpot.id === spot.id}
                  onClick={() => setSelectedSpotId(spot.id)}
                />
              ))}

              <CurrentLocationMarker />

              <MapControls />
            </Map>
          </APIProvider>
        ) : (
          <MapApiKeyFallback />
        )}

        <MapLegend />

        <div className="absolute bottom-[58px] right-[18px] rounded-[16px] bg-white px-[16px] py-[12px] shadow-[0_4px_12px_rgba(8,37,95,0.18)]">
          <strong className="block text-[14px] font-black leading-[18px] text-[#1C1C3A]">
            서울 미션
          </strong>
          <p className="m-0 mt-[4px] text-[14px] font-black leading-[18px]">
            <span className="text-[#5BB5F8]">{MAP_SPOTS.length}개 스팟</span>
            <span className="mx-[4px] text-[#A2A9B2]">·</span>
            <span className="text-[#00C950]">{completedCount}완료</span>
          </p>
        </div>

        <div className="absolute bottom-[10px] left-1/2 h-[6px] w-[48px] -translate-x-1/2 rounded-full bg-[#C8E8FF]" />
      </section>

      <section className="bg-white px-[16px] pb-[18px] pt-[16px]">
        <div className="mb-[14px] flex items-center justify-between">
          <h2 className="m-0 text-[20px] font-black leading-[28px] text-[#1C1C3A]">
            주변 미션 스팟
          </h2>

          <button
            type="button"
            className="inline-flex items-center gap-[5px] bg-transparent text-[14px] font-bold text-[#5BB5F8]"
          >
            <Navigation size={15} strokeWidth={2.4} />
            길찾기
          </button>
        </div>

        <div className="flex gap-[10px] overflow-x-auto pb-[2px] scrollbar-hide">
          {MAP_SPOTS.map((spot) => (
            <SpotSummaryCard
              key={spot.id}
              spot={spot}
              selected={selectedSpot.id === spot.id}
              onClick={() => setSelectedSpotId(spot.id)}
            />
          ))}
        </div>
      </section>
    </section>
  );
}

type MissionMapMarkerProps = {
  spot: MapSpot;
  isSelected: boolean;
  onClick: () => void;
};

function MissionMapMarker({ spot, isSelected, onClick }: MissionMapMarkerProps) {
  const isCompleted = spot.status === "completed";

  return (
    <AdvancedMarker position={{ lat: spot.lat, lng: spot.lng }} onClick={onClick}>
      <div className="relative flex flex-col items-center">
        <div
          className={[
            "grid h-[40px] w-[40px] place-items-center rounded-full border-[3px] border-white text-[20px] shadow-[0_10px_18px_rgba(8,37,95,0.25)]",
            isCompleted ? "bg-[#22C983]" : "bg-[#5BB5F8]",
            isSelected ? "scale-110" : "scale-100",
          ].join(" ")}
        >
          {spot.emoji}
        </div>

        <span className="mt-[5px] rounded-full bg-white px-[10px] py-[4px] text-[11px] font-black leading-[14px] text-[#1C1C3A] shadow-[0_2px_6px_rgba(8,37,95,0.18)]">
          {spot.shortName}
        </span>
      </div>
    </AdvancedMarker>
  );
}

function CurrentLocationMarker() {
  return (
    <AdvancedMarker position={CURRENT_LOCATION}>
      <div className="relative flex flex-col items-center">
        <div className="grid h-[34px] w-[34px] place-items-center rounded-full border-[5px] border-white bg-[#3BA7F7] shadow-[0_8px_16px_rgba(8,37,95,0.25)]">
          <span className="h-[12px] w-[12px] rounded-full bg-white" />
        </div>

        <span className="mt-[5px] inline-flex items-center gap-[5px] rounded-full bg-white px-[10px] py-[4px] text-[11px] font-black leading-[14px] text-[#5D6A7D] shadow-[0_2px_6px_rgba(8,37,95,0.18)]">
          <i className="h-[7px] w-[7px] rounded-full bg-[#3BA7F7]" />
          현재 위치
        </span>
      </div>
    </AdvancedMarker>
  );
}

function MapControls() {
  const map = useMap();

  return (
    <div className="absolute right-[12px] top-[48px] z-10 flex flex-col gap-[10px]">
      <button
        type="button"
        onClick={() => {
          map?.panTo(CURRENT_LOCATION);
          map?.setZoom(15);
        }}
        className="grid h-[44px] w-[44px] place-items-center rounded-[16px] bg-white text-[#5BB5F8] shadow-[0_3px_8px_rgba(8,37,95,0.18)]"
        aria-label="현재 위치로 이동"
      >
        <Navigation size={20} strokeWidth={2.4} />
      </button>

      <button
        type="button"
        onClick={() => map?.setZoom((map.getZoom() ?? 14) + 1)}
        className="grid h-[44px] w-[44px] place-items-center rounded-[16px] bg-white text-[#5BB5F8] shadow-[0_3px_8px_rgba(8,37,95,0.18)]"
        aria-label="지도 확대"
      >
        <Plus size={22} strokeWidth={2.5} />
      </button>

      <button
        type="button"
        onClick={() => map?.setZoom((map.getZoom() ?? 14) - 1)}
        className="grid h-[44px] w-[44px] place-items-center rounded-[16px] bg-white text-[#5BB5F8] shadow-[0_3px_8px_rgba(8,37,95,0.18)]"
        aria-label="지도 축소"
      >
        <Minus size={22} strokeWidth={2.5} />
      </button>
    </div>
  );
}

function MapLegend() {
  return (
    <div className="absolute left-[12px] top-[48px] z-10 rounded-[16px] bg-white px-[14px] py-[12px] shadow-[0_4px_12px_rgba(8,37,95,0.18)]">
      <LegendItem color="bg-[#5BB5F8]" label="미완료" />
      <LegendItem color="bg-[#22C983]" label="완료" />
      <LegendItem color="bg-[#3BA7F7]" label="내 위치" />
    </div>
  );
}

type LegendItemProps = {
  color: string;
  label: string;
};

function LegendItem({ color, label }: LegendItemProps) {
  return (
    <div className="flex items-center gap-[8px] py-[3px]">
      <span className={`h-[10px] w-[10px] rounded-full ${color}`} />
      <span className="text-[11px] font-black leading-[15px] text-[#5D6A7D]">
        {label}
      </span>
    </div>
  );
}

type SpotSummaryCardProps = {
  spot: MapSpot;
  selected: boolean;
  onClick: () => void;
};

function SpotSummaryCard({ spot, selected, onClick }: SpotSummaryCardProps) {
  const isCompleted = spot.status === "completed";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex min-w-[68px] flex-col items-center rounded-[16px] border px-[12px] py-[10px]",
        selected
          ? "border-[#BBF7D0] bg-[#F0FDF9]"
          : "border-[#C8E8FF] bg-[#EAF5FF]",
      ].join(" ")}
    >
      <span className="text-[22px] leading-none">{spot.emoji}</span>

      <strong className="mt-[8px] text-[13px] font-black leading-[17px] text-[#1C1C3A]">
        {spot.shortName}
      </strong>

      <span
        className={[
          "mt-[3px] text-[11px] font-bold leading-[15px]",
          isCompleted ? "text-[#00C950]" : "text-[#A2A9B2]",
        ].join(" ")}
      >
        {isCompleted ? "완료" : `${spot.missionCount ?? 0}개`}
      </span>
    </button>
  );
}

function MapApiKeyFallback() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#EDF4EC] px-[24px] text-center">
      <MapPin size={42} className="text-[#5BB5F8]" strokeWidth={2.2} />

      <strong className="mt-[14px] text-[16px] font-black text-[#1C1C3A]">
        Google Maps API Key가 필요해요
      </strong>

      <p className="mt-[8px] text-[12px] font-medium leading-[18px] text-[#A2A9B2]">
        프로젝트 루트의 .env 파일에
        <br />
        VITE_GOOGLE_MAPS_API_KEY를 추가해주세요.
      </p>
    </div>
  );
}