import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapPin, Minus, Navigation, Plus, X, LoaderCircle } from "lucide-react";
import {
  APIProvider,
  AdvancedMarker,
  Map,
  useMap,
} from "@vis.gl/react-google-maps";

import QuespotPageLayout, {
  QuespotPageContent,
} from "@/layouts/QuespotPageLayout";
import {
  DEFAULT_CURRENT_LOCATION,
  SEOUL_JONGNO_CENTER,
  type LatLng,
  type RoutePlace,
} from "@/data/mapSpots";
import { PATH } from "@/routes/paths";
import { Header } from "@/components/common/Header";
import { useMissionSpotsQuery } from "@/hooks/queries/missionSpots/useMissionSpotsQuery";
import { DistrictMissions, MissionSpot } from "@/apis/missionSpot";
import { useNearbyMissionSpotsQuery } from "@/hooks/queries/missionSpots/useNearbyMissionSpotsQuery";
import { useDistrictMissionsQuery } from "@/hooks/queries/missionSpots/useDistrictMissionsQuery";
import MissionListCard from "@/components/map/MissionListCard/MissionListCard";
import SpotSummaryCard from "@/components/map/SpotSummaryCard/SpotSummaryCard";
import MapMissionSummarySkeleton from "@/components/map/MapMissionSummarySkeleton";
import SpotSummaryCardSkeleton from "@/components/map/SpotSummaryCard/SpotSummaryCardSkeleton";
import MissionListCardSkeleton from "@/components/map/MissionListCard/MissionListCardSkeleton";

type LocationStatus = "loading" | "success" | "denied" | "error";

type MapPageState = {
  selectedSpotId?: string;
  openPlaceList?: boolean;
};

export default function MapPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedSpotId, setSelectedSpotId] = useState<string>("");
  const [isMissionSheetOpen, setIsMissionSheetOpen] = useState(false);
  const spotScrollDragRef = useRef<{
    pointerId: number;
    startX: number;
    scrollLeft: number;
    moved: boolean;
  } | null>(null);
  const suppressSpotClickRef = useRef(false);

  const { currentLocation, locationStatus } = useCurrentLocation();

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const { data, isLoading, isError } = useMissionSpotsQuery();
  const {
    data: listData,
    isLoading: isListLoading,
    isError: isListError,
  } = useDistrictMissionsQuery(selectedSpotId);
  console.log(listData?.missions);
  const {
    data: nearData,
    isLoading: isNearLoading,
    isError: isNearError,
  } = useNearbyMissionSpotsQuery(
    locationStatus === "success"
      ? {
          latitude: currentLocation.lat,
          longitude: currentLocation.lng,
        }
      : null,
  );
  const isNearbyLoading = locationStatus === "loading" || isNearLoading;
  useEffect(() => {
    const state = location.state as MapPageState | null;

    if (!state?.selectedSpotId) return;

    const hasSelectedSpot = data?.missionSpots.some(
      (spot) => spot.districtCode === state.selectedSpotId,
    );

    if (!hasSelectedSpot) return;

    setSelectedSpotId(state.selectedSpotId);
    setIsMissionSheetOpen(Boolean(state.openPlaceList));

    window.history.replaceState({}, document.title);
  }, [location.state, data]);

  useEffect(() => {
    if (!selectedSpotId && data?.missionSpots.length) {
      setSelectedSpotId(data.missionSpots[0].districtCode);
    }
  }, [data, selectedSpotId]);

  const selectedSpot = useMemo(() => {
    return data?.missionSpots.find(
      (spot) => spot.districtCode === selectedSpotId,
    ) ?? nearData?.missionSpots.find(
      (spot) => spot.districtCode === selectedSpotId,
    );
  }, [selectedSpotId, data, nearData]);

  const handleSelectSpot = (spotId: string) => {
    setSelectedSpotId(spotId);
  };

  const handleSelectSpotCard = (spotId: string) => {
    setSelectedSpotId(spotId);
  };

  const handleMoveRoutePage = (place: RoutePlace) => {
    navigate(PATH.MISSION_ROUTE, {
      state: {
        place,
        origin: currentLocation,
      },
    });
  };

  const handleSpotScrollPointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (!event.isPrimary || event.button !== 0) return;
    suppressSpotClickRef.current = false;
    spotScrollDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: event.currentTarget.scrollLeft,
      moved: false,
    };
  };

  const handleSpotScrollPointerMove = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    const drag = spotScrollDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const distance = event.clientX - drag.startX;
    if (!drag.moved) {
      if (Math.abs(distance) <= 4) return;
      drag.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    event.currentTarget.scrollLeft = drag.scrollLeft - distance;
  };

  const handleSpotScrollPointerEnd = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    const drag = spotScrollDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    suppressSpotClickRef.current = drag.moved;
    spotScrollDragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  console.log(data);
  return (
    <QuespotPageLayout className="bg-[#F4F8FF]">
      <Header />

      {/* <section className="shrink-0 bg-white px-[16px] pb-[20px] pt-[24px]">
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
      </section> */}
      <QuespotPageContent className="relative bg-[#F4F8FF]">
        <section className="flex flex-1 relative w-full shrink-0 overflow-hidden bg-[#EDF4EC]">
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
                {selectedSpot && (
                  <MapCameraController selectedSpot={selectedSpot} />
                )}
                {data?.missionSpots.map((spot) => {
                  const nearSpot = nearData?.missionSpots.find(
                    (nearSpot) => nearSpot.districtCode === spot.districtCode,
                  );

                  return (
                    <MissionMapMarker
                      key={spot.districtCode}
                      spot={spot}
                      route={nearSpot?.distanceMeters ?? null}
                      currentLocation={currentLocation}
                      isSelected={
                        selectedSpot?.districtCode === spot.districtCode
                      }
                      onClick={() => handleSelectSpot(spot.districtCode)}
                      onListClick={() => setIsMissionSheetOpen(true)}
                    />
                  );
                })}

                <CurrentLocationMarker currentLocation={currentLocation} />

                <MapControls currentLocation={currentLocation} />
              </Map>
            </APIProvider>
          ) : (
            <MapApiKeyFallback />
          )}

          {isLoading && apiKey && (
            <div className="pointer-events-none absolute inset-0 z-[100] flex items-center justify-center">
              <div
                role="status"
                className="flex items-center gap-2 rounded-2xl border border-sky-100 bg-white/95 px-5 py-4 text-sm font-bold text-[#5D6A7D] shadow-lg"
              >
                <LoaderCircle
                  size={20}
                  className="animate-spin text-[#5BB5F8] motion-reduce:animate-none"
                  aria-hidden="true"
                />
                미션 스팟을 불러오는 중이에요
              </div>
            </div>
          )}
          {isError && (
            <div className="absolute inset-0 z-[100] flex items-center justify-center">
              에러가 발생했습니다. 다시 시도해주세요.
            </div>
          )}
          <MapLegend />

          {(isLoading || data) && (
            <div
              aria-busy={isLoading}
              className="absolute bottom-[25px] right-[18px] rounded-[16px] bg-white px-[16px] py-[12px] shadow-[0_4px_12px_rgba(8,37,95,0.18)]"
            >
              {isLoading ? (
                <MapMissionSummarySkeleton />
              ) : (
                <>
                  <strong className="block text-[14px] font-black leading-[18px] text-[#1C1C3A]">
                    {data?.regionName} 미션
                  </strong>

                  <p className="m-0 mt-[4px] text-[14px] font-black leading-[18px]">
                    <span className="text-[#5BB5F8]">
                      {data?.totalSpotCount}개 스팟
                    </span>
                    <span className="mx-[4px] text-[#A2A9B2]">·</span>
                    <span className="text-[#00C950]">
                      {data?.completedMissionCount}완료
                    </span>
                  </p>
                </>
              )}
            </div>
          )}

          <div className="absolute bottom-[10px] left-1/2 h-[6px] w-[48px] -translate-x-1/2 rounded-full bg-[#C8E8FF]" />
        </section>

        <section className="flex flex-col shrink-0 bg-white p-4">
          <div className="mb-[14px] flex items-center justify-between">
            <h2 className="m-0 text-[20px] font-black leading-[28px] text-[#1C1C3A]">
              주변 미션 스팟
            </h2>
          </div>

          <div
            className="no-scrollbar flex cursor-grab touch-none select-none gap-[10px] overflow-x-auto overscroll-x-contain pb-[2px] active:cursor-grabbing"
            aria-busy={isNearbyLoading}
            onClickCapture={(event) => {
              if (event.detail > 0 && suppressSpotClickRef.current) {
                event.preventDefault();
                event.stopPropagation();
                suppressSpotClickRef.current = false;
              }
            }}
            onPointerCancel={handleSpotScrollPointerEnd}
            onPointerDown={handleSpotScrollPointerDown}
            onPointerLeave={handleSpotScrollPointerEnd}
            onPointerMove={handleSpotScrollPointerMove}
            onPointerUp={handleSpotScrollPointerEnd}
            onWheel={(event: ReactWheelEvent<HTMLDivElement>) => {
              event.currentTarget.scrollLeft += event.deltaX || event.deltaY;
            }}
          >
            {isNearbyLoading &&
              Array.from({ length: 6 }, (_, index) => (
                <SpotSummaryCardSkeleton key={index} />
              ))}
            {(locationStatus === "denied" || locationStatus === "error") && (
              <p role="status" className="w-full rounded-xl bg-[#F4F8FF] px-4 py-5 text-center text-sm leading-relaxed text-[#667085]">
                {locationStatus === "denied"
                  ? "주변 미션을 보려면 브라우저 설정에서 위치 권한을 허용한 뒤 페이지를 새로고침해 주세요."
                  : "현재 위치를 확인하지 못했어요. 기기의 위치 설정을 확인한 뒤 페이지를 새로고침해 주세요."}
              </p>
            )}
            {isNearError && (
              <div className="w-full flex justify-center items-center">
                에러가 발생했습니다. 다시 시도해주세요.
              </div>
            )}
            {!isNearbyLoading &&
              nearData?.missionSpots.map((spot) => (
                <SpotSummaryCard
                  key={spot.districtCode}
                  spot={spot}
                  selected={selectedSpot?.districtCode === spot.districtCode}
                  onClick={() => {
                    handleSelectSpotCard(spot.districtCode);
                  }}
                />
              ))}
          </div>
        </section>
        {isMissionSheetOpen && selectedSpot && (
          <>
            <MissionListBottomSheet
              spot={selectedSpot}
              listData={listData}
              isLoading={isListLoading}
              isError={isListError}
              onClose={() => setIsMissionSheetOpen(false)}
            />
          </>
        )}
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
      (error) => {
        setLocationStatus(error.code === 1 ? "denied" : "error");
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
  selectedSpot: MissionSpot;
};

function MapCameraController({ selectedSpot }: MapCameraControllerProps) {
  const map = useMap();

  useEffect(() => {
    map?.panTo({
      lat: selectedSpot.latitude,
      lng: selectedSpot.longitude,
    });
  }, [map, selectedSpot.latitude, selectedSpot.longitude]);

  return null;
}

type MissionMapMarkerProps = {
  spot: MissionSpot;
  route: number | null;
  currentLocation: LatLng;
  isSelected: boolean;
  onClick: () => void;
  onListClick: () => void;
};

// 맵에 보이는 스팟 표시
function MissionMapMarker({
  spot,
  route,
  isSelected,
  onClick,
  onListClick,
}: MissionMapMarkerProps) {
  const isCompleted = spot.completionStatus === "COMPLETE";

  const bubbleSide =
    spot.longitude > SEOUL_JONGNO_CENTER.lng ? "left" : "right";

  return (
    <AdvancedMarker
      position={{ lat: spot.latitude, lng: spot.longitude }}
      onClick={onClick}
      zIndex={isSelected ? 9999 : isCompleted ? 20 : 10}
    >
      <div className="relative flex flex-col items-center">
        {isSelected ? (
          <SelectedSpotBubble
            spot={spot}
            route={route}
            side={bubbleSide}
            onListClick={onListClick}
          />
        ) : null}

        <MapPin
          size={44}
          strokeWidth={1.5}
          fill={isCompleted ? "#22C983" : "#5BB5F8"}
          className={[
            "relative z-10 text-white drop-shadow-[0_10px_18px_rgba(8,37,95,0.25)] transition",
            isSelected
              ? "scale-125 -translate-y-[3px] drop-shadow-[0_12px_18px_rgba(91,181,248,0.45)]"
              : "scale-100 drop-shadow-[0_6px_10px_rgba(8,37,95,0.22)]",
          ].join(" ")}
        />

        <span className="relative z-10 mt-[5px] rounded-full bg-white px-[10px] py-[4px] text-[11px] font-black leading-[14px] text-[#1C1C3A] shadow-[0_2px_6px_rgba(8,37,95,0.18)]">
          {spot.districtName}
        </span>
      </div>
    </AdvancedMarker>
  );
}

type SelectedSpotBubbleProps = {
  spot: MissionSpot;
  route: number | null;
  side: "left" | "right";
  onListClick: () => void;
};

//지도 구역 눌렀을 때 뜨는 안내 박스
function SelectedSpotBubble({
  spot,
  route,
  side,
  onListClick,
}: SelectedSpotBubbleProps) {
  const isCompleted = spot.completionStatus === "COMPLETE";

  return (
    <div
      className={[
        "pointer-events-auto absolute top-[-28px] z-[999] w-[132px] rounded-[18px] bg-white px-[16px] py-[14px] text-center shadow-[0_8px_20px_rgba(8,37,95,0.24)]",
        side === "left" ? "right-[52px]" : "left-[52px]",
      ].join(" ")}
    >
      <strong className="block text-[15px] font-black leading-[20px] text-[#1C1C3A]">
        {spot.districtName}
      </strong>

      <p className="m-0 mt-[6px] text-[12px] font-bold leading-[17px] text-[#A2A9B2]">
        {isCompleted ? "완료" : `미션 ${spot.missionCount ?? 0}개`}
      </p>

      {route != null && (
        <p className="m-0 mt-[4px] text-[12px] font-bold leading-[17px] text-[#A2A9B2]">
          {route}M
        </p>
      )}

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onListClick();
        }}
        className="mt-[10px] h-[34px] w-full rounded-full bg-[#5BB5F8] text-[13px] font-black leading-none text-white shadow-[0_4px_8px_rgba(91,181,248,0.2)]"
      >
        미션 확인하기
      </button>
    </div>
  );
}

type CurrentLocationMarkerProps = {
  currentLocation: LatLng;
};

function CurrentLocationMarker({
  currentLocation,
}: CurrentLocationMarkerProps) {
  return (
    <AdvancedMarker position={currentLocation} zIndex={30}>
      <div className="relative flex flex-col items-center">
        <div className="relative grid h-[38px] w-[38px] place-items-center">
          <span className="absolute h-[38px] w-[38px] rounded-full bg-[#5BB5F8]/20" />
          <span className="relative grid h-[26px] w-[26px] place-items-center rounded-full border-[4px] border-white bg-[#3BA7F7] shadow-[0_4px_12px_rgba(59,167,247,0.45)]">
            <span className="h-[7px] w-[7px] rounded-full bg-white" />
          </span>
        </div>
        <span className="mt-[4px] inline-flex items-center gap-[5px] rounded-full border border-[#E2F2FF] bg-white px-[9px] py-[4px] text-[11px] font-bold leading-[14px] text-[#3BA7F7] shadow-[0_3px_8px_rgba(8,37,95,0.14)]">
          <span className="h-[6px] w-[6px] rounded-full bg-[#3BA7F7]" />
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
    <div className="absolute left-[12px] top-[25px] z-10 rounded-[16px] bg-white px-[14px] py-[12px] shadow-[0_4px_12px_rgba(8,37,95,0.18)]">
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

type MissionListBottomSheetProps = {
  spot: MissionSpot;
  listData: DistrictMissions | undefined;
  isLoading: boolean;
  isError: boolean;
  onClose: () => void;
};

function MissionListBottomSheet({
  spot,
  listData,
  isLoading,
  isError,
  onClose,
}: MissionListBottomSheetProps) {
  return (
    <div
      className="absolute inset-0 z-[1000] flex items-end bg-black/20"
      onClick={onClose}
    >
      <section
        onClick={(event) => event.stopPropagation()}
        className="relative flex flex-col h-[70%] w-full rounded-t-[28px] bg-white px-[20px] pb-[24px] pt-[12px] shadow-[0_-8px_30px_rgba(8,37,95,0.16)] min-h-0 overflow-hidden"
      >
        <div className="mx-auto mb-[12px] h-[5px] w-[44px] rounded-full bg-[#D7DEE8]" />

        <div className="flex items-center justify-between">
          <div>
            <h2 className="m-0 text-[22px] font-black leading-[30px] text-[#1C1C3A]">
              {spot.districtName} 미션
            </h2>

            <p className="m-0 mt-[3px] text-[13px] font-bold text-[#A2A9B2]">
              총 {spot.missionCount ?? 0}개
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-[38px] w-[38px] place-items-center rounded-full bg-[#F4F8FF] text-[#5D6A7D] transition active:scale-95"
            aria-label="미션 목록 닫기"
          >
            <X size={20} strokeWidth={2.3} />
          </button>
        </div>

        {/* 미션 목록 */}
        <div
          className="no-scrollbar mt-[16px] min-h-0 overflow-y-auto flex flex-col gap-2 overscroll-contain"
          aria-busy={isLoading}
        >
          {isLoading &&
            Array.from({ length: 3 }, (_, index) => (
              <MissionListCardSkeleton key={index} />
            ))}
          {isError && (
            <div className="w-full flex justify-center items-center">
              에러가 발생했습니다. 다시 시도해주십시오.
            </div>
          )}
          {!isLoading &&
            listData?.missions.map((data) => (
              <MissionListCard key={data.missionId} mission={data} />
            ))}
        </div>
      </section>
    </div>
  );
}
