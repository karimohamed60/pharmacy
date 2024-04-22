import React from "react";
import './NotFound.css'

const NotFound = () => {

    return(
<section class="py-3 py-md-5 min-vh-100 d-flex justify-content-center align-items-center fw-bold error">
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="text-center">
          <h2 class="d-flex justify-content-center align-items-center gap-3 mb-4">
            <span class="display-1 fw-bold">4</span>
            <i class="bi bi-exclamation-circle-fill text-danger display-2"></i>
            <span class="display-1 fw-bold bsb-flip-h">4</span>
          </h2>
          <h3 class="h2 ">Oops! You're lost.</h3>
          <p class="">The page you are looking for was not found.</p>
        </div>
      </div>
    </div>
  </div>
</section>
    );

}

export default NotFound;