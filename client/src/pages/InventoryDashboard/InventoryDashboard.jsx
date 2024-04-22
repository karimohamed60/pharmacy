import { Link, Outlet } from "react-router-dom";
import LogoutButton from "../../auth/LogoutButton";
import "./InventoryDashboard.css";
import React, { useState, useEffect } from "react";
import AddMedicine from "../../components/InventoryDashboard/Medicines/addmedicine/addmedicine";
import Medicinelist from "../../components/InventoryDashboard/Medicines/medicinelist/medicinelist";
import logo from "../../assets/Images/logouni 7.png";
import { API_URL } from "../../constants";
import { getAuthTokenCookie } from "../../services/authService";
import Isidebar from "../../components/InventoryDashboard/Isidebar/Isidebar";

const InventoryDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isInvOpen, setIsInvOpen] = useState(false);
  const [isMedOpen, setIsMedOpen] = useState(false);
  const [isTranOpen, setIsTranOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [hasMargin, setHasMargin] = useState(false);
  const [hasMarginForTran, setHasMarginForTran] = useState(false);

  const toggleDropdown2 = (shouldOpen) => {
    setIsOpen(shouldOpen);
  };

  const InvtoggleDropdown = () => {
    setIsInvOpen(!isInvOpen);
  };

  const MedtoggleDropdown = () => {
    setIsMedOpen(!isMedOpen);
    setHasMargin(true);

    setHasMargin(!isMedOpen);
  };
  const TrantoggleDropdown = () => {
    setIsTranOpen(!isTranOpen);
    setHasMarginForTran(true);

    setHasMarginForTran(!isTranOpen);
  };

  useEffect(() => {
    // Remove scroll bar
    document.body.style.overflow = "hidden";

    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);
  // To retreive no of categories
  useEffect(() => {
    async function loadCategories() {
      const token = getAuthTokenCookie();
      if (token) {
        const response = await fetch(`${API_URL}/categories`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const responseData = await response.json();
          setCategories(responseData.data);
          const lastCategoryId = categories[categories.length - 1]?.id;
          const dataArray = responseData.data;
          for (let i = 0; i < dataArray.length; i++) {
            window.currentItem = dataArray[i].id;
          }
          window.id = currentItem;
        } else {
          throw response;
        }
      } else {
        setError("An error occured");
        console.log("An error", e);
      }
    }
    loadCategories();
  }, []);
  //to get the total numbers of medicines
  useEffect(() => {
    async function loadMedicines() {
      const token = getAuthTokenCookie();
      if (token) {
        const response = await fetch(`${API_URL}/medicines`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const responseData = await response.json();
          setMedicines(responseData.data);

          // setTotalMedicines(responseData.meta.total);

          window.total_medicines = responseData.total_medicines;
        } else {
          throw response;
        }
      } else {
        setError("An error occured");
        console.log("An error", e);
      }
    }
    loadMedicines();
  }, []);
  //to show total invoices
  useEffect(() => {
    async function loadInvoices() {
      const token = getAuthTokenCookie();
      if (token) {
        const response = await fetch(`${API_URL}/invoices`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const responseData = await response.json();
          setInvoices(responseData.data);
          window.total_invoices = responseData.total_invoices;
        } else {
          throw response;
        }
      } else {
        setError("An error occurred");
      }
    }
    loadInvoices();
  }, []);
  return (
    <>
      <Isidebar />
      <Outlet />


      <div className="twocards" id="bigcard">
        <div className="row">
          <div className="col-sm-6">
            <div className="card">
              <div className="card-body cardbody2">
                {/*         <h5 className="card-title invtitle">Invetory</h5>
                 */}{" "}
                <hr />
                {/*         <b className="card-text cardtext1">{window.total_medicines}</b>
                 */}{" "}
                <br></br>
                {/*         <b className='textcrd'>Total no of Medicines</b>
/*  */}{" "}
{/*                 <b className="card-text cardtext2">24</b>
 */}                */ <br></br>
                {/*         <b className='textcrd2'>Categories</b>
                 */}
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="card">
              <div className="card-body cardbody2">
                {/*         <h5 className="card-title invtitle">Quick Report</h5>
                 */}{" "}
                <hr />
                {/*         <b className="card-text cardtext1">70,856</b>
                 */}{" "}
                <br></br>
                {/*         <b className='textcrd3'>Quantity of Medicines Sold</b>
                 */}{" "}
                {/*  <b className="card-text cardtext2">{window.total_invoices}</b>
        <br></br> */}
                {/*         <b className='textcrd4'>Invoices Generated</b> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="cards">
        <div className="cardstyle1">
          <div className="card">
            <div className="card-body crdbody">
              {/*     <h5 className="card-title titlecolor">01</h5>
               */}{" "}
            </div>
            <ul className="list-group list-group-flush groupstyle">
              {/*     <p className="list-group-item " style={{fontSize:"large" }}>Medicine shortage</p>
               */}
            </ul>
          </div>
          <div className="cardstyle2">
            <div className="card">
              <div className="card-body crdbody">
                {/*     <h5 className="card-title titlecolor">10</h5>
                 */}{" "}
              </div>
              <ul className="list-group list-group-flush groupstyle2">
                {/*     <p className="list-group-item " style={{fontSize:"large" }}>Reorder Point</p>
                 */}
              </ul>
            </div>
          </div>

          <div className="cardstyle3">
            <div className="card">
              <div className="card-body crdbody">
                {/*     <h5 className="card-title titlecolor">13</h5>
                 */}{" "}
              </div>
              <ul className="list-group list-group-flush groupstyle3">
                {/*     <p className="list-group-item " style={{fontSize:"large" }}>Expired Medicine </p>
                 */}
              </ul>
            </div>
          </div>
        </div>
        <div className="cardstyle4">
          <div className="card">
            <div className="card-body crdbody">
              {/*     <h5 className="card-title titlecolor">02</h5>
               */}{" "}
            </div>
            <ul className="list-group list-group-flush groupstyle4">
              {/*     <p className="list-group-item " style={{fontSize:"large" }}>Near Expire</p>
               */}
            </ul>
          </div>
        </div>
      </div>

      {/* <Outlet /> */}
    </>
  );
};

export default InventoryDashboard;
