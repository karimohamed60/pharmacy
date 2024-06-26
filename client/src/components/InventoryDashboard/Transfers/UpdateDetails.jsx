import React, { useEffect, useState } from "react";
import "./UpdateDetails.css";
import { Link ,useParams } from "react-router-dom";
import { getAuthTokenCookie } from "../../../services/authService";
import { API_URL } from "../../../constants";
import Cookies from "js-cookie";
const UpdateDetails = () => {
  const [updatedAt, setUpdatedAt] = useState(""); // Set an initial date value
  const [transferId, setTransferId] = useState("");
  const [transfer, setTransfer] = useState({});
  const [transferIdWarning, setTransferIdWarning] = useState("");
  const [selecteStatus, setSelectedStatus] = useState('');
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const {id} =useParams();
  const [transfers, setTransfers] = useState([]);
  const [medicinesData, setMedicinesData] = useState([]);
  const [medicineInputs, setMedicineInputs] = useState([
    { id: 1, value: "", warning: "" },
    { id: 2, value: "", warning: "" },

  ]);
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    handleSpecificTransferbyId(id)
    return () => {
      document.body.style.overflow = 'visible';
    };
  }, []);
  useEffect(() => {
    const updateDate = () => {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split("T")[0];
      setUpdatedAt(formattedDate);
    };
    updateDate();

    const intervalId = setInterval(updateDate, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleMedicineChange = (index, key, value) => {
    const updatedMedicines = [...selectedMedicines];
    // Update the value of the specified key for the medicine at the given index
    updatedMedicines[index][key] = key === 'medicine_id' ? parseInt(value) : value;
    setSelectedMedicines(updatedMedicines);
  };
 //for updating transfer data
 const handleTransferUpdateValue = async (e) => {
  e.preventDefault()  
  try {
    const token = getAuthTokenCookie();
    const user_id = Cookies.get('user_id')
    const transferData = {
    user_id: parseInt(user_id),
    status: parseInt(selecteStatus),
    transfer_medicines: selectedMedicines.map(medicine => ({
      medicine_id: parseInt(medicine.medicine_id),
      quantity: parseInt(medicine.quantity)
    }))
  }; 
    const response = await fetch(`${API_URL}/transfers/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(transferData),
    });    
    if (response.ok) {
      await handleSpecificTransferbyId(id);
    } else {
      throw new Error("Failed to update category value");
    }
  } catch (error) {
    console.error("Error: ", error.message);
  }
};

//to show specific transfer data 
const handleSpecificTransferbyId = async (transfer_id) => {
  try {
    const token = getAuthTokenCookie()
    const response = await fetch(`${API_URL}/transfers/${transfer_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    if (response.ok) {
      const responseData = await response.json();
      setTransfers(responseData.data);
      setMedicinesData(responseData.data.attributes.medicines); 
      setTransfer(responseData.data.attributes);
      setSelectedStatus(responseData.data.attributes.status);
      const selectedMeds = responseData.data.attributes.medicines.map(medicine => ({
        medicine_id: parseInt(medicine.medicine_id),
        quantity: parseInt(medicine.quantity)
    }));
    
      setSelectedMedicines(selectedMeds);
      window.transfer_id = responseData.data.attributes.id;
      window.username = responseData.data.attributes.user.username;
      window.created_at = responseData.data.attributes.created_at;
      window.transferstatus = responseData.data.attributes.status;
      window.transferstatus=responseData.data.attributes.status;  
      console.log(window.transferstatus)
    } else {
      throw new Error('Failed to fetch category details');
    }
  } catch (error) {
    console.error('Error:', error);
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
        <b className="UpdateDetails-label">Update Transfer</b>
      </label>
      <div className="col-12-lg backbtn ">
        <Link to={"/inventory-dashboard/transferlist"}>
          <button className=" bakbtn">
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
      <div className="ud-container">
        <h2 className="edit-title">Edit Details</h2>
        <form className="" onSubmit={handleTransferUpdateValue} >
          <div className="ud-row">
            <div className="ud-form-group">
              <label htmlFor="transfer_id" className="ud-form-label">Transfer Id</label>
              <input
                className="ud-input"
                type="text"
                id="transfer_id"
                placeholder={window.transfer_id}
                disabled  
              />
              {transferIdWarning && (
                <span className="warning-message">{transferIdWarning}</span>
              )}
            </div>
            <div className="ud-form-group">
              <label htmlFor="created_by" className="ud-form-label">Created by</label>
              <input className="ud-input" type="text" id="created_by" placeholder={window.username} disabled />
            </div>
          </div>
          <div className="ud-column ">
            <div className="ud-row">
              <div className="ud-form-group">
                <label htmlFor="status" className="ud-form-label">Status</label>
               <input className="ud-input" type="integer" 
               value={selecteStatus}
               id="status"
               placeholder={window.transferstatus}
               onChange={(e) => setSelectedStatus(e.target.value)}
               disabled
               />



              </div>
              <div className="ud-form-group">
                <label htmlFor="updated_at" className="ud-form-label">Updated At</label>
                <input
                  className="ud-input"
                  type="date"
                  id="updated_at"
                  value={updatedAt}
                  disabled
                />
              </div>
            </div>
          </div>
        <div className="mt-3">
          {medicinesData.map((item,index) => (
            <div key={index}  className="ud-row">
              <div className="ud-form-group">
                <label htmlFor="medicine_id" className="ud-form-label">Medicine Id</label>
                <input
                  className="ud-input"
                  type="integer"
                  id="medicine_id"
                  placeholder={item.medicine_id}
                  value={selectedMedicines[index]?.medicine_id || ''}
                  onChange={(e) => handleMedicineChange(index, 'medicine_id', e.target.value)}
                />
                
              </div>
              <div className="ud-form-group">
                <label htmlFor="quantity" className="ud-form-label">Quantity</label>
                <input className="ud-input" type="integer" id="quantity"
                placeholder={item.quantity}
                value={selectedMedicines[index]?.quantity || ''}
                onChange={(e) => handleMedicineChange(index, 'quantity', e.target.value)}
                />
              </div>
            </div>
          ))}
          <button type="submit" className="updateTransferbtn" >
            <b>Update Transfer</b>
          </button>
        </div>
        </form>
      </div>
    </>
  );
};

export default UpdateDetails;
