import {
  Award,
  CalendarClock,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Heart,
  MapPin,
  Navigation,
  Route,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { SubHeader } from "../../components/DeviceFrame";
import { Button, LocationBadge } from "../../components/UI";
import { recommendedMissions } from "../../data/quespot";
import { useNavigate } from "react-router-dom";
import { PATH } from "@/routes/paths";

const missionToneClasses = {
  cream: "bg-[linear-gradient(145deg,_#fff6cc_0%,_#fffef6_100%)]",
  lavender: "bg-[linear-gradient(145deg,_#f6f0ff_0%,_#fffaff_100%)] bg-[linear-gradient(145deg,_#f1e8ff_0%,_#fffaff_100%)]",
  mint: "bg-[linear-gradient(145deg,_#ddfaee_0%,_#fafffd_100%)]",
  peach: "bg-[linear-gradient(145deg,_#ffe6d7_0%,_#fff9f5_100%)]",
  blue: "bg-[linear-gradient(145deg,#dff1ff_0%,#f7fcff_100%)]",
} as const;


export default function MissionDetailPage() {
  const navigate = useNavigate();
  const mission = recommendedMissions[1];
  return (
    <>
      <SubHeader
        title="미션 상세"
        onBack={() => navigate(-1)}
        action={
          <div className="inline-flex gap-2">
            <button className="grid w-8 h-8 place-items-center rounded-full bg-[var(--sky-100)] text-[var(--primary-soft)]" type="button" aria-label="공유하기">
              <Share2 size={16} strokeWidth={2.4} />
            </button>
            <button className="grid w-8 h-8 place-items-center rounded-full bg-[var(--sky-100)] text-[var(--primary-soft)]" type="button" aria-label="찜하기">
              <Heart size={16} strokeWidth={2.4} />
            </button>
          </div>
        }
      />

      <section className="flex flex-1 flex-col gap-3.5 [overflow-y:auto] p-[16px_16px_22px] bg-[#f2f7ff]">
        <section className={`grid [grid-template-columns:minmax(0,_1fr)_118px] items-center min-h-[190px] overflow-hidden rounded-[26px] p-[22px_18px] [box-shadow:0_12px_24px_rgba(8,_37,_95,_0.08)] ${missionToneClasses[mission.tone]}`}>
          <div>
            <LocationBadge>{mission.category}</LocationBadge>
            <h1 className="m-[12px_0_8px] text-[var(--ink)] text-[25px] leading-[1.26] tracking-[0]">{mission.title}</h1>
            <p className="m-0 text-[#64758d] text-[13px] font-bold">{mission.place}</p>
          </div>
          <span className="justify-self-[center] text-[76px] [filter:drop-shadow(0_16px_18px_rgba(8,_37,_95,_0.12))]">{mission.visual}</span>
        </section>

        <section className="grid [grid-template-columns:repeat(3,_minmax(0,_1fr))] overflow-hidden rounded-[20px] bg-white [box-shadow:0_2px_8px_rgba(8,_37,_95,_0.08)] px-1.5">
          <div className="grid gap-[5px] justify-items-center min-h-[88px] py-3.5 [border-right:1px_solid_#e8eff8] text-[var(--primary-soft)] text-center last:[border-right:0]">
            <Award size={22} strokeWidth={2.4} />
            <span className="text-[#8b98aa] text-[10px] font-extrabold">완료 보상</span>
            <strong className="text-[var(--ink)] text-sm">+{mission.points}P</strong>
          </div>
          <div className="grid gap-[5px] justify-items-center min-h-[88px] py-3.5 [border-right:1px_solid_#e8eff8] text-[var(--primary-soft)] text-center last:[border-right:0]">
            <Clock3 size={22} strokeWidth={2.4} />
            <span className="text-[#8b98aa] text-[10px] font-extrabold">예상 시간</span>
            <strong className="text-[var(--ink)] text-sm">{mission.duration}</strong>
          </div>
          <div className="grid gap-[5px] justify-items-center min-h-[88px] py-3.5 [border-right:1px_solid_#e8eff8] text-[var(--primary-soft)] text-center last:[border-right:0]">
            <ShieldCheck size={22} strokeWidth={2.4} />
            <span className="text-[#8b98aa] text-[10px] font-extrabold">난이도</span>
            <strong className="text-[var(--ink)] text-sm">{mission.difficulty}</strong>
          </div>
        </section>

        <section className="border-[1px_solid_#dce8f5] rounded-[20px] p-4 bg-white [box-shadow:0_2px_8px_rgba(8,_37,_95,_0.08)]">
          <header className="flex items-center gap-[7px] text-[var(--primary-soft)]">
            <Sparkles size={17} strokeWidth={2.4} />
            <h2 className="m-0 text-[var(--ink)] text-[15px] leading-[1.3]">미션 소개</h2>
          </header>
          <p className="m-[10px_0_0] text-[#65758b] text-[13px] leading-[1.65]">{mission.description}</p>
        </section>

        <section className="border-[1px_solid_#dce8f5] rounded-[20px] p-4 bg-white [box-shadow:0_2px_8px_rgba(8,_37,_95,_0.08)]">
          <header className="flex items-center gap-[7px] text-[var(--primary-soft)]">
            <MapPin size={17} strokeWidth={2.4} />
            <h2 className="m-0 text-[var(--ink)] text-[15px] leading-[1.3]">장소 정보</h2>
          </header>
          <strong className="block mt-3 text-[var(--ink)] text-base">{mission.place}</strong>
          <p className="m-[10px_0_0] text-[#65758b] text-[13px] leading-[1.65]">{mission.address}</p>
          <div className="relative flex items-center justify-between min-h-[92px] mt-3.5 overflow-hidden rounded-[18px] p-3.5 bg-[linear-gradient(90deg,_rgba(8,_37,_95,_0.05)_1px,_transparent_1px),_linear-gradient(0deg,_rgba(8,_37,_95,_0.05)_1px,_transparent_1px),_linear-gradient(145deg,_#e5f6ff_0%,_#f8fdff_100%)] bg-size-[34px_34px,_34px_34px,_auto] text-[var(--primary-soft)]">
            <Route size={44} strokeWidth={1.9} />
            <span className="grid w-[38px] h-[38px] place-items-center rounded-full bg-[var(--primary-soft)] text-white [box-shadow:0_8px_16px_rgba(43,_143,_219,_0.18)]">
              <Navigation size={16} strokeWidth={2.6} />
            </span>
            <b className="rounded-full p-[7px_10px] bg-[rgba(255,_255,_255,_0.86)] text-[var(--ink)] text-xs">{mission.distance}</b>
          </div>
        </section>

        <section className="border-[1px_solid_#dce8f5] rounded-[20px] p-4 bg-white [box-shadow:0_2px_8px_rgba(8,_37,_95,_0.08)]">
          <header className="flex items-center gap-[7px] text-[var(--primary-soft)]">
            <Camera size={17} strokeWidth={2.4} />
            <h2 className="m-0 text-[var(--ink)] text-[15px] leading-[1.3]">인증 가이드</h2>
          </header>
          <p className="m-[10px_0_0] text-[#65758b] text-[13px] leading-[1.65]">{mission.guide}</p>
        </section>

        <section className="border-[1px_solid_#dce8f5] rounded-[20px] p-4 bg-white [box-shadow:0_2px_8px_rgba(8,_37,_95,_0.08)]">
          <header className="flex items-center gap-[7px] text-[var(--primary-soft)]">
            <CalendarClock size={17} strokeWidth={2.4} />
            <h2 className="m-0 text-[var(--ink)] text-[15px] leading-[1.3]">진행 순서</h2>
          </header>
          <ol className="grid gap-2.5 m-[14px_0_0] p-0 list-none">
            {mission.steps.map((step, index) => (
              <li className="grid [grid-template-columns:28px_minmax(0,_1fr)_20px] gap-2.5 items-center min-h-[42px]" key={step}>
                <span>{index + 1}</span>
                <p className="m-[10px_0_0] text-[#65758b] text-[13px] leading-[1.65] m-0 text-[var(--ink)] font-extrabold">{step}</p>
                {index === mission.steps.length - 1 ? (
                  <CheckCircle2 size={18} strokeWidth={2.5} />
                ) : null}
              </li>
            ))}
          </ol>
        </section>

        <section className="border-[1px_solid_#dce8f5] rounded-[20px] p-4 bg-white [box-shadow:0_2px_8px_rgba(8,_37,_95,_0.08)] grid gap-2.5 bg-[linear-gradient(145deg,_#fff_0%,_#f7fbff_100%)]">
          <div className="inline-flex items-center gap-[5px] text-[#f5b01a]">
            <Star size={15} fill="#f5b01a" strokeWidth={0} />
            <strong className="text-[var(--ink)] text-base">4.8</strong>
            <span className="text-[#8b98aa] text-xs font-extrabold">참여자 만족도</span>
          </div>
          <p className="m-0 text-[#65758b] text-[13px] leading-[1.55]">“짧은 시간 안에 지역 분위기를 느낄 수 있어서 좋아요.”</p>
        </section>

        <Button
          className="sticky bottom-0 min-h-[54px] rounded-[18px] [box-shadow:0_10px_22px_rgba(91,_181,_248,_0.28)]"
          icon={<ChevronRight size={18} strokeWidth={2.6} />}
          onClick={() => navigate(PATH.MISSION_PHOTO)}
        >
          미션 시작하기
        </Button>
      </section>
    </>
  );
}
