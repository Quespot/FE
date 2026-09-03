import { createBrowserRouter } from "react-router-dom";
import { PATH } from "@/routes/paths";
import MobileLayout from "@/layouts/MobileLayout";
import BottomNavigationLayout from "@/layouts/BottomNavigationLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";

import LandingPage from "@/pages/LandingPage";
import HomePage from "@/pages/HomePage";
import MissionsPage from "@/pages/mission/MissionPage";
import MissionDetailPage from "@/pages/mission/MissionDetailPage";
import MissionPhotoPage from "@/pages/mission/MissionPhotoPage";
import MissionRecordPage from "@/pages/mission/MissionRecordPage";
import LocalRecommendPage from "@/pages/mission/LocalRecommendPage";
import BonusRegionPage from "@/pages/mission/BonusRegionPage";
import MapPage from "@/pages/MapPage";
import RewardPage from "@/pages/RewardPage";
import MyPage from "@/pages/MyPage";
import QuestyCustomizePage from "@/pages/QuestyCustomizePage";
import LoginPage from "@/pages/Auth/LoginPage";
import SignupPage from "@/pages/Auth/SignupPage";
import SignupCheckPage from "@/pages/Auth/SignupCheckPage";
import MissionRoutePage from "@/pages/mission/MissionRoutePage";

export const router = createBrowserRouter([
  {
    element: <MobileLayout />,
    children: [
      {
        path: PATH.LANDING,
        element: <LandingPage />,
      },
      {
        path: PATH.LOGIN,
        element: <LoginPage />,
      },
      {
        path: PATH.SIGNUP,
        element: <SignupPage />,
      },
      {
        path: PATH.SIGNUP_CHECK,
        element: <SignupCheckPage />,
      },

      {
        element: <ProtectedRoute />,
        children: [
          // 하단 내비게이션이 필요한 페이지
          {
            element: <BottomNavigationLayout />,
            children: [
              {
                path: PATH.HOME,
                element: <HomePage />,
              },
              {
                path: PATH.MISSIONS,
                element: <MissionsPage />,
              },
              {
                path: PATH.MAP,
                element: <MapPage />,
              },
              {
                path: PATH.REWARDS,
                element: <RewardPage />,
              },
              {
                path: PATH.MY,
                element: <MyPage />,
              },
            ],
          },

          // 하단 내비게이션이 필요 없는 페이지
          {
            path: PATH.MISSION_DETAIL,
            element: <MissionDetailPage />,
          },
          {
            path: PATH.MISSION_PHOTO,
            element: <MissionPhotoPage />,
          },
          {
            path: PATH.MISSION_RECORD,
            element: <MissionRecordPage />,
          },
          {
            path: PATH.MISSION_LOCAL_RECOMMEND,
            element: <LocalRecommendPage />,
          },
          {
            path: PATH.MISSION_BONUS_REGION,
            element: <BonusRegionPage />,
          },
          { path: PATH.MISSION_ROUTE, 
            element: <MissionRoutePage /> },
          {
            path: PATH.QUESTY_CUSTOMIZE,
            element: <QuestyCustomizePage />,
          },
        ],
      },
    ],
  },
]);