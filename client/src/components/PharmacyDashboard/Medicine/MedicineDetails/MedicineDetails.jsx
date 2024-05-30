import React from "react";
import { useState , useEffect} from "react";
import Sidebar from "../../../PharmacyDashboard/Sidebar/Sidebar";
import "./MedinineDetails.css";
import { Link , useParams} from "react-router-dom";
import { API_URL } from "../../../../constants";
import { getAuthTokenCookie } from "../../../../services/authService";
const MedicineDetails = () => {
  const { id } = useParams();
  const [medicine, setMedicine] = useState({});


  useEffect(() => {
    document.body.style.overflow = "hidden";
    handleSpecificMedicineby(id);
    return () => {
      document.body.style.overflow = "visible";
    };
  }, [id]);

   // get specific medicine
   const handleSpecificMedicineby = async (medicineId) => {
    try {
      const token = getAuthTokenCookie();
      const response = await fetch(`${API_URL}/medicines/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,
        },});
      if (response.ok) {
        const responseData = await response.json();
        setMedicine(responseData.data);
        console.log(responseData.data)
        window.ingredient_name = responseData.data.attributes.ingredient_name;
        window.commercial_name = responseData.data.attributes.commercial_name;
        window.international_barcode = responseData.data.attributes.international_barcode;
        window.minor_unit = responseData.data.attributes.minor_unit;
        window.major_unit = responseData.data.attributes.major_unit;
        window.medium_unit = responseData.data.attributes.medium_unit;
        window.price_per_unit = responseData.data.attributes.price_per_unit;
        window.quantity_in_inventory =
          responseData.data.attributes.quantity_in_inventory;
        window.quantity_in_pharmacy =
          responseData.data.attributes.quantity_in_pharmacy;
        window.quantity_sold = responseData.data.attributes.quantity_sold;
        window.category_name =
          responseData.data.attributes.category.category_name;
        window.expire_date = responseData.data.attributes.expire_date;
        window.created_at = responseData.data.attributes.created_at;
        window.created_by = responseData.data.attributes.user.username;
        window.medicineId = responseData.data.attributes.id;
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
        className="bi bi-caret-right-fill Arrowicon"
        viewBox="0 0 16 16"
      >
        <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
      </svg>
      <div>
        <label className="Medicinedetails-Title">
          <b>Medicines</b>
        </label>
      </div>

      <label className="MedicineDetails-Title">
        <b>Medicine Details</b>
      </label>

      <div className="col-12-lg backbtn-pharmacy ">
        <Link to={"/pharmacy-dashboard/medicineList/"}>
          <button className=" backButton">
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
            <b id="back">Back</b>
          </button>
        </Link>
      </div>

      <form className="md-form-container">
        <div className="row">
          <div className="col">
            <label className="detlabels md-ingrediantName">
              <b>Ingredient Name</b>
            </label>
            <input
              type="text"
              className="form-control "
              id="ingInput"
              aria-label="First name"
              value={window.ingredient_name}
              disabled
            />{" "}
          </div>
          <div className="col">
            <label className="detlabels md-price">
              <b>Price</b>
            </label>
            <input
              type="text"
              className="form-control leftmove"
              id="einput"
              aria-label="Last name"
              value={window.price_per_unit}
              disabled
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <label className="detlabels md-commercial ">
              <b>Commercial Name</b>
            </label>
            <input
              type="text"
              className="form-control"
              id="commdet"
              aria-label="First name"
              value={window.commercial_name}
              disabled
            />
          </div>
          <div className="col leftmove">
            <label className="detlabels md-expire">
              <b>Expire Date</b>
            </label>
            <input
              type="text"
              className="form-control leftmove"
              id="exdetinp"
              aria-label="Last name"
              value={window.expire_date}
              disabled
            />
          </div>
        </div>
        <div id="boxx">
          Quantity in inventory
          <hr />
          <b>{window.quantity_in_inventory}</b>
        </div>
        <div className="row medicineDetailsInputs">
          <div className="col ">
            <label className="detlabels md-international ">
              <b>International Barcode</b>
            </label>
            <input
              type="text"
              className="form-control"
              id="einput"
              
              aria-label="First name"
              value={window.international_barcode}
              disabled
            />
          </div>
          <div className="col">
            <div className="col-md-4 price-inputcategory">
              <label
                htmlFor="category_id"
                className="form-label md-category"
                id="categorylabel"
              >
                <b>Category</b>
              </label>

              <input
                name="categoryMenu"
                className="form-control "
                id="categoryInput"
                value={window.category_name}
                disabled
              />
            </div>
          </div>
        </div>
        <div className="row medicineDetailsInputs">
          <div className="col">
            <label className="detlabels munit">
              <b>Minor Unit</b>
            </label>
            <input
              type="text"
              className="form-control"
              id="einput"
              
              aria-label="First name"
              value={window.minor_unit}
              disabled
            />
          </div>
          <div className="col">
            <label className="detlabels md-createdby">
              <b> Created By</b>
            </label>
            <input
              type="text"
              className="form-control leftmove"
              id="einput"
              aria-label="Last name"
              value={window.created_by}
              disabled
            />
          </div>
        </div>
        <div id="boxx">
          Quantity in Pharmacy
          <hr />
          <b>{window.quantity_in_pharmacy}</b>
        </div>
        <div className="row MunitsInputs">
          <div className="col">
            <label className="detlabels munit">
              <b>Major Unit</b>
            </label>
            <input
              type="text"
              className="form-control"
              id="einput"
              aria-label="First name"
              value={window.major_unit}
              disabled
            />
          </div>
          <div className="col">
            <label className="detlabels md-created-at">
              <b>Created At</b>
            </label>
            <input
              type="text"
              className="form-control leftmove"
              id="einput"
              aria-label="Last name"
              value={window.created_at}
              disabled
            />
          </div>
        </div>
        <div className="row MunitsInputs">
          <div className="col">
            <label className="detlabels md-medium">
              <b>Medium Unit</b>
            </label>
            <input
              type="text"
              className="form-control"
              id="mediuminput"
              varia-label="First name"
              value={window.medium_unit}
              disabled
            />
          </div>
        </div>
        <div id="boxx">
          Quantity Sold
          <hr />
          <b>{window.quantity_sold}</b>
        </div>
      </form>
    </>
  );
};

export default MedicineDetails;
