import { Outlet } from "react-router-dom";
import "./InventoryDashboard.css";
import React, { useEffect } from "react";

import Isidebar from "../../components/InventoryDashboard/Isidebar/Isidebar";
import Medicinelist from "../../components/InventoryDashboard/Medicines/medicinelist/medicinelist";

const InventoryDashboard = () => {
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

      <Isidebar />
    </>
  );
};

export default InventoryDashboard;
