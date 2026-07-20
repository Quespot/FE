import { Bell, ChevronRight, Menu, Sparkles, Target, Trophy } from "lucide-react";
import { BottomNav, Button, LocationBadge, SearchInput, WireImage, type BottomNavKey } from "../components/UI";
import { DeviceFrame } from "../components/DeviceFrame";
import { courseCards, figmaAssets } from "../data/quespot";

type HomePageProps = {
  onNavigate?: (screen: BottomNavKey) => void;
  onOpenRecord?: () => void;
  onStartMission?: () => void;
};

export function HomePage({ onNavigate, onOpenRecord, onStartMission }: HomePageProps) {
  return (
    <DeviceFrame className="app-device home-device">
      <section className="home-screen app-home-screen">
        <header className="mobile-topbar">
          <div>
            <strong>Quespot</strong>
            <small>서울 종로구</small>
          </div>
          <div className="topbar-actions">
            <button type="button" aria-label="알림">
              <Bell size={19} strokeWidth={2.4} />
            </button>
            <button type="button" aria-label="메뉴">
              <Menu size={20} strokeWidth={2.4} />
            </button>
          </div>
        </header>

        <section className="home-hero-card">
          <div>
            <LocationBadge>이번 주 추천</LocationBadge>
            <h1>
              오늘은 어떤 미션을
              <br />
              완료해볼까요?
            </h1>
            <p>주변의 숨은 장소를 발견하고 인증 기록을 남겨보세요.</p>
          </div>
          <img src={figmaAssets.heroMascot} alt="Quespot 캐릭터" />
        </section>

        <SearchInput placeholder="지역, 코스, 명소를 찾아보세요." />

        <section className="summary-grid" aria-label="활동 요약">
          <article>
            <Sparkles size={18} strokeWidth={2.4} />
            <span>진행 미션</span>
            <strong>3개</strong>
          </article>
          <article>
            <Trophy size={18} strokeWidth={2.4} />
            <span>누적 보상</span>
            <strong>1,240P</strong>
          </article>
        </section>

        <section className="mission-list-section">
          <div className="section-title-row">
            <h2>추천 미션 코스</h2>
            <button onClick={onOpenRecord} type="button">
              기록 보기
            </button>
          </div>
          <div className="mobile-course-list">
            {courseCards.slice(0, 3).map((course, index) => (
              <article className="mobile-course-card" key={course}>
                <WireImage label={index === 0 ? "인기 코스" : "코스 이미지"} />
                <div>
                  <LocationBadge>{index === 0 ? "전북 전주" : index === 1 ? "강원 강릉" : "제주"}</LocationBadge>
                  <strong>{course}</strong>
                  <p>{index === 0 ? "한옥길을 따라 3개의 인증 미션을 완료해요." : "사진 인증과 감상 기록을 남기는 코스예요."}</p>
                </div>
                <button onClick={onStartMission} type="button" aria-label={`${course} 시작`}>
                  <ChevronRight size={18} strokeWidth={2.6} />
                </button>
              </article>
            ))}
          </div>
        </section>

        <Button className="home-main-cta" icon={<Target size={18} strokeWidth={2.4} />} onClick={onStartMission}>
          첫 미션 시작하기
        </Button>
      </section>
      <BottomNav active="home" onSelect={onNavigate} />
    </DeviceFrame>
  );
}
