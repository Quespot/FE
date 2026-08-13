import { useState } from "react";
import {
  Bell,
  Building2,
  Camera,
  ChevronRight,
  ClipboardCheck,
  Compass,
  Heart,
  Leaf,
  MapPin,
  Palette,
  ShoppingBag,
  Star,
  Sunrise,
  Utensils,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { Button, SearchInput, type BottomNavKey } from "../components/UI";
import {
  figmaAssets,
  homeCategories,
  nearbySpots,
  recommendedMissions,
} from "../data/quespot";
import { useNavigate } from "react-router-dom";
import { PATH } from "@/routes/paths";

const categoryIcons: Record<string, LucideIcon> = {
  history: Building2,
  nature: Leaf,
  food: Utensils,
  night: Sunrise,
  photo: Camera,
  activity: Waves,
  shopping: ShoppingBag,
  art: Palette,
};

export default function HomePage() {
  const [showAllMissions, setShowAllMissions] = useState(false);
  const visibleMissions = showAllMissions
    ? recommendedMissions
    : recommendedMissions.slice(0, 2);
  const navigate = useNavigate();
  return (
    <section className="home-screen app-home-screen">
      <header className="mobile-topbar home-main-header">
        <div>
          <img src={figmaAssets.mascot} alt="" />
          <strong>Quespot</strong>
        </div>
        <button className="notification-button" type="button" aria-label="알림">
          <Bell size={19} strokeWidth={2.4} />
          <span>3</span>
        </button>
      </header>

      <section className="home-hero-panel">
        <div>
          <span className="hello-pill">꿀법님 안녕하세요!</span>
          <h1>
            미션으로 떠나는
            <br />
            특별한 여행
          </h1>
          <p>
            Quespot과 함께 일상을
            <br />
            여행으로 바꿔보세요
          </p>
          <Button
            className="hero-button"
            icon={<ChevronRight size={16} strokeWidth={2.6} />}
            onClick={() => navigate(PATH.MISSION_PHOTO)}
          >
            미션 탐색
          </Button>
        </div>
        <img src={figmaAssets.heroMascot} alt="Quespot 캐릭터" />
      </section>

      <SearchInput placeholder="미션 · 장소 · 지역을 검색해보세요" />

      <section className="home-stat-card" aria-label="활동 요약">
        <article>
          <strong>2개</strong>
          <span>완료 미션</span>
        </article>
        <article>
          <strong>350P</strong>
          <span>누적 보상</span>
        </article>
        <article>
          <strong>2개</strong>
          <span>획득 배지</span>
        </article>
        <article>
          <strong>2개</strong>
          <span>스탬프</span>
        </article>
      </section>

      <section className="home-section category-section">
        <h2>카테고리</h2>
        <div className="category-grid">
          {homeCategories.map((category) => {
            const Icon = categoryIcons[category.id] ?? Compass;

            return (
              <button
                className={`category-card tone-${category.tone}`}
                key={category.id}
                type="button"
              >
                <span>
                  <Icon size={26} strokeWidth={2.3} />
                </span>
                <strong>{category.label}</strong>
              </button>
            );
          })}
        </div>
      </section>

      <section className="home-section recommended-section">
        <div className="section-title-row">
          <h2>추천 미션</h2>
          <button
            onClick={() => setShowAllMissions((value) => !value)}
            type="button"
          >
            {showAllMissions ? "접기" : "전체보기"}{" "}
            <ChevronRight size={15} strokeWidth={2.6} />
          </button>
        </div>
        <div
          className={`recommended-grid ${showAllMissions ? "is-expanded" : ""}`}
        >
          {visibleMissions.map((mission) => (
            <article
              className="mission-card"
              key={mission.id}
              onClick={() => navigate(PATH.MISSION_DETAIL)}
            >
              <div className={`mission-visual tone-${mission.tone}`}>
                <button
                  onClick={(event) => event.stopPropagation()}
                  type="button"
                  aria-label={`${mission.title} 찜하기`}
                >
                  <Heart size={15} strokeWidth={2.3} />
                </button>
                <span>{mission.visual}</span>
              </div>
              <div className="mission-card-body">
                <span className="mission-chip">{mission.category}</span>
                <strong>{mission.title}</strong>
                <footer>
                  <span>
                    <MapPin size={12} strokeWidth={2.4} />
                    {mission.distance}
                  </span>
                  <b>+{mission.points}P</b>
                </footer>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section nearby-section">
        <div className="section-title-row">
          <h2>
            <MapPin size={15} fill="#ef4444" strokeWidth={2.2} />내 주변 스팟
          </h2>
          <button onClick={() => navigate(PATH.MAP)} type="button">
            지도보기 <ChevronRight size={15} strokeWidth={2.6} />
          </button>
        </div>
        <div className="spot-list">
          {nearbySpots.map((spot) => (
            <article className={spot.done ? "is-done" : ""} key={spot.id}>
              <span className="spot-icon">
                <MapPin size={22} strokeWidth={2.4} />
                {spot.done ? (
                  <ClipboardCheck
                    className="spot-check"
                    size={15}
                    strokeWidth={2.5}
                  />
                ) : null}
                {spot.badge ? <b>{spot.badge}</b> : null}
              </span>
              <div className="spot-info">
                <strong>{spot.name}</strong>
                <p>
                  {spot.distance}
                  <i />
                  {spot.status === "완료" ? (
                    <em>완료</em>
                  ) : (
                    `미션 ${spot.missionCount}개`
                  )}
                </p>
              </div>
              <span className="spot-rating">
                <Star size={12} fill="#f5b01a" strokeWidth={0} />
                {spot.rating}
              </span>
              <button
                onClick={
                  spot.done
                    ? () => navigate(PATH.MISSION_RECORD)
                    : () => navigate(PATH.MISSION_DETAIL)
                }
                type="button"
                aria-label={`${spot.name} 열기`}
              >
                <ChevronRight size={17} strokeWidth={2.6} />
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="bonus-banner">
        <img src={figmaAssets.mascot} alt="" />
        <div>
          <strong>소도시 미션에서 추가 보너스 포인트!</strong>
          <p>인구감소지역 미션 완료 시 +20% 보너스</p>
        </div>
      </section>
    </section>
  );
}
