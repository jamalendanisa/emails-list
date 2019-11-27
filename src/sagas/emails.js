import { put, takeEvery } from "redux-saga/effects";
import { getEmails } from "../actions";
import moment from "moment";

import "../services/mockData.js";

export function* getEmailsRequest(action) {
  let data = window.Seed.emails.sort((a, b) => (a.date < b.date) ? 1 : -1);

  if (action.payload.startDate !== null && action.payload.endDate !== null){
    data = data.filter(emails => moment(new Date(emails.date)).format('YYYY/MM/DD') >= action.payload.startDate && 
    moment(new Date(emails.date)).format('YYYY/MM/DD') <= action.payload.endDate);
  }
  
  if (action.payload.startDate !== null && action.payload.endDate == null){
    let endDate = moment().format('YYYY/MM/DD');
    
    data = data.filter(emails => moment(new Date(emails.date)).format('YYYY/MM/DD') >= action.payload.startDate && 
    moment(new Date(emails.date)).format('YYYY/MM/DD') <= endDate); 
  }
  
  try {
    yield put(
      getEmails.success({
        emails: data,
      }),
    );
  } catch (error) {
    yield put(getEmails.failure(error.message));
  }
}

export default function* emailsSaga() {
  yield takeEvery(getEmails.REQUEST, getEmailsRequest);
}