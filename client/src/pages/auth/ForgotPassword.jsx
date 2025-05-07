import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { HiOutlineArrowNarrowLeft } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import { getPasswordResetToken } from '../../services/operations/authApi'

const ForgotPassword = () => {
  const { loading } = useSelector((state) => state.auth)

  const [emailSent, setEmailSent] = useState(false)
  const [email, setEmail] = useState('')

  const dispatch = useDispatch()

  const submitHandler = (event) => {
    event.preventDefault()
    dispatch(getPasswordResetToken(email, setEmailSent))
  }

  return (
    <div className="grid place-items-center min-h-screen">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="flex flex-col gap-4 mb-20 max-w-md">
          <p className="text-black font-semibold text-3xl">
            {!emailSent ? 'Reset your password' : 'Check email'}
          </p>

          <p className="text-[#4B5563] text-lg leading-[26px]">
            {!emailSent
              ? "Have no fear. We'll email you instructions to reset your password."
              : `We have sent the reset email to ${email}.`}
          </p>

          <form onSubmit={submitHandler}>
            {!emailSent && (
              <label className="w-full">
                <p className="text-[0.875rem] text-black mb-1 leading-[1.375rem]">
                  Email Address
                  <sup className="text-pink-600">*</sup>
                </p>
                <input
                  className="w-full bg-white rounded-[0.5rem] text-black p-[12px] drop-shadow-[0_2px_rgba(255,255,255,0.25)] mb-6"
                  required
                  type="email"
                  name="email"
                  value={email}
                  placeholder="Enter email address"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            )}

            <button
              type="submit"
              className="bg-red-600 text-white w-full
                                    shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] hover:shadow-none 
                                    text-center text-[16px] px-6 py-3 rounded-md font-bold hover:scale-95 transition-all duration-200 cursor-pointer"
            >
              {!emailSent ? 'Reset Password' : 'Resend Email'}
            </button>
          </form>

          <div className="flex justify-start">
            <Link
              to="/"
              className="text-black font-medium text-base hover:scale-95 transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <HiOutlineArrowNarrowLeft size={20} />
                <p>Back to login</p>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default ForgotPassword
