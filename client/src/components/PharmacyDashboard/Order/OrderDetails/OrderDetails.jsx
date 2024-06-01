import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_URL } from "../../../../constants";
import { getAuthTokenCookie } from "../../../../services/authService";
import Sidebar from "../../../PharmacyDashboard/Sidebar/Sidebar";
import { format } from "date-fns";
import "./OrderDetails.css";
const OrderDetails = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [medicinesData, setMedicinesData] = useState([]);
  const [orders, setOrders] = useState([]);

  const { id, order_id } = useParams();

  useEffect(() => {
    // Remove scroll bar
    document.body.style.overflow = "hidden";
    //handleSpecificOrder(id);
    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = "visible";
    };
  }, [id]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

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

  //print
  const handlePrint = async () => {
    try {
      const token = getAuthTokenCookie();
      const response = await fetch(
        `${API_URL}/orders/${order_id}/generate_pdf`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // Handle the PDF file received from the backend
        // For example, you can prompt the user to download the file
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "order_details.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error("Failed to generate PDF");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (order_id) {
      handleSpecificOrder();
    }
  }, [order_id]);
  // navigate to a specific order
  const handleSpecificOrder = async () => {
    try {
      const token = getAuthTokenCookie();
      const response = await fetch(`${API_URL}/orders/${order_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        setOrders(responseData.data);
        setMedicinesData(responseData.data.attributes.medicines);
        window.created_at = responseData.data.attributes.created_at;
        window.formattedCreatedAt = format(
          new Date(window.created_at),
          "yyyy-MM-dd"
        );
        window.national_id =
          responseData.data.attributes.student.student_national_id;
        window.student_name = responseData.data.attributes.student.student_name;
        window.created_by = responseData.data.attributes.user.user_name;
        console.log(responseData);
        window.order_num = responseData.data.attributes.id;
      } else {
        throw new Error("Failed");
      }
    } catch (error) {
      console.error("Error:", error);
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
        <label className="Orderdetails-Title">
          <b>Orders</b>
        </label>
      </div>

      <label className="OrderDetails-Title">
        <b>Order Details</b>
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
          <b className="ordernum-label">Order</b>
        </label>
        <label>
          <p className="ordernumcode-label">#{window.order_num}</p>
        </label>
      </div>
      <div className="col-12-lg backbtn ">
        <Link to={"/pharmacy-dashboard/orderList/"}>
          <button className=" orderbakbtn">
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
      <div className="order-container">
        <div className="id-row">
          <div className="id-ordernum-label">
            Order Number:
            <span>{window.order_num} </span>{" "}
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
                onClick={handlePrint}
              >
                <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1" />
                <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1" />
              </svg>{" "}
            </button>
          </div>
        </div>
        <div className="id-row">
          <div className="id-date-label">
            Date: <span> {window.formattedCreatedAt}</span>
          </div>
          <div className="id-createdby-label">
            Created by: <span> {window.created_by}</span>{" "}
          </div>
        </div>
        <div className="id-row">
          <div className="id-national-label">
            National ID: <span>{window.national_id} </span>
          </div>
          <div className="id-studentname-label">
            Student Name: <span>{window.student_name}</span>{" "}
          </div>
        </div>

        <div className="id-row">
          <div className="order-details-container">
            <table className="table od-table">
              <thead>
                <tr>
                  <th itemScope="col">Medicine Name</th>
                  <th scope="col">Quantity</th>
                </tr>
              </thead>
              <tbody className="od-tbody">
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
      </div>
    </>
  );
};

export default OrderDetails;
