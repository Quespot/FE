import { useNavigate } from "react-router-dom";
import { Button } from "../../components/UI";
import { figmaAssets } from "../../data/quespot";
import { Chrome, LogIn, MapPinned } from "lucide-react";
import { PATH } from "@/routes/paths";

export default function LoginPage() {
  const navigate = useNavigate();
  return (
    <>
      <section className="flex flex-col py-6 px-5 items-center text-center min-h-[100%] p-[24px_22px_30px]">
        <header className="flex items-center gap-2.5 text-[var(--primary)]">
          <span className="grid w-10 h-10 place-items-center rounded-2xl bg-[var(--sky-100)]">
            <MapPinned size={22} strokeWidth={2.6} />
          </span>
          <strong className="text-[22px] font-black">Quespot</strong>
        </header>

        <div className="flex flex-col items-center mt-[42px] rounded-[28px] p-[26px_22px_28px] bg-[linear-gradient(169deg,_#eaf5ff_0%,_#c8e8ff_100%)] text-center">
          <img className="w-24 h-24 object-contain w-[148px] h-[148px] object-contain" src={figmaAssets.mascot} alt="Quespot 캐릭터" />
          <h1 className="m-[28px_0_0] text-[var(--primary)] text-[22px] leading-[33px] m-[18px_0_10px] text-[var(--navy)] text-[25px] leading-[1.24]">미션으로 떠나는 여행</h1>
          <p className="m-[0_0_18px] text-[var(--muted)] text-[9px] font-bold leading-normal max-w-[260px] m-0 text-[#5a6b84] text-sm leading-relaxed">숨은 장소를 발견하고, 인증 미션을 완료하며 보상을 모아보세요.</p>
        </div>

        <div className="grid gap-2 w-full gap-2.5 mt-[auto]">
          <Button
            icon={<Chrome size={18} strokeWidth={2.4} />}
            onClick={() => navigate(PATH.HOME)}
            variant="secondary"
          >
            Google로 로그인
          </Button>
          <Button
            icon={<LogIn size={18} strokeWidth={2.4} />}
            onClick={() => navigate(PATH.HOME)}
          >
            로그인
          </Button>
        </div>

        <button
          className="mt-[18px] bg-transparent text-[var(--muted)] text-[13px]"
          onClick={() => navigate(PATH.SIGNUP)}
          type="button"
        >
          계정이 없으신가요? <b className="text-[var(--primary)] text-[var(--primary)]">회원가입</b>
        </button>
      </section>
    </>
  );
}

