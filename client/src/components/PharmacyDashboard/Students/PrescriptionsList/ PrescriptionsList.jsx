import React, { useEffect, useState } from "react";
import "./PrescriptionsList.css";
import Table from "react-bootstrap/Table";
import Dropdown from "react-bootstrap/Dropdown";
import { Link, useParams } from "react-router-dom";
import { getAuthTokenCookie } from "../../../../services/authService";
import { API_URL } from "../../../../constants";
import { format } from "date-fns";
import Sidebar from "../../../PharmacyDashboard/Sidebar/Sidebar";
const PrescriptionsList = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [statusFilter, setStatusFilter] = useState(null);
  const [prescriptions, setPrescription] = useState([]);
  const{id}=useParams()
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const filteredData = prescriptions.filter(
    (item) =>
      (statusFilter
        ? item.attributes.status.toLowerCase() === status.toLowerCase()
        : true) &&
      (search === "" ||
        item.id.toString().toLowerCase() === search.toLowerCase())
  );
  const npage = Math.ceil(prescriptions.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  const getStatusColors = (status) => {
    switch (status.toLowerCase()) {
      case "finished": // = accepted
        return {
          backgroundColor: "rgba(178, 238, 177, 1)",
          textColor: "rgba(64, 146, 14, 1)",
        }; // Green background, Dark Green text
      case "delivered": // =pending
        return {
          backgroundColor: "rgba(255, 251, 161, 1)",
          textColor: "#A98208",
        }; // Yellow background, Dark Yellow text
      default:
        return { backgroundColor: "beige", textColor: "#000000" }; // Default to transparent background and black text
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Remove scroll bar
    document.body.style.overflow = "hidden";
    handleSpecificPrescription(id)
    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = "visible";
    };
  }, [id]);

  function prePage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function changeCurrentPage(id) {
    setCurrentPage(id);
  }

  function nextPage() {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  }

  // to fetch all prescriptions
 
    async function handleSpecificPrescription(studentId) {
      const token = getAuthTokenCookie();
      if (token) {
        const response = await fetch(
          `${API_URL}/students/${studentId}/prescriptions/`,
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
          setPrescription(responseData.data);
          console.log(responseData)
        } else {
          throw response;
        }
      } else {
        setError("An error occured");
        console.log("An error", e);
      }
    };

    const showMedicinesinPrescription = async (studentId,prescription_id) => {
      try {
        const token = getAuthTokenCookie();
        const response = await fetch(`${API_URL}/students/${studentId}/prescriptions/${prescription_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          const responseData = await response.json();
          setPrescription(responseData.data);
          setSelectedStudent(studentId)
        } else {
          throw new Error("Failed to fetch category details");
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
        <label className="Prescriptions-title">
          <b>Students</b>
        </label>
      </div>

      <label className="PrescriptionsLabel">
        <b>Prescriptions List</b>
      </label>
      <div className="pl-search-filter">
        <div className="pl-search-group rounded search-input ">
      
          
           
        </div>
     
      </div>

      <Table hover id="pl-table">
        <thead>
          <tr>
            <th>Prescription ID</th>
            <th>Status</th>
            <th>Created at</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody className="pl-tbody">
          {filteredData.slice(firstIndex,lastIndex).map((item, index) => (
            <tr key={index}>
              <td>{item.id}</td>
              <td>
                {" "}
                <div
                  style={{
                    backgroundColor: getStatusColors(item.attributes.status)
                      .backgroundColor,
                    color: getStatusColors(item.attributes.status).textColor,
                  }}
                  className="status-item"
                >
                  {item.attributes.status}
                </div>
              </td>
              <td>
                {format(new Date(item.attributes.date), "yyyy-MM-dd")}
              </td>
              <td>
                <Link to={`/pharmacy-dashboard/students/${item.attributes.student_id}/prescriptions/${item.attributes.id}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="#032B55"
                    class="bi bi-eye-fill"
                    viewBox="0 0 16 16"
                   onClick={() => showMedicinesinPrescription(item.id)}
                  >
                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                  </svg>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <nav>
        <ul className="pagination ptl">
          <li className="page-item">
            <a href="#!" className="page-link" onClick={prePage}>
              Prev
            </a>
          </li>
          {numbers.map((n, i) => (
            <li
              className={`page-item ${currentPage === n ? "active" : ""}`}
              key={i}
            >
              <a
                href="#!"
                className="page-link"
                onClick={() => changeCurrentPage(n)}
              >
                {n}
              </a>
            </li>
          ))}
          <li className="page-item">
            <a href="#!" className="page-link" onClick={nextPage}>
              Next
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default PrescriptionsList;
