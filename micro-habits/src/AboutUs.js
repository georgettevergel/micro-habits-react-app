import React, { Component } from "react";

class AboutUs extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div class="jumbotron text-center">
          <h1>Micro-Habits</h1>
          <h2>How It Works?</h2>
          <p> Habit setting up in its essential steps: </p>
          <p>Create your habit, Edit your habit, Track your progress</p>
        </div>

        <div class="container">
          <div class="row">
            <div class="col-sm-4">
              <h3>1. Create your habit</h3>
              <p>Set up many haibts as you like,</p>
              <p>create your daily routines and</p>
              <p> start your journey.</p>
            </div>
            <div class="col-sm-4">
              <h3>2. Edit your habit</h3>
              <p>Add and delete your habit to</p>
              <p>organise your habits with</p>
              <p>reminder and goal achivement.</p>
            </div>
            <div class="col-sm-4">
              <h3>3. Track your progress</h3>
              <p>View your habit effectively</p>
              <p>through the progress report</p>
              <p>and simply improving yourself</p>
              <p>just a little each day.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AboutUs;
