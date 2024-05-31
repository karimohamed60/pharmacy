import { Outlet, Navigate } from "react-router-dom";
import { getAuthTokenCookie } from "../services/authService";

const PrivateRoutes = () => {
  const token = getAuthTokenCookie();

  return token ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
