import "./medicinelist.css";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";
import { getAuthTokenCookie } from "../../../../services/authService";
import { API_URL } from "../../../../constants";
import ReactPaginate from "react-paginate";
import Isidebar from "../../Isidebar/Isidebar";

const Medicinelist = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { id } = useParams();
  const [medicines, setMedicines] = useState([]);
  const recordsPerPage = 10;
  const [totalPages, setTotalPages] = useState(0);
  const [token, setToken] = useState("");

  useEffect(() => {
    loadMedicines();
  }, [currentPage, search]);

  const loadMedicines = async () => {
    try {
      const authToken = getAuthTokenCookie();
      if (!authToken) {
        console.error("Token not found");
        return;
      }

      setToken(authToken);

      let url = `${API_URL}/medicines?per_page=${recordsPerPage}&page=${currentPage}`;

      if (search.trim() !== "") {
        // If search term is present, use search API endpoint
        url = `${API_URL}/medicines/search?q=${search}&per_page=${recordsPerPage}&page=${currentPage}`;
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
      const totalMedicines = data.total_medicines;
      setTotalPages(Math.ceil(totalMedicines / recordsPerPage));
      setMedicines(data.data);
    } catch (error) {
      console.error("Error occurred: ", error.message);
    }
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };

  const handleSpecificMedicine = async (medicineId) => {
    try {
      const authToken = getAuthTokenCookie();
      const response = await fetch(`${API_URL}/medicines/${medicineId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        window.medicineID = responseData.data.id;
        window.medicine_name = responseData.data.medicine_name;
        window.ingredient_namefordetails =
          responseData.data.attributes.ingredient_name;
        setMedicines(responseData.data);
      } else {
        throw new Error("Failed to fetch category details");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const filteredData = medicines.filter(
    (item) =>
      search.toLowerCase() === "" ||
      item.attributes.ingredient_name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.attributes.commercial_name
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const renderedMedicines = filteredData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const renderMedicines =
    search.trim() !== "" ? renderedMedicines : filteredData;

  return (
    <>
      <Isidebar />

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
      <div className="input-group rounded seachinput " id="mlitl">
        <input
          type="search"
          className="form-control rounded "
          id="srchinput"
          placeholder="Search by Ingrediant or Commercial name"
          aria-label="Search"
          aria-describedby="search-addon"
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
          className="bi bi-search srchicon"
          viewBox="0 0 11 16"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
        </svg>
      </div>
      <Table striped="true" hover id="ml-table" className="">
        <thead>
          <tr>
            <th>
              <p>Ingrediant Name</p>
            </th>
            <th>
              <p>Commercial Name</p>
            </th>
            <th>
              <p>Pharmacy Quantity</p>
            </th>
            <th>
              <p>Inventory Quantity</p>
            </th>
            <th>
              <p>Sold Quantity</p>
            </th>
            <th>
              <p>Details</p>
            </th>
          </tr>
        </thead>
        <tbody className="ml-tbody">
          {renderMedicines.map((item, index) => (
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
                    className="bi bi-eye-fill"
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
      {totalPages > 0 && (
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
          className=""
        />
      )}
      <div>
        <Link to={"/inventory-dashboard/medicines/add"}>
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
