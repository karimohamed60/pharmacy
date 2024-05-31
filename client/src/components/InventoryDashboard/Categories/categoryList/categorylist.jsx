import "./categorylist.css";
import React, { useEffect, useState } from "react";
import { json, Link, useParams } from "react-router-dom";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import Table from "react-bootstrap/Table";
import { API_URL } from "../../../../constants";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";

const Categorylist = () => {
  const [isPopup1Open, setPopup1Open] = useState(false);
  const [isPopup2Open, setPopup2Open] = useState(false);
  const [category_name, setCategoryName] = useState("");
  const [selectedCategoryValue, setSelectedCategoryValue] = useState(null);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({});
  const [, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const filteredData = categories.filter(
    (item) =>
      search.toLowerCase() === "" ||
      item.attributes.category_name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const renderedCategories = filteredData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );
  const renderCategories =
    search.trim() !== "" ? renderedCategories : filteredData;
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  const npage = Math.ceil(categories.length / recordsPerPage);

  const [isModalOpen, setIsModalOpen] = useState(false);

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

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "visible";
    };
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

  //API for adding
  const handleCategoryUpdate = async (categoryId) => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`${API_URL}/categories/${categoryId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const responseData = await response.json();
        console.log("success");
        console.log(responseData.data.attributes.category_name);
        window.categoryname = responseData.data.attributes.category_name;
        setCategory(responseData.data);
        setSelectedCategoryValue(responseData.data.value || "");
        openPopup1();
      } else {
        throw new Error("Failed to fetch category details");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = {
      category_name,
    };
    console.log(postData);
    const token = Cookies.get("token");
    console.log(token);

    if (token) {
      const existingCategory = categories.find(
        (category) =>
          category.attributes.category_name.toLowerCase() ===
          category_name.toLowerCase()
      );
      if (existingCategory) {
        console.error("Category with the same name already exists");
        notify("error", "Category with the same name already exists");
        return;
      }
      const response = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        notify("success", "Category added successfully");

        setCategories([...categories, responseData.data]);
        setCategoryName("");
        // loadCategories();
        console.log("shown");
      } else {
        alert("Error: " + response.statusText);
      }
    } else {
      const errorMessage = await response.text();
      alert("No token found");
    }
  };

  const handleSubmitForm = (e) => {
    handleSubmit(e);
  };

  // fetch categories from APi
  useEffect(() => {
    async function loadCategories() {
      const token = Cookies.get("token");
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
          // console.log(responseData)
          setCategories(responseData.data);
          const dataArray = responseData.data;
          for (let i = 0; i < dataArray.length; i++) {
            window.currentItem = dataArray[i].attributes.category_name;
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

  const handleChange = (e) => {
    setCategoryName(e.target.value);
  };

  //Api for updating

  const handleCategoryValueUpdate = async () => {
    try {
      console.log("Category ID: ", category.id);
      console.log("Selected category value: ", selectedCategoryValue);

      if (!selectedCategoryValue.trim()) {
        console.error("Category value cannot be empty");
        return;
      }
      const token = Cookies.get("token");
      const categoryId = category.id;
      const response = await fetch(`${API_URL}/categories/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ category_name: selectedCategoryValue }),
      });

      if (response.ok) {
        notify("success", "Category updated successfully");
        await handleCategoryUpdate(categoryId);
      } else {
        notify("error", "Error Updating Category");
        throw new Error("Failed to update category value");
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
        className="bi bi-caret-right-fill arrowiconcat"
        viewBox="0 0 16 16"
      >
        <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
      </svg>
      <div>
        <label className="catlistlabel">
          <b>Categories</b>
        </label>
      </div>
      <label className="catlistlabel2">
        <b>Categories List</b>
      </label>

      <div className="input-group rounded seachinput " id="scltl">
        <input
          type="search"
          className="form-control rounded "
          id="srchinput"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by category name "
          aria-label="Search"
          aria-describedby="search-addon"
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

      <div>
        <Table triped hover id="cd-table" className="">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody className="cl-tbody">
            {renderCategories
              .slice(firstIndex, lastIndex)
              .map((item, index) => (
                <tr key={index} className="category-container">
                  <td>{item.attributes.category_name}</td>
                  <td>
                    {/* <Link to={/inventory-dashboard/${Category.category_name}}> */}
                    {/* {window.currentItem} */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="#032B55"
                      className="bi bi-eye-fill"
                      viewBox="0 0 16 16"
                      onClick={() => handleCategoryUpdate(item.id)}
                    >
                      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                      <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                    </svg>
                    {/* </Link> */}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>

        <div>
          <Link to={""}>
            <button
              type="button"
              className="btn btn-light btn-lg  aaddmedd"
              id="aaddmedd"
              onClick={openPopup2}
            >
              <b className="medlistbtn">Add Category</b>
            </button>
          </Link>
        </div>

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
        <Popup
          open={isPopup1Open}
          onClose={closePopup1}
          position="right center"
          contentStyle={{
            width: "100%", // Adjust as needed
            maxWidth: "980px", // Adjust as needed
          }}
        >
          <div>
            <Link to="/inventory-dashboard/categorylist">
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
            <label>
              <h5>
                <b className="editcatpopup"> Category</b>
              </h5>
            </label>
            <form className="popupfrmcategory" onSubmit={handleCategoryUpdate}>
              <div className="row">
                <div className="col">
                  <label htmlFor="category-name" className=" adca">
                    <b>Category Name</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="category-name"
                    name="catnameinputt"
                    value={selectedCategoryValue}
                    onChange={(e) => setSelectedCategoryValue(e.target.value)}
                    placeholder={window.categoryname}
                    aria-label="First name"
                    required
                  />
                </div>
              </div>
            </form>
            <button
              type="submit"
              onClick={handleCategoryValueUpdate}
              className="btn btn-light btn-lg
             "
              id="uuddcaatt"
            >
              <b className="medlistbtn2">Update </b>
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
          </div>
        </Popup>

        <Popup
          open={isPopup2Open}
          onClose={closePopup2}
          position="right center"
          contentStyle={{
            width: "100%", // Adjust as needed
            maxWidth: "990px", // Adjust as needed
          }}
        >
          <Link to="/inventory-dashboard/categorylist">
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

          <label>
            <h5>
              <b className="addcatpopup">Add Category</b>
            </h5>
          </label>

          <form className="popupfrmcategory" onSubmit={handleSubmitForm}>
            <div className="row">
              <div className="col">
                <label htmlFor="category_name" className=" adca">
                  <b>Category Name</b>
                </label>
                <input
                  type="string"
                  className="form-control"
                  value={category_name}
                  id="category_name"
                  name="catnameinputt"
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-light btn-lg "
              id="aaddcaatt"
            >
              <b className="medlistbtn2">Add </b>
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
        </Popup>
      </div>
    </>
  );
};
export default Categorylist;
