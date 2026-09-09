import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Image,
  Search,
  BadgeCheck,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";
import { PATH } from "@/routes/paths";
import Questy from "@/assets/questy.svg";

const steps = [
  {
    label: "현재 위치 확인 중...",
    icon: MapPin,
  },
  {
    label: "사진 분석 중...",
    icon: Image,
  },
  {
    label: "장소 일치 확인 중...",
    icon: Search,
  },
  {
    label: "검증 완료!",
    icon: BadgeCheck,
  },
];

export default function VerifyLoadingPage() {
  const navigate = useNavigate();

  // 현재 진행 중인 단계
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep >= steps.length) {
      navigate(PATH.MISSION_VERIFY_RESULT, {
        replace: true,
      });

      return;
    }

    // 임시로 3초마다 다음 단계
    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentStep, navigate]);

  return (
    <div className="min-h-screen bg-[#DDF1FF] flex flex-col items-center px-5 pt-32">
      <div className="w-32 h-32 flex items-center justify-center mb-6">
        <img src={Questy} alt="퀘스티" />
      </div>

      <h1 className="type-label1">인증 중이에요</h1>
      <p className="mt-1 type-body3 text-[#A2A9B2]">잠시만 기다려주세요</p>

      <div className="w-full mt-8 flex flex-col gap-3">
        {steps.map((step, index) => {
          const Icon = step.icon;

          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isPending = index > currentStep;

          return (
            <div
              key={step.label}
              className={`
                w-full  rounded-xl flex items-center gap-3 px-4 py-3 border bg-white transition-all
                ${isActive ? "border-primary" : "border-transparent"}
                ${isPending ? "opacity-40" : "opacity-100"}
              `}
            >
              {isCompleted ? (
                <CheckCircle2 size={22} className="text-green-500" />
              ) : isActive ? (
                <LoaderCircle size={22} className="text-primary animate-spin" />
              ) : (
                <Icon size={22} className="text-[#B8C2CC]" />
              )}
              <span
                className={`
                  type-caption3
                  ${
                    isCompleted || isActive
                      ? "text-[#1F2533]"
                      : "text-[#A2A9B2]"
                  }
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
