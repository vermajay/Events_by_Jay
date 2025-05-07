import { FaTimes } from 'react-icons/fa'
import { useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

const CreateEventModal = ({
  show,
  onClose,
  loading,
  formData,
  setFormData,
  onSubmit
}) => {
  const modalRef = useRef()

  const handleModalClick = (e) => {
    if (e.target === modalRef.current) {
      onClose()
    }
  }

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (show) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden' // Prevent scrolling when modal is open
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'auto' // Re-enable scrolling when modal closes
    }
  }, [show, onClose])

  if (!show) return null

  // Use a portal to render the modal outside the normal DOM hierarchy
  return createPortal(
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
            padding: '1.5rem',
            borderBottom: '1px solid #e5e7eb'
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1f2937' }}>Add New Event</h2>
          <button
            onClick={onClose}
            style={{ color: '#6b7280', cursor: 'pointer' }}
          >
            <FaTimes size={24} />
          </button>
        </div>
        <div 
          style={{
            flexGrow: 1,
            overflow: 'auto',
            padding: '1.5rem'
          }}
          className="scrollbar-hide"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>
                Event Name
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  outline: 'none'
                }}
                placeholder="Annual Conference 2024"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  outline: 'none',
                  minHeight: '5rem'
                }}
                placeholder="Enter a brief description of the event"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  outline: 'none'
                }}
                placeholder="Convention Center, Bangalore"
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flexGrow: 1 }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    outline: 'none'
                  }}
                />
              </div>
              <div style={{ flexGrow: 1 }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={e => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>
                Registration Deadline
              </label>
              <input
                type="date"
                value={formData.registrationDeadline}
                onChange={e => setFormData(prev => ({ ...prev, registrationDeadline: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>
        <div 
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem',
            padding: '1.5rem',
            borderTop: '1px solid #e5e7eb'
          }}
        >
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              backgroundColor: 'white',
              color: '#374151',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              ':hover': {
                backgroundColor: '#f3f4f6'
              }
            }}
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              backgroundColor: loading ? '#d1d5db' : '#f97316',
              color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              ':hover': {
                backgroundColor: loading ? '#d1d5db' : '#ea580c'
              }
            }}
          >
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default CreateEventModal 