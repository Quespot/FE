import { useNavigate } from "react-router-dom";
import { SubHeader } from "../../components/DeviceFrame";
import { Button, Panel } from "../../components/UI";
import { figmaAssets } from "../../data/quespot";
import {
  Camera,
  Check,
  ClipboardList,
  ImageUp,
  Lightbulb,
  X,
} from "lucide-react";

export default function MissionPhotoPage() {
  const navigate = useNavigate();

  return (
    <>
      <SubHeader
        title="사진 인증"
        onBack={() => navigate(-1)}
        action={
          <button className="inline-flex items-center gap-1 bg-transparent text-[var(--primary-soft)] text-xs font-bold" type="button">
            <Lightbulb size={13} strokeWidth={2.6} />
            힌트
          </button>
        }
      />
      <section className="flex flex-col gap-4 p-4 [overflow-y:auto]">
        <Panel>
          <h2>
            <ClipboardList size={15} strokeWidth={2.5} />
            인증 안내
          </h2>
          <strong>인사동 전통찻집 방문</strong>
          <p>
            전통찻집 간판이 보이도록 외관을 촬영하거나, 내부에서 차를 즐기는
            사진을 찍어 제출하세요.
          </p>
        </Panel>

        <Panel className="example-panel">
          <h2>예시 사진</h2>
          <div className="grid [grid-template-columns:1fr_1fr] gap-2.5">
            <figure className="m-0 text-red-500">
              <div className="relative h-32 overflow-hidden rounded-2xl after:[content:''] after:absolute after:[inset:0] after:rounded-[inherit] after:border-[3px_solid_#34d399] after:bg-[rgba(5,_150,_105,_0.12)] px-2">
                <img className="w-full h-full object-cover" src={figmaAssets.goodPhoto} alt="좋은 인증 예시" />
                <span className="absolute z-10 top-[8px] left-[8px] inline-flex items-center gap-1 rounded-full py-1 bg-[rgba(5,_150,_105,_0.9)] text-white text-[9px] font-black">
                  <Check size={10} strokeWidth={3} /> 좋은 예
                </span>
              </div>
              <figcaption className="pt-1.5 text-[#059669] text-[10px] font-bold text-center">✅ 간판·내부 포함</figcaption>
            </figure>
            <figure className="m-0 text-red-500">
              <div className="relative h-32 overflow-hidden rounded-2xl after:[content:''] after:absolute after:[inset:0] after:rounded-[inherit] after:border-[3px_solid_#34d399] after:bg-[rgba(5,_150,_105,_0.12)] px-2 after:border-[#f87171] after:bg-[rgba(239,_68,_68,_0.15)]">
                <img className="w-full h-full object-cover" src={figmaAssets.badPhoto} alt="나쁜 인증 예시" />
                <span className="absolute z-10 top-[8px] left-[8px] inline-flex items-center gap-1 rounded-full py-1 bg-[rgba(5,_150,_105,_0.9)] text-white text-[9px] font-black bg-[rgba(220,_38,_38,_0.9)]">
                  <X size={10} strokeWidth={3} /> 나쁜 예
                </span>
              </div>
              <figcaption className="pt-1.5 text-[#059669] text-[10px] font-bold text-center">❌ 장소 식별 불가</figcaption>
            </figure>
          </div>
        </Panel>

        <Panel className="grid place-items-center min-h-[210px] bg-[var(--sky-100)] text-center">
          <div className="grid place-items-center w-16 h-16 rounded-full bg-[var(--sky-300)] text-[var(--primary-soft)] last:flex last:gap-2">
            <Camera size={28} strokeWidth={2.4} />
          </div>
          <p>사진을 촬영하거나 업로드하세요</p>
          <div className="last:flex last:gap-2">
            <Button icon={<Camera size={14} strokeWidth={2.4} />}>
              촬영하기
            </Button>
            <Button
              icon={<ImageUp size={14} strokeWidth={2.4} />}
              variant="secondary"
            >
              갤러리
            </Button>
          </div>
        </Panel>
        <Button variant="disabled" className="min-h-13 rounded-2xl text-sm [box-shadow:0_4px_3px_#dbeafe,_0_2px_2px_#dbeafe]">
          사진을 먼저 선택해주세요
        </Button>
      </section>
    </>
  );
}

