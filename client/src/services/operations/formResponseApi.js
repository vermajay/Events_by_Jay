import { toast } from 'react-hot-toast'
import { apiConnector } from '../apiConnector'
import { formResponseEndpoints } from '../endpoints'

// Submit form response (no need for token)
export const submitFormResponse = async (eventId, fullName, email, phone, age, heardAbout, futureEventNotification) => {
  let result
  try {
    const response = await apiConnector(
      'POST',
      `${formResponseEndpoints.SUBMIT_FORM_API}/${eventId}`,
      { fullName, email, phone, age, heardAbout, futureEventNotification }
    )

    if (!response.data.success) {
      throw new Error('Could not submit registration')
    }
    result = response?.data?.data
    toast.success('Registration submitted successfully!')
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message)
    console.log('SUBMIT_FORM_RESPONSE_API ERROR............', error)
  }
  return result
}

// Get all form responses for an event
export const getFormResponsesByEvent = async (eventId, status, token) => {
  let result
  try {
    const url = status 
      ? `${formResponseEndpoints.GET_FORM_RESPONSES_API}/${eventId}?status=${status}`
      : `${formResponseEndpoints.GET_FORM_RESPONSES_API}/${eventId}`

    const response = await apiConnector(
      'GET',
      url,
      null,
      {
        Authorization: `Bearer ${token}`
      }
    )

    if (!response.data.success) {
      throw new Error('Could not fetch registrations')
    }
    result = response?.data?.data
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message)
    console.log('GET_FORM_RESPONSES_API ERROR............', error)
  }
  return result
}

// Get form response by ID
export const getFormResponseById = async (responseId, token) => {
  let result
  try {
    const response = await apiConnector(
      'GET',
      `${formResponseEndpoints.GET_FORM_RESPONSE_BY_ID_API}/${responseId}`,
      null,
      {
        Authorization: `Bearer ${token}`
      }
    )

    if (!response.data.success) {
      throw new Error('Could not fetch registration')
    }
    result = response?.data?.data
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message)
    console.log('GET_FORM_RESPONSE_BY_ID_API ERROR............', error)
  }
  return result
}

// Approve form response
export const approveFormResponse = async (responseId, token) => {
  let result
  try {
    const response = await apiConnector(
      'PUT',
      `${formResponseEndpoints.APPROVE_FORM_RESPONSE_API}/${responseId}`,
      null,
      {
        Authorization: `Bearer ${token}`
      }
    )

    if (!response.data.success) {
      throw new Error('Could not approve registration')
    }
    result = response?.data?.data
    toast.success('Registration approved successfully!')
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message)
    console.log('APPROVE_FORM_RESPONSE_API ERROR............', error)
  }
  return result
}

// Reject form response
export const rejectFormResponse = async (responseId, token) => {
  let result
  try {
    const response = await apiConnector(
      'PUT',
      `${formResponseEndpoints.REJECT_FORM_RESPONSE_API}/${responseId}`,
      null,
      {
        Authorization: `Bearer ${token}`
      }
    )

    if (!response.data.success) {
      throw new Error('Could not reject registration')
    }
    result = response?.data?.data
    toast.success('Registration rejected successfully!')
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message)
    console.log('REJECT_FORM_RESPONSE_API ERROR............', error)
  }
  return result
}

// Mark attendance
export const markAttendance = async (qrToken, token) => {
  let result
  try {
    const response = await apiConnector(
      'POST',
      formResponseEndpoints.MARK_ATTENDANCE_API,
      { qrToken },
      {
        Authorization: `Bearer ${token}`
      }
    )

    if (!response.data.success) {
      throw new Error('Could not mark attendance')
    }
    result = response?.data?.data
    toast.success('Attendance marked successfully!')
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message)
    console.log('MARK_ATTENDANCE_API ERROR............', error)
  }
  return result
}

// Get attendance stats
export const getAttendanceStats = async (eventId, token) => {
  let result
  try {
    const response = await apiConnector(
      'GET',
      `${formResponseEndpoints.GET_ATTENDANCE_STATS_API}/${eventId}`,
      null,
      {
        Authorization: `Bearer ${token}`
      }
    )

    if (!response.data.success) {
      throw new Error('Could not fetch attendance stats')
    }
    result = response?.data?.data
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message)
    console.log('GET_ATTENDANCE_STATS_API ERROR............', error)
  }
  return result
}