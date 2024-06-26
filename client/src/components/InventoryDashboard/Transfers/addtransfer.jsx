import { Link } from "react-router-dom";
import "./addtransfer.css";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getAuthTokenCookie } from "../../../services/authService";
import { API_URL } from "../../../constants";
import Select from 'react-select'

const Addtransfer = () => {
  const [createdAt, setCreatedAt] = useState(""); 
  const [medicineOptions, setMedicineOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [medicines, setMedicines] = useState([
    { medicine_id: "", quantity: "" }
  ]);

  useEffect(() => {
    const updateDate = () => {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split("T")[0];
      setCreatedAt(formattedDate);
    };
    updateDate();
    const intervalId = setInterval(updateDate, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleAddMedicine = () => {
    if (medicines.length < 4) {
      setMedicines([...medicines, { medicine_id: "", quantity: "" }]);
    }
  };

  const handleRemoveMedicine = (index) => {
    const updatedMedicines = [...medicines];
    updatedMedicines.splice(index, 1);
    setMedicines(updatedMedicines);
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index][field] = value;
    setMedicines(updatedMedicines);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  //Add a new transfer
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user_id = Cookies.get('user_id');
    const postData = {
      user_id,
      transfer_medicines: medicines.map(medicine => ({
        medicine_id: medicine.medicine_id,
        quantity: parseInt(medicine.quantity),
      }))
    };
    const token = getAuthTokenCookie();
  
    if (!token) {
      alert('No token found');
      return;
    }
  
    try {
      const response = await fetch(`${API_URL}/transfers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(postData)
      });
  
      if (response.ok) {
        // Handle success response
        alert('Transfer successful!');
      } else {
        // Handle non-OK responses
        const errorBody = await response.json();
        alert(`Error: ${response.statusText}\nDetails: ${errorBody.message}`);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('Fetch error:', error);
      alert('An error occurred while processing your request.');
    }
  };

  //To load medicines
  useEffect(() => {
    const loadMedicines = async () => {
      if (searchTerm.trim() === '') {
        setMedicineOptions([]);
        return;
      }

      const token = getAuthTokenCookie();
      if (!token) {
        console.log("Authentication error: No token found.");
        return;
      }

      try {
        const encodedSearchTerm = encodeURIComponent(searchTerm);
        const response = await fetch(`${API_URL}/medicines/search?q=${encodedSearchTerm}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.log(`An error occurred: ${errorData.message}`);
          return;
        }

        const responseData = await response.json();
        const medicineOptions = responseData.data.map(medicine => ({
          value: medicine.attributes.id,
          label: medicine.attributes.commercial_name
        }));
        setMedicineOptions(medicineOptions);
      } catch (error) {
        console.error("Failed to load medicines:", error);
        console.log("An error occurred while loading medicines.");
      }
    };

    loadMedicines();
  }, [searchTerm]);


  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-caret-right-fill arrowicon"
        id="arrowiconfortransfer"
        viewBox="0 0 16 16"
      >
        <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
      </svg>
      <div className="transferlabels">
      <div>
        <label className="center2">
          <b>Transfers</b>
        </label>
      </div>
      <label className="addtransferlabel">
        <b>Add Transfer</b>
      </label>
      </div>
      <div className="at-container">
        <div className="addtransfer-title">
          <label>Add Transfer</label>
          <Link to={"/inventory-dashboard/transferList"}>

          <button className="close-btn">x</button>
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="at-row">
            <div className="at-form-group">
              <label className="at-label" htmlFor="status">
                Status:
                <select className="at-select mb-2">
                  <option className="mb-1" value="pending">
                    Pending
                  </option>
                  <option className="mb-1" value="completed">
                    Completed
                  </option>
                  <option className="mb-1" value="cancelled">
                    Cancelled
                  </option>
                </select>
              </label>
            </div>
          </div>
          <div className="at-row">
            <div className="at-form-group">
              <label className="at-label" htmlFor="created_at">
                Created At:
                <input className="at-input mb-2"
                 type="date"
                  id="created_at"
                   value={createdAt}
                     disabled/>
              </label>
            </div>
          </div>
          <div className="at-row">
            <div className="at-form-group">
              <a
                type="button"
                className="at-addMedicineBtn"
                onClick={handleAddMedicine}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="rgba(0, 154, 241, 1)"
                  class="bi bi-plus-circle-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
                </svg>
                {" Add Medicine"}
              </a>
            </div>
          </div>

          {medicines.map((medicine, index) => (
            <div key={index} className="medicine-fields">
              <div className="at-row">
                <div className="at-form-group">
                  <div className="quantity-and-remove">
                    <label className="at-label" htmlFor="medicine_id">
                      Medicine Name:
                      <Select 
                     id="medicinedropdownmenu"
                     className="at-input mb-2"
                     options={medicineOptions.filter(option =>
                      option.label.toLowerCase().includes(searchTerm.toLowerCase())
                      )}
                     value={medicineOptions.find((option) => option.value === medicine.medicine_id)}
                     onChange={(selectedOption) =>
                     handleMedicineChange(index, "medicine_id", selectedOption.value)}
                     onInputChange={(inputValue) => setSearchTerm(inputValue)}
                     />
                    </label>
                    {medicines.warning && (
                    <span className="warning-message">
                      {medicine.warning}
                    </span>
                  )}
                    <label className="at-label" htmlFor="quantity">
                      Quantity:
                      <input
                        className="at-input mb-2"
                        type="number"
                        id="quantity"
                        value={medicine.quantity}
                        onChange={(e) =>
                        handleMedicineChange(index, "quantity", e.target.value)
                      }
                      />
                    </label>
                    {medicines.length > 1 && (
                      <button
                        type="button"
                        className=" removebtn"
                        onClick={() => handleRemoveMedicine(index)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="bi bi-trash3-fill "
                          viewBox="0 0 16 16"
                        >
                          <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                        </svg>{" "}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button className="at-tranfer-btn " type="submit" >
            <b>Add Transfer</b>
          </button>
        </form>
      </div>
    </>
  );
};
export default Addtransfer;
