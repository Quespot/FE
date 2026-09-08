import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  MapPin,
  Minus,
  Navigation,
  Plus,
  Search,
} from "lucide-react";
import {
  APIProvider,
  AdvancedMarker,
  Map,
  useMap,
} from "@vis.gl/react-google-maps";

import HomeHeader from "@/components/home/HomeHeader";
import QuespotPageLayout, {
  QuespotDivider,
  QuespotPageContent,
} from "@/layouts/QuespotPageLayout";
import {
  DEFAULT_CURRENT_LOCATION,
  MAP_SPOTS,
  SEOUL_JONGNO_CENTER,
  type LatLng,
  type MapSpot,
  type RoutePlace,
} from "@/data/mapSpots";
import { PATH } from "@/routes/paths";
import QuestySvg from "@/assets/icons/Questy.svg";

type LocationStatus = "loading" | "success" | "error";

type MapPageState = {
  selectedSpotId?: number;
  openPlaceList?: boolean;
};

export default function MapPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedSpotId, setSelectedSpotId] = useState<number>(3);
  const [isPlaceListOpen, setIsPlaceListOpen] = useState(false);

  const { currentLocation, locationStatus } = useCurrentLocation();

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as
    | string
    | undefined;

  useEffect(() => {
    const state = location.state as MapPageState | null;

    if (!state?.selectedSpotId) return;

    const hasSelectedSpot = MAP_SPOTS.some(
      (spot) => spot.id === state.selectedSpotId,
    );

    if (!hasSelectedSpot) return;

    setSelectedSpotId(state.selectedSpotId);
    setIsPlaceListOpen(Boolean(state.openPlaceList));

    window.history.replaceState({}, document.title);
  }, [location.state]);

  const selectedSpot = useMemo(() => {
    return MAP_SPOTS.find((spot) => spot.id === selectedSpotId) ?? MAP_SPOTS[0];
  }, [selectedSpotId]);

  const completedCount = MAP_SPOTS.filter(
    (spot) => spot.status === "completed",
  ).length;

  const handleSelectSpot = (spotId: number) => {
    setSelectedSpotId(spotId);
  };

  const handleSelectSpotCard = (spotId: number) => {
    setSelectedSpotId(spotId);
    setIsPlaceListOpen(true);
  };

  const handleMoveRoutePage = (place: RoutePlace) => {
    navigate(PATH.MISSION_ROUTE, {
      state: {
        place,
        origin: currentLocation,
      },
    });
  };

  return (
    <QuespotPageLayout className="bg-[#F4F8FF]">
      <HomeHeader
        mascotSrc={QuestySvg}
        notificationCount={3}
        onBellClick={() => {
          // TODO: 알림함 연결
        }}
      />

      <QuespotDivider />

      <section className="shrink-0 bg-white px-[16px] pb-[20px] pt-[24px]">
        <div className="flex items-center justify-between">
          <h1 className="m-0 text-[24px] font-black leading-[32px] text-[#1C1C3A]">
            미션 지도
          </h1>

          <span className="inline-flex h-[32px] items-center gap-[7px] rounded-full bg-[#E8FBF3] px-[14px] text-[12px] font-black text-[#008A3D]">
            <i className="h-[8px] w-[8px] rounded-full bg-[#00C950]" />
            {locationStatus === "success" ? "현재 위치" : "서울 종로구"}
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigate(PATH.MAP_SEARCH)}
          className="mt-[20px] flex h-[48px] w-full items-center gap-[8px] rounded-[16px] bg-[#EAF5FF] px-[20px] text-left text-[#A2A9B2] transition active:scale-[0.99]"
        >
          <Search size={18} strokeWidth={2.2} />

          <span className="text-[14px] font-medium leading-[20px] text-[#A2A9B2]">
            지역 · 장소 검색
          </span>
        </button>
      </section>

      <QuespotPageContent className="bg-[#F4F8FF]">
        <section className="relative h-[480px] w-full shrink-0 overflow-hidden bg-[#EDF4EC]">
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
                <MapCameraController selectedSpot={selectedSpot} />

                {MAP_SPOTS.map((spot) => (
                  <MissionMapMarker
                    key={spot.id}
                    spot={spot}
                    currentLocation={currentLocation}
                    isSelected={selectedSpot.id === spot.id}
                    onClick={() => handleSelectSpot(spot.id)}
                    onRouteClick={() => {
                      const firstPlace = spot.places[0];
                      if (!firstPlace) return;

                      handleMoveRoutePage(firstPlace);
                    }}
                  />
                ))}

                <CurrentLocationMarker currentLocation={currentLocation} />

                <MapControls currentLocation={currentLocation} />
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

        <section className="shrink-0 bg-white px-[16px] pb-[18px] pt-[16px]">
          <div className="mb-[14px] flex items-center justify-between">
            <h2 className="m-0 text-[20px] font-black leading-[28px] text-[#1C1C3A]">
              주변 미션 스팟
            </h2>

            <button
              type="button"
              onClick={() => setIsPlaceListOpen((value) => !value)}
              className="inline-flex items-center gap-[5px] bg-transparent text-[14px] font-bold text-[#5BB5F8]"
            >
              <Navigation size={15} strokeWidth={2.4} />
              {isPlaceListOpen ? "접기" : "추천장소"}
            </button>
          </div>

          <div className="no-scrollbar flex gap-[10px] overflow-x-auto pb-[2px]">
            {MAP_SPOTS.map((spot) => (
              <SpotSummaryCard
                key={spot.id}
                spot={spot}
                selected={selectedSpot.id === spot.id}
                onClick={() => handleSelectSpotCard(spot.id)}
              />
            ))}
          </div>

          {isPlaceListOpen ? (
            <RecommendedPlaceList
              spot={selectedSpot}
              currentLocation={currentLocation}
              onPlaceClick={handleMoveRoutePage}
            />
          ) : null}
        </section>
      </QuespotPageContent>
    </QuespotPageLayout>
  );
}

function useCurrentLocation() {
  const [currentLocation, setCurrentLocation] = useState<LatLng>(
    DEFAULT_CURRENT_LOCATION,
  );
  const [locationStatus, setLocationStatus] =
    useState<LocationStatus>("loading");

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationStatus("success");
      },
      () => {
        setLocationStatus("error");
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 1000 * 60 * 5,
      },
    );
  }, []);

  return {
    currentLocation,
    locationStatus,
  };
}

type MapCameraControllerProps = {
  selectedSpot: MapSpot;
};

function MapCameraController({ selectedSpot }: MapCameraControllerProps) {
  const map = useMap();

  useEffect(() => {
    map?.panTo({
      lat: selectedSpot.lat,
      lng: selectedSpot.lng,
    });
  }, [map, selectedSpot.lat, selectedSpot.lng]);

  return null;
}

type MissionMapMarkerProps = {
  spot: MapSpot;
  currentLocation: LatLng;
  isSelected: boolean;
  onClick: () => void;
  onRouteClick: () => void;
};

function MissionMapMarker({
  spot,
  currentLocation,
  isSelected,
  onClick,
  onRouteClick,
}: MissionMapMarkerProps) {
  const isCompleted = spot.status === "completed";
  const firstPlace = spot.places[0];

  const routeInfo = firstPlace
    ? getRouteInfo(currentLocation, firstPlace)
    : {
        distance: "1.3km",
        duration: "도보 약 18분",
        direction: "북쪽으로",
      };

  const bubbleSide = spot.lng > SEOUL_JONGNO_CENTER.lng ? "left" : "right";

  return (
    <AdvancedMarker
      position={{ lat: spot.lat, lng: spot.lng }}
      onClick={onClick}
      zIndex={isSelected ? 9999 : isCompleted ? 20 : 10}
    >
      <div className="relative flex flex-col items-center">
        {isSelected ? (
          <SelectedSpotBubble
            spot={spot}
            routeInfo={routeInfo}
            side={bubbleSide}
            onRouteClick={onRouteClick}
          />
        ) : null}

        <div
          className={[
            "relative z-10 grid h-[40px] w-[40px] place-items-center rounded-full border-[3px] border-white text-[20px] shadow-[0_10px_18px_rgba(8,37,95,0.25)] transition",
            isCompleted ? "bg-[#22C983]" : "bg-[#5BB5F8]",
            isSelected ? "scale-110" : "scale-100",
          ].join(" ")}
        >
          {spot.emoji}
        </div>

        <span className="relative z-10 mt-[5px] rounded-full bg-white px-[10px] py-[4px] text-[11px] font-black leading-[14px] text-[#1C1C3A] shadow-[0_2px_6px_rgba(8,37,95,0.18)]">
          {spot.shortName}
        </span>
      </div>
    </AdvancedMarker>
  );
}

type SelectedSpotBubbleProps = {
  spot: MapSpot;
  routeInfo: {
    distance: string;
    duration: string;
    direction: string;
  };
  side: "left" | "right";
  onRouteClick: () => void;
};

function SelectedSpotBubble({
  spot,
  routeInfo,
  side,
  onRouteClick,
}: SelectedSpotBubbleProps) {
  const isCompleted = spot.status === "completed";

  return (
    <div
      className={[
        "pointer-events-auto absolute top-[-28px] z-[999] w-[132px] rounded-[18px] bg-white px-[16px] py-[14px] text-center shadow-[0_8px_20px_rgba(8,37,95,0.24)]",
        side === "left" ? "right-[52px]" : "left-[52px]",
      ].join(" ")}
    >
      <strong className="block text-[15px] font-black leading-[20px] text-[#1C1C3A]">
        {spot.shortName}
      </strong>

      <p className="m-0 mt-[6px] text-[12px] font-bold leading-[17px] text-[#A2A9B2]">
        {isCompleted ? "완료" : `미션 ${spot.missionCount ?? 0}개`}
      </p>

      <p className="m-0 mt-[4px] text-[12px] font-bold leading-[17px] text-[#A2A9B2]">
        {routeInfo.distance}
      </p>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onRouteClick();
        }}
        className="mt-[10px] h-[34px] w-full rounded-full bg-[#5BB5F8] text-[13px] font-black leading-none text-white shadow-[0_4px_8px_rgba(91,181,248,0.2)]"
      >
        길찾기 →
      </button>
    </div>
  );
}

type CurrentLocationMarkerProps = {
  currentLocation: LatLng;
};

function CurrentLocationMarker({ currentLocation }: CurrentLocationMarkerProps) {
  return (
    <AdvancedMarker position={currentLocation} zIndex={30}>
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

type MapControlsProps = {
  currentLocation: LatLng;
};

function MapControls({ currentLocation }: MapControlsProps) {
  const map = useMap();

  return (
    <div className="absolute right-[12px] top-[48px] z-10 flex flex-col gap-[10px]">
      <button
        type="button"
        onClick={() => {
          map?.panTo(currentLocation);
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
        "flex min-w-[82px] flex-col items-center rounded-[16px] border px-[12px] py-[12px] transition active:scale-[0.98]",
        selected
          ? "border-[#5BB5F8] bg-[#5BB5F8] text-white"
          : isCompleted
            ? "border-[#BBF7D0] bg-[#F0FDF9]"
            : "border-[#C8E8FF] bg-[#EAF5FF]",
      ].join(" ")}
    >
      <span className="text-[24px] leading-none">{spot.emoji}</span>

      <strong
        className={[
          "mt-[8px] text-[13px] font-black leading-[17px]",
          selected ? "text-white" : "text-[#1C1C3A]",
        ].join(" ")}
      >
        {spot.shortName}
      </strong>

      <span
        className={[
          "mt-[3px] text-[11px] font-bold leading-[15px]",
          selected
            ? "text-white/90"
            : isCompleted
              ? "text-[#00C950]"
              : "text-[#A2A9B2]",
        ].join(" ")}
      >
        {isCompleted ? "완료" : `${spot.missionCount ?? 0}개`}
      </span>
    </button>
  );
}

type RecommendedPlaceListProps = {
  spot: MapSpot;
  currentLocation: LatLng;
  onPlaceClick: (place: RoutePlace) => void;
};

function RecommendedPlaceList({
  spot,
  currentLocation,
  onPlaceClick,
}: RecommendedPlaceListProps) {
  return (
    <div className="mt-[16px] flex flex-col gap-[10px]">
      <div className="flex items-center justify-between">
        <h3 className="m-0 text-[16px] font-black leading-[22px] text-[#1C1C3A]">
          {spot.shortName} 추천 장소
        </h3>

        <span className="text-[12px] font-bold leading-[16px] text-[#5BB5F8]">
          {spot.places.length}개
        </span>
      </div>

      {spot.places.map((place) => {
        const routeInfo = getRouteInfo(currentLocation, place);

        return (
          <button
            key={place.id}
            type="button"
            onClick={() => onPlaceClick(place)}
            className="flex min-h-[82px] w-full items-center rounded-[16px] border border-[#EAF5FF] bg-white p-[14px] text-left shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition active:scale-[0.99]"
          >
            <div className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-[16px] bg-[#EAF5FF] text-[25px] leading-none">
              {place.emoji}
            </div>

            <div className="ml-[14px] min-w-0 flex-1">
              <strong className="block truncate text-[15px] font-black leading-[21px] text-[#1C1C3A]">
                {place.name}
              </strong>

              <p className="m-0 mt-[4px] truncate text-[12px] font-medium leading-[17px] text-[#A2A9B2]">
                {place.area}
              </p>

              <div className="mt-[8px] flex items-center gap-[10px]">
                <span className="text-[11px] font-bold leading-none text-[#F59E0B]">
                  {routeInfo.duration}
                </span>

                <span className="text-[11px] font-bold leading-none text-[#FF2D45]">
                  {routeInfo.distance}
                </span>
              </div>
            </div>

            <ChevronRight
              size={20}
              strokeWidth={2.5}
              className="shrink-0 text-[#C8E8FF]"
            />
          </button>
        );
      })}
    </div>
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

function getRouteInfo(origin: LatLng, destination: LatLng) {
  const distanceKm = getDistanceKm(origin, destination);
  const distance = formatDistance(distanceKm);
  const duration = getApproxWalkingDuration(distanceKm);
  const direction = getDirectionText(origin, destination);

  return {
    distance,
    duration,
    direction,
  };
}

function getDistanceKm(origin: LatLng, destination: LatLng) {
  const earthRadiusKm = 6371;
  const latDistance = toRadians(destination.lat - origin.lat);
  const lngDistance = toRadians(destination.lng - origin.lng);

  const originLat = toRadians(origin.lat);
  const destinationLat = toRadians(destination.lat);

  const a =
    Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
    Math.cos(originLat) *
      Math.cos(destinationLat) *
      Math.sin(lngDistance / 2) *
      Math.sin(lngDistance / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function formatDistance(distanceKm: number) {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  }

  return `${distanceKm.toFixed(1)}km`;
}

function getApproxWalkingDuration(distanceKm: number) {
  const walkingSpeedKmPerHour = 4.2;
  const minutes = Math.max(
    1,
    Math.round((distanceKm / walkingSpeedKmPerHour) * 60),
  );

  if (minutes < 60) {
    return `도보 약 ${minutes}분`;
  }

  const hours = Math.floor(minutes / 60);
  const remainMinutes = minutes % 60;

  if (remainMinutes === 0) {
    return `도보 약 ${hours}시간`;
  }

  return `도보 약 ${hours}시간 ${remainMinutes}분`;
}

function getDirectionText(origin: LatLng, destination: LatLng) {
  const latDiff = destination.lat - origin.lat;
  const lngDiff = destination.lng - origin.lng;

  if (Math.abs(latDiff) > Math.abs(lngDiff)) {
    return latDiff > 0 ? "북쪽으로" : "남쪽으로";
  }

  return lngDiff > 0 ? "동쪽으로" : "서쪽으로";
}