import { Link } from "react-router-dom";
import "./SalafRequest.css";
import React, { useState, useEffect } from "react";
import Sidebar from "../../PharmacyDashboard/Sidebar/Sidebar";
const SalafRequest = () => {

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
      <Sidebar />

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-caret-right-fill Arrowicon"
        viewBox="0 0 16 16"
      >
        <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
      </svg>
      <div>
        <label className="salaf-title">
          <b>Salaf</b>
        </label>
      </div>
      <label className="salf-Title">
        <b>Send Request</b>
      </label>

      <div className="s-container">
        <div className="newrequest-title mb-5">
          <label>New Request</label>

        </div>

        <form>
          <div className="s-row">
            <div className="s-form-group">
                <label className="s-label s-national">National ID:</label>
                <select className="s-select mb-4"></select>
              </div>
              </div>
            <div className="s-form-group">
                <label className="s-label">Student Name:</label>
                <input
                  className="s-input mb-4"
                  type="text"
                />
              </div>
              <div className="s-form-group">
                <label className="s-label">Medicine ID:</label>
                <input
                  className="s-input mb-5"
                  type="text"

                />
              </div>

          <button className="s-confirm-btn " type="submit">
            <b>Send </b>
          </button>
        </form>
      </div>
    </>
  );
};
export default SalafRequest;
