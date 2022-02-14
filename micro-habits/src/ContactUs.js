import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// import Glyphicon from "react-bootstrap/lib/Glyphicon";
import Glyphicon from "@strongdm/glyphicon";

class ContactUs extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div class="container-fluid bg-grey">
        <h2 class="text-center">Contact Us</h2>
        <div class="h-100 row align-items-center">
          <div class="col">
            <p>Contact us and we'll get back to you as soon as possible.</p>
            <p>
              <span class="glyphicon glyphicon-map-marker"></span> Dublin,
              Ireland
            </p>
            <p>
              <span class="glyphicon glyphicon-phone-alt"></span> +353 123 4567
            </p>
            <p>
              <span class="glyphicon glyphicon-envelope"></span>{" "}
              info@micro-habits.com
            </p>
          </div>
        </div>
      </div>
    );
  }
} // HabitForm COMPONENT
//************************************//
export default ContactUs;
