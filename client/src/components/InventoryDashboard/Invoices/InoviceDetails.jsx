import React, {  useEffect, useState } from "react";
import "./InvoiceDetails.css";
import { Link, useParams } from "react-router-dom";
import { API_URL } from "../../../constants";
import { getAuthTokenCookie } from "../../../services/authService";

const InoviceDetails = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [invoices, setInvoices] = useState([])
  const [medicinesData, setMedicinesData] = useState([]);
 const {id} =useParams();

  useEffect(() => {
    // Remove scroll bar
    document.body.style.overflow = 'hidden';
    handleSpecificInvoicebyId(id)
    // fetchMedicine()
    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = 'visible';
    };
  }, [id]);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    fetchMedicines()
    return () => clearInterval(intervalId);
  }, []);



  const handlePrint = () => {
    const printableContent = document.querySelector('.id-container').innerHTML;
    const newWindow = window.open('', '_blank');
  
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
    const token = getAuthTokenCookie()
    const response = await fetch(`${API_URL}/invoices/${invoice_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (response.ok) {

      const responseData = await response.json();
      setInvoices(responseData.data);
      setMedicinesData(responseData.data.attributes.medicines);
      const dataArray = responseData.data.attributes.medicines;
      window.medicineData= dataArray;
      window.order_number = responseData.data.attributes.order_number;
      window.invoice_id = responseData.data.attributes.id;
      window.created_at = responseData.data.attributes.created_at;
      window.comments = responseData.data.attributes.comments;
      window.supplier = responseData.data.attributes.supplier.supplier_name;
      window.total_amount = responseData.data.attributes.total_amount;
    } else {
      throw new Error('Failed to fetch category details');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

  const fetchMedicines = async () => {
    const token=getAuthTokenCookie()
    const medicineIds = invoices.attributes.medicines.map(medicine => medicine.medicine_id);
    const medicineDataArray = [];
    for (const id of medicineIds) {
      const medicineResponse = await fetch(`${API_URL}/medicines/${id}`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }});
      if (medicineResponse.ok) {
        const medicineData = await medicineResponse.json();
        const medicine_name=medicineData.data.attributes.commercial_name;                
      }
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
      ></svg>
      <div>
        <label>
          <b className="invnum-label">Invoice</b>
        </label>
        <label>
          <p className="invnumcode-label">#{window.invoice_id}</p>
        </label>
      </div>
      <div className="col-12-lg backbtn ">
        <Link to={"/inventory-dashboard/invoicesList"}>
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
      <div className="id-container">
        <div className="id-row">
          
          <div className="id-ordernum-label">Order Number: 
            <span> {window.order_number}</span> </div>

            <div>
              <button className="id-printbtn" onClick={handlePrint}> <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-printer" viewBox="0 0 16 16">
  <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"/>
  <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1"/>
</svg> </button>
            </div>
            </div>
            <div className="id-row">

          <div className="id-invoiceid-label">Invoice Id:<span>{window.invoice_id}</span> </div>
          <div className="id-date-label">Date: <span>{window.created_at}</span></div>


        <div className="id-comments-label">
          Comments: <span className="id-comment">{window.comments}</span>
        </div>
      </div>

      <div className="id-row">
      <div className="id-supplier-label">Supplier: <span>{window.supplier}</span>
            </div>
      </div>
      <div className="id-row">

      <table class="table id-table">
  <thead className="id-table-header">
    <tr>
      <th id="id-table-header"  scope="col">Medicine Name</th>
      <th  id="id-table-header" scope="col">Price</th>
      <th  id="id-table-header" scope="col">Qunatity</th>
      <th  id="id-table-header" scope="col">Discount</th>
    </tr>
  </thead>
 <tbody className="ml-tbody">
 {medicinesData.map((item, index) => (
  <tr key={index} className="medicine-container">
    <td>{item.medicine_name}</td>
    <td>{item.price}</td>
    <td>{item.quantity}</td>
    <td>{item.discount}</td>
  </tr>
))}
</tbody>
</table>
</div>
<div className="id-row">
  <div className="amount-label">
    Amount 
    <span className="amount">{window.total_amount}</span>
  </div>
</div>
      </div>
    </>
  );
};

export default InoviceDetails;
