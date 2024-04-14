import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'; // Import useParams
import './OrderList.css'
import Table from 'react-bootstrap/esm/Table'
import Sidebar from "../../../PharmacyDashboard/Sidebar/Sidebar";


const OrderList = () => {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const{id} =useParams();
    const [medicine, setMedicine] = useState("");
    const [ingredient_name, setIngredientName] = useState("");
    const [commercial_name, setCommercialName] = useState("");
    const [quantity_sold, setQuantitySold] = useState(0);
    const [quantity_in_pharmacy, setQuantitySInPharmacy] = useState(0);
    const [quantity_in_inventory, setQuantityInInventory] = useState(0);
    // const [totalMedicines, setTotalMedicines] = useState(60);
    const [medicines, setMedicines] = useState([]);
    const recordsPerPage = 4;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const filteredData = medicines.filter(
      (item) =>
        search.toLowerCase() === "" ||
        item.attributes.ingredient_name.toLowerCase().includes(search.toLowerCase())||
        item.attributes.commercial_name.toLowerCase().includes(search.toLowerCase())
    );
    const npage = Math.ceil(medicines.length / recordsPerPage);
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
    useEffect(() => {
      // Remove scroll bar
      document.body.style.overflow = 'hidden';
  
      // Cleanup on component unmount
      return () => {
        document.body.style.overflow = 'visible';
      };
    }, []);
  
  
  return (
    <>
    <Sidebar/>
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
          onChange={(e) => setSearch(e.target.value)}

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
      <Table triped  hover id="ordertable" className="">
        <thead>
          <tr>
            <th><p>Order ID</p></th>
            <th ><p>National ID</p></th>
            <th><p>Student Name</p></th>
            <th><p>Date</p></th>
            <th><p>Details</p></th>
          </tr>
        </thead>
        <tbody className="ordertable-body">
          {filteredData.slice(firstIndex, lastIndex).map((item, index) => (
            <tr key={index} className="medicine-container">
              <td>{item.attributes.ingredient_name}</td>
              <td>{item.attributes.commercial_name}</td>
              <td>{item.attributes.quantity_in_pharmacy}</td>
              <td>{item.attributes.quantity_in_inventory}</td>
              <td>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="#032B55"
                    class="bi bi-eye-fill"
                    viewBox="0 0 16 16"
                    onClick={() => handleSpecificMedicine(item.id)}
                  >
                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                  </svg>
              </td>
            </tr>
          ))}
        </tbody>
        
      </Table>
      <nav>
        <ul className="pagination">
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
      <div>
        <Link  to={"/pharmacy-dashboard/addOrder/"}>
          <button
            type="button"
            id="addorderbtn"
            className="btn btn-light btn-lg "
          >
            <b className="addorderlistbtn">Place Order</b>
          </button>
          </Link>
      </div>
      
    </>  )
}

export default OrderList