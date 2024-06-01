import './medicinedetails.css'
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import 'reactjs-popup/dist/index.css';
import { getAuthTokenCookie } from '../../../services/authService';
import { API_URL } from '../../../constants'
import Cookies from 'js-cookie';
const Medicinedetails = () => {

  const [medicine, setMedicine] = useState({});
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedingredient_name, setSelectedingredient_name] = useState('');
  const [selectedcommercial_name, setSelectedCommercial_name] = useState('');
  const [selectedprice_per_unit, setselectedprice_per_unit] = useState('');
  const [selectedminor_unit, setselectedminor_unit] = useState('');
  const [selectedmajor_unit, setselectedmajor_unit] = useState('');
  const [selectedmedium_unit, setselectedmedium_unit] = useState('');
  const [selectedexpire_date, setselectedexpire_date] = useState('');
  const [selectedinternational_barcode, setselectedinternational_barcode] = useState('');
  const [selectedcategoryID, setselectedcategoryID] = useState('');
  const [user_id, setselecteduser_id] = useState(Cookies.get('user_id'));
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const { id } = useParams()

  
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    handleSpecificMedicinebyId(id);
    return () => {
      document.body.style.overflow = 'visible';
    };
  }, [id]);
  const openPopup = () => {
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };
  const goBack = () => {
    setPopupOpen(false);
  };

// load categories 
  useEffect(() => {
    async function loadCategories() {
      const token = getAuthTokenCookie();
      if (token) {
        const response = await fetch(`${API_URL}/categories`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.ok) {
          const responseData = await response.json();

          setCategories(responseData.data);
          const dataArray = responseData.data;
          for (let i = 0; i < dataArray.length; i++) {
            window.currentItem = dataArray[i].id;

            if (currentItem) {
              window.catItem = currentItem;
            }
          }
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

// get specific medicine
  const handleSpecificMedicinebyId = async (medicineId) => {
    try {
      const token = getAuthTokenCookie()
      const response = await fetch(`${API_URL}/medicines/${medicineId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {

        const responseData = await response.json();
        setMedicine(responseData.data);
        window.ingredient_name = responseData.data.attributes.ingredient_name;
        window.commercial_name = responseData.data.attributes.commercial_name;
        window.international_barcode = responseData.data.attributes.international_barcode;
        window.minor_unit = responseData.data.attributes.minor_unit;
        window.major_unit = responseData.data.attributes.major_unit;
        window.medium_unit = responseData.data.attributes.medium_unit;
        window.price_per_unit = responseData.data.attributes.price_per_unit
        window.quantity_in_inventory = responseData.data.attributes.quantity_in_inventory;
        window.quantity_in_pharmacy = responseData.data.attributes.quantity_in_pharmacy;
        window.quantity_sold = responseData.data.attributes.quantity_sold;
        window.category_name = responseData.data.attributes.category.category_name;
        window.expire_date = responseData.data.attributes.expire_date;
        window.created_at = responseData.data.attributes.created_at;
        window.created_by = responseData.data.attributes.user.user_id;
        window.medicineId = responseData.data.attributes.id;
      } else {
        throw new Error('Failed to fetch category details');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

//update medicine data
  const handleMedicineUpdate = async (e) => {
    e.preventDefault();
    alert(id)
    try {
      console.log("Selected category value: ", selectedingredient_name);
      const user_id = Cookies.get('user_id')
      const token = Cookies.get('token')
      const response = await fetch(`${API_URL}/medicines/${id}`, {

        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          ingredient_name: selectedingredient_name,
          commercial_name: selectedcommercial_name,
          price_per_unit: selectedprice_per_unit,
          minor_unit: selectedminor_unit,
          major_unit: selectedmajor_unit,
          medium_unit: selectedmedium_unit,
          expire_date: selectedexpire_date,
          international_barcode: selectedinternational_barcode,
          category_id: selectedcategoryID,
          user_id: user_id,

        })
      });
      console.log(user_id)
      if (response.ok) {
        const responseData = await response.json();
        await handleSpecificMedicinebyId(id);
      } else {
        throw new Error("Failed to update medicine value");
      }
    } catch (error) {
      console.error("Error: ", error.message);
    }
  };


  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-right-fill arrowicon" viewBox="0 0 16 16">
        <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
      </svg>
      <div>
        <label className='center2'><b>Medicines</b></label>
      </div>
      <label><b className='meddetails'>Medicine Details</b></label>

      <div className="col-12-lg backbtn ">
        <Link to={'/inventory-dashboard/medicinelist'}>
          <button className=" butnn2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
              <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
            </svg>
            <b id='bCK'>Back</b>

          </button>
        </Link>
      </div>

      <form className='form-container' onSubmit={handleMedicineUpdate}>
        <div class="row">
          <div class="col">
            <label htmlFor='ingredient_name' className='detlabels ingdet'><b>Ingredient Name</b></label>
            <input type="text" 
            className="form-control"
             name='inppopup'
             id='ingredient_name'
             value={selectedingredient_name}
             onChange={(e) => setSelectedingredient_name(e.target.value)}
             aria-label="First name"
             placeholder={window.ingredient_name} />    
            </div>

          <div class="col">
            <label htmlFor='price' className='detlabels prcdet'><b>Price</b></label>
            <input type="text" className="form-control leftmove"  id='einput' value={selectedprice_per_unit} onChange={(e) => setselectedprice_per_unit(e.target.value)} aria-label="Last name" placeholder={window.price_per_unit} />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <label htmlFor='commercial_name' className='detlabels comlabel'><b>Commercial Name</b></label>
            <input type="text" className="form-control" id='commercial_name' name='commdet' value={selectedcommercial_name} onChange={(e) => setSelectedCommercial_name(e.target.value)} aria-label="First name" placeholder={window.commercial_name} />
          </div>
          <div className="col leftmove">
            <label htmlFor='expire_date' className='detlabels exdet'><b>Expire Date</b></label>
            <input type="text" className="form-control leftmove" id='expire_date' name='exdetinp' value={selectedexpire_date} onChange={(e) => setselectedexpire_date(e.target.value)} aria-label="Last name" placeholder={window.expire_date} />
          </div>
        </div>
        <div id='boxx'>Quantity in inventory
          <hr />
          <b>{window.quantity_in_inventory}</b>
        </div>
        <div className="row barcode_categoriesRows">
          <div className="col ">
            <label htmlFor='international_barcode' className='detlabels intdet '><b>International Barcode</b></label>
            <input type="text" className="form-control" id='einput' value={selectedinternational_barcode} onChange={(e) => setselectedinternational_barcode(e.target.value)} aria-label="First name" placeholder={window.international_barcode} />
          </div>
          <div className="col">
            <div className="col-md-4 price-inputcategory">
              <label htmlFor="category_id" className="form-label cat" id='categorylabel'><b>Category</b></label>

              <select name="categoryMenu" className="form-select"  value={selectedcategoryID} onChange={(e) => setselectedcategoryID(e.target.value)} id='category_id'  >
                {categories.map((item, index) => (
                  <option key={index} value={item.id} className="category-container">
                    {item.attributes.category_name}

                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="row minor_created_byRows">
          <div className="col">
            <label  htmlFor="minot_unit" className='detlabels mdet'><b>Minor Unit</b></label>
            <input type="text" className="form-control" id='einput' value={selectedminor_unit} onChange={(e) => setselectedminor_unit(e.target.value)} aria-label="First name" placeholder={window.minor_unit} />
          </div>
          <div className="col">
            <label htmlFor='user_id' className='detlabels crdet'><b> Created By</b></label>
            <input type="text" className="form-control leftmove" id='einput' value={user_id} aria-label="Last name" disabled placeholder={window.created_by} />
          </div>
        </div>
        <div id='boxx' >Quantity in Pharmacy
          <hr />
          <b>{window.quantity_in_pharmacy}</b>
        </div>
        <div className="row major_created_atRows">
          <div className="col">
            <label htmlFor='major_unit' className='detlabels mdet'><b>Major Unit</b></label>
            <input type="text" className="form-control" id='einput' value={selectedmajor_unit} onChange={(e) => setselectedmajor_unit(e.target.value)} aria-label="First name" placeholder={window.major_unit} />
          </div>
          <div className="col">
            <label htmlFor='created_at' className='detlabels crdet'><b>Created At</b></label>
            <input type="text" className="form-control leftmove" id='einput' aria-label="Last name" disabled placeholder={window.created_at} />
          </div>
        </div>
        <div className="row medium_unitRow">
          <div className="col">
            <label htmlFor='medium_unit' className='detlabels mdudet'><b>Medium Unit</b></label>
            <input type="text" className="form-control" id='medium_unit' name='mediuminput' value={selectedmedium_unit} onChange={(e) => setselectedmedium_unit(e.target.value)} aria-label="First name" placeholder={window.medium_unit} />
          </div>

        </div>
        <div id='boxx'  >Quantity Sold
          <hr />
          <b>{window.quantity_sold}</b>
        </div>
        <button type="submit" className="btn btn-light updatebutnn" id='oooo' >

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-pencil-fill"
            viewBox="0 1 16 16"
          >
            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"
 
            />
          </svg>
          <b className='updatelabel'>Save Changes </b>

        </button>

      </form>




    </>
  )



}
export default Medicinedetails;

