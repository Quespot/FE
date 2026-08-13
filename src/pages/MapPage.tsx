import {
  Bell,
  Crosshair,
  LocateFixed,
  MapPin,
  Navigation,
  Route,
  Search,
  Star,
  Target,
} from "lucide-react";
import { DeviceFrame, SubHeader } from "../components/DeviceFrame";
import { Button, LocationBadge } from "../components/UI";
import { useNavigate } from "react-router-dom";
import { PATH } from "@/routes/paths";

const mapSpots = [
  {
    name: "인사동 전통찻집",
    area: "종로구 인사동",
    point: "240P",
    className: "pin-a",
  },
  {
    name: "북촌 골목 산책",
    area: "북촌 한옥마을",
    point: "180P",
    className: "pin-b",
  },
  {
    name: "청계천 포토존",
    area: "청계광장",
    point: "160P",
    className: "pin-c",
  },
];

export default function MapPage() {
  const navigate = useNavigate();
  return (
    <>
      <SubHeader
        title="미션 지도"
        onBack={() => navigate(-1)}
        action={
          <button className="hint-action" type="button">
            <LocateFixed size={14} strokeWidth={2.5} />
            현재 위치
          </button>
        }
      />

      <section className="map-screen">
        <header className="map-search-row">
          <label>
            <Search size={16} strokeWidth={2.4} />
            <input placeholder="지역, 명소, 미션 검색" />
          </label>
          <button type="button" aria-label="알림">
            <Bell size={18} strokeWidth={2.4} />
          </button>
        </header>

        <section className="mission-map" aria-label="종로 주변 미션 지도">
          <div className="map-grid-lines" />
          <div className="map-route route-one" />
          <div className="map-route route-two" />
          <span className="map-pin pin-a">
            <MapPin size={18} fill="currentColor" strokeWidth={2.2} />
          </span>
          <span className="map-pin pin-b">
            <Target size={17} strokeWidth={2.6} />
          </span>
          <span className="map-pin pin-c">
            <Star size={17} fill="currentColor" strokeWidth={2.2} />
          </span>
          <div className="current-location">
            <Crosshair size={18} strokeWidth={2.5} />
          </div>
          <article className="map-floating-card">
            <LocationBadge>가까운 미션</LocationBadge>
            <strong>인사동 전통찻집</strong>
            <p>현재 위치에서 도보 8분</p>
          </article>
        </section>

        <section className="nearby-panel">
          <div className="section-title-row">
            <h2>근처 미션</h2>
            <span>3개 발견</span>
          </div>
          <div className="nearby-list">
            {mapSpots.map((spot, index) => (
              <article key={spot.name}>
                <span className={`nearby-icon ${spot.className}`}>
                  {index === 0 ? (
                    <MapPin size={18} strokeWidth={2.5} />
                  ) : index === 1 ? (
                    <Route size={18} strokeWidth={2.5} />
                  ) : (
                    <Navigation size={18} strokeWidth={2.5} />
                  )}
                </span>
                <div>
                  <strong>{spot.name}</strong>
                  <small>{spot.area}</small>
                </div>
                <em>{spot.point}</em>
              </article>
            ))}
          </div>
        </section>

        <Button
          className="home-main-cta"
          icon={<Navigation size={18} strokeWidth={2.4} />}
          onClick={() => navigate(PATH.MISSION_PHOTO)}
        >
          선택한 미션 시작하기
        </Button>
      </section>
    </>
  );
}
