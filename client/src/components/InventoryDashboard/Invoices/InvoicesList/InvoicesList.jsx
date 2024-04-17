import React, { useEffect, useState } from "react";
import "./InvoicesList.css";
import Table from "react-bootstrap/Table";
import "reactjs-popup/dist/index.css";
import { Link } from "react-router-dom";
import { API_URL } from "../../../../constants";
import { getAuthTokenCookie } from "../../../../services/authService";
import { format } from "date-fns";
const InvoicesList = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [filterButtonClicked, setFilterButtonClicked] = useState(false);

  const recordsPerPage = 10;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;

  const filteredData = invoices.filter(
    (item) =>
      search.toLowerCase() === "" ||
      item.attributes.order_number
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase())
  );
  const records = invoices.slice(firstIndex, lastIndex);
  const npage = Math.ceil(invoices.length / recordsPerPage);
  const numbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  function handleFilterButtonClick() {
    setFilterButtonClicked(true);
  }

  function handleClearButtonClick() {
    setStartDate("");
    setEndDate("");
    setFilterButtonClicked(false);
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Remove scroll bar
    document.body.style.overflow = "hidden";

    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = "visible";
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

  //Api for showing invoices
  useEffect(() => {
    async function loadInvoices() {
      const token = getAuthTokenCookie();
      if (token) {
        const response = await fetch(
          `${API_URL}/invoices?per_page=${recordsPerPage}&page=${currentPage}`,
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
          setInvoices(responseData.data);
          const totalInvoices = responseData.total_invoices;
          const totalPages = Math.ceil(totalInvoices / recordsPerPage);
          setTotalPages(totalPages);
        } else {
          throw response;
        }
      } else {
        setError("An error occurred");
      }
    }
    loadInvoices();
  }, [currentPage, recordsPerPage]);

  //Api for navigating to a specific invoice by clicking on details icon
  const handleSpecificInvoice = async (invoice_id) => {
    try {
      const token = getAuthTokenCookie();
      const response = await fetch(`${API_URL}/invoices/${invoice_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        setInvoices(responseData.data);
      } else {
        throw new Error("Failed to fetch category details");
      }
    } catch (error) {
      console.error("Error:", error);
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
        viewBox="0 0 16 16"
      >
        <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
      </svg>
      <div>
        <label className="center2">
          <b>Invoices</b>
        </label>
      </div>

      <label className="invoicesLabel">
        <b>Invoices List</b>
      </label>

      <div className="input-group rounded searchInput ">
        <input
          type="search"
          className="form-control rounded  "
          id="searchinput"
          placeholder="Search By Invoices ID or Order Number"
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
          className="bi bi-search searchIcon"
          viewBox="0 0 11 16"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
        </svg>
      </div>
      <div className="il-dropdown il-filterdropdwn">
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
        <span className="filterlabel">-Filter by Date-</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="19"
          height="19"
          fill="currentColor"
          className="bi bi-chevron-down il-filterdownicon"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
          />
        </svg>

        <div className="date-range il-dropdown-content il-filtercontent ">
          <label className="date-range-label">Start Date</label>
          <input
            type="date"
            className="form-control date-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <label className="date-range-label  ">End Date</label>
          <input
            type="date"
            className="form-control date-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <div className="filter-buttons">
            <button
              className="filter-button "
              onClick={handleFilterButtonClick}
            >
              Filter
            </button>
            <button className="clear-button" onClick={handleClearButtonClick}>
              Clear
            </button>
          </div>
        </div>
      </div>

      <Table triped hover id="il-table">
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th>Order Number</th>
            <th>Total Amount</th>
            <th>Supplier</th>
            <th>Date</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody className="il-tbody">
          {filteredData.slice(firstIndex, lastIndex).map((item, index) => (
            <tr key={index}>
              <td>{item.attributes.id}</td>
              <td>{item.attributes.order_number}</td>
              <td>{item.attributes.total_amount}</td>
              <td>{item.attributes.supplier.supplier_name}</td>
              <td>
                {format(new Date(item.attributes.created_at), "yyyy-MM-dd")}
              </td>
              <td>
                <Link to={`/inventory-dashboard/invoiceDetails/${item.id}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="#032B55"
                    class="bi bi-eye-fill"
                    viewBox="0 0 16 16"
                    onClick={() => handleSpecificInvoice(item.id)}
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
        <ul className="pagination pgil">
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
      <Link to={"/inventory-dashboard/addInvoice"}>
        <button className="addinvoiceButton ">
          <b>Add Invoice</b>
        </button>
      </Link>
    </>
  );
};

export default InvoicesList;
