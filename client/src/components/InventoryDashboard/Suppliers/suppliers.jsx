import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Popup from "reactjs-popup";
import Table from "react-bootstrap/Table";
import { getAuthTokenCookie } from "../../../services/authService";
import Cookies from "js-cookie";
import { API_URL } from "../../../constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./suppliers.css";
import ReactPaginate from "react-paginate";

const Suppliers = () => {
  const [isPopup1Open, setPopup1Open] = useState(false);
  const [isPopup2Open, setPopup2Open] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [supplier_name, setSupplierName] = useState("");
  const [supplier, setSupplier] = useState({});
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSupplierValue, setSelectedSupplierValue] = useState("");
  const [
    selectedSupplierDescriptionValue,
    setSelectedSupplierDescriptionValue,
  ] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const recordsPerPage = 10;
  const [token, setToken] = useState("");
  const renderedSuppliers = suppliers.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const renderSuppliers = search.trim() !== "" ? renderedSuppliers : suppliers;

  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  useEffect(() => {
    setDate(getCurrentDate());
  }, []);

  useEffect(() => {
    loadSuppliers();
  }, [currentPage, search]);

  const loadSuppliers = async () => {
    try {
      const authToken = getAuthTokenCookie();
      if (!authToken) {
        console.error("Token not found");
        return;
      }

      setToken(authToken);

      let url = `${API_URL}/suppliers?per_page=${recordsPerPage}&page=${currentPage}`;

      if (search.trim() !== "") {
        url = `${API_URL}/suppliers/search?q=${search}&per_page=${recordsPerPage}&page=${currentPage}`;
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
      const totalSuppliers = data.total_suppliers;
      setTotalPages(Math.ceil(totalSuppliers / recordsPerPage));
      setSuppliers(data.data);
    } catch (error) {
      console.error("Error occurred: ", error.message);
    }
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };

  const fetchSuppliers = async (url, token) => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch suppliers");
      }

      const fetchedSuppliers = await response.json();
      return fetchedSuppliers.data;
    } catch (error) {
      console.error("Error fetching suppliers: ", error.message);
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user_id = Cookies.get("user_id");
      const postData = {
        supplier_name,
        description,
        date,
        user_id,
      };
      const token = getAuthTokenCookie();

      if (!token) {
        console.error("Token not found");
        return;
      }

      const existingSupplier = suppliers.find(
        (supplier) =>
          supplier.attributes.supplier_name.toLowerCase() ===
          supplier_name.toLowerCase()
      );

      if (existingSupplier) {
        console.error("Supplier with the same name already exists");
        notify("error", "Supplier with the same name already exists");
        return;
      }

      const response = await fetch(`${API_URL}/suppliers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const responseData = await response.json();
        setSuppliers([...suppliers, responseData.data]);
        notify("success", "Supplier added successfully");
        setSupplierName("");
        setDescription("");
      } else {
        notify("error", "Error Adding Supplier");
        console.error("Error: " + response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSpecificSupplier = async (supplierId) => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`${API_URL}/suppliers/${supplierId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const responseData = await response.json();
        window.suppliername = responseData.data.attributes.supplier_name;
        window.currentdate = responseData.data.attributes.date;
        window.description = responseData.data.attributes.description;
        setSupplier(responseData.data);
        setSelectedSupplierValue("");
        setSelectedSupplierDescriptionValue("");
        openPopup2();
      } else {
        throw new Error("Failed to fetch supplier details");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSupplierValueUpdate = async () => {
    try {
      const token = getAuthTokenCookie();
      if (
        typeof selectedSupplierValue !== "string" ||
        !selectedSupplierValue.trim() ||
        typeof selectedSupplierDescriptionValue !== "string" ||
        !selectedSupplierDescriptionValue.trim()
      ) {
        console.error("Supplier name or description cannot be empty");
        notify("error", "Error Updating Supplier");
        return;
      }
      const supplierId = supplier.id;
      if (token) {
        const response = await fetch(`${API_URL}/suppliers/${supplierId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            supplier_name: selectedSupplierValue,
            description: selectedSupplierDescriptionValue,
          }),
        });
        if (response.ok) {
          notify("success", "Supplier updated successfully");
          const updatedSupplierResponse = await fetch(
            `${API_URL}/suppliers/${supplierId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (updatedSupplierResponse.ok) {
            const updatedSupplierData = await updatedSupplierResponse.json();
            setSuppliers(
              suppliers.map((s) =>
                s.id === supplierId ? updatedSupplierData.data : s
              )
            );
            setSupplier(updatedSupplierData.data);
          } else {
            throw new Error("Failed to fetch updated supplier data");
          }
        } else {
          notify("error", "Error Updating Supplier");
          throw new Error("Failed to update supplier value");
        }
      }
    } catch (error) {
      console.error("Error: ", error.message);
    }
  };

  const openPopup1 = () => {
    setPopup1Open(true);
  };

  const closePopup1 = () => {
    setPopup1Open(false);
  };

  const openPopup2 = () => {
    setPopup2Open(true);
  };

  const closePopup2 = () => {
    setPopup2Open(false);
  };

  const goBack = () => {
    setPopup2Open(false);
  };

  const goBack2 = () => {
    setPopup1Open(false);
  };

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
          <b>Suppliers</b>
        </label>
      </div>
      <label className="medlistlabel">
        <b>Suppliers List</b>
      </label>
      <div className="input-group rounded seachinput " id="sstl">
        <input
          type="search"
          className="form-control rounded "
          id="srchinput"
          placeholder="Search by supplier name"
          aria-label="Search"
          aria-describedby="search-addon"
          onChange={(e) => setSearch(e.target.value)}
        />

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
      </div>

      <Popup open={isPopup2Open} onClose={closePopup1} position="right center">
        <div>
          <Link to="/inventory-dashboard/suppliers">
            <button className="closeiconcatlist" onClick={goBack}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                fill="currentColor"
                className="bi bi-x-lg "
                viewBox="0 0 16 16"
              >
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
              </svg>
            </button>
          </Link>
          <label className="editsupppopup">
            <h5>
              <b> Suppliers Details</b>
            </h5>
          </label>
          <form className="popupfrmsupp" onSubmit={handleSpecificSupplier}>
            <div className="row">
              <div className="col">
                <label className=" adcasuppnm " htmlFor="supplier_name">
                  <b>Supplier Name</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="supplier_name"
                  name="suppliernameinputt"
                  value={selectedSupplierValue}
                  placeholder={window.suppliername}
                  aria-label="First name"
                  onChange={(e) => setSelectedSupplierValue(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label htmlFor="date" className="adcasupp">
                  <b>Date</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="date"
                  name="suppnamein"
                  placeholder={window.currentdate}
                  aria-label="First name"
                  disabled
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label className="adcasuppdes2" htmlFor="description">
                  <b>Description</b>
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  id="description"
                  name="suppdescin2"
                  placeholder={window.description}
                  onChange={(e) =>
                    setSelectedSupplierDescriptionValue(e.target.value)
                  }
                  aria-label="First name"
                  required
                />
              </div>
            </div>
          </form>
          <button
            type="submit"
            className="btn btn-light btn-lg "
            id="editsupplierdetails"
            onClick={handleSupplierValueUpdate}
          >
            <b className="medlistbtn2">Update</b>
          </button>

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
            transition:Bounce
          />
        </div>
      </Popup>

      <Table hover id="sl-table" className="">
        <thead>
          <tr>
            <th>Supplier</th>
            <th>Date</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody className="sl-tbody">
          {renderSuppliers.map((item, index) => (
            <tr key={index}>
              <td>{item.attributes.supplier_name}</td>
              <td>{item.attributes.date}</td>
              <td>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="#032B55"
                  className="bi bi-eye-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                </svg>
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

      <Link to={""}>
        <button
          type="button"
          className="btn btn-light btn-lg "
          id="addmedbtnsupp"
          onClick={openPopup1}
        >
          <b className="medlistbtn">Add Supplier</b>
        </button>
      </Link>
      <Popup open={isPopup1Open} onClose={closePopup1} position="right center">
        <div>
          <Link to="/inventory-dashboard/suppliers">
            <button className="closeiconcatlist" onClick={goBack2}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                fill="currentColor"
                className="bi bi-x-lg "
                viewBox="0 0 16 16"
              >
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
              </svg>
            </button>
          </Link>
          <label className="addsupppopup">
            <h5>
              <b> Add Supplier</b>
            </h5>
          </label>
          <form className="popupfrmsupp" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col">
                <label className="adcasuppnm" htmlFor="supplier_name">
                  <b>Supplier Name</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  htmlFor="supplier_name"
                  value={supplier_name}
                  id="supplier_name"
                  name="supplierameinputt"
                  aria-label="First name"
                  onChange={(e) => setSupplierName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col">
                <label className="adcasuppdes" htmlFor="description">
                  <b>Description</b>
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  htmlFor="description"
                  id="description"
                  value={description}
                  name="suppdescin"
                  aria-label="First name"
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col">
                <input
                  type="hidden"
                  className="form-control"
                  htmlFor="date"
                  id="date"
                  value={date}
                  aria-label="First name"
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </form>
            <button
              type="submit"
              className="btn btn-light btn-lg "
              id="editsupplierdetails"
              onClick={handleSupplierValueUpdate}
            >
              <b className="medlistbtn2">Update</b>
            </button>
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
              transition="Bounce"
            />
          </form>
        </div>
      </Popup>
    </>
  );
};

export default Suppliers;
