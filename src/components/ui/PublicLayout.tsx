import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectAuthIsLoggedIn } from "../../features/auth/authSlice";
import { ROUTES } from "../../routes/routes";

function PublicLayout() {
  const isLoggedIn = useAppSelector(selectAuthIsLoggedIn);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      if (location.pathname.startsWith(ROUTES.AUTH)) {
        navigate(ROUTES.HOME);
      }
    }
  }, [isLoggedIn, location, navigate]);
  return (
    <div
      style={{
        paddingTop: "50px",
        justifyContent: "center",
        alignItems: "center",
      }}
      className="container"
    >
      <Outlet />
    </div>
  );
}

export default PublicLayout;
