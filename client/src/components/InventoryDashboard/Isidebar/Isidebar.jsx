import React, { useState, useEffect } from "react";
import logo from "../../../assets/Images/logouni 7.png";
import "./Isidebar.css";
import IsidebarItem from "./IsidebarItem";
import items from "../../../data/Isidebar.json";
import LogoutButton from "../../../auth/LogoutButton";
import { Link } from "react-router-dom";

const Isidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleClose = (shouldOpen) => {
    setIsOpen(shouldOpen);
  };

  useEffect(() => {
    // Remove scroll bar
    document.body.style.overflow = "hidden";

    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  return (
    <div
      className="isidenav"
      style={{
        marginLeft: isOpen ? "0" : "-272px",
        backgroundColor: "#032B55",
      }}
    >
      {
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            fill="white"
            className="bi bi-list iside-baricon"
            viewBox="0 0 16 16"
            aria-expanded={isOpen ? "true" : "false"}
            onClick={() => toggleClose(!isOpen)}
          >
            <path
              fillRule="evenodd"
              d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
            />
          </svg>
          <img id="inventoryImage" src={logo} />
          <label id="inventorydashboardlabel">
            <b>Inventory</b>
          </label>
          {items.map((item, index) => (
            <IsidebarItem key={index} item={item} />
          ))}
        </>
      }
      <LogoutButton />
    </div>
  );
};

export default Isidebar;
