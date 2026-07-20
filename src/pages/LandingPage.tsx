import { courseCards, figmaAssets } from "../data/quespot";
import { Button, WireImage } from "../components/UI";

export function LandingPage() {
  return (
    <main className="landing-page">
      <header className="landing-header">
        <strong>Quespot</strong>
        <nav aria-label="주요 메뉴">
          <a>홈</a>
          <a>코스</a>
          <a>미션</a>
          <a>아카이브</a>
          <a>마이페이지</a>
        </nav>
        <Button className="landing-start">시작하기</Button>
      </header>

      <section className="landing-hero">
        <div>
          <h1>
            미션으로 떠나는
            <br />
            특별한 여행
          </h1>
          <p>
            전국 방방곡곡의 숨은 명소를 발견하고
            <br />
            미션을 수행하며 보상을 받아보세요.
          </p>
          <Button>지금 시작하기 →</Button>
        </div>
        <img className="hero-mascot" src={figmaAssets.heroMascot} alt="Quespot 캐릭터" />
      </section>

      <section className="course-section">
        <h2>추천 미션 코스</h2>
        <div className="course-grid">
          {courseCards.map((course) => (
            <article className="course-card" key={course}>
              <WireImage label="" />
              <strong>{course}</strong>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
