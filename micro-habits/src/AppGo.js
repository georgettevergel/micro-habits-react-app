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
import HabitProgress from "./HabitProgress";
import HabitList from "./HabitList";
import DynamicCalendar from "./DynamicCalendar";
import NavBar from "./NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import ContactUs from "./ContactUs";
import AboutUs from "./AboutUs";

class AppGo extends Component {
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
      curPage: 1,
      curHabitIndex: 0,
      habitForm: [],
      userId: this.props.userId,
      loginMessage: "",
      email: "",
      password: "",
      data_habits: [],
      calendarEmpty: true
    };

    this.updateTB = this.updateTB.bind(this);
    this.logIn = this.logIn.bind(this);
    this.signUpPage = this.signUpPage.bind(this);
    this.LogInPage = this.LogInPage.bind(this);
    this.goMenu = this.goMenu.bind(this);
    this.setData = this.setData.bind(this);
  }

  // ### END: Constructor ################################

  // Retrieve the data from Firebase
  // Since this is an individual app (not a chat app)
  // there is no need for regular updates from the database
  // This would be costly in a real-world situation

  async componentDidMount() {
    // as soon as the component mounts, get the most recent messages from the firebase database.

    global.dbReads++;
    console.log("READING DATA FROM DATABASE: " + global.dbReads);
    const app = Firebase;
    console.log("APP: " + app);

    var user = Firebase.auth().currentUser;

    if (user) {
      const database = Firebase.firestore();

      // This will require two reads
      // 1. The general list of habits and details
      // 2. And the calendar enteries

      // ##################################################

      // #1. GET HABITS LIST DATA:

      const FB_HABITS_LIST_CONNECTION = database
        .collection(user.email)
        .doc("data")
        .collection("habits");

      // #1 : HAITS LIST DATA BACK:

      FB_HABITS_LIST_CONNECTION.onSnapshot((doc) => {
        const dataBack_list = doc.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log("dataBack_list (1): " + JSON.stringify(dataBack_list));
        console.log("Data Length: " + dataBack_list.length);
        if (dataBack_list.length > 0) {
          this.setState({ data_habits: dataBack_list });
        }
        console.log("data_habits");
        console.log(this.state.data_habits);

        // =========================================

        // #2. GET CALENDAR ENTERIES DATA:
        const FB_CALENDAR_CONNECTION = database
          .collection(user.email)
          .doc("data")
          .collection("calendar")
          .orderBy(Firebase.firestore.FieldPath.documentId());

        // #2  CALENDAR DATA BACK:

        FB_CALENDAR_CONNECTION.onSnapshot((doc) => {
          //      const data = doc.data();

          const dataBack_calendar = doc.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          console.log(
            "data back (dataBack_calendar): " +
              JSON.stringify(dataBack_calendar)
          );

          var structuredCalendar = this.structureCalendar(dataBack_calendar);
          //          console.log('sc', JSON.stringify(structuredCalendar));
          this.setState({
            data_calendar: structuredCalendar,
            calendarEmpty: false
          });

          // ============================================
        }); // END: CALENDAR CALLBACK
      }); // END: DATA RETURN #1. GET HABITS LIST DATA:

      // =============================================
    } else {
      this.setState();
    }
  } // END: async componentDidMount()

  // END: DATABASE ASYNC #################################

  // IT IS IMPORTANT TO ORGANISE THIS DATA WELL :

  setBranch(obj, branch) {}
  //
  // ###########################################################################
  //
  getHabitIndex(obj, value) {
    for (const index in obj) {
      if (obj[index].id == value) {
        return index;
      }
    }
    return -1;
  }

  structureCalendar(dataBack_calendar_) {
    console.log("habit list", this.state.data_habits);
    console.log("Always here?");
    var startMonth, endMonth, achievedHabit, a, b, c, successToday;
    const dataBack_calendar = dataBack_calendar_;
    const calendar = {};
    var interval;

    var hasStartFlag, hasEndFlag;
    // LOOP: (through all the calendar enteries of all the habits)
    for (var x of dataBack_calendar) {
      console.log(x.value, x.note);
      if (typeof x.note === "undefined") x.note = "";
      if (typeof x.value === "undefined") x.value = 0;
      x.value = parseInt(x.value, 10);

      try {
        var year = x.id.substring(0, 4);
        var month = x.id.substring(4, 6);
        var day = x.id.substring(6, 8);
        var habit_ = x.id.substring(8);
        var noErrors = true;
        this.cLog(year + "/" + month + "/" + day + " " + habit_, "o");
      } catch {
        var noErrors = false;
      }
      //           var property = x.id.split("-");

      //      if (property.length == 4) {
      var habitIndex = this.getHabitIndex(this.state.data_habits, habit_);
      this.cLog("ID: " + x.id, "b");
      this.cLog(" HABIT INDEX of " + habit_ + " = " + habitIndex, "b");
      if (noErrors && habitIndex > -1) {
        // habit name - find in habits list and index it
        console.log();

        if (!calendar.hasOwnProperty(habitIndex)) calendar[habitIndex] = {};

        // year:
        if (!calendar[habitIndex].hasOwnProperty(year))
          calendar[habitIndex][year] = {};
        // month
        if (!calendar[habitIndex][year].hasOwnProperty(month))
          calendar[habitIndex][year][month] = {};

        calendar[habitIndex][year][month][day] = x;
        // TO-DO: probably remove ID field?
      }
    } // END: loop (through all the calendar enteries of all the habits)
    //
    // ###########################################################################
    //
    // go through habits list and add start and end flags
    const habits = this.state.data_habits;

    var index = 0;
    for (const x of habits) {
      console.log("HABIT: ADD start/end FLAGS:", x.habit.description);
      //      const habitName = index; //x.habit.description;
      this.cLog("x", "b");
      console.log(x);
      // will have start and end date:
      // for now add these:
      //
      // ###########################################################################
      //
      // add start and end date flags:
      //
      // ###########################################################################
      //
      // #1 START:

      if (x.habit.hasOwnProperty("startDate")) {
        hasStartFlag = true;
        var startDate = x.habit.startDate.split("-");
        console.log("index", index);
        // date is from 0 - 11
        startMonth = startDate[1]; // keep this for later
        startDate[1] = (parseInt(startDate[1], 10) - 1).toString(); // date is from 0 - 11
        if (startDate[1] < 10) startDate[1] = "0" + startDate[1];

        // habit
        if (!calendar.hasOwnProperty(index)) calendar[index] = {};
        // year:
        if (!calendar[index].hasOwnProperty(startDate[0]))
          calendar[index][startDate[0]] = {};
        // month
        if (!calendar[index][startDate[0]].hasOwnProperty(startDate[1]))
          calendar[index][startDate[0]][startDate[1]] = {};
        if (
          !calendar[index][startDate[0]][startDate[1]].hasOwnProperty(
            startDate[2]
          )
        ) {
          calendar[index][startDate[0]][startDate[1]][startDate[2]] = {
            value: 0,
            note: "start",
            isStart: true
          };
        } else {
          console.log(
            calendar[index][startDate[0]][startDate[1]][startDate[2]]
          );
          calendar[index][startDate[0]][startDate[1]][
            startDate[2]
          ].isStart = true;
        }
      } // end set start flag
      else {
        hasStartFlag = false;
      }
      // ######################################################################
      // to-do reduce repeating code
      console.log(x.habit);
      if (x.habit.hasOwnProperty("endDate")) {
        hasEndFlag = true;
        console.log("END DATE ##########################");
        var endDate = x.habit.endDate.split("-");
        console.log("endDate", endDate);
        console.log("index", index);
        console.log("parts1", endDate[1]);
        endMonth = endDate[1]; // keep this for later
        // date is from 0 - 11
        endDate[1] = (parseInt(endDate[1], 10) - 1).toString(); // date is from 0 - 11
        if (endDate[1] < 10) endDate[1] = "0" + endDate[1];

        // habit
        if (!calendar.hasOwnProperty(index)) calendar[index] = {};
        // year:
        if (!calendar[index].hasOwnProperty(endDate[0]))
          calendar[index][endDate[0]] = {};
        // month
        if (!calendar[index][endDate[0]].hasOwnProperty(endDate[1]))
          calendar[index][endDate[0]][endDate[1]] = {};
        if (
          !calendar[index][endDate[0]][endDate[1]].hasOwnProperty(endDate[2])
        ) {
          calendar[index][endDate[0]][endDate[1]][endDate[2]] = {
            value: 0,
            note: "end",
            isEnd: true
          };
          console.log("isEND - new");
        } else {
          calendar[index][endDate[0]][endDate[1]][endDate[2]].isEnd = true;
          console.log("isEND - not new");
        }
      } // end set start flag
      else {
        hasEndFlag = false;
      }
      //
      // ###########################################################################
      // HABIT STREAK FINDER:

      var progressTracker = [];
      if (hasStartFlag && hasEndFlag) {
        this.cLog("HABIT FINDER", "g");
        console.log(startDate, endDate);
        var startDateStr = startDate[0] + "-" + startMonth + "-" + startDate[2];
        var endDateStr = endDate[0] + "-" + endMonth + "-" + endDate[2];
        console.log(startDateStr, endDateStr);

        // 1. Determine the number of days in this habit:
        var habitDayCount = this.daysBetween(startDateStr, endDateStr) + 1; // N.B. : (+1) i.e., INCLUSIVE OF THS START AND END DATE
        this.cLog(habitDayCount, "r");

        // 2. create an array for each day of the habit:

        if (habitDayCount > 0) {
          var successChart = new Array(habitDayCount);

          var currentDate = new Date(startDateStr);
          //var currentDay = currentDate.getDay();

          var habitFirstDate = new Date(startDateStr);
          var habitFirstDay = habitFirstDate.getDay();

          b = x.habit.times; //TO-DO change these variable names
          c = x.habit.comparison;

          // ........................................................................
          //
          //
          for (var dayOfHabit = 0; dayOfHabit < habitDayCount; dayOfHabit++) {
            // *************************************************************************************
            // step 1: create a random yes or no, this will be replaced by the logic:
            // *************************************************************************************

            var today = currentDate.getDate();
            var thisMonth = currentDate.getMonth();
            var thisYear = currentDate.getFullYear();
            var this_Day = this.calendarDate(
              calendar,
              today,
              thisMonth,
              thisYear,
              index
            );
            //console.log(
            //   today + " / " + thisMonth + " / " + thisYear + "  " + currentDay
            // );
            currentDate = this.getNextDay(currentDate);
            // currentDay = (currentDay + 1) % 7;

            if (this_Day != null) {
              a = this_Day.value;
            } else {
              a = -1;
            }

            if (
              (c == "=" && a == b) ||
              (c == "<" && a < b) ||
              (c == ">" && a > b)
            ) {
              successChart[dayOfHabit] = true;
            } else {
              successChart[dayOfHabit] = false;
            }

            // ###############################################################
          } // ----------------------------------------------------------------------------END: for loop; (days of habit)

          // pace code in here...

          if (x.habit.interval == 0) {
            interval = "d";
            progressTracker = this.findStreaks(1, successChart);
            // option 3 : every so many days ............................
            //
          } else if (x.habit.interval == 1) {
            // particular days in the week, eg. Mon, Wed, Fri
            interval = "w";
            console.log(
              "habitFirstDay",
              habitFirstDay,
              "x.habit.days",
              this.daysBoolToInt(x.habit.days),
              "successChart",
              successChart
            );
            progressTracker = this.findStreaksPerWeek(
              habitFirstDay,
              this.daysBoolToInt(x.habit.days),
              successChart
            );
            this.cLog("progressTracker: " + progressTracker, "o");
          } else if (x.habit.interval == 2) {
            this.cLog("DAYSPER", "r");
            console.log("daysPer", x.habit.daysPer);
            if (x.habit.daysPer == "week") {
              this.cLog("DAYSPER - week", "r");
              interval = "w";
              console.log(
                "habitFirstDay",
                habitFirstDay,
                "successChart",
                successChart
              );
              progressTracker = this.findStreaksPerWeek(
                habitFirstDay,
                x.habit.days,
                successChart
              );
              this.cLog("progressTracker: " + progressTracker, "o");
            } else {
              //            // to-DO: need to allow daysPer = month as well as week
              this.cLog("Days per month", "r");
              interval = "m";
              var year = startDate[0];
              var month = startDate[1];
              var day = startDate[2];
              progressTracker = this.findStreaksPerMonth(
                day,
                month,
                year,
                x.habit.days,
                successChart
              );
              console.log("progressTracker", progressTracker);
            }
          } else if (x.habit.interval == 3) {
            interval = "d";
            progressTracker = this.findStreaks(x.habit.days, successChart);
            // every (x.habit.days) days
            // 1 - find first success:
            //  .........................................................
          } else {
            interval = "d";
            // to do: check for every week, month or so many or on specific days in the week

            for (var dayOfHabit = 0; dayOfHabit < habitDayCount; dayOfHabit++) {
              progressTracker.push(0);
            }
          }

          // NB:             progressTracker.push(daysHabitAchieved);

          // ---------------------------------------------------------------------------------------------------------------
        } else {
          progressTracker = [];
          interval = "d";
        }
      }
      if (typeof calendar === "undefined") {
        calendar = [];
      }
      if (!calendar.hasOwnProperty(index)) {
        calendar[index] = {};
      }
      calendar[index]["progress"] = progressTracker;
      calendar[index].interval = interval;
      //
      // ###########################################################################
      //
      index++;
    } // end loop (through all the habits)

    console.log("Structured Calendar: ");
    console.log(calendar);

    return calendar;
  } // END: structureCalendar()
  //
  // ###########################################################################
  //

  daysBoolToInt(days) {
    var intReturn = [];
    for (var i in days) {
      if (days[i]) intReturn.push(i);
    }
    return intReturn;
  }

  findStreaks(gapMax, successChart) {
    // takes in an array of boolean and returns an array of ints
    var returnArray = Array(successChart.length);
    var lastSuccess = -1;
    var streakCount = 0;

    for (let i = 0; i < successChart.length; i++) {
      if (successChart[i] === true) {
        //console.log('i:', i);
        if (lastSuccess === -1 || i - lastSuccess > gapMax) {
          if (lastSuccess === -1) {
            returnArray[i] = 0;
          }
          //  console.log('lastSuccess', lastSuccess, '(i-lastSuccess):', (i - lastSuccess), 'gapMax:', gapMax);
          //  console.log('blank from ' + (lastSuccess + 1) + ' to ' + (i - 1));
          for (let ii = lastSuccess + 1; ii < i; ii++) {
            returnArray[ii] = 0;
          }
          lastSuccess = i;
          streakCount = 1;
        } else {
          //  console.log('streak from ' + lastSuccess + ' to ' + (i - 1));
          //  console.log('streakCount', streakCount);
          var thisStreak = streakCount;
          for (let ii = lastSuccess; ii <= i; ii++) {
            returnArray[ii] = thisStreak;
            thisStreak++;
          }
          lastSuccess = i;
          streakCount = thisStreak - 1;
        }
      }
    } // for loop
    if (streakCount > 1) var addOne = 1;
    else addOne = 0;
    for (let ii = lastSuccess + addOne; ii < successChart.length; ii++) {
      returnArray[ii] = 0;
    }

    return returnArray;
  } // END:  findStreaks()
  // ---------------------------------------------------------------------------------

  setDaysDone(thisWeek, successDays) {
    for (let i in successDays) {
      if (!thisWeek[successDays[i]]) return false;
    }
    return true;
  }

  findStreaksPerWeek(startDay, successDays, successToday) {
    // takes in an array of boolean and returns an array of ints

    var thisWeek = [false, false, false, false, false, false, false];
    var streakCount = 0;
    var thisWeekCount = 0;
    var particularDays;

    // work out # of weeks:
    var daysSpan = successToday.length + startDay;
    var weeksSpan = Math.ceil(daysSpan / 7);

    var returnArray = Array(weeksSpan);

    if (typeof successDays === "object") {
      // specific days in the week
      particularDays = true;
    } else {
      particularDays = false; // so many days in the week
    }

    var weekNumber = 0;
    var thisDay = startDay;

    for (let i = 0; i < successToday.length; i++) {
      if (successToday[i] === true) {
        if (!particularDays) {
          thisWeekCount++;
        } else {
          thisWeek[thisDay] = true;
        }
      }
      if (thisDay === 6 || i === successToday.length - 1) {
        // look through the week for success:
        // ON SATURDAY, or last day of habit... checking out week:');
        if (particularDays) {
          if (this.setDaysDone(thisWeek, successDays)) {
            // success this week!
            streakCount++;
          } else {
            streakCount = 0;
          }
          thisWeek = [false, false, false, false, false, false, false];
        } else {
          if (thisWeekCount >= successDays) {
            // success this week!
            streakCount++;
          } else {
            streakCount = 0;
          }

          thisWeekCount = 0;
        }
        returnArray[weekNumber] = streakCount;
        weekNumber++;
      }
      thisDay = (thisDay + 1) % 7; // keep the day from 0 - 6
    } // for loop

    return returnArray;
  } // END: findStreaksPerWeek()

  monthDays(month, year) {
    // NB: ( month = 0-11 )

    var maxDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (month != 1) return maxDays[month];
    else {
      if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)
        return maxDays[1] + 1;
      else return maxDays[1];
    }
  } // maxDays()

  findStreaksPerMonth(dayIn, monthIn, yearIn, successDays, successToday) {
    // takes in an array of boolean and returns an array of ints

    var day = parseInt(dayIn);
    var month = parseInt(monthIn) - 1; // NB: month from 0 - 11
    var year = parseInt(yearIn);

    var lastSuccess = -1;
    var thisWeek = [false, false, false, false, false, false, false];
    var streakCount = 0;
    var thisMonthCount = 0;

    var thisMonthLength = this.monthDays(month, year);

    // work out # of months:
    var tempDaysLeft = successToday.length;
    var daysLeftInThisMonth = thisMonthLength - day + 1;
    var monthsSpan = 0;
    var tempMonth = month;
    var tempYear = year;
    while (tempDaysLeft > 0) {
      tempDaysLeft -= daysLeftInThisMonth;
      tempMonth++;
      if (tempMonth > 11) {
        tempMonth = 0;
        tempYear++;
      }
      daysLeftInThisMonth = this.monthDays(tempMonth, tempYear);
      monthsSpan++;
    }

    var returnArray = Array(monthsSpan);

    thisMonthLength = this.monthDays(month, year);
    var monthNumber = 0;
    var streakCount = 0;
    var thisMonthCount = 0;

    for (let i = 0; i < successToday.length; i++) {
      if (successToday[i] == true) thisMonthCount++;
      if (day === thisMonthLength || i === successToday.length - 1) {
        // look through the month for success:
        // ON LAST DAY OF MONTH, or last day of habit... checking out month:');

        if (thisMonthCount >= successDays) {
          // success this week!
          streakCount++;
        } else {
          streakCount = 0;
        }
        thisMonthCount = 0;
        returnArray[monthNumber] = streakCount;
        monthNumber++;
      }

      day++;
      if (day > thisMonthLength) {
        day = 1;
        month++;
        if (month > 11) {
          month = 0;
          year++;
        }
        thisMonthLength = this.monthDays(month, year);
      }
    } // for loop

    return returnArray;
  } // END:  findStreaksPerMonth()

  // ---------------------------------------------------------------------------------

  getNextDay(date) {
    var nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay;
  }

  calendarDate(calendar, day_, month_, year, habitIndex) {
    // checks to see if there is a record for this calendar date
    const day = day_.toString().padStart(2, "0");
    const month = month_.toString().padStart(2, "0");
    //console.log('CALEMDAR: ', day, month, year);
    try {
      var habit = habitIndex; //this.props.habitList[habitIndex].habit.description;
      if (
        typeof calendar !== "undefined" &&
        calendar.hasOwnProperty(habitIndex) &&
        calendar[habitIndex].hasOwnProperty(year) &&
        calendar[habitIndex][year].hasOwnProperty(month) &&
        calendar[habitIndex][year][month].hasOwnProperty(day)
      ) {
        this.cLog(
          "FOUND : " + habitIndex + " " + day_ + " " + month + " " + year,
          "g"
        );
        console.log(calendar[habitIndex][year][month][day]);
        return calendar[habitIndex][year][month][day];
      } else {
        // console.log("NULL");
        return null;
      }
    } catch {
      var habit = "";
      console.log("CALENDAR DAY - #############; check calendarDate function");
      return null;
    }
  } // calendarDate()

  // -------------------------------------------------------------------------

  daysBetween(startDate, endDate) {
    const date1 = new Date(startDate);
    const date2 = new Date(endDate);
    return Math.round((date2 - date1) / 86400000);
  } // END: daysBetween()

  callbackEditRecord = (index) => {
    //console.log(data);

    //var habitVar = this.state.habitList[index];
    var curHabit = this.state.data_habits[index];
    var cur_id = this.state.data_habits[index].id;
    console.log("CB_ER: '" + index + "' ; " + cur_id);

    this.setState({
      habitForm: curHabit.habit,
      editingGrade: true,
      curPage: 2,
      curHabit: index,
      id: cur_id
    });
    console.log(
      "habit selected '" +
        index +
        "' ->" +
        this.state.data_habits[index].habit.description
    );
  }; // callback - EDIT record

  callbackVerifyDeleteRecord = (index) => {
    var cur_id = this.state.data_habits[index].id;
    this.setState({ index: index, id: cur_id, curPage: 4 });
  };

  goDelete() {
    const db = Firebase.firestore();
    db.collection(this.state.userId)
      .doc("data")
      .collection("habits")
      .doc(this.state.id)
      .delete();
  }

  callbackDeleteRecord = (index, id) => {
    if (index === -1) {
      console.log("CANCEL DELETE:");
      this.setState({ curPage: 1 });
    } else {
      console.log("DELETE: " + index + " - " + id);
      this.goDelete();
      this.setState({ curPage: 1 });
    }
  };

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

  go_menu = (value) => {
    if (value === 2) {
      this.setState({
        habitForm: { description: "", duration: "", frequency: "" },
        id: "",
        curPage: 2
      });
    } else this.setState({ curPage: value });
  };

  goMenu(event) {
    var value = parseInt(event.target.id, 10);
    this.go_menu(value);
  }

  setData(habitList) {
    this.setState({ habitList: habitList });
  }

  cLog(message, color) {
    color = color || "black";

    switch (color) {
      case "g":
        color = "Green";
        break;
      case "b":
        color = "DodgerBlue";
        break;
      case "r":
        color = "Red";
        break;
      case "o":
        color = "Orange";
        break;
      default:
        color = color;
    }
    if (color == "black") {
      var fgCol = "black";
    } else {
      var fgCol = "white";
    }
    console.log(
      "%c" + " " + message + " ",
      "background-color:" + color + "; color:" + fgCol
    );
  } // END: clog()

  render() {
    return (
      <div className="RefreshPage">
        <NavBar/>
        <h3>&nbsp;</h3>
      <h1>Welcome!</h1> 
        <div className="spacer">
        </div>
        {this.state.curPage !== 1 && (
        <div class="habitslist-btns"> 
          <div class="myhabits-btn"> 
            <span>
              <button class="btn btn-light" id="1" onClick={this.goMenu}>
                My Habits
              </button>
            </span>
          </div>
      </div>  
        )}
        {this.state.curPage !== 5 && (
      <div class="habitslist-btns">  
         <div class="calendar-btn"> 
           <span>
             <button class="btn btn-light" id="5" onClick={this.goMenu}>
             <img src="icons/calendar3.svg" alt="calendar-icon"/> &nbsp;CALENDAR
             </button>
           </span>
         </div>   {/* end of calnedar-btn  */}
     </div>
        )}
     <div class="habitslist-btns">  
          <div class="logout"> 
          <span>
            <button class="btn btn-light" id="2" onClick={this.props.logOut}>
              LOG OUT
            </button>
          </span>
        </div> {/* end of logout  */}
      </div>   

        {this.state.curPage === 1 && !this.state.calendarEmpty && (
          <HabitList
            habitList={this.state.data_habits}
            setData={this.setData}
            userId={this.state.userId}
            callbackEditRecord={this.callbackEditRecord}
            callbackVerifyDeleteRecord={this.callbackVerifyDeleteRecord}
            goMenu={this.goMenu}
            calendar={this.state.data_calendar}
            curHabitIndex={this.state.curHabitIndex}
          />
        )}
        <span class="tiny">UID:'{this.state.userId}'</span>
        {this.state.curPage === 2 && (
          <HabitForm
            habitForm={this.state.habitForm}
            id={this.state.id}
            userId={this.state.userId}
            goMenu={this.go_menu}
          />
        )}
        {this.state.curPage === 4 && (
          <DeleteHabit
            id={this.state.id}
            callbackDeleteRecord={this.callbackDeleteRecord}
            index={this.state.index}
          />
        )}
        {this.state.curPage === 5 && (
          <DynamicCalendar
            id={this.state.id}
            callbackDeleteRecord={this.callbackDeleteRecord}
            index={this.state.index}
            userId={this.state.userId}
            habitList={this.state.data_habits}
            calendar={this.state.data_calendar}
          />
        )}
      </div>
    );
  } // return if logged in
} // APP COMPONENT

//************************************//

export default AppGo;
