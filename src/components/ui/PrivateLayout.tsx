import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

function PrivateLayout() {
  return (
    <div>
      <NavBar />
      <Outlet />
    </div>
  );
}

export default PrivateLayout;
