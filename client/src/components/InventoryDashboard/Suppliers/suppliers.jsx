import "./suppliers.css";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import Table from "react-bootstrap/Table";
import { getAuthTokenCookie } from "../../../services/authService";
import Cookies from "js-cookie";
import { API_URL } from "../../../constants";

const Suppliers = () => {
  const [isPopup1Open, setPopup1Open] = useState(false);
  const [isPopup2Open, setPopup2Open] = useState(false);
  const [supplier_name, setSupplierName] = useState("");
  const [suppliers, setSuppliers] = useState([])
  const [supplier, setSupplier] = useState({});
  const [date, setDate] = useState('');
  const [description, setDescription] = useState("");
  const [selectedSupplierValue, setSelectedSupplierValue] = useState(null);
  const [selectedSupplierDescriptionValue, setSelectedSupplierDescriptionValue] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 2;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const filteredData = suppliers.filter(
    (item) =>
      search.toLowerCase() === "" ||
      item.attributes.supplier_name.toLowerCase().includes(search.toLowerCase())
  );
  const records = filteredData.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredData.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    // Remove scroll bar
    document.body.style.overflow = "hidden";

    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  useEffect(() => {
    const gettDate = () => {
      const currentDate = new Date();
      // Convert date to string in ISO format
      const formattedDate = currentDate.toISOString();
      return formattedDate;
    };

    setDate(gettDate());
  }, []);
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
// Add new supplier
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user_id = Cookies.get('user_id')
    const postData = {
      supplier_name,
      description,
      date,
      user_id
    };
    const token = getAuthTokenCookie()
    if (token) {
      const response = await fetch(`${API_URL}/suppliers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(postData),
      });
      if (response.ok) {
        const responseData = await response.json();
        setSuppliers([...suppliers, responseData.data]);
        setSupplierName("");
        setDescription("")
      } else {
        alert('Error: ' + response.statusText);
      }
    } else {
      const errorMessage = await response.text();
      alert('No token found');
    }
  }
// to show all suppliers
  useEffect(() => {
    async function loadSuppliers() {
      const token = getAuthTokenCookie()
      if (token) {
        const response = await fetch(`${API_URL}/suppliers`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.ok) {
          const responseData = await response.json();
          setSuppliers(responseData.data);
        } else {
          throw response;
        }
      } else {
        setError("An error occurred");
      }
    }
    loadSuppliers();
  }, []);
//to show the details of a specific supplier
  const handleSpecificSupplier = async (supplierId) => {
    try {
      const token = Cookies.get('token');
      const response = await fetch(`${API_URL}/suppliers/${supplierId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const responseData = await response.json();
        window.suppliername = responseData.data.attributes.supplier_name;
        window.currentdate = responseData.data.attributes.date;
        window.description = responseData.data.attributes.description;
        setSupplier(responseData.data);
        openPopup2();
      } else {
        throw new Error('Failed to fetch supplier details');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

//update data
  const handleSupplierValueUpdate = async () => {
    try {
      const token = getAuthTokenCookie()

      if (!selectedSupplierValue.trim()) {
        console.error("Supplier value cannot be empty");
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
            description: selectedSupplierDescriptionValue
          }),
        });

        if (response.ok) {
          console.log("supplier value updated successfully");
          const updatedSupplierResponse = await fetch(`${API_URL}/suppliers/${supplierId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (updatedSupplierResponse.ok) {
            const updatedSupplierData = await updatedSupplierResponse.json();
            setSuppliers(
              suppliers.map((s) => (s.id === supplierId ? updatedSupplierData.data : s))
            );
            setSupplier(updatedSupplierData.data);
          } else {
            throw new Error("Failed to fetch updated supplier data");
          }
        }
        else {
          throw new Error("Failed to update supplier value");
        }
      }
    } catch (error) {
      console.error("Error: ", error.message);
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

      <div className="input-group rounded seachinputsupplier ">
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
          width="19"
          height="19"
          fill="currentColor"
          className="bi bi-search srchicon"
          viewBox="0 0 11 16"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
        </svg>
      </div>


      <Popup open={isPopup2Open} onClose={closePopup1} position="right center"  >
        <div >
          <Link to='/inventory-dashboard/suppliers'>
            <button className='closeiconcatlist' onClick={goBack}>

              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor" class="bi bi-x-lg " viewBox="0 0 16 16">
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
              </svg>

            </button>
          </Link>
          <label className='editsupppopup'><h5><b> Suppliers Details</b></h5></label>
          <form className='popupfrmsupp' onSubmit={handleSpecificSupplier} >

            <div className="row">
              <div className="col">
                <label className=' adcasuppnm ' htmlFor="supplier_name"><b>Supplier Name</b></label>
                <input type="text"
                  className="form-control"
                  id='supplier_name'
                  name="suppliernameinputt"
                  value={selectedSupplierValue}
                  placeholder={window.suppliername}
                  aria-label="First name"
                  onChange={(e) => setSelectedSupplierValue(e.target.value)}
                />

              </div>

            </div>
            <div className="row">
              <div className="col">
                <label  htmlFor="date" className='adcasupp'><b>Date</b></label>
                <input type="text" class="form-control" id='date' name="suppnamein" placeholder={window.currentdate} aria-label="First name" disabled />

              </div>

            </div>
            <div className="row">
              <div className="col">
                <label className='adcasuppdes2'htmlFor="description"><b>Description</b></label>
                <textarea type="text"
                  class="form-control"
                  id='description'
                  name="suppdescin2"
                  placeholder={window.description}
                  onChange={(e) => setSelectedSupplierDescriptionValue(e.target.value)}
                  aria-label="First name"
                  
                  />
                  
              </div>

            </div>

          </form>
          <button type="submit" className="btn btn-light btn-lg " id='editsupplierdetails' onClick={handleSupplierValueUpdate} ><b className='medlistbtn2'>Update</b></button>
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
          {filteredData.slice(firstIndex, lastIndex).map((item, index) => (
            <tr key={index}>
              <td>{item.attributes.supplier_name}</td>
              <td>{item.attributes.date}</td>
              <td>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="#032B55"
                  class="bi bi-eye-fill"
                  viewBox="0 0 16 16"
                  // onClick={openPopup2}
                  onClick={() => handleSpecificSupplier(item.id)}
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
                class="bi bi-x-lg "
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
                  type="string"
                  className="form-control"
                  htmlFor="supplier_name"
                  value={supplier_name}
                  id="supplier_name"
                  name="supplierameinputt"
                  aria-label="First name"
                  onChange={(e) => setSupplierName(e.target.value)}
                />
              </div>
            </div>

            <div className="row">
              <div className="col">
                <label className="adcasuppdes" htmlFor="description">
                  <b>Description</b>
                </label>
                <textarea
                  type="string"
                  className="form-control"
                  htmlFor="description"
                  id="description"
                  value={description}
                  name="suppdescin"
                  aria-label="First name"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="row">
              <div className="col">
                <input
                  type="hideen"
                  className="form-control"
                  htmlFor="date"
                  id="date"
                  value={date}
                  aria-label="First name"
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-light btn-lg "
              id="aaddsupp"
            >
              <b className="medlistbtn2">Add </b>
            </button>
          </form>
        </div>

      </Popup>
    </>
  );
};
export default Suppliers;
