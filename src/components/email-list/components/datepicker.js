import React,  { Component } from "react";
import { Button } from "@material-ui/core";
import { DateRangePicker, isInclusivelyBeforeDay } from "react-dates";
import moment from "moment";

import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";

export default class Datepicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: null,
      endDate: null,
      focusedInput: null,
    }
  }

  filterByDate = (startDate, endDate) => {
    const { fetchEmails } = this.props;
    let filterDate = {
      startDate : moment(startDate).format('YYYY/MM/DD'),
      endDate : moment(endDate).format('YYYY/MM/DD')
    }
    if (filterDate.endDate < filterDate.startDate) {
      alert("End Date should be later than Start Date!");
      return false;
    }
    fetchEmails(filterDate);
  }

  returnYears = () => {
    let years = []
    for(let i = moment().year() - 100; i <= moment().year(); i++) {
      years.push(<option key={i} value={i}>{i}</option>);
    }
    return years;
  }

  renderMonthElement = ({ month, onMonthSelect, onYearSelect }) =>
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <div>
      <select className="select-date"
        value={month.month()}
        onChange={(e) => onMonthSelect(month, e.target.value)} >
        {moment.months().map((label, value) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </div>
    <div>
      <select className="select-date" value={month.year()} onChange={(e) => onYearSelect(month, e.target.value)}>
        {this.returnYears()}
      </select>
    </div>
  </div>

  render = () => {
    return (
      <div>
        <DateRangePicker
            startDate={this.state.startDate}
            startDateId="email_from"
            endDate={this.state.endDate}
            endDateId="email_to"
            onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })}
            focusedInput={this.state.focusedInput}
            onFocusChange={focusedInput => this.setState({ focusedInput })}
            isOutsideRange={day => !isInclusivelyBeforeDay(day, moment())}
            startDatePlaceholderText={moment().format('YYYY/MM/DD')}
            endDatePlaceholderText={moment().format('YYYY/MM/DD')}
            displayFormat="YYYY/M/D"
            customInputIcon={<img style={{width: "25px"}} alt="calendar"src={"files/icon_calender.svg"}/>}
            customArrowIcon={<span>-</span>}
            renderMonthElement={this.renderMonthElement} />
        <Button onClick={()=> this.filterByDate(this.state.startDate, this.state.endDate)} className="button search">
            <img style={{width:"20px"}} alt="search" src={"files/icon_search.svg"}/></Button>
      </div>
    );
  }
}