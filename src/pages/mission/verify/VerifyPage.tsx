import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Camera,
  ImageUp,
  Lightbulb,
  Loader2,
  MapPin,
  RefreshCw,
  Target,
  X,
} from "lucide-react";

import { SubHeader } from "@/components/DeviceFrame";
import Button from "@/components/common/Button";
import { ContentCard } from "@/components/common/ContentCard";
import { PATH } from "@/routes/paths";
import { useVerifyMissionArrival } from "@/hooks/mutation/useVerifyMissionArrival";
import { useCreateMissionPhoto } from "@/hooks/mutation/useCreateMissionPhoto";
import { useMissionVerificationGuide } from "@/hooks/queries/useMissionVerificationGuide";
import type { MissionDetail } from "@/types/mission";
import type { MissionVerificationGuide } from "@/types/missionAttempt";
import { uploadFile } from "@/apis/file";

import GoodExample from "@/assets/images/photo_verification_good.png";
import BadExample from "@/assets/images/photo_verification_bad.png";

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

const FALLBACK_RADIUS_METERS = 500;

export default function VerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as VerifyPageState | null;

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [currentLocation, setCurrentLocation] =
    useState<LatLng>(DEFAULT_LOCATION);

  const mission = state?.mission;
  const attemptId = state?.attemptId ?? null;

  const {
    data: verificationGuide,
    isLoading: isVerificationGuideLoading,
    isError: isVerificationGuideError,
    refetch: refetchVerificationGuide,
  } = useMissionVerificationGuide(attemptId);

  const fallbackVerificationGuide = useMemo<
    MissionVerificationGuide | undefined
  >(() => {
    if (!mission) return undefined;

    if (
      !Number.isFinite(mission.latitude) ||
      !Number.isFinite(mission.longitude)
    ) {
      return undefined;
    }

    return {
      attemptId: attemptId ?? 0,
      targetLatitude: mission.latitude,
      targetLongitude: mission.longitude,
      radiusMeters: FALLBACK_RADIUS_METERS,
    };
  }, [attemptId, mission]);

  const guideForDisplay =
    verificationGuide ??
    (!isVerificationGuideLoading ? fallbackVerificationGuide : undefined);

  const isUsingFallbackGuide =
    Boolean(guideForDisplay) &&
    !verificationGuide &&
    Boolean(fallbackVerificationGuide);

  const { mutateAsync: verifyArrival, isPending: isVerifyingArrival } =
    useVerifyMissionArrival();

  const { mutateAsync: createPhoto, isPending: isCreatingPhoto } =
    useCreateMissionPhoto();

  const missionTitle = state?.missionTitle ?? mission?.title ?? "미션";
  const spotName = mission?.spotName ?? missionTitle;
  const missionId = state?.missionId ?? mission?.missionId;

  const isSubmitting = isVerifyingArrival || isUploading || isCreatingPhoto;

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setImageFile(file);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleSubmit = async () => {
    if (!imageFile || !previewUrl) return;

    if (!attemptId) {
      navigate(PATH.MISSION_VERIFY_LOADING, {
        state: {
          missionId,
          mission,
          missionTitle,
          isDemoMode: true,
          isSuccess: true,
        },
      });

      return;
    }

    let arrivalResult;

    try {
      arrivalResult = await verifyArrival({
        attemptId,
        latitude: currentLocation.lat,
        longitude: currentLocation.lng,
      });

      if (!arrivalResult.success) {
        navigate(PATH.MISSION_VERIFY_LOADING, {
          state: {
            missionId,
            attemptId,
            mission,
            missionTitle,
            isSuccess: false,
            failureReason: "arrival",
            distanceMeters: arrivalResult.distanceMeters,
            radiusMeters: arrivalResult.radiusMeters,
          },
        });

        return;
      }
    } catch (error) {
      console.error(error);
      alert(
        "GPS 도착 인증에 실패했어요. 위치 권한 또는 현재 위치를 확인해주세요.",
      );
      return;
    }

    try {
      setIsUploading(true);

      const objectKey = await uploadFile(imageFile, "MISSION");

      setIsUploading(false);

      const photoResult = await createPhoto({
        attemptId,
        body: {
          objectKey,
          caption: `${missionTitle} 인증 사진`,
          latitude: currentLocation.lat,
          longitude: currentLocation.lng,
          takenAt: new Date().toISOString(),
        },
      });

      navigate(PATH.MISSION_VERIFY_LOADING, {
        state: {
          missionId,
          attemptId,
          mission,
          missionTitle,
          arrivalResult,
          photoResult,
          isSuccess: true,
        },
      });
    } catch (error) {
      console.error(error);
      setIsUploading(false);

      navigate(PATH.MISSION_VERIFY_LOADING, {
        state: {
          missionId,
          attemptId,
          mission,
          missionTitle,
          arrivalResult,
          isSuccess: true,
          photoUploadFailed: true,
        },
      });
    }
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
            className="inline-flex items-center gap-1 bg-transparent text-[var(--primary-soft)] text-xs font-bold disabled:opacity-40"
            type="button"
            onClick={() => setIsGuideOpen(true)}
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
            장소가 잘 식별되도록 간판, 외관, 내부 공간 중 하나가 보이게
            촬영해서 제출하세요.
          </p>

          <VerificationGuideNotice
            attemptId={attemptId}
            guide={guideForDisplay}
            isLoading={isVerificationGuideLoading && !guideForDisplay}
            isError={isVerificationGuideError && !guideForDisplay}
            isFallback={isUsingFallbackGuide}
            onRetry={() => {
              void refetchVerificationGuide();
            }}
          />

          {attemptId ? (
            <p className="mt-2 rounded-xl bg-[#F4F8FF] px-3 py-2 text-[11px] font-bold text-[#5BB5F8]">
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
                  className="w-full max-h-[300px] object-contain rounded-xl"
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
            {isUploading
              ? "사진 업로드 중..."
              : isSubmitting
                ? "인증 요청 중..."
                : "제출하기"}
          </Button>
        )}
      </section>

      {isGuideOpen ? (
        <VerificationGuideModal
          spotName={spotName}
          guide={guideForDisplay}
          isLoading={isVerificationGuideLoading && !guideForDisplay}
          isError={isVerificationGuideError && !guideForDisplay}
          isFallback={isUsingFallbackGuide}
          hasAttemptId={Boolean(attemptId)}
          onRetry={() => {
            void refetchVerificationGuide();
          }}
          onClose={() => setIsGuideOpen(false)}
        />
      ) : null}
    </div>
  );
}

type VerificationGuideNoticeProps = {
  attemptId: number | null;
  guide?: MissionVerificationGuide;
  isLoading: boolean;
  isError: boolean;
  isFallback: boolean;
  onRetry: () => void;
};

function VerificationGuideNotice({
  attemptId,
  guide,
  isLoading,
  isError,
  isFallback,
  onRetry,
}: VerificationGuideNoticeProps) {
  if (!attemptId) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="mt-2 flex items-center gap-2 rounded-xl bg-[#EAF5FF] px-3 py-2 text-[11px] font-bold text-[#5BB5F8]">
        <Loader2 size={13} className="animate-spin" />
        인증 가이드를 불러오는 중이에요.
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-2 rounded-xl bg-[#FFF1F2] px-3 py-2">
        <div className="flex items-center gap-2 text-[11px] font-bold text-[#E54855]">
          <AlertCircle size={13} />
          인증 가이드를 불러오지 못했어요.
        </div>

        <button
          type="button"
          onClick={onRetry}
          className="mt-2 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[10px] font-black text-[#E54855]"
        >
          <RefreshCw size={11} />
          다시 불러오기
        </button>
      </div>
    );
  }

  if (!guide) {
    return null;
  }

  return (
    <div
      className={[
        "mt-2 rounded-xl px-3 py-2",
        isFallback ? "bg-[#FFF7ED]" : "bg-[#EAF5FF]",
      ].join(" ")}
    >
      <div
        className={[
          "flex items-center gap-2 text-[11px] font-bold",
          isFallback ? "text-[#F59E0B]" : "text-[#5BB5F8]",
        ].join(" ")}
      >
        <Target size={13} />
        인증 가능 반경 {Math.round(guide.radiusMeters)}m
      </div>

      <p className="m-0 mt-1 break-keep text-[10px] font-medium leading-[15px] text-[#6F7B8D]">
        {isFallback
          ? "서버 인증 가이드를 불러오지 못해 미션 장소 좌표 기준으로 안내하고 있어요."
          : "미션 장소 근처에서 위치 인증 후, 장소가 식별되는 사진을 제출해주세요."}
      </p>
    </div>
  );
}

type VerificationGuideModalProps = {
  spotName: string;
  guide?: MissionVerificationGuide;
  isLoading: boolean;
  isError: boolean;
  isFallback: boolean;
  hasAttemptId: boolean;
  onRetry: () => void;
  onClose: () => void;
};

function VerificationGuideModal({
  spotName,
  guide,
  isLoading,
  isError,
  isFallback,
  hasAttemptId,
  onRetry,
  onClose,
}: VerificationGuideModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1C1C3A]/45 px-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="verification-guide-title"
        className="w-full max-w-[330px] rounded-[24px] bg-white px-5 pb-5 pt-4 text-center shadow-[0_18px_40px_rgba(8,37,95,0.28)]"
      >
        <div className="flex justify-end">
          <Button
            size="sm"
            variant="secondary"
            aria-label="인증 가이드 닫기"
            onClick={onClose}
            className="!h-8 !w-8 !rounded-full !p-0"
          >
            <X size={17} />
          </Button>
        </div>

        <div
          className={[
            "mx-auto grid h-14 w-14 place-items-center rounded-[18px]",
            isFallback
              ? "bg-[#FFF7ED] text-[#F59E0B]"
              : "bg-[#EAF5FF] text-[#5BB5F8]",
          ].join(" ")}
        >
          {isLoading ? (
            <Loader2 size={27} strokeWidth={2.4} className="animate-spin" />
          ) : isError ? (
            <AlertCircle size={27} strokeWidth={2.4} />
          ) : (
            <MapPin size={27} strokeWidth={2.4} />
          )}
        </div>

        <h2
          id="verification-guide-title"
          className="mt-4 text-[18px] font-black text-[#1C1C3A]"
        >
          인증 가이드
        </h2>

        {!hasAttemptId ? (
          <p className="mt-3 break-keep text-[13px] leading-6 text-[#6F7B8D]">
            아직 미션 시도 번호가 없어 인증 가이드를 불러올 수 없어요.
            <br />
            미션 상세에서 미션을 시작한 뒤 인증을 진행해주세요.
          </p>
        ) : isLoading ? (
          <p className="mt-3 break-keep text-[13px] leading-6 text-[#6F7B8D]">
            인증 가능한 위치와 반경을 확인하고 있어요.
          </p>
        ) : isError ? (
          <>
            <p className="mt-3 break-keep text-[13px] leading-6 text-[#6F7B8D]">
              인증 가이드를 불러오지 못했어요.
              <br />
              네트워크 상태를 확인한 뒤 다시 시도해주세요.
            </p>

            <Button
              variant="secondary"
              size="md"
              className="mt-4"
              onClick={onRetry}
            >
              다시 불러오기
            </Button>
          </>
        ) : guide ? (
          <>
            <p className="mt-3 break-keep text-[13px] leading-6 text-[#6F7B8D]">
              <strong className="text-[#1C1C3A]">{spotName}</strong> 근처에서
              위치 인증을 진행해주세요.
              <br />
              인증 가능 반경은{" "}
              <strong
                className={isFallback ? "text-[#F59E0B]" : "text-[#5BB5F8]"}
              >
                {Math.round(guide.radiusMeters)}m
              </strong>
              입니다.
            </p>

            {isFallback ? (
              <p className="mt-3 rounded-[14px] bg-[#FFF7ED] px-3 py-2 break-keep text-[11px] font-bold leading-5 text-[#9A6A00]">
                서버 인증 가이드 응답이 없어 미션 상세 좌표 기준으로 안내하고
                있어요.
              </p>
            ) : null}

            <div className="mt-4 rounded-[16px] bg-[#F4F8FF] px-4 py-3 text-left">
              <p className="m-0 text-[11px] font-black text-[#5BB5F8]">
                인증 기준 위치
              </p>

              <p className="m-0 mt-1 text-[11px] font-medium leading-5 text-[#6F7B8D]">
                위도: {guide.targetLatitude}
                <br />
                경도: {guide.targetLongitude}
              </p>
            </div>

            <p className="mt-4 break-keep text-[12px] leading-5 text-[#9BAFC8]">
              사진에는 장소를 식별할 수 있는 간판, 외관, 내부 공간 중 하나가
              포함되면 좋아요.
            </p>
          </>
        ) : (
          <p className="mt-3 break-keep text-[13px] leading-6 text-[#6F7B8D]">
            인증 가이드 정보가 없어요.
          </p>
        )}

        <Button className="mt-5" onClick={onClose}>
          확인
        </Button>
      </section>
    </div>
  );
}