import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthTokenCookie } from "../services/authService";
import { setUserRole } from '../services/roleService';
import redirectUser from '../services/redirectUser';
import { API_URL } from '../constants';
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ user: { username, password } }),
      });

      if (response.ok) {
        const token        = response.headers.get('Authorization').replace('Bearer ', '');
        const responseData = await response.json();
        const role_name    = responseData.data.role_name;

        setUserRole(role_name);

        setAuthTokenCookie(token);

        redirectUser(role_name, navigate);
      } else {
        console.error("Authentication Failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <>
        <form onSubmit={handleSubmit} className="login-page">
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
  <title>Login</title>
  <section className="vh-100">
  <div className="container py-5 h-100" >
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col-12 col-md-8 col-lg-6 col-xl-5">
        <div className="card bg-white text-dark" >
          <div className="card-body p-5 ">
            <div className="mb-md-5 mt-md-4 pb-5">
            <div className="text-center">
            <img src={'data:image/jpeg;base64,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'} className="photo" alt="Helwan University"/>

          </div>
              <h2 className="fw-bold mb-2 text-uppercase text-center title">Login</h2>
              <h6 className="text-dark-50 fw-bold mb-5 ">
               <span className="text-center"> Please enter your Credentials to access your account</span>
                <hr className="hr hr-blurry "/>
              </h6>
              <div className="form-outline form-white mb-4">
              <label className="fw-bold form-label text-start" htmlFor="username">
                  Username
                </label>

                <div className="input-group mb-5">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <svg xmlns="http://www.w3.org/2000/svg" width="23" height="25" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                        </svg>
                      </span>
                    </div>
                    <input type="text"
                        id="username"
                        value={username}
                        pattern="[a-zA-Z]*"
                        onChange={(e) => setUsername(e.target.value)}
                        className="form-control" />                </div>


              </div>
              <div className="form-outline form-white mb-4">
              <label className="fw-bold form-label" htmlFor="password">
                  Password
                </label>

                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                      <svg xmlns="http://www.w3.org/2000/svg" width="23" height="25" fill="currentColor" className="bi bi-lock-fill" viewBox="0 0 16 16">
                      <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"/>
                      </svg>
                      </span>
                    </div>
                    <input type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control" />
                                         </div>

              </div>
              <div className="text-center">
              <button className="btn btn-btn-outline-light btn-outline-dark btn-lg px-5 fw-bold loginbtn  " id='loginbtn' type="submit" >
                Login
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    </section>
    </form>
    </>
  );
}

export default Login;