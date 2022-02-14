import React, { Component } from "react";
import Firebase from "firebase";

class HabitForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curPage: 0,
      habit: this.props.habitForm,
      id: this.props.id,
      validationMessage: ""
    };

    console.log("HAB-1: " + this.props.id);
    console.log("HAB-2: " + this.state.habit.description);
    this.sendData = this.sendData.bind(this);
    this.updateInputBox = this.updateInputBox.bind(this);
    this.setInterval = this.setInterval.bind(this);
    this.updateDropDown = this.updateDropDown.bind(this);
  }

  updateInputBox(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name.split(".");

    if (name.length > 1) {
      var formValues = this.state[name[0]]; // habit
      formValues[name[1]] = value;
      //      console.log('UPDATE input box: ' + name + ' = ' + value);
    } else {
      var formValues = this.state[value];
    }
    console.log("name[0]", name[0]);
    console.log("formValues", formValues);
    this.setState({
      habit: formValues
    });
    console.log("LL: " + this.state.habit.description);
  }

  daysBetween(startDate, endDate) {
    const date1 = new Date(startDate);
    const date2 = new Date(endDate);
    return Math.round((date2 - date1) / 86400000);
  } // END: daysBetween()

  validateData() {
    // validates the Item form
    const times = this.state.habit.times;
    const desc = this.state.habit.description;
    const startDate = this.state.habit.startDate;
    const endDate = this.state.habit.endDate;
    const daysBetween = this.daysBetween(startDate, endDate);
    if (desc.length < 1) return "'Habit name' cannot be left blank.";
    if (times == "" || isNaN(times) || times < 1 || times > 10000)
      return "'Times' must be a number between 1 - 10,000.";
    if (startDate.length < 1) return "You must choose a start date.";
    if (endDate.length < 1) return "You must choose an end date.";
    console.log("daysBetween", daysBetween);
    if (daysBetween < 0) return "The end date cannot be before the start date!";
    return "";
  } // END: function validateItem()

  sendData() {
    var validateText = this.validateData();
    if (validateText != "") {
      this.setState({ validationMessage: validateText });
      return;
    } else {
      console.log("SEND_DATA");
      // generate a unique habit id.
      let uuid = require("uuid");
      var habitID = "";
      if (this.state.id === "") {
        habitID = uuid.v4();
        console.log("NEW");
      } else {
        console.log("EDIT");
        habitID = this.state.id;
      }

      let timestampTest = new Date().toUTCString();

      // create our new habit object
      //which will be inserted into the database:

      let habitFormValues = this.state.habit;
      this.validateForm(habitFormValues);
      let habitObject = {
        habit: habitFormValues,
        h_time: timestampTest
      };

      const database = Firebase.firestore();
      console.log("WRITE:" + this.props.userId);

      // WRITE TO FIRESTORE DB
      console.log("send to DB: ", this.props.userId);
      database
        .collection(this.props.userId)
        .doc("data")
        .collection("habits")
        .doc(habitID)
        .set(habitObject);

      this.props.goMenu(1); // go back to the list of habits page
    }
  } // END:  sendData()

  validateForm(habitFormValues) {
    console.log("validate", habitFormValues);
  }

  setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
  }

  padZero(str, len) {
    for (var i = str.length; i < len; i++) str = "0" + str;
    return str;
  }

  dayz(index) {
    if (this.state.hasOwnProperty("days")) {
      var days = this.state.days.toString(2);
      console.log("DAY_Z:" + days + ":" + index + ":" + days.charAt(index));

      if (days.length > index) if (days.charAt(index) == "1") return true;
    }
    return false;
  }

  setInterval(event) {
    // to-do : clean up extra properties not needed if interval is canged:

    console.log("SET I: " + event.target.name);
    var cb = event.target.name;
    var habitVar = this.state.habit;
    console.log(":" + cb + " _ VAL: " + val);
    if (cb === "period") {
      var val = event.target.value;
      console.log("SET I: " + event.target.name + " - " + val);
      if (val == 1) {
        // specific days per week:
        habitVar.days = [false, false, false, false, false, false, false];
      } else if (val == 2) {
        // so many days per week / month
        habitVar.daysPer = "week";
        habitVar.days = 1;
      } else {
        habitVar.days = 2;
      }
      habitVar.interval = val;
      this.setState({ habit: habitVar });
    } else {
      var val = event.target.checked;
      console.log("SET I: " + event.target.name + " - " + val);
      if (habitVar.hasOwnProperty("days") && habitVar.days.length > 1) {
        var days = habitVar.days;
        console.log("DAYZ:'" + days + "'");
      } else {
        habitVar.days = [false, false, false, false, false, false, false];
      }

      console.log("DAYS: '" + days + "'");
      var pos = cb.charCodeAt(12) - 48;
      console.log("P: " + pos);
      habitVar.days[pos] = val === true ? true : false;

      console.log("DAYS_val: '" + habitVar.days + "'");

      console.log("DAYS = " + days);
      this.setState({ habit: habitVar });
    }
  } // END: setInterval()

  updateDropDown(event) {
    const field = event.target.id;
    const oldValue = this.state.habit[field];
    const newValue = event.target.value;

    console.log(field);

    console.log("UPDATE DD:| " + newValue);
    console.log("WAS: " + oldValue);

    if (newValue !== oldValue) {
      const habit = this.state.habit;
      habit[field] = newValue;
      this.setState({
        habit: habit
      });
    }
  } //  updateDropDown()

  render() {
    return (
      <div className="RefreshPage">
        <div className="inner-spacer">
          <div>{this.state.validationMessage}</div>
          <div class="padDiv">
            <input
              class="Defaulttextarea"
              type="text"
              name="habit.description"
              size="30"
              placeholder="Enter habit name"
              value={this.state.habit.description}
              onChange={this.updateInputBox}
            ></input>
          </div>
          <div class="padDiv">
            <div>
              <span>Start date </span>
              <input
                class="Defaulttextarea"
                type="date"
                name="habit.startDate"
                size="50"
                placeholder="START: EG: 2021-05-01 YEAR MH DAY"
                value={this.state.habit.startDate}
                onChange={this.updateInputBox}
              ></input>
            </div>
            <div class="padDiv">
              <span>End date </span>
              <input
                class="Defaulttextarea"
                type="date"
                name="habit.endDate"
                size="50"
                value={this.state.habit.endDate}
                onChange={this.updateInputBox}
              ></input>
            </div>
            <div class="padDiv">
              <select
                name="comparison"
                id="comparison"
                defaultValue={this.state.habit.comparison}
                onChange={this.updateDropDown}
              >
                <option value=">">more than</option>
                <option value="=">exactly</option>
                <option value="<">less than</option>
              </select>
            </div>
            &nbsp;
            <input
              class="Defaulttextarea"
              type="text"
              name="habit.times"
              size="3"
              placeholder="Enter Times (How many timess)"
              value={this.state.habit.times}
              onChange={this.updateInputBox}
            ></input>{" "}
            <select
              name="unit"
              id="unit"
              defaultValue={this.state.habit.unit}
              onChange={this.updateDropDown}
            >
              <option value="times">times</option>
              <option value="kilometers">kilometers</option>
              <option value="minutes">hours</option>
              <option value="hours">minutes</option>
            </select>
          </div>

          <div class="padDiv">
            <input
              checked={this.state.habit.interval == "0"}
              onChange={this.setInterval}
              type="radio"
              id="daily"
              name="period"
              value="0"
            ></input>
            <label for="daily">Daily</label>
            <br />
            <input
              checked={this.state.habit.interval == "1"}
              onChange={this.setInterval}
              type="radio"
              id="someDays"
              name="period"
              value="1"
            ></input>
            <label for="someDays">Some days</label>
            {this.state.habit.interval == 1 && (
              <div>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <input
                          type="checkbox"
                          onChange={this.setInterval}
                          id="particuarDay0"
                          name="particuarDay0"
                          value="0"
                          checked={
                            this.state.habit.hasOwnProperty("days") &&
                            this.state.habit.days[0] === true
                          }
                        ></input>
                        <label for="particuarDay0"> Sunday</label>
                      </td>
                      <td>
                        &nbsp;
                        <input
                          type="checkbox"
                          onChange={this.setInterval}
                          id="particuarDay1"
                          name="particuarDay1"
                          value="1"
                          checked={
                            this.state.habit.hasOwnProperty("days") &&
                            this.state.habit.days[1]
                          }
                        ></input>
                        <label for="particuarDay1"> Monday</label>
                      </td>
                      <td>
                        &nbsp;
                        <input
                          type="checkbox"
                          onChange={this.setInterval}
                          id="particuarDay2"
                          name="particuarDay2"
                          value="2"
                          checked={
                            this.state.habit.hasOwnProperty("days") &&
                            this.state.habit.days[2]
                          }
                        ></input>
                        <label for="particuarDay2"> Tuesday</label>
                      </td>
                      <td>
                        &nbsp;
                        <input
                          type="checkbox"
                          onChange={this.setInterval}
                          id="particuarDay3"
                          name="particuarDay3"
                          value="3"
                          checked={
                            this.state.habit.hasOwnProperty("days") &&
                            this.state.habit.days[3]
                          }
                        ></input>
                        <label for="particuarDay3"> Wednesday</label>
                      </td>
                      <td>
                        &nbsp;
                        <input
                          type="checkbox"
                          onChange={this.setInterval}
                          id="particuarDay4"
                          name="particuarDay4"
                          value="4"
                          checked={
                            this.state.habit.hasOwnProperty("days") &&
                            this.state.habit.days[4]
                          }
                        ></input>
                        <label for="particuarDay4"> Thursday</label>
                      </td>
                      <td>
                        &nbsp;
                        <input
                          type="checkbox"
                          onChange={this.setInterval}
                          id="particuarDay5"
                          name="particuarDay5"
                          value="5"
                          checked={
                            this.state.habit.hasOwnProperty("days") &&
                            this.state.habit.days[5]
                          }
                        ></input>
                        <label for="particuarDay5"> Friday</label>
                      </td>
                      <td>
                        &nbsp;
                        <input
                          type="checkbox"
                          onChange={this.setInterval}
                          id="particuarDay6"
                          name="particuarDay6"
                          value="6"
                          checked={
                            this.state.habit.hasOwnProperty("days") &&
                            this.state.habit.days[6]
                          }
                        ></input>
                        <label for="particuarDay6"> Saturday</label>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            <br />
            <input
              checked={this.state.habit.interval == "2"}
              onChange={this.setInterval}
              type="radio"
              id="soManyDays"
              name="period"
              value="2"
            ></input>
            <label for="someDays">So many days per week/month</label>
            {this.state.habit.interval == 2 && (
              <div>
                <input
                  name="habit.days"
                  value={this.state.habit.days}
                  onChange={this.updateInputBox}
                  size="2"
                ></input>{" "}
                &nbsp; days per &nbsp;
                <select
                  name="daysPer"
                  id="daysPer"
                  defaultValue={this.state.habit.daysPer}
                  onChange={this.updateDropDown}
                >
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                </select>
              </div>
            )}
            <br />
            <input
              checked={this.state.habit.interval == "3"}
              onChange={this.setInterval}
              type="radio"
              id="everyNthDay"
              name="period"
              value="3"
            ></input>
            <label for="someDays">Every 2nd/3rd/4th day, etc.../</label>
            {this.state.habit.interval == 3 && (
              <div>
                Every{" "}
                <input
                  name="habit.days"
                  value={this.state.habit.days}
                  onChange={this.updateInputBox}
                  size="2"
                ></input>{" "}
                days{" "}
              </div>
            )}
          </div>
          <div>
            <button
              id="sendButton"
              class="btn btn-primary"
              onClick={this.sendData}
            >
              UPDATE HABIT
            </button>
          </div>
        </div>
      </div>
    );
  }
} // HabitForm COMPONENT
//************************************//
export default HabitForm;
