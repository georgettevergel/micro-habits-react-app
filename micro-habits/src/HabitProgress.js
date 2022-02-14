import React, { Component } from "react";
import Firebase from "firebase";

class HabitProgress extends Component {
  constructor(props) {
    super(props);

    console.log("Habit List:");
    console.log(this.props.habitList);
    console.log(this.props.calendar);

    // create statistics based on the habitList and calendar.progress data
    const calendar = this.props.calendar;
    console.log("calendar", calendar);
    var statistics = new Array(this.props.habitList.length);
    for (const i in this.props.habitList) {
      console.log(typeof calendar[i]);
      if (
        typeof calendar[i] != "undefined" &&
        calendar[i].hasOwnProperty("progress")
      ) {
        let progress = calendar[i].progress;
        var successes = 0;
        var longestStreak = 0;
        for (let ii in progress) {
          if (progress[ii] !== 0) {
            successes++;
            if (progress[ii] > longestStreak) {
              longestStreak = progress[ii];
            }
          }
        }
        var percentageSuccesses = Math.round((successes / progress.length) * 10000)/100;
        console.log("percentageSuccesses:", percentageSuccesses);
      } else {
        var percentageSuccesses = "";
      }
      //calendar[habitIndex].interval
      //if
      if (
        typeof calendar[i] != "undefined" &&
        calendar[i].hasOwnProperty("interval")
      ) {
        if (calendar[i].interval == "m") {
          var interval = "months";
        } else if (calendar[i].interval == "w") {
          var interval = "weeks";
        } else {
          var interval = "days";
        }
      } else {
        var interval = "---";
      }
      statistics[i] = {
        percentage: percentageSuccesses,
        longestStreak: longestStreak,
        interval: interval
      };
    }

    this.state = {
      statistics: statistics
    };
  } // END: constructor()

  viewInCalendar(id) {
    //    this.props.callbackGoViewCalndar(id);
  }

  render() {
    let ddLen = this.props.habitList.length;
    let listOfHabits = this.props.habitList.map((item, index) => {
      return (
        <tr>
          <td>
            <button
              class="btn btn-secondary btn-sm"
              onClick={() => this.viewInCalendar(index)}
            >
              VIEW IN CALENDAR
            </button>
          </td>
          <td>{item.habit.description}</td>
          <td>
            {item.habit.comparison}&nbsp;{item.habit.times}&nbsp;
            {item.habit.unit}
          </td>
          <td>{this.state.statistics[index].percentage} &#37;</td>
          <td>
            {this.state.statistics[index].longestStreak}{" "}
            {this.state.statistics[index].interval}
          </td>
        </tr>
      );
    }, this);
    return (
      <div className="RefreshPage">
        <div>{ddLen < 1 ? <p>No Records</p> : <p>{ddLen} Records</p>}</div>
        <div className="spacer">
          <span>Habit Progress will go here:</span>
        </div>
        <div>Such as: Longest Streak, habit length, etc.</div>
        <div>
          <table class="table">
            <th>EDIT</th>
            <th>habit</th>
            <th>goal</th>
            <th>Percent Success</th>
            <th>Longest Streak</th>
            {listOfHabits}
          </table>
        </div>
      </div>
    );
  }
} // HabitProgress COMPONENT
//************************************//
export default HabitProgress;
