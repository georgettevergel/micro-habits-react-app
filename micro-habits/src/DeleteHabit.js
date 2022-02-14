import React, { Component } from 'react';

class DeleteHabit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id
    };
    //    console.log("HAB-1: " + this.props.habitForm.description);
    //    console.log("HAB-2: " + this.state.habit.description);
    //    this.sendData = this.sendData.bind(this);
    this.goYesOrNO = this.goYesOrNO.bind(this);
  }

  goYesOrNO(event) {
    const yesOrNO = event.target.id;
    if (yesOrNO === '1') {
      this.props.callbackDeleteRecord(this.state.index, this.state.id);
    } else {
      this.props.callbackDeleteRecord(-1, -1);
    }
  }

  render() {
    return (
      <div className="RefreshPage">
        <div className="spacer" style={{ padding: '20px' }}>
          Are your sure you want to delete this habit? (ID {this.props.id})
          <div style={{ padding: '20px' }}>
            <span>
              <button class="btn btn-primary" id="1" onClick={this.goYesOrNO}>
                Yes
              </button>
            </span>
            <span>
              <button class="btn btn-primary" id="2" onClick={this.goYesOrNO}>
                No
              </button>
            </span>
          </div>
        </div>
      </div>
    );
  }
} // Delete COMPONENT
//************************************//
export default DeleteHabit;
