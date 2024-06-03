import React, { useEffect, useState } from "react";
import "./TransferDetails.css";
import { Link, useParams } from "react-router-dom";
import "reactjs-popup/dist/index.css";
import { getAuthTokenCookie } from "../../../../services/authService";
import { API_URL } from "../../../../constants";
const TransferDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transfers, setTransfers] = useState([]);
  const [medicinesData, setMedicinesData] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    // Remove scroll bar
    document.body.style.overflow = "hidden";
    handleSpecificTransferbyId(id);
    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);
  const handleSpecificTransferbyId = async (transfer_id) => {
    try {
      const token = getAuthTokenCookie();
      const response = await fetch(`${API_URL}/transfers/${transfer_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        setTransfers(responseData.data);
        setMedicinesData(responseData.data.attributes.medicines);
        window.transfer_id = responseData.data.attributes.id;
        window.username = responseData.data.attributes.user.username;
        window.created_at = responseData.data.attributes.created_at;
        window.transferstatus = responseData.data.attributes.status;
        window.medicine_name =
          responseData.data.attributes.medicines.medicine_name;
      } else {
        throw new Error("Failed to fetch category details");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-caret-right-fill arrowicon"
        viewBox="0 0 16 16"
      >
        <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
      </svg>
      <div>
        <label className="center2">
          <b>Transfers</b>
        </label>
      </div>
      <label>
        <b className="TransferDetails-label">Transfers Details</b>
      </label>
      <div className="col-12-lg backbtn ">
        <Link to={"/inventory-dashboard/transferList"}>
          <button className=" butnn2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-arrow-left-circle-fill"
              viewBox="0 0 16 16"
            >
              <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
            </svg>
            <b id="back-btn"> Back</b>
          </button>
        </Link>
      </div>
      <Link to={"/inventory-dashboard/updateDetails"}>
        <button type="button" className="btn btn-light butnn" id="oooo">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-pencil-fill"
            viewBox="0 1 16 16"
          >
            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
          </svg>
          <b className="updatelabel">Update Details</b>
        </button>
      </Link>
      <div className="td-container">
        <h2 className="transfer-title">Transfer Details</h2>

        <form className="">
          <div className="td-row">
            <div className="td-form-group">
              <label className="td-form-label">Transfer Id</label>
              <input
                className="td-input"
                type="text"
                placeholder={window.transfer_id}
                disabled
              />
            </div>
            <div className="td-form-group">
              <label className="td-form-label">Created by</label>
              <input
                className="td-input"
                type="text"
                placeholder={window.username}
                disabled
              />
            </div>
          </div>
          <div className="td-column ">
            <div className="td-row">
              <div className="td-form-group">
                <label className="td-form-label">Status</label>
                <input
                  className="td-input"
                  type="text"
                  placeholder={window.transferstatus}
                  disabled
                />
              </div>
              <div className="td-form-group">
                <label className="td-form-label">Created At</label>
                <input
                  className="td-input"
                  type="text"
                  placeholder={window.created_at}
                  disabled
                />
              </div>
            </div>
          </div>
        </form>
        <div className="transfer-details-container">
          <table className="table tdet-table">
            <thead>
              <tr>
                <th itemScope="col">Medicine Name</th>
                <th scope="col">Quantity</th>
              </tr>
            </thead>
            <tbody className="ml-tbody">
              {medicinesData.map((item, index) => (
                <tr key={index} className="medicine-container">
                  <td>{item.medicine_name}</td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TransferDetails;
