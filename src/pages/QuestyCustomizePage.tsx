import { Bell, Gem, Glasses, Lock, Zap } from "lucide-react";
import { SubHeader } from "../components/DeviceFrame";
import { figmaAssets } from "../data/quespot";
import { useNavigate } from "react-router-dom";

type QuestyCustomizePageProps = {
  onBack?: () => void;
};

const equippedItems = [
  "🎩 탐험가 모자",
  "🕶️ 선글라스",
  "🧣 파란 스카프",
  "🧳 여행 가방",
];
const closetItems = [
  { icon: "🎩", name: "탐험가 모자", type: "일반", equipped: true },
  { icon: "🕶️", name: "선글라스", type: "일반", equipped: true },
  { icon: "🧣", name: "파란 스카프", type: "일반", equipped: true },
  { icon: "🧳", name: "여행 가방", type: "일반", equipped: true },
];

export default function QuestyCustomizePage() {
  const navigate = useNavigate();
  return (
    <>
      <section className="flex flex-1 flex-col min-h-0 [overflow-y:auto] bg-[#f2f7ff] bg-[#eef6ff]">
        <header className="flex items-center justify-between min-h-[42px] shrink-0 min-h-[66px] p-[0_30px] bg-white min-h-16">
          <div className="flex items-center gap-[9px]">
            <img className="w-[35px] h-[35px] object-contain" src={figmaAssets.mascot} alt="" />
            <strong className="block text-[var(--primary)] text-[22px] font-black text-[var(--primary-soft)] text-[25px]">Quespot</strong>
          </div>
          <button
            className="relative grid w-9 h-9 place-items-center rounded-full bg-transparent text-[#b7c2d1]"
            type="button"
            aria-label="알림"
          >
            <Bell size={19} strokeWidth={2.4} />
            <span className="absolute right-0 top-[2px] grid w-[18px] h-[18px] place-items-center border-[2px_solid_#fff] rounded-full bg-red-500 text-white text-[10px] font-black">3</span>
          </button>
        </header>

        <SubHeader
          title="마스코트 꾸미기"
          onBack={() => navigate(-1)}
          action={
            <span className="inline-flex items-center gap-1.5 rounded-full p-[9px_14px] bg-[var(--sky-100)] text-[var(--primary-soft)] text-sm font-black">
              <Zap size={14} fill="currentColor" strokeWidth={0} />
              1,240P
            </span>
          }
        />

        <section className="relative grid justify-items-center min-h-[344px] p-[28px_20px_24px] bg-[linear-gradient(180deg,_#caedff_0%,_#e3f5ff_100%)]">
          <span className="absolute text-[#fcd34d] text-xl [animation:sparkleBlink_1.8s_ease-in-out_infinite] left-[54px] top-[36px]">✦</span>
          <span className="absolute text-[#fcd34d] text-xl [animation:sparkleBlink_1.8s_ease-in-out_infinite] right-[74px] top-[52px] [animation-delay:0.5s]">✦</span>
          <div className="relative grid w-[204px] h-[204px] place-items-center bg-[rgba(255,_255,_255,_0.72)]">
            <img
              className="w-[176px] h-[176px] object-contain [animation:questyDance_2.4s_ease-in-out_infinite] [filter:drop-shadow(0_14px_16px_rgba(8,_37,_95,_0.16))]"
              src={figmaAssets.mascot}
              alt="움직이는 퀘스티"
            />
            <span className="absolute z-20 pointer-events-none left-[55px] top-[5px] text-[40px] [transform:rotate(-8deg)] [animation:accessoryWiggle_2.4s_ease-in-out_infinite]">🎩</span>
            <span className="absolute z-20 pointer-events-none left-[76px] top-[76px] text-[#111827] opacity-90">
              <Glasses size={34} strokeWidth={3} />
            </span>
            <span className="absolute z-20 pointer-events-none left-[50px] top-[98px] text-[35px] [transform:rotate(-28deg)]">🧣</span>
            <span className="absolute z-20 pointer-events-none left-[24px] bottom-[18px] text-4xl [transform:rotate(-12deg)]">🧳</span>
            <b className="absolute right-[-17px] top-[-16px] grid w-12 h-12 place-items-center border-[5px_solid_rgba(28,_28,_58,_0.42)] rounded-full bg-[#8e36ff] text-white text-lg [box-shadow:0_5px_10px_rgba(28,_28,_58,_0.32)]">꿀</b>
          </div>
          <div className="flex [flex-wrap:wrap] justify-center gap-[9px] mt-[18px] px-2.5">
            {equippedItems.map((item) => (
              <span className="rounded-full py-2 bg-white text-[var(--primary-soft)] text-xs font-black" key={item}>{item}</span>
            ))}
          </div>
          <p className="m-[14px_0_0] text-[#9aa6b8] text-[13px]">아이템을 탭해서 장착/해제</p>
        </section>

        <section className="grid gap-4 p-[22px]">
          <div className="grid [grid-template-columns:1fr_1fr] rounded-[22px] p-1.5 bg-[#e6f4ff]">
            <button className="bg-[var(--primary)] text-white bg-white text-[var(--primary-soft)] [box-shadow:0_2px_8px_rgba(8,_37,_95,_0.08)] bg-[var(--primary-soft)] min-h-11 rounded-[18px] bg-transparent text-[#9aa6b8] font-black" type="button">
              👕 내 옷장
            </button>
            <button className="min-h-11 rounded-[18px] bg-transparent text-[#9aa6b8] font-black" type="button">🛍️ 아이템 샵</button>
          </div>
          <div className="flex gap-2 [overflow-x:auto]">
            {["모두", "모자", "액세서리", "의상", "아이템"].map(
              (filter, index) => (
                <button
                  className={index === 0 ? "bg-[var(--primary)] text-white bg-white text-[var(--primary-soft)] [box-shadow:0_2px_8px_rgba(8,_37,_95,_0.08)] bg-[var(--primary-soft)]" : ""}
                  key={filter}
                  type="button"
                >
                  {filter}
                </button>
              ),
            )}
          </div>
          <p className="m-0 text-[#8a98aa] text-[13px] font-bold">
            보유 중인 아이템 <b className="text-[var(--ink)]">4개</b>
          </p>
          <div className="grid [grid-template-columns:repeat(4,_minmax(0,_1fr))] gap-3.5 max-[380px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))]">
            {closetItems.map((item) => (
              <article className="grid justify-items-center border-[2px_solid_var(--primary-soft)] rounded-[17px] p-[18px_8px_12px] bg-white text-center" key={item.name}>
                <span>{item.icon}</span>
                <strong className="mt-3 text-[var(--ink)] text-xs leading-[1.3]">{item.name}</strong>
                <small className="mt-2 text-[#9aa6b8] text-[11px] font-extrabold">{item.type}</small>
                <button className="mt-[9px] rounded-full p-[7px_10px] bg-[var(--primary-soft)] text-white text-[11px] font-black" type="button">
                  {item.equipped ? "장착 중" : "장착"}
                </button>
              </article>
            ))}
          </div>
          <div className="flex items-center justify-between rounded-[18px] py-3.5 px-4 bg-white text-[#8a98aa] text-xs font-extrabold">
            <span className="inline-flex items-center gap-[7px]">
              <Lock size={16} strokeWidth={2.5} />
              레어 아이템은 미션 배지로 해금돼요
            </span>
            <Gem size={18} strokeWidth={2.5} />
          </div>
        </section>
      </section>
    </>
  );
}

