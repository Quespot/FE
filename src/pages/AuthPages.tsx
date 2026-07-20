import { DeviceFrame } from "../components/DeviceFrame";
import { Button, TextField } from "../components/UI";
import { figmaAssets } from "../data/quespot";
import { Chrome, LogIn, Mail, MapPinned, ShieldCheck, UserRound } from "lucide-react";

type LoginPageProps = {
  onLogin?: () => void;
  onSignup?: () => void;
};

export function LoginPage({ onLogin, onSignup }: LoginPageProps) {
  return (
    <DeviceFrame className="auth-device">
      <section className="login-screen">
        <header className="login-brand">
          <span>
            <MapPinned size={22} strokeWidth={2.6} />
          </span>
          <strong>Quespot</strong>
        </header>

        <div className="login-hero-card">
          <img src={figmaAssets.mascot} alt="Quespot 캐릭터" />
          <h1>미션으로 떠나는 여행</h1>
          <p>숨은 장소를 발견하고, 인증 미션을 완료하며 보상을 모아보세요.</p>
        </div>

        <div className="auth-actions">
          <Button icon={<Chrome size={18} strokeWidth={2.4} />} onClick={onLogin} variant="secondary">
            Google로 로그인
          </Button>
          <Button icon={<LogIn size={18} strokeWidth={2.4} />} onClick={onLogin}>
            로그인
          </Button>
        </div>

        <button className="auth-text-button" onClick={onSignup} type="button">
          계정이 없으신가요? <b>회원가입</b>
        </button>
      </section>
    </DeviceFrame>
  );
}

export function SignupPage() {
  return (
    <DeviceFrame className="auth-device">
      <section className="signup-screen">
        <h1>회원가입</h1>
        <TextField label="이메일" placeholder="example@email.com" type="email" />
        <TextField label="비밀번호" placeholder="••••••••" type="password" />
        <TextField label="비밀번호 확인" placeholder="••••••••" type="password" />
        <TextField label="닉네임" placeholder="닉네임을 입력하세요" />
        <Button icon={<Mail size={16} />}>다음</Button>
        <small>
          이미 계정이 있으신가요? <b>로그인</b>
        </small>
      </section>
    </DeviceFrame>
  );
}

export function TermsPage() {
  const rows = ["전체 동의합니다.", "[필수] 서비스 이용약관", "[필수] 개인정보 수집 및 이용 동의", "[필수] 만 14세 이상입니다."];

  return (
    <DeviceFrame className="auth-device">
      <section className="terms-screen">
        <h1>약관동의</h1>
        <div className="terms-list">
          {rows.map((row, index) => (
            <label className="check-row" key={row}>
              <span className={index === 0 ? "checked" : ""}>
                {index === 0 ? <ShieldCheck size={10} strokeWidth={2.8} /> : null}
              </span>
              <strong>{row}</strong>
            </label>
          ))}
        </div>
        <Button icon={<UserRound size={16} />}>동의하고 시작하기</Button>
      </section>
    </DeviceFrame>
  );
}
