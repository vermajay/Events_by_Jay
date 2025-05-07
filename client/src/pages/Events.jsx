import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAllEvents, createEvent, deleteEvent } from '../services/operations/eventApi'
import { getAttendanceStats } from '../services/operations/formResponseApi'
import { setEventsList } from '../slices/eventSlice'
import { FaCalendarAlt, FaUsers, FaShareAlt, FaEllipsisH } from 'react-icons/fa'
import CreateEventModal from '../components/common/CreateEventModal'

const Events = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { eventsList } = useSelector((state) => state.event)
  const [loading, setLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [createData, setCreateData] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    registrationDeadline: ''
  })
  const [copySuccess, setCopySuccess] = useState(null)
  const [attendanceStats, setAttendanceStats] = useState({})

  // Fetch all events
  const fetchEvents = async () => {
    setLoading(true)
    try {
      const response = await getAllEvents(token)
      if (response) {
        dispatch(setEventsList(response))
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    }
    setLoading(false)
  }

  // Fetch attendance stats for all events
  const fetchAttendanceStats = async () => {
    try {
      if (!eventsList || eventsList.length === 0) return

      const statsPromises = eventsList.map(event => 
        getAttendanceStats(event._id, token)
      )
      
      const statsResults = await Promise.all(statsPromises)
      
      // Create an object with eventId as key and stats as value
      const statsMap = {}
      eventsList.forEach((event, index) => {
        if (statsResults[index]) {
          statsMap[event._id] = statsResults[index]
        }
      })
      
      setAttendanceStats(statsMap)
    } catch (error) {
      console.error('Error fetching attendance stats:', error)
    }
  }

  // Create an event
  const handleCreateEvent = async () => {
    setCreateLoading(true)
    try {
      const { title, description, location, startDate, endDate, registrationDeadline } = createData
      const response = await createEvent(title, description, location, startDate, endDate, registrationDeadline, token)
      if (response) {
        setShowCreateModal(false)
        setCreateData({
          title: '',
          description: '',
          location: '',
          startDate: '',
          endDate: '',
          registrationDeadline: ''
        })
        fetchEvents()
      }
    } catch (error) {
      console.error('Error creating event:', error)
    }
    setCreateLoading(false)
  }

  // Format date to human readable
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}`
  }

  // Handle share link copying
  const handleShareLink = (e, eventId) => {
    e.stopPropagation() // Prevent card click when clicking share button
    
    const link = `http://localhost:5173/register/${eventId}`
    navigator.clipboard.writeText(link)
      .then(() => {
        setCopySuccess(eventId)
        setTimeout(() => setCopySuccess(null), 2000)
      })
      .catch((err) => {
        console.error('Failed to copy link: ', err)
      })
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    if (eventsList && eventsList.length > 0) {
      fetchAttendanceStats()
    }
  }, [eventsList])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Events</h1>
          <p className="text-gray-600 mt-1">Manage all your events in one place</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-300"
        >
          <FaCalendarAlt />
          Create New Event
        </button>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : eventsList.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Events Found</h3>
          <p className="text-gray-600 mb-4">Create your first event to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventsList.map((event) => (
            <div 
              key={event._id} 
              className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white"
              onClick={() => navigate(`/events/${event._id}`)}
            >
              {/* Card Header with Status */}
              <div className="flex justify-between items-center p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">{event.title}</h2>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  event.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                  event.status === 'published' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
              </div>
              
              {/* Card Body */}
              <div className="p-4">
                <p className="text-gray-600 mb-2">{event.title}</p>
                <div className="flex items-center text-gray-500 text-sm">
                  <FaCalendarAlt className="mr-2" />
                  <span>Created {formatDate(event.createdAt)}</span>
                </div>
              </div>
              
              {/* Card Footer */}
              <div className="flex items-center justify-between p-4 border-t border-gray-100">
                <div className="flex items-center text-gray-700">
                  <FaUsers className="mr-2" />
                  <span>
                    {attendanceStats[event._id] 
                      ? `${attendanceStats[event._id].presentAttendees} Attendees`
                      : 'Loading...'}
                  </span>
                </div>
                <div>
                  <button 
                    className="flex items-center text-gray-600 hover:text-gray-800 relative cursor-pointer"
                    onClick={(e) => handleShareLink(e, event._id)}
                  >
                    <FaShareAlt />
                    <span className="ml-2">Share</span>
                    
                    {/* Copy Success Indicator */}
                    {copySuccess === event._id && (
                      <span className="absolute -top-8 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        Link copied!
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Event Modal */}
      <CreateEventModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        loading={createLoading}
        formData={createData}
        setFormData={setCreateData}
        onSubmit={handleCreateEvent}
      />
    </div>
  )
}

export default Events