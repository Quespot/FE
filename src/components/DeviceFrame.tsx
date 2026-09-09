import type { PropsWithChildren, ReactNode } from "react";
import { BatteryMedium, ChevronLeft, Signal, Wifi } from "lucide-react";

type DeviceFrameProps = PropsWithChildren<{
  className?: string;
}>;

export function DeviceFrame({ children, className="" }: DeviceFrameProps) {
  return (
    <section className={`flex flex-col w-[390px] min-h-[844px] overflow-hidden rounded-[44px] bg-[var(--app-bg)] [box-shadow:0_40px_100px_rgba(43,_143,_219,_0.25),_0_8px_32px_rgba(0,_0,_0,_0.08)] max-[820px]:max-w-[calc(100vw_-_28px)] ${className}`}>
      <StatusBar />
      <div className="flex-1 overflow-hidden flex flex-col bg-[#f2f7ff]">{children}</div>
    </section>
  );
}

export function StatusBar() {
  return (
    <div className="flex items-center justify-between min-h-[33px] py-2 px-6 bg-white text-[11px] font-bold min-h-8 p-[9px_20px] bg-[var(--surface)] text-[9px]" aria-hidden="true">
      <strong>9:41</strong>
      <span className="w-5 h-[3px] overflow-hidden rounded-full bg-[rgba(8,_37,_95,_0.4)] text-transparent text-[var(--muted-2)] inline-flex items-center gap-[7px]">
        <Signal size={14} strokeWidth={2.6} />
        <Wifi size={14} strokeWidth={2.6} />
        <BatteryMedium size={15} strokeWidth={2.6} />
      </span>
    </div>
  );
}

type SubHeaderProps = {
  title: string;
  action?: ReactNode;
  backIcon?: string;
  onBack?: () => void;
};

export function SubHeader({ title, action, backIcon, onBack }: SubHeaderProps) {
  return (
    <header className="flex items-center gap-3 h-[57px] py-3 px-4 [border-bottom:1px_solid_var(--sky-100)] bg-white">
      <button className="grid place-items-center w-8 h-8 rounded-full bg-[var(--sky-100)] text-[var(--primary-soft)] text-[22px] leading-none" onClick={onBack} type="button" aria-label="뒤로 가기">
        {backIcon ? <img className="w-[17px] h-[17px]" src={backIcon} alt="" /> : <ChevronLeft size={18} strokeWidth={2.8} />}
      </button>
      <h1 className="flex-1 m-0 text-sm font-black">{title}</h1>
      {action ? <div className="flex items-center">{action}</div> : null}
    </header>
  );
}

