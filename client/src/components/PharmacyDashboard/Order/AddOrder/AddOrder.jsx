import { Link } from "react-router-dom";
import "./AddOrder.css";
import React, { useState, useEffect } from "react";
import Sidebar from "../../../PharmacyDashboard/Sidebar/Sidebar";
const AddOrder = () => {
  const [createdAt, setCreatedAt] = useState(""); // Set an initial date value

  useEffect(() => {
    // Update the state with the current date when the component mounts
    const updateDate = () => {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split("T")[0];
      setCreatedAt(formattedDate);
    };
    // Update the date initially
    updateDate();
    // Set up an interval to update the date every second (adjust interval as needed)
    const intervalId = setInterval(updateDate, 1000);
    // Cleanup on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const [medicineFields, setMedicineFields] = useState([
    { medicineId: "", quantity: "", warning: "" },
  ]);
  const handleMedicineIdChange = (index, event) => {
    const inputValue = event.target.value;
    const updatedMedicineFields = [...medicineFields];

    if (/^\d+$/.test(inputValue)) {
      updatedMedicineFields[index].medicineId = inputValue;
      updatedMedicineFields[index].warning = "";
    } else {
      updatedMedicineFields[index].medicineId = "";
      updatedMedicineFields[index].warning = "Medicine Id must be an integer.";
    }

    setMedicineFields(updatedMedicineFields);
  };
  const handleAddMedicine = () => {
    if (medicineFields.length < 4) {
      setMedicineFields([
        ...medicineFields,
        { medicineId: "", quantity: "", warning: "" },
      ]);
    }
  };
  const handleMedicineInputChange = (index, field, value) => {
    const updatedMedicineFields = [...medicineFields];
    updatedMedicineFields[index][field] = value;
    setMedicineFields(updatedMedicineFields);
  };

  const handleRemoveMedicine = (index) => {
    const updatedMedicineFields = [...medicineFields];
    updatedMedicineFields.splice(index, 1);
    setMedicineFields(updatedMedicineFields);
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
        <label className="AddOrder-title">
          <b>Order</b>
        </label>
      </div>
      <label className="AddOrder-Title">
        <b>Add New Order</b>
      </label>

      <div className="ao-container">
        <div className="neworder-title">
          <label>New Order</label>
          <Link to={"/pharmacy-dashboard/orderList/"}>
            <button className="close-btn">x</button>
          </Link>
        </div>

        <form>
          <div className="ao-row">
            <div className="ao-form-group">
              <div className="aoo-input-group ">
                <label className="ao-label ao-national">National ID:</label>
                <select className="ao-select mb-2"></select>
              </div>
            </div>
            <div className="ao-form-group">
              <div className="aoo-input-group">
                <label className="ao-label ">Student Name:</label>
                <input
                  className="ao-input mb-2"
                  type="text"
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="ao-row">
            <div className="ao-form-group">
              <a
                type="button"
                className="ao-addMedicineBtn"
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

          {medicineFields.map((medicine, index) => (
            <div key={index} className="medicine-fields">
              <div className="ao-row">
                <div className="ao-form-group">
                  <div className="quantity-and-remove">
                    <label className="ao-label">
                      Medicine ID:
                      <input
                        className="ao-input mb-2"
                        type="text"
                        value={medicine.medicineId}
                        onChange={(e) => handleMedicineIdChange(index, e)}
                      />
                    </label>
                    {medicine.warning && (
                      <span className="warning-message">
                        {medicine.warning}
                      </span>
                    )}
                    <label className="ao-label">
                      Quantity:
                      <input
                        className="ao-input mb-2"
                        type="number"
                        value={medicine.quantity}
                        onChange={(e) =>
                          handleMedicineInputChange(
                            index,
                            "quantity",
                            e.target.value
                          )
                        }
                      />
                    </label>
                    {medicineFields.length > 1 && (
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

          <button className="ao-confirm-btn " type="submit">
            <b>Confirm Order </b>
          </button>
        </form>
      </div>
    </>
  );
};
export default AddOrder;
