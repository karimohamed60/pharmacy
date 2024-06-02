import { Outlet } from "react-router-dom";
import "./InventoryDashboard.css";
import React, { useState, useEffect } from "react";
import { API_URL } from "../../constants";
import { getAuthTokenCookie } from "../../services/authService";
import Isidebar from "../../components/InventoryDashboard/Isidebar/Isidebar";

const InventoryDashboard = () => {

  return (
    <>
      <Isidebar />
      <Outlet />
    </>
  );
};

export default InventoryDashboard;
