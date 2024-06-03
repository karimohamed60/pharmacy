import Sidebar from "../../../PharmacyDashboard/Sidebar/Sidebar";
import "./MedicineList.css";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";
import { API_URL } from "../../../../constants";
import { getAuthTokenCookie } from "../../../../services/authService";
import { Button, Modal } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import Select from "react-select";
import { ToastContainer, toast , Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MedicineList = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { id } = useParams();
  const [medicine, setMedicine] = useState("");
  const [ingredient_name, setIngredientName] = useState("");
  const [commercial_name, setCommercialName] = useState("");
  const [quantity_sold, setQuantitySold] = useState(0);
  const [quantity_in_pharmacy, setQuantitySInPharmacy] = useState(0);
  const [quantity_in_inventory, setQuantityInInventory] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const [token, setToken] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [medicines, setMedicines] = useState([]);
  const [results, setResults] = useState([]); // Filtered medicines
  const [selectedMedicineId, setSelectedMedicineId] = useState(null); // Step 1
  const [input, setInput] = useState("");
  const recordsPerPage = 10;
  const [students, setStudents] = useState([]);
  const [National_IDoptions, setsNational_IDoptions] = useState([]);
  const [student_national_id, setstudent_national_id] = useState("");
  const [studentName, setStudentName] = useState(""); // State to store student name
  const [student_id, setStudentID] = useState(""); // State to store student name
  const [studentIds, setStudentIds] = useState([]);
  const [orders, setOrders] = useState([]);

  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const npage = Math.ceil(medicines.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(); // State to manage quantity

  // Function to increase quantity

  const notify = (type, message) => {
    if (type === "success") {
      toast.success(message, {
        position: "top-center",
      });
    } else if (type === "error") {
      toast.error(message, {
        position: "top-center",
      });
    }
  };

  const handleQuantityChange = (index, newQuantity) => {
    const updatedMedicineFields = [...medicineFields];
    updatedMedicineFields[index].quantity = newQuantity;
    setMedicineFields(updatedMedicineFields);
  };

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

  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);

  const handleShowModal = (selectedMedicineId) => {
    setSelectedMedicineId(selectedMedicineId);
    setShowModal(true);
    console.log(selectedMedicineId);
  };
  const [medicineFields, setMedicineFields] = useState([
    { medicine_id: "", quantity: "1", warning: "" },
  ]);

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index][field] = value;
    // Calculate amount based on quantity, price, and discount
    const quantity = parseFloat(updatedMedicines[index].quantity) || 0;
    setMedicines(updatedMedicines);
  };
  const handleMedicine_id = (index, e) => {
    const value = e.target.value;
    // Check if the input only contains numbers
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      handleMedicineChange(index, "medicine_id", value);
    }
  };

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
      console.log(authToken);

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
        <label className="Medicine-title">
          <b>Medicines</b>
        </label>
      </div>

      <label className="MedicineList-title">
        <b>Medicine List</b>
      </label>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        size="lg"
        style={{ marginTop: "15rem" }}
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <Modal.Header closeButton>
            <Modal.Title>New Order</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {" "}
            <div className="ao-row p-5">
              <div className="ao-form-group">
                <div className="aoo-input-group ">
                  <label className="ao-label ao-national national_idLabel">
                    National ID:
                  </label>

                  <Select
                    className="ao-select mb-2"
                    id=""
                    options={National_IDoptions}
                    value={National_IDoptions.find(
                      (option) => option.value === student_national_id
                    )}
                    onChange={(selectedOption) => {
                      setstudent_national_id(selectedOption.value);
                      handleNationalIDChange(selectedOption); // Call handleNationalIDChange
                    }}
                    onInputChange={(inputValue) => setSearchTerm(inputValue)}
                  />
                </div>
              </div>
              <div className="ao-form-group">
                <div className="aoo-input-group">
                  <label className="ao-label ">Student Name:</label>
                  <input
                    className="ao-input mb-2 toleft"
                    type="text"
                    disabled
                    value={studentName}
                  />
                </div>
              </div>
            </div>
            {medicineFields.map((medicine, index) => (
              <div key={index} className="medicine-fields">
                <div className="ao-row">
                  <div className="ao-form-group">
                    <div className="quantity-and-remove">
                      <label className="ao-label ">
                        Medicine ID:
                        <input
                          className="ao-input mb-2 medicine_idInput"
                          type="text"
                          value={selectedMedicineId}
                          onChange={(e) => handleMedicine_id(index, e)}
                        />
                      </label>
                      {medicine.warning && (
                        <span className="warning-message">
                          {medicine.warning}
                        </span>
                      )}

                      <div className="quantity-controls ao-row">
                        <input
                          type="number"
                          className="awesome quantityCounter"
                          value={medicine.quantity}
                          onChange={(e) =>
                            handleQuantityChange(index, e.target.value)
                          } // Pass index and new quantity
                        />
                      </div>

                      {medicineFields.length > 1 && (
                        <button type="button" className=" removebtn">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="bi bi-trash3-fill "
                            viewBox="0 0 16 16"
                          >
                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                          </svg>{" "}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button className="ao-confirm-btn " type="submit">
              <b>Confirm Order </b>
            </Button>
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              transition={Bounce}
            />
            <Button variant="primary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      <div className="search-group rounded search-input ">
        <input
          type="search"
          className="form-control rounded "
          id="p-srchinput"
          placeholder="Search by Ingredient name or  Commercial name"
          aria-label="Search"
          aria-describedby="search-addon"
          //onChange={(e) => handleChange(e.target.value)}
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
          className="bi bi-search iconInmedicine_list"
          viewBox="0 0 11 16"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
        </svg>
      </div>
      <Table hover id="medicinetable" className="">
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
        <tbody className="medicinetable-body">
          {renderMedicines.map((item, index) => (
            <tr key={index} className="medicine-container">
              <td>{item.attributes.ingredient_name}</td>
              <td>{item.attributes.commercial_name}</td>
              <td>{item.attributes.quantity_in_pharmacy}</td>
              <td>{item.attributes.quantity_in_inventory}</td>
              <td>{item.attributes.quantity_sold}</td>
              <td>
                <Link to={`/pharmacy-dashboard/medicineDetails/${item.id}`}>
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
      <Link to={`/pharmacy-dashboard/addOrder/`}>
        <button className="p-orderMEdicine">Place Order</button>
      </Link>
      <ReactPaginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={"..."}
        pageCount={totalPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={"pagination justify-content-center "}
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

export default MedicineList;
