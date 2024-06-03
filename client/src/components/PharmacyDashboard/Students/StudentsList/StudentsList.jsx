import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./StudentsList.css";
import Table from "react-bootstrap/esm/Table";
import Sidebar from "../../../PharmacyDashboard/Sidebar/Sidebar";
import { getAuthTokenCookie } from "../../../../services/authService";
import { API_URL } from "../../../../constants";
import ReactPaginate from "react-paginate";
const StudentsList = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [token, setToken] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const recordsPerPage = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isModalOpen]);

  useEffect(() => {
    // Remove scroll bar
    document.body.style.overflow = "hidden";

    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  useEffect(() => {
    const authToken = getAuthTokenCookie();
    if (authToken) {
      setToken(authToken);
    } else {
      console.error("Token not found");
    }
  }, []);

  useEffect(() => {
    // Load transfers whenever currentPage, search  changes
    if (token) {
      loadStudents();
    }
  }, [currentPage, search, token]);

  useEffect(() => {
    loadStudents();
  }, [currentPage, search]);

  const loadStudents = async () => {
    try {
      const authToken = getAuthTokenCookie();
      if (!authToken) {
        console.error("Token not found");
        return;
      }
      setToken(authToken);
      let url = `${API_URL}/students?per_page=${recordsPerPage}&page=${currentPage}`;
      if (search.trim() !== "") {
        url = `${API_URL}/students/search?q=${search}&per_page=${recordsPerPage}&page=${currentPage}`;
      }
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      const totalStudents = data.total_students;
      setTotalPages(Math.ceil(totalStudents / recordsPerPage));
      setStudents(data.data);
    } catch (error) {
      console.error("Error occurred: ", error.message);
    }
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };
  const filteredData = students.filter((item) => {
    const studentNational_id = item?.attributes?.student_national_id;
    return (
      search.toLowerCase() !== "" ||
      (typeof studentNational_id === "string" &&
        studentNational_id.toLowerCase().includes(search.toLowerCase()))
    );
  });
  const renderedStudents = filteredData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );
  const renderStudents = search.trim() !== "" ? renderedStudents : filteredData;
  const handleSpecificPrescription = async (studentId) => {
    try {
      const token = getAuthTokenCookie();
      const response = await fetch(`${API_URL}/students/${studentId}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

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
      <div className="Students-title-group">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-caret-right-fill student-Arrowicon"
          viewBox="0 0 16 16"
        >
          <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
        </svg>

        <div>
          <label className="Students-title">
            <b>Students</b>
          </label>
        </div>

        <label className="StudentsList-title">
          <b>Students List</b>
        </label>
      </div>
      <div className="Students-search-group rounded search-input ">
        <input
          type="search"
          className="form-control rounded "
          id="srchinputforstudents"
          placeholder="Search by National ID"
          aria-label="Search"
          aria-describedby="search-addon"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="19"
          height="19"
          fill="currentColor"
          className="bi bi-search Students-search-icon"
          viewBox="0 0 11 16"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
        </svg>
      </div>
      <Table hover id="Studentstable" className="">
        <thead>
          <tr>
            <th>
              <p>Student Name</p>
            </th>
            <th>
              <p>National ID</p>
            </th>
            <th>
              <p>Prescription</p>
            </th>
          </tr>
        </thead>
        <tbody className="Studentstable-body">
          {search.trim() === ""
            ? students.map((item, index) => (
                <tr key={index} className="medicine-container">
                  <td>{item.attributes.student_name}</td>
                  <td>{item.attributes.student_national_id}</td>
                  <td>
                    <Link
                      to={`/pharmacy-dashboard/students/${item.attributes.id}/Prescriptions/`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        fill="#032B55"
                        className="bi bi-eye"
                        viewBox="0 0 16 16"
                        onClick={() =>
                          handleSpecificPrescription(item.attributes.id)
                        }
                      >
                        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                      </svg>
                    </Link>
                  </td>
                </tr>
              ))
            : renderedStudents.map((item, index) => (
                <tr key={index} className="medicine-container">
                  <td>{item.attributes.student_name}</td>
                  <td>{item.attributes.student_national_id}</td>
                  <td>
                    <Link
                      to={`/pharmacy-dashboard/students/${item.attributes.id}/Prescriptions/`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        fill="#032B55"
                        className="bi bi-eye"
                        viewBox="0 0 16 16"
                        onClick={() =>
                          handleSpecificPrescription(item.attributes.id)
                        }
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
        pageCount={totalPages}
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

export default StudentsList;
