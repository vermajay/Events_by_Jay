import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { logout } from '../../services/operations/authApi'
import { getAllEvents } from '../../services/operations/eventApi'
import { setCurrentEvent, setEventsList } from '../../slices/eventSlice'
import { VscSignOut } from 'react-icons/vsc'
import { MdDashboard, MdCheckCircle, MdSettings, MdEvent } from 'react-icons/md'
import { FaUsers } from 'react-icons/fa'

const Sidebar = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const { token } = useSelector((state) => state.auth)
  const { currentEvent } = useSelector((state) => state.event)
  
  // Fetch events for dropdown
  const fetchEvents = async () => {
    try {
      const response = await getAllEvents(token)
      if (response && response.length > 0) {
        // Store all events in Redux
        dispatch(setEventsList(response))
        
        // Set current event if not already set
        if (!currentEvent) {
          dispatch(setCurrentEvent(response[0]))
        }
      }
    } catch (error) {
      // handle error
    }
  }

  // Handle event change
  const handleEventChange = (eventId) => {
    const selectedEvent = events.find(event => event._id === eventId)
    if (selectedEvent) {
      dispatch(setCurrentEvent(selectedEvent))
      
      // If we're on a path that includes the event ID, update the URL to reflect the new event
      const currentPath = location.pathname
      
      if (currentPath.includes('/events/') && currentPath.includes('/attendees')) {
        // We're on the attendees page, navigate to the attendees page for the new event
        navigate(`/events/${eventId}/attendees`)
      } else if (currentPath.match(/^\/events\/[^/]+$/)) {
        // We're on the event details page, navigate to the details page for the new event
        navigate(`/events/${eventId}`)
      }
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  // Get events from Redux store for the dropdown
  const { eventsList: events = [] } = useSelector((state) => state.event)

  // Navigation items
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <MdDashboard className="w-4 h-4" /> },
    { 
      name: 'Attendees', 
      path: currentEvent ? `/events/${currentEvent._id}/attendees` : '/dashboard', 
      icon: <FaUsers className="w-4 h-4" />,
      disabled: !currentEvent
    },
    { name: 'Check-in', path: '/check-in', icon: <MdCheckCircle className="w-4 h-4" /> },
    { 
      name: 'Event Details', 
      path: currentEvent ? `/events/${currentEvent._id}` : '/dashboard', 
      icon: <MdSettings className="w-4 h-4" />,
      disabled: !currentEvent
    },
  ]
  
  // Check if a path is active - also handle nested routes like /events/:id/attendees
  const isActive = (path) => {
    if (!path || !currentEvent) return false
    
    // For attendees page
    if (path.includes('/attendees') && location.pathname.includes('/attendees')) {
      return true
    }
    
    // For event details page
    if (path.includes(`/events/${currentEvent._id}`) && 
        location.pathname === `/events/${currentEvent._id}`) {
      return true
    }
    
    // For other pages
    return location.pathname === path
  }

  return (
    <div className="flex overflow-hidden flex-col max-w-[239px] h-screen bg-white shadow-sm">
      <div className="flex z-10 flex-col items-start pr-4 pl-2 w-full text-xs font-medium leading-none pt-4">
        <div className="text-slate-600 text-sm">Current Event</div>
        <div className="flex gap-4 justify-between items-center px-3.5 py-2.5 mt-3 text-sm leading-none text-center bg-white rounded-md border border-solid border-slate-200 min-h-[40px] text-zinc-700 w-full">
          <select
            value={currentEvent?._id || ''}
            onChange={e => handleEventChange(e.target.value)}
            className="flex-1 bg-transparent outline-none"
          >
            {events.map(event => (
              <option key={event._id} value={event._id}>{event.title}</option>
            ))}
          </select>
        </div>
        <div className="mt-9 text-zinc-700">Management</div>
      </div>
      <div className="flex flex-col mt-2.5 w-full text-sm leading-none text-zinc-700">
        {navItems.map((item) => (
          <div key={item.name} className="flex flex-col mt-1 w-full font-medium whitespace-nowrap">
            <div 
              className={`flex overflow-hidden gap-4 items-center px-2 py-1.5 w-full rounded-md min-h-[32px] cursor-pointer transition-colors ${
                isActive(item.path) ? 'bg-zinc-100 text-zinc-900' : 'hover:bg-zinc-50'
              } ${item.disabled ? 'opacity-50 pointer-events-none' : ''}`}
              onClick={() => !item.disabled && navigate(item.path)}
            >
              {item.icon}
              <div className="overflow-hidden self-stretch my-auto">
                {item.name}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* All Events Section */}
      <div className="flex flex-col mt-8 w-full text-sm leading-none text-zinc-700 px-2">
        <div className="mb-2 text-zinc-700 font-medium">All Events</div>
        <div className="flex flex-col w-full font-medium whitespace-nowrap">
          <div
            className={`flex overflow-hidden gap-4 items-center px-2 py-1.5 w-full rounded-md min-h-[32px] cursor-pointer transition-colors ${
              location.pathname === '/events' ? 'bg-zinc-100 text-zinc-900' : 'hover:bg-zinc-50'
            }`}
            onClick={() => navigate('/events')}
          >
            <MdEvent className="w-4 h-4" />
            <div className="overflow-hidden self-stretch my-auto">
              All Events
            </div>
          </div>
        </div>
      </div>
      <div className="mt-auto mb-6 px-2">
        <button 
          onClick={() => dispatch(logout())}
          className="flex w-full items-center gap-2 px-2 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 hover:text-red-700 cursor-pointer"
        >
          <VscSignOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar