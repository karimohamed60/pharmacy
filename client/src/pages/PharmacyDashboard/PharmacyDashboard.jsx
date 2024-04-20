import { Outlet } from "react-router-dom";
import React, {  useEffect } from "react";
import LogoutButton from "../../auth/LogoutButton";


const PharmacyDashboard = () => {
 useEffect(() => {
    // Remove scroll bar
    document.body.style.overflow = "hidden";

    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  return (
    <>
      <Outlet />


<LogoutButton/>
    </>
  );
};

export default PharmacyDashboard;
