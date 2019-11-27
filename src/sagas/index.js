import { all, fork } from "redux-saga/effects";

import emailsSaga from "./emails";

export default function* rootSaga() {
  yield all([
    fork(emailsSaga)
  ])
}