import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { PATH } from "@/routes/paths";
import QuestyMainSvg from "@/assets/icons/QuestyMain.svg";

type HomeHeaderProps = {
  mascotSrc?: string;
  notificationCount?: number;
  onBellClick?: () => void;
  onLogoClick?: () => void;
  className?: string;
};

export default function HomeHeader({
  notificationCount = 0,
  onBellClick,
  onLogoClick,
  className = "",
}: HomeHeaderProps) {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
      return;
    }

    navigate(PATH.HOME);
  };

  return (
    <header
      className={[
        "flex h-[72px] w-full shrink-0 items-center justify-between bg-white px-[16px]",
        className,
      ].join(" ")}
    >
      <button
        type="button"
        onClick={handleLogoClick}
        className="flex min-w-0 items-center gap-[8px] bg-transparent p-0 text-left transition active:scale-[0.98]"
        aria-label="홈으로 이동"
      >
        <img
          src={QuestyMainSvg}
          alt="Quespot"
          className="h-[34px] w-[34px] shrink-0 object-contain"
        />

        <span className="text-[22px] font-black leading-none tracking-[-0.4px] text-[#7DBDFF]">
          Quespot
        </span>
      </button>

      <button
        type="button"
        onClick={onBellClick}
        className="relative grid h-[40px] w-[40px] shrink-0 place-items-center rounded-full bg-transparent text-[#A2A9B2] transition active:scale-[0.96]"
        aria-label="알림 보기"
      >
        <Bell size={22} strokeWidth={2.2} />

        {notificationCount > 0 ? (
          <span className="absolute right-[5px] top-[5px] grid h-[17px] min-w-[17px] place-items-center rounded-full bg-[#FF4D67] px-[4px] text-[10px] font-black leading-none text-white">
            {notificationCount > 99 ? "99+" : notificationCount}
          </span>
        ) : null}
      </button>
    </header>
  );
}