import React, { useEffect, useState  } from "react";
import "./TransfersDetails.css";
import { Link ,useParams } from "react-router-dom";
import "reactjs-popup/dist/index.css";
import {getAuthTokenCookie} from '../../../../services/authService'
import { API_URL } from "../../../../constants";
import Sidebar from "../../../PharmacyDashboard/Sidebar/Sidebar";
const TransfersDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transfers, setTransfers] = useState([]);
  const [medicinesData, setMedicinesData] = useState([]);
  const {id} =useParams();
/*
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isModalOpen]);
*/
useEffect(() => {
  // Remove scroll bar
  document.body.style.overflow = 'hidden';
  handleSpecificTransferbyId(id)
  // Cleanup on component unmount
  return () => {
    document.body.style.overflow = 'visible';
  };
}, []);
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
      console.log(responseData);
      // console.log("Medicine details showed successfully")
      setTransfers(responseData.data);
      setMedicinesData(responseData.data.attributes.medicines);
      //setMedicinesData(responseData.data.attributes.medicines);
      /*const dataArray = responseData.data.attributes.medicines;
      window.medicineData= dataArray;
      console.log(dataArray)*/

      
      window.transfer_id = responseData.data.attributes.id;
      window.username = responseData.data.attributes.user.username;
      window.created_at = responseData.data.attributes.created_at;
      window.transferstatus = responseData.data.attributes.status;
      window.medicine_name = responseData.data.attributes.medicines.medicine_name;
      console.log(window.medicine_name)
      /*window.total_amount = responseData.data.attributes.total_amount;*/
      
    } else {
      throw new Error('Failed to fetch category details');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};




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
        <label className="ptransferd-title">
          <b>Transfers</b>
        </label>
      </div>
      <label className="ptransferdLabel">
        <b>Transfer Details</b>
      </label>
      <div className="col-12-lg backbtn ">
        <Link to={'/pharmacy-dashboard/transferList//'}>
          <button className=" backButton" >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
              <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
            </svg>
            <b id='back'>Back</b>

          </button>
        </Link>
      </div>
      <button type="button" className="btn btn-light savebtn" id="oooo">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy-fill" viewBox="0 0 16 16">
  <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0H3v5.5A1.5 1.5 0 0 0 4.5 7h7A1.5 1.5 0 0 0 13 5.5V0h.086a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5H14v-5.5A1.5 1.5 0 0 0 12.5 9h-9A1.5 1.5 0 0 0 2 10.5V16h-.5A1.5 1.5 0 0 1 0 14.5z"/>
  <path d="M3 16h10v-5.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5zm9-16H4v5.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5zM9 1h2v4H9z"/>
</svg>
        <b className="pupdatelabel" >Save Changes</b>
      </button>
      <div className="ptd-container">
        <h2 className="transfer-title">Transfer Details</h2>

        <form className="">
          <div className="td-row">
            <div className="td-form-group">
              <label className="td-form-label">Transfer Id</label>
              <input className="td-input" type="text"  placeholder={window.transfer_id}  disabled />
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
                <select
                  className="td-input"
                  type="text"
                  placeholder={window.transferstatus}
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
        <div className="transfer-details-container" >
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

export default TransfersDetails;