import "./styles.css";
import React, { Component } from "react";
import SignUp from "./SignUp";
import LogIn from "./LogIn";
//import logo_transparent from "./logo_transparent";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Nav,  Navbar, NavDropdown } from 'react-bootstrap';
import AboutUs from './AboutUs';
import ContactUs from './ContactUs';

class NavBar extends Component {
  constructor(props) {
      super(props);

  }

  render() {
      return (
          <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
              <Navbar.Brand href="/"><img src="logo.png" alt="logo" width="170" height="130"/></Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                  <Nav className="ml-auto">
                      <Nav.Link href="/">Home</Nav.Link>
                      <Nav.Link href="/about-us">About Us</Nav.Link>
                      <Nav.Link href="/contact-us">Contact Us</Nav.Link>
                      <Nav.Link href="/motivation">Motivation</Nav.Link>
                  </Nav>
              </Navbar.Collapse>
          </Navbar>
         
      );
  }

}
export default NavBar;