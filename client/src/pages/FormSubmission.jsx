import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getEventById } from '../services/operations/eventApi'
import { submitFormResponse } from '../services/operations/formResponseApi'
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaCheck, FaTimes } from 'react-icons/fa'

const FormSubmission = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    heardAbout: '',
    futureEventNotification: false
  })

  // Fetch event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true)
      try {
        // We don't need a token for public event viewing
        const eventData = await getEventById(eventId)
        if (eventData) {
          setEvent(eventData)
        } else {
          setError('Event not found or not available for registration')
        }
      } catch (error) {
        console.error('Error fetching event details:', error)
        setError('Could not load event details. Please try again later.')
      }
      setLoading(false)
    }

    fetchEventDetails()
  }, [eventId])

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'TBD'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const { fullName, email, phone, age, heardAbout, futureEventNotification } = formData
      const response = await submitFormResponse(
        eventId, 
        fullName, 
        email, 
        phone, 
        parseInt(age), 
        heardAbout, 
        futureEventNotification
      )

      if (response) {
        setSubmitted(true)
        // Reset form data
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          age: '',
          heardAbout: '',
          futureEventNotification: false
        })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setError('There was an error submitting your registration. Please try again.')
    }

    setSubmitting(false)
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  // Error state
  if (error && !event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{error}</h2>
        <p className="text-gray-600 mb-8">The event may not exist or registrations may be closed.</p>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
        >
          Return Home
        </button>
      </div>
    )
  }

  // Success state after submission
  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="mb-6 mx-auto flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
          <FaCheck className="text-green-600 text-4xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Registration Submitted!</h2>
        <p className="text-gray-600 mb-4">Thank you for registering for <span className="font-semibold">{event.title}</span>.</p>
        <p className="text-gray-600 mb-8">We will review your registration and send you a confirmation email with your ticket details if approved.</p>
        <p className="text-gray-800 mb-8">You can now close this page</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Event Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Register for {event.title}</h1>
          <p className="text-gray-600 mb-6">{event.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start">
              <FaCalendarAlt className="text-orange-500 mt-1 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-700">Date</h3>
                <p className="text-gray-800">
                  {formatDate(event.startDate)}
                  {event.endDate && event.startDate !== event.endDate && (
                    <span> - {formatDate(event.endDate)}</span>
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <FaMapMarkerAlt className="text-orange-500 mt-1 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-700">Location</h3>
                <p className="text-gray-800">{event.location || 'TBA'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <FaClock className="text-orange-500 mt-1 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-700">Registration Deadline</h3>
                <p className="text-gray-800">{formatDate(event.registrationDeadline)}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Registration Form</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
              <div className="flex">
                <FaTimes className="text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Your full name"
                />
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="your.email@example.com"
                />
              </div>
              
              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Your phone number"
                />
              </div>
              
              {/* Age */}
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Your age"
                />
              </div>
              
              {/* How they heard about the event */}
              <div>
                <label htmlFor="heardAbout" className="block text-sm font-medium text-gray-700 mb-1">
                  How did you hear about this event?
                </label>
                <select
                  id="heardAbout"
                  name="heardAbout"
                  value={formData.heardAbout}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select an option</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Friend/Family">Friend/Family</option>
                  <option value="Email">Email</option>
                  <option value="Website">Website</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              {/* Notifications for future events */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="futureEventNotification"
                    name="futureEventNotification"
                    type="checkbox"
                    checked={formData.futureEventNotification}
                    onChange={handleChange}
                    className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="futureEventNotification" className="font-medium text-gray-700">
                    Notify me about future events
                  </label>
                  <p className="text-gray-500">We'll send you notifications about upcoming events.</p>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    submitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {submitting ? 'Submitting...' : 'Submit Registration'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FormSubmission