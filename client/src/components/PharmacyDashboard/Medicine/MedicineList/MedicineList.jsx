import Sidebar from "../../../PharmacyDashboard/Sidebar/Sidebar";
import "./MedicineList.css";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Cookies from "js-cookie";
import { API_URL } from "../../../../constants";
import { getAuthTokenCookie } from "../../../../services/authService";
import { Button, Modal } from "react-bootstrap";

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
  // const [totalMedicines, setTotalMedicines] = useState(60);
  const [medicines, setMedicines] = useState([]);
  const recordsPerPage = 4;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
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
  const npage = Math.ceil(medicines.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1); // State to manage quantity

  // Function to increase quantity
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  // Function to decrease quantity
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
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
    document.body.style.overflow = "hidden";

    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
 
  const [medicineFields, setMedicineFields] = useState([
    { medicineId: "", quantity: 1, warning: "" },
  ]);

  const handleMedicineIdChange = (index, event) => {
    const inputValue = event.target.value;
    const updatedMedicineFields = [...medicineFields];

    if (/^\d+$/.test(inputValue)) {
      updatedMedicineFields[index].medicineId = inputValue;
      updatedMedicineFields[index].warning = "";
    } else {
      updatedMedicineFields[index].medicineId = "";
      updatedMedicineFields[index].warning = "Medicine Id must be an integer.";
    }

    setMedicineFields(updatedMedicineFields);
  };
  const handleAddMedicine = () => {
    if (medicineFields.length < 4) {
      setMedicineFields([
        ...medicineFields,
        { medicineId: "", quantity: 1, warning: "" },
      ]);
    }
  };
  const handleQuantityChange = (index, newQuantity) => {
    if (newQuantity >= 1) {
      const updatedMedicineFields = [...medicineFields];
      updatedMedicineFields[index].quantity = newQuantity;
      setMedicineFields(updatedMedicineFields);
    }
  };

  const handleRemoveMedicine = (index) => {
    const updatedMedicineFields = [...medicineFields];
    updatedMedicineFields.splice(index, 1);
    setMedicineFields(updatedMedicineFields);
  };

  //fetch a specific medicine


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
      <form>
        {/* Form content */}
        <div className="ao-row">
          <div className="ao-form-group">
            {/* Button to open modal */}
            <Button variant="primary" onClick={handleShowModal}>
              open{" "}
            </Button>
          </div>
        </div>
      </form>

      {/* Bootstrap Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>New Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          <div className="ao-row p-5">
            <div className="ao-form-group">
              <div className="aoo-input-group ">
                <label className="ao-label ao-national">National ID:</label>
                <select className="ao-select mb-2 toleft"></select>
              </div>
            </div>
            <div className="ao-form-group">
              <div className="aoo-input-group">
                <label className="ao-label ">Student Name:</label>
                <input className="ao-input mb-2 toleft" type="text" disabled />
              </div>
            </div>
          </div>
          <div className="ao-row">
            <div className="ao-form-group dmarge">
              <a
                type="button"
                className="ao-addMedicineBtn dmarge"
                onClick={handleAddMedicine}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="rgba(0, 154, 241, 1)"
                  className="bi bi-plus-circle-fill "
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
                </svg>
                {" Add Medicine"}
              </a>
            </div>
          </div>
          {medicineFields.map((medicine, index) => (
            <div key={index} className="medicine-fields">
              <div className="ao-row">
                <div className="ao-form-group">
                  <div className="quantity-and-remove">
                    <label className="ao-label">
                      Medicine ID:
                      <input
                        className="ao-input mb-2"
                        type="text"
                        value={medicine.medicineId}
                        onChange={(e) => handleMedicineIdChange(index, e)}
                      />
                    </label>
                    {medicine.warning && (
                      <span className="warning-message">
                        {medicine.warning}
                      </span>
                    )}

                    <div className="quantity-controls ao-row">
                      <button
                        onClick={() =>
                          handleQuantityChange(index, medicine.quantity - 1)
                        }
                      >
                        {" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="bi bi-dash-lg"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8"
                          />
                        </svg>
                      </button>
                      <input
                        type="text "
                        className="awesome"
                        value={medicine.quantity}
                        readOnly
                      />
                      <button
                        onClick={() =>
                          handleQuantityChange(index, medicine.quantity + 1)
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg "
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="bi bi-plus-lg "
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
                          />
                        </svg>
                      </button>
                    </div>

                    {medicineFields.length > 1 && (
                      <button
                        type="button"
                        className=" removebtn"
                        onClick={() => handleRemoveMedicine(index)}
                      >
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
          <Button
            className="ao-confirm-btn "
            onClick={handleCloseModal}
            type="submit"
          >
            <b>Confirm Order </b>
          </Button>
          <Button variant="primary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="search-group rounded search-input ">
        <input
          type="search"
          className="form-control rounded "
          id="srchinput"
          placeholder="Search by Barcode"
          aria-label="Search"
          aria-describedby="search-addon"
          onChange={(e) => setSearch(e.target.value)}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="19"
          height="19"
          fill="currentColor"
          className="bi bi-search search-icon"
          viewBox="0 0 11 16"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
        </svg>
      </div>
      <Table triped hover id="medicinetable" className="">
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
            <th>
              <p>Counter</p>
            </th>
            <th>
              <p>Chart</p>
            </th>
          </tr>
        </thead>
        <tbody className="medicinetable-body">
          {filteredData.slice(firstIndex, lastIndex).map((item, index) => (
            <tr key={index} className="medicine-container">
              <td>{item.attributes.ingredient_name}</td>
              <td>{item.attributes.commercial_name}</td>
              <td>{item.attributes.quantity_in_pharmacy}</td>
              <td>{item.attributes.quantity_in_inventory}</td>
              <td>{item.attributes.quantity_sold}</td>
              <td>
                <Link to={"/inventory-dashboard/medicinelist"}>
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
              <td>                    <div className="quantity-controls ao-row">
                      <button
                        onClick={() =>
                          handleQuantityChange(index, medicine.quantity - 1)
                        }
                      >
                        {" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="bi bi-dash-lg"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8"
                          />
                        </svg>
                      </button>
                      <input
                        type="text "
                        className="awesome"
                        value={medicine.quantity}
                        readOnly
                      />
                      <button
                        onClick={() =>
                          handleQuantityChange(index, medicine.quantity + 1)
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg "
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="bi bi-plus-lg "
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
                          />
                        </svg>
                      </button>
                    </div></td>
              <td>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  class="bi bi-cart3"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
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
    </>
  );
};

export default MedicineList;
