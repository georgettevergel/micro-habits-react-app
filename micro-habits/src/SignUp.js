import React, { Component } from "react";
import SlideToggle from "react-slide-toggle";
import { validate } from "uuid";
import Firebase from "firebase";
import LogIn from "./LogIn";
import HabitList from "./HabitList";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //user: Firebase.auth().currentUser,
      email: "",
      password: "",
      password2: "",
      displayName: "",
      curPage: 0,
      habit: this.props.habitForm,
      id: this.props.id,
      signedUp: false,
      isLoading: false
    };

    this.close_signUp = this.close_signUp.bind(this);
    this.updateTB_simple = this.updateTB_simple.bind(this);
    this.signup = this.signup.bind(this);
    this.go_logIn = this.go_logIn.bind(this);
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

  close_signUp() {
    this.props.signUpPage(false);
  }

  signup(event) {
    if (this.state.email === "" && this.state.password === "") {
      alert("Enter details to register.");
    } else {
      this.setState({
        isLoading: true
      });
      Firebase.auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((res) => {
          res.user.updateProfile({
            displayName: this.state.displayName
          });
          console.log("User registered successfully");
          this.setState({
            isLoading: false,
            displayName: "",
            email: "",
            password: ""
          });
        })
        .catch((error) => this.setState({ errorMessage: error.message }));
    }
    const { email, password } = this.state;
    this.props.logIn(event, email, password);
  }

  //when user submits, it takes the state email and password and
  // sends to firebase auth and signin functions

  /*const { email, password, password2 } = this.state;
    if (password !== password2) {
      this.setState({ loginMessage: "The passwords you gave do not match!" });
    } else {
      this.setState({ signedUp: true });
    }

    //    this.props.logIn(event, email, password);
  }*/

  /* modal functions*/

  go_logIn() {
    this.props.LogInPage(true);
  }

  render() {
    if (this.state.signedUp) {
      return (
        <div>
          <div>
            <b>Thank you for signing up!</b>
          </div>
          <div>
            <span onClick={this.close_signUp} style={{ cursor: "pointer" }}>
              Log In
            </span>
          </div>
        </div>
      );
    } else {
      return (
        <Modal open={this.props.signUpPage} onClose={this.close_signUp}>
          <div className="container">
            <div class="SignUpWindow">
              <h2 id="signup-header">Create An Account</h2>
              <p>
                <small>{this.state.loginMessage}</small>
              </p>
              <form class="login-form" onSubmit={this.signup}>
                <div class="form-group">
                  <p>
                    <label class="col-md-4 control-label" for="textinput">
                      Name:{" "}
                    </label>
                    <input
                      type="text"
                      required
                      name="displayName"
                      placeholder="John Smith"
                      value={this.state.displayName}
                      onChange={this.updateTB_simple}
                      class="form-control input-md"
                    ></input>
                  </p>
                </div>
                <div class="form-group">
                  <p>
                    <label class="col-md-4 control-label" for="textinput">
                      E-mail:{" "}
                    </label>
                    <input
                      type="text"
                      required
                      name="email"
                      placeholder="john.smith@email.com"
                      value={this.state.email}
                      onChange={this.updateTB_simple}
                      class="form-control input-md"
                    ></input>
                  </p>
                </div>
                <div class="form-group">
                  <p>
                    <label class="col-md-4 control-label" for="passwordinput">
                      Password:{" "}
                    </label>
                    <input
                      type="password"
                      required
                      name="password"
                      placeholder="129482-dhdhsj23939"
                      value={this.state.password}
                      onChange={this.updateTB_simple}
                      class="form-control input-md"
                    ></input>
                  </p>
                </div>
                <div class="form-group">
                  <p>
                    <label class="col-md-4 control-label" for="passwordinput">
                      Confirm Password:{" "}
                    </label>
                    <input
                      type="password"
                      required
                      name="password"
                      placeholder="129482-dhdhsj23939"
                      value={this.state.password}
                      onChange={this.updateTB_simple}
                      class="form-control input-md"
                    ></input>
                  </p>
                </div>
                <div class="already-account">
                  <span onClick={this.go_logIn}>
                    Already have an account? Log in.
                  </span>
                </div>
                <div class="form-group">
                  <div class="inner">
                    <button
                      type="submit"
                      id="register-btn"
                      class="btn btn-info"
                      onClick={this.signup}
                    >
                      Create a new account
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* create the terms and conditions in sign up */}
            <SlideToggle collapsed>
              {({ toggle, setCollapsibleElement }) => (
                <div className="my-collapsible">
                  <div>
                    <p>
                      By creating an account you agree to our <br />
                      <a href="#ssss" onClick={toggle}>
                        Terms & Conditions
                      </a>
                      .
                    </p>
                  </div>
                  <div
                    className="my-collapsible__content"
                    ref={setCollapsibleElement}
                  >
                    <div className="my-collapsible__content-inner">
                      <p align="left">
                        <h4>Terms and Conditions</h4>
                        <h4>Last updated: 17th March 2021</h4>
                        <p>
                          Please read these Terms and Conditions carefully
                          before using the http://www.micorhabits.com website
                          operated by us. Your access to and use of the Service
                          is conditioned on your acceptance of and compliance
                          with these Terms. These Terms apply to all visitors,
                          users and others who access or use the Service. By
                          accessing or using the Service you agree to be bound
                          by these Terms. If you disagree with any part of the
                          terms then please do not sign in and access the
                          Service.
                        </p>

                        <h4>Content</h4>
                        <p>
                          Our Service allows you to post, link, store, share and
                          otherwise make available certain information, text,
                          graphics, videos, or other material ("Content"). You
                          are responsible for the activities.
                        </p>
                        <h4>Links To Other Web Sites</h4>
                        <p>
                          Our Service may contain links to third-party web sites
                          or services that are not owned or controlled by us. We
                          have no control over, and assumes no responsibility
                          for, the content, privacy policies, or practices of
                          any third party websites or services. You further
                          acknowledge and agree that we shall not be responsible
                          or liable, directly or indirectly, for any damage or
                          loss caused or alleged to be caused by or in
                          connection with use of or reliance on any such
                          content, goods or services available on or through any
                          such web sites or services.
                        </p>
                        <h4>Changes</h4>
                        <p>
                          We reserve the right, at our sole discretion, to
                          modify or replace these Terms at any time. If a
                          revision is a material we will try to provide at least
                          30 days' notice prior to any new terms taking effect.
                          What constitutes a material change will be determined
                          at our sole discretion.
                        </p>
                        <h4>Contact Us</h4>
                        <p>
                          If you have any questions about these Terms, please
                          contact us (info@micro-habits.com).
                        </p>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </SlideToggle>
          </div>
        </Modal>
      );
    }
  }
} // HabitForm COMPONENT
//************************************//
export default SignUp;
