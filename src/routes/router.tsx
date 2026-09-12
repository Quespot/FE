import { createBrowserRouter, Navigate } from "react-router-dom";

import { PATH } from "@/routes/paths";
import MobileLayout from "@/layouts/MobileLayout";
import BottomNavigationLayout from "@/layouts/BottomNavigationLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";

import HomePage from "@/pages/HomePage";

import LoginPage from "@/pages/Auth/LoginPage";
import OAuthCallbackPage from "@/pages/Auth/OAuthCallbackPage";
import SignupPage from "@/pages/Auth/SignupPage";
import SignupCheckPage from "@/pages/Auth/SignupCheckPage";
import ProfileSetupPage from "@/pages/Auth/ProfileSetupPage";

import MissionsPage from "@/pages/mission/MissionPage";
import MissionDetailPage from "@/pages/mission/MissionDetailPage";
import MissionRecordPage from "@/pages/mission/MissionRecordPage";
import LocalRecommendPage from "@/pages/mission/LocalRecommendPage";
import BonusRegionPage from "@/pages/mission/BonusRegionPage";
import MissionRoutePage from "@/pages/mission/MissionRoutePage";
import MissionCourseCreatePage from "@/pages/mission/MissionCourseCreatePage";
import VerifyPage from "@/pages/mission/verify/VerifyPage";
import VerifyLoadingPage from "@/pages/mission/verify/VerifyLoadingPage";
import VerifyResultPage from "@/pages/mission/verify/VerifyResultPage";

import MapPage from "@/pages/MapPage";
import RewardPage from "@/pages/RewardPage";
import LocalCouponPage from "@/pages/LocalCouponPage";
import NotificationPage from "@/pages/NotificationPage";

import MyPage from "@/pages/My/MyPage";
import LikesPage from "@/pages/My/LikesPage";
import SavedPlacesPage from "@/pages/My/SavedPlacesPage";
import ArchivePage from "@/pages/My/ArchivePage";
import QuestyCustomizePage from "@/pages/My/QuestyCustomizePage";

export const router = createBrowserRouter([
  {
    element: <MobileLayout />,
    children: [
      {
        path: PATH.LANDING,
        element: <Navigate to={PATH.HOME} replace />,
      },
      {
        path: PATH.LOGIN,
        element: <LoginPage />,
      },
      {
        path: PATH.OAUTH_CALLBACK,
        element: <OAuthCallbackPage />,
      },
      {
        path: PATH.SIGNUP,
        element: <SignupPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: PATH.SIGNUP_CHECK,
            element: <SignupCheckPage />,
          },
          {
            path: PATH.PROFILE_SETUP,
            element: <ProfileSetupPage />,
          },

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
            path: PATH.NOTIFICATION,
            element: <NotificationPage />,
          },
          {
            path: PATH.MAP_SEARCH,
            element: <Navigate to={PATH.MAP} replace />,
          },
          {
            path: PATH.MISSION_DETAIL,
            element: <MissionDetailPage />,
          },
          {
            path: PATH.MISSION_COURSE_CREATE,
            element: <MissionCourseCreatePage />,
          },
          {
            path: PATH.MISSION_VERIFY,
            element: <VerifyPage />,
          },
          {
            path: PATH.MISSION_VERIFY_LOADING,
            element: <VerifyLoadingPage />,
          },
          {
            path: PATH.MISSION_VERIFY_RESULT,
            element: <VerifyResultPage />,
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
          {
            path: PATH.MISSION_ROUTE,
            element: <MissionRoutePage />,
          },
          {
            path: PATH.QUESTY_CUSTOMIZE,
            element: <QuestyCustomizePage />,
          },
          {
            path: PATH.PROFILE_DETAILS,
            element: <ProfileSetupPage />,
          },
          {
            path: PATH.LIKES,
            element: <LikesPage />,
          },
          {
            path: PATH.SAVED_PLACES,
            element: <SavedPlacesPage />,
          },
          {
            path: PATH.ARCHIVE,
            element: <ArchivePage />,
          },
          {
            path: PATH.REWARD_COUPONS,
            element: <LocalCouponPage />,
          },
          {
            path: PATH.NOT_FOUND,
            element: <Navigate to={PATH.HOME} replace />,
          },
        ],
      },
    ],
  },
]);