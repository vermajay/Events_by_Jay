let BASE_URL
const MODE = import.meta.env.VITE_APP_MODE
if(MODE=='LOCAL'){
  BASE_URL = import.meta.env.VITE_APP_LOCAL;
}else if(MODE=='PRODUCTION'){
  BASE_URL = import.meta.env.VITE_APP_PRODUCTION;
}


// AUTH ENDPOINTS
export const authEndpoints = {
  LOGIN_API: BASE_URL + '/auth/login',
  RESETPASSTOKEN_API: BASE_URL + '/auth/reset-password-token',
  RESETPASSWORD_API: BASE_URL + '/auth/reset-password'
}

// EVENT ENDPOINTS
export const eventEndpoints = {
  CREATE_EVENT_API: BASE_URL + '/events/createEvent',
  GET_ALL_EVENTS_API: BASE_URL + '/events/getAllEvents', 
  GET_EVENT_BY_ID_API: BASE_URL + '/events/getEventById',
  UPDATE_EVENT_API: BASE_URL + '/events/updateEvent',
  DELETE_EVENT_API: BASE_URL + '/events/deleteEvent',
  UPDATE_EVENT_STATUS_API: BASE_URL + '/events/updateEventStatus'
}

// FORM RESPONSE ENDPOINTS
export const formResponseEndpoints = {
  SUBMIT_FORM_API: BASE_URL + '/form-responses/submitFormResponse',
  GET_FORM_RESPONSES_API: BASE_URL + '/form-responses/getFormResponsesByEvent',
  GET_FORM_RESPONSE_BY_ID_API: BASE_URL + '/form-responses/getFormResponseById',
  APPROVE_FORM_RESPONSE_API: BASE_URL + '/form-responses/approveFormResponse',
  REJECT_FORM_RESPONSE_API: BASE_URL + '/form-responses/rejectFormResponse',
  MARK_ATTENDANCE_API: BASE_URL + '/form-responses/markAttendance',
  GET_ATTENDANCE_STATS_API: BASE_URL + '/form-responses/getAttendanceStats'
}