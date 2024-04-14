import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_URL } from "../../../../constants";
import { getAuthTokenCookie } from "../../../../services/authService";
import Sidebar from "../../../PharmacyDashboard/Sidebar/Sidebar";
import "./PrescriptionsDetails.css";
const PrescriptionsDetails = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [invoices, setInvoices] = useState([]);
  const [medicinesData, setMedicinesData] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    // Remove scroll bar
    document.body.style.overflow = "hidden";
    handleSpecificInvoicebyId(id);
    // fetchMedicine()
    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = "visible";
    };
  }, [id]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    fetchMedicines();
    return () => clearInterval(intervalId);
  }, []);

  const formatDate = (date) => {
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const handlePrint = () => {
    const printableContent = document.querySelector(".id-container").innerHTML;
    const newWindow = window.open("", "_blank");

    if (newWindow) {
      newWindow.document.write(`
        <html>
        <head>
          <title>PHU</title>
          <link rel="stylesheet" href="/src/components/InventoryDashboard/Invoices/InvoiceDetails.css" />
        </head>
        <body>
          ${printableContent}
        </body>
      </html>
        `);

      newWindow.document.close();
      newWindow.print();
    }
  };

  //API for showing  a specific invoice details
  const handleSpecificInvoicebyId = async (invoice_id) => {
    try {
      const token = getAuthTokenCookie();
      const response = await fetch(`${API_URL}/invoices/${invoice_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        // console.log("Medicine details showed successfully")
        setInvoices(responseData.data);
        setMedicinesData(responseData.data.attributes.medicines);
        const dataArray = responseData.data.attributes.medicines;
        window.medicineData = dataArray;
        console.log(dataArray);
        window.order_number = responseData.data.attributes.order_number;
        window.invoice_id = responseData.data.attributes.id;
        window.created_at = responseData.data.attributes.created_at;
        window.comments = responseData.data.attributes.comments;
        window.supplier = responseData.data.attributes.supplier.supplier_name;
        window.total_amount = responseData.data.attributes.total_amount;
        // window.medicine_name=medicinesData.data.attributes.commercial_name
        // window.price_per_unit = responseData.data.attributes.price_per_unit
        // window.quantity_in_inventory = responseData.data.attributes.quantity_in_inventory;
        // window.quantity_in_pharmacy = responseData.data.attributes.quantity_in_pharmacy;
        // window.quantity_sold = responseData.data.attributes.quantity_sold;
      } else {
        throw new Error("Failed to fetch category details");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchMedicines = async () => {
    const token = getAuthTokenCookie();
    const medicineIds = invoices.attributes.medicines.map(
      (medicine) => medicine.medicine_id
    );
    const medicineDataArray = [];
    for (const id of medicineIds) {
      const medicineResponse = await fetch(`${API_URL}/medicines/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(id);
      if (medicineResponse.ok) {
        const medicineData = await medicineResponse.json();
        const medicine_name = medicineData.data.attributes.commercial_name;
        // Update medicinesData with commercial names
      }
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
        <label className="pdetails-Title">
          <b>Students</b>
        </label>
      </div>

      <label className="pDetails-Title">
        <b>Prescription Details</b>
      </label>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-caret-right-fill arrowicon"
        viewBox="0 0 16 16"
      ></svg>
      <div>
        <label>
          <b className="pnum-label">Prescription</b>
        </label>
        <label>
          <p className="pnumcode-label">#</p>
        </label>
      </div>
      <div className="col-12-lg backbtn ">
        <Link to={"/pharmacy-dashboard/orderList/"}>
          <button className=" pbakbtn">
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
      <div className="p-container">
        <div className="id-row">
          <div className="id-pnum-label">
            Prescription Number:
            <span> </span>{" "}
          </div>

          <div>
            <button className="id-printbtn">
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                className="bi bi-printer"
                viewBox="0 0 16 16"
              >
                <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1" />
                <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1" />
              </svg>{" "}
            </button>
          </div>
        </div>
        <div className="id-row">
          <div className="id-date-label">
            Date: <span> </span>
          </div>
          <div className="id-status-label">
            Status: <span></span>{" "}
          </div>
        </div>

        <div className="id-row">
          <div className="p-details-container mt-3">
            <table className="table p-table">
              <thead>
                <tr>
                  <th itemScope="col">Medicine Name</th>
                  <th scope="col">Dosage</th>
                  <th itemScope="col">Quantity</th>
                  <th scope="col">Got Medicine</th>
                </tr>
              </thead>
              <tbody className="p-tbody">
                {medicinesData.map((item, index) => (
                  <tr key={index} className="medicine-container">
                    <td>{item.medicine_name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.medicine_name}</td>
                    <td>
                      {" "}
{/*                       <div class="checkbox-wrapper-36">
                        <input id="toggle-36" type="checkbox" />
                      </div> */}
<div class="checkbox-wrapper-31">
  <input type="checkbox"/>
  <svg viewBox="0 0 35.6 35.6">
    <circle class="background" cx="17.8" cy="17.8" r="17.8"></circle>
    <circle class="stroke" cx="17.8" cy="17.8" r="14.37"></circle>
    <polyline class="check" points="11.78 18.12 15.55 22.23 25.17 12.87"></polyline>
  </svg>
</div>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrescriptionsDetails;
