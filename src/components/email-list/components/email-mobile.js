import React,  { Component } from "react";
import LazyLoad, { forceCheck } from "react-lazyload";
import NotificationSystem from "react-notification-system";
import { LinearProgress } from "@material-ui/core";
import moment from "moment";

import "../email-list.css";

export default class EmailMobile extends Component {
  constructor(props) {
    super(props);
    this.notificationSystem = React.createRef();
    this.state = {
     sort : [{header: 'From', name: 'email_from', sortType: ''},
             {header: 'To', name: 'email_to', sortType: ''},
             {header: 'Subject', name: 'subject', sortType: ''},
             {header: 'Date', name: 'date', sortType: ''}]
    }
  } 

  openEmail = (data) => {
    const notification = this.notificationSystem.current;

    notification.addNotification({
      title: data.subject,
      children: (
        <div className="email-body-cont">
          <div>Date : {moment(data.date).format('YYYY/MM/DD H:MM')}</div>
          <div>From : {data.email_from}</div>
          <div>To : {data.email_to}</div>
          <div className="email-body-body">{data.body}</div>
          {data.attachment &&
          <div>Attachment :&nbsp;
            <img style={{width:"10px"}} alt="attachment" src={"files/icon_clip.svg"} />
            &nbsp;{data.attachment}</div>
          }
        </div>
      ),
      level: 'success',
      autoDismiss: 0,
      position: 'br'
    });
  }

  sortEmail = (headers) => {
    const { emails } = this.props;
    for (let i in this.state.sort){
      let item = this.state.sort[i];    
      if (item.header === headers){
        switch(item.sortType){
          case '': this.setState(prevState => ({
                    sort: prevState.sort.map(
                    obj => (obj.header === headers ? Object.assign(obj, { sortType: "asc" }) : obj)
                    )
                  }));
                   emails.sort((a, b) => (a[item.name] > b[item.name]) ? 1 : -1);
          break;
          case 'asc' : this.setState(prevState => ({
                        sort: prevState.sort.map(
                        obj => (obj.header === headers ? Object.assign(obj, { sortType: "desc" }) : obj)
                        )
                       }));
                       emails.sort((a, b) => (a[item.name] < b[item.name]) ? 1 : -1);
          break;
          case 'desc' : this.setState(prevState => ({
                         sort: prevState.sort.map(
                         obj => (obj.header === headers ? Object.assign(obj, { sortType: "" }) : obj)
                         )
                        }));
                        emails.sort((a, b) => (a.date < b.date) ? 1 : -1);
          break;
          default:       
        }
      }
    }
    setTimeout(forceCheck, 1000);
  }

  render = () => {
    const { emails, pending } = this.props;
     
    let style = {
      Containers: {
        br: {
        width: "45%"
        }
      },
      NotificationItem:{
        DefaultStyle: {
          borderTop: "2px solid #666"
        }
      }
    }

    let headers = ['From', 'To', 'Subject', 'Date'];
    let headerClass = "header-name";

    return (
      <div className="emails-table">
        {(!pending && emails.length !== 0) &&
        <div>
          <div className="email-list">
            <div className="email-length">Results: {emails.length} mail(s)</div>
              <div className="email-list-header">
                {headers.map((header, i) => {
                  if (this.state.sort[i].sortType !== "") {
                    headerClass = "selected"
                  }else {
                    headerClass = "header-name"
                  }
                  return (
                    <span key={i} onClick={() => this.sortEmail(header)}>
                      <span className={headerClass}>{header}</span>
                      {this.state.sort[i].sortType === 'asc' && 
                        <img alt="icon-mail" className="icon-mail-sort" src={'files/icon_arrow01.svg'} />}
                      {this.state.sort[i].sortType === 'desc' && 
                        <img alt="icon-mail" className="icon-mail-sort rotate180" src={'files/icon_arrow01.svg'} />} 
                      {header !== 'Date' && <span className="header-border">|</span>} 
                    </span>
                  )
                })}
              </div>

              {emails.map(email => {
                let date;
                if(moment(email.date).format("YYYY/MM/DD") <= moment().subtract(1,'months').endOf('month').format("YYYY/MM/DD")){
                  date = moment(email.date).format("YYYY/MM/DD"); 
                }else if(moment().subtract(1,'day').endOf('day').format("YYYY/MM/DD hh:mm") > moment(email.date).format("YYYY/MM/DD hh:mm") &&
                  moment(email.date).format("YYYY/MM/DD hh:mm") > moment().subtract(1,'months').endOf('month').format("YYYY/MM/DD hh:mm")){
                  date = moment(email.date).format("MMM DD"); 
                }else if(moment(email.date).format("YYYY/MM/DD hh:mm:ss") > moment().subtract(1,'day').endOf('day').format("YYYY/MM/DD hh:mm:ss")){
                  date = moment(email.date).format("H:mm"); 
                }
            
                let emailTo = email.email_to.split(", ");
                let length = emailTo.length - 1;
                
                return (
                  <LazyLoad key={email.id} offset={100} once={true} height={100} 
                    placeholder={<div style={{paddingBottom:"100px"}}><LinearProgress /></div>}>
                   <div key= {email.id} onClick={() => this.openEmail(email)} className="email-container">
                     <div className="email-row">
                        <img alt="icon-mail" className="icon-mail" src={'files/icon_mail_sp.svg'} />
                        <div className="email-list-email">
                          <div className="email-list-from">{email.email_from}</div>
                          <div className="email-list-to">{email.email_to}</div>
                        </div>
                        <div className="email-list-date">
                          <div>
                            {email.attachment && <img alt="icon-mail" className="icon-mail" src={'files/icon_clip.svg'} />}
                            {date}
                            <img alt="icon-mail" className="icon-mail-arrow" src={'files/icon_arrow02.svg'} />
                          </div>
                          <div>{length !== 0 && <span className="email-to-length">+{length}</span>}</div>
                        </div>
                     </div>     
                     <div className="email-list-subject">{email.subject}</div>
                   </div>
                  </LazyLoad>
          )})}
          </div>
          <NotificationSystem ref={this.notificationSystem} style={style}/>
        </div>}
      </div>
    );
  }
}