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
      <section className="flex flex-col py-6 px-5 gap-6 min-h-[100%] p-[36px_24px_30px] gap-7">
        <h1 className="m-[16px_0_12px] text-[var(--navy)] text-sm leading-[21px] text-center m-[8px_0_18px] text-2xl leading-tight">약관동의</h1>
        <div className="overflow-hidden border-[1px_solid_#dbe8f8] rounded-[14px] bg-white rounded-[20px]">
          {rows.map((row, index) => (
            <label className="flex items-center gap-2 min-h-[42px] p-[10px_0] [border-bottom:1px_solid_#dbe8f8] text-[10px] text-[var(--navy)] last:[border-bottom:0] min-h-[58px] py-3 px-1 text-sm" key={row}>
              <span className={index === 0 ? "border-[var(--primary)] bg-[var(--primary)] after:[content:''] after:w-[5px] after:h-[5px] after:rounded-full after:bg-white text-white after:hidden" : ""}>
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

