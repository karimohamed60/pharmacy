import { Link } from "react-router-dom";
import "./addtransfer.css";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getAuthTokenCookie } from "../../../../services/authService";
import { API_URL } from "../../../../constants";
import Select from "react-select";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Addtransfer = () => {
  const [createdAt, setCreatedAt] = useState("");
  const [medicineOptions, setMedicineOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [medicines, setMedicines] = useState([
    { medicine_id: "", quantity: "" },
  ]);
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
    if (medicines.length < 3) {
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
    const user_id = Cookies.get("user_id");
    const postData = {
      user_id,
      transfer_medicines: medicines.map((medicine) => ({
        medicine_id: medicine.medicine_id,
        quantity: parseInt(medicine.quantity),
      })),
    };
    const token = getAuthTokenCookie();

    if (!token) {
      notify("error", "No token found");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/transfers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        notify("success", "Transfer successful!");
      } else {
        const errorBody = await response.json();
        notify("error", `Transfer Failed`);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      notify("error", "An error occurred while processing your request.");
    }
  };

  //To load medicines
  useEffect(() => {
    const loadMedicines = async () => {
      if (searchTerm.trim() === "") {
        setMedicineOptions([]);
        return;
      }

      const token = getAuthTokenCookie();
      if (!token) {
        return;
      }

      try {
        const encodedSearchTerm = encodeURIComponent(searchTerm);
        const response = await fetch(
          `${API_URL}/medicines/search?q=${encodedSearchTerm}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          return;
        }

        const responseData = await response.json();
        const medicineOptions = responseData.data.map((medicine) => ({
          value: medicine.attributes.id,
          label: medicine.attributes.commercial_name,
        }));
        setMedicineOptions(medicineOptions);
      } catch (error) {
        console.error("Failed to load medicines:", error);
      }
    };

    loadMedicines();
  }, [searchTerm]);
  const handleQuantity = (index, e) => {
    const value = e.target.value;
    // Check if the input only contains numbers
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      handleMedicineChange(index, "quantity", value);
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
                <input
                  className="at-select mb-2"
                  value="pending"
                  disabled
                ></input>
              </label>
            </div>
          </div>
          <div className="at-row">
            <div className="at-form-group">
              <label className="at-label" htmlFor="created_at">
                Created At:
                <input
                  className="at-input mb-2"
                  type="date"
                  id="created_at"
                  value={createdAt}
                  disabled
                />
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
                  className="bi bi-plus-circle-fill"
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
                        options={medicineOptions.filter((option) =>
                          option.label
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        )}
                        value={medicineOptions.find(
                          (option) => option.value === medicine.medicine_id
                        )}
                        onChange={(selectedOption) =>
                          handleMedicineChange(
                            index,
                            "medicine_id",
                            selectedOption.value
                          )
                        }
                        onInputChange={(inputValue) =>
                          setSearchTerm(inputValue)
                        }
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
                        type="text"
                        id="quantity"
                        value={medicine.quantity}
                        onChange={(e) => handleQuantity(index, e)}
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

          <button className="at-tranfer-btn " type="submit">
            <b>Add Transfer</b>
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
            transition={Bounce}
          />
        </form>
      </div>
    </>
  );
};
export default Addtransfer;
