import { combineReducers } from '@reduxjs/toolkit'

import authReducer from '../slices/authSlice'
import eventReducer from '../slices/eventSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  event: eventReducer
})

export default rootReducer
