import './addmedicine.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { API_URL } from '../../../constants';
import { getAuthTokenCookie, setAuthTokenCookie } from '../../../services/authService';
import Cookies from 'js-cookie';

const AddMedicine = () => {
  useEffect(() => {

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'visible';
    };
  }, []);

  //created_at function
  useEffect(() => {
    const getCurrentDateTime = () => {
      const currentDate = new Date();
      // Convert date to string in ISO format
      const formattedDate = currentDate.toISOString();
      return formattedDate;
    };

    setCreatedAt(getCurrentDateTime());
  }, []);

  //updated_at function
  useEffect(() => {
    const getCurrentDateTime = () => {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString();
      return formattedDate;
    };
    setUpdatedAt(getCurrentDateTime());
  }, []);



  const [medicines, setMedicines] = useState([]);
  const [ingredient_name, setIngredientName] = useState("");
  const [commercial_name, setCommercialName] = useState("");
  const [international_barcode, setInternationalBarcode] = useState("");
  const [expire_date, setExpireDate] = useState("");
  const [price_per_unit, setPrice] = useState("");
  const [medium_unit, setMediumUnit] = useState("");
  const [major_unit, setMajorUnit] = useState("");
  const [minor_unit, setMinorUnit] = useState("");
  const [category_id, setCategoryID] = useState("");
  const [categories, setCategories] = useState([]);
  const [created_at, setCreatedAt] = useState('');
  const [updated_at, setUpdatedAt] = useState('');
  const [, setLoading] = useState(true);
  const [, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    const user_id = Cookies.get('user_id')

    const postData = {
      ingredient_name,
      commercial_name,
      international_barcode,
      expire_date,
      price_per_unit,
      medium_unit,
      major_unit,
      minor_unit,
      category_id,
      created_at,
      updated_at,
      user_id

    };

    console.log(postData);


    const token = getAuthTokenCookie();
    if (token) {
      const response = await fetch(`${API_URL}/medicines`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`

        },
        body: JSON.stringify(postData),
      });
      console.log("aaa2");
      if (response.ok) {
        console.log("aaa");
        const responseData = await response.json();
        console.log(responseData)
        setMedicines([...categories, responseData.data]);
        setIngredientName("")
        setCommercialName("");
        setInternationalBarcode("");
        setExpireDate("");
        setPrice("");
        setMediumUnit("");
        setMajorUnit("");
        setMinorUnit("");
        setCategoryID("")
      } else {
        alert('Error: ' + response.statusText);
      }

    } else {
      alert('No token found');
    }
  }

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
  }, [categories]);


  return (
    <>

      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-right-fill arrowicon" viewBox="0 0 16 16">
        <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
      </svg>
      <div>
        <label className='center2'><b>Medicines</b></label>
      </div>

      <label className='addlabel2'><b>Add New Medicines</b></label>

      <div className="col-12-lg backbtn ">

        <Link to={'/inventory-dashboard/medicinelist'}>
          <button className=" backbutton">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="dark blue" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
              <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
            </svg>
            <b id='bckbtn'>Back</b>

          </button>
        </Link>
      </div>

      <div className="formborder">

        <form className="row g-3 frm" onSubmit={handleSubmit} >
          <label className='addlabel'><b>Add Medicine</b></label>
          <div className="col-md-6 price-input1 ">
            <label htmlFor="ingredient_name" className="form-label ing"><b>Ingredient Name</b></label>
            <input type="string" className="form-control " value={ingredient_name} onChange={(e) => setIngredientName(e.target.value)} name="inputIng" id='ingredient_name' required />
          </div>
          <div className="col-md-6 price-input1" >
            <label htmlFor="commercial_name" className="form-label ing"><b>Commercial Name</b></label>
            <input type="string" className="form-control  " value={commercial_name} onChange={(e) => setCommercialName(e.target.value)} name="inputIng" id='commercial_name' required />
          </div>
          <div className="col-md-6 price-input" >
            <label htmlFor="international_barcode" className="form-label barcode"><b>International Barcode</b></label>
            <input type="binary" className="form-control " value={international_barcode} onChange={(e) => setInternationalBarcode(e.target.value)} name="inputIng" id='international_barcode' required />
          </div>
          <div className="col-md-6 price-input" >
            <label htmlFor="expire_date" className="form-label mjr"><b>Expire Date</b></label>
            <input type="date" className="form-control " value={expire_date} onChange={(e) => setExpireDate(e.target.value)} name="inputIng" id='expire_date' required />
          </div>
          <div className="col-md-6 price-input ">
            <label htmlFor="price_per_unit" className="form-label prc"><b>Price</b></label>
            <input type="decimal" className="form-control inputIng " value={price_per_unit} onChange={(e) => setPrice(e.target.value)} name="inputIng" id='price_per_unit' required />
          </div>
          <div className="col-md-6 price-input" id='addinput1'>
            <label htmlFor="medium_unit" className="form-label med"><b>Medium Unit</b></label>
            <input type="string" className="form-control inputIng" value={medium_unit} onChange={(e) => setMediumUnit(e.target.value)} name="inputIng" id='medium_unit' required />
          </div>
          <div className="col-md-6 price-input">
            <label htmlFor="major_unit" className="form-label mjr"><b>Major Unit</b></label>
            <input type="string" className="form-control inputIng" value={major_unit} onChange={(e) => setMajorUnit(e.target.value)} name="inputIng" id='major_unit' required />
          </div>
          <div className="col-md-6 price-input" id='addinput1'>
            <label htmlFor="minor_unit" className="form-label minor"><b>Minor Unit</b></label>
            <input type="string" className="form-control inputIng" value={minor_unit} onChange={(e) => setMinorUnit(e.target.value)} name="inputIng" id='minor_unit' required />
          </div>

          <div className="col-md-4 price-inputcategory">
            <label htmlFor="category_id" className="form-label cat"><b>Category</b></label>

            <select name="inputState" className="form-select inputState " value={category_id} onChange={(e) => setCategoryID(e.target.value)} id='category_id'>
              {categories.map((item, index) => (
                <option key={index} value={item.id} className="category-container">
                  {item.attributes.category_name}

                </option>
              ))}
            </select>
          </div>
          <input id='created_at' type="hidden" className="form-control inputIng" value={created_at} onChange={(e) => setCreatedAt(e.target.value)} required />
          <input id='updated_at' type="hidden" className="form-control inputIng" value={updated_at} onChange={(e) => setUpdatedAt(e.target.value)} required />
          <div className="col-12 addprdbtn">

            <button type="submit" className="btn btn-light " id='oooo' ><b className='Addmedbtn'>Add Medicine</b></button>

          </div>

        </form>

      </div>

    </>
  )



};
export default AddMedicine;