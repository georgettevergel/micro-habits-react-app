import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

class Motivation extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div class="container">
        <h2>Micros-Habit</h2>
        <p>Small choice become actions,</p>
        <p>actions become habits,</p>
        <p>and habits become our way of life.</p>
        <div class="embed-responsive embed-responsive-16by9">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube-nocookie.com/embed/_HEnohs6yYw"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; 
          encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    );
  }
}
export default Motivation;
