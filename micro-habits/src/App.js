import "./styles.css";
import React, { Component, useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import myFirebase from "./myFirebaseConfig";
import Firebase from "firebase";
import { firebase } from "firebase";
import DeleteHabit from "./DeleteHabit";
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import HabitForm from "./HabitForm";
import HabitList from "./HabitList";
import DynamicCalendar from "./DynamicCalendar";
import NavBar from "./NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import ContactUs from "./ContactUs";
import AboutUs from "./AboutUs";
import AppGo from "./AppGo";
import Motivation from "./Motivation";

class App extends Component {
  constructor(props) {
    super(props);
    console.clear();

    // check to see if the user is logged in...
    var user = Firebase.auth().currentUser;
    if (user) {
      //  console.log(JSON.stringify(user));
      console.log("signed in");
      console.log(Firebase.auth().currentUser);
      var userID = user.email;
    } else {
      console.log("not signed in");
      var userID = "";
    }

    this.state = {
      onSignupPage: false,
      onLogInPage: false,
      userId: userID,
      loginMessage: "",
      email: "",
      password: ""
    };

    this.updateTB = this.updateTB.bind(this);
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
    this.signUpPage = this.signUpPage.bind(this);
    this.LogInPage = this.LogInPage.bind(this);
  }

  logIn(event, email, password) {
    console.log(
      "LOGIN! '" + this.state.email + "' - '" + this.state.password + "'"
    );
    //when user submits, it takes the state email and password and
    // sends to firebase auth and signin functions
    event.preventDefault(); //stop default behaviour and allow our error checking

    Firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        console.log("USER->: " + user.user.email);
        this.setState({ userId: user.user.email });
        // once successfully authenticated set state in the Parent
        // for the authenticated variable.
        // console.log("User logged on");
      })
      .catch((error) => {
        //if error occurs, push to error state
        this.setState({ loginMessage: error.message });
        //'No Internet and no log-in saved. You must stay logged in if you wish to work offline.' });
      });
  }

  logOut() {
    Firebase.auth().signOut();
    this.setState({ username: "", userId: "" });
  }

  signUpPage(onOrOff) {
    this.setState({ onSignupPage: onOrOff });
  }

  LogInPage(onOrOff) {
    this.setState({ onLogInPage: onOrOff });
  }

  updateTB(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name.split(".");
    if (name.length > 1) {
      var habitVar = this.state[name[0]];
      habitVar[name[1]] = value;
      console.log(name + " = " + value);
    } else {
      var habitvar = this.state[value];
    }

    this.setState({
      habit: habitVar
    });
    console.log("LL: " + this.state.habit.description);
  }

  render() {
    if (this.state.userId == "-1") {
      return <div>FORGOT PW</div>;
    } else if (this.state.userId !== "") {
      return (
        <div className="RefreshPage">
          <AppGo 
          userId = {this.state.userId}
          logOut ={this.logOut}
          />
        </div>
      );
    } // return if logged in
    else {
      return (
        <BrowserRouter>
          <Switch>
            <Route path="/about-us">
              <div className="App">
                <NavBar />
                <AboutUs />
              </div>
            </Route>
            <Route path="/contact-us">
              <div className="App">
                <NavBar />
                <ContactUs />
              </div>
            </Route>
            <Route path="/motivation">
              <div className="App">
                <NavBar />
                <Motivation />
              </div>
            </Route>
            <Route path="/">
              <div className="App">
                <NavBar />
                {this.state.onSignupPage ? (
                  <SignUp
                    signUpPage={this.signUpPage}
                    LogInPage={this.LogInPage}
                  />
                ) : (
                  <LogIn
                    LogInPage={this.LogInPage}
                    logIn={this.logIn}
                    loginMessage={this.state.loginMessage}
                    signUpPage={this.signUpPage}
                  />
                )}
              </div>
            </Route>
          </Switch>
        </BrowserRouter>
      );
    }
  } // render
} // APP COMPONENT

//************************************//

export default App;
