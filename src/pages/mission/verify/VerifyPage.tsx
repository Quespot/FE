import { useEffect, useRef, useState, ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Camera, ImageUp, Lightbulb } from "lucide-react";

import { SubHeader } from "@/components/DeviceFrame";
import Button from "@/components/common/Button";
import { PATH } from "@/routes/paths";
import { useVerifyMissionArrival } from "@/hooks/mutation/useVerifyMissionArrival";
import { useCreateMissionPhoto } from "@/hooks/mutation/useCreateMissionPhoto";
import type { MissionDetail } from "@/types/mission";

import GoodExample from "@/assets/images/photo_verification_good.png";
import BadExample from "@/assets/images/photo_verification_bad.png";
import { ContentCard } from "@/components/common/ContentCard";

type VerifyPageState = {
  missionId?: number;
  attemptId?: number;
  mission?: MissionDetail;
  missionTitle?: string;
};

type LatLng = {
  lat: number;
  lng: number;
};

const DEFAULT_LOCATION: LatLng = {
  lat: 37.5752,
  lng: 126.9812,
};
export default function VerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as VerifyPageState | null;

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [currentLocation, setCurrentLocation] =
    useState<LatLng>(DEFAULT_LOCATION);

  const { mutate: verifyArrival, isPending: isVerifyingArrival } =
    useVerifyMissionArrival();

  const { mutate: createPhoto, isPending: isCreatingPhoto } =
    useCreateMissionPhoto();

  const mission = state?.mission;
  const missionTitle = state?.missionTitle ?? mission?.title ?? "미션";
  const spotName = mission?.spotName ?? missionTitle;
  const attemptId = state?.attemptId;

  const isSubmitting = isVerifyingArrival || isCreatingPhoto;

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setImageFile(file);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleSubmit = () => {
    if (!imageFile || !previewUrl) return;

    if (!attemptId) {
      navigate(PATH.MISSION_VERIFY_LOADING, {
        state: {
          missionId: state?.missionId,
          mission,
          missionTitle,
          isDemoMode: true,
          isSuccess: true,
        },
      });

      return;
    }

    verifyArrival(
      {
        attemptId,
        latitude: currentLocation.lat,
        longitude: currentLocation.lng,
      },
      {
        onSuccess: (arrivalResult) => {
          createPhoto(
            {
              attemptId,
              body: {
                imageUrl: previewUrl,
                caption: `${missionTitle} 인증 사진`,
                latitude: currentLocation.lat,
                longitude: currentLocation.lng,
                takenAt: new Date().toISOString(),
              },
            },
            {
              onSuccess: (photoResult) => {
                navigate(PATH.MISSION_VERIFY_LOADING, {
                  state: {
                    missionId: state?.missionId,
                    attemptId,
                    mission,
                    missionTitle,
                    arrivalResult,
                    photoResult,
                    isSuccess: true,
                  },
                });
              },
              onError: (error) => {
                console.error(error);

                navigate(PATH.MISSION_VERIFY_LOADING, {
                  state: {
                    missionId: state?.missionId,
                    attemptId,
                    mission,
                    missionTitle,
                    arrivalResult,
                    isSuccess: true,
                    photoUploadFailed: true,
                  },
                });
              },
            },
          );
        },
        onError: (error) => {
          console.error(error);
          alert("GPS 도착 인증에 실패했어요. 위치 권한을 확인해주세요.");
        },
      },
    );
  };

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        setCurrentLocation(DEFAULT_LOCATION);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 1000 * 60 * 5,
      },
    );
  }, []);

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
        <ContentCard>
          <h2 className="text-[12px] font-black">📋 인증 안내</h2>

          <h3 className="text-[14px] font-bold text-[#5A6B84]">
            {spotName} 방문
          </h3>

          <p className="text-[12px] text-[#9BAFC8]">
            장소가 잘 식별되도록 간판, 외관, 내부 공간 중 하나가 보이게 촬영해서
            제출하세요.
          </p>

          {attemptId ? (
            <p className="mt-2 rounded-xl bg-[#EAF5FF] px-3 py-2 text-[11px] font-bold text-[#5BB5F8]">
              현재 미션 시도 번호: {attemptId}
            </p>
          ) : (
            <p className="mt-2 rounded-xl bg-[#FFF6D9] px-3 py-2 text-[11px] font-bold text-[#F59E0B]">
              attemptId가 없어 데모 인증 모드로 진행돼요.
            </p>
          )}
        </ContentCard>

        <ContentCard>
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
        </ContentCard>

        <ContentCard className="!bg-[var(--sky-100)]">
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

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleImageChange}
              />

              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>
        </ContentCard>
        {!previewUrl ? (
          <Button disabled>사진을 먼저 선택해주세요</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "인증 요청 중..." : "제출하기"}
          </Button>
        )}
      </section>
    </div>
  );
}
