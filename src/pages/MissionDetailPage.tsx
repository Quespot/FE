import {
  Award,
  CalendarClock,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Heart,
  MapPin,
  Navigation,
  Route,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { DeviceFrame, SubHeader } from "../components/DeviceFrame";
import { Button, LocationBadge } from "../components/UI";
import type { MissionCard } from "../data/quespot";

type MissionDetailPageProps = {
  mission: MissionCard;
  onBack?: () => void;
  onStartMission?: () => void;
};

export function MissionDetailPage({ mission, onBack, onStartMission }: MissionDetailPageProps) {
  return (
    <DeviceFrame className="app-device">
      <SubHeader
        title="미션 상세"
        onBack={onBack}
        action={
          <div className="mission-detail-actions">
            <button type="button" aria-label="공유하기">
              <Share2 size={16} strokeWidth={2.4} />
            </button>
            <button type="button" aria-label="찜하기">
              <Heart size={16} strokeWidth={2.4} />
            </button>
          </div>
        }
      />

      <section className="mission-detail-screen">
        <section className={`mission-detail-hero tone-${mission.tone}`}>
          <div>
            <LocationBadge>{mission.category}</LocationBadge>
            <h1>{mission.title}</h1>
            <p>{mission.place}</p>
          </div>
          <span>{mission.visual}</span>
        </section>

        <section className="detail-reward-card">
          <div>
            <Award size={22} strokeWidth={2.4} />
            <span>완료 보상</span>
            <strong>+{mission.points}P</strong>
          </div>
          <div>
            <Clock3 size={22} strokeWidth={2.4} />
            <span>예상 시간</span>
            <strong>{mission.duration}</strong>
          </div>
          <div>
            <ShieldCheck size={22} strokeWidth={2.4} />
            <span>난이도</span>
            <strong>{mission.difficulty}</strong>
          </div>
        </section>

        <section className="detail-card">
          <header>
            <Sparkles size={17} strokeWidth={2.4} />
            <h2>미션 소개</h2>
          </header>
          <p>{mission.description}</p>
        </section>

        <section className="detail-card location-detail-card">
          <header>
            <MapPin size={17} strokeWidth={2.4} />
            <h2>장소 정보</h2>
          </header>
          <strong>{mission.place}</strong>
          <p>{mission.address}</p>
          <div className="mini-map-preview">
            <Route size={44} strokeWidth={1.9} />
            <span>
              <Navigation size={16} strokeWidth={2.6} />
            </span>
            <b>{mission.distance}</b>
          </div>
        </section>

        <section className="detail-card">
          <header>
            <Camera size={17} strokeWidth={2.4} />
            <h2>인증 가이드</h2>
          </header>
          <p>{mission.guide}</p>
        </section>

        <section className="detail-card">
          <header>
            <CalendarClock size={17} strokeWidth={2.4} />
            <h2>진행 순서</h2>
          </header>
          <ol className="mission-step-list">
            {mission.steps.map((step, index) => (
              <li key={step}>
                <span>{index + 1}</span>
                <p>{step}</p>
                {index === mission.steps.length - 1 ? <CheckCircle2 size={18} strokeWidth={2.5} /> : null}
              </li>
            ))}
          </ol>
        </section>

        <section className="review-summary-card">
          <div>
            <Star size={15} fill="#f5b01a" strokeWidth={0} />
            <strong>4.8</strong>
            <span>참여자 만족도</span>
          </div>
          <p>“짧은 시간 안에 지역 분위기를 느낄 수 있어서 좋아요.”</p>
        </section>

        <Button className="detail-start-button" icon={<ChevronRight size={18} strokeWidth={2.6} />} onClick={onStartMission}>
          미션 시작하기
        </Button>
      </section>
    </DeviceFrame>
  );
}
