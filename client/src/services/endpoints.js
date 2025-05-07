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