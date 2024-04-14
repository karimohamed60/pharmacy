import React, { useEffect, useState } from "react";
import "./TransfersList.css";
import Table from "react-bootstrap/Table";
import Dropdown from "react-bootstrap/Dropdown";
import { Link } from "react-router-dom";
import {getAuthTokenCookie} from '../../../../services/authService'
import { API_URL } from "../../../../constants";
import {format} from 'date-fns'
import Sidebar from "../../../PharmacyDashboard/Sidebar/Sidebar";
const TransfersList = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [transfers, setTransfers] = useState([]);
  const recordsPerPage = 12;
  const [statusFilter, setStatusFilter] = useState(null);
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const filteredData = transfers.filter(
    (item) =>
      (statusFilter
        ? item.attributes.status.toLowerCase() === statusFilter.toLowerCase()
        : true) &&
      (search === "" ||
        item.id.toString().toLowerCase() === search.toLowerCase())
  );
  const records = transfers.slice(firstIndex, lastIndex);
  const npage = Math.ceil(transfers.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  const getStatusColors = (status) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return { backgroundColor: "rgba(178, 238, 177, 1)", textColor: "rgba(64, 146, 14, 1)" }; // Green background, Dark Green text
      case "pending":
        return { backgroundColor: "rgba(255, 251, 161, 1)", textColor: "#A98208" }; // Yellow background, Dark Yellow text
      case "rejected":
        return { backgroundColor: "rgba(255, 88, 88, 0.4)", textColor: "#BD2727" }; // Light Red background, Dark Red text
      default:
        return { backgroundColor: "transparent", textColor: "#000000" }; // Default to transparent background and black text
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Remove scroll bar
    document.body.style.overflow = 'hidden';

    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = 'visible';
    };
  }, []);

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




  //fetch transfers
  useEffect(() => {
    async function loadTransfers() {
      const token = getAuthTokenCookie();
      if (token) {
        const response = await fetch(`${API_URL}/transfers`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.ok) {
          const responseData = await response.json();
           console.log(responseData)
          setTransfers(responseData.data);
        } else {
          throw response;
        }
      } else {
        setError("An error occured");
        console.log("An error", e);
      }
    }
    loadTransfers();
  }, []);
//navigate to a specific transfer 
const handleSpecificTrasfer= async (transfer_id) => {
  try {
    const token = getAuthTokenCookie();
    const response = await fetch(`${API_URL}/transfers/${transfer_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (response.ok) {
      const responseData = await response.json();
      
      console.log(responseData)
      
     

      
      setTransfers(responseData.data);
      
    } else {
      throw new Error('Failed to fetch category details');
    }
  } catch (error) {
    console.error('Error:', error);
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
        <label className="ptransfer-title">
          <b>Transfers</b>
        </label>
      </div>

      <label className="ptransferLabel">
        <b>Transfer List</b>
      </label>
    <div className="tl-search-filter">
    <div className="tl-search-group rounded search-input ">
        <input
          type="search"
          className="form-control rounded "
          id="srchinput"
          placeholder="Search by Transfer ID"
          aria-label="Search"
          aria-describedby="search-addon"
          onChange={(e) => setSearch(e.target.value)}

        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="19"
          height="19"
          fill="currentColor"
          className="bi bi-search tl-search-icon"
          viewBox="0 0 11 16"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
        </svg>
      </div>
      <div className="tl-dropdown filterdropdwn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="21"
          fill="currentColor"
          className="bi bi-funnel filtericon"
          viewBox="0 0 16 16"
        >
          <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z" />
        </svg>
        <span className="filterlabel">-Filter by status-</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="19"
          height="19"
          fill="currentColor"
          className="bi bi-chevron-down filterdownicon"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
          />
        </svg>

        <Dropdown
          onSelect={(selectedStatus) => setStatusFilter(selectedStatus)}
        >
          <div className="tl-dropdown-content filtercontent">
            <Dropdown.Item eventKey={null} className="statusfilter">
              All
            </Dropdown.Item>
            <br></br>
            <Dropdown.Item eventKey="Pending" className="statusfilter">
              Pending
            </Dropdown.Item>
            <br></br>
            <Dropdown.Item eventKey="Accepted" className="statusfilter">
              Accepted
            </Dropdown.Item>
            <br></br>
            <Dropdown.Item eventKey="Rejected" className="statusfilter">
              Rejected
            </Dropdown.Item>
          </div>
        </Dropdown>
      </div>
      </div>

      <Table  hover id="td-table" >
        <thead>
          <tr>
            <th>Transfer ID</th>
            <th>Status</th>
            <th>Created at</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody className="tl-tbody">
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td>{item.id}</td>
              <td>
                {" "}
                <div
                 style={{
                  backgroundColor: getStatusColors(item.attributes.status).backgroundColor,
                  color: getStatusColors(item.attributes.status).textColor,
                }}    
                  className="status-item"
                                >
                  {item.attributes.status}
                </div>
              </td>
              <td>{format(new Date(item.attributes.created_at), 'yyyy-MM-dd')}</td>
              <td>
                <Link to={`/inventory-dashboard/updateDetails/${item.id}`}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="#032B55"
                    class="bi bi-eye-fill"
                    viewBox="0 0 16 16"
                    onClick={() => handleSpecificTrasfer(item.id)}
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

export default TransfersList;
