import { toast } from 'react-hot-toast'
import { apiConnector } from '../apiConnector'
import { eventEndpoints } from '../endpoints'

// Create a new event
export const createEvent = async (title, description, location, startDate, endDate, registrationDeadline, token) => {
  let result
  try {
    const response = await apiConnector(
      'POST',
      eventEndpoints.CREATE_EVENT_API,
      { title, description, location, startDate, endDate, registrationDeadline },
      {
        Authorization: `Bearer ${token}`
      }
    )

    if (!response.data.success) {
      throw new Error('Could not create event')
    }
    result = response?.data?.data
    toast.success('Event created successfully!')
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message)
    console.log('CREATE_EVENT_API ERROR............', error)
  }
  return result
}

// Get all events
export const getAllEvents = async (token) => {
  let result
  try {
    const response = await apiConnector(
      'GET',
      eventEndpoints.GET_ALL_EVENTS_API,
      null,
      {
        Authorization: `Bearer ${token}`
      }
    )

    if (!response.data.success) {
      throw new Error('Could not fetch events')
    }
    result = response?.data?.data
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message)
    console.log('GET_ALL_EVENTS_API ERROR............', error)
  }
  return result
}

// Get event by ID
export const getEventById = async (eventId, token) => {
  let result
  try {
    const response = await apiConnector(
      'GET',
      `${eventEndpoints.GET_EVENT_BY_ID_API}/${eventId}`,
      null,
      {
        Authorization: `Bearer ${token}`
      }
    )

    if (!response.data.success) {
      throw new Error('Could not fetch event')
    }
    result = response?.data?.data
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message)
    console.log('GET_EVENT_BY_ID_API ERROR............', error)
  }
  return result
}

// Update event
export const updateEvent = async (eventId, updateData, token) => {
  let result
  try {
    const response = await apiConnector(
      'PUT',
      `${eventEndpoints.UPDATE_EVENT_API}/${eventId}`,
      updateData,
      {
        Authorization: `Bearer ${token}`
      }
    )

    if (!response.data.success) {
      throw new Error('Could not update event')
    }
    result = response?.data?.data
    toast.success('Event updated successfully!')
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message)
    console.log('UPDATE_EVENT_API ERROR............', error)
  }
  return result
}

// Delete event
export const deleteEvent = async (eventId, token) => {
  let result
  try {
    const response = await apiConnector(
      'DELETE',
      `${eventEndpoints.DELETE_EVENT_API}/${eventId}`,
      null,
      {
        Authorization: `Bearer ${token}`
      }
    )

    if (!response.data.success) {
      throw new Error('Could not delete event')
    }
    result = response?.data?.message
    toast.success('Event deleted successfully!')
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message)
    console.log('DELETE_EVENT_API ERROR............', error)
  }
  return result
}

// Update event status
export const updateEventStatus = async (eventId, status, token) => {
  let result
  try {
    const response = await apiConnector(
      'PUT',
      `${eventEndpoints.UPDATE_EVENT_STATUS_API}/${eventId}`,
      { status },
      {
        Authorization: `Bearer ${token}`
      }
    )

    if (!response.data.success) {
      throw new Error('Could not update event status')
    }
    result = response?.data?.data
    toast.success('Event status updated successfully!')
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message)
    console.log('UPDATE_EVENT_STATUS_API ERROR............', error)
  }
  return result
}