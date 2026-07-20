import type { PropsWithChildren, ReactNode } from "react";
import { BatteryMedium, ChevronLeft, Signal, Wifi } from "lucide-react";

type DeviceFrameProps = PropsWithChildren<{
  className?: string;
}>;

export function DeviceFrame({ children, className = "" }: DeviceFrameProps) {
  return (
    <section className={`device-frame ${className}`}>
      <StatusBar />
      <div className="device-content">{children}</div>
    </section>
  );
}

export function StatusBar() {
  return (
    <div className="status-bar" aria-hidden="true">
      <strong>9:41</strong>
      <span className="status-icons">
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
    <header className="sub-header">
      <button className="icon-circle" onClick={onBack} type="button" aria-label="뒤로 가기">
        {backIcon ? <img src={backIcon} alt="" /> : <ChevronLeft size={18} strokeWidth={2.8} />}
      </button>
      <h1>{title}</h1>
      {action ? <div className="sub-header-action">{action}</div> : null}
    </header>
  );
}
