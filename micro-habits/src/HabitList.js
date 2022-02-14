import React, { Component } from "react";
import Firebase from "firebase";

class HabitList extends Component {
  constructor(props) {
    super(props);

    let todaysDate = new Date();
    let day = todaysDate.getDate();
    let month = todaysDate.getMonth();
    let year = todaysDate.getFullYear();
    var todays_Date = year + "-" + month + "-" + day;

    // create statistics based on the habitList and calendar.progress data
    const calendar = this.props.calendar;
    console.log("calendar", calendar);
    console.log("this.props.habitList.length", this.props.habitList.length);
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
        var percentageSuccesses =
          Math.round((successes / progress.length) * 10000) / 100;
        console.log("percentageSuccesses:", percentageSuccesses);
        var habitStartDate = this.props.habitList[i].habit.startDate;
        var startDate = new Date(habitStartDate);
        var habitStartDate_friendly =
          startDate.getDate() +
          "/" +
          (startDate.getMonth() + 1) +
          "/" +
          startDate.getFullYear();
        var habitEndDate = this.props.habitList[i].habit.endDate;
        var habitDaysFromThis = this.daysBetween(habitStartDate, todaysDate);
        var habitLength = this.daysBetween(habitStartDate, habitEndDate);
        var habitDaysLeft = this.daysBetween(todaysDate, habitEndDate);
        if (habitDaysFromThis < 1)
          habitDaysFromThis =
            "starting in " + (0 - habitDaysFromThis) + " days";
        if (habitDaysLeft < 1) habitDaysLeft = "Complete";
      } else {
        var percentageSuccesses = "";
        var habitDaysFromThis = "";
        var habitLength = "";
      }
      /** 
 



 var habitStartDate = this.props.habitList[i].habit.startDate;
        var habitDaysFromThis = this.daysBetween(
        habitStartDate,
        todaysDate
      );

      var habitEndDate = this.props.habitList[habitIndex].habit.endDate;


  
   * */
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
        interval: interval,
        habitDaysFromThis: habitDaysFromThis,
        habitDaysLeft: habitDaysLeft,
        habitLength: habitLength,
        startDate: habitStartDate_friendly
      };
    }

    this.state = {
      statistics: statistics
    };
  } // END: constructor()

  daysBetween(startDate, endDate) {
    const date1 = new Date(startDate);
    const date2 = new Date(endDate);
    return Math.round((date2 - date1) / 86400000);
  } // END: daysBetween()

  editRecord(id) {
    this.props.callbackEditRecord(id);
  }

  deleteRecord(id) {
    this.props.callbackVerifyDeleteRecord(id);
  }

  render() {
    let habitCount = this.props.habitList.length;
    let listOfHabits = this.props.habitList.map((item, index) => {
      return (
        <tbody>
        <tr>
          <td class="td-1">
            <button
              class="btn btn-secondary btn-sm"
              onClick={() => this.deleteRecord(index)}
            >
              DELETE
            </button>
          </td>
          <td class="td-2">{item.habit.description}</td>
          <td class="td-4">
            {item.habit.comparison}&nbsp;{item.habit.times}&nbsp;
            {item.habit.unit}
          </td>
          <td class="td-4">{this.state.statistics[index].startDate}</td>
          <td class="td-5">{this.state.statistics[index].habitLength} days</td>
          
          <td class="td-6">{this.state.statistics[index].percentage} &#37;</td>
          <td class="td-7">
            {this.state.statistics[index].longestStreak}{" "}
            {this.state.statistics[index].interval}
          </td>
          <td class="td-8">{this.state.statistics[index].habitDaysFromThis}</td>
          <td class="td-9">{this.state.statistics[index].habitDaysLeft}</td>
          <td class="td-10">
            <button
              class="btn btn-secondary btn-sm"
              onClick={() => this.editRecord(index)}
            >
              EDIT
            </button>
          </td>
        </tr>
        </tbody>
      );
    }, this);

    return (
      <div className="RefreshPage">
        <div class="spacer">
          
          <div className="spacer">
          <span>
            <button id="2" class="addhabit-btn" onClick={this.props.goMenu}>
              <img src="icons/plus-circle.svg" alt="pluscircle-icon"/> &nbsp;Add a habit
            </button>
          </span>
          </div>
        </div>
        <div class="table-div">
          <table class="table">
            <th>DELETE</th>
            <th>Habit</th>
            <th>Goal</th>
            <th>Start Date</th>
            <th>Length</th>
            <th>Percent Success</th>
            <th>Longest Streak</th>
            <th>Days since start</th>
            <th>Days left</th>
            <th>EDIT</th>
            {listOfHabits}
          </table>
        </div>
        <div>
            {habitCount < 1 ? <p>No Records</p> : <p>{habitCount} Habits:</p>}
          </div>
      </div>
    );
  }
} // HabitList COMPONENT
//************************************//
export default HabitList;
