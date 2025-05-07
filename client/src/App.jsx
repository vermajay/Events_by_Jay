import { Routes, Route } from 'react-router-dom'

import MainLayout from './layouts/MainLayout.jsx'
import OpenRoute from './components/auth/OpenRoute.jsx'
import PrivateRoute from './components/auth/PrivateRoute.jsx'

import Login from './pages/auth/Login.jsx'
import ForgotPassword from './pages/auth/ForgotPassword.jsx'
import UpdatePassword from './pages/auth/UpdatePassword.jsx'

import Dashboard from './pages/Dashboard.jsx'
import FormSubmission from './pages/FormSubmission.jsx'
import QRCodeScanner from './pages/QRCodeScanner.jsx'
import Events from './pages/Events.jsx'
import EventDetails from './pages/EventDetails.jsx'
import Attendees from './pages/Attendees.jsx'

function App() {

  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">

        <Routes>

          {/* Public Routes */}
          <Route path="/" element={ <OpenRoute> <Login/> </OpenRoute> } />
          <Route path="forgot-password" element={ <OpenRoute> <ForgotPassword/> </OpenRoute> } />
          <Route path="update-password/:token" element={ <OpenRoute> <UpdatePassword/> </OpenRoute> } />
          
          {/* Private Routes */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard/>} />
                    <Route path="check-in" element={<QRCodeScanner/>} />
                    <Route path="events" element={<Events/>} />
                    <Route path="events/:eventId" element={<EventDetails/>} />
                    <Route path="events/:eventId/attendees" element={<Attendees/>} />
                  </Routes>
                </MainLayout>
              </PrivateRoute>
            }
          />

          {/* Both admin and user can visit this route */}
          <Route path="register/:eventId" element={<FormSubmission/>} />
        
        </Routes>
    </div>
  )
}

export default App