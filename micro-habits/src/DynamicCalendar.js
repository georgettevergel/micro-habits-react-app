import React, { Component } from "react";
import Firebase from "firebase";
const months = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEPT",
  "OCT",
  "NOV",
  "DEC"
];
const days = ["SUN", "MON", "TUE", "WED", "THR", "FRI", "SAT"];
const maxDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var randomActivities = ["Walk", "Piano", "Gym", "Exercise"];

class DynamicCalendar extends Component {
  constructor(props) {
    super(props);
    var date = new Date();
    var selectedMonth = date.getMonth();
    var selectedYear = date.getFullYear();
    var selectedDay = date.getDate();
    console.log("DAY:" + date.getDay());
    //    var firstDay = this.getDayOfMonth(selectedMonth, selectedYear); //(selectedDay - d.getDay() + 1) % 7;
    let hList = [];
    this.props.habitList.map((item, index) => {
      hList.push(item.habit.description);
    });
    if (this.props.habitList.length > 0) {
      var curHabit = this.props.habitList[0].habit.description;
    } else {
      var curHabit = "";
    }
    //    console.log("HLIST: " + JSON.stringify(this.props.habitList[0].habit.description));
    this.state = {
      curCal: 1,
      temp: 1,
      selectedMonth: selectedMonth,
      selectedYear: selectedYear,
      showEditDateBox: false,
      curHabit: curHabit,
      editDate: {
        day: 0,
        month: 0,
        year: 0,
        habitID: "",
        value: 0,
        note: "",
        filled: false
      },
      curQty: 10,
      hList: hList,
      currentHabitIndex: 0,
      editDateBox: { x1: 0, y1: 0, x2: 0, y2: 0 }
    };
    this.goCalMonth = this.goCalMonth.bind(this);
    this.updateInputBox = this.updateInputBox.bind(this);
    this.updateHabitListDropdown = this.updateHabitListDropdown.bind(this);
  }

  sendDataToDatabase(day, month, year, habitIndex, value, note) {
    console.log("SEND_DATA TO FIREBASE: ");

    // I don't think we need a timestamp:
    //let timestamp = new Date().toUTCString();

    if (typeof note == "undefined") var note = "";

    console.log(
      "sendDataToDatabase: ",
      day,
      month,
      year,
      habitIndex,
      value,
      note
    );

    console.log("habit: ", this.props.habitList, habitIndex);

    var habitID = this.props.habitList[habitIndex].habit.description;
    var habitID_long = this.props.habitList[habitIndex].id;

    if (typeof note === "undefined") {
      note = "";
    }
    value = parseInt(value);

    let calendarDate = {
      value: value,
      note: note
    };

    console.log(
      "calendarDate",
      calendarDate,
      habitID,
      this.documentName(day, month, year, habitID)
    );

    // this.cLog(this.documentName_(day, month, year, habitID_long), "o");

    const db = Firebase.firestore();

    db.collection(this.props.userId)
      .doc("data")
      .collection("calendar")
      .doc(this.documentName(day, month, year, habitID_long))
      .set(calendarDate);
  } // END:   sendDataToDatabase()

  getDayOfMonth(month, year) {
    // gets the first day of the month:

    let firstDay = new Date(year, month, 1).getDay();
    this.cLog(firstDay + " " + days[firstDay], "b");
    return firstDay;
  }
  // ---------------------------------------------------------------------------------
  documentName_old(day, month, year, habit) {
    //TO-DO: Delete this
    return (
      year +
      "-" +
      month.toString().padStart(2, "0") +
      "-" +
      day.toString().padStart(2, "0") +
      "-" +
      habit
    );
  } // documentName()
  // ---------------------------------------------------------------------------------
  documentName(day, month, year, habit) {
    return (
      year.toString() +
      month.toString().padStart(2, "0") +
      day.toString().padStart(2, "0") +
      habit
    );
  } // documentName()

  goDeleteHabit(day, month, year, habit) {
    //    console.log('delete habit', day,month,year,habit);

    const db = Firebase.firestore();
    db.collection(this.props.userId)
      .doc("data")
      .collection("calendar")
      .doc(this.documentName(day, month, year, habit))
      .delete();
  }

  goDelSel() {
    console.clear();
    const habitToDelete = this.props.habitList[this.state.currentHabitIndex].id;
    console.log("DELETE: ", habitToDelete);

    if (this.state.curSelectedHabit !== null) {
      this.goDeleteHabit(
        this.state.editDate.day,
        this.state.editDate.month,
        this.state.editDate.year,
        habitToDelete
      );
    }
    this.showHideEditDate(false);
  }

  /*
  dayOfWeek(day, month, year) {
    month--;
    var x = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
    year -= month < 3;
    var r = Math.floor(
      (year + year / 4 - year / 100 + year / 400 + x[month - 1] + day) % 7
    );
    r++;
    if (r > 6) r = 0;
    return r;
  }*/

  goCalMonth = () => {
    var selectedYear = 1;
    var selectedMonth = 1;
    //   console.log('Month: '+selectedMonth + '; Year: '+selectedYear);
    console.log("click");
  };

  calendarDate(day_, month_, year, habitIndex) {
    // checks to see if there is a record for this calendar date
    const day = day_.toString().padStart(2, "0");
    const month = month_.toString().padStart(2, "0");
    //console.log('CALEMDAR: ', day, month, year);
    const calendar = this.props.calendar;
    try {
      var habit = habitIndex; //this.props.habitList[habitIndex].habit.description;
    } catch {
      var habit = "";
      console.log("#############; check calendarDate function");
    }

    if (
      calendar.hasOwnProperty(habitIndex) &&
      calendar[habitIndex].hasOwnProperty(year) &&
      calendar[habitIndex][year].hasOwnProperty(month) &&
      calendar[habitIndex][year][month].hasOwnProperty(day)
    ) {
      this.cLog(
        "FOUND : " + habitIndex + " " + day_ + " " + month + " " + year,
        "g"
      );
      return calendar[habitIndex][year][month][day];
    } else {
      return null;
    }
  } // calendarDate()

  updateCalendarEntry() {
    var editDate = this.state.editDate;

    // update calendar object:
    console.log(
      "updateCalendarEntry: this.state.currentHabitIndex",
      this.state.currentHabitIndex
    );

    /*    this.updateCalendarObject(
      editDate.day,
      editDate.month,
      editDate.year,
      this.state.currentHabitIndex,
      editDate.value,
      editDate.note
    );
*/
    // #2 - send to database:

    console.log(" this.props.habitList", this.props.habitList);
    console.log("this.state.currentHabitIndex", this.state.currentHabitIndex);

    this.sendDataToDatabase(
      editDate.day,
      editDate.month,
      editDate.year,
      this.state.currentHabitIndex,
      editDate.value,
      editDate.note
    );

    this.showHideEditDate(false);
  } // END:   updateCalendarEntry()

  updateCalendarObject(day, month, year, habitIndex, value, note) {
    console.log("habitIndex", habitIndex);
    const habit = this.props.habitList[habitIndex].habit.description;
    console.log("updateCalendarObject, habit: ", habit);
    const calendar = this.props.calendar;
    if (!calendar.hasOwnProperty(habit)) {
      // habit name
      calendar[habit] = {};
    }
    if (!calendar[habit].hasOwnProperty(year)) {
      // year
      calendar[habit][year] = {};
    }
    if (!calendar[habit][year].hasOwnProperty(month)) {
      // month
      calendar[habit][year][month] = {};
    }

    calendar[habit][year][month][day] = { value: value, note: note };

    this.props.calendar = calendar;
    // TO-DO: do we need to setState in parent app ?
  } // updateCalendarObject()

  clickOnDay(day, month, year) {
    const habitIndex = this.state.currentHabitIndex;
    console.log("Clicked on Calendar: ", day, month, year, habitIndex);

    console.log("currentHabitIndex", this.state.currentHabitIndex);
    console.log("currentHabitIndex", this.props.habitList);

    var pickedDate = this.calendarDate(
      day,
      month,
      year,
      this.state.currentHabitIndex
    );

    console.log("pickedDate", pickedDate);

    if (pickedDate != null) {
      var dateFilled = true;
      var editDate = {
        day: day,
        month: month,
        year: year,
        value: pickedDate.value,
        note: pickedDate.note
      };
    } else {
      var dateFilled = false;
      var editDate = {
        day: day,
        month: month,
        year: year,
        value: 0,
        note: ""
      };
      console.log("NEW");
    }

    console.log(day + " " + month + " " + year);

    console.log("picked date ", pickedDate);

    this.setState({
      editDate: {
        day: day,
        month: month,
        year: year,
        habitID: habitIndex,
        value: editDate.value,
        note: editDate.note,
        filled: dateFilled
      }
    });
    this.showHideEditDate(true);
  } // END: clickOnDay()

  goMonth(dif) {
    var selectedMonth = this.state.selectedMonth;
    var selectedYear = this.state.selectedYear;

    selectedMonth += dif;
    if (selectedMonth < 0) {
      selectedMonth = 11;
      selectedYear--;
    }
    if (selectedMonth > 11) {
      selectedMonth = 0;
      selectedYear++;
    }

    this.setState({
      selectedMonth: selectedMonth,
      selectedYear: selectedYear
    });
  }

  checkMaxdays(selectedMonth, selectedYear) {
    var days = maxDays[selectedMonth];
    if (
      selectedMonth === 1 &&
      ((selectedYear % 4 == 0 && selectedYear % 100 != 0) ||
        selectedYear % 400 == 0)
    )
      days++;
    return days;
  }

  //
  // ############################################################# START: printDate()
  //
  printDate(
    day,
    month,
    year,
    inTheFuture,
    progress,
    interval,
    habitDaysFromThis
  ) {
    var style, isStart, isEnd, note, dayDIV, streakDIV;
    var addStreak = false;
    var dateEntry = this.calendarDate(
      day,
      month,
      year,
      this.state.currentHabitIndex
    );
    this.cLog("inTheFuture:" + inTheFuture + " : progress " + progress, "b");
    if (!inTheFuture && progress > 0 && habitDaysFromThis >= 0) {
      //TO-DO probably won't need !inTheFuture
      style = "calendarDay";
      addStreak = true;
      if (interval === "d") {
        streakDIV = (
          <div class="streakWrapper">
            <div class="streak">Streak - Day: {progress}</div>
          </div>
        );
      } else if (interval === "w") {
        this.cLog("WEEK STREAK " + day + month, "b");
        streakDIV = (
          <div class="streakWrapper">
            <div class="streak">Streak - Week: {progress}</div>
          </div>
        );
      } else {
        this.cLog("MONTH STREAK " + day + month, "b");
        streakDIV = (
          <div class="streakWrapper">
            <div class="streak">Streak - Month: {progress}</div>
          </div>
        );
      }
    } else {
      style = "calendarDay";
      streakDIV = "";
    }

    if (dateEntry == null) {
      note = "";
      if (inTheFuture) {
        style = "calendarAfter";
        isStart = false;
        isEnd = false;
      } else {
        isStart = false;
        isEnd = false;
      }
    } else {
      isStart = dateEntry.hasOwnProperty("isStart");
      isEnd = dateEntry.hasOwnProperty("isEnd");
      const currentHabitIndex = this.state.currentHabitIndex;
      const a = dateEntry.value;
      const b = this.props.habitList[currentHabitIndex].habit.times;
      const c = this.props.habitList[currentHabitIndex].habit.comparison;
      //      console.log("b", this.props.habitList[currentHabitIndex].habit);

      note = this.showTextSummary(dateEntry.note, 50);

      if (inTheFuture) {
        style = "calendarAfter";
      } else {
        if (
          (c == "=" && a == b) ||
          (c == "<" && a < b) ||
          (c == ">" && a > b)
        ) {
          style += "Good";
        } else {
          style += "NotSoGood";
        }
      }
      //console.log(style + " " + a + " " + c + " " + b);
    }

    var dayOfMonth = "";

    dayOfMonth += day;
    if (day === 1) {
      dayOfMonth += " " + months[month];
    }
    if (isStart) {
      style += "_start";
    } else if (isEnd) {
      style += "_end";
    } else if (addStreak) {
      style += "Streak";
    }
    //console.log('sytle - calendar: ', style);
    if (day == 1) {
      if (inTheFuture) {
        dayDIV = "dynamicCalendarMonthDay1Future";
        //{ background: "gray", color: "white" };
      } else {
        dayDIV = "dynamicCalendarMonthDay1";
        //        var dayDIV = { background: "black", color: "white" };
      }
    } else {
      dayDIV = {};
    }

    return (
      <td
        class={style}
        onClick={() => {
          this.clickOnDay(day, month, year);
        }}
      >
        <div class={dayDIV}>{dayOfMonth}</div>
        <div style={{ height: "100%" }}>{note}</div>
        {streakDIV}
      </td>
    );
  } // printDate()

  //
  // ############################################################# END: printDate()
  //

  showTextSummary(text, maxLen) {
    console.log("TEXT: ", text);
    // only want to see first 50 chars
    // when we are list it
    if (text === undefined) return "";

    if (text.length <= maxLen) {
      return text;
    } else {
      return text.substring(0, maxLen) + "...";
    }
  }

  daysBetween(startDate, endDate) {
    const date1 = new Date(startDate);
    const date2 = new Date(endDate);
    return Math.round((date2 - date1) / 86400000);
  } // END: daysBetween()

  compareDate(day1, month1, year1, day2, month2, year2) {
    /*  this.cLog(
      day1 +
        "-" +
        month1 +
        "-" +
        year1 +
        " vs " +
        day2 +
        "-" +
        month2 +
        "-" +
        year2,
      "r"
    );*/
    // before=-1 on=0 after=1
    if (year1 < year2) return -1;
    else if (year1 > year2) return 1;
    else if (month1 < month2)
      // year is same
      return -1;
    else if (month1 > month2) return 1;
    else if (day1 < day2)
      // year is same
      return -1;
    else if (month1 > month2) return 1;
    else return 0;
  } // END:  compareDate()

  //
  // ############################## PRINT CALENDAR ######################################
  //

  monthDifference(month1, year1, month2, year2) {
    return month2 - month1 + (year2 - year1) * 12;
  }

  printCalendar() {
    var tracker;
    let todaysDate = new Date();
    let day = todaysDate.getDate();
    //    if (day < 10) day = '0' + day;
    let month = todaysDate.getMonth();
    //    if (month < 10) month = '0' + day;
    let year = todaysDate.getFullYear();

    console.log(
      year + "-" + month + "-" + day
      //      `${year}${'-'}${month < 10 ? `0${month}` : `${month}`}${'-'}${
      //        date < 10 ? `0${date}` : `${date}`
      //      }`
    );

    var calendarHTML = [];
    //    console.log("FIRSTDAY: " + this.state.firstDay);

    var calendarMonth = this.state.selectedMonth;
    var calendarYear = this.state.selectedYear;
    // this returns the first day of the month 0-6 ; 0=SUNDAY
    // TO-DO: Make this function more refined
    var firstDay = this.getDayOfMonth(calendarMonth, calendarYear);
    var currentDay = 1 - firstDay; //-this.state.firstDay;
    var maxDays;

    this.cLog("WORKOUT DAY: " + currentDay, "r");
    if (currentDay < 1) {
      // We need to show some day of the previous month
      calendarMonth--;
      if (calendarMonth < 0) {
        // we need to show some days of the previous year
        calendarMonth = 11;
        calendarYear--;
      }
      maxDays = this.checkMaxdays(calendarMonth, calendarYear);
      currentDay = maxDays + 1 - firstDay; // - currentDay + 1;
    } else {
      maxDays = this.checkMaxdays(calendarMonth, calendarYear);
    }

    var numberOfRows = 6; // TO-DO: work out if the we need 5 cols or 6
    console.log(
      "PRINT-CALENDAR, starting: ",
      currentDay,
      calendarMonth,
      calendarYear
    );

    var calendarStartDay =
      calendarYear + "-" + (calendarMonth + 1) + "-" + currentDay;
    var daysFromToday = this.daysBetween(
      year + "-" + (month + 1) + "-" + day,
      calendarStartDay
    );
    this.cLog("days from today: " + daysFromToday, "r");
    var habitIndex = this.state.currentHabitIndex;
    this.cLog("habitIndex: " + habitIndex, "o");
    console.log("this.props.habitList", this.props.habitList);
    try {
      // var habit = this.props.habitList[habitIndex].id;
      var habitStartDate = this.props.habitList[habitIndex].habit.startDate;
      var habitEndDate = this.props.habitList[habitIndex].habit.endDate;
      console.log("Habit start date: " + habitStartDate);
      console.log("Habit end date: " + habitEndDate);
      var habitLength = this.daysBetween(habitStartDate, habitEndDate) + 1; // N.B. : (+1) i.e., INCLUSIVE OF THS START AND END DATE
      //TO-DO: some of this can be saved in the structureCalendar method in AppGo

      var habitDaysFromThis = this.daysBetween(
        habitStartDate,
        calendarStartDay
      );
      console.log(
        "habitStartDate",
        habitStartDate,
        "calendarStartDay",
        calendarStartDay,
        "habitDaysFromThis",
        habitDaysFromThis
      );

      this.cLog("INTERVAL: ", "r");
      var startDate = new Date(habitStartDate);
      var habitStartMonth = startDate.getMonth();
      var habitStartYear = startDate.getFullYear();

      // -------------------------------------------------------
      // calculate the months difference:
      this.cLog("T: " + calendarYear + "-" + calendarMonth, "b");
      this.cLog(
        "habitStartMonth: " +
          habitStartMonth +
          "; habitStartYear: " +
          habitStartYear,
        "b"
      );
      var monthFromHabit = this.monthDifference(
        habitStartMonth,
        habitStartYear,
        calendarMonth,
        calendarYear
      );
      console.log("Month Difference: " + monthFromHabit);

      // -------------------------------------------------------

      var startDay = startDate.getDay();
      var weeksSpan = Math.ceil((habitLength + startDay) / 7);
      var weeksFromHabitStart = Math.ceil((habitDaysFromThis + startDay) / 7);
      console.log("calendarStartDay", calendarStartDay);

      console.log(this.props.calendar[habitIndex].interval);
      var interval = this.props.calendar[habitIndex].interval;
      console.log("weeksSpan", weeksSpan);
      console.log("habitLength", habitLength);
      console.log("habitDaysFromThis", habitDaysFromThis);
      console.log("plus startDay", startDay);
      this.cLog("weeksFromHabitStart: " + weeksFromHabitStart, "r");
      if (weeksFromHabitStart >= 0 && weeksFromHabitStart < weeksSpan) {
        this.cLog("IN HABIT WEEK!", "g");
      } else {
        this.cLog("not in habit week", "r");
      }

      //   this.cLog("HABIT LENGTH: " + habitLength, "b");
      //    this.cLog("days from this: " + habitDaysFromThis, "b");
      // ------------------------------------------------------------

      // ------------------------------------------------------------
    } catch {
      // var habit = 0;
      console.log("#############; check printCalendar function");
    }

    // print the weeks:
    for (var weeks = 0; weeks < numberOfRows; weeks++) {
      var p = [];
      if (interval == "w") {
        if (weeksFromHabitStart >= 0 && weeksFromHabitStart < weeksSpan) {
          console.log(
            ":",
            this.props.calendar[habitIndex].progress[weeksFromHabitStart],
            "weeksFromHabitStart",
            weeksFromHabitStart
          );
          tracker = this.props.calendar[habitIndex].progress[
            weeksFromHabitStart
          ];
          this.cLog("IN HABIT WEEK!", "g");
        } else {
          tracker = -1;
          this.cLog("not in habit week", "r");
        }
      }
      // print the days of the week:

      for (var dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        // ------------------------------------------------------------
        // HERE: CHECK IF BY MONTHS DAY
        if (interval == "d") {
          if (habitDaysFromThis >= 0 && habitDaysFromThis < habitLength) {
            //     console.log("habit", habitIndex);
            // console.log(
            //   "DAY",
            //   dayOfWeek,
            //   "habitDaysFromThis",
            //   habitDaysFromThis,
            //   "Date:",
            //   currentDay,
            //   calendarMonth
            // );
            tracker = this.props.calendar[habitIndex].progress[
              habitDaysFromThis
            ];
            this.cLog("IN HABIT " + habitDaysFromThis, "o");
            console.log(
              currentDay + "/" + calendarMonth + "/" + calendarYear,
              tracker + " - " + daysFromToday
            );
          } else {
            tracker = -1;
            //   this.cLog("NOT IN HABIT " + habitDaysFromThis, "r");
            console.log(
              currentDay +
                "/" +
                calendarMonth +
                "/" +
                calendarYear +
                " - " +
                daysFromToday
            );
          }
        } else if (interval == "m") {
          //
          if (monthFromHabit >= 0 && monthFromHabit < habitLength) {
            tracker = this.props.calendar[habitIndex].progress[monthFromHabit];
            this.cLog("IN HABIT " + monthFromHabit, "o");
          } else {
            tracker = -1;
          }
        }

        // ------------------------------------------------------------

        p.push(
          this.printDate(
            currentDay,
            calendarMonth,
            calendarYear,
            daysFromToday > 0,
            tracker,
            interval,
            habitDaysFromThis
          )
        );
        currentDay++;
        if (currentDay > maxDays) {
          calendarMonth++;
          monthFromHabit++;
          if (calendarMonth > 11) {
            calendarMonth = 0;
            calendarYear++;
          }
          maxDays = this.checkMaxdays(calendarMonth, calendarYear);
          currentDay = 1;
        }
        daysFromToday++;
        habitDaysFromThis++;
      } // END: loop (week) // ################################# END loop: day
      const dayType = "calendarDayGood";
      var week = "calendarWeek";
      weeksFromHabitStart++;
      calendarHTML.push(<tr>{p}</tr>);
    } // END: loop (week) // ################################# END loop: week
    return calendarHTML;
  } // END: printCalendar()
  //
  // ####################################### END: printCalendar()
  //
  // --------------------------------------------------------------------------------------------------------------------------  //

  //---------------------------------------------------------------------------------------------------------------------------
  allowDrag() {
    const editDateBox = { x1: 0, y1: 0, x2: 0, y2: 0 };
    this.setState({ editDateBox: editDateBox });
  }

  showHideEditDate(showEditDateBox) {
    this.setState({ showEditDateBox: showEditDateBox });
    if (showEditDateBox) {
      //      this.allowDrag();
      //      this.setState({ editDateBox: editDateBox });
      console.log("Edit Date Box Open");
    } else {
      console.log("Edit Date Box Closed");
    }
  }

  updateInputBox(event) {
    const curVal = event.target.value;
    console.log("updateInputBox", event.target);

    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    //    const name = target.name.split('.');

    const editDate = this.state.editDate;
    editDate.note = value;

    this.setState({
      editDate: editDate
    });
  }

  updateHabitListDropdown(event) {
    //    console.log("UTB: " + event.target.name);
    //    console.log("UTB: " + event.target.value);
    //    const target = event.target;

    const curHabit = this.state.curHabit;
    const newHabitVal = event.target.value;
    const curVal = event.target.value;
    const newHabit = this.props.habitList[curVal].habit.description;
    console.log("| " + newHabit);
    console.log("KEY: " + curVal);

    // duck
    if (newHabit !== curHabit) {
      this.setState({
        currentHabitIndex: curVal,
        curHabit: newHabit
      });
    }
    console.log("UPDATE_HABIT:" + newHabit);
  } // END:  updateHabitListDropdown()

  habitValueChange(dif) {
    let editDate = this.state.editDate;
    editDate.value += dif;
    if (editDate.value < 0) editDate.value = 0;
    this.setState({ editDate: editDate });
  }

  // =================================================

  dragMouseDown(event) {
    event = event || window.event;
    event.preventDefault();
    x2 = event.clientX;
    y2 = event.clientY;

    //    return this.editDateBox;
    document.onmouseup = stopDrag;
    document.onmousemove = startDrag;
  }

  startDrag(event) {
    event = event || window.event;
    event.preventDefault();
    x1 = x2 - event.clientX;
    y1 = y2 - event.clientY;
    x2 = event.clientX;
    y2 = event.clientY;
    element.style.top = element.offsetTop - y1 + "px";
    element.style.left = element.offsetLeft - x1 + "px";
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
    function gx(thisMonth, thisyear) {
      console.log(thisMonth, thisyear);
    }

    let habitDropDown = this.props.habitList.map((item, i) => {
      return (
        <option key={i} value={i}>
          {item.habit.description}
        </option>
      );
    });

    return (
      <div className="CalendarPage">
        {this.state.showEditDateBox && (
          <div id="editDateBox" class="editDateInCalendar">
            <div id="editDateBox_" style={{ padding: "10px" }}>
              <span style={{ float: "right" }}></span>
              <button
                class="btn btn-secondary btn-sm"
                onClick={() => this.showHideEditDate(false)}
              >
                x
              </button>
              {this.state.editDate.dateFilled == true ? (
                <div class="topBar"> NEW HABIT ENTRY</div>
              ) : (
                <div class="topBar">
                  <b>
                    {this.state.editDate.day +
                      " / " +
                      (this.state.editDate.month + 1) +
                      " / " +
                      this.state.editDate.year}
                  </b>{" "}
                  - Enter your habit progress:{" "}
                </div>
              )}

              <div></div>
              <div>
                <div class="">
                  <table style={{ width: "100%" }}>
                    <tbody>
                      <tr>
                        <td>
                          <span class="padDiv">
                            <b>success: </b>&nbsp;
                            {this.props.habitList[this.state.currentHabitIndex]
                              .habit.comparison == "=" && "equal to"}
                            {this.props.habitList[this.state.currentHabitIndex]
                              .habit.comparison == "<" && "less than"}
                            {this.props.habitList[this.state.currentHabitIndex]
                              .habit.comparison == ">" && "more than"}
                            &nbsp;
                            {
                              this.props.habitList[this.state.currentHabitIndex]
                                .habit.times
                            }
                            &nbsp;
                            {
                              this.props.habitList[this.state.currentHabitIndex]
                                .habit.unit
                            }
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span style={{ padding: "20px" }}></span>
                          <span>
                            <button
                              class="btn btn-primary"
                              onClick={() => this.habitValueChange(-1)}
                            >
                              -
                            </button>
                            <span style={{ padding: "20px" }}>
                              {this.state.editDate.value}
                            </span>
                            <button
                              class="btn btn-primary"
                              onClick={() => this.habitValueChange(1)}
                            >
                              +
                            </button>
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="form-group blue-border-focus">
                            <textarea
                              class="Defaulttextarea"
                              style={{ width: "100%" }}
                              name="editDate.note"
                              id="editDate.note"
                              cols="auto"
                              rows="5"
                              placeholder="Enter a Note"
                              value={this.state.editDate.note}
                              onChange={this.updateInputBox}
                            ></textarea>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div></div>
              </div>

              <button
                class="btn btn-primary"
                onClick={() => this.updateCalendarEntry()}
              >
                Add
              </button>
              <button class="btn btn-primary" onClick={() => this.goDelSel()}>
                Delete
              </button>
            </div>
          </div>
        )}
        <div>
          <span style={{ padding: "10px" }}>
            <select
              name="curSelectedHabit.selectedHabit"
              id="hList"
              onChange={this.updateHabitListDropdown}
            >
              {habitDropDown}
            </select>
          </span>
          <span style={{ padding: "20px" }}></span>
          <span>
            <button
              class="btn btn-secondary"
              id="5"
              onClick={() => this.goMonth(-1)}
            >
              &#8592;
            </button>
          </span>
          <span style={{ padding: "20px" }}>
            {months[this.state.selectedMonth]} {this.state.selectedYear}
          </span>
          <span>
            <button
              class="btn btn-secondary"
              id="5"
              onClick={() => this.goMonth(1)}
            >
              &#8594;
            </button>
          </span>
          <span style={{ padding: "20px" }}></span>
        </div>
        <div class="calendarContainer">
          <table class="dynamicCalendar">
            <th>SUN</th>
            <th>MON</th>
            <th>TUE</th>
            <th>WED</th>
            <th>THR</th>
            <th>FRI</th>
            <th>SAT</th>

            {this.printCalendar()}
          </table>
        </div>
      </div>
    );
  }
} // HabitList COMPONENT
//************************************//
export default DynamicCalendar;
