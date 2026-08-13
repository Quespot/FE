import {
  Bell,
  Crosshair,
  LocateFixed,
  MapPin,
  Navigation,
  Route,
  Search,
  Star,
  Target,
} from "lucide-react";
import { DeviceFrame, SubHeader } from "../components/DeviceFrame";
import { Button, LocationBadge } from "../components/UI";
import { useNavigate } from "react-router-dom";
import { PATH } from "@/routes/paths";

const mapSpots = [
  {
    name: "인사동 전통찻집",
    area: "종로구 인사동",
    point: "240P",
    className: "left-[58px] top-[78px]",
  },
  {
    name: "북촌 골목 산책",
    area: "북촌 한옥마을",
    point: "180P",
    className: "right-[76px] top-[104px] bg-[#f5b01a] bg-[rgba(245,_176,_26,_0.16)] text-[#b77900]",
  },
  {
    name: "청계천 포토존",
    area: "청계광장",
    point: "160P",
    className: "left-[172px] bottom-[72px] bg-[#22c55e] bg-[rgba(34,_197,_94,_0.14)] text-[#138a3d]",
  },
];

export default function MapPage() {
  const navigate = useNavigate();
  return (
    <>
      <SubHeader
        title="미션 지도"
        onBack={() => navigate(-1)}
        action={
          <button className="inline-flex items-center gap-1 bg-transparent text-[var(--primary-soft)] text-xs font-bold" type="button">
            <LocateFixed size={14} strokeWidth={2.5} />
            현재 위치
          </button>
        }
      />

      <section className="flex flex-1 flex-col gap-3.5 [overflow-y:auto] p-4">
        <header className="grid [grid-template-columns:1fr_42px] gap-2.5">
          <label className="flex items-center min-h-[46px] border-[1px_solid_var(--sky-100)] rounded-[18px] bg-white text-[var(--muted-2)] [box-shadow:0_1px_5px_rgba(8,_37,_95,_0.08)] gap-2 p-[0_14px]">
            <Search size={16} strokeWidth={2.4} />
            <input className="w-full border-0 bg-transparent text-[var(--navy)] text-[13px] outline-none" placeholder="지역, 명소, 미션 검색" />
          </label>
          <button className="flex items-center min-h-[46px] border-[1px_solid_var(--sky-100)] rounded-[18px] bg-white text-[var(--muted-2)] [box-shadow:0_1px_5px_rgba(8,_37,_95,_0.08)] justify-center text-[var(--navy)]" type="button" aria-label="알림">
            <Bell size={18} strokeWidth={2.4} />
          </button>
        </header>

        <section className="relative min-h-[300px] overflow-hidden border-[1px_solid_#cce8ff] rounded-[26px] bg-[linear-gradient(_28deg,_rgba(184,_216,_184,_0.52)_0_22%,_transparent_22%_100%_),_linear-gradient(145deg,_#dff3ff_0%,_#f5fbff_55%,_#d2edff_100%)] [box-shadow:inset_0_0_0_1px_rgba(255,_255,_255,_0.62),_0_8px_26px_rgba(43,_143,_219,_0.14)]" aria-label="종로 주변 미션 지도">
          <div className="absolute [inset:0] bg-[linear-gradient(90deg,_rgba(8,_37,_95,_0.06)_1px,_transparent_1px),_linear-gradient(0deg,_rgba(8,_37,_95,_0.06)_1px,_transparent_1px)] bg-size-[54px_54px] [mask-image:linear-gradient(_to_bottom,_rgba(0,_0,_0,_0.4),_rgba(0,_0,_0,_0.08)_)]" />
          <div className="absolute h-[92px] border-[8px_solid_rgba(22,_115,_248,_0.2)] [border-right:0] [border-bottom:0] rounded-[36px_0_0_0] right-[34px] bottom-[82px] w-[230px] [transform:rotate(-12deg)]" />
          <div className="absolute h-[92px] border-[8px_solid_rgba(22,_115,_248,_0.2)] [border-right:0] [border-bottom:0] rounded-[36px_0_0_0] left-[42px] top-[72px] w-[190px] border-[rgba(91,_181,_248,_0.34)] [transform:rotate(162deg)]" />
          <span className="absolute grid place-items-center rounded-full [box-shadow:0_8px_18px_rgba(8,_37,_95,_0.16)] w-[42px] h-[42px] bg-[var(--primary)] text-white left-[58px] top-[78px]">
            <MapPin size={18} fill="currentColor" strokeWidth={2.2} />
          </span>
          <span className="absolute grid place-items-center rounded-full [box-shadow:0_8px_18px_rgba(8,_37,_95,_0.16)] w-[42px] h-[42px] bg-[var(--primary)] text-white right-[76px] top-[104px] bg-[#f5b01a] bg-[rgba(245,_176,_26,_0.16)] text-[#b77900]">
            <Target size={17} strokeWidth={2.6} />
          </span>
          <span className="absolute grid place-items-center rounded-full [box-shadow:0_8px_18px_rgba(8,_37,_95,_0.16)] w-[42px] h-[42px] bg-[var(--primary)] text-white left-[172px] bottom-[72px] bg-[#22c55e] bg-[rgba(34,_197,_94,_0.14)] text-[#138a3d]">
            <Star size={17} fill="currentColor" strokeWidth={2.2} />
          </span>
          <div className="absolute grid place-items-center rounded-full [box-shadow:0_8px_18px_rgba(8,_37,_95,_0.16)] right-[38px] bottom-[34px] w-12 h-12 border-[5px_solid_rgba(255,_255,_255,_0.86)] bg-[var(--sky-300)] text-[var(--primary)]">
            <Crosshair size={18} strokeWidth={2.5} />
          </div>
          <article className="absolute left-[16px] right-[16px] bottom-[16px] border-[1px_solid_rgba(255,_255,_255,_0.76)] rounded-[20px] p-3.5 bg-[rgba(255,_255,_255,_0.9)] [backdrop-filter:blur(12px)] [box-shadow:0_8px_24px_rgba(8,_37,_95,_0.12)]">
            <LocationBadge>가까운 미션</LocationBadge>
            <strong className="block mt-2 text-[var(--navy)] text-[17px]">인사동 전통찻집</strong>
            <p className="m-[4px_0_0] text-[var(--muted)] text-xs font-bold">현재 위치에서 도보 8분</p>
          </article>
        </section>

        <section className="grid gap-3">
          <div className="flex items-center justify-between">
            <h2 className="m-0 text-[var(--navy)] text-lg inline-flex items-center gap-[5px]">근처 미션</h2>
            <span className="text-[var(--primary)] text-xs font-black">3개 발견</span>
          </div>
          <div className="grid gap-2.5">
            {mapSpots.map((spot, index) => (
              <article className="grid [grid-template-columns:44px_minmax(0,_1fr)_auto] gap-3 items-center border-[1px_solid_var(--sky-100)] rounded-[18px] p-3 bg-white [box-shadow:0_1px_5px_rgba(8,_37,_95,_0.08)]" key={spot.name}>
                <span className={`grid w-11 h-11 place-items-center rounded-2xl bg-[var(--sky-100)] text-[var(--primary)] ${spot.className}`}>
                  {index === 0 ? (
                    <MapPin size={18} strokeWidth={2.5} />
                  ) : index === 1 ? (
                    <Route size={18} strokeWidth={2.5} />
                  ) : (
                    <Navigation size={18} strokeWidth={2.5} />
                  )}
                </span>
                <div>
                  <strong className="block overflow-hidden text-[var(--navy)] text-sm [text-overflow:ellipsis] whitespace-nowrap">{spot.name}</strong>
                  <small className="block mt-[3px] text-[var(--muted)] text-[11px]">{spot.area}</small>
                </div>
                <em className="rounded-full p-[5px_8px] bg-[var(--sky-100)] text-[var(--primary)] text-[11px] not-italic font-black">{spot.point}</em>
              </article>
            ))}
          </div>
        </section>

        <Button
          className="mt-0.5"
          icon={<Navigation size={18} strokeWidth={2.4} />}
          onClick={() => navigate(PATH.MISSION_PHOTO)}
        >
          선택한 미션 시작하기
        </Button>
      </section>
    </>
  );
}

