import { Navigate, Outlet, useLocation } from "react-router-dom";
import { PATH } from "@/routes/paths";
import { getAccessToken } from "@/utils/auth";

function ProtectedRoute() {
  const location = useLocation();

  if (!getAccessToken()) {
    return <Navigate replace state={{ from: location.pathname }} to={PATH.LOGIN} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
