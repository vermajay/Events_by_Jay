import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { 
  getEventById, 
  updateEvent, 
  updateEventStatus, 
  deleteEvent 
} from '../services/operations/eventApi'
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaClock, 
  FaEdit, 
  FaTrash,
  FaTimes,
  FaArrowLeft
} from 'react-icons/fa'

const EventDetails = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    registrationDeadline: ''
  })

  // Fetch event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true)
      try {
        const eventData = await getEventById(eventId, token)
        if (eventData) {
          setEvent(eventData)
          setFormData({
            title: eventData.title,
            description: eventData.description || '',
            location: eventData.location || '',
            startDate: formatDateForInput(eventData.startDate),
            endDate: formatDateForInput(eventData.endDate),
            registrationDeadline: formatDateForInput(eventData.registrationDeadline)
          })
        }
      } catch (error) {
        console.error('Error fetching event details:', error)
      }
      setLoading(false)
    }

    fetchEventDetails()
  }, [eventId, token])

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Format date for input fields (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toISOString().split('T')[0]
  }

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Handle status change
  const handleStatusChange = async (newStatus) => {
    setUpdateLoading(true)
    try {
      const updatedEvent = await updateEventStatus(eventId, newStatus, token)
      if (updatedEvent) {
        setEvent({
          ...event,
          status: newStatus
        })
      }
    } catch (error) {
      console.error('Error updating event status:', error)
    }
    setUpdateLoading(false)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setUpdateLoading(true)
    try {
      const updatedEvent = await updateEvent(eventId, formData, token)
      if (updatedEvent) {
        setEvent(updatedEvent)
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error updating event:', error)
    }
    setUpdateLoading(false)
  }

  // Handle event deletion
  const handleDelete = async () => {
    setUpdateLoading(true)
    try {
      const result = await deleteEvent(eventId, token)
      if (result) {
        navigate('/events')
      }
    } catch (error) {
      console.error('Error deleting event:', error)
    }
    setUpdateLoading(false)
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  // Error state - no event found
  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold text-gray-800">Event not found</h2>
        <p className="text-gray-600 mt-2">The event you're looking for doesn't exist or you don't have access.</p>
        <button 
          onClick={() => navigate('/events')}
          className="mt-6 flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
        >
          <FaArrowLeft /> Back to Events
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/events')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <FaArrowLeft /> Back to Events
      </button>

      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
            <span className={`px-3 py-1 text-sm rounded-full ${
              event.status === 'draft' ? 'bg-gray-100 text-gray-800' :
              event.status === 'published' ? 'bg-green-100 text-green-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          </div>
          <p className="text-gray-600 mt-1">Created on {formatDate(event.createdAt)}</p>
        </div>
        
        {!isEditing && (
          <div className="flex gap-3">
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              disabled={updateLoading}
            >
              <FaEdit /> Edit
            </button>
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
              disabled={updateLoading}
            >
              <FaTrash /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Status Management Section */}
      {!isEditing && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Event Status</h2>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => handleStatusChange('draft')}
              className={`px-4 py-2 rounded-md ${
                event.status === 'draft' 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              disabled={updateLoading || event.status === 'draft'}
            >
              Draft
            </button>
            <button 
              onClick={() => handleStatusChange('published')}
              className={`px-4 py-2 rounded-md ${
                event.status === 'published' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              disabled={updateLoading || event.status === 'published'}
            >
              Published
            </button>
            <button 
              onClick={() => handleStatusChange('completed')}
              className={`px-4 py-2 rounded-md ${
                event.status === 'completed' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              disabled={updateLoading || event.status === 'completed'}
            >
              Completed
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            {event.status === 'draft' && 'Event is in draft mode. Attendees cannot register yet.'}
            {event.status === 'published' && 'Event is published. Attendees can now register.'}
            {event.status === 'completed' && 'Event is marked as completed.'}
          </p>
        </div>
      )}

      {/* Event Details Section */}
      {!isEditing ? (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Event Details</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-gray-600 text-sm mb-1">Description</h3>
              <p className="text-gray-900">{event.description}</p>
            </div>

            <div className="flex items-center">
              <FaMapMarkerAlt className="text-gray-500 mr-2" />
              <div>
                <h3 className="text-gray-600 text-sm">Location</h3>
                <p className="text-gray-900">{event.location}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center">
                <FaCalendarAlt className="text-gray-500 mr-2" />
                <div>
                  <h3 className="text-gray-600 text-sm">Start Date</h3>
                  <p className="text-gray-900">{formatDate(event.startDate)}</p>
                </div>
              </div>

              <div className="flex items-center">
                <FaCalendarAlt className="text-gray-500 mr-2" />
                <div>
                  <h3 className="text-gray-600 text-sm">End Date</h3>
                  <p className="text-gray-900">{formatDate(event.endDate)}</p>
                </div>
              </div>

              <div className="flex items-center">
                <FaClock className="text-gray-500 mr-2" />
                <div>
                  <h3 className="text-gray-600 text-sm">Registration Deadline</h3>
                  <p className="text-gray-900">{formatDate(event.registrationDeadline)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Edit Form
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Edit Event</h2>
            <button 
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={18} />
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Name *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[100px]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Deadline *
                </label>
                <input
                  type="date"
                  name="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                disabled={updateLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                disabled={updateLoading}
              >
                {updateLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Delete Event</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this event? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                disabled={updateLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={updateLoading}
              >
                {updateLoading ? 'Deleting...' : 'Delete Event'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventDetails