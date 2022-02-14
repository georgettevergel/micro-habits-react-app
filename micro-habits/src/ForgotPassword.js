import React, { Component } from "react";
import Firebase from "firebase";

// https://www.npmjs.com/package/react-slide-toggle
import SlideToggle from "react-slide-toggle";

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      accountNotExists: false,
      logMessage: "This account doesn't exist!"
    };

    this.go_checkAccount = this.go_checkAccount.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
  }

  go_checkAccount(event) {
    event.preventDefault();
    console.log(this.state.email);

    if (!this.state.email) {
      this.setState({ accountNotExists: true });
      this.setState({ logMessage: "Please enter an Email Address!" });
    } else {
      // Submit email to firebase to check if account exits
      Firebase.auth()
        .signInWithEmailAndPassword(this.state.email, "password")
        .catch((error) => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode + " " + errorMessage);

          if (errorCode === "auth/user-not-found") {
            errorMessage = "The email you entered doesn't exist!";
          } else if (errorCode === "auth/wrong-password") {
            // Reset the password here.
            errorMessage = "Please check your email to reset your password!";

            // Send the reset password email
            this.sendEmail();
          }

          // always show the message
          this.setState({ accountNotExists: true });
          this.setState({ logMessage: errorMessage });
        });
    }
  }

  handleChange = (event) => {
    const value = event.target.value;
    this.setState({
      email: value
    });
  };

  // Send email to user to reset password
  sendEmail() {
    var auth = Firebase.auth();

    auth
      .sendPasswordResetEmail(this.state.email)
      .then(function () {
        // Email sent.
        console.log("Sending email!");
      })
      .catch(function (error) {
        // An error happened.
        console.log("Sending email failed!");
      });
  }

  render() {
    return (
      <SlideToggle collapsed>
        {({ toggle, setCollapsibleElement }) => (
          <div className="my-collapsible">
            <div>
              <p>
                <a href="#aaa" onClick={toggle}>
                  Forgot password?
                </a>
              </p>
            </div>
            <div
              className="my-collapsible__content"
              ref={setCollapsibleElement}
            >
              <div className="my-collapsible__content-inner">
                Please enter your email address:
                &nbsp; &nbsp;
                <form>
                  <p>
                    <input
                      type="text"
                      placeholder="user email"
                      value={this.state.email}
                      onChange={this.handleChange}
                      class="form-control input-md"
                    ></input>
                    <button onClick={this.go_checkAccount} class="btn btn-info">
                      Reset Password
                    </button>
                  </p>
                  <p>
                    {this.state.accountNotExists && (
                      <small style={{ color: "red" }}>
                        {this.state.logMessage}
                      </small>
                    )}
                  </p>
                </form>
              </div>
            </div>
          </div>
        )}
      </SlideToggle>
    );
  }
} // HabitForm COMPONENT
//************************************//
export default ForgotPassword;
