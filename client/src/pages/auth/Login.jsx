import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { login } from '../../services/operations/authApi'
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai'

const LogIn = () => {
  const { loading } = useSelector((state) => state.auth)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)

  function changeHandler(event) {
    event.preventDefault()
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }))
  }

  function submitHandler(event) {
    event.preventDefault()
    dispatch(login(formData.email, formData.password, navigate))
  }

  return (
    <div className="grid min-h-screen place-items-center">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="flex justify-between items-center w-11/12 max-w-md mx-auto mb-20 py-12">
          <form onSubmit={submitHandler} className="flex flex-col w-full gap-y-4 mt-6">

            <div className="text-black font-semibold text-3xl mb-4">Login to your dashboard</div>

            <label className="w-full">
              <p className="text-[0.875rem] text-black mb-1 leading-[1.375rem]">
                Email Address
                <sup className="text-pink-600">*</sup>
              </p>
              <input
                className="w-full bg-white rounded-[0.5rem] text-black p-[12px] drop-shadow-[0_2px_rgba(255,255,255,0.25)]"
                required
                type="email"
                name="email"
                value={formData.email}
                placeholder="Enter email address"
                onChange={changeHandler}
              />
            </label>

            <label className="w-full relative">
              <p className="text-[0.875rem] text-black mb-1 leading-[1.375rem]">
                Password
                <sup className="text-pink-600">*</sup>
              </p>
              <input
                className="w-full bg-white rounded-[0.5rem] text-black p-[12px] drop-shadow-[0_2px_rgba(255,255,255,0.25)]"
                required
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                placeholder="Enter Password"
                onChange={changeHandler}
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
              <Link to="/forgot-password">
                <p className="text-sm mt-1 text-red-700 absolute right-0">Forgot Password</p>
              </Link>
            </label>

            <button className="bg-red-600 rounded-[8px] font-medium text-white px-[12px] py-[8px] mt-12 cursor-pointer">
              Log In
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default LogIn
