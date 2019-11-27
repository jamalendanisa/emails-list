import { createRoutine } from "redux-saga-routines";

export const GET_EMAILS = "GET_EMAILS";
export const getEmails = createRoutine(GET_EMAILS);
