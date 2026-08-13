import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { PATH } from "../routes/paths";

export default function BottomNavigationLayout() {
  return (
    <>
      <main className="pb-[92px]">
        <Outlet />
      </main>

      <BottomNavigation />
    </>
  );
}
const BottomNavigation = () => {
  return (
    <nav className="fixed bottom-0 left-1/2 z-10 w-full max-w-[430px] -translate-x-1/2">
      <NavLink to={PATH.HOME}>홈</NavLink>
      <NavLink to={PATH.MISSIONS}>미션</NavLink>
      <NavLink to={PATH.MAP}>지도</NavLink>
      <NavLink to={PATH.REWARDS}>보상</NavLink>
      <NavLink to={PATH.MY}>마이</NavLink>
    </nav>
  );
};
