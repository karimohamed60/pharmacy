import React, { useEffect, useState } from "react";
import "./AddInvoice.css";
import { Link } from "react-router-dom";
import { API_URL } from "../../../../constants";
import { getAuthTokenCookie } from "../../../../services/authService";
import Cookies from "js-cookie";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const AddInvoice = () => {
  const [medicinesData, setMedicines] = useState([
    { medicine_id: "", quantity: "", discount: "", price: "", amount: "" },
  ]);
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
  const [orderNumber, setOrderNumber] = useState("");
  const [orderNumberWarning, setOrderNumberWarning] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [order_number, setorder_number] = useState("");
  const [comments, setcomments] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [supplier_id, setSupplierId] = useState("");
  const [options, setOptions] = useState([]);
  const [supplieroptions, setsupplierOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedOption, setselectedOption] = useState(null);
  const [medicineOptions, setMedicineOptions] = useState([]);
  const handleChange = (selectedOption) => {
    setselectedOption(selectedOption);
  };

  useEffect(() => {
    // Remove scroll bar
    document.body.style.overflow = "hidden";

    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  const computeTotalAmount = () => {
    let total = 0;
    medicinesData.forEach((medicine) => {
      total += parseFloat(medicine.amount);
    });
    setTotalAmount(total.toFixed(2)); // Update the total amount state
  };

  useEffect(() => {
    computeTotalAmount();
  }, [medicinesData]);

  // Initialize discountWarnings and priceWarnings as arrays
  const [discountWarnings, setDiscountWarnings] = useState(
    Array(medicinesData.length).fill("")
  );
  const [priceWarnings, setPriceWarnings] = useState(
    Array(medicinesData.length).fill("")
  );

  const handleAddMedicine = () => {
    if (medicinesData.length < 4) {
      setMedicines([
        ...medicinesData,
        { medicine_id: "", quantity: "", discount: "", price: "", amount: "" },
      ]);
    }
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm)
  );

  const handleRemoveMedicine = (index) => {
    const updatedMedicines = [...medicinesData];
    updatedMedicines.splice(index, 1);
    setMedicines(updatedMedicines);
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...medicinesData];
    updatedMedicines[index][field] = value;
    //Calculate amount based on quantity, price, and discount
    const quantity = parseFloat(updatedMedicines[index].quantity) || 0;
    const price = parseFloat(updatedMedicines[index].price) || 0;
    const discount = parseFloat(updatedMedicines[index].discount) || 0;
    const amount = (quantity * price * (100 - discount)) / 100;
    updatedMedicines[index].amount = amount.toFixed(2);
    setMedicines(updatedMedicines);
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

  //API for showing suppliers
  useEffect(() => {
    async function loadSuppliers() {
      const token = getAuthTokenCookie();
      if (token) {
        const response = await fetch(`${API_URL}/suppliers`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const responseData = await response.json();
          setSuppliers(responseData.data);
          const supplierNames = responseData.data.map((item) => ({
            value: item.id,
            label: item.attributes.supplier_name,
          }));
          setsupplierOptions(supplierNames);
        } else {
          throw response;
        }
      } else {
        setError("An error occurred");
      }
    }
    loadSuppliers();
  }, []);

  //API for adding new invoice
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getAuthTokenCookie();
    const user_id = Cookies.get("user_id");
    const postData = {
      order_number,
      supplier_id,
      comments,
      user_id,
      invoice_medicines: medicinesData.map((medicine) => ({
        medicine_id: medicine.medicine_id,
        quantity: parseInt(medicine.quantity),
        discount: parseFloat(medicine.discount),
        price: parseFloat(medicine.price),
      })),
    };
    if (token) {
      try {
        const response = await fetch(`${API_URL}/invoices`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(postData),
        });
        if (response.ok) {
          const responseData = await response.json();
          setInvoices([...invoices, responseData.data]);
          notify("success", "Invoice added successfully!");
        } else {
          console.log("Error: " + response.statusText);
          notify("error", "Failed to add invoice!");
        }
      } catch (error) {
        console.error("Error:", error);
        notify("error", "Failed to add invoice!");
      }
    } else {
      alert("No token found");
    }
  };

  //load medicines
  /*useEffect(() => {
    async function loadMedicines(searchTerm) {
      const token = getAuthTokenCookie()
      if (token) {
        const response = await fetch(`${API_URL}/medicines/search?q=${searchTerm}`, { 
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.ok) {
          const responseData = await response.json();
          const medicineOptions = responseData.data.map(medicine => ({
            value: medicine.attributes.id,
            label: medicine.attributes.commercial_name
          }));
          setMedicineOptions(medicineOptions);
        } else {
          throw response;
        }
      } else {
        setError("An error occured");
        console.log("An error", e);
      }
    }
    if (searchTerm.trim() !== '') {
      loadMedicines();
    } else {
      setMedicineOptions([]); 
    }

  }, [searchTerm]);

  useEffect(() => {
    if (searchTerm) {
      loadMedicines(searchTerm);
    }
  }, [searchTerm]);*/

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      async function loadMedicines() {
        const token = getAuthTokenCookie();
        if (token) {
          const response = await fetch(
            `${API_URL}/medicines/search?q=${searchTerm}`,
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
            const medicineOptions = responseData.data.map((medicine) => ({
              value: medicine.attributes.id,
              label: medicine.attributes.commercial_name,
            }));
            setMedicineOptions(medicineOptions);
          } else {
            throw response;
          }
        } else {
          setError("An error occurred");
        }
      }
      loadMedicines();
    } else {
      setMedicineOptions([]);
    }
  }, [searchTerm]);

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
      <label>
        <b className="addinvoice-label">Add New Invoice</b>
      </label>
      <div className="col-12-lg backbtn ">
        <Link to={"/inventory-dashboard/invoicesList"}>
          <button className=" bakbtn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-arrow-left-circle-fill"
              viewBox="0 0 16 16"
            >
              <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
            </svg>
            <b id="back-btn"> Back</b>
          </button>
        </Link>
      </div>
      <div className="ai-container">
        <h2 className="invoice-title">Add Invoice</h2>
        <form className="ai-form" onSubmit={handleSubmit}>
          <div className="ai-row">
            <div className="ai-form-group">
              <label htmlFor="order_number" className="ai-form-label">
                Order Number
              </label>
              <input
                className="ai-input"
                type="text"
                id="order_number"
                value={order_number}
                onChange={(e) => setorder_number(e.target.value)}
              />
              {orderNumberWarning && (
                <span className="ad-warning-message-od">
                  {orderNumberWarning}
                </span>
              )}
            </div>
            <div className="ai-form-group">
              <label htmlFor="supplier_id" className="ai-form-label s-label">
                Supplier
              </label>
              <Select
                className="ai-input"
                id="suppliersdropdownmenu"
                options={supplieroptions}
                value={supplieroptions.find(
                  (option) => option.value === supplier_id
                )}
                onChange={(selectedOption) =>
                  setSupplierId(selectedOption.value)
                }
              />
            </div>
          </div>

          <div className="ai-row">
            <div className="ai-form-group add_medicinegroup">
              <a
                type="button"
                className="addMedicineBtn"
                onClick={handleAddMedicine}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="rgba(0, 154, 241, 1)"
                  class="bi bi-plus-circle-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
                </svg>
                {" Add Medicine"}
              </a>
            </div>
          </div>
          {medicinesData.map((medicine, index) => (
            <div key={index} className="ai-row">
              <div className="ai-form-group">
                <label htmlFor="medicine_id" className="ai-form-label mn-label">
                  Medicine Name
                </label>

                <Select
                  id="selectdropdown"
                  className="ai-input"
                  options={medicineOptions.filter((option) =>
                    option.label
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )}
                  value={medicineOptions.find(
                    (option) => option.value === medicine.medicine_id
                  )}
                  onChange={(selectedOption) =>
                    handleMedicineChange(
                      index,
                      "medicine_id",
                      selectedOption.value
                    )
                  }
                  onInputChange={(inputValue) => setSearchTerm(inputValue)}
                />
              </div>
              <div className="ai-form-group">
                <label htmlFor="quantity" className="ai-form-label q-label">
                  Quantity
                </label>
                <input
                  className="ai-input quantity"
                  type="number"
                  id="quantity"
                  value={medicine.quantity}
                  onChange={(e) =>
                    handleMedicineChange(index, "quantity", e.target.value)
                  }
                />
              </div>
              <div className="ai-form-group">
                <label htmlFor="discount" className="ai-form-label d-label">
                  Discount
                </label>
                <input
                  className="ai-input discount"
                  type="number"
                  id="discount"
                  value={medicine.discount}
                  onChange={(e) =>
                    handleMedicineChange(index, "discount", e.target.value)
                  }
                />
              </div>
              <div className="ai-form-group">
                <label htmlFor="price" className="ai-form-label p-label">
                  Price
                </label>
                <input
                  className="ai-input price"
                  type="number"
                  id="price"
                  value={medicine.price}
                  onChange={(e) =>
                    handleMedicineChange(index, "price", e.target.value)
                  }
                />
              </div>
              <div className="ai-form-group">
                <label htmlFor="amount" className="ai-form-label a-label">
                  Amount
                </label>
                <input
                  className="ai-input amount"
                  type="number"
                  id="amount"
                  value={medicine.amount}
                  disabled
                />
              </div>

              <button
                className="remove-btn"
                type="button"
                onClick={() => {
                  handleRemoveMedicine(index);
                }}
              >
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
                />{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-trash3-fill "
                  viewBox="0 0 16 16"
                >
                  <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                </svg>
              </button>
            </div>
          ))}
          <div className="totalamount">
            <label htmlFor="total_amount" className="ai-form-label am-label">
              Total Amount
            </label>
            <input
              className="ai-input total-amount"
              type="number"
              value={totalAmount}
              id="total_amount"
              disabled
            />
          </div>

          <button
            type="submit"
            onClick={() => {
              notify();
            }}
            className="addinvoicebtn"
          >
            <b>Add Invoice</b>
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
          <div className="ai-form-group c-group">
            <label htmlFor="comments" className="ai-form-label comments">
              Comments
            </label>
            <textarea
              className="ai-input c-textarea"
              rows="4"
              id="comments"
              value={comments}
              onChange={(e) => setcomments(e.target.value)}
            ></textarea>
          </div>
          <div className="ai-row"></div>
        </form>
      </div>
    </>
  );
};

export default AddInvoice;
