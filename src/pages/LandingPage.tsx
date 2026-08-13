import { courseCards, figmaAssets } from "../data/quespot";
import { Button, WireImage } from "../components/UI";
import { useNavigate } from "react-router-dom";
import { PATH } from "@/routes/paths";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <main className="w-[min(100%,_980px)] overflow-hidden border-[1px_solid_var(--border)] rounded-2xl bg-[var(--surface)] [box-shadow:0_8px_32px_rgba(22,_115,_248,_0.12)]">
      <header className="flex items-center justify-between min-h-[68px] p-[0_34px] [border-bottom:1px_solid_#dbe8f8] max-[820px]:gap-4 max-[820px]:p-[0_20px]">
        <strong className="text-[var(--primary)] text-[22px] font-black">Quespot</strong>
        <nav className="flex gap-[30px] text-[var(--navy)] text-sm font-bold max-[820px]:hidden" aria-label="주요 메뉴">
          <a>홈</a>
          <a>코스</a>
          <a>미션</a>
          <a>아카이브</a>
          <a>마이페이지</a>
        </nav>
        <Button className="w-[auto] min-w-[78px] h-[46px] p-[0_16px]">시작하기</Button>
      </header>

      <section className="flex items-center justify-between min-h-[280px] p-[40px_58px] bg-[var(--sky-200)] max-[820px]:py-7 px-6">
        <div>
          <h1 className="m-0 text-[var(--navy)] text-[44px] leading-[1.2] tracking-[0] max-[820px]:text-[32px]">
            미션으로 떠나는
            <br />
            특별한 여행
          </h1>
          <p className="m-[20px_0_28px] text-[rgba(8,_37,_95,_0.72)] text-base leading-[1.65]">
            전국 방방곡곡의 숨은 명소를 발견하고
            <br />
            미션을 수행하며 보상을 받아보세요.
          </p>
          <Button onClick={() => navigate(PATH.LOGIN)}>지금 시작하기 →</Button>
        </div>
        <img
          className="w-[200px] h-[200px] object-contain bg-white max-[820px]:w-[110px] max-[820px]:h-[110px]"
          src={figmaAssets.heroMascot}
          alt="Quespot 캐릭터"
        />
      </section>

      <section className="p-[28px_44px_34px]">
        <h2 className="m-[0_0_18px] text-[var(--navy)] text-xl">추천 미션 코스</h2>
        <div className="grid [grid-template-columns:repeat(4,_minmax(0,_1fr))] gap-[18px] max-[820px]:[grid-template-columns:1fr]">
          {courseCards.map((course) => (
            <article className="overflow-hidden min-h-[122px] border-[1px_solid_var(--border)] rounded-[14px] bg-white" key={course}>
              <WireImage label="" />
              <strong className="block p-3 text-[var(--navy)] text-xs">{course}</strong>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

