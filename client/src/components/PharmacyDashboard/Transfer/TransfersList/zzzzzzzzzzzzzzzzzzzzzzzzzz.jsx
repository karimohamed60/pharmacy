import React, { useEffect, useState } from "react";
import "./TransfersList.css";
import Table from "react-bootstrap/Table";
import Dropdown from "react-bootstrap/Dropdown";
import { Link, useParams } from "react-router-dom";
import { getAuthTokenCookie } from "../../../../services/authService";
import { API_URL } from "../../../../constants";
import { format } from "date-fns";
import Sidebar from "../../../PharmacyDashboard/Sidebar/Sidebar";
import ReactPaginate from "react-paginate";

const TransfersList = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [transfers, setTransfers] = useState([]);
  const [results, setResults] = useState([]); // Filtered medicines
  const [input, setInput] = useState("");
  const recordsPerPage = 10;
  const [statusFilter, setStatusFilter] = useState(null);
  const [token, setToken] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  /*const filteredData = transfers.filter(
    (item) =>
      (statusFilter
        ? item.attributes.status.toLowerCase() === statusFilter.toLowerCase()
        : true) &&
      (search === "" ||
        item.id.toString().toLowerCase() === search.toLowerCase())
  );*/
  const records = transfers.slice(firstIndex, lastIndex);
  const npage = Math.ceil(transfers.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);
  const { id, transfer_id } = useParams();
  //const { transfer_id } = useParams();


const getStatusColors = (status) => {
  if (!status) return { backgroundColor: "transparent", textColor: "#000000" };
  switch (status.toLowerCase()) {
    case "accepted":
      return {
        backgroundColor: "rgba(178, 238, 177, 1)",
        textColor: "rgba(64, 146, 14, 1)",
      }; // Green background, Dark Green text
    case "pending":
      return {
        backgroundColor: "rgba(255, 251, 161, 1)",
        textColor: "#A98208",
      }; // Yellow background, Dark Yellow text
    case "rejected":
      return {
        backgroundColor: "rgba(255, 88, 88, 0.4)",
        textColor: "#BD2727",
      }; // Light Red background, Dark Red text
    default:
      return { backgroundColor: "transparent", textColor: "#000000" }; // Default to transparent background and black text
  }
};
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Remove scroll bar
    document.body.style.overflow = "hidden";
    handleSpecificTrasfer(id);
    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = "visible";
    };
  }, [id]);
  useEffect(() => {
    if (transfer_id) {
     handleSpecificTrasfer();
    }
  }, [transfer_id]);


  

  //filtering data
  const handleFilter = async (value, page) => {
    if (value === null) {
      // If "All" is selected, fetch all transfers
      loadTransfers();
      return;
    }

    try {
      const token = getAuthTokenCookie();
      if (!token) {
        console.error("Token not found");
        return;
      }
      const response = await fetch(
        `${API_URL}/transfers/filter?status=${value}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to search medicines");
      }

      const data = await response.json();
      console.log("Response Data:", data);
      const filteredTransfers = data.data.filter(
        (transfer) =>
          transfer.attributes.status.toLowerCase() === value.toLowerCase()
      );
      setTransfers(filteredTransfers);
      const totalPages = Math.ceil(data.data.length / recordsPerPage);
      setTotalPages(totalPages);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error searching medicines:", error.message);
    }
  };

  // to fetch students data
  /*
  useEffect(() => {
    getTransfers();
  }, [recordsPerPage]);

  const getTransfers = async () => {
    try {
      const token = getAuthTokenCookie();
      if (!token) {
        console.error("Token not found");
        return;
      }

      setToken(token);

      const response = await fetch(
        ` ${API_URL}/transfers?per_page=${recordsPerPage}&page=1`,
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
      const totalTransfers = data.total_transfers || 0; // Assuming total_students is the correct key
      console.log(data);

      setTotalPages(Math.ceil(totalTransfers / recordsPerPage));
      setTransfers(data.data);
    } catch (error) {
      console.error("Error occurred: ", error.message);
    }
  };
  
  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };
  */
  useEffect(() => {
    loadTransfers();
  }, [currentPage, search]);

  const loadTransfers = async () => {
    try {
        const authToken = getAuthTokenCookie();
        if (!authToken) {
            console.error("Token not found");
            return;
        }
        console.log(authToken);

        setToken(authToken);

        let url = `${API_URL}/transfers?per_page=${recordsPerPage}&page=${currentPage}`;

        if (search.trim() !== "") {
            // If search term is present, use search API endpoint
            url = `${API_URL}/transfers/search?q=${search}&per_page=${recordsPerPage}&page=${currentPage}`;
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
        const totalTransfers = data.total_transfers;
        setTotalPages(Math.ceil(totalTransfers / recordsPerPage));
        setTransfers(data.data);
    } catch (error) {
        console.error("Error occurred: ", error.message);
    }
};


/*
  const fetchTransfers = async (page, token) => {
    
      try {
        const authToken = getAuthTokenCookie();
        if (!authToken) {
          console.error("Token not found");
          return;
        }
        console.log(authToken);
  
        setToken(authToken);
  
        let url = `${API_URL}/transfers?per_page=${recordsPerPage}&page=${currentPage}`;
  
        if (search.trim() !== "") {
          // If search term is present, use search API endpoint
          url = `${API_URL}/tranasfers/search?q=${search}&per_page=${recordsPerPage}&page=${currentPage}`;
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
        const totalMedicines = data.total_transfers;
        setTotalPages(Math.ceil(totalMedicines / recordsPerPage));
        setTransfers(data.data);
      } catch (error) {
        console.error("Error occurred: ", error.message);
      
    }
  };*/
  
  const handlePageClick = async (data) => {
    try {
      const token = getAuthTokenCookie();
      const currentPage = data.selected + 1;
      setCurrentPage(currentPage);
      const fetchedTransfers = await fetchTransfers(currentPage, token, search);
      setTransfers(fetchedTransfers);

      if (fetchedTransfers.length > 10) {
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };
  const handleChange = (value) => {
    setInput(value);
    setSearch(value); // Update search state with the new input value
    setStatusFilter(value);
    setCurrentPage(1); // Reset current page when performing a new search
  };

  //navigate to a specific transfer
  
  const handleSpecificTrasfer = async () => {
    try {
      const token = getAuthTokenCookie();
      const response = await fetch(`${API_URL}/transfers/${transfer_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();

        console.log(responseData);

        setTransfers(responseData.data);
      } else {
        throw new Error("Failed to fetch category details");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  const filteredData = transfers.filter((item) => {
    const transferId = item?.attributes?.transfer_id;
    return search.toLowerCase() !== "" || (transferId && transferId.toLowerCase().includes(search.toLowerCase()));
  });
 console.log(filteredData)

const renderedTransfers = filteredData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
);
console.log(renderedTransfers)

  const renderTransfers =
    search.trim() !== "" ? renderedTransfers : filteredData;
console.log(renderTransfers)


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
           // value={input}
           onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // Reset to the first page on search
          }}
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
        <div className="tl-dropdown pfilterdropdwn">
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

          <Dropdown onSelect={(selectedStatus) => handleFilter(selectedStatus)}>
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

      <Table hover id="ptd-table">
        <thead>
          <tr>
            <th>Transfer ID</th>
            <th>Status</th>
            <th>Created at</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody className="tl-tbody">
  {search.trim() === "" ? (
    transfers.map((item, index) => (
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
        <td>{format(new Date(item.attributes.created_at), "yyyy-MM-dd")}</td>
        <td>
          <Link to={`/pharmacy-dashboard/transfersDetails/${item.id}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="#032B55"
              className="bi bi-eye-fill"
              viewBox="0 0 16 16"
              onClick={() => handleSpecificTrasfer(item.id)}
            >
              <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
              <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
            </svg>
          </Link>
        </td>
      </tr>
    ))
  ) : (
    renderTransfers.map((item, index) => (
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
        <td>{format(new Date(item.attributes.created_at), "yyyy-MM-dd")}</td>
        <td>
          <Link to={`/pharmacy-dashboard/transfersDetails/${item.id}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="#032B55"
              className="bi bi-eye-fill"
              viewBox="0 0 16 16"
              onClick={() => handleSpecificTrasfer(item.id)}
            >
              <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
              <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
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

export default TransfersList;