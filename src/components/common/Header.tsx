import { Bell } from "lucide-react";
import questyProfile from "@/assets/questy.svg";
import { useNavigate } from "react-router-dom";
import { PATH } from "@/routes/paths";
import { ReactNode } from "react";

interface HeaderProps {
  children?: ReactNode;
}
export function Header({ children }: HeaderProps) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-20 flex min-h-[66px] shrink-0 items-center justify-between border-b border-[#dcecf8] bg-white/95 px-[22px] backdrop-blur-xl">
      <button
        className="flex items-center gap-2"
        onClick={() => navigate(PATH.HOME)}
      >
        <img className="h-8 w-8 object-contain" src={questyProfile} alt="" />
        <strong className="text-[21px] font-black tracking-[-0.6px] text-[#54b4f6]">
          Quespot
        </strong>
      </button>
      <div className="flex items-center gap-1">
        {children}
        <button
          className="relative grid h-10 w-10 place-items-center bg-transparent text-[#8290a2] transition active:scale-95"
          type="button"
          aria-label="알림 3개"
          onClick={() => navigate(PATH.NOTIFICATION)}
        >
          <Bell size={19} strokeWidth={2.2} />
          <span className="absolute right-[1px] top-[1px] grid h-[16px] min-w-[16px] place-items-center rounded-full border-2 border-white bg-[#f26464] px-0.5 text-[8px] font-black leading-none text-white">
            3
          </span>
        </button>
      </div>
    </header>
  );
}
