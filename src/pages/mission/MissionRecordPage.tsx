import { useNavigate } from "react-router-dom";
import { SubHeader } from "../../components/DeviceFrame";
import { Button, Panel } from "../../components/UI";
import {
  Camera,
  Coffee,
  MessageCircle,
  PencilLine,
  Plus,
  X,
} from "lucide-react";

export default function MissionRecordPage() {
  const navigate = useNavigate();

  return (
    <>
      <SubHeader title="감상 기록" onBack={() => navigate(-1)} />
      <section className="flex flex-col gap-4 p-4 [overflow-y:auto]">
        <section className="flex items-center gap-2 min-h-[58px] rounded-2xl p-4 bg-[linear-gradient(169deg,_var(--sky-100)_0%,_var(--sky-300)_100%)]">
          <span className="text-2xl">
            <PencilLine size={23} strokeWidth={2.4} />
          </span>
          <div>
            <strong className="block text-sm font-black">인사동 전통찻집</strong>
            <small className="text-[var(--muted-2)] text-[10px]">2026년 7월 8일 방문</small>
          </div>
        </section>

        <Panel className="">
          <header className="flex items-center justify-between">
            <h2 className="inline-flex items-center gap-1.5">
              <MessageCircle size={15} strokeWidth={2.5} />
              작성 프롬프트
            </h2>
            <button type="button">다른 질문 →</button>
          </header>
          <blockquote className="m-[12px_0] rounded-[14px] p-3 bg-[var(--sky-100)] text-[var(--ink)] text-sm font-bold">"오늘 방문한 장소에서 가장 인상 깊었던 점은?"</blockquote>
          <textarea className="w-full h-[91px] resize-none border-0 bg-transparent text-[var(--ink)] outline-none" placeholder="여기에 자유롭게 적어보세요…" maxLength={300} />
          <small className="block text-[var(--muted-2)] text-[10px] text-right">0/300</small>
        </Panel>

        <Panel>
          <h2>
            <PencilLine size={15} strokeWidth={2.5} />이 장소를 한 단어로!
          </h2>
          <input
            className="w-full min-h-8 border-[1px_solid_#dbe8f8] rounded-[10px] p-[0_13px] bg-[#f6faff] text-[var(--navy)] outline-none placeholder:text-[#c6d1e0] min-h-10 border-0 rounded-[14px] bg-[var(--sky-100)] text-sm"
            placeholder="예: 고요함, 따뜻함, 전통…"
          />
        </Panel>

        <Panel>
          <h2>
            <Camera size={15} strokeWidth={2.5} />
            사진 첨부
          </h2>
          <div className="flex gap-2 pt-2">
            <span className="grid place-items-center w-16 h-16 rounded-[14px] bg-[linear-gradient(_135deg,_rgba(253,_230,_138,_0.27),_rgba(254,_243,_199,_0.27)_)] text-3xl text-[#8a5d1f]">
              <Coffee size={28} strokeWidth={2.3} />
            </span>
            <button className="grid place-items-center w-16 h-16 rounded-[14px] border-[2px_dashed_var(--sky-300)] bg-white text-[#d1d5dc] text-2xl font-medium text-[#b9c4d4]" type="button" aria-label="사진 추가">
              <Plus size={24} strokeWidth={2.5} />
            </button>
          </div>
        </Panel>

        <Button className="min-h-13 rounded-2xl text-sm [box-shadow:0_4px_3px_#dbeafe,_0_2px_2px_#dbeafe]">감상 저장하기</Button>
      </section>
    </>
  );
}

