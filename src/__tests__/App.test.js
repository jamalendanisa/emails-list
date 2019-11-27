import React from "react";
import { shallow } from "enzyme";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";

import App from "../components/app/App";
import "../setupTests";

const mockStore = configureMockStore();
const store = mockStore({ emails: { 
  emails :[
    {id : 1,
     email_from : "rchattell0@unc.edu",
     email_to :"dstebbins0@reuters.com",
     subject : "Donec ut dolor.",
     body : "In congue. Etiam justo. Etiam pretium iaculis justo.",
     attachment : null,"date":"2019-03-30 08:41:15"}
   ],
  pending : false,
  startDate : null,
  endDate : null }});

it('renders without crashing', () => {
  shallow(<Provider store={store}>
    <App />
  </Provider>);
});