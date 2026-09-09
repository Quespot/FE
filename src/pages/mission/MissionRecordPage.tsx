import { useNavigate } from "react-router-dom";
import { SubHeader } from "../../components/DeviceFrame";
import { Camera, Coffee, PencilLine, Plus } from "lucide-react";
import { HTMLAttributes, useEffect, useRef, useState } from "react";
import Button from "@/components/common/Button";
import { PATH } from "@/routes/paths";

export default function MissionRecordPage() {
  const navigate = useNavigate();
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    console.log(file);
  };
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  return (
    <>
      <SubHeader title="감상 기록" onBack={() => navigate(-1)} />
      <section className="flex flex-col gap-4 p-4 [overflow-y:auto]">
        <section className="flex items-center gap-2 min-h-[58px] rounded-2xl p-4 bg-[linear-gradient(169deg,_var(--sky-100)_0%,_var(--sky-300)_100%)]">
          <span className="text-2xl">
            <p>📝</p>
          </span>
          <div>
            <p className="text-[14px] font-black">인사동 전통찻집</p>
            <small className="type-body4 text-[#A2A9B2]">
              2026년 7월 8일 방문
            </small>
          </div>
        </section>

        <Section>
          <header className="flex items-center justify-between">
            <h2 className="text-[12px] font-black">💬 작성 프롬프트</h2>
            <button type="button" className="type-body4 text-primary">
              다른 질문 →
            </button>
          </header>
          <blockquote className="m-[12px_0] rounded-[14px] p-3 bg-[var(--sky-100)] text-[var(--ink)] type-caption1">
            "오늘 방문한 장소에서 가장 인상 깊었던 점은?"
          </blockquote>
          <textarea
            className="w-full h-[91px] resize-none border-0 bg-transparent text-[var(--ink)] outline-none"
            placeholder="여기에 자유롭게 적어보세요…"
            maxLength={300}
          />
          <small className="block text-[var(--muted-2)] text-[10px] text-right">
            0/300
          </small>
        </Section>

        <Section>
          <h2 className="text-[12px] font-black">✏️ 이 장소를 한 단어로!</h2>
          <input
            className="w-full min-h-8 border-[1px_solid_#dbe8f8] rounded-[10px] p-[0_13px] bg-[#f6faff] text-[var(--navy)] outline-none placeholder:text-[#c6d1e0] min-h-10 border-0 rounded-[14px] bg-[var(--sky-100)] type-caption1"
            placeholder="예: 고요함, 따뜻함, 전통…"
          />
        </Section>

        <Section>
          <h2 className="text-[12px] font-black">📷 사진 첨부</h2>
          <div className="flex gap-2 pt-2">
            {!previewUrl ? (
              <span className="grid place-items-center w-16 h-16 rounded-[14px] bg-[linear-gradient(_135deg,_rgba(253,_230,_138,_0.27),_rgba(254,_243,_199,_0.27)_)] text-3xl text-[#8a5d1f]">
                ☕
              </span>
            ) : (
              <img
                src={previewUrl}
                alt="선택한 이미지 미리보기"
                className="w-16 h-16 object-cover rounded-xl"
              />
            )}
            <button
              className="grid place-items-center w-16 h-16 rounded-[14px] border-[2px_dashed_var(--sky-300)] bg-white text-[#d1d5dc] text-2xl font-medium text-[#b9c4d4]"
              type="button"
              aria-label="사진 추가"
              onClick={() => galleryInputRef.current?.click()}
            >
              <Plus size={24} strokeWidth={2.5} />
            </button>
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </Section>

        <Button onClick={() => navigate(PATH.MISSIONS)}>감상 저장하기</Button>
      </section>
    </>
  );
}
interface SectionProps extends HTMLAttributes<HTMLDivElement> {}

function Section({ className = "", children, ...props }: SectionProps) {
  return (
    <div
      className={`
        flex flex-col gap-1 p-4 rounded-2xl bg-white
        border-[1px_solid_var(--sky-100)]
        [box-shadow:0_1px_3px_rgba(0,_0,_0,_0.1)]
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
