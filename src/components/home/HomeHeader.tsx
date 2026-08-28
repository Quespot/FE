import { Bell } from "lucide-react";

type HomeHeaderProps = {
  mascotSrc: string;
  notificationCount?: number;
  onBellClick?: () => void;
};

export default function HomeHeader({
  mascotSrc,
  notificationCount = 0,
  onBellClick,
}: HomeHeaderProps) {
  return (
    <header className="-mx-[18px] flex min-h-[62px] items-center justify-between bg-white px-[22px]">
      <div className="flex items-center gap-2">
        <img
          className="h-[34px] w-[34px] object-contain"
          src={mascotSrc}
          alt="Quespot 캐릭터"
        />
        <strong className="block text-[24px] font-black leading-none text-[#5bb5f8]">
          Quespot
        </strong>
      </div>

      <button
        className="relative grid h-9 w-9 place-items-center rounded-full bg-transparent text-[#b7c2d1]"
        type="button"
        aria-label="알림"
        onClick={onBellClick}
      >
        <Bell size={19} strokeWidth={2.4} />

        {notificationCount > 0 ? (
          <span className="absolute right-0 top-[2px] grid h-[18px] w-[18px] place-items-center rounded-full border-2 border-white bg-red-500 text-[10px] font-black text-white">
            {notificationCount}
          </span>
        ) : null}
      </button>
    </header>
  );
}