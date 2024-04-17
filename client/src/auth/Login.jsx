import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthTokenCookie } from "../services/authService";
import { setUserRole } from "../services/roleService";
import redirectUser from "../services/redirectUser";
import { API_URL } from "../constants";
import logo from "../assets/Images/logo.png";
import "./Login.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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
    // Remove scroll bar
    document.body.style.overflow = "hidden";

    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      notify("error", "Username and password are required");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: { username, password } }),
      });

      if (response.ok) {
        const token = response.headers
          .get("Authorization")
          .replace("Bearer ", "");
        const responseData = await response.json();
        const role_name = responseData.data.role_name;
        // Save the user_id in cookies
        const user_id = responseData.data.id;
        document.cookie = `user_id=${user_id}; path=/`;

        setUserRole(role_name);

        setAuthTokenCookie(user_id);
        setAuthTokenCookie(token);

        redirectUser(role_name, navigate);

        // Show success message
      } else {
        notify("error", "Invalid username or password");
        console.error("Authentication Failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <>
      <div className="login-page">
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <div className="center-fixed-container">
          <div className="container">
            <div className="screen">
              <div className="screen__content">
                <img src={logo} className="photo" alt="Helwan University" />

                <form className="login" onSubmit={handleSubmit}>
                  <div className="form-outline form-white mb-4">
                    <label
                      className="fw-bold form-label text-start"
                      htmlFor="username"
                    >
                      Username
                    </label>

                    <div className="input-group mb-5">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="36"
                            fill="currentColor"
                            className="bi bi-person-fill "
                            viewBox="0 0 16 16"
                          >
                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                          </svg>
                        </span>
                      </div>
                      <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="form-control lg-form-control"
                      />
                    </div>
                  </div>
                  <div className="form-outline form-white mb-4">
                    <label
                      className="fw-bold form-label"
                      htmlFor="password"
                      id="label-pass"
                    >
                      Password
                    </label>

                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="36"
                            fill="currentColor"
                            className="bi bi-lock-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2" />
                          </svg>
                        </span>
                      </div>
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="lg-form-control form-control"
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <button
                      className="btn btn-btn-outline-light btn-outline-dark btn-lg px-5 fw-bold loginbtn"
                      id="loginbtn"
                      type="submit"
                      onClick={notify}
                    >
                      Login
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
                  </div>
                </form>
              </div>
              <div className="screen__background">
                <span className="screen__background__shape screen__background__shape4"></span>
                <span className="screen__background__shape screen__background__shape3"></span>
                <span className="screen__background__shape screen__background__shape2"></span>
                <span className="screen__background__shape screen__background__shape1"></span>
                <span className="screen__background__shape screen__background__shape5"></span>
                <span className="screen__background__shape screen__background__shape6"></span>
                <span className="screen__background__shape screen__background__shape7"></span>
                <span className="screen__background__shape screen__background__shape1"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
