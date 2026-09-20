import { useState } from "react";
import { Loader2, MapPin, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { PATH } from "@/routes/paths";

type PermissionState = "idle" | "requesting" | "denied" | "unavailable";

export default function LocationGuidePage() {
  const navigate = useNavigate();
  const [permissionState, setPermissionState] =
    useState<PermissionState>("idle");

  const moveHome = () => navigate(PATH.HOME, { replace: true });

  const handleAllowLocation = () => {
    if (!navigator.geolocation) {
      setPermissionState("unavailable");
      return;
    }

    setPermissionState("requesting");
    navigator.geolocation.getCurrentPosition(
      moveHome,
      () => setPermissionState("denied"),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000 * 60 * 5,
      },
    );
  };

  const isRequesting = permissionState === "requesting";

  return (
    <main className="flex min-h-dvh flex-col justify-center bg-white px-[24px] py-[max(28px,env(safe-area-inset-top),env(safe-area-inset-bottom))] text-[#1f2940]">
      <section className="flex w-full flex-col items-center text-center">
        <div className="grid h-[86px] w-[86px] place-items-center rounded-full bg-[#e7f5ff] text-[#4ba9e9] shadow-[0_12px_30px_rgba(72,168,233,0.16)]">
          <MapPin aria-hidden="true" size={43} strokeWidth={2.25} />
        </div>

        <h1 className="mt-[22px] break-keep text-[23px] font-black leading-[1.3] tracking-[-0.6px] text-[#1f2940]">
          위치를 허용하고
          <br />
          가까운 미션을 찾아보세요
        </h1>

        <p className="mt-[14px] break-keep text-[13px] font-medium leading-[1.7] text-[#8c98a7]">
          현재 위치를 사용하면 주변 관광지와 미션을 찾고,
          <br />
          방문 장소에서 GPS 인증을 진행할 수 있어요.
        </p>

        <section className="mt-[26px] w-full rounded-[18px] border border-[#b9ddf5] bg-[#f3faff] px-[17px] py-[16px] text-left">
          <div className="flex items-center gap-2 text-[#318fce]">
            <Smartphone aria-hidden="true" size={18} strokeWidth={2.3} />
            <h2 className="text-[13px] font-extrabold">iPhone 사용자 안내</h2>
          </div>

          <p className="mt-3 text-[11px] font-medium leading-[1.65] text-[#6f7f91]">
            Safari에서 위치가 확인되지 않으면 아래 경로에서 위치 접근을
            허용해주세요.
          </p>

          <div className="mt-3 rounded-[12px] bg-white px-3 py-3 text-[11px] font-bold leading-[1.75] text-[#52677b] shadow-[0_3px_10px_rgba(64,122,164,0.08)]">
            설정 → 개인정보 보호 및 보안 → 위치 서비스
            <br />→ Safari 웹 사이트 → 앱을 사용하는 동안
          </div>
        </section>

        {permissionState === "denied" ? (
          <p className="mt-4 break-keep text-[11px] font-bold leading-5 text-[#e46f6f]" role="alert">
            위치 권한이 허용되지 않았어요. 위 설정을 확인하거나 나중에
            다시 허용해주세요.
          </p>
        ) : permissionState === "unavailable" ? (
          <p className="mt-4 break-keep text-[11px] font-bold leading-5 text-[#e46f6f]" role="alert">
            현재 브라우저에서는 위치 기능을 사용할 수 없어요.
          </p>
        ) : null}
      </section>

      <div className="mt-7 w-full">
        <button
          className="type-body6 flex h-[54px] w-full items-center justify-center gap-2 rounded-[16px] bg-[linear-gradient(135deg,#63bdf7,#48a8eb)] text-white shadow-[0_8px_20px_rgba(65,165,231,0.24)] transition active:scale-[0.99] disabled:cursor-wait disabled:opacity-70"
          disabled={isRequesting}
          onClick={handleAllowLocation}
          type="button"
        >
          {isRequesting ? (
            <>
              <Loader2 aria-hidden="true" size={17} className="animate-spin" />
              위치 확인 중...
            </>
          ) : (
            "위치 허용하고 시작하기"
          )}
        </button>

        <button
          className="mt-3 h-11 w-full bg-transparent text-[13px] font-bold text-[#8794a3]"
          onClick={moveHome}
          type="button"
        >
          나중에 하기
        </button>

        <p className="mt-5 text-center text-[10px] font-medium text-[#a1abb6]">
          위치 권한은 기기 설정에서 언제든 변경할 수 있어요.
        </p>
      </div>
    </main>
  );
}
