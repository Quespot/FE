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
      <main className="min-h-full pb-[96px]">
        <Outlet />
      </main>

      <BottomNavigation />
    </>
  );
}

const BottomNavigation = () => {
  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 rounded-t-[28px] bg-white shadow-[0_-4px_12px_rgba(8,37,95,0.08)]">
      <ul className="flex h-[93px] items-start justify-between px-[15px] pt-[10px]">
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
          <li key={path} className="flex flex-1 justify-center">
            <NavLink
              to={path}
              className={({ isActive }) =>
                [
                  "relative flex h-[58px] w-[78px] flex-col items-center justify-start gap-[4px] pt-[10px]",
                  "transition-colors duration-150",
                  isActive ? "text-primary" : "text-[#C8E8FF]",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  <span className="flex h-[26px] w-[26px] items-center justify-center">
                    <Icon className="block h-[24px] w-[24px] shrink-0" />
                  </span>

                  <span
                    className={[
                      "block h-[14px] text-center text-[11px] font-black leading-[14px]",
                      isActive ? "text-primary" : "text-[#A8B9CC]",
                    ].join(" ")}
                  >
                    {label}
                  </span>

                  {isActive ? (
                    <span className="absolute bottom-0 left-1/2 h-[3px] w-[24px] -translate-x-1/2 rounded-full bg-primary" />
                  ) : null}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};