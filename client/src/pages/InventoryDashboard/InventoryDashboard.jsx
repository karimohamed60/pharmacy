import { Outlet } from "react-router-dom";
import "./InventoryDashboard.css";
import React, { useState, useEffect } from "react";
import { API_URL } from "../../constants";
import { getAuthTokenCookie } from "../../services/authService";
import Isidebar from "../../components/InventoryDashboard/Isidebar/Isidebar";

const InventoryDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isInvOpen, setIsInvOpen] = useState(false);
  const [isMedOpen, setIsMedOpen] = useState(false);
  const [isTranOpen, setIsTranOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [hasMargin, setHasMargin] = useState(false);
  const [hasMarginForTran, setHasMarginForTran] = useState(false);

  const toggleDropdown2 = (shouldOpen) => {
    setIsOpen(shouldOpen);
  };

  const InvtoggleDropdown = () => {
    setIsInvOpen(!isInvOpen);
  };

  const MedtoggleDropdown = () => {
    setIsMedOpen(!isMedOpen);
    setHasMargin(true);

    setHasMargin(!isMedOpen);
  };
  const TrantoggleDropdown = () => {
    setIsTranOpen(!isTranOpen);
    setHasMarginForTran(true);

    setHasMarginForTran(!isTranOpen);
  };

  useEffect(() => {
    // Remove scroll bar
    document.body.style.overflow = "hidden";

    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);
  // To retreive no of categories
  useEffect(() => {
    async function loadCategories() {
      const token = getAuthTokenCookie();
      if (token) {
        const response = await fetch(`${API_URL}/categories`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const responseData = await response.json();
          setCategories(responseData.data);
          const lastCategoryId = categories[categories.length - 1]?.id;
          const dataArray = responseData.data;
          for (let i = 0; i < dataArray.length; i++) {
            window.currentItem = dataArray[i].id;
          }
          window.id = currentItem;
        } else {
          throw response;
        }
      } else {
        setError("An error occured");
        console.log("An error", e);
      }
    }
    loadCategories();
  }, []);
  //to get the total numbers of medicines
  useEffect(() => {
    async function loadMedicines() {
      const token = getAuthTokenCookie();
      if (token) {
        const response = await fetch(`${API_URL}/medicines`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const responseData = await response.json();
          setMedicines(responseData.data);

          // setTotalMedicines(responseData.meta.total);

          window.total_medicines = responseData.total_medicines;
        } else {
          throw response;
        }
      } else {
        setError("An error occured");
        console.log("An error", e);
      }
    }
    loadMedicines();
  }, []);
  //to show total invoices
  useEffect(() => {
    async function loadInvoices() {
      const token = getAuthTokenCookie();
      if (token) {
        const response = await fetch(`${API_URL}/invoices`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const responseData = await response.json();
          setInvoices(responseData.data);
          window.total_invoices = responseData.total_invoices;
        } else {
          throw response;
        }
      } else {
        setError("An error occurred");
      }
    }
    loadInvoices();
  }, []);
  return (
    <>
      <Isidebar />
      <Outlet />
    </>
  );
};

export default InventoryDashboard;
