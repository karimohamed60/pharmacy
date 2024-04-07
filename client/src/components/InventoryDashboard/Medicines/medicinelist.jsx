import "./medicinelist.css";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { data3 } from "../../../data";
import Table from "react-bootstrap/Table";
import Cookies from "js-cookie";
import { API_URL } from "../../../constants";
import { getAuthTokenCookie } from "../../../services/authService";

const Medicinelist = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const{id} =useParams();
  const [medicines, setMedicines] = useState([]);
  const recordsPerPage = 10;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const filteredData = medicines.filter(
    (item) =>
      search.toLowerCase() === "" ||
      item.attributes.ingredient_name.toLowerCase().includes(search.toLowerCase())||
      item.attributes.commercial_name.toLowerCase().includes(search.toLowerCase())
  );
  const records = data3.slice(firstIndex, lastIndex);
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
 
      useEffect(() => {
        async function loadMedicines() {
          const token = getAuthTokenCookie()
          if (token) {
            
            const per_page= 100;
            const response = await fetch(`${API_URL}/medicines?per_page=${per_page}&page${currentPage}`, { 
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              }
            });
            if (response.ok) {
              const responseData = await response.json();
              setMedicines(responseData.data);
            } else {
              throw response;
            }
          } else {
            setError("An error occured");
            console.log("An error", e);
          }
        }
        loadMedicines();
      }, [currentPage]);


      //fetch a specific medicine 
      const handleSpecificMedicine = async (medicineId) => {
        try {
          const token = Cookies.get('token');
          const response = await fetch(`${API_URL}/medicines/${medicineId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });
    
          if (response.ok) {
            const responseData = await response.json();
            window.medicineID=responseData.data.id;
            window.medicine_name=responseData.data.medicine_name
            window.ingredient_namefordetails=responseData.data.attributes.ingredient_name;
            setMedicines(responseData.data);
            
          } else {
            throw new Error('Failed to fetch category details');
          }
        } catch (error) {
          console.error('Error:', error);
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
          <b>Medicines</b>
        </label>
      </div>

      <label className="medlistlabel">
        <b>Medicine List</b>
      </label>
      {/* <p className='listofmedlabel'> <b>List of medicines available </b></p>
       */}

      <div className="input-group rounded seachinput ">
        <input
          type="search"
          className="form-control rounded "
          id="srchinput"
          placeholder="Search by Ingrediant or Commercial name"
          aria-label="Search"
          aria-describedby="search-addon"
          onChange={(e) => setSearch(e.target.value)}

        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="19"
          height="19"
          fill="currentColor"
          className="bi bi-search srchicon"
          viewBox="0 0 11 16"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
        </svg>
      </div>
      <Table triped  hover id="ml-table" className="">
        <thead>
          <tr>
            <th><p>Ingrediant Name</p></th>
            <th ><p>Commercial Name</p></th>
            <th>Pharmacy Quantity</th>
            <th>Inventory Quantity</th>
            <th>Sold Quantity</th>
            <th><p>Details</p></th>
          </tr>
        </thead>
        <tbody className="ml-tbody">
          {filteredData.slice(firstIndex, lastIndex).map((item, index) => (
            <tr key={index} className="medicine-container">
              <td>{item.attributes.ingredient_name}</td>
              <td>{item.attributes.commercial_name}</td>
              <td>{item.attributes.quantity_in_pharmacy}</td>
              <td>{item.attributes.quantity_in_inventory}</td>
              <td>{item.attributes.quantity_sold}</td>
              <td>
                <Link to={`/inventory-dashboard/medicinedetails/${item.id}`}>
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
                </Link>
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
        <Link to={"/inventory-dashboard/addmedicine"}>
          <button
            type="button"
            id="addmedbtn"
            className="btn btn-light btn-lg "
          >
            <b className="medlistbtn">Add Medicine</b>
          </button>
        </Link>
      </div>
      
    </>
  );
};
export default Medicinelist;
