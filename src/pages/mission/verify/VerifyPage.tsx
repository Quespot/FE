import { useNavigate } from "react-router-dom";
import { SubHeader } from "@/components/DeviceFrame";
import Button from "@/components/common/Button";
import { Camera, ImageUp, Lightbulb, X } from "lucide-react";

import GoodExample from "@/assets/images/photo_verification_good.png";
import BadExample from "@/assets/images/photo_verification_bad.png";
import { HTMLAttributes, useEffect, useRef, useState } from "react";
import { PATH } from "@/routes/paths";
export default function VerifyPage() {
  const navigate = useNavigate();

  const cameraInputRef = useRef<HTMLInputElement>(null);
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
    <div className="bg-[#F4F8FF]">
      <SubHeader
        title="사진 인증"
        onBack={() => navigate(-1)}
        action={
          <button
            className="inline-flex items-center gap-1 bg-transparent text-[var(--primary-soft)] text-xs font-bold"
            type="button"
          >
            <Lightbulb size={13} strokeWidth={2.6} />
            힌트
          </button>
        }
      />
      <section className="flex flex-col gap-4 p-4 [overflow-y:auto]">
        <Section>
          <h2 className="text-[12px] font-black">📋 인증 안내</h2>
          <h3 className="text-[14px] font-bold text-[#5A6B84]">
            인사동 전통찻집 방문
          </h3>
          <p className="text-[12px] text-[#9BAFC8]">
            전통찻집 간판이 보이도록 외관을 촬영하거나, 내부에서 차를 즐기는
            사진을 찍어 제출하세요.
          </p>
        </Section>

        <Section>
          <h2 className="text-[12px] font-black pb-3">예시 사진</h2>
          <div className="flex gap-[10px]">
            <section className="flex flex-1 flex-col items-center">
              <div className="relative w-full overflow-hidden rounded-3xl border-5 border-[#34D399]">
                <div className="absolute top-2 left-2 px-2 py-1 bg-[#059669] text-[12px] font-bold text-white rounded-3xl">
                  좋은 예
                </div>
                <img
                  className="w-full h-full object-cover"
                  src={GoodExample}
                  alt="좋은 인증 예시"
                />
              </div>
              <p className="text-[#059669] text-[12px] font-bold pt-2">
                ✅ 간판·내부 포함
              </p>
            </section>
            <section className="flex flex-1 flex-col items-center">
              <div className="relative w-full overflow-hidden rounded-3xl border-5 border-[#EF4444]">
                <div className="absolute top-2 left-2 px-2 py-1 bg-[#EF4444] text-[12px] font-bold text-white rounded-3xl">
                  나쁜 예
                </div>
                <img
                  className="w-full h-full object-cover"
                  src={BadExample}
                  alt="나쁜 인증 예시"
                />
              </div>
              <p className="text-[#EF4444] text-[12px] font-bold pt-2">
                ❌ 장소 식별 불가
              </p>
            </section>
          </div>
        </Section>

        <Section className="!bg-[var(--sky-100)]">
          <div className="grid place-items-center text-center gap-3 py-9">
            {!previewUrl ? (
              <>
                <div className="grid place-items-center w-16 h-16 rounded-full bg-[var(--sky-300)] text-[var(--primary-soft)]">
                  <Camera size={28} strokeWidth={2.4} />
                </div>
                <p className="type-caption3 text-[#9BAFC8]">
                  사진을 촬영하거나 업로드하세요
                </p>
              </>
            ) : (
              <div className="w-full">
                <img
                  src={previewUrl}
                  alt="선택한 이미지 미리보기"
                  className="w-full max-h-[300px] object-cover rounded-xl"
                />
              </div>
            )}
            <div className="flex gap-2">
              <Button
                size="sm"
                icon={<Camera size={14} strokeWidth={2.4} />}
                onClick={() => cameraInputRef.current?.click()}
              >
                촬영하기
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => galleryInputRef.current?.click()}
              >
                <ImageUp size={14} strokeWidth={2.4} />
                갤러리
              </Button>
              {/* 카메라 */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleImageChange}
              />

              {/* 갤러리 */}
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>
        </Section>
        {!previewUrl ? (
          <Button disabled>사진을 먼저 선택해주세요</Button>
        ) : (
          <Button onClick={() => navigate(PATH.MISSION_VERIFY_LOADING)}>
            제출하기
          </Button>
        )}
      </section>
    </div>
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
