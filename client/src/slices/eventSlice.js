import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentEvent: null,
  eventsList: [],
  loading: false
}

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setCurrentEvent: (state, action) => {
      state.currentEvent = action.payload
    },
    setEventsList: (state, action) => {
      state.eventsList = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    }
  }
})

export const { setCurrentEvent, setEventsList, setLoading } = eventSlice.actions

export default eventSlice.reducer 