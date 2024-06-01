import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_URL } from "../../../../constants";
import { getAuthTokenCookie } from "../../../../services/authService";
import Sidebar from "../../../PharmacyDashboard/Sidebar/Sidebar";
import "./PrescriptionsDetails.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PrescriptionsDetails = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [invoices, setInvoices] = useState([]);
  const [medicinesData, setMedicinesData] = useState([]);
  const [selecteStatus, setSelectedStatus] = useState("");
  const [currentStatus, setCurrentStatus] = useState(""); // New state to hold the current status
  const { id } = useParams();
  const { studentId, prescription_id } = useParams();
  const [Prescription_status, setPrescription_status] = useState();
  const [prescription, setPrescription] = useState([]);
  const [checkedMedicines, setCheckedMedicines] = useState({});

  const notify = (type, message) => {
    if (type === "success") {
      toast.success(message, {
        position: "top-center",
      });
    } else if (type === "error") {
      toast.error(message, {
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    // Remove scroll bar
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "visible";
    };
  }, [id]);

  useEffect(() => {
    if (studentId && prescription_id) {
      showMedicinesinPrescription();
    }
  }, [studentId, prescription_id]);

  useEffect(() => {
    // Initialize checkedMedicines state based on fetched medicines data
    const initialCheckedMedicines = {};
    medicinesData.forEach((medicine) => {
      initialCheckedMedicines[medicine.Pmedicine_name] =
        medicine.got_medicine === 1;
    });
    setCheckedMedicines(initialCheckedMedicines);
  }, [medicinesData]);

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
  /*
    const handlePrint = async () => {
      try {
        const token = getAuthTokenCookie();
        const response = await fetch(`${API_URL}/students/${studentId}/PrescriptionsDetails/${prescription_id}/generate_pdf`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          // Handle the PDF file received from the backend
          // For example, you can prompt the user to download the file
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'prescription_details.pdf';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        } else {
          throw new Error('Failed to generate PDF');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };*/

  const handlePrint = async () => {
    try {
      const token = getAuthTokenCookie();
      const response = await fetch(
        `${API_URL}/students/${studentId}/prescriptions/${prescription_id}/generate_pdf`,
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
        a.download = "p_details.pdf";
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

  const showMedicinesinPrescription = async () => {
    try {
      const token = getAuthTokenCookie();
      const response = await fetch(
        `${API_URL}/students/${studentId}/prescriptions/${prescription_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData.data);
        const medicinesArray = [];

        for (const item of responseData.data) {
          const { date, id, medicines, status } = item.attributes;
          window.PrescriptionDate = date;
          window.PrescriptionID = id;
          window.Prescription_status = status;

          if (medicines) {
            for (const medicine of medicines) {
              medicinesArray.push({
                Pmedicine_name: medicine.medicine_name,
                dosage: medicine.dosage,
                quantity: medicine.quantity,
                medicine_id: medicine.id,

                got_medicine: medicine.got_medicine,
              });
            }
          }
        }

        setMedicinesData(medicinesArray); // Set the state with the accumulated medicines array
      } else {
        throw new Error("Failed to fetch prescription details");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //update a prescription
  const handleUpdateprescription = async (e) => {
    e.preventDefault();
    const token = getAuthTokenCookie();
    /* let status;
      if (status === "finished") {
        status = 2;
      } else if (status === "delivered") {
        status = 1;
      } else {
        status = 0;
      }*/
    const postData = {
      status: parseInt(selecteStatus),
      prescription_medicines: medicinesData.map((medicine) => ({
        id: medicine.medicine_id,
        got_medicine: checkedMedicines[medicine.Pmedicine_name] ? 1 : 0, // Set got_medicine based on checkbox status
      })),
    };
    console.log(postData);
    if (token) {
      try {
        const response = await fetch(
          `${API_URL}/students/${studentId}/prescriptions/${prescription_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(postData),
          }
        );
        if (response.ok) {
          const responseData = await response.json();
          console.log(response);
          setPrescription([...prescription, responseData.data]);
          notify("success", "Prescription updated successfully");
        } else {
          console.log("Error: " + response.statusText);
          notify("error", "Failed to update prescription!");
        }
      } catch (error) {
        console.error("Error:", error);
        //notify("error", "Failed to add invoice!");
      }
    } else {
      alert("No token found");
    }
  };

  const handleCheckboxChange = (medicineName, isChecked) => {
    setCheckedMedicines((prevState) => ({
      ...prevState,
      [medicineName]: isChecked,
    }));
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
          <p className="pnumcode-label">#{window.PrescriptionID}</p>
        </label>
      </div>
      <div className="col-12-lg backbtn ">
        <Link to={`/pharmacy-dashboard/students/${studentId}/Prescriptions`}>
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
            <span> {window.PrescriptionID}</span>{" "}
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
            Date: <span>{window.PrescriptionDate} </span>
          </div>
          <div className="td-form-group">
            <label className="id-status-label">Status</label>
            <select
              className="status-input"
              value={selecteStatus || currentStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option style={{ color: "transparent" }}>
                {window.Prescription_status}{" "}
              </option>
              <option className="status-input-option" value="1">
                delivered
              </option>
              <option className="status-input-option" value="2">
                finished
              </option>
            </select>
          </div>
        </div>

        <div className="id-row">
          <div className="p-details-container ">
            <form className="table p-table" onSubmit={handleUpdateprescription}>
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
                    <td>{item.Pmedicine_name}</td>
                    <td>{item.dosage}</td>
                    <td>{item.quantity}</td>
                    <td>
                      {" "}
                      {/*                       <div class="checkbox-wrapper-36">
                          <input id="toggle-36" type="checkbox" />
                        </div> */}
                      <div class="checkbox-wrapper-31">
                        <input
                          type="checkbox"
                          checked={checkedMedicines[item.Pmedicine_name]}
                          onChange={(e) =>
                            handleCheckboxChange(
                              item.Pmedicine_name,
                              e.target.checked
                            )
                          }
                        />
                        <svg viewBox="0 0 35.6 35.6">
                          <circle
                            class="background"
                            cx="17.8"
                            cy="17.8"
                            r="17.8"
                          ></circle>
                          <circle
                            class="stroke"
                            cx="17.8"
                            cy="17.8"
                            r="14.37"
                          ></circle>
                          <polyline
                            class="check"
                            points="11.78 18.12 15.55 22.23 25.17 12.87"
                          ></polyline>
                        </svg>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <button type="submit" className="save">
                save
              </button>
              <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition:Bounce
              />
            </form>
          </div>
        </div>
      </div>
      <Link to={`/pharmacy-dashboard/addOrder/`}>
        <button className="placeorderbtn">place Order</button>
      </Link>
    </>
  );
};

export default PrescriptionsDetails;
