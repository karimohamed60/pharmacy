import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link, useParams } from "react-router-dom"; // Import useParams
import "./OrderList.css";
import Table from "react-bootstrap/esm/Table";
import Sidebar from "../../../PharmacyDashboard/Sidebar/Sidebar";
import { getAuthTokenCookie } from "../../../../services/authService";
import { API_URL } from "../../../../constants";
import { format } from "date-fns";

const OrderList = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [token, setToken] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [results, setResults] = useState([]); // Filtered medicines
  const [input, setInput] = useState("");
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

  //search
  useEffect(() => {
    if (search !== "") {
      handleSearch(search, currentPage);
    } else {
      getOrders(currentPage, token);
    }
  }, [search, currentPage]);

  
  const handleSearch = async (value, currentPage) => {
    try {
      const token = getAuthTokenCookie();
      const response = await fetch(`${API_URL}/orders/search?q=${value}&page=${currentPage}&per_page=${recordsPerPage}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to search orders");

      const data = await response.json();
      setResults(data.data);
      setTotalPages(Math.ceil(data.total / recordsPerPage));
      setCurrentPage(currentPage);
    } catch (error) {
      console.error("Error searching orders:", error.message);
    }
  };


  useEffect(() => {
    getOrders();
  }, [recordsPerPage]);

  const getOrders = async () => {
    try {
      const token = getAuthTokenCookie();
      if (!token) {
        console.error("Token not found");
        return;
      }

      setToken(token);

      const response = await fetch(
        ` ${API_URL}/orders?per_page=${recordsPerPage}&page=${currentPage}`,
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
      const totalOrders = data["total_orders"]; // Assuming total_students is the correct key
      setTotalPages(Math.ceil(totalOrders / recordsPerPage));
      setOrders(data.data);
    } catch (error) {
      console.error("Error occurred: ", error.message);
    }
  };
  const fetchOrders = async (page, token) => {
    try {
      const response = await fetch(
        `
        ${API_URL}/orders?per_page=${recordsPerPage}&page=${page}`,
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

      const fetchedOrders = await response.json();
      return fetchedOrders.data;
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
      const fetchedOrders = await fetchOrders(currentPage, token, search);
      setOrders(fetchedOrders);

      if (fetchedOrders.length > 10) {
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
  // navigate to a specific order
  const handleSpecificOrder = async (order_id) => {
    try {
      const token = getAuthTokenCookie();
      const response = await fetch(`${API_URL}/orders/${order_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();

        console.log(responseData);

        setOrders(responseData.data);
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
        className="bi bi-caret-right-fill ol-Arrowicon"
        viewBox="0 0 16 16"
      >
        <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
      </svg>
      <div>
        <label className="Order-title">
          <b>Orders</b>
        </label>
      </div>

      <label className="OrderList-title">
        <b>Orders List</b>
      </label>

      <div className="order-search-group rounded search-input ">
        <input
          type="search"
          className="form-control rounded "
          id="srchinput"
          placeholder="Search by National ID"
          aria-label="Search"
          aria-describedby="search-addon"
          value={input}
          onChange={(e) => handleChange(e.target.value)}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="19"
          height="19"
          fill="currentColor"
          className="bi bi-search order-search-icon"
          viewBox="0 0 11 16"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
        </svg>
      </div>
      <Table hover id="ordertable" className="">
        <thead>
          <tr>
            <th>
              <p>Order ID</p>
            </th>
            <th>
              <p>National ID</p>
            </th>
            <th>
              <p>Student Name</p>
            </th>
            <th>
              <p>Date</p>
            </th>
            <th>
              <p>Details</p>
            </th>
          </tr>
        </thead>
        <tbody className="ordertable-body">
          {search !== ""
            ? results.map((item, index) => (
                <tr key={index} className="medicine-container">
                  <td>{item.id}</td>
                  <td>{item.attributes.student.student_national_id}</td>
                  <td>{item.attributes.student.student_name}</td>
                  <td>
                    {format(new Date(item.attributes.created_at), "yyyy-MM-dd")}
                  </td>
                  <td>
                    <Link to={`/pharmacy-dashboard/orderDetails/${item.id}`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="#032B55"
                        className="bi bi-eye-fill"
                        viewBox="0 0 16 16"
                        onClick={() => handleSpecificOrder(item.id)}
                      >
                        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                      </svg>
                    </Link>
                  </td>
                </tr>
              ))
            : orders.map((item, index) => (
                <tr key={index} className="medicine-container">
                  <td>{item.id}</td>
                  <td>{item.attributes.student.student_national_id}</td>
                  <td>{item.attributes.student.student_name}</td>
                  <td>
                    {format(new Date(item.attributes.created_at), "yyyy-MM-dd")}
                  </td>
                  <td>
                    <Link to={`/pharmacy-dashboard/orderDetails/${item.id}`}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="#032B55"
                        className="bi bi-eye-fill"
                        viewBox="0 0 16 16"
                        onClick={() => handleSpecificOrder(item.id)}
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
      <div>
        <Link to={"/pharmacy-dashboard/addOrder/"}>
          <button
            type="button"
            id="addorderbtn"
            className="btn btn-light btn-lg "
          >
            <b className="addorderlistbtn">Place Order</b>
          </button>
        </Link>
      </div>
    </>
  );
};

export default OrderList;
