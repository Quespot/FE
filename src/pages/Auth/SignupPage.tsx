import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, Check, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PATH } from "@/routes/paths";
import { confirmEmailVerification, requestEmailVerification, signup } from "@/api/auth";

type VerificationState = "idle" | "sent" | "verified";

const fieldClass = "type-body2 h-11 min-w-0 w-full rounded-2xl border border-transparent bg-[#eaf5ff] px-4 text-[#252743] outline-none transition placeholder:text-[#a0a9b5] focus:border-[#5bb5f8]/75 focus:bg-[#f9fcff] focus:ring-3 focus:ring-[#5bb5f8]/15";
const actionClass = "type-caption3 rounded-[14px] bg-[#d8eeff] text-[#349fe9] disabled:cursor-default disabled:bg-[#e7ebf0] disabled:text-[#adb4be] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#5bb5f8]/30";

export default function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationState, setVerificationState] = useState<VerificationState>("idle");
  const [expiresInSeconds, setExpiresInSeconds] = useState(0);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordsMatch = password.length >= 8 && password === passwordConfirm;
  const canContinue = verificationState === "verified" && passwordsMatch;

  useEffect(() => {
    if (verificationState !== "sent" || expiresInSeconds <= 0) return;
    const timer = window.setInterval(() => setExpiresInSeconds((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [verificationState, expiresInSeconds]);

  useEffect(() => {
    if (verificationState === "sent" && expiresInSeconds === 0) {
      setError("인증번호가 만료됐습니다. 인증번호를 다시 요청해주세요.");
    }
  }, [expiresInSeconds, verificationState]);

  const requestVerification = async () => {
    if (!isEmailValid || isRequesting) return;
    setError("");
    setIsRequesting(true);
    setVerificationCode("");
    try {
      const result = await requestEmailVerification(email.trim());
      setExpiresInSeconds((result.expiresInMinutes || 10) * 60);
      setVerificationState("sent");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "인증번호 발송에 실패했습니다.");
    } finally {
      setIsRequesting(false);
    }
  };

  const verifyCode = async () => {
    if (verificationCode.length !== 6 || expiresInSeconds === 0 || isVerifying) return;
    setError("");
    setIsVerifying(true);
    try {
      const result = await confirmEmailVerification(email.trim(), verificationCode);
      if (!result.verified) throw new Error("이메일 인증을 완료하지 못했습니다.");
      setVerificationState("verified");
    } catch (verificationError) {
      setError(verificationError instanceof Error ? verificationError.message : "인증번호 확인에 실패했습니다.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canContinue || isSubmitting) return;
    setError("");
    setIsSubmitting(true);
    try {
      await signup(email.trim(), password, passwordConfirm);
      navigate(PATH.LOGIN, { replace: true, state: { signupComplete: true, email: email.trim() } });
    } catch (signupError) {
      setError(signupError instanceof Error ? signupError.message : "회원가입에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const minutes = String(Math.floor(expiresInSeconds / 60)).padStart(2, "0");
  const seconds = String(expiresInSeconds % 60).padStart(2, "0");

  return (
    <main className="min-h-dvh overflow-x-hidden bg-[#f4f7fd] text-[#20223d]">
      <header className="sticky top-0 z-10 flex h-[88px] items-center bg-white/95 px-5 pt-[22px] backdrop-blur-xl">
        <button className="grid h-[34px] w-[34px] place-items-center rounded-full bg-[#edf7ff] text-[#5bb5f8]" aria-label="로그인 화면으로 돌아가기" onClick={() => navigate(PATH.LOGIN)} type="button">
          <ArrowLeft aria-hidden="true" size={20} strokeWidth={2.2} />
        </button>
        <h1 className="type-label1 ml-3">회원가입</h1>
      </header>

      <form className="flex flex-col gap-4 px-5 pb-[max(34px,env(safe-area-inset-bottom))] pt-[22px]" onSubmit={handleSubmit}>
        <div className="grid gap-1.5">
          <label className="type-caption3 text-[#566171]" htmlFor="signup-email">이메일 주소</label>
          <div className="grid grid-cols-[minmax(0,1fr)_82px] gap-2">
            <input className={fieldClass} aria-describedby="email-verification-status" autoComplete="email" id="signup-email" inputMode="email" onChange={(event) => { setEmail(event.target.value); setVerificationState("idle"); }} placeholder="이메일 주소" required type="email" value={email} />
            <button className={actionClass} disabled={!isEmailValid || verificationState === "verified" || isRequesting} onClick={requestVerification} type="button">
              {verificationState === "verified" ? <Check className="mx-auto" aria-hidden="true" size={16} /> : isRequesting ? "발송 중" : "인증 요청"}
            </button>
          </div>
        </div>

        {verificationState !== "idle" ? (
          <div className="-mt-[7px] rounded-2xl border border-[#d8edfc] bg-white/70 p-3">
            {verificationState === "sent" ? (
              <>
                <p className="mb-2 text-[10.5px] leading-[15px] text-[#7e8794]" id="email-verification-status">이메일로 보낸 6자리 인증번호를 입력해주세요.</p>
                <div className="grid grid-cols-[minmax(0,1fr)_62px] gap-2">
                  <div className="relative">
                    <input className={`${fieldClass} pr-[54px]`} aria-label="이메일 인증번호" autoComplete="one-time-code" inputMode="numeric" maxLength={6} onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, ""))} placeholder="인증번호 6자리" value={verificationCode} />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-[#e67c7c]">{minutes}:{seconds}</span>
                  </div>
                  <button className={actionClass} disabled={verificationCode.length !== 6 || expiresInSeconds === 0 || isVerifying} onClick={verifyCode} type="button">{isVerifying ? "확인 중" : "확인"}</button>
                </div>
                <button className="ml-auto mt-2 flex items-center gap-1 bg-transparent p-0 text-[10px] text-[#8c96a4]" onClick={requestVerification} type="button"><RefreshCw aria-hidden="true" size={12} /> 인증번호 재전송</button>
              </>
            ) : (
              <p className="m-0 flex items-center gap-1.5 text-[11px] font-semibold text-[#2ca777]" id="email-verification-status"><Check aria-hidden="true" size={15} strokeWidth={2.6} /> 이메일 인증이 완료됐어요.</p>
            )}
          </div>
        ) : null}

        <div className="grid gap-1.5">
          <label className="type-caption3 text-[#566171]" htmlFor="signup-password">비밀번호 <span className="font-medium text-[#939aa5]">(8자 이상)</span></label>
          <input className={fieldClass} autoComplete="new-password" id="signup-password" minLength={8} onChange={(event) => setPassword(event.target.value)} placeholder="비밀번호 (8자 이상)" required type="password" value={password} />
        </div>

        <div className="grid gap-1.5">
          <label className="type-caption3 text-[#566171]" htmlFor="signup-password-confirm">비밀번호 확인</label>
          <input className={`${fieldClass} aria-invalid:border-[#f39b9b]`} aria-invalid={passwordConfirm.length > 0 && !passwordsMatch} autoComplete="new-password" id="signup-password-confirm" onChange={(event) => setPasswordConfirm(event.target.value)} placeholder="비밀번호를 한 번 더 입력해주세요" required type="password" value={passwordConfirm} />
          {passwordConfirm.length > 0 && !passwordsMatch ? <small className="ml-1 text-[10px] text-[#e46f6f]">비밀번호가 일치하지 않아요.</small> : null}
        </div>

        {error ? <p className="px-1 text-[11px] leading-4 text-[#e46f6f]" role="alert">{error}</p> : null}
        <button className="type-body6 mt-0.5 flex h-12 w-full items-center justify-center rounded-[15px] bg-[#5bb5f8] text-white shadow-[0_6px_14px_rgba(91,181,248,0.23)] transition active:translate-y-px disabled:cursor-default disabled:opacity-50 disabled:shadow-none" disabled={!canContinue || isSubmitting} type="submit">{isSubmitting ? "가입 중..." : "회원가입 완료"}</button>
      </form>
    </main>
  );
}
