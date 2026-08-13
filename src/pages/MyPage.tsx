import {
  Archive,
  Bell,
  ChevronRight,
  Heart,
  MapPin,
  Plane,
  Star,
  Trophy,
} from "lucide-react";
import { DeviceFrame } from "../components/DeviceFrame";
import { figmaAssets } from "../data/quespot";
import { useNavigate } from "react-router-dom";
import { PATH } from "@/routes/paths";

const styleTags = ["🏯 역사·문화", "📸 사진 여행", "🍲 맛집 탐방", "🌿 자연"];

export default function MyPage() {
  const navigate = useNavigate();

  return (
    <>
      {" "}
      <section className="my-screen">
        <header className="mobile-topbar my-main-header">
          <div>
            <img src={figmaAssets.mascot} alt="" />
            <strong>Quespot</strong>
          </div>
          <button
            className="notification-button"
            type="button"
            aria-label="알림"
          >
            <Bell size={19} strokeWidth={2.4} />
            <span>3</span>
          </button>
        </header>

        <section className="profile-hero">
          <div className="profile-avatar">
            <img src={figmaAssets.mascot} alt="퀘스티" />
            <button type="button" aria-label="프로필 편집">
              ✏️
            </button>
          </div>
          <h1>Quespot 탐험가</h1>
          <p>@quespotter_001</p>
          <div className="profile-stats">
            <article>
              <strong>2</strong>
              <span>완료 미션</span>
            </article>
            <article>
              <strong>1,240</strong>
              <span>포인트</span>
            </article>
            <article>
              <strong>2</strong>
              <span>배지</span>
            </article>
          </div>
        </section>

        <section className="my-content-stack">
          <button
            className="questy-promo-card"
            onClick={() => navigate(PATH.QUESTY_CUSTOMIZE)}
            type="button"
          >
            <img src={figmaAssets.mascot} alt="퀘스티" />
            <div>
              <strong>마스코트 꾸미기</strong>
              <p>포인트로 아이템을 구매하고 나만의 Quespot을 만들어요</p>
              <span>
                <b>3개 보유</b>
                <em>전설 1개</em>
              </span>
            </div>
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>

          <section className="my-quick-grid" aria-label="내 활동 바로가기">
            <button type="button">
              <Heart size={28} fill="#ef4444" strokeWidth={0} />
              <strong>좋아요</strong>
            </button>
            <button type="button">
              <MapPin size={30} strokeWidth={2.4} />
              <strong>저장 장소</strong>
            </button>
            <button type="button">
              <Archive size={29} strokeWidth={2.3} />
              <strong>아카이브</strong>
            </button>
          </section>

          <section className="my-panel">
            <h2>
              <Plane size={17} strokeWidth={2.5} />내 여행 스타일
            </h2>
            <div className="style-tag-row">
              {styleTags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </section>

          <section className="my-panel progress-panel">
            <h2>
              <Trophy size={17} strokeWidth={2.5} />
              달성 현황
            </h2>
            <div>
              <span>미션 완료</span>
              <strong>2 / 20</strong>
            </div>
            <progress max={20} value={2} />
            <div>
              <span>획득 배지</span>
              <strong>2 / 12</strong>
            </div>
            <progress max={12} value={2} />
          </section>

          <section className="my-panel review-panel">
            <h2>
              <Star size={17} fill="#f5b01a" strokeWidth={0} />
              최근 기록
            </h2>
            <p>인사동 전통찻집에서 “따뜻함” 감상을 남겼어요.</p>
          </section>
        </section>
      </section>
    </>
  );
}
