import React, { Component } from "react";
import ForgotPassword from "./ForgotPassword";
import {Modal} from "react-responsive-modal";
import SlidePhoto from "./SlidePhoto";
import "react-responsive-modal/styles.css";
//import 'bootstrap/dist/css/bootstrap.min.css';

class LogIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      curPage: 0,
      habit: this.props.habitForm,
      id: this.props.id,
      open: false
    };
    this.go_signUp = this.go_signUp.bind(this);
    this.updateTB_simple = this.updateTB_simple.bind(this);
    this.logIn = this.logIn.bind(this);
    this.onOpenModal = this.onOpenModal.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
  }

  logIn(event) {
    console.log(
      "LOGIN! '" + this.state.email + "' - '" + this.state.password + "'"
    );
    //when user submits, it takes the state email and password and
    // sends to firebase auth and signin functions

    const { email, password } = this.state;
    this.props.logIn(event, email, password);
  }

  go_signUp() {
    this.props.signUpPage(true);
  }

  

  updateTB_simple(event) {
    const target = event.target;
    var value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
    // console.log("UPDATETB:" + value);
  }

  getMessagesFromDatabase() {}

  // modal functions
  onOpenModal = () => {
    this.setState({open: true});
  };

  onCloseModal = () => {
    this.setState({open: false});
  };


  render() {
    const {open} = this.state;
    return (
    <div class="nav-container">
      <div class="homepage-btns">
        <button class="modal-btns" id="signup-modal-btn" onClick={this.go_signUp}>Sign Up</button>
        <button type="button" class="modal-btns" id="login-modal-btn" onClick={this.onOpenModal}>Log In</button>
      </div>
      <div class="hero-banner">
        <h3>A thousand miles starts with the first step</h3>
        <SlidePhoto />
      </div>
      <Modal 
      open={open} 
      onClose={this.onCloseModal} 
      className="Modal">
      <div class="loginform">
        <h2>LOG IN</h2>
          <form class="login-form" onSubmit={this.go_logIn}>
            <div class="form-group">
              <p>
                <label class="col-md-4 control-label" for="textinput">E-mail</label>  
                &nbsp; &nbsp; &nbsp; &nbsp;
                <input
                  type="text"
                  name="email"
                  placeholder="john.smith@email.com"
                  value={this.state.email}
                  onChange={this.updateTB_simple}
                  class="form-control input-md"
                ></input>
              </p>
            </div>  {/* end of data*/}
            <div class="form-group">
              <p>
              <label class="col-md-4 control-label" for="passwordinput">Password</label>
                  &nbsp; &nbsp;
                <input
                  type="password"
                  name="password"
                  placeholder="Jcn-19iw10-sakq" 
                  value={this.state.password}
                  onChange={this.updateTB_simple}
                  class="form-control input-md">
                  </input>
              </p>
          </div> {/* end of data*/}
            {/* create the password reset in Log in */}
            {/*class ForgotPassword extends Component */}
            <ForgotPassword />
              <div class="create-account">
              <span onClick={this.go_signUp}>Don't have an account? Create account.</span>
              </div>
            <div class="form-group">
              {/* <a href="aaa">Forget password?</a> */}
                <div class="col-md-4">
                 
                  <button id="login-btn" class="btn btn-info" onClick={this.logIn}>Log in</button>
                </div> {/* end of inner*/}
            </div> {/* end of forgotpass*/}
          </form>
        </div> {/* end of loginform*/}
    {/*  
      <div>
          <hr />
        </div>

        <div
          style={{ cursor: "pointer", color: "red" }}
          class="small"
          onClick={() => {
            this.setState({
              email: "microhabits.info@gmail.com",
              password: "abcd1234"
            });
          }}
        >
          microhabits.info@gmail.com abcd1234
        </div>
        <div
          style={{ cursor: "pointer", color: "red" }}
          class="small"
          onClick={() => {
            this.setState({
              email: "info@micro-habits.com",
              password: "abcd1234"
            });
          }}
        >
          info@micro-habits.com abcd1234
        </div>
        <div
          style={{ cursor: "pointer", color: "red" }}
          class="small"
          onClick={() => {
            this.setState({
              email: "another@email.com",
              password: "abcd1234"
            });
          }}
        >
          another@email.com abcd1234
        </div>
        <div>
          <hr />
        </div>
        <div style={{ fontSize: "40px", fontWeight: "bold" }}>MicroHabits-</div>
        <div style={{ fontSize: "12px", fontWeight: "bold" }}>
          <i>A thousand miles starts with the first step.</i>
        </div>
        */}
        </Modal>
      </div>  
    );
  }
} // HabitForm COMPONENT
//************************************//
export default LogIn;
