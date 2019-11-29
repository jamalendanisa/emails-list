import React,  { Component, lazy, Suspense } from "react";
import { connect } from "react-redux";
import { func } from "prop-types";
import { Button, CircularProgress } from "@material-ui/core";

import { getEmails } from "../../actions";
import Datatables from "./components/datatables";
import Datepicker from "./components/datepicker";
import "./email-list.css";

const EmailMobile = lazy(() => import("./components/email-mobile"));

class EmailList extends Component {

  componentDidMount = () => {
    const { fetchEmails } = this.props;
    let filterDate = {
        startDate : null,
        endDate : null
    }
    fetchEmails(filterDate);
  }

  filterByDate = (startDate, endDate) => {
    const { fetchEmails } = this.props;
    let filterDate = {
      startDate : startDate,
      endDate : endDate
    }
    if (filterDate.endDate < filterDate.startDate) {
      alert("End Date should be later than Start Date!");
      return false;
    }
    fetchEmails(filterDate);
  }

  render = () => {
    const { emails, pending, fetchEmails } = this.props;
    return (
      <div className="email-list-component">
        <div className="datepicker-component">
          <Datepicker fetchEmails={fetchEmails}/>
          <Button onClick={()=> this.filterByDate(null, null)} className="button clear">Clear</Button>     
        </div>
        {pending && <div>
            <div className="email-length">Results: 0 mail(s)</div>
            <div className="loader"><CircularProgress /></div>
        </div> }
        {(!pending && emails.length === 0) && <div>
            <div className="email-length">Results: 0 mail(s)</div>
            <img alt="dataempty" className="dataempty-img" src={'files/logo.png'} />
        </div> }
        <div className="email-table-component">     
          <Datatables emails={emails} pending={pending}/>
        </div>
        <div className="email-mobile-component">
          <Suspense fallback={<div className="loader"><CircularProgress /></div>}>
            <EmailMobile emails={emails}  pending={pending}/>
          </Suspense>
        </div>
      </div>
    );
  }
}

EmailList.propTypes = {
  fetchEmails: func.isRequired
};

export const mapStateToProps = ({ emails: { emails, pending, startDate, endDate } }) => ({
  emails,
  pending,
  startDate,
  endDate
});

export const mapDispatchToProps = (dispatch) => ({
  fetchEmails: (filterDate) => dispatch(getEmails.request(filterDate))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EmailList);