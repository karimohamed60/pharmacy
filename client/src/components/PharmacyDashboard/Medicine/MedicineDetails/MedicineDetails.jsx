import React from "react";
import Sidebar from "../../../PharmacyDashboard/Sidebar/Sidebar";
import "./MedinineDetails.css";
import { Link } from "react-router-dom";

const MedicineDetails = () => {
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

      <div className="col-12-lg backbtn ">
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
              className="form-control"
              id="inppopup"
              aria-label="First name"
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
              disabled
            />
          </div>
        </div>
        <div id="boxx">
          Quantity in inventory
          <hr />
          <b></b>
        </div>
        <div className="row">
          <div className="col ">
            <label className="detlabels md-international ">
              <b>International Barcode</b>
            </label>
            <input
              type="text"
              className="form-control"
              id="einput"
              aria-label="First name"
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

              <select
                name="categoryMenu"
                className="form-select "
                id="category_id"
                disabled
              ></select>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <label className="detlabels munit">
              <b>Minor Unit</b>
            </label>
            <input
              type="text"
              className="form-control"
              id="einput"
              o
              aria-label="First name"
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
              disabled
            />
          </div>
        </div>
        <div id="boxx">
          Quantity in Pharmacy
          <hr />
          <b></b>
        </div>
        <div className="row">
          <div className="col">
            <label className="detlabels munit">
              <b>Major Unit</b>
            </label>
            <input
              type="text"
              className="form-control"
              id="einput"
              aria-label="First name"
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
              disabled
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <label className="detlabels md-medium">
              <b>Medium Unit</b>
            </label>
            <input
              type="text"
              className="form-control"
              id="mediuminput"
              varia-label="First name"
              disabled
            />
          </div>
        </div>
        <div id="boxx">
          Quantity Sold
          <hr />
          <b></b>
        </div>
      </form>
    </>
  );
};

export default MedicineDetails;
