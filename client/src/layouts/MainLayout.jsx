import React from 'react'
import Sidebar from '../components/common/Sidebar'

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 overflow-auto h-screen">
        {children}
      </main>
    </div>
  )
}

export default MainLayout
