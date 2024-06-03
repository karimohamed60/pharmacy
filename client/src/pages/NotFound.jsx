import React from "react";
import "./NotFound.css";

const NotFound = () => {
  return (
    <section className="py-3 py-md-5 min-vh-100 d-flex justify-content-center align-items-center fw-bold error">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="text-center">
              <h2 className="d-flex justify-content-center align-items-center gap-3 mb-4">
                <span className="display-1 fw-bold">4</span>
                <i className="bi bi-exclamation-circle-fill text-danger display-2"></i>
                <spa n className="display-1 fw-bold bsb-flip-h">
                  4
                </spa>
              </h2>
              <h3 className="h2 ">Oops! You're lost.</h3>
              <p className="">The page you are looking for was not found.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
