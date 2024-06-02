import "../SalafDetails/SalafDetails.css";
import { Link, useParams } from "react-router-dom";
import { API_URL } from "../../../constants";
import { getAuthTokenCookie } from "../../../services/authService";
import { useState, useEffect } from "react";
import Sidebar from "../SalafSidebar/SalafSidebar";

const SalafDetails = () => {
  const [salaf, setSalaf] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [salaf_medicine_name, setSalaf_medicine_name] = useState(""); // State to store medicine name
  const [student_id, setStudentID] = useState(""); // State to store student ID
  const [student_name, setStudentName] = useState(""); // State to store student name
  const [request_id, setRequestID] = useState(""); // State to store request ID
  const [created_at, setCreatedAt] = useState(""); // State to store creation date
  const [updated_at, setUpdatedAt] = useState(""); // State to store update date

  const { requestId } = useParams();

  useEffect(() => {
    if (requestId) {
      handleSpecificRequest(requestId);
    }
  }, [requestId]);

  async function handleSpecificRequest(requestId) {
    const token = getAuthTokenCookie();
    if (token) {
      const response = await fetch(`${API_URL}/salaf_requests/${requestId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData.data);
        setSalaf(responseData.data);
        setStudentID(responseData.data.attributes.student_id);
        setStudentName(responseData.data.attributes.student_name);
        setSalaf_medicine_name(responseData.data.attributes.medicine_name);
        setRequestID(responseData.data.id);
        setCurrentStatus(responseData.data.attributes.status);
        setCreatedAt(responseData.data.attributes.created_at);
        setUpdatedAt(responseData.data.attributes.updated_at);
        console.log(responseData);
      } else {
        throw response;
      }
    } else {
      console.log("An error occurred");
    }
  }

  // Update status
  const handleSalafReqUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      const token = getAuthTokenCookie();
      const postData = {
        request: {
          medicine_name: [
            {
              medicine1: salaf_medicine_name, // Update with actual medicine names
            },
          ],
          status: selectedStatus,
          student_id: student_id, // Update with the selected student ID
        },
      };

      console.log(postData);
      const response = await fetch(`${API_URL}/salaf_requests/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });
      if (response.ok) {
        await handleSpecificRequest(requestId);
        console.log("Updated successfully");
      } else {
        throw new Error("Failed to update values");
      }
    } catch (error) {
      console.error("Error: ", error.message);
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
        className="bi bi-caret-right-fill salaf-arrow-icon"
        viewBox="0 0 16 16"
      >
        <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
      </svg>
      <div>
        <label className="salaf-label">
          <b>Salaf </b>
        </label>
      </div>

      <label className="req-label">
        <b>Requests Details</b>
      </label>
      <div className="col-12-lg backbtn ">
        <Link to={`/salaf-dashboard/salafList`}>
          <button className=" sa-bakbtn">
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
      <form
        className="salaf-form-container"
        onSubmit={handleSalafReqUpdateStatus}
      >
        <div className="row">
          <div className="col">
            <label className="sadetlabels">
              <b>Student Name</b>
            </label>
            <input
              type="text"
              className="form-control"
              value={student_name}
              disabled
            />
          </div>
          <div className="col">
            <label className="sadetlabels saltolf">
              <b>Student ID</b>
            </label>
            <input
              type="text"
              className="form-control"
              value={student_id}
              disabled
            />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <label className="sadetlabels">
              <b>Medicine Name</b>
            </label>
            <textarea
              type="text"
              className="form-control"
              style={{ maxHeight: "100px" }}
              value={salaf_medicine_name}
              disabled
            />
          </div>
          <div className="col">
            <label className="sadetlabels saltolf">
              <b>Request ID</b>
            </label>
            <input
              type="text"
              className="form-control"
              value={request_id}
              disabled
            />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <label className="sadetlabels saltolf">
              <b>Created At</b>
            </label>
            <input
              type="text"
              className="form-control"
              value={created_at}
              disabled
            />
          </div>
          <div className="col">
            <label className="sadetlabels saltolf">
              <b>Updated At</b>
            </label>
            <input
              type="text"
              className="form-control"
              value={updated_at}
              disabled
            />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <label className="sadetlabels satoleft text-center ">
              <b>Status</b>
            </label>
            <select
              className="sa-status-form-control"
              value={selectedStatus || currentStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="pending">pending</option>
              <option value="finished">finished</option>
            </select>
          </div>
        </div>

        <button className="sal-save" type="submit">
          Save
        </button>
      </form>
    </>
  );
};

export default SalafDetails;
