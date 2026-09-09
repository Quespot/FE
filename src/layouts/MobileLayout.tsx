import { Outlet } from "react-router-dom";

export default function MobileLayout() {
  return (
    <div className="flex min-h-[100dvh] justify-center bg-[linear-gradient(143deg,#c8e8ff_0%,#eaf5ff_50%,#d4ecff_100%)] border-r border-[rgba(221,228,238,0.8)]">
      <div className="relative min-h-dvh w-full max-w-[430px] bg-white shadow-md">
        <Outlet />
      </div>
    </div>
  );
}
