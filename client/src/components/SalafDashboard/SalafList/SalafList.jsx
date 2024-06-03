import "./SalafList.css";
import { Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { getAuthTokenCookie } from "../../../services/authService";
import { API_URL } from "../../../constants";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import SalafSidebar from "../SalafSidebar/SalafSidebar";

const SalafList = () => {
  const recordsPerPage = 10;

  const [salaf, setSalaf] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    loadSalaf(currentPage);
  }, [currentPage]);

  const loadSalaf = async (page) => {
    try {
      const token = getAuthTokenCookie();
      if (!token) {
        console.error("Token not found");
        return;
      }

      const response = await fetch(
        `${API_URL}/salaf_requests?per_page=${recordsPerPage}&page=${page + 1}`, // API pages start from 1
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
      const totalSalaf = data.total_requests || 0; // Assuming total_requests is the correct key

      setTotalPages(Math.ceil(totalSalaf / recordsPerPage));
      setSalaf(data.data);
    } catch (error) {
      console.error("Error occurred: ", error.message);
    }
  };

  const getStatusColors = (status) => {
    switch (status.toLowerCase()) {
      case "finished": // = accepted
        return {
          backgroundColor: "rgba(178, 238, 177, 1)",
          textColor: "rgba(64, 146, 14, 1)",
        }; // Green background, Dark Green text
      case "pending": // =pending
        return {
          backgroundColor: "rgba(255, 251, 161, 1)",
          textColor: "#A98208",
        }; // Yellow background, Dark Yellow text
      default:
        return { backgroundColor: "beige", textColor: "#000000" }; // Default to transparent background and black text
    }
  };

  const handlePageClick = async (data) => {
    const newPage = data.selected;
    setCurrentPage(newPage);
  };

  async function handleSpecificRequest(requestId) {
    const token = getAuthTokenCookie();
    if (token) {
      const response = await fetch(`${API_URL}/salaf_requests/${requestId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const responseData = await response.json();
        setSalaf([responseData.data]);
        console.log(responseData);
      } else {
        console.error("Failed to fetch specific request");
      }
    } else {
      console.error("Token not found");
    }
  }

  return (
    <>
      <SalafSidebar />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-caret-right-fill salaf-arrow-icon"
        viewBox="0 0 16 16"
      >
        <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
      </svg>
      <div>
        <label className="salaf-label">
          <b>Salaf </b>
        </label>
      </div>

      <label className="req-label">
        <b>Requests List</b>
      </label>
      <div
        className="salaf-search-group rounded "
        style={{ backgroundColor: "transparent" }}
      >
        <input
          type="search"
          className="form-control rounded "
          id="salaf-search-input"
          placeholder="Search by National ID"
          aria-label="Search"
          aria-describedby="search-addon"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="19"
          height="19"
          fill="currentColor"
          className="bi bi-search salaf-search-icon2"
          viewBox="0 0 11 16"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
        </svg>
      </div>
      <Table hover id="Salaf-table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Request ID</th>
            <th>Student name</th>
            <th>Details</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody className="il-tbody">
          {salaf.map((item, index) => {
            const { backgroundColor, textColor } = getStatusColors(
              item.attributes.status
            );
            return (
              <tr key={index}>
                <td>{item.attributes.student_id}</td>
                <td>{item.id}</td>
                <td>{item.attributes.student_name}</td>
                <td>
                  <Link to={`/salaf-dashboard/salafDetails/${item.id}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="#032B55"
                      className="bi bi-eye-fill"
                      viewBox="0 0 16 16"
                      onClick={() => handleSpecificRequest(item.id)}
                    >
                      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                      <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                    </svg>
                  </Link>
                </td>
                <td>
                  <div
                    style={{
                      backgroundColor: getStatusColors(item.attributes.status)
                        .backgroundColor,
                      color: getStatusColors(item.attributes.status).textColor,
                    }}
                    className="sstatus-item"
                  >
                    {item.attributes.status}
                  </div>{" "}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <div className="spagination">
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
      </div>
    </>
  );
};

export default SalafList;