import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock3, MapPin, Navigation } from "lucide-react";
import {
  APIProvider,
  AdvancedMarker,
  Map,
  useMap,
} from "@vis.gl/react-google-maps";

import QuespotPageLayout, {
  QuespotDivider,
  QuespotPageContent,
} from "@/layouts/QuespotPageLayout";
import { PATH } from "@/routes/paths";

type LatLng = {
  lat: number;
  lng: number;
};

type LocationStatus = "loading" | "success" | "error";

type RoutePlace = {
  id: number;
  name: string;
  area: string;
  emoji: string;
  lat: number;
  lng: number;
  duration: string;
  distance: string;
  direction: string;
};

type MissionRouteState = {
  place?: RoutePlace;
  origin?: LatLng;
};

const DEFAULT_CURRENT_LOCATION: LatLng = {
  lat: 37.5752,
  lng: 126.9812,
};

const DEFAULT_PLACE: RoutePlace = {
  id: 301,
  name: "인사동 전통찻집",
  area: "서울 종로구 인사동",
  emoji: "☕",
  lat: 37.574331,
  lng: 126.985944,
  duration: "도보 18분",
  distance: "1.3km",
  direction: "북쪽으로",
};

export default function MissionRoutePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as MissionRouteState | null;

  const place = state?.place ?? DEFAULT_PLACE;

  const { currentLocation, locationStatus } = useCurrentLocation(
    state?.origin ?? DEFAULT_CURRENT_LOCATION,
  );

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

  const destination = useMemo<LatLng>(() => {
    return {
      lat: place.lat,
      lng: place.lng,
    };
  }, [place.lat, place.lng]);

  const routeInfo = useMemo(() => {
    return getRouteInfo(currentLocation, destination);
  }, [currentLocation, destination]);

  const mapCenter = useMemo(() => {
    return {
      lat: (currentLocation.lat + place.lat) / 2,
      lng: (currentLocation.lng + place.lng) / 2,
    };
  }, [currentLocation.lat, currentLocation.lng, place.lat, place.lng]);

  const handleOpenGoogleMaps = () => {
    const url = new URL("https://www.google.com/maps/dir/");
    url.searchParams.set("api", "1");
    url.searchParams.set(
      "origin",
      `${currentLocation.lat},${currentLocation.lng}`,
    );
    url.searchParams.set("destination", `${place.lat},${place.lng}`);
    url.searchParams.set("travelmode", "walking");

    window.open(url.toString(), "_blank", "noopener,noreferrer");
  };

  const handleOpenNaverMaps = () => {
    const appName = window.location.hostname || "quespot";

    const params = new URLSearchParams({
      slat: String(currentLocation.lat),
      slng: String(currentLocation.lng),
      sname: "현재 위치",
      dlat: String(place.lat),
      dlng: String(place.lng),
      dname: place.name,
      appname: appName,
    });

    window.location.href = `nmap://route/walk?${params.toString()}`;
  };

  return (
    <QuespotPageLayout className="bg-[#F4F8FF]">
      <header className="shrink-0 bg-white">
        <div className="flex h-[80px] items-center gap-[16px] px-[16px]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="grid h-[40px] w-[40px] shrink-0 place-items-center rounded-full bg-[#EAF5FF] text-[#5BB5F8]"
            aria-label="뒤로가기"
          >
            <ArrowLeft size={20} strokeWidth={2.6} />
          </button>

          <h1 className="m-0 text-[20px] font-black leading-[28px] text-[#1C1C3A]">
            다음 장소 길찾기
          </h1>
        </div>

        <QuespotDivider />
      </header>

      <QuespotPageContent className="gap-[20px] px-[16px] py-[16px]">
        <DestinationCard
          place={place}
          routeInfo={routeInfo}
          locationStatus={locationStatus}
        />

        <section className="relative h-[176px] shrink-0 overflow-hidden rounded-[16px] border border-[#EAF5FF] bg-[#DFF3FF] shadow-[0_1px_3px_rgba(0,0,0,0.12)]">
          {apiKey ? (
            <APIProvider apiKey={apiKey} language="ko" region="KR">
              <Map
                defaultCenter={mapCenter}
                defaultZoom={15}
                mapId="quespot-route-map"
                disableDefaultUI
                gestureHandling="greedy"
                className="h-full w-full"
              >
                <RouteMapCameraController center={mapCenter} />

                <CurrentLocationMarker currentLocation={currentLocation} />
                <DestinationMarker place={place} />
              </Map>
            </APIProvider>
          ) : (
            <RouteMapFallback place={place} />
          )}
        </section>

        <section className="shrink-0 rounded-[16px] border border-[#EAF5FF] bg-white p-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <h2 className="m-0 text-[16px] font-black leading-[22px] text-[#1C1C3A]">
            지도 앱으로 길찾기
          </h2>

          <div className="mt-[16px] grid grid-cols-2 gap-[12px]">
            <button
              type="button"
              onClick={handleOpenNaverMaps}
              className="flex h-[56px] items-center justify-center gap-[8px] rounded-[16px] bg-[#25D08A] text-[15px] font-black leading-none text-white shadow-[0_4px_10px_rgba(37,208,138,0.2)] transition active:scale-[0.99]"
            >
              <span className="grid h-[18px] w-[18px] place-items-center rounded-full bg-[#00A843] shadow-[inset_0_2px_3px_rgba(255,255,255,0.35)]">
                <span className="h-[8px] w-[8px] rounded-full bg-[#4EE88D]" />
              </span>
              네이버 지도
            </button>

            <button
              type="button"
              onClick={handleOpenGoogleMaps}
              className="flex h-[56px] items-center justify-center gap-[8px] rounded-[16px] bg-[#7EC3F6] text-[15px] font-black leading-none text-white shadow-[0_4px_10px_rgba(91,181,248,0.18)] transition active:scale-[0.99]"
            >
              <span className="grid h-[18px] w-[18px] place-items-center rounded-full bg-[#1565D8] shadow-[inset_0_2px_3px_rgba(255,255,255,0.35)]">
                <span className="h-[8px] w-[8px] rounded-full bg-[#5BB5F8]" />
              </span>
              구글 지도
            </button>
          </div>

          <p className="m-0 mt-[12px] break-keep text-[11px] font-medium leading-[17px] text-[#A2A9B2]">
            구글 지도는 국내 도보 길찾기가 환경에 따라 계산되지 않을 수 있어요.
            이 경우 네이버 지도를 사용하면 됩니다.
          </p>
        </section>

        <button
          type="button"
          onClick={() => navigate(PATH.MISSION_VERIFY)}
          className="h-[56px] shrink-0 rounded-[16px] bg-[#5BB5F8] text-[17px] font-black leading-none text-white shadow-[0_8px_18px_rgba(91,181,248,0.24)] transition active:scale-[0.99]"
        >
          📍 도착! 미션 시작하기
        </button>
      </QuespotPageContent>
    </QuespotPageLayout>
  );
}

function useCurrentLocation(initialLocation: LatLng) {
  const [currentLocation, setCurrentLocation] =
    useState<LatLng>(initialLocation);
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

type RouteMapCameraControllerProps = {
  center: LatLng;
};

function RouteMapCameraController({ center }: RouteMapCameraControllerProps) {
  const map = useMap();

  useEffect(() => {
    map?.panTo(center);
  }, [map, center.lat, center.lng]);

  return null;
}

type DestinationCardProps = {
  place: RoutePlace;
  routeInfo: {
    distance: string;
    duration: string;
    direction: string;
  };
  locationStatus: LocationStatus;
};

function DestinationCard({
  place,
  routeInfo,
  locationStatus,
}: DestinationCardProps) {
  return (
    <section className="shrink-0 rounded-[16px] border border-[#EAF5FF] bg-white p-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.12)]">
      <div className="flex items-center justify-between">
        <p className="m-0 text-[13px] font-medium leading-[18px] text-[#A2A9B2]">
          다음 목적지
        </p>

        <span
          className={[
            "rounded-full px-[10px] py-[5px] text-[11px] font-black leading-none",
            locationStatus === "success"
              ? "bg-[#E8FBF3] text-[#00A85A]"
              : "bg-[#FFF6D9] text-[#F59E0B]",
          ].join(" ")}
        >
          {locationStatus === "success" ? "현재 위치 반영" : "기본 위치 기준"}
        </span>
      </div>

      <div className="mt-[14px] flex items-center gap-[16px]">
        <div className="grid h-[56px] w-[56px] shrink-0 place-items-center rounded-[16px] bg-[#EAF5FF] text-[28px] leading-none">
          {place.emoji}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="m-0 break-keep text-[20px] font-black leading-[28px] text-[#1C1C3A]">
            {place.name}
          </h2>

          <p className="m-0 mt-[4px] text-[14px] font-medium leading-[20px] text-[#A2A9B2]">
            {place.area}
          </p>
        </div>
      </div>

      <div className="mt-[18px] flex items-center gap-[18px]">
        <InfoItem
          icon={<Clock3 size={17} strokeWidth={2.3} />}
          iconClassName="text-[#F59E0B]"
          text={routeInfo.duration}
        />

        <InfoItem
          icon={<MapPin size={17} strokeWidth={2.3} />}
          iconClassName="text-[#FF2D45]"
          text={routeInfo.distance}
        />

        <InfoItem
          icon={<Navigation size={17} strokeWidth={2.3} />}
          iconClassName="text-[#5BB5F8]"
          text={routeInfo.direction}
        />
      </div>
    </section>
  );
}

type InfoItemProps = {
  icon: ReactNode;
  iconClassName: string;
  text: string;
};

function InfoItem({ icon, iconClassName, text }: InfoItemProps) {
  return (
    <span className="flex min-w-0 items-center gap-[6px]">
      <span className={["shrink-0", iconClassName].join(" ")}>{icon}</span>
      <span className="whitespace-nowrap text-[14px] font-black leading-[20px] text-[#6B7280]">
        {text}
      </span>
    </span>
  );
}

type CurrentLocationMarkerProps = {
  currentLocation: LatLng;
};

function CurrentLocationMarker({
  currentLocation,
}: CurrentLocationMarkerProps) {
  return (
    <AdvancedMarker position={currentLocation}>
      <div className="grid h-[22px] w-[22px] place-items-center rounded-full border-[3px] border-white bg-[#3BA7F7] shadow-[0_3px_8px_rgba(8,37,95,0.28)]">
        <span className="h-[7px] w-[7px] rounded-full bg-white" />
      </div>
    </AdvancedMarker>
  );
}

type DestinationMarkerProps = {
  place: RoutePlace;
};

function DestinationMarker({ place }: DestinationMarkerProps) {
  return (
    <AdvancedMarker position={{ lat: place.lat, lng: place.lng }}>
      <div className="relative flex flex-col items-center">
        <div className="grid h-[36px] w-[36px] place-items-center rounded-full bg-[#F59E0B] text-[17px] shadow-[0_6px_12px_rgba(245,158,11,0.28)]">
          {place.emoji}
        </div>

        <span className="mt-[5px] rounded-full bg-white px-[9px] py-[4px] text-[11px] font-black leading-none text-[#1C1C3A] shadow-[0_2px_6px_rgba(8,37,95,0.18)]">
          {getShortPlaceName(place.name)}
        </span>
      </div>
    </AdvancedMarker>
  );
}

type RouteMapFallbackProps = {
  place: RoutePlace;
};

function RouteMapFallback({ place }: RouteMapFallbackProps) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#DFF3FF]">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(91,181,248,0.18)_1px,transparent_1px),linear-gradient(0deg,rgba(91,181,248,0.18)_1px,transparent_1px)] bg-[length:58px_44px]" />

      <div className="absolute left-[30px] top-[30px] h-[78px] w-[64px]">
        <div className="absolute left-0 top-0 h-[48px] w-[4px] rounded-full border-l-[4px] border-dashed border-[#5BB5F8]" />
        <div className="absolute left-0 top-0 h-[4px] w-[48px] rounded-full border-t-[4px] border-dashed border-[#5BB5F8]" />
        <div className="absolute left-[48px] top-[-12px] h-[20px] w-[4px] rounded-full border-l-[4px] border-dashed border-[#5BB5F8]" />
      </div>

      <div className="absolute left-[122px] top-[102px] grid h-[24px] w-[24px] place-items-center rounded-full border-[3px] border-white bg-[#3BA7F7] shadow-[0_3px_8px_rgba(8,37,95,0.24)]">
        <span className="h-[7px] w-[7px] rounded-full bg-white" />
      </div>

      <div className="absolute right-[128px] top-[42px] flex flex-col items-center">
        <div className="grid h-[36px] w-[36px] place-items-center rounded-full bg-[#F59E0B] text-[17px] shadow-[0_6px_12px_rgba(245,158,11,0.28)]">
          {place.emoji}
        </div>

        <span className="mt-[5px] rounded-full bg-white px-[9px] py-[4px] text-[11px] font-black leading-none text-[#1C1C3A] shadow-[0_2px_6px_rgba(8,37,95,0.18)]">
          {getShortPlaceName(place.name)}
        </span>
      </div>
    </div>
  );
}

function getShortPlaceName(name: string) {
  return name
    .replace(" 전통찻집", "")
    .replace(" 포토존", "")
    .replace(" 거리 쇼핑 미션", "")
    .replace(" 포토 미션", "")
    .replace(" 간식 탐방", "")
    .replace(" 야경 산책", "")
    .replace(" 감성 카페", "")
    .replace(" 팝업스토어", "")
    .replace(" 산책 미션", "");
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
