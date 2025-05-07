import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { resetPassword } from '../../services/operations/authApi'

import { HiOutlineArrowNarrowLeft } from 'react-icons/hi'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

const UpdatePassword = () => {
  const { token } = useParams()

  const [emailSent, setEmailSent] = useState(false)

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { loading } = useSelector((state) => state.auth)

  const dispatch = useDispatch()

  const submitHandler = (event) => {
    event.preventDefault()
    dispatch(resetPassword(token, password, confirmPassword, setEmailSent))
  }

  return (
    <div className="grid place-items-center min-h-screen">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="flex flex-col gap-4 mb-20 max-w-md">
          <p className="text-black font-semibold text-3xl">
            {!emailSent ? 'Choose new password' : 'Reset complete!'}
          </p>

          <p className="text-[#4B5563] text-lg leading-[26px]">
            {!emailSent
              ? "Almost done. Enter your new password and you're all set."
              : 'All done! We have sent an email to you to confirm'}
          </p>

          {!emailSent ? (
            <form onSubmit={submitHandler}>
              <label className="relative w-full">
                <p className="text-[0.875rem] text-black mb-1 leading-[1.375rem]">
                  New Password
                  <sup className="text-pink-200">*</sup>
                </p>

                <input
                  className="w-full bg-white rounded-[0.5rem] text-black p-[12px] drop-shadow-[0_2px_rgba(255,255,255,0.25)] mb-6"
                  required
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  placeholder="Enter New Password"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <span
                  className="absolute text-red-700 right-3 top-[38px] cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible fontSize={24} />
                  ) : (
                    <AiOutlineEye fontSize={24} />
                  )}
                </span>
              </label>
              <label className="relative w-full">
                <p className="text-[0.875rem] text-black mb-1 leading-[1.375rem]">
                  Confirm New Password
                  <sup className="text-pink-200">*</sup>
                </p>

                <input
                  className="w-full bg-white rounded-[0.5rem] text-black p-[12px] drop-shadow-[0_2px_rgba(255,255,255,0.25)] mb-6"
                  required
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={confirmPassword}
                  placeholder="Confirm New Password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <span
                  className="absolute text-red-700 right-3 -bottom-[4px] cursor-pointer"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? (
                    <AiOutlineEyeInvisible fontSize={24} />
                  ) : (
                    <AiOutlineEye fontSize={24} />
                  )}
                </span>
              </label>

              <button
                type="submit"
                className="bg-red-600 text-white w-full
                                            shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] hover:shadow-none 
                                            text-center text-[16px] px-6 py-3 rounded-md font-bold hover:scale-95 transition-all duration-200 cursor-pointer"
              >
                Reset Password
              </button>
            </form>
          ) : (
            <Link
              to="/"
              className="bg-red-600 text-white w-full
                                    shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] hover:shadow-none 
                                    text-center text-[16px] px-6 py-3 rounded-md font-bold hover:scale-95 transition-all duration-200 cursor-pointer"
            >
              Return to login
            </Link>
          )}

          {!emailSent && (
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
          )}
        </div>
      )}
    </div>
  )
}

export default UpdatePassword
