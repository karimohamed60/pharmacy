import { Link, Outlet } from 'react-router-dom';
import LogoutButton from '../../auth/LogoutButton';
import "./InventoryDashboard.css"
import React,{useState ,useEffect} from 'react';
import AddMedicine from '../../components/InventoryDashboard/Medicines/addmedicine';
import Medicinelist from '../../components/InventoryDashboard/Medicines/medicinelist';
import logo from '../../assets/Images/logouni 7.png'
import { API_URL } from '../../constants';
import { getAuthTokenCookie } from '../../services/authService';

const InventoryDashboard = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isInvOpen, setIsInvOpen] = useState(false);
    const [isMedOpen, setIsMedOpen] = useState(false);
    const [isTranOpen, setIsTranOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [invoices, setInvoices] = useState([])
    const [hasMargin, setHasMargin]= useState(false);
    const [hasMarginForTran, setHasMarginForTran]= useState(false);

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
      document.body.style.overflow = 'hidden';
  
      // Cleanup on component unmount
      return () => {
        document.body.style.overflow = 'visible';
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
              "Authorization": `Bearer ${token}`
            }
          });
          if (response.ok) {
            const responseData = await response.json();
            setCategories(responseData.data);
            const lastCategoryId = categories[categories.length - 1]?.id;
            const dataArray = responseData.data;
            for (let i = 0; i < dataArray.length; i++) {
            window.currentItem = dataArray[i].id;       
          }
          window.id=currentItem
          
          
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
        const token = getAuthTokenCookie()
        if (token) {
          
          
          const response = await fetch(`${API_URL}/medicines`, { 
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });
          if (response.ok) {
            const responseData = await response.json();
            setMedicines(responseData.data);
            
            // setTotalMedicines(responseData.meta.total); 
            
            window.total_medicines=responseData.total_medicines;
            
            
         
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
      
        const token = getAuthTokenCookie()
        if (token) {
          const response = await fetch(`${API_URL}/invoices`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });
          if (response.ok) {
            const responseData = await response.json();
            setInvoices(responseData.data);            
            window.total_invoices=responseData.total_invoices;
          } else {
            throw response;
          }
        } else {
          setError("An error occurred");
        }
      }
      loadInvoices();
    }, []);
    return(
    
         <>
         
         <Outlet />

<div className="sidenav" style={{marginLeft: isOpen ? "0" : "-272px" , backgroundColor:'#032B55'}}>
{ (
 <>
 {/* <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="white" class="bi bi-border-width" className="side-baricon" viewBox="0 0 16 16" aria-expanded={isOpen ? 'true' : 'false'} onClick={() => toggleDropdown(!isOpen)}>
  <path d="M0 3.5A.5.5 0 0 1 .5 3h15a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5zm0 5A.5.5 0 0 1 .5 8h15a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h15a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5"/>
</svg> */}
{/* <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="white" class="bi bi-grid-3x3-gap-fill" viewBox="0 0 16 16" onClick={() => toggleDropdown(!isOpen)}
    aria-expanded={isOpen ? 'true' : 'false'} className="side-baricon">
  <path d="M1 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM1 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM1 12a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1z"/>
</svg> */}
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="white" class="bi bi-list" className="side-baricon" viewBox="0 0 16 16" aria-expanded={isOpen ? 'true' : 'false'} onClick={() => toggleDropdown2(!isOpen)} >
  <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
</svg>

<img id='InvImage' src={logo} />
<label id='inventorydashboardlabel' ><b>Inventory</b></label>



<div className="dropdown dashboardbtn">
<Link to={'/inventory-dashboard/dashboard'}>
<a
    className="dropdown-toggle blue-text"
    type="button"
    id="dropdownMenuButton1"
    // onClick={toggleDropdown2}
    // aria-expanded={isOpen ? 'true' : 'false'}
    // style={{ color: '#032B55' }}
    
    aria-expanded={isMedOpen ? 'true' : 'false'}
    style={{ color: '#ffffff' }}
  >
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor"  id='suppliericon' className="bi bi-bar-chart-fill sidebaricon" viewBox="0 0 16 16">
  <path d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1z"/>
</svg>

    <b className='categorieslabel'>Dashboard</b> 
    
  </a>
  </Link>
 </div>

<div className="dropdown" id="top-menu">

<a
    className="dropdown-toggle blue-text"
    type="button"
    id="dropdownMenuButton1"
    onClick={MedtoggleDropdown}
    aria-expanded={isMedOpen ? 'true' : 'false'}
    style={{color:"#ffffff"}}
   
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="23" fill="white" className="bi bi-capsule-pill sidebaricon" viewBox="0 0 19 19">
  <path d="M11.02 5.364a3 3 0 0 0-4.242-4.243L1.121 6.778a3 3 0 1 0 4.243 4.243l5.657-5.657Zm-6.413-.657 2.878-2.879a2 2 0 1 1 2.829 2.829L7.435 7.536zM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8m-.5 1.042a3 3 0 0 0 0 5.917zm1 5.917a3 3 0 0 0 0-5.917z"/>
</svg>

    <b className='medicinelabel'>Medicines</b> 
    
  </a>
 
      <div className='Dlist' style={{ marginBottom: hasMargin ? '8rem' : '0'}}>

      <ul className={`dropdown-menu${isMedOpen ? ' show' : ''}`} aria-labelledby="dropdownMenuButton1"> 
        
        
        <div className='DItems '>
          <a className="dropdown-item  item1"  >
            
      <Link to="/inventory-dashboard/addmedicine"><b id='item1'>Add Medicine</b></Link>
          
          </a>
        
    
          <a className="dropdown-item item1" 
          >
      <Link to='/inventory-dashboard/medicinelist'><b id='item1'>Medicine List</b></Link>
         
          </a>
    
        
          {/* <a className="dropdown-item " id='item3' 
        
          >
      <Link to={'/inventory-dashboard/medicinedetails'}><b id='item1'>Medicine Details</b>     </Link>
          </a> */}
          </div>
      </ul> 
      
    </div>
    
 </div>
 <div className="dropdown catbutton">
<Link to={'/inventory-dashboard/categorylist'}>
<a
    className="dropdown-toggle blue-text"
    type="button"
    id="dropdownMenuButton1"
    
    // aria-expanded={isOpen ? 'true' : 'false'}
    style={{ color: '#FFFFFF' }}
  >
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" id='suppliericon' class="bi bi-grid sidebaricon" viewBox="0 0 16 16">
  <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5z"/>
</svg>

    <b className='categorieslabel'>Categories</b> 
    
  </a>
  </Link>
 </div>

 <div className="dropdown suppbutton">
<Link to={'/inventory-dashboard/suppliers'}>
<a
    className="dropdown-toggle blue-text"
    type="button"
    id="dropdownMenuButton1"
    
    // aria-expanded={isOpen ? 'true' : 'false'}
    style={{ color: '#FFFFFF' }}
  >
   <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" id='suppliericon' class="bi bi-truck sidebaricon" viewBox="0 0 16 16">
  <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/>
</svg>

    <b className='categorieslabel'>Suppliers</b> 
    
  </a>
  </Link>
  
    
    
 </div>
 <div className="dropdown transbutton">

<a
    className="dropdown-toggle blue-text"
    type="button"
    id="dropdownMenuButton1"
    onClick={TrantoggleDropdown}
    aria-expanded={isTranOpen ? 'true' : 'false'}
    style={{ color: '#FFFFFF' }}
  >
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-arrow-left-right sidebaricon" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/>
</svg>
    <b id='translabel'>Transfers</b> 
  </a>
      <div className='Dlist' style={{ marginBottom: hasMarginForTran ? '8rem' : '0'}}>
      <ul className={`dropdown-menu${isTranOpen ? ' show' : ''}`} aria-labelledby="dropdownMenuButton1">
        <div className='DItems '>
          <a className="dropdown-item  item1"  >
      <Link to="/inventory-dashboard/addtransfer"><b id='item1'>Add Transfers </b></Link>      
          </a>
          <a className="dropdown-item item1">
          
      <Link to='/inventory-dashboard/transferlist'><b id='item1'>Transfer List</b></Link>
          </a>     
       </div>
      </ul>  
    </div>
 </div>
 
 <div className="dropdown invbutton">

<a
    className="dropdown-toggle blue-text"
    type="button"
    id="dropdownMenuButton1"
    onClick={InvtoggleDropdown}
    aria-expanded={isInvOpen ? 'true' : 'false'}
    style={{ color: '#FFFFFF' }}
  >
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-receipt sidebaricon" viewBox="0 0 16 16">
  <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27m.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0z"/>
  <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5"/>
</svg>

    <b className='invlabel' >Invoices</b> 
    
  </a>

      <div className='Dlist'>

      <ul className={`dropdown-menu${isInvOpen ? ' show' : ''}`} aria-labelledby="dropdownMenuButton1">
        
        
        <div className='DItems '>

        <a className="dropdown-item item1" id='item2'
          >
      <Link to='/inventory-dashboard/addInvoice'><b id='item1'>Add invoice </b></Link>
         
          </a>
          <a className="dropdown-item  item1" id='item1' >
            
      <Link to="/inventory-dashboard/invoicesList"><b id='item1'>Invoices list</b></Link>
          
          </a>
          </div>
      </ul>
      
    </div>
    
 </div>


 <div className="dropdown logoutbtn">
<Link to={'/login'}>
<a
    className="dropdown-toggle whitetextlogout"
    type="button"
    id="dropdownMenuButton1"
    // onClick={toggleDropdown}
    // aria-expanded={isOpen ? 'true' : 'false'}
    style={{ color: '#FFFFFF' }}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#ffffff" className="bi bi-box-arrow-right " viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
  <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
</svg>

    <b className='logoutlabel'>Logout</b> 
    
  </a>
  </Link>
</div>
</>
)}
</div>



<div className='twocards' id='bigcard'>
<div className="row" >
  <div className="col-sm-6" >
    <div className="card" >
      <div className="card-body cardbody2" >
        <h5 className="card-title invtitle">Invetory</h5>
        <hr/>
        <b className="card-text cardtext1">{window.total_medicines}</b>
        <br></br>
        <b className='textcrd'>Total no of Medicines</b>
        <b className="card-text cardtext2">24</b>
        <br></br>
        <b className='textcrd2'>Categories</b>
        
      </div>
    </div>
  </div>
  <div className="col-sm-6">
    <div className="card">
      <div className="card-body cardbody2">
        <h5 className="card-title invtitle">Quick Report</h5>
        <hr/>
        <b className="card-text cardtext1">70,856</b>
        <br></br>
        <b className='textcrd3'>Quantity of Medicines Sold</b>
        <b className="card-text cardtext2">{window.total_invoices}</b>
        <br></br>
        <b className='textcrd4'>Invoices Generated</b>
      </div>
    </div>
  </div>
</div>
</div>

<div className='cards'>
<div className='cardstyle1'>
<div className="card" >
  <div className="card-body crdbody">
    <h5 className="card-title titlecolor">01</h5>
  </div>
  <ul className="list-group list-group-flush groupstyle">
    <p className="list-group-item " style={{fontSize:"large" }}>Medicine shortage</p>

  </ul>
  
</div>
<div className='cardstyle2'>
<div className="card" >
  <div className="card-body crdbody">
    <h5 className="card-title titlecolor">10</h5>
  </div>
  <ul className="list-group list-group-flush groupstyle2">
    <p className="list-group-item " style={{fontSize:"large" }}>Reorder Point</p>

  </ul>
  
</div>
</div>

<div className='cardstyle3'>
<div className="card" >
  <div className="card-body crdbody">
    <h5 className="card-title titlecolor">13</h5>
  </div>
  <ul className="list-group list-group-flush groupstyle3">
    <p className="list-group-item " style={{fontSize:"large" }}>Expired Medicine </p>

  </ul>
  
</div>
</div>
</div>
<div className='cardstyle4'>
<div className="card" >
  <div className="card-body crdbody">
    <h5 className="card-title titlecolor">02</h5>
  </div>
  <ul className="list-group list-group-flush groupstyle4">
    <p className="list-group-item " style={{fontSize:"large" }}>Near Expire</p>

  </ul>
  
</div>
</div>
</div>




            {/* <Outlet /> */}
          
            
         
          
        </> 

    );

}

export default InventoryDashboard;