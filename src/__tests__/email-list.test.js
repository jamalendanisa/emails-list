import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import EmailList from '../components/email-list/email-list';
import '../setupTests';

const mockStore = configureMockStore();
const store = mockStore({ emails: { 
  emails :[
    {id : 1,
     email_from : "rchattell0@unc.edu",
     email_to :"dstebbins0@reuters.com",
     subject : "Donec ut dolor.",
     body : "In congue. Etiam justo. Etiam pretium iaculis justo.",
     attachment : null,"date":"2019-03-30 08:41:15"}],
     pending : false,
     startDate : null,
     endDate : null }});

it('renders without crashing', () => {
  shallow(<Provider store={store}>
    <EmailList />
  </Provider>);
});

it('should show loader when data is empty', () => {
  const store = mockStore({ emails: { emails :[], pending : true}});
  const wrapper = mount((<Provider store={store}>
    <EmailList />
  </Provider>
  ));
  expect(wrapper.find('.loader').length).toEqual(3);
});

it('should hide loader when data is not empty', () => {
  const wrapper = mount((<Provider store={store}>
    <EmailList />
  </Provider>
  ));
  expect(wrapper.find('.loader').length).toEqual(0);
});

it('should show dataempty logo when data is empty', () => {
  const store = mockStore({ emails: { emails :[], pending : false}});
  const wrapper = mount((<Provider store={store}>
    <EmailList />
  </Provider>
  ));

  expect(wrapper.find('.dataempty-img').length).toEqual(2);
});

it('should hide dataempty logo when data is not empty', () => {
  const wrapper = mount((<Provider store={store}>
    <EmailList />
  </Provider>
  ));
  expect(wrapper.find('.dataempty-img').length).toEqual(0);
});

it('should not show email list when data is empty', () => {
  const store = mockStore({ emails: { emails :[], pending : false}});
  const wrapper = mount((<Provider store={store}>
    <EmailList />
  </Provider>
  ));

  expect(wrapper.find('.email-list').length).toEqual(0);
});

it('should show email list when data is not empty', () => {
  const wrapper = mount((<Provider store={store}>
    <EmailList />
  </Provider>
  ));
  expect(wrapper.find('.email-list').length).not.toEqual(0);
});

 
 

