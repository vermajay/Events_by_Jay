import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { createPortal } from 'react-dom'
import { getEventById } from '../services/operations/eventApi'
import { 
  getFormResponsesByEvent, 
  getFormResponseById, 
  approveFormResponse, 
  rejectFormResponse 
} from '../services/operations/formResponseApi'
import { FaSearch, FaFilter, FaTimes, FaSortDown, FaCheck, FaEnvelope, FaPhone, FaCalendar } from 'react-icons/fa'

const Attendees = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const [event, setEvent] = useState(null)
  const [attendees, setAttendees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedAttendee, setSelectedAttendee] = useState(null)
  const [selectedAttendeeDetails, setSelectedAttendeeDetails] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'submittedAt', direction: 'desc' })
  const [actionLoading, setActionLoading] = useState(null)
  
  // Modal overlay ref
  const modalRef = useRef()
  
  // Fetch event details and attendees
  useEffect(() => {
    const fetchEventAndAttendees = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Fetch event details
        const eventData = await getEventById(eventId, token)
        if (eventData) {
          setEvent(eventData)
        } else {
          throw new Error('Event not found')
        }
        
        // Fetch attendees (form responses)
        const attendeesData = await getFormResponsesByEvent(eventId, statusFilter, token)
        if (attendeesData) {
          setAttendees(attendeesData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Could not load event details or attendees')
      }
      
      setLoading(false)
    }
    
    if (eventId && token) {
      fetchEventAndAttendees()
    }
  }, [eventId, token, statusFilter])
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }
  
  // Handle row click to view attendee details
  const handleAttendeeClick = async (attendeeId) => {
    setSelectedAttendee(attendeeId)
    
    try {
      const details = await getFormResponseById(attendeeId, token)
      if (details) {
        setSelectedAttendeeDetails(details)
        setShowModal(true)
      }
    } catch (error) {
      console.error('Error fetching attendee details:', error)
    }
  }
  
  // Close modal
  const closeModal = () => {
    setShowModal(false)
    setSelectedAttendeeDetails(null)
  }

  // Handle modal keyboard and body scroll events
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showModal) {
        closeModal()
      }
    }

    if (showModal) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden' // Prevent scrolling when modal is open
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'auto' // Re-enable scrolling when modal closes
    }
  }, [showModal])
  
  // Handle click outside modal
  const handleModalClick = (e) => {
    if (e.target === modalRef.current) {
      closeModal()
    }
  }
  
  // Handle approve action
  const handleApprove = async (responseId, e) => {
    e.stopPropagation() // Prevent row click
    setActionLoading(responseId)
    
    try {
      const result = await approveFormResponse(responseId, token)
      if (result) {
        // Update attendee in the list
        setAttendees(prevAttendees => 
          prevAttendees.map(attendee => 
            attendee._id === responseId ? { ...attendee, status: 'approved' } : attendee
          )
        )
      }
    } catch (error) {
      console.error('Error approving response:', error)
    }
    
    setActionLoading(null)
  }
  
  // Handle reject action
  const handleReject = async (responseId, e) => {
    e.stopPropagation() // Prevent row click
    setActionLoading(responseId)
    
    try {
      const result = await rejectFormResponse(responseId, token)
      if (result) {
        // Update attendee in the list
        setAttendees(prevAttendees => 
          prevAttendees.map(attendee => 
            attendee._id === responseId ? { ...attendee, status: 'rejected' } : attendee
          )
        )
      }
    } catch (error) {
      console.error('Error rejecting response:', error)
    }
    
    setActionLoading(null)
  }
  
  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }
  
  // Handle filter change
  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value)
  }
  
  // Handle sort
  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }
  
  // Filter and sort attendees
  const filteredAndSortedAttendees = () => {
    // First filter by search query
    let filtered = [...attendees]
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(attendee => 
        attendee.fullName.toLowerCase().includes(query) || 
        attendee.email.toLowerCase().includes(query)
      )
    }
    
    // Then sort
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }
    
    return filtered
  }
  
  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }
  
  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search attendees..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        
        <div className="flex items-center">
          <label htmlFor="statusFilter" className="mr-2 text-gray-700 font-medium">
            <FaFilter className="inline mr-1" /> Filter by Status
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
      
      {/* Attendees Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Checked In
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer flex items-center"
                  onClick={() => handleSort('submittedAt')}
                >
                  Registration Date
                  <FaSortDown className={`ml-1 ${sortConfig.key === 'submittedAt' && sortConfig.direction === 'asc' ? 'transform rotate-180' : ''}`} />
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedAttendees().length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No attendees found
                  </td>
                </tr>
              ) : (
                filteredAndSortedAttendees().map((attendee) => (
                  <tr 
                    key={attendee._id} 
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleAttendeeClick(attendee._id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{attendee.fullName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-600">{attendee.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${attendee.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          attendee.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}
                      >
                        {attendee.status.charAt(0).toUpperCase() + attendee.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-600">
                        {attendee.checkedInAt ? 'Yes' : 'No'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-600">{formatDate(attendee.submittedAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2" onClick={e => e.stopPropagation()}>
                        {attendee.status === 'pending' && (
                          <>
                            <button
                              onClick={(e) => handleApprove(attendee._id, e)}
                              disabled={actionLoading === attendee._id}
                              className="bg-[#6782AB] hover:bg-[#4F698A] text-white px-6 py-2 cursor-pointer rounded-md text-sm transition-colors font-semibold"
                            >
                              {actionLoading === attendee._id ? 'Processing...' : 'Approve'}
                            </button>
                            <button
                              onClick={(e) => handleReject(attendee._id, e)}
                              disabled={actionLoading === attendee._id}
                              className="bg-[#EF4444] hover:bg-[#D33F3F] text-white px-6 py-2 cursor-pointer rounded-md text-sm transition-colors font-semibold"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {attendee.status === 'rejected' && (
                          <button
                            onClick={(e) => handleApprove(attendee._id, e)}
                            disabled={actionLoading === attendee._id}
                            className="bg-[#6782AB] hover:bg-[#4F698A] text-white px-6 py-2 cursor-pointer rounded-md text-sm transition-colors font-semibold"
                          >
                            {actionLoading === attendee._id ? 'Processing...' : 'Approve'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Attendee Details Modal */}
      {showModal && selectedAttendeeDetails && createPortal(
        <div
          ref={modalRef}
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 50,
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}
          onClick={handleModalClick}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              width: '100%',
              maxWidth: '28rem',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
            onClick={e => e.stopPropagation()} // Prevent clicks inside modal from closing it
          >
            <div 
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                borderBottom: '1px solid #e5e7eb'
              }}
            >
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937' }}>Attendee Details</h2>
              <button
                onClick={closeModal}
                style={{ color: '#6b7280', cursor: 'pointer' }}
              >
                <FaTimes size={18} />
              </button>
            </div>

            <div 
              style={{
                flexGrow: 1,
                overflow: 'auto',
                padding: '1rem',
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none'
              }}
              className="scrollbar-hide"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>Full Name</h3>
                  <p style={{ color: '#1f2937', fontWeight: 500 }}>{selectedAttendeeDetails.fullName}</p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <FaEnvelope style={{ color: '#6b7280', marginTop: '0.25rem', marginRight: '0.5rem', flexShrink: 0 }} />
                  <div>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>Email</h3>
                    <p style={{ color: '#1f2937', wordBreak: 'break-word' }}>{selectedAttendeeDetails.email}</p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <FaPhone style={{ color: '#6b7280', marginTop: '0.25rem', marginRight: '0.5rem', flexShrink: 0 }} />
                  <div>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>Phone</h3>
                    <p style={{ color: '#1f2937' }}>{selectedAttendeeDetails.phone}</p>
                  </div>
                </div>
                
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>Age</h3>
                  <p style={{ color: '#1f2937' }}>{selectedAttendeeDetails.age}</p>
                </div>
                
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>How they heard about the event</h3>
                  <p style={{ color: '#1f2937' }}>{selectedAttendeeDetails.heardAbout || 'Not provided'}</p>
                </div>
                
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>Future notifications</h3>
                  <p style={{ color: '#1f2937' }}>{selectedAttendeeDetails.futureEventNotification ? 'Yes' : 'No'}</p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <FaCalendar style={{ color: '#6b7280', marginTop: '0.25rem', marginRight: '0.5rem', flexShrink: 0 }} />
                  <div>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>Registration Date</h3>
                    <p style={{ color: '#1f2937' }}>{new Date(selectedAttendeeDetails.submittedAt).toLocaleString()}</p>
                  </div>
                </div>
                
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>Status</h3>
                  <span style={{ 
                    display: 'inline-flex', 
                    padding: '0.125rem 0.5rem', 
                    borderRadius: '9999px', 
                    fontSize: '0.75rem', 
                    fontWeight: 600,
                    backgroundColor: selectedAttendeeDetails.status === 'approved' ? '#dcfce7' : 
                      selectedAttendeeDetails.status === 'rejected' ? '#fee2e2' : '#fef9c3',
                    color: selectedAttendeeDetails.status === 'approved' ? '#166534' : 
                      selectedAttendeeDetails.status === 'rejected' ? '#b91c1c' : '#854d0e'
                  }}>
                    {selectedAttendeeDetails.status.charAt(0).toUpperCase() + selectedAttendeeDetails.status.slice(1)}
                  </span>
                </div>
                
                {selectedAttendeeDetails.checkedInAt && (
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <FaCheck style={{ color: '#22c55e', marginTop: '0.25rem', marginRight: '0.5rem', flexShrink: 0 }} />
                    <div>
                      <h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>Checked In At</h3>
                      <p style={{ color: '#1f2937' }}>{new Date(selectedAttendeeDetails.checkedInAt).toLocaleString()}</p>
                    </div>
                  </div>
                )}
                
                {selectedAttendeeDetails.qrCode && (
                  <div>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>QR Code</h3>
                    <div style={{ marginTop: '0.5rem', backgroundColor: '#f9fafb', padding: '0.5rem', borderRadius: '0.375rem' }}>
                      <img src={selectedAttendeeDetails.qrCode} alt="QR Code" style={{ maxWidth: '100%', height: 'auto' }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div 
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '1rem',
                borderTop: '1px solid #e5e7eb'
              }}
            >
              <button
                onClick={closeModal}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  backgroundColor: '#e5e7eb',
                  color: '#1f2937',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

export default Attendees 