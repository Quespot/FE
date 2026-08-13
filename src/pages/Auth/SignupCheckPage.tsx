import { PATH } from "@/routes/paths";
import { Button } from "../../components/UI";
import { ShieldCheck, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SignupCheckPage() {
  const rows = [
    "전체 동의합니다.",
    "[필수] 서비스 이용약관",
    "[필수] 개인정보 수집 및 이용 동의",
    "[필수] 만 14세 이상입니다.",
  ];
  const navigate = useNavigate();
  return (
    <>
      <section className="terms-screen">
        <h1>약관동의</h1>
        <div className="terms-list">
          {rows.map((row, index) => (
            <label className="check-row" key={row}>
              <span className={index === 0 ? "checked" : ""}>
                {index === 0 ? (
                  <ShieldCheck size={10} strokeWidth={2.8} />
                ) : null}
              </span>
              <strong>{row}</strong>
            </label>
          ))}
        </div>
        <Button
          icon={<UserRound size={16} />}
          onClick={() => navigate(PATH.HOME)}
        >
          동의하고 시작하기
        </Button>
      </section>
    </>
  );
}
