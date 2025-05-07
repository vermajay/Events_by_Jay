import { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { logout } from '../../services/operations/authApi'
import { getAllEvents } from '../../services/operations/eventApi'
import { setCurrentEvent, setEventsList } from '../../slices/eventSlice'
import { VscSignOut } from 'react-icons/vsc'
import { MdDashboard, MdCheckCircle, MdSettings, MdEvent, MdMenu, MdClose } from 'react-icons/md'
import { FaUsers } from 'react-icons/fa'

const Sidebar = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const { token } = useSelector((state) => state.auth)
  const { currentEvent } = useSelector((state) => state.event)
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768)
  const sidebarRef = useRef(null)
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768)
    }
    
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  
  // Handle clicks outside the sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && 
          !sidebarRef.current.contains(event.target) && 
          !isCollapsed && 
          window.innerWidth < 768) {
        setIsCollapsed(true)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isCollapsed])
  
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

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <>
      {/* Mobile Toggle Button - Fixed position */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button 
          onClick={toggleSidebar}
          className="bg-white p-2 rounded-md shadow-md text-gray-700 hover:bg-gray-100"
        >
          {isCollapsed ? <MdMenu size={24} /> : <MdClose size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={`
          flex overflow-hidden flex-col h-screen bg-white shadow-sm fixed md:sticky top-0 left-0 z-40
          transition-all duration-300 ease-in-out
          ${isCollapsed ? '-translate-x-full md:translate-x-0 w-0 md:w-[239px]' : 'translate-x-0 w-[239px]'}
        `}
      >
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
                onClick={() => {
                  if (!item.disabled) {
                    navigate(item.path)
                    if (window.innerWidth < 768) {
                      setIsCollapsed(true)
                    }
                  }
                }}
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
              onClick={() => {
                navigate('/events')
                if (window.innerWidth < 768) {
                  setIsCollapsed(true)
                }
              }}
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
    </>
  )
}

export default Sidebar