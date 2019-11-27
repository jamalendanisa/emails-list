import { handleActions } from "redux-actions";

import { getEmails } from "../actions";

const INITIAL_STATE = {
    emails: [],
    pending: true,
    error: false
}

const emails = handleActions(
  {
    [getEmails.REQUEST]: (state, { payload }) => ({
        ...state,
        startDate: payload.startDate,
        endDate: payload.endDate
    }),
    [getEmails.SUCCESS]: (state, { payload }) => ({
      ...state,
      emails: payload.emails,
      pending: false
    }),
    [getEmails.FAILURE]: state => ({
      ...state,
      error: true,
    })
  },
  INITIAL_STATE,
);

export default emails;