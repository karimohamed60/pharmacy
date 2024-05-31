import { Link, Outlet } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Sidebar from "../../components/PharmacyDashboard/Sidebar/Sidebar";
import LogoutButton from "../../auth/LogoutButton";
import MedicineList from "../../components/PharmacyDashboard/Medicine/MedicineList/MedicineList";


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
{/* Sidebar */}

<Sidebar/>

<MedicineList/>

    </>
  );
};

export default PharmacyDashboard;
