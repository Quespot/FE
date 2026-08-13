import { Outlet } from "react-router-dom";

export default function MobileLayout() {
  return (
    <div className="flex min-h-[100dvh] justify-center bg-gray-50">
      <div className="relative min-h-dvh w-full max-w-[430px] bg-white shadow-md">
        <Outlet />
      </div>
    </div>
  );
}
