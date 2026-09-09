import { useState } from "react";
import { ArrowLeft, Check, ChevronRight, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PATH } from "@/routes/paths";

const terms = [
  { id: "service", label: "서비스 이용약관", required: true },
  { id: "privacy", label: "개인정보 수집 및 이용", required: true },
  { id: "age", label: "만 14세 이상 확인", required: true },
  { id: "marketing", label: "혜택 및 마케팅 정보 수신", required: false },
] as const;

const CheckCircle = () => <span className="grid h-[21px] w-[21px] shrink-0 place-items-center rounded-full border-[1.5px] border-[#ced9e4] bg-white text-white peer-checked:border-[#5bb5f8] peer-checked:bg-[#5bb5f8]"><Check aria-hidden="true" size={14} strokeWidth={3} /></span>;

export default function SignupCheckPage() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const allChecked = terms.every((term) => checked[term.id]);
  const requiredChecked = terms.filter((term) => term.required).every((term) => checked[term.id]);

  const toggleAll = () => {
    const nextValue = !allChecked;
    setChecked(Object.fromEntries(terms.map((term) => [term.id, nextValue])));
  };

  return (
    <main className="min-h-dvh bg-[#f4f7fd] text-[#20223d]">
      <header className="sticky top-0 z-10 flex h-[88px] items-center bg-white/95 px-5 pt-[22px] backdrop-blur-xl">
        <button className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-[#edf7ff] text-[#5bb5f8]" aria-label="이전 화면으로 돌아가기" onClick={() => navigate(-1)} type="button"><ArrowLeft aria-hidden="true" size={20} strokeWidth={2.2} /></button>
        <div className="ml-3 flex w-full items-center justify-between"><h1 className="type-label1">약관동의</h1><span className="type-body4 rounded-full bg-[#edf7ff] px-[9px] py-1 text-[#55aceb]">1 / 2</span></div>
      </header>

      <section className="px-5 pb-[max(34px,env(safe-area-inset-bottom))] pt-7">
        <div>
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#dff2ff] text-[#5bb5f8]"><ShieldCheck aria-hidden="true" size={25} strokeWidth={2.1} /></span>
          <h2 className="type-h3 mb-[7px] mt-[17px]">Quespot을 시작하기 전에<br />약관을 확인해주세요</h2>
          <p className="type-caption2 text-[#929ba8]">필수 항목에 동의하면 프로필을 만들 수 있어요.</p>
        </div>

        <label className="mt-7 grid cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-[11px] rounded-[17px] border border-[#cfe9fc] bg-[#eaf6ff] px-4 py-[17px] has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-[#5bb5f8]/30">
          <input className="peer sr-only" checked={allChecked} onChange={toggleAll} type="checkbox" />
          <CheckCircle /><strong className="type-body6">전체 동의</strong><small className="type-body5 text-[#8e9ba9]">선택 항목도 포함됩니다</small>
        </label>

        <div className="mt-3.5 overflow-hidden rounded-[17px] border border-[#e0e9f2] bg-white">
          {terms.map((term) => (
            <div className="flex min-h-14 items-center justify-between border-b border-[#edf1f5] py-0 pl-[15px] pr-2.5 last:border-b-0" key={term.id}>
              <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-[#5bb5f8]/30">
                <input className="peer sr-only" checked={Boolean(checked[term.id])} onChange={() => setChecked((current) => ({ ...current, [term.id]: !current[term.id] }))} type="checkbox" />
                <CheckCircle />
                <span className={`type-body4 shrink-0 ${term.required ? "text-[#4aa9ed]" : "text-[#9ca4af]"}`}>{term.required ? "필수" : "선택"}</span>
                <strong className="type-caption3 truncate text-[#555d69]">{term.label}</strong>
              </label>
              <button className="grid h-[34px] w-[34px] place-items-center bg-transparent text-[#aab3bd]" aria-label={`${term.label} 자세히 보기`} type="button"><ChevronRight aria-hidden="true" size={18} /></button>
            </div>
          ))}
        </div>

        <p className="type-body5 mx-1 mb-0 mt-4 text-[#9ca4af]">선택 항목에 동의하지 않아도 서비스를 이용할 수 있습니다.</p>
        <button className="type-body6 mt-8 flex h-12 w-full items-center justify-center gap-1 rounded-[15px] bg-[#5bb5f8] text-white shadow-[0_6px_14px_rgba(91,181,248,0.22)] disabled:cursor-default disabled:opacity-45 disabled:shadow-none" disabled={!requiredChecked} onClick={() => navigate(PATH.PROFILE_SETUP)} type="button">동의하고 계속하기 <span aria-hidden="true">→</span></button>
      </section>
    </main>
  );
}
