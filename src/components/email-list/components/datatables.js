import React,  { Component } from "react";
import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import moment from "moment";
import NotificationSystem from "react-notification-system";

import "../email-list.css";

export default class Datatables extends Component {

  notificationSystem = React.createRef();

  getMuiTheme = () => createMuiTheme({
    overrides: {
      MuiPaper: {
        root: {
          color: "#666"
        },
        elevation4: {
          boxShadow: "none"
        }
      },
      MuiTypography: {
        h6: {
          fontSize: "18px"
        }
      },
      MuiToolbar:{
        gutters: {
          paddingLeft: "0 !important"
        },
        regular: {
          minHeight: "48px !important"
        }
      },
      MUIDataTableToolbarSelect:{
        root: {
          zIndex: 0,
          paddingTop: 0,
          paddingBottom: 0
        }
      },
      MUIDataTableBodyRow: {
        hoverCursor: {
          color: "blue !important"
        }
      },
      MuiTableRow: {
        root: {
          cursor: "pointer"
        }
      },
      MuiTableCell: {
        root: {
          fontSize: "16px",
          fontWeight: "500",
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
          maxWidth: "200px",
          borderBottom: "2px solid rgba(224, 224, 224, 1) !important",
          padding: "9px"
        },
        head: {
          backgroundColor: "#F5F5F5 !important",
          color: "#666",
          borderBottom: "2px solid rgba(224, 224, 224, 1)",
          borderTop: "2px solid rgba(224, 224, 224, 1)"
        }
      },
      MUIDataTableHeadCell: {
        fixedHeader: {
          zIndex : 0
        }
      },
      MUIDataTableSelectCell: {
        headerCell: {
          zIndex : 0
        },
        fixedHeader: {
          zIndex : 0
        }
      }
    }
  });

  openEmail = (rowData) => {
    const { emails } = this.props;
    const notification = this.notificationSystem.current;
    let data = emails.find(x => x.id === rowData[0]);
    
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

  render = () => {
    const { emails, pending } = this.props;
    const columns = [
        { name: "id",
          label: "",
          options: {
            display: false,
            viewColumns: false
          }
        },
        { name: "email_from",
          label: "From",
          options: {
            sort: true,
          }
        },
        { name: "email_to",
          label: "To",
          options: {
            sort: true,
            customBodyRender: (value, tableMeta) => {
              return (
                <span style={{maxWidth: "200px"}}>{value}</span>
              )
            }
         }
        },
        { name: "",
          label: "",
          options: {
            filter: false,
            sort: false,
            viewColumns: false,
            customBodyRender: (value, tableMeta) => {
              let emailTo = tableMeta.rowData[2].split(", ")
              let length = emailTo.length - 1
              if (length !== 0){
                return (
                  <span className="email-to-length">+{length}</span>
                )
              }
            }
          }
        },
        { name: "subject",
          label: "Subject",
          options: {
            sort: true,
          }
        },
        { name: "attachment",
          label: "",
          options: {
            sort: false,
            viewColumns: false,
            customHeadRender: (tableMeta) => <td key ={5} style={{display:"table-cell"}} className="MuiTableCell-head"></td>,
            customBodyRender: (value) => {
              if(value !== null){
                return (
                  <img style={{width:"20px"}} alt="attachment" src={"files/icon_clip.svg"}/>
                )
              }
            }
          }
        },
        { name: "date",
          label: "Date",
          sort: true,
          options: {
            customBodyRender: (value) => {
              if(moment(value).format("YYYY/MM/DD") <= moment().subtract(1,'months').endOf('month').format("YYYY/MM/DD")){
                value = moment(value).format("YYYY/MM/DD"); 
              }else if(moment().subtract(1,'day').endOf('day').format("YYYY/MM/DD hh:mm") > moment(value).format("YYYY/MM/DD hh:mm") &&
              moment(value).format("YYYY/MM/DD hh:mm") > moment().subtract(1,'months').endOf('month').format("YYYY/MM/DD hh:mm")){
                value = moment(value).format("MMM DD"); 
              }else if(moment(value).format("YYYY/MM/DD hh:mm:ss") > moment().subtract(1,'day').endOf('day').format("YYYY/MM/DD hh:mm:ss")){
                value = moment(value).format("H:mm"); 
              }
              return (
                value
              );
            }
          }
        }
      ];
        
      const options = {
        filterType: "checkbox",
        fixedHeader : false,
        rowHover: true,
        filter: false,
        responsive: "scrollMaxHeight",
        selectableRows: "none",
        onRowClick: rowData => this.openEmail(rowData)
      };
     
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

      return (
        <div className="emails-table">
          {(!pending && emails.length !==0) &&
          <div>
           <MuiThemeProvider theme={this.getMuiTheme()}>
              <MUIDataTable
              title={"Results: "+emails.length+" mail(s)"}
              data={emails}
              columns={columns}
              options={options}
              />
            </MuiThemeProvider> 
            <NotificationSystem ref={this.notificationSystem} style={style}/>
          </div> }
        </div>
       );
  }
}