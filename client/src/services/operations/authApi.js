import { toast } from 'react-hot-toast'
import { setLoading, setToken } from '../../slices/authSlice'
import { apiConnector } from '../apiConnector'
import { authEndpoints } from '../endpoints'

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading('Loading...')
    dispatch(setLoading(true))

    try {
      const response = await apiConnector('POST', authEndpoints.LOGIN_API, {
        email,
        password
      })

      console.log('LOGIN API RESPONSE............', response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success('Login Successful')

      //set the token after login
      dispatch(setToken(response.data.token))

      //set token in local storage
      localStorage.setItem('token', JSON.stringify(response.data.token))

      navigate('/dashboard')
    } catch (error) {
      console.log('LOGIN API ERROR............', error)
      toast.error('Login Failed')
    }

    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    localStorage.removeItem('token')
    toast.success('Logged Out')
    navigate('/')
  }
}

export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    const toastId = toast.loading('Loading...')
    dispatch(setLoading(true))

    try {
      const response = await apiConnector('POST', authEndpoints.RESETPASSTOKEN_API, { email })

      console.log('RESET PASSWORD TOKEN API RESPONSE............', response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success('Reset Email Sent')

      setEmailSent(true)
    } catch (error) {
      console.log('RESET PASSWORD TOKEN API ERROR............', error)
      toast.error('Something went wrong')
    }

    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function resetPassword(token, password, confirmPassword, setEmailSent) {
  return async (dispatch) => {
    const toastId = toast.loading('Loading...')
    dispatch(setLoading(true))

    try {
      const response = await apiConnector('POST', authEndpoints.RESETPASSWORD_API, {
        token,
        password,
        confirmPassword
      })

      console.log('RESET PASSWORD API RESPONSE............', response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success('Password has been reset successfully')

      setEmailSent(true)
    } catch (error) {
      console.log('RESET PASSWORD API ERROR............', error)
      toast.error('Unable to reset password')
    }

    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}
