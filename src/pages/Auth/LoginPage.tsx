import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import questyLogin from "../../assets/questy.svg";
import googleLogin from "../../assets/google_login.svg";
import kakaoLogin from "../../assets/kakao_login.svg";
import { PATH } from "@/routes/paths";
import { PROFILE_SETUP_KEY } from "@/constants/onboarding";

const inputClass = "type-body2 h-11 w-full rounded-2xl border border-transparent bg-[#eaf5ff] px-4 text-[#252743] outline-none transition placeholder:text-[#8b939e] focus:border-[#5bb5f8]/70 focus:bg-[#f7fbff] focus:ring-3 focus:ring-[#5bb5f8]/15";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const moveAfterLogin = () => {
    const hasProfile = localStorage.getItem(PROFILE_SETUP_KEY) === "true";
    navigate(hasProfile ? PATH.HOME : PATH.SIGNUP_CHECK);
  };

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    moveAfterLogin();
  };

  return (
    <main className="grid min-h-dvh grid-rows-[minmax(330px,43%)_1fr] overflow-hidden bg-[#f4f7fd] text-[#20223d]">
      <section className="flex flex-col items-center justify-center bg-[linear-gradient(160deg,#c8e8ff_8.49%,#eaf5ff_92%)] px-5 pb-7 pt-[38px] text-center" aria-labelledby="login-brand">
        <img className="h-[clamp(118px,34vw,147px)] w-[clamp(118px,34vw,147px)] object-contain" src={questyLogin} alt="여행 가방을 든 Quespot 마스코트" />
        <h1 className="type-brand -mt-0.5 mb-0.5 text-[#5bb5f8]" id="login-brand">Quespot</h1>
        <p className="type-caption2 m-0 text-[#777b81]">
          최선으로 떠나는 특별한 여행<br />지금 바로 시작해보세요 <span aria-hidden="true">✈️</span>
        </p>
      </section>

      <section className="flex flex-col bg-[#f4f7fd] px-5 pb-[max(32px,env(safe-area-inset-bottom))] pt-5" aria-label="로그인">
        <form className="grid gap-2.5" onSubmit={handleLogin}>
          <label className="sr-only" htmlFor="login-email">이메일 주소</label>
          <input className={inputClass} autoComplete="email" id="login-email" inputMode="email" onChange={(event) => setEmail(event.target.value)} placeholder="이메일 주소" type="email" value={email} />
          <label className="sr-only" htmlFor="login-password">비밀번호</label>
          <input className={inputClass} autoComplete="current-password" id="login-password" onChange={(event) => setPassword(event.target.value)} placeholder="비밀번호" type="password" value={password} />
          <button className="type-body6 mt-0.5 h-11 w-full rounded-xl bg-[#5bb5f8] text-white shadow-[0_5px_14px_rgba(91,181,248,0.18)] transition active:translate-y-px focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#5bb5f8]/30" type="submit">로그인</button>
        </form>

        <div className="my-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3" aria-hidden="true">
          <span className="h-px bg-[#e1edf7]" /><em className="text-[11px] not-italic leading-4 text-[#a2a9b2]">또는</em><span className="h-px bg-[#e1edf7]" />
        </div>

        <div className="flex items-center justify-center gap-4" aria-label="소셜 로그인">
          <button className="h-11 w-11 rounded-full bg-transparent p-0 transition hover:-translate-y-0.5 active:scale-95 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#5bb5f8]/30" aria-label="구글 계정으로 로그인" onClick={moveAfterLogin} type="button">
            <img className="h-11 w-11" src={googleLogin} alt="" />
          </button>
          <button className="h-11 w-11 rounded-full bg-transparent p-0 transition hover:-translate-y-0.5 active:scale-95 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#5bb5f8]/30" aria-label="카카오 계정으로 로그인" onClick={moveAfterLogin} type="button">
            <img className="h-11 w-11" src={kakaoLogin} alt="" />
          </button>
        </div>

        <nav className="mt-3 flex items-center justify-center gap-3" aria-label="계정 도움말">
          <button className="bg-transparent p-0 text-[11px] font-medium leading-4 text-[#a2a9b2]" type="button">비밀번호 찾기</button>
          <i className="h-3 w-px bg-[#c8e8ff]" aria-hidden="true" />
          <button className="bg-transparent p-0 text-[11px] font-medium leading-4 text-[#5bb5f8]" onClick={() => navigate(PATH.SIGNUP)} type="button">회원가입 </button>
        </nav>
      </section>
    </main>
  );
}
