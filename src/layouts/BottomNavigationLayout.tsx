import { NavLink, Outlet } from "react-router-dom";
import { PATH } from "../routes/paths";

import HomeIcon from "@/assets/icons/home.svg?react";
import MissionIcon from "@/assets/icons/mission.svg?react";
import MapIcon from "@/assets/icons/map.svg?react";
import RewardIcon from "@/assets/icons/reward.svg?react";
import MyIcon from "@/assets/icons/my.svg?react";

const NAV_ITEMS = [
  {
    label: "홈",
    path: PATH.HOME,
    icon: HomeIcon,
  },
  {
    label: "미션",
    path: PATH.MISSIONS,
    icon: MissionIcon,
  },
  {
    label: "지도",
    path: PATH.MAP,
    icon: MapIcon,
  },
  {
    label: "보상",
    path: PATH.REWARDS,
    icon: RewardIcon,
  },
  {
    label: "MY",
    path: PATH.MY,
    icon: MyIcon,
  },
];

export default function BottomNavigationLayout() {
  return (
    <>
      <main className="flex h-full min-h-0 w-full flex-1 flex-col bg-[#F4F8FF] pb-[80px]">
        <Outlet />
      </main>

      <BottomNavigation />
    </>
  );
}

const BottomNavigation = () => {
  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 bg-white shadow-[0_-4px_8px_rgba(0,0,0,0.08)]">
      <ul className="flex h-[80px] items-center">
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
          <li key={path} className="flex-1">
            <NavLink
              to={path}
              className={({ isActive }) =>
                `relative flex h-[64px] flex-col items-center justify-center gap-[4px] ${
                  isActive ? "text-primary" : "text-[#C8E8FF]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="h-[24px] w-[24px] shrink-0" />

                  <span className="text-[9px] font-bold leading-none">
                    {label}
                  </span>

                  {isActive && (
                    <span className="absolute bottom-[2px] h-[2px] w-[16px] rounded-full bg-primary" />
                  )}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};