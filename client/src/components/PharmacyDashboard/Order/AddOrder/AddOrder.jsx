import { Link } from "react-router-dom";
import "./AddOrder.css";
import React, { useState, useEffect } from "react";
import Sidebar from "../../../PharmacyDashboard/Sidebar/Sidebar";
import Select from 'react-select'
import { getAuthTokenCookie } from "../../../../services/authService";
import { API_URL } from "../../../../constants";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const AddOrder = () => {
  const [createdAt, setCreatedAt] = useState(""); // Set an initial date value
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [National_IDoptions, setsNational_IDoptions] = useState([]);
  const [medicineOptions, setMedicineOptions] = useState([]);
  const [student_national_id, setstudent_national_id] = useState("");
  const [studentName, setStudentName] = useState(""); // State to store student name
  const [student_id, setStudentID] = useState(""); // State to store student name
  const [studentIds, setStudentIds] = useState([]);
  const [selectedOption, setselectedOption] = useState(null);
  const [orders, setOrders] = useState([]);
  const [medicine_id, setMedicineId] = useState("");
  const [quantity, setquantity] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");

  const [medicinesData, setMedicines] = useState([
    { medicine_id: "", quantity: "", discount: "", price: "", amount: "0" },
  ]);

  

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
  const handleAddMedicine = () => {
    if (medicinesData.length < 4) {
      setMedicines([
        ...medicinesData,
        { medicine_id: "", quantity: ""},
      ]);
    }
  };
  
  const notify = (type, message) => {
    if (type === "success") {
      toast.success(message, {
        position: "top-center",
      });
    } else if (type === "error") {
      toast.error(message, {
        position: "top-center",
      });
    }}

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...medicinesData];
    updatedMedicines[index][field] = value;
    // Calculate amount based on quantity, price, and discount
    const quantity = parseFloat(updatedMedicines[index].quantity) || 0;
    setMedicines(updatedMedicines);
  };

  const handleQuantity = (index, e) => {
    const value = e.target.value;
    // Check if the input only contains numbers
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      handleMedicineChange(index, "quantity", value);
    }
  };
  const handleMedicine_id = (index, e) => {
    const value = e.target.value;
    // Check if the input only contains numbers
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      handleMedicineChange(index, "medicine_id", value);
    }
  };

  const handleRemoveMedicine = (index) => {
    const updatedMedicineFields = [...medicinesData];
    updatedMedicineFields.splice(index, 1);
    setMedicines(updatedMedicineFields);
  };


  useEffect(() => {
    // Remove scroll bar
    document.body.style.overflow = "hidden";

    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  useEffect(() => {
    if (searchTerm.trim() !== "") {
    async function getStudents() {
      const token = getAuthTokenCookie();
      if (token) {
        const response = await fetch(
          `${API_URL}/students`,
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
          setStudents(responseData.data);
          const studentIds = responseData.data.map((student) => student.attributes.student_id);
        setStudentIds(studentIds);
        const National_IDs = responseData.data.map((item) => ({
          value: item.attributes.student_national_id,
          label: item.attributes.student_national_id.toString(), // Convert to string
          studentName: item.attributes.student_name,
          student_id: item.attributes.student_id
        }));
        
          
          setsNational_IDoptions(National_IDs);
        } else {
          throw response;
        }
      } else {
        setError("An error occured");
        console.log("An error", e);
      }
    }
    getStudents();
  } else {
    setsNational_IDoptions([]);
  }
}, [searchTerm]);
//get all medicines
useEffect(() => {
  if (searchTerm.trim() !== "") {
    async function loadMedicines() {
      const token = getAuthTokenCookie();
      if (token) {
        const response = await fetch(
          `${API_URL}/medicines/search?q=${searchTerm}`,
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
          const medicineOptions = responseData.data.map((medicine) => ({
            value: medicine.attributes.id,
            label: medicine.attributes.commercial_name,
          }));
          setMedicineOptions(medicineOptions);
        } else {
          throw response;
        }
      } else {
        setError("An error occurred");
      }
    }
    loadMedicines();
  } else {
    setMedicineOptions([]);
  }
}, [searchTerm]);

    //API for adding new order
    const handleSubmit = async (e) => {
      e.preventDefault();
      const token = getAuthTokenCookie();
      const user_id = Cookies.get("user_id");
      const postData = {
        user_id:parseInt(user_id),
        student_id:parseInt(student_id),
        order_medicines_attributes: medicinesData.map((medicine) => ({
          medicine_id: parseInt(medicine.medicine_id),
          quantity: parseInt(medicine.quantity),
          
        })),
      };
      console.log(postData )
      if (token) {
        try {
          const response = await fetch(`${API_URL}/orders/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(postData),
          });
          if (response.ok) {
            const responseData = await response.json();
            
            setOrders([...orders, responseData.data]);
            notify("success", "Order added successfully");
          } else {
            console.log("Error: " + response.statusText);
            notify("error", "Failed to add order!");
          }
        } catch (error) {
          console.error("Error:", error);
          //notify("error", "Failed to add invoice!");
        }
      } else {
        alert("No token found");
      }
    };
    const handleNationalIDChange = (selectedOption) => {
      const national_id = selectedOption.value;
      // Find the student with the selected national ID
      const selectedStudent = students.find(student => student.attributes.student_national_id === national_id);
      if (selectedStudent) {
        setStudentName(selectedStudent.attributes.student_name);
        setStudentID(selectedStudent.id);
       
        console.log(selectedStudent.id)
      } else {
        setStudentName(""); // Clear student name if not found
        setStudentID(""); // Clear student ID if not found
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

        <form onSubmit={handleSubmit}>
          <div className="ao-row">
            <div className="ao-form-group">
              <div className="aoo-input-group ">
                <label className="ao-label ao-national">National ID:</label>
           
            
                <Select
  className="ao-select mb-2"
  id=""
  options={National_IDoptions}
  value={National_IDoptions.find(
    (option) => option.value === student_national_id
  )}
  onChange={(selectedOption) => {
    setstudent_national_id(selectedOption.value);
    handleNationalIDChange(selectedOption); // Call handleNationalIDChange
  }}
  onInputChange={(inputValue) => setSearchTerm(inputValue)}
/>

              
              </div>
            </div>
            <div className="ao-form-group">
              <div className="aoo-input-group">
                <label className="ao-label ">Student Name:</label>
                <input
                  className="ao-input mb-2"
                  type="text"
                  value={studentName}
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

          {medicinesData.map((medicine, index) => (
            <div key={index} className="medicine-fields">
              <div className="ao-row">
                <div className="ao-form-group">
                  <div className="quantity-and-remove">
                    <label className="ao-label">
                      Medicine Name:
                     
                        <Select
                  id="selectdropdown"
                  className="ao-input"
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
                  onInputChange={(inputValue) => setSearchTerm(inputValue)}
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
                        onChange={(e) => handleQuantity(index, e)}

                      />
                    </label>
                    {medicinesData.length > 1 && (
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
    </>
  );
};
export default AddOrder;
