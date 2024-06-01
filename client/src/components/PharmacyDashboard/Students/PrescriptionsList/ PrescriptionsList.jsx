import React, { useEffect, useState } from "react";
import "./PrescriptionsList.css";
import Table from "react-bootstrap/Table";
import Dropdown from "react-bootstrap/Dropdown";
import { Link, useParams } from "react-router-dom";
import { getAuthTokenCookie } from "../../../../services/authService";
import { API_URL } from "../../../../constants";
import { format } from "date-fns";
import Sidebar from "../../../PharmacyDashboard/Sidebar/Sidebar";
import ReactPaginate from "react-paginate";

const PrescriptionsList = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const recordsPerPage = 6;
  const [statusFilter, setStatusFilter] = useState(null);
  const [prescriptions, setPrescription] = useState([]);
  const { id } = useParams();
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const filteredData = prescriptions.filter(
    (item) =>
      (statusFilter
        ? item.attributes.status.toLowerCase() === statusFilter.toLowerCase()
        : true) &&
      (search === "" ||
        item.id.toString().toLowerCase().includes(search.toLowerCase()))
  );

  const pageCount = Math.ceil(filteredData.length / recordsPerPage);
  const handleChange = (value) => {
    setInput(value);
    setSearch(value); // Update search state with the new input value
    setStatusFilter(value);
    setCurrentPage(1); // Reset current page when performing a new search
  };
  const [input, setInput] = useState("");

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(0); // Reset to the first page on new search
  };

  const handleStatusFilter = (selectedStatus) => {
    setStatusFilter(selectedStatus);
    setCurrentPage(0); // Reset to the first page on new filter
  };

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
    handleSpecificPrescription(id);
    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = "visible";
    };
  }, [id]);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };
  const handleFilter = (selectedStatus) => {
    setStatusFilter(selectedStatus);
  };

  const offset = currentPage * recordsPerPage;

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
        console.log(responseData);
      } else {
        throw response;
      }
    } else {
      setError("An error occured");
      console.log("An error", e);
    }
  }

  const showMedicinesinPrescription = async (studentId, prescription_id) => {
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
        setPrescription(responseData.data);
        setSelectedStudent(studentId);
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
        className="bi bi-caret-right-fill pl-Arrowicon"
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
        <div className="pl-search-group rounded search-input "></div>
      </div>
      <div className="pl-search-filter">
        <div className="pl-search-group rounded search-input ">
          <input
            type="search"
            className="form-control rounded"
            id="srchinput"
            placeholder="Search by Prescription ID"
            aria-label="Search"
            aria-describedby="search-addon"
            value={search}
            onChange={handleSearchChange}
          />

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="19"
            fill="currentColor"
            className="bi bi-search pl-search-icon"
            viewBox="0 0 11 16"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
          </svg>
        </div>
        <div className="pl-dropdown pfilterdropdwn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            fill="currentColor"
            className="bi bi-funnel pl-filtericon"
            viewBox="0 0 16 16"
          >
            <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z" />
          </svg>
          <span className="pl-filterlabel">-Filter by status-</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="19"
            fill="currentColor"
            className="bi bi-chevron-down pl-filterdownicon"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
            />
          </svg>

          <Dropdown
            onSelect={(selectedStatus) => handleStatusFilter(selectedStatus)}
          >
            <div className="pl-dropdown-content pl-filtercontent">
              <Dropdown.Item eventKey={null} className="statusfilter">
                All
              </Dropdown.Item>
              <br></br>
              <Dropdown.Item eventKey="finished" className="statusfilter">
                Finished
              </Dropdown.Item>
              <br></br>
              <Dropdown.Item eventKey="delivered" className="statusfilter">
                Delivered
              </Dropdown.Item>
            </div>
          </Dropdown>
        </div>
      </div>
      <div className="col-12-lg pl-backbtn-pharmacy ">
        <Link to={"/pharmacy-dashboard/StudentsList/"}>
          <button className=" pl-backButton">
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
            <b id="back">Back</b>
          </button>
        </Link>
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
          {filteredData
            .slice(offset, offset + recordsPerPage)
            .map((item, index) => (
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
                <td>{format(new Date(item.attributes.date), "yyyy-MM-dd")}</td>
                <td>
                  <Link
                    to={`/pharmacy-dashboard/students/${item.attributes.student_id}/PrescriptionsDetails/${item.attributes.id}`}
                  >
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
      <ReactPaginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={"pagination justify-content-center"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}
      />
    </>
  );
};

export default PrescriptionsList;
