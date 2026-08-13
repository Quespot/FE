import { useNavigate } from "react-router-dom";
import { Button } from "../../components/UI";
import { figmaAssets } from "../../data/quespot";
import { Chrome, LogIn, MapPinned } from "lucide-react";
import { PATH } from "@/routes/paths";

export default function LoginPage() {
  const navigate = useNavigate();
  return (
    <>
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
          className="auth-text-button"
          onClick={() => navigate(PATH.SIGNUP)}
          type="button"
        >
          계정이 없으신가요? <b>회원가입</b>
        </button>
      </section>
    </>
  );
}
