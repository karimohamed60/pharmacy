import { Outlet } from "react-router-dom";
import React, { useEffect } from "react";
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
      <MedicineList />
    </>
  );
};

export default PharmacyDashboard;
