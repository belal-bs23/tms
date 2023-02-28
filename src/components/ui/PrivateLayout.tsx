import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import { useAppSelector } from "../../app/hooks";
import { selectAuthIsLoggedIn } from "../../features/auth/authSlice";
import { ROUTES } from "../../routes/routes";

function PrivateLayout() {
  const isLoggedIn = useAppSelector(selectAuthIsLoggedIn);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      if (!location.pathname.startsWith(ROUTES.AUTH)) {
        navigate(ROUTES.AUTH);
      }
    }
  }, [isLoggedIn, location, navigate]);
  return (
    <div>
      {isLoggedIn && <NavBar />}
      <div className="container px-10">
        <Outlet />
      </div>
    </div>
  );
}

export default PrivateLayout;
