import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"; // Import useParams
import "./StudentsList.css";
import Table from "react-bootstrap/esm/Table";
import Sidebar from "../../../PharmacyDashboard/Sidebar/Sidebar";
import { getAuthTokenCookie } from "../../../../services/authService";

import { API_URL } from "../../../../constants";
import ReactPaginate from "react-paginate";
const StudentsList = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { id , studentId} = useParams();
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]); // Filtered medicines
  const [input, setInput] = useState("");
  const [prescriptions, setPrescription] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [token, setToken] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const recordsPerPage = 10;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;

  const npage = Math.ceil(students.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

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

  //search 
  const handleSearch = async (value, page = 1) => {
    try {
      const token = getAuthTokenCookie();
      if (!token) {
        console.error("Token not found");
        return;
      }
      const response = await fetch(`${API_URL}/students/search?q=${value}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to search medicines");
      }
  
      const data = await response.json();
      console.log("Response Data:", data); // Log the response data
  
      const results = data.data.filter((student) => {
        return (
          value &&
          student &&
          student.attributes.student_national_id &&
          student.attributes.student_national_id
            
            
        );
      });
      console.log("Filtered Results:", results); // Log the filtered results
      setResults(data.data);
      const totalPages = Math.ceil(data.data.length / recordsPerPage);
      setTotalPages(totalPages); // Update total pages based on filtered results
      setCurrentPage(1); // Reset current page when performing a new search
    } catch (error) {
      console.error("Error searching medicines:", error.message);
    }
  };
  
  useEffect(() => {
    getStudents();
  }, [currentPage]);
   // Fetch medicines based on search
   useEffect(() => {
    if (search !== "") {
      handleSearch(search);
    } else {
      // If search is empty, show all medicines
      setResults([]);
    }
  }, [search,currentPage]);// Add search as a dependency

  // to fetch students data
  useEffect(() => {
    getStudents();
  }, [recordsPerPage]);

  const getStudents = async () => {
    try {
      const token = getAuthTokenCookie();
      if (!token) {
        console.error("Token not found");
        return;
      }

      setToken(token);

      const response = await fetch(
       ` ${API_URL}/students?per_page=${recordsPerPage}&page=1`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      const totalStudents = data.total_students || 0; // Assuming total_students is the correct key

      setTotalPages(Math.ceil(totalStudents / recordsPerPage));
      setStudents(data.data);
    } catch (error) {
      console.error("Error occurred: ", error.message);
    }
  };
 const fetchStudents = async (page, token) => {
    try {
      const response = await fetch(`
      ${API_URL}/students?per_page=${recordsPerPage}&page=${page}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch suppliers");
      }

      const fetchedStudents = await response.json();
      return fetchedStudents.data;
    } catch (error) {
      console.error("Error fetching suppliers: ", error.message);
      return [];
    }
  };
  const handlePageClick = async (data) => {
    try {
      const token = getAuthTokenCookie();
      const currentPage = data.selected + 1;
      setCurrentPage(currentPage);
      const fetchedStudents = await fetchStudents(currentPage, token, search);
      setStudents(fetchedStudents);
  
      if (fetchedStudents.length = 10) {
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };
  const handleChange = (value) => {
    setInput(value);
    setSearch(value); // Update search state with the new input value
    setCurrentPage(1); // Reset current page when performing a new search
  };



  //Api for showing a specific prescription data
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
      <div className="Students-title-group">
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
          value={search}   // || value= input
          onChange={(e) => handleChange(e.target.value)} // || = handlesearch
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
          {search !== ""?
          (
            results.map((item, index) =>(
              <tr key={index} className="medicine-container">
              <td>{item.attributes.student_name}</td>
              <td>{item.attributes.student_national_id}</td>
              <td>
                <Link to={`/pharmacy-dashboard/students/${item.attributes.id}/prescriptions/`} >
              <svg xmlns="http://www.w3.org/2000/svg" width="28"
               height="28"
              fill="dark blue"
              class="bi bi-clipboard2-pulse" 
              viewBox="0 0 16 16"
              onClick={() => handleSpecificPrescription(item.attributes.id)}

              >
  <path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5z"/>
  <path d="M3 2.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 0 0-1h-.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1H12a.5.5 0 0 0 0 1h.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5z"/>
  <path d="M9.979 5.356a.5.5 0 0 0-.968.04L7.92 10.49l-.94-3.135a.5.5 0 0 0-.926-.08L4.69 10H4.5a.5.5 0 0 0 0 1H5a.5.5 0 0 0 .447-.276l.936-1.873 1.138 3.793a.5.5 0 0 0 .968-.04L9.58 7.51l.94 3.135A.5.5 0 0 0 11 11h.5a.5.5 0 0 0 0-1h-.128z"/>
</svg>
</Link>
              </td>
            </tr>   
            ))
          ):(
          
          students.map((item, index) => (
            <tr key={index} className="medicine-container">
              <td>{item.attributes.student_name}</td>
              <td>{item.attributes.student_national_id}</td>
              <td>
                <Link to={`/pharmacy-dashboard/students/${item.attributes.id}/prescriptions/`} >
              <svg xmlns="http://www.w3.org/2000/svg" width="28"
               height="28"
              fill="dark blue"
              class="bi bi-clipboard2-pulse" 
              viewBox="0 0 16 16"
              onClick={() => handleSpecificPrescription(item.attributes.id)}

              >
  <path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5z"/>
  <path d="M3 2.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 0 0-1h-.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1H12a.5.5 0 0 0 0 1h.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5z"/>
  <path d="M9.979 5.356a.5.5 0 0 0-.968.04L7.92 10.49l-.94-3.135a.5.5 0 0 0-.926-.08L4.69 10H4.5a.5.5 0 0 0 0 1H5a.5.5 0 0 0 .447-.276l.936-1.873 1.138 3.793a.5.5 0 0 0 .968-.04L9.58 7.51l.94 3.135A.5.5 0 0 0 11 11h.5a.5.5 0 0 0 0-1h-.128z"/>
</svg>
</Link>
              </td>
            </tr>
          ))
          )}
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
