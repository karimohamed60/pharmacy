import { Link } from "react-router-dom";
import "./SalafRequest.css";
import React, { useState, useEffect } from "react";
import Sidebar from "../../PharmacyDashboard/Sidebar/Sidebar";
import Select from "react-select";
import { API_URL } from "../../../constants";
import { getAuthTokenCookie } from "../../../services/authService";
import Cookies from "js-cookie";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const SalafRequest = () => {
  const [students, setStudents] = useState([]);
  const [National_IDoptions, setsNational_IDoptions] = useState([]);
  const [student_national_id, setstudent_national_id] = useState("");
  const [studentName, setStudentName] = useState(""); // State to store student name
  const [medicineNAme, setMEdicineName] = useState(""); // State to store student name
  const [student_id, setStudentID] = useState(""); // State to store student name
  const [studentIds, setStudentIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [salaf_requests, setSalafRequests] = useState([]);

  const [medicinesData, setMedicines] = useState([{ medicine1: "" }]);
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

    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);
  const handleAddMedicine = () => {
    if (medicinesData.length < 2) {
      setMedicines([...medicinesData, { medicine1: "" }]);
    }
  };
  const handleRemoveMedicine = (index) => {
    const updatedMedicineFields = [...medicinesData];
    updatedMedicineFields.splice(index, 1);
    setMedicines(updatedMedicineFields);
  };

  //to fetch student_national_ids with student name
  useEffect(() => {
    if (searchTerm.trim() !== "") {
      async function getStudents() {
        const token = getAuthTokenCookie();
        if (token) {
          const response = await fetch(`${API_URL}/students`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const responseData = await response.json();
            setStudents(responseData.data);
            const studentIds = responseData.data.map(
              (student) => student.attributes.student_id
            );
            setStudentIds(studentIds);
            const National_IDs = responseData.data.map((item) => ({
              value: item.attributes.student_national_id,
              label: item.attributes.student_national_id.toString(), // Convert to string
              studentName: item.attributes.student_name,
              student_id: item.attributes.student_id,
            }));

            setsNational_IDoptions(National_IDs);
          } else {
            throw response;
          }
        } else {
          setError("An error occured");
        }
      }
      getStudents();
    } else {
      setsNational_IDoptions([]);
    }
  }, [searchTerm]);
  const handleNationalIDChange = (selectedOption) => {
    const national_id = selectedOption.value;
    // Find the student with the selected national ID
    const selectedStudent = students.find(
      (student) => student.attributes.student_national_id === national_id
    );
    if (selectedStudent) {
      setStudentName(selectedStudent.attributes.student_name);
      setStudentID(selectedStudent.id);
    } else {
      setStudentName(""); // Clear student name if not found
      setStudentID(""); // Clear student ID if not found
    }
  };
  //to add new salaf request
  let medicine1 = medicineNAme;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getAuthTokenCookie();
    const user_id = Cookies.get("user_id");

    // Update postData with the correct structure

    const postData = {
      request: {
        medicine_name: [
          {
            medicine1: medicineNAme, // Update with actual medicine names
          },
        ],
        status: 0,
        student_id: parseInt(student_id), // Update with the selected student ID
      },
    };
    if (token) {
      try {
        const response = await fetch(`${API_URL}/salaf_requests`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(postData),
        });
        if (response.ok) {
          const responseData = await response.json();
          setSalafRequests([...salaf_requests, responseData.data]);
          notify("success", "Request sent successfully");
        } else {
          notify("error", "An error occured");
        }
      } catch (error) {
        console.error("Error:", error);
        //notify("error", "Failed to add invoice!");
      }
    } else {
      alert("No token found");
    }
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...medicinesData];
    updatedMedicines[index][field] = value;
    // Calculate amount based on quantity, price, and discount
    const quantity = parseFloat(updatedMedicines[index].quantity) || 0;
    setMedicines(updatedMedicines);
  };

  const handleMedicine_id = (index, e) => {
    const value = e.target.value;
    // Check if the input is a string
    if (typeof value === "string") {
      // Update the state with the entered value
      setMEdicineName(value);
      const updatedMedicines = [...medicinesData];
      updatedMedicines[index].medicine1 = value;
      setMedicines(updatedMedicines);
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
        <label className="salaf-title">
          <b>Salaf</b>
        </label>
      </div>
      <label className="salf-Title">
        <b>Send Request</b>
      </label>

      <div className="s-container">
        <div className="newrequest-title mb-5">
          <label>New Request</label>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="s-row">
            <div className="s-form-group">
              <label className="s-label s-national ">National ID:</label>
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
          <div className="s-form-group">
            <label className="s-label">Student Name:</label>
            <input
              className="s-input mb-4"
              type="text"
              value={studentName}
              disabled
            />
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
                  className="bi bi-plus-circle-fill"
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
                    <div className="s-form-group">
                      <label className="s-label">Medicine Name:</label>
                      <textarea
                        className=" mb-1"
                        id="s-testarea"
                        type="text"
                        value={medicine.medicine1}
                        onChange={(e) => handleMedicine_id(index, e)}
                        required
                      />
                    </div>
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

          <button className="s-confirm-btn " type="submit">
            <b>Send </b>
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
export default SalafRequest;
